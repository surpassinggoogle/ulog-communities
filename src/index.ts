// lib
import * as dotenv from 'dotenv'
import { Client, PrivateKey } from 'dsteem'
import * as es from 'event-stream'
import * as util from 'util'

// file
import { die } from './functions'
import { MAIN_TAG } from './config'
import { getContent, comment, getCertifiedUloggers } from './steem'

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
    let tags: string[]
    try {
      tags = JSON.parse(txData.json_metadata).tags
    } catch (e) {
      console.error('Invalid tags')
      return
    }

    if (tags[0] !== MAIN_TAG) return

    let author: string = txData.author
    let permlink: string = txData.permlink
    let body = await getContent(author, permlink).catch(() =>
      console.error("Couldn't fetch post data with SteemJS")
    )

    if (body && body.indexOf('ulogs-command') >= 0) {
      console.log('sendingComment')
      // Send Comment
      comment(client, author, permlink, key, ACCOUNT_NAME).catch(() =>
        console.error("Couldn't comment on the violated post")
      )
    }
  }
  return
})
