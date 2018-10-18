// lib
import * as dotenv from 'dotenv'
import { Client, PrivateKey } from 'dsteem'
import * as es from 'event-stream'
import * as util from 'util'

// file
import { arrayContains, die } from './functions'
import { BOT_COMMAND, MAIN_TAG, CERTIFIED_ULOGGERS } from './config'
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

    //console.log('tx data' , txData);

    // skip if post
    if (txData.parent_author === '') return

    // get body
    let author: string = txData.author
    if(!arrayContains(author, CERTIFIED_ULOGGERS)) return

    let permlink: string = txData.permlink
    let body = await getContent(author, permlink).catch(() =>
      console.error("Couldn't fetch post data with SteemJS")
    )

    if (body && body.indexOf(BOT_COMMAND) >= 0) {

      let root_author: string = txData.root_author
      let root_permlink: string = txData.root_permlink
      if (!root_author && !root_permlink) return
      let root_post = await getPostData(root_author, root_permlink).catch(() =>
        console.error("Couldn't fetch post data with SteemJS")
      )
      //console.log('root post', root_post)

      let tags: string[]
      try {
        tags = JSON.parse(root_post.json_metadata).tags
      } catch (e) {
        console.error('Invalid tags')
        return
      }

      if (tags[0] !== MAIN_TAG) return

      console.log('sendingComment')
      // Send Comment
      comment(client, author, permlink, key, ACCOUNT_NAME).catch(() =>
        console.error("Couldn't comment on the violated post")
      )
    }
  }
  return
})
