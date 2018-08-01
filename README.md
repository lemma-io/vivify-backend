

# Vivify Serverless Backend with AWS Lambda and Express.js

This is a simple backend project providing authorization and authentication to Spotify's Web API. Built using Express.js to deploy on AWS Lambda using the Serverless framework. You will need to have your own app registered with Spotify and your own AWS account setup your Lambda functions.

### Getting Started

You will need:

1. [Register your app](https://developer.spotify.com/documentation/general/guides/app-settings/#register-your-app) - need a client id, secret and redirect URI
2. Node.js - version `6.5.0` or later
3. Severless - run `npm install -g serverless` to install
4. AWS CLI - `pip install awscli --upgrade --user` more info here [Install AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/installing.html)
5. AWS account - Create and configure your [AWS Profiles](https://serverless.com/framework/docs/providers/aws/guide/credentials#using-aws-profiles)

### Installing

If you are rolling your own backend make sure to have your app registered with Spotify. They have a great [Quick Start Guide](https://developer.spotify.com/documentation/android-sdk/quick-start/) documenting how to create your first app with Spotify. You will need your App's `Client ID`, `Client Secret`, and `Callback URI`

Now that your App is registered and AWS account is configured you can update the `serverless.yml` with your details. 

1. Add your AWS profile configured above

```yaml
provider:
  name: aws
  runtime: nodejs6.10
  stage: prod
  region: us-east-1
  profile: add-your-profile
```

2. Configure your environment variables. We are keeping our keys private using AWS SSM and calling them through the process environments. You need to define a `spotify_secret` and a `spotify_id`

   - Create stored parameters using the CLI

     ```bash
     aws ssm put-parameter --name spotify_secret --type String --value F6tcdxJ2cxhNf1NeSifoa8E4g6N0fZTR
     ```

   - Define them in serverless.yml

     ```yaml
     environment:
           SPOTIFY_ID: ${ssm:spotify_id}
           SPOTIFY_SECRET: ${ssm:spotify_secret}
     ```

   - add them to the project

   - ```javascript
     const client_secret = process.env.SPOTIFY_SECRET; // Your secret
     ```

Deploy your function

```bash
$ sls deploy
... snip ...
Service Information
service: vivify-backend-application
stage: prod
region: us-east-1
stack: vivify-backend-application-prod
api keys:
  None
endpoints:
  ANY - https://bl4r0gjjv5.execute-api.us-east-1.amazonaws.com/prod
  ANY - https://bl4r0gjjv5.execute-api.us-east-1.amazonaws.com/prod/{proxy+}
functions:
  app: my-express-application-dev-app
```



You can find your client id and secret in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/applications)

More info on the [Spotify Web API Console](https://developer.spotify.com/console/)

## API Endpoints

This project uses the Authorization Code Flow.

* ### GET **/login/**

  Request user authorization

  ```bash
  curl https://your-aws-url.execute-api.us-east-1.amazonaws.com/prod/login
  ```

* ### GET **/getTokens/**

  Request refresh and access tokens

* ```bash
  curl https://your-aws-url.execute-api.us-east-1.amazonaws.com/prod/getTokens/{code}
  ```

* ### GET **/refresh_token/**

  Request a refreshed access token

  ``` bash
  curl https://your-aws-url.execute-api.us-east-1.amazonaws.com/prod/refresh_token/{token}
  ```

  

## Built With

* AWS Lambda
* [Express.js](https://github.com/expressjs/express)
* [Severless Framework](https://github.com/serverless/serverless)

## References

[Spotify Authorization Flow](https://developer.spotify.com/documentation/general/guides/authorization-guide/)

[Express + Serverless](https://serverless.com/blog/serverless-express-rest-api/) 

[AWS CLI Credentials Setup](https://serverless.com/framework/docs/providers/aws/guide/credentials#setup-with-the-aws-cli)