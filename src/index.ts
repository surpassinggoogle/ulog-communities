// lib
import * as dotenv from 'dotenv'
import { Client, PrivateKey } from 'dsteem'
import * as es from 'event-stream'
import * as util from 'util'

// file
import { arrayContains, die } from './functions'
import { OVERSEERS, FAIL_COMMENT, SUCCESS_COMMENT } from './config'
import { getContent, getPostData, getCertifiedUloggers, comment, vote } from './steem'

// Init

// Environment Init
dotenv.config()
if (!process.env.BOT || !process.env.ACCOUNT_KEY || !process.env.BOT_COMMAND || !process.env.MAIN_TAG || !process.env.ULOGS_APP) throw new Error('ENV variable missing')
// @ts-ignore
let BOT: string = process.env.BOT
// @ts-ignore
let ACCOUNT_KEY: string = process.env.ACCOUNT_KEY
// @ts-ignore
let BOT_COMMAND: string = process.env.BOT_COMMAND
// @ts-ignore
let MAIN_TAG: string = process.env.MAIN_TAG
// @ts-ignore
let ULOGS_APP: string = process.env.ULOGS_APP
// @ts-ignore
let SIMULATE_ONLY: string = process.env.SIMULATE_ONLY
if (BOT === '' || ACCOUNT_KEY === '' || BOT_COMMAND === '' || MAIN_TAG === '' || ULOGS_APP === '') die('Check .env file')

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
      console.log(post)

      // #################### CHECKS #######################

      // 2) check if certified ulogger
      if(SIMULATE_ONLY) {
        certifiedUloggers.push('eastmael', 'east.autovote')
      }
      let isCertifiedUlogger = arrayContains(author, certifiedUloggers)

      // 2b) check summon is a direct reply under the post
      let isReplyToPost = (post.root_author === post.parent_author 
        && post.root_permlink === post.parent_permlink)
      console.log('is reply directly under post:', isReplyToPost) 

      // get root post (to get all tags)
      let rootPost = await getPostData(post.root_author, post.root_permlink).catch(() =>
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
      // TODO: Change to map
      let subtags = OVERSEERS[author]
      // 7a) Is an overseer?
      console.log('summoner is an overseer? ', subtags);
      let isOverseer = (subtags && subtags.length > 0)

      // 7b) Is an overseer of sub-tag?
      console.log('summoner is an overseer of sub-tag? ', arrayContains(rootTags[1], subtags));
      let isSubtagOverseer = (isOverseer && arrayContains(rootTags[1], subtags))

      console.log('sendingComment')
      let commentTemplate: string = ''
      if (isCertifiedUlogger && isUlogApp && isFirstTagUlog && isOverseer && isSubtagOverseer) {
        commentTemplate = SUCCESS_COMMENT(author, BOT)
      } else {
        commentTemplate = FAIL_COMMENT(author, BOT, rootTags[1])
      }

      if (SIMULATE_ONLY) {
        console.log(commentTemplate)
      } else {
        // Send Comment
        comment(client, author, permlink, key, BOT, commentTemplate).catch(() =>
          console.error("Couldn't comment on the violated post")
        )

        // Upvote post
        vote(client, BOT, author, rootPost.permlink, 10, key).catch(() =>
          console.error("Couldn't comment on the violated post")
        )
      }
    }
    return
  })
})
