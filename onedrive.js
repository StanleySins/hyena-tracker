const graph = 'https://graph.microsoft.com/v1.0';
const scopes = ['https://graph.microsoft.com/Files.ReadWrite.AppFolder'];
const msalUrl = 'https://cdn.jsdelivr.net/npm/@azure/msal-browser@4.25.0/+esm';

async function graphRequest(token, path, options = {}) {
  const response = await fetch(graph + path, {
    ...options,
    cache: 'no-store',
    headers: {Authorization: 'Bearer ' + token, ...options.headers}
  });
  if (response.ok || (options.method === undefined && response.status === 404)) {
    return response;
  }
  throw Error('Microsoft Graph returned HTTP ' + response.status + '.');
}

export async function createOneDrive(clientId) {
  const {PublicClientApplication, InteractionRequiredAuthError} = await import(msalUrl);
  const redirectUri = new URL('./', location.href).href;
  const auth = new PublicClientApplication({
    auth: {
      clientId,
      authority: 'https://login.microsoftonline.com/consumers',
      redirectUri,
      postLogoutRedirectUri: redirectUri,
      navigateToLoginRequestUrl: false
    },
    cache: {cacheLocation: 'sessionStorage'}
  });
  await auth.initialize();
  const result = await auth.handleRedirectPromise();
  if (result?.account) auth.setActiveAccount(result.account);

  return {
    account: () => auth.getActiveAccount(),
    connect: account => account
      ? auth.acquireTokenRedirect({account, scopes})
      : auth.loginRedirect({scopes, prompt:'select_account'}),
    disconnect: account => auth.logoutRedirect({account}),
    needsSignIn: error => error instanceof InteractionRequiredAuthError,
    token: async account => (await auth.acquireTokenSilent({account, scopes})).accessToken,

    async filePath(token) {
      const folder = await graphRequest(token, '/me/drive/special/approot');
      if (!folder.ok) throw Error('The OneDrive app folder is unavailable.');
      const {id} = await folder.json();
      if (!id) throw Error('The OneDrive app folder has no ID.');
      return '/me/drive/items/' + encodeURIComponent(id) + ':/hyena-tracker.json';
    },

    async metadata(token, path) {
      const response = await graphRequest(token, path + '?%24select=id,eTag,%40microsoft.graph.downloadUrl');
      if (response.status === 404) return null;
      const item = await response.json();
      if (!item.id || !item.eTag) throw Error('OneDrive returned incomplete file metadata.');
      return item;
    },

    async download(item) {
      const url = item['@microsoft.graph.downloadUrl'];
      if (!url) throw Error('OneDrive did not return a download URL.');
      const response = await fetch(url, {cache:'no-store', credentials:'omit', referrerPolicy:'no-referrer'});
      if (!response.ok) throw Error('OneDrive download returned HTTP ' + response.status + '.');
      return response.json();
    },

    async upload(token, path, payload, existing) {
      const target = existing
        ? '/me/drive/items/' + encodeURIComponent(existing.id) + '/content'
        : path + ':/content?%40microsoft.graph.conflictBehavior=fail';
      const headers = {'Content-Type':'application/json'};
      if (existing) headers['If-Match'] = existing.eTag;
      const response = await graphRequest(token, target, {method:'PUT', headers, body:payload});
      const {eTag} = await response.json();
      if (!eTag) throw Error('OneDrive did not return a version for the saved file.');
      return eTag;
    }
  };
}
