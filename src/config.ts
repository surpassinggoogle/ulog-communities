interface ConditionFlags {
  isCertifiedUlogger: boolean
  isUlogApp: boolean
  isFirstTagUlog: boolean
  isSubtagOverseer: boolean
  isReplyToPost: boolean
  isValidWeight: boolean
  isAlreadyVoted: boolean
  isPastCurationWindow: boolean
}

const FAIL_COMMENT = (author: string, bot: string, subtag: string, 
  flags: ConditionFlags): string => {

  console.log(flags)

  return `
Hello @${author},

Thank you for summoning me.
However, I wasn't able to upvote the post because:
${flags.isCertifiedUlogger  ? "" : "* You're not a certified ulogger."}
${flags.isFirstTagUlog      ? "" : "* #ulog is not the first tag of this post."}
${flags.isSubtagOverseer    ? "" : `* You're not an overseer of #${subtag}.`}
${flags.isUlogApp           ? "" : "* The post was not submitted through [ulogs.org](https://ulogs.org)."}
${flags.isReplyToPost       ? "" : "* You did not reply directly to the post."}
${flags.isValidWeight       ? "" : "* You did not specify a valid vote weight."}
${flags.isAlreadyVoted      ? "* I've already voted on it." : ""}
${flags.isPastCurationWindow ? "" : "* It's still within the curation window."}

${flags.isAlreadyVoted ? "" : "Please consider reaching out to @surpassinggoogle to address this."}
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
