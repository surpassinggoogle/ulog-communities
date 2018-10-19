// lib
import * as dotenv from 'dotenv'
import { Client, PrivateKey } from 'dsteem'
import * as es from 'event-stream'
import * as util from 'util'

// file
import { arrayContains, die } from './functions'
import { OVERSEERS, FAIL_COMMENT, SUCCESS_COMMENT } from './config'
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
// @ts-ignore
let TEST: string = process.env.TEST
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

      // check if reply (return if post)
      if (txData.parent_author === '') return

      // get post data
      let author: string = txData.author
      let permlink: string = txData.permlink
      let post = await getPostData(author, permlink).catch(() =>
        console.error("Couldn't fetch post data with SteemJS")
      )

      // check if summoned by specific command
      if (post.body && post.body.indexOf(BOT_COMMAND) < 0) return

      // #################### CHECKS #######################

      // 2) check if certified ulogger
      if(TEST) {
        certifiedUloggers.push('eastmael', 'east.autovote')
      }
      let isCertifiedUlogger = arrayContains(author, certifiedUloggers)

      // get root post (to get all tags)
      let rootPost = await getPostData(post.parent_author, post.parent_permlink).catch(() =>
        console.error("Couldn't fetch ROOT post data with SteemJS")
      )

      // 3) posted using 'ulogs' app
      let app: string = ''
      try {
        app = JSON.parse(rootPost.json_metadata).app
      } catch (e) {
        console.error('Invalid app')
        return
      }
      console.log('posted using ulogs: ', app.indexOf(ULOGS_APP) >= 0)
      let isUlogApp = app.indexOf(ULOGS_APP) >= 0

      // 4) First tag is 'ulogs'
      let rootTags: string[]
      try {
        rootTags = JSON.parse(rootPost.json_metadata).tags
      } catch (e) {
        console.error('Invalid root tags')
        return
      }
      console.log('first tag is main tag: ', rootTags[0] === MAIN_TAG)
      let isFirstTagUlog = (rootTags[0] === MAIN_TAG)

      // 5) Summoner is overseer of sub-tag
      let subtags = OVERSEERS.filter(overseerObj => overseerObj.name === author).map(result => result.tags)
      // 7a) Is an overseer?
      console.log('summoner is an overseer? ', subtags);
      let isOverseer = (subtags && subtags.length > 0)

      // 7b) Is an overseer of sub-tag?
      console.log('summoner is an overseer of sub-tag? ', arrayContains(rootTags[1], subtags[0]));
      let isSubtagOverseer = (isOverseer && arrayContains(rootTags[1], subtags[0]))

      console.log('sendingComment')
      let commentTemplate: string = ''
      if (isCertifiedUlogger && isUlogApp && isFirstTagUlog && isOverseer && isSubtagOverseer) {
        commentTemplate = SUCCESS_COMMENT(author, ACCOUNT_NAME)
      } else {
        commentTemplate = FAIL_COMMENT(author, ACCOUNT_NAME, rootTags[1])
      }

      console.log(commentTemplate)
      /*
      // Send Comment
      comment(client, author, permlink, key, ACCOUNT_NAME, commentTemplate).catch(() =>
        console.error("Couldn't comment on the violated post")
      )
      /* */
    }
    return
  })
})
