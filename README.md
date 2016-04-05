# ghify-request-options

[![NPM version](https://img.shields.io/npm/v/ghify-request-options.svg)](https://www.npmjs.com/package/ghify-request-options)
[![Build Status](https://travis-ci.org/shinnn/ghify-request-options.svg?branch=master)](https://travis-ci.org/shinnn/ghify-request-options)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/ghify-request-options.svg)](https://coveralls.io/r/shinnn/ghify-request-options)
[![devDependency Status](https://david-dm.org/shinnn/ghify-request-options/dev-status.svg)](https://david-dm.org/shinnn/ghify-request-options#info=devDependencies)

Create a [Request](https://www.npmjs.com/package/request) option object that helps to interact with the [GitHub API](https://developer.github.com/v3/)

```javascript
const ghifyRequestOptions = require('ghify-request-options');

ghifyRequestOptions({method: 'POST'});
/* => {
	 method: 'POST',
	 json: true,
     headers: {
       accept: 'application/vnd.github.v3+json',
       'user-agent': 'https://github.com/shinnn/ghify-request-options'
     },
     baseUrl: 'https://api.github.com'
   }
*/ 
```

## Installation

[Use npm.](https://docs.npmjs.com/cli/install)

```
npm install ghify-request-options
```

## API

```javascript
const ghifyRequest = require('ghify-request-options');
```

### ghifyRequestOptions([*options*])

*options*: `Object` ([`Request` options](https://github.com/request/request#requestoptions-callback) to overwrite the defaults, and [`token` option](https://github.com/shinnn/ghify-request-options#optionstoken))  
Return: `Object` (new `Request` options)

It returns [`Request`](https://github.com/request/request) options that defaults to the [GitHub-API](https://developer.github.com/v3/#overview)-friendly settings.

```javascript
ghifyRequestOptions();
/* => {
	 json: true,
     headers: {
       accept: 'application/vnd.github.v3+json',
       'user-agent': 'https://github.com/shinnn/ghify-request-options'
     },
     baseUrl: 'https://api.github.com'
   }
*/ 
```

#### options.token

Type: `String`  
Default: `process.env.GITHUB_TOKEN`

Use specific [GitHub access token](https://github.com/blog/1509-personal-api-tokens).

```javascript
ghifyRequestOptions({
  token: 'xxxxxxxxxxx' // your personal access token
});
/* => {
     json: true,
     token: 'xxxxxxx',
     headers: {
       accept: 'application/vnd.github.v3+json',
       'user-agent': 'https://github.com/shinnn/ghify-request-options',
       authorization: 'token xxxxxxxxxxx'
     },
     baseUrl: 'https://api.github.com'
   }
*/
```

#### options.baseUrl

Type: `String`  
Default: `process.env.GITHUB_ENDPOINT` if available, otherwise `'https://api.github.com'`

Use the different [endpoint](https://developer.github.com/v3/#root-endpoint) to support [Github enterprise](https://enterprise.github.com/).

## License

Copyright (c) 2015 - 2016 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT License](./LICENSE).
