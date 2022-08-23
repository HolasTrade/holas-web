import { ChainIdsReverse, SupportedProtocols } from './constants'
import { capitalizeFirstLetter } from './misc'

// export function sortBlocksByOrder(blocks: LegoBlocks, sort = 'asc'): LegoBlockBuilder[] {
//   const sortFn = (a: LegoBlockBuilder, b: LegoBlockBuilder) => (sort === 'asc' ? b.order - a.order : a.order - b.order)
//   const sorted: LegoBlockBuilder[] = Object.values(blocks)
//   sorted.sort(sortFn)
//   return sorted
// }

export function getChainProtocols(chainId: number): string[] {
  const chain = capitalizeFirstLetter(ChainIdsReverse[chainId])
  const supported: Set<string> = new Set()
  Object.keys(SupportedProtocols).forEach((name) => {
    const protocol = SupportedProtocols[name]
    if (protocol.chains.includes(chain)) supported.add(name)
  })
  return Array.from(supported)
}
