import axionsInstance from './api';

const logError = (storeSlug, workspace, attributePath, error) => {
  const browser = typeof navigator !== 'undefined'
    ? navigator.userAgent
    : 'server-side-error';

  const message = `Workspace: ${workspace}\nBrowser: ${browser}\nMessage: ${
    error.message
  }\n${error.stack != null ? error.stack : ''}`;

  axionsInstance.post(`/${storeSlug}/log`, {
    message,
    url: attributePath,
  });
};

export default logError;
