interface ConditionFlags {
  isCertifiedUlogger: boolean
  isUlogApp: boolean
  isFirstTagUlog: boolean
  isSubtagOverseer: boolean
  isReplyToPost: boolean
}

let OVERSEERS: {[key:string]: string[]} = {
  'east.autovote': ['surpassinggoogle', 'subtag'], 
  'eastmael': ['surpassinggoogle'], 
  'surpassinggoogle': ['surpassinggoogle'], 
}

const FAIL_COMMENT = (author: string, bot: string, subtag: string, 
  flags: ConditionFlags): string => {



  console.log(flags);
  return `
Hello @${author},

Thank you for summoning me.
However, I wasn't able to upvote the post because:
${flags.isCertifiedUlogger  ? "" : "1. You're not a certified ulogger."}
${flags.isFirstTagUlog      ? "" : "1. #ulog is not the first tag of this post."}
${flags.isSubtagOverseer    ? "" : `1. You're not an overseer of #${subtag}.`}
${flags.isUlogApp           ? "" : "1. The post was not submitted through [ulogs.org](https://ulogs.org)."}
${flags.isReplyToPost       ? "" : "1. You did not reply directly to the post."}

Please consider reaching out to @surpassinggoogle to address this.
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

export { OVERSEERS, FAIL_COMMENT, SUCCESS_COMMENT, WHITELIST, PERCENTAGE }
