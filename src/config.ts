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

let OVERSEERS: {[key:string]: any} = {
  'east.autovote': {
    tags: [
      'subtag',
    ],
    maxweight: 50
  }, 
  'eastmael': {
    tags: [
      'newsubtag',
    ],
    maxweight: 60
  }, 
  'ankarlie': {
    tags: [
      'ulog-blocktrades',
    ],
    maxweight: 100
  }, 
  'bloghound': {
    tags: [
      'ulog-gratefulvibes',
    ],
    maxweight: 100
  },
  'iyanpol12': {
    tags: [
      'ulog-bobbylee',
    ],
    maxweight: 100
  },
  'kusknee': {
    tags: [
      'ulog-kusknee',
    ],
    maxweight: 100
  },
  'mermaidvampire': {
    tags: [
      'ulog-showerthoughts',
    ],
    maxweight: 100
  },
  'papa-pepper': {
    tags: [
      'ulog-papapepper',
    ],
    maxweight: 100
  },
  'paradise-found': {
    tags: [
      'ulog-gratefulvibes',
    ],
    maxweight: 100
  },
  'shadowspub': {
    tags: [
      'ulog-snookmademedoit',
    ],
    maxweight: 100
  },
  'snook': {
    tags: [
      'ulog-snookmademedoit',
    ],
    maxweight: 100
  },
  'stellabelle': {
    tags: [
      'ulogifs',
      'ulog-stellabelle',
    ],
    maxweight: 100
  },
  'sweetsssj': {
    tags: [
      'ulog-sweetsssj',
    ],
    maxweight: 100
  },
  'surfyogi': {
    tags: [
      'ulog-surfyogi',
    ],
    maxweight: 100
  },
  'surpassinggoogle': {
    tags: [
      'surpassinggoogle',
      'ulog-quotes',
      'ulog-howto',
      'ulog-diy',
      'ulog-surpassinggoogle',
      'teardrops',
      'untalented',
      'ulog-ned',
      'ulography',
      'ulog-gratefulvibes',
      'ulog-resolutions',
      'ulog-memes',
      'ulog-blocktrades',
      'ulog-showerthoughts',
      'ulog-snookmademedoit',
      'ulog-utopian',
      'ulog-thejohalfiles',
      'ulogifs',
      'ulog-surfyogi',
      'ulog-bobbylee',
      'ulog-stellabelle',
      'ulog-sweetsssj',
      'ulog-dimimp',
      'ulog-teamsteem',
      'ulog-kusknee',
      'ulog-papapepper',
    ],
    maxweight: 100
  },
  'samic': {
    tags: [
      'ulog-quotes',
      'ulog-memes',
    ],
    maxweight: 100
  }, 
  'sunnylife': {
    tags: [
      'ulography',
    ],
    maxweight: 100
  },
  'teamsteem': {
    tags: [
      'ulog-teamsteem',
    ],
    maxweight: 100
  }, 
  'uche-nna': {
    tags: [
      'ulog-steemjet',
    ],
    maxweight: 100
  },
  'ulogs': {
    tags: [
      'ulog-kusknee',
      'ulog-papapepper',
      'ulog-steemjet',
    ],
    maxweight: 100
  },
}

const FAIL_COMMENT = (author: string, bot: string, subtag: string, 
  flags: ConditionFlags): string => {

  console.log(flags)

  return `
Hello @${author},

Thank you for summoning me.
However, I wasn't able to upvote the post because:
${flags.isCertifiedUlogger  ? "" : "1. You're not a certified ulogger."}
${flags.isFirstTagUlog      ? "" : "1. #ulog is not the first tag of this post."}
${flags.isSubtagOverseer    ? "" : `1. You're not an overseer of #${subtag}.`}
${flags.isUlogApp           ? "" : "1. The post was not submitted through [ulogs.org](https://ulogs.org)."}
${flags.isReplyToPost       ? "" : "1. You did not reply directly to the post."}
${flags.isValidWeight       ? "" : "1. You did not specify a valid vote weight."}
${flags.isAlreadyVoted      ? "1. I've already voted on it." : ""}
${flags.isPastCurationWindow ? "" : "1. It's still within the curation window."}

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
