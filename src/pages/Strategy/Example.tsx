import React from 'react'
import { useSigner } from 'wagmi'

import Container from '../../components/Container'
import ExampleStrategy from '../../demo/strategy'

export default function StrategyExamplePage() {
  const { data: signer, isError, isLoading } = useSigner()

  if (!signer) {
    return (
      <Container>
        <h2 className="font-bold text-center">Please connect your wallet!</h2>
      </Container>
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
