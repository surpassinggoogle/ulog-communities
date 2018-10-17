const TAG = 'ulogs-test'

const COMMENT = (author: string): string => {
  return `
Hello @${author},

Thank you for having interest in using #ulogs tag.

  `
}

const WHITELIST: string[] = ['superoo7']
// percentage allowed for CN words (e.g. 20%)
const PERCENTAGE: number = 20

export { TAG, COMMENT, WHITELIST, PERCENTAGE }
