import React, { useEffect } from 'react'

import Container from '../../components/Container'
import Lego from '../../components/Lego'
import useBlocks from '../../hooks/useBlocks'
import { LegoBlockPlatform } from '../../types/lego'
import { getABI, getABIFunctions } from '../../utils/web3'
import { buildPreset } from '../../components/Lego/preset'
import { ChainId } from '../../utils/constants'

export default function CreatePageMain() {
  const [blocks, addBlock] = useBlocks()

  return (
    <Container>
      <Lego.Wrapper>
        <Lego.BlockRenderer blocks={blocks} />
      </Lego.Wrapper>
      <Lego.ActionWrapper>
        <Lego.Action
          name="Add Block"
          onClick={() => addBlock()}
        />
      </Lego.ActionWrapper>
    </Container>
  )
}
