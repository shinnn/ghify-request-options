'use strict';

const http = require('http');

const ghifyRequestOptions = require('.');
const request = require('request');
const {test} = require('tape');

test('ghifyRequestOptions()', t => {
  t.equal(ghifyRequestOptions.name, 'ghifyRequestOptions', 'should have a function name.');

  t.throws(
    () => ghifyRequestOptions({token: 1}),
    /TypeError.*1 is not a string\. `token` option must be a string of a Github personal access token\./,
    'should throw a type error when `token` option is not a string.'
  );

  t.throws(
    () => ghifyRequestOptions({baseUrl: 1}),
    /TypeError.*1 is not a string\. `baseUrl` option must be a fully qualified URI string used as the base URL\./,
    'should throw a type error when `baseUrl` option is not a string.'
  );

  t.throws(
    () => ghifyRequestOptions({baseUrl: 'a'}),
    /TypeError.*a is not a URI\. `baseUrl` option must be a fully qualified URI string used as the base URL\./,
    'should throw a type error when `baseUrl` option is not a URI.'
  );

  t.end();
});

test('request with the options created by ghifyRequestOptions()', t => {
  t.plan(6);

  request('users/shinnn', ghifyRequestOptions(), (err, response, body) => {
    t.strictEqual(err, null, 'should send a request to api.github.com without base URL.');
    t.strictEqual(body.login, 'shinnn', 'should get the response as JSON object.');
  });

  let count = 0;

  http.createServer(function(req, response) {
    if (req.method === 'POST') {
      req.once('data', data => {
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify({
          token: req.headers.authorization.replace('token ', ''),
          ua: req.headers['user-agent'],
          body: data.toString()
        }));
      });
    } else {
      response.writeHead(200, {'Content-Type': 'application/json'});
      response.end(`This is not JSON${req.headers.authorization.replace('token ', '')}`);
    }

    if (++count === 2) {
      this.close();
    }
  }).listen(8124);

  request('/', ghifyRequestOptions({
    baseUrl: 'http://localhost:8124',
    token: 'a',
    headers: {'User-Agent': 'b'},
    method: 'post',
    json: false,
    body: '1'
  }), (err, response, body) => {
    t.strictEqual(err, null, 'should send a request with the given method.');
    t.strictEqual(
      body,
      '{"token":"a","ua":"b","body":"1"}',
      'should prioritize user-provided options.'
    );
  });

  process.env.GITHUB_TOKEN = '!';
  process.env.GITHUB_ENDPOINT = 'http://localhost:8124/';

  request(ghifyRequestOptions({uri: '/', baseUrl: null}), (err, response, body) => {
    t.strictEqual(err, null, 'should not fail even if the response is not JSON.');
    t.strictEqual(
      body,
      'This is not JSON!',
      'should receive contents as a plain text when the response is not JSON.'
    );
  });
});
