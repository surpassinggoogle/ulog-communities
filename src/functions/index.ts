import { Client } from 'dsteem'

// This will exit node operation
const die = (msg: string) => {
  process.stderr.write(msg + '\n')
  process.exit(1)
}

export { die }
