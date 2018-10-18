const CERTIFIED_ULOGGERS: string[] = ['east.autovote', 'eastmael', 'surpassinggoogle']
const OVERSEERS = [
  {name: 'east.autovote', 'tags': ['surpassinggoogle']}, 
  {name: 'eastmael', 'tags': ['surpassinggoogle']}, 
  {name: 'surpassinggoogle', 'tags': ['surpassinggoogle']}, 
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
