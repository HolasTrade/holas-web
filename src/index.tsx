import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
} from 'wagmi'
// import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

import '@rainbow-me/rainbowkit/styles.css'
import './style/index.css'

import App from './pages/App'
import { persistor, store } from './states'
import theme from './theme'
import { fantomChain, fantomTestnetChain } from './utils/rainbow-chains'

const { chains, provider } = configureChains(
  [
    chain.goerli, // first network is the default network ==> Goerli for us atm.
    chain.mainnet, chain.optimism, chain.arbitrum, chain.polygon,
    fantomChain, fantomTestnetChain,
  ],
  [
    // alchemyProvider({ alchemyId: process.env.ALCHEMY_ID }),
    publicProvider(),
  ],
)

const { connectors } = getDefaultWallets({
  appName: 'Holas Trade',
  chains,
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
})

const container = document.getElementById('root')
const root = createRoot(container!)
root.render(
  <React.StrictMode>
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        showRecentTransactions
      >
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <BrowserRouter>
              <HelmetProvider>
                <ThemeProvider theme={theme}>
                  <CssBaseline />
                  <App />
                </ThemeProvider>
              </HelmetProvider>
            </BrowserRouter>
          </PersistGate>
        </Provider>
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>,
)
