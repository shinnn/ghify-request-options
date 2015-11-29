'use strict';

const url = require('url');

const invalidURIErrMsg = ' `baseUrl` option must be a fully qualified URI string used as the base URL.';

module.exports = function ghifyRequestOptions(options) {
  options = Object.assign({json: true}, options);

  options.headers = Object.assign({
    accept: 'application/vnd.github.v3+json',
    'user-agent': 'https://github.com/shinnn/ghify-request-options'
  }, options.headers);

  if (options.token && typeof options.token !== 'string') {
    throw new TypeError(
      String(options.token) +
      ' is not a string. `token` option must be a string of a Github personal access token.' +
      ' https://github.com/settings/tokens/'
    );
  }

  const token = options.token || process.env.GITHUB_TOKEN;

  if (token) {
    options.headers.authorization = `token ${token}`;
  }

  if (!options.baseUrl) {
    if (process.env.GITHUB_ENDPOINT) {
      options.baseUrl = process.env.GITHUB_ENDPOINT;
    } else {
      options.baseUrl = 'https://api.github.com';
    }
  } else {
    if (typeof options.baseUrl !== 'string') {
      throw new TypeError(`${options.baseUrl} is not a string.${invalidURIErrMsg}`);
    }

    if (!url.parse(options.baseUrl).protocol) {
      throw new TypeError(`${options.baseUrl} is not a URI.${invalidURIErrMsg}`);
    }
  }

  return options;
};
