# ULOGS BOT

Steem Bot To Enable And Grow Ulogs.org Communities & Ulog-subtags.

Current Version: v1.0.0

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
BOT=STEEM_NAME
BOT_COMMAND=ulogy
MAIN_TAG=ulog
ULOGS_APP=ulogs/1.0.0
SIMULATE_ONLY=false
ADD_ULOG_TEST_ACCOUNTS=true
DEFAULT_VOTE_WEIGHT=1000
```

Change variables in `config.ts`

Starting the server for development `npm run dev`
> I did not use babel or any minify work flow

For production, I would suggest using PM2 Library. (Install with `npm install -g pm2`)

Then, run `pm2 start dist/index.js`



## Credits

Imported from https://github.com/superoo7/cn-malaysia.
