import React from 'react'

import holaLogo from '../../assets/hola.svg'
import Container from '../../components/Container'

export default function HomePageMain() {
  return (
    <Container>
      <section>
        <div>
          <img src={holaLogo} alt="Holas Trade" className="h-full max-h-32 m-auto" />
        </div>
        <div className="pt-4 text-center">
          <div className="text-2xl font-bold text-yellow-500">Social platform</div>
        </div>
      </section>
    </Container>
  )
}
