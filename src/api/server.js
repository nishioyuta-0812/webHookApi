'use strict'

const twitterApi = require('twitter-api-v2');
const express = require('express');
const serverless = require('serverless-http'); 
const app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const router = express.Router();
const sleep = waitTime => new Promise( resolve => setTimeout(resolve, waitTime) );

router.get('/v1/systems/ping', (req, res) => {
  res.send('pong');
});

router.post('/v1/tweet', async (req, res) => {

  const entityId = req.body['entityId'];
  const twitterClient = new twitterApi.TwitterApi({
    appKey: `${process.env.APP_KEY}`,
    appSecret: `${process.env.APP_SECRET}`,
    accessToken: `${process.env.ACCESS_TOKEN}`,
    accessSecret: `${process.env.ACCESS_SECRET}`
  });

  await sleep(63000);

  const result =  await twitterClient.v2.tweet(`ブログを更新しました！\n https://nishiyu.net/articles/${entityId}`);
  
  res.send(result.data.id);
});

app.use('/.netlify/functions/server', router); //ルーティング追加
module.exports = app; //追加
module.exports.handler = serverless(app);