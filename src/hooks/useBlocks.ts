import { useCallback, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import {
  LegoBlocks,
  LegoBlockPlatform,
  UseBlocksReturn,
} from '../types/lego'
import { moveArrayItem } from '../utils/misc'

export default function useBlocks(): UseBlocksReturn {
  const [blocks, setBlocks] = useState<LegoBlocks>([])

  const moveUp = useCallback((uuid: string) => {
    setBlocks((oldBlocks) => {
      const idx = oldBlocks.findIndex((x) => x.uuid === uuid)
      return moveArrayItem(oldBlocks, idx, idx - 1)
    })
  }, [setBlocks])

  const moveDown = useCallback((uuid: string) => {
    setBlocks((oldBlocks) => {
      const idx = oldBlocks.findIndex((x) => x.uuid === uuid)
      return moveArrayItem(oldBlocks, idx, idx + 1)
    })
  }, [setBlocks])

  const removeBlock = useCallback((uuid: string) => {
    // console.log('remove block', uuid)
    setBlocks((oldBlocks) => {
      const newBlocks = oldBlocks
      const idx = newBlocks.findIndex((x) => x.uuid === uuid)
      newBlocks.slice(idx, 1)
      return newBlocks
    })
  }, [setBlocks])

  const addBlock = useCallback(() => {
    // console.log(lastOrder)
    const uuid = uuidv4()
    const newBlock = {
      uuid,
      name: LegoBlockPlatform.SELECT,
      content: '',
      moveUp: () => moveUp(uuid),
      moveDown: () => moveDown(uuid),
      removeBlock: () => removeBlock(uuid),
    }
    console.log(newBlock)
    setBlocks((oldBlocks) => [...oldBlocks, newBlock])
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  }, [moveUp, moveDown, removeBlock])

  return [blocks, addBlock]
}
