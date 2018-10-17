# ULOGS BOT

Steem Bot To Enable And Grow Ulogs.org Communities & Ulog-subtags.
Imported from https://github.com/superoo7/cn-malaysia.

Current Version: v0.0.1

License: MIT

## Feature
- Whitelisted list.
- A data.json is generated to store data of a post in case the bot had already commented.

## Developer notes

Library used

* 'steem'
* 'dsteem'
* 'typescript'
* 'dotenv'
* 'nodemon'

## How to use it

Create a `.env` to store your posting key and username.

```
ACCOUNT_KEY=POSTING_KEY_HEREgit 
ACCOUNT_NAME=STEEM_NAME
```

Change variables in `config.ts`

Starting the server for development `npm run dev`
> I did not use babel or any minify work flow

For production, I would suggest using PM2 Library. (Install with `npm install -g pm2`)

Then, run `pm2 start dist/index.js`



