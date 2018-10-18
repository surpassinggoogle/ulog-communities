import { Client } from 'dsteem'

const getCertifiedUloggers = async (client: Client) => {
  console.log('get certified uloggers function')
  let followlist = await client.call('follow_api', 'get_following', [
      'uloggers',
      '',
      'blog',
      1000,
  ])
  
  return followlist
}

// This will exit node operation
const die = (msg: string) => {
  process.stderr.write(msg + '\n')
  process.exit(1)
}

export { die, getCertifiedUloggers }
