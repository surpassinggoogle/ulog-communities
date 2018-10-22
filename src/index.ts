// lib
import * as dotenv from 'dotenv'
import { Client, PrivateKey } from 'dsteem'
import * as es from 'event-stream'
import * as util from 'util'
import * as striptags from 'striptags'

// file
import { arrayContains, die } from './functions'
import { OVERSEERS, FAIL_COMMENT, SUCCESS_COMMENT } from './config'
import {
    getContent,
    getPostData,
    getCertifiedUloggers,
    comment,
    vote
} from './steem'

// Init

// Environment Init
dotenv.config()
if (!process.env.BOT || !process.env.ACCOUNT_KEY || !process.env.BOT_COMMAND
    || !process.env.MAIN_TAG || !process.env.ULOGS_APP 
    || !process.env.DEFAULT_VOTE_WEIGHT) throw new Error('ENV variable missing')
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
let SIMULATE_ONLY: boolean = (process.env.SIMULATE_ONLY === "true")
// @ts-ignore
let ADD_ULOG_TEST_ACCOUNTS: boolean
  = (process.env.ADD_ULOG_TEST_ACCOUNTS === "true")
// @ts-ignore
let DEFAULT_VOTE_WEIGHT: number = parseInt(process.env.DEFAULT_VOTE_WEIGHT)
if (BOT === '' || ACCOUNT_KEY === '' || BOT_COMMAND === '' || MAIN_TAG === ''
    || ULOGS_APP === '' || DEFAULT_VOTE_WEIGHT === 0) die('Check .env file')

// Steem Init

const client = new Client('https://api.steemit.com')
let key = PrivateKey.from(ACCOUNT_KEY)
const stream = client.blockchain.getOperationsStream()

console.log('Operation started')
console.log('Is simulation?', SIMULATE_ONLY)
console.log('Bot command:', BOT_COMMAND)

getCertifiedUloggers(client).then(res => {
  let certifiedUloggers: string[] = []
  res.forEach((obj: any) => certifiedUloggers.push(obj.following))
  if(ADD_ULOG_TEST_ACCOUNTS) {
    console.log('adding uloggers for testing')
    certifiedUloggers.push('eastmael', 'east.autovote')
  }

  // Stream Steem Blockchain
  stream.on('data', async operation => {
    // Look for comment type of transaction
    if (operation.op[0] == 'comment') {
      let txData = operation.op[1]

      // check if reply (return if post)
      if (txData.parent_author === '') return

      // get post data
      let summoner: string = txData.author
      let permlink: string = txData.permlink
      let post = await getPostData(summoner, permlink).catch(() =>
        console.error("Couldn't fetch post data with SteemJS")
      )

      let body = striptags(post.body.toLowerCase().split(" "))
      console.log('body', body)
      // check if summoned by specific command
      if (body.indexOf(BOT_COMMAND.toLowerCase()) < 0) return

      // #################### CHECKS #######################
      // 2) check if certified ulogger
      let isCertifiedUlogger = arrayContains(summoner, certifiedUloggers)

      // 2b) check summon is a direct reply under the post
      let isReplyToPost = (post.root_author === post.parent_author 
        && post.root_permlink === post.parent_permlink)
      console.log('is reply directly under post:', isReplyToPost) 

      // get root post (to get all tags)
      let rootPost = await getPostData(post.root_author, post.root_permlink)
        .catch(() =>
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
      let subtags = OVERSEERS[summoner]
      // 7a) Is an overseer?
      console.log('summoner is an overseer? ', subtags);
      let isOverseer = (subtags && subtags.length > 0)

      // 7b) Is an overseer of sub-tag?
      console.log('summoner is an overseer of sub-tag? ',
        arrayContains(rootTags[1], subtags));
      let isSubtagOverseer = (isOverseer && arrayContains(rootTags[1], subtags))

      let commentTemplate: string = ''
      if (isCertifiedUlogger && isUlogApp && isFirstTagUlog && isOverseer 
          && isSubtagOverseer && isReplyToPost) {
        commentTemplate = SUCCESS_COMMENT(summoner, BOT)
      } else {
        commentTemplate = FAIL_COMMENT(
          summoner,
          BOT,
          rootTags[1],
          {
            isCertifiedUlogger,
            isUlogApp,
            isFirstTagUlog,
            isSubtagOverseer,
            isReplyToPost,
          }
        )
      }

      if (SIMULATE_ONLY) {
        console.log('simulation only...')
        console.log(commentTemplate)
      } else {
        console.log('sending comment...')
        // Send Comment
        comment(client, summoner, permlink, key, BOT, commentTemplate)
        .then(() => {
          console.log('voting...')
          // Vote post
          vote(client, BOT, post.root_author, post.root_permlink,
              DEFAULT_VOTE_WEIGHT, key).catch(() =>
            console.error("Couldn't vote on the violated post")
          )
        }).catch(() => {
          console.error("Couldn't comment on the violated post")
        })
      }
    }
    return
  })
})
