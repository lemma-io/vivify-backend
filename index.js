const serverless = require('serverless-http');
const express = require('express');
const request = require('request');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');

const stateKey = 'spotify_auth_state';
const client_id = process.env.SPOTIFY_ID; // Your client id
const client_secret = process.env.SPOTIFY_SECRET; // Your secret
const redirect_uri = 'vivify://callback'; // Your redirect uri
const app = express()

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/login', function(req, res) {
  var scope = 'user-read-private user-read-email playlist-read-private playlist-read-collaborative';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri
    }));
});

app.get('/getTokens/:code', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.params.code;

    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token
        var refresh_token = body.refresh_token;

        // we can also pass the token to the browser to make requests from there
        res.send({
          access_token: access_token,
          'refresh_token': refresh_token,
          'expires_in': body.expires_in
        });
      } else {
        res.send({
          error: 'invalid_token'
        });
      }
    });
});

app.get('/refresh_token/:refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.params.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token,
        'expires_in': body.expires_in
      });
    }
  });
});

var port = Number(process.env.PORT || 3000);
app.listen(port);

module.exports.handler = serverless(app);
