import React from 'react'
import { useSigner } from 'wagmi'

import { Link } from 'react-router-dom'
import Container from '../../components/Container'

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
        <div className="card w-full max-w-md bg-base-100 border border-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Example Strategy</h2>
            <p className="text-sm">Constructed by @Yuma</p>
            <p className="text-sm">Earn LP token on Fantom from Goerli</p>
            <div className="card-actions justify-center mt-2">
              <Link to="/strategy/example" className="btn btn-accent">
                Check out!
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Container>
  )
}
