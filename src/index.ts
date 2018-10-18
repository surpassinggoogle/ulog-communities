// lib
import * as dotenv from 'dotenv'
import { Client, PrivateKey } from 'dsteem'
import * as es from 'event-stream'
import * as util from 'util'

// file
import { arrayContains, die } from './functions'
import { APP, BOT_COMMAND, MAIN_TAG, CERTIFIED_ULOGGERS } from './config'
import { getContent, getPostData, comment, getCertifiedUloggers } from './steem'

// Init

// Environment Init
dotenv.config()
if (!process.env.ACCOUNT_NAME || !process.env.ACCOUNT_KEY) throw new Error('ENV variable missing')
// @ts-ignore
let ACCOUNT_NAME: string = process.env.ACCOUNT_NAME
// @ts-ignore
let ACCOUNT_KEY: string = process.env.ACCOUNT_KEY
if (ACCOUNT_NAME === '' || ACCOUNT_NAME === '') die('Check .env file')

// Steem Init

const client = new Client('https://api.steemit.com')
let key = PrivateKey.from(ACCOUNT_KEY)
const stream = client.blockchain.getOperationsStream()

console.log('Operation started')

// Stream Steem Blockchain
stream.on('data', async operation => {
  // Look for comment type of transaction
  if (operation.op[0] == 'comment') {
    let txData = operation.op[1]

    // 1) check if reply (not post)
    if (txData.parent_author === '') return

    // 2) check if certified ulogger
    let author: string = txData.author
    if(!arrayContains(author, CERTIFIED_ULOGGERS)) return
    console.log('is certified ulogger', arrayContains(author, CERTIFIED_ULOGGERS))

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
    if(app.indexOf(APP) < 0) return

    // 4) post contains specific command
    if (post.body && post.body.indexOf(BOT_COMMAND) >= 0) {
      console.log('sendingComment')
      // Send Comment
      comment(client, author, permlink, key, ACCOUNT_NAME).catch(() =>
        console.error("Couldn't comment on the violated post")
      )
    }
  }
  return
})
