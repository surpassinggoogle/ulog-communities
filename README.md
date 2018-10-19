# ULOGS BOT

Steem Bot To Enable And Grow Ulogs.org Communities & Ulog-subtags.

Current Version: v0.0.1

License: MIT

## Developer notes

Library used

* 'steem'
* 'dsteem'
* 'typescript'
* 'dotenv'
* 'nodemon'

## How to use it

Create a `.env` to store your posting key, username, and other configurations.

```
ACCOUNT_KEY=POSTING_KEY_HEREgit 
ACCOUNT_NAME=STEEM_NAME
BOT_COMMAND=ulogy
MAIN_TAG=ulog
ULOGS_APP=ulogs/1.0.0
SIMULATE_ONLY=true
```

Change variables in `config.ts`

Starting the server for development `npm run dev`
> I did not use babel or any minify work flow

For production, I would suggest using PM2 Library. (Install with `npm install -g pm2`)

Then, run `pm2 start dist/index.js`



