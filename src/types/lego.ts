import { ReactPropChildren } from './common'

export enum LegoBlockPlatform {
  SELECT = 'select',
  UNKNOWN = 'unknown',
  UNISWAPv2 = 'uniswap_v2',
  UNISWAPv3 = 'uniswap_v3',
  AAVEv2 = 'aave_v2',
  AAVEv3 = 'aave_v3',
}

export interface LegoBlockProps extends Partial<ReactPropChildren> {
  name: LegoBlockPlatform
  moveUp: () => void
  moveDown: () => void
  removeBlock: () => void
}

export interface LegoBlockIconProps {
  src: string
  alt: string
}

export interface LegoActionProps {
  name: string
  onClick: () => void
}

export interface LegoBlockBuilder extends LegoBlockProps {
  uuid: string
  content: any
}

export type LegoBlocks = LegoBlockBuilder[]

export type LegoBlockPartial = Omit<LegoBlockBuilder, 'uuid' | 'removeBlock' | 'moveUp' | 'moveDown'>

export type UseBlocksReturn = [
  LegoBlocks,
  () => void,
]
