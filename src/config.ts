const CERTIFIED_ULOGGERS: string[] = ['east.autovote', 'eastmael']
const OVERSEERS = [
  {name: 'eastmael', 'tags': ['surpassinggoogle', 'ulog-cat2']}, 
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

export { CERTIFIED_ULOGGERS, OVERSEERS, COMMENT, WHITELIST, PERCENTAGE }
