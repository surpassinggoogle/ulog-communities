// This functions check whether a string is in an array
const arrayContains = (needle: string, arrhaystack: string[]): boolean => {
  return arrhaystack.indexOf(needle) > -1
}

// This will exit node operation
const die = (msg: string) => {
  process.stderr.write(msg + '\n')
  process.exit(1)
}

const getVoteWeight = (paramWeight: number, maxweight: number): number => {
  let voteWeight = 0
  if (paramWeight > maxweight) {
    voteWeight = maxweight
  } else {
    voteWeight = paramWeight
  }
  return voteWeight * 100
}

export { arrayContains, die, getVoteWeight }
