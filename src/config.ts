let OVERSEERS: {[key:string]: string[]} = {
  'east.autovote': ['surpassinggoogle'], 
  'eastmael': ['surpassinggoogle'], 
  'surpassinggoogle': ['surpassinggoogle'], 
}

const COMMENT = (author: string): string => {
  return `
Hello @${author},

Thank you for summoning #ulogs-test.
  `
}

const FAIL_COMMENT = (author: string, bot: string, subtag: string): string => {
  return `
Hello @${author},

Thank you for summoning me.
However, you may have not fulfilled the following criteria.
1. You're not a certified ulogger.
2. #ulog is not the first tag of this post
3. You're not an overseer of #${subtag}
4. The post was not submitted through ulogs.org

  `
}

const SUCCESS_COMMENT = (author: string, bot: string): string => {
  return `
Hello @${author},

Thank you for summoning me.
This post has been upvoted.
  `
}



const WHITELIST: string[] = ['superoo7']
// percentage allowed for CN words (e.g. 20%)
const PERCENTAGE: number = 20

export { OVERSEERS, COMMENT, FAIL_COMMENT, SUCCESS_COMMENT, WHITELIST, PERCENTAGE }
