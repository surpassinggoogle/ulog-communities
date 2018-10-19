// lib
import * as dotenv from 'dotenv'
import { Client, PrivateKey } from 'dsteem'
import * as es from 'event-stream'
import * as util from 'util'

// file
import { arrayContains, die } from './functions'
import { OVERSEERS } from './config'
import { getContent, getPostData, comment, getCertifiedUloggers } from './steem'

// Init

// Environment Init
dotenv.config()
if (!process.env.ACCOUNT_NAME || !process.env.ACCOUNT_KEY || !process.env.BOT_COMMAND || !process.env.MAIN_TAG || !process.env.ULOGS_APP) throw new Error('ENV variable missing')
// @ts-ignore
let ACCOUNT_NAME: string = process.env.ACCOUNT_NAME
// @ts-ignore
let ACCOUNT_KEY: string = process.env.ACCOUNT_KEY
// @ts-ignore
let BOT_COMMAND: string = process.env.BOT_COMMAND
// @ts-ignore
let MAIN_TAG: string = process.env.MAIN_TAG
// @ts-ignore
let ULOGS_APP: string = process.env.ULOGS_APP
if (ACCOUNT_NAME === '' || ACCOUNT_KEY === '' || BOT_COMMAND === '' || MAIN_TAG === '' || ULOGS_APP === '') die('Check .env file')

// Steem Init


const client = new Client('https://api.steemit.com')
let key = PrivateKey.from(ACCOUNT_KEY)
const stream = client.blockchain.getOperationsStream()

console.log('Operation started')

getCertifiedUloggers(client).then(res => {
  let certifiedUloggers: string[] = []
  res.forEach((obj: any) => certifiedUloggers.push(obj.following))

  // Stream Steem Blockchain
  stream.on('data', async operation => {
    // Look for comment type of transaction
    if (operation.op[0] == 'comment') {
      let txData = operation.op[1]

      // 1) check if reply (not post)
      if (txData.parent_author === '') return

      // 2) check if certified ulogger
      let author: string = txData.author
      if(!arrayContains(author, certifiedUloggers)) return

      // get post content/body
      let permlink: string = txData.permlink
      let post = await getPostData(author, permlink).catch(() =>
        console.error("Couldn't fetch post data with SteemJS")
      )

      // 3) posted using 'ulogs' app
      let app: string = ''
      try {
        app = JSON.parse(post.json_metadata).app
      } catch (e) {
        console.error('Invalid app')
        return
      }
      console.log('posted using ulogs: ', app.indexOf(ULOGS_APP) >= 0)
      if(app.indexOf(ULOGS_APP) < 0) return

      // 4) body contains specific command
      console.log('body contains command: ', post.body.indexOf(BOT_COMMAND) >= 0)
      if (post.body && post.body.indexOf(BOT_COMMAND) < 0) return

      let tags: string[]
      try {
        tags = JSON.parse(post.json_metadata).tags
      } catch (e) {
        console.error('Invalid tags')
        return
      }

      // 5) First tag is 'ulogs'
      console.log('first tag is main tag: ', tags[0] === MAIN_TAG)
      if (tags[0] !== MAIN_TAG) return

      // 6)get root post (to get all tags)
      let rootPost = await getPostData(post.parent_author, post.parent_permlink).catch(() =>
        console.error("Couldn't fetch ROOT post data with SteemJS")
      )

      // 7) Summoner is overseer of sub-tag
      let rootTags: string[]
      try {
        rootTags = JSON.parse(rootPost.json_metadata).tags
      } catch (e) {
        console.error('Invalid root tags')
        return
      }
      // TODO: change to map
      let subtags = OVERSEERS.filter(overseerObj => overseerObj.name === author).map(result => result.tags)
      // 7a) Is an overseer?
      console.log('summoner is an overseer? ', subtags);
      if (subtags && subtags.length == 0) return

      // 7b) Is an overseer of sub-tag?
      console.log('summoner is an overseer of sub-tag? ', arrayContains(rootTags[1], subtags[0]));
      if(!arrayContains(rootTags[1], subtags[0])) return

      console.log('sendingComment')
      /*
      // Send Comment
      comment(client, author, permlink, key, ACCOUNT_NAME).catch(() =>
        console.error("Couldn't comment on the violated post")
      )
      /* */
    }
    return
  })
})
