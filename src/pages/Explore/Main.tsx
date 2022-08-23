import React from 'react'
import { useSigner } from 'wagmi'

import Container from '../../components/Container'
import ExampleStrategy from '../../demo/strategy'

export default function ExplorePageMain() {
  const { data: signer, isError, isLoading } = useSigner()

  if (!signer) {
    return (
      <div>Please connect wallet for signer!</div>
    )
  }

  return (
    <Container>
      <section>
        <ExampleStrategy />
      </section>
    </Container>
  )
}
