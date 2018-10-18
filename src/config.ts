const BOT_COMMAND = 'ulogy'
const MAIN_TAG = 'ulogs'
const APP = 'ulogs'
const SUB_TAGS: string[] = ['ulog-cat1', 'ulog-cat2', 'ulog-cat3', 'ulog-cat4']
const CERTIFIED_ULOGGERS: string[] = ['east.autovote', 'eastmael']
const OVERSEERS = [
  {cat: 'ulog-cat1', overseers: ['east.autovote', 'eastmael']}, 
  {cat: 'ulog-cat2', overseers: ['east.autovote']}, 
  {cat: 'ulog-cat3', overseers: ['eastmael']}, 
  {cat: 'ulog-cat4', overseers: []}, 
]

const COMMENT = (author: string): string => {
  return `
Hello @${author},

Thank you for summoning #ulogs-test.
  `
}

const WHITELIST: string[] = ['superoo7']
// percentage allowed for CN words (e.g. 20%)
const PERCENTAGE: number = 20

export { APP, BOT_COMMAND, MAIN_TAG, SUB_TAGS, CERTIFIED_ULOGGERS, OVERSEERS, COMMENT, WHITELIST, PERCENTAGE }
