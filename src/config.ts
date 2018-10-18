const BOT_COMMAND = 'ulogy'
const MAIN_TAG = 'ulog'
const ULOGS_APP = 'ulogs/1.0.0'
const CERTIFIED_ULOGGERS: string[] = ['east.autovote', 'eastmael']
const OVERSEERS = [
  {name: 'east.autovote', 'tags': ['surpassinggoogle', 'ulog-cat2']}, 
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

export { ULOGS_APP, BOT_COMMAND, MAIN_TAG, CERTIFIED_ULOGGERS, OVERSEERS, COMMENT, WHITELIST, PERCENTAGE }
