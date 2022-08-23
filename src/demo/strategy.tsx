// import { Signer } from '@wagmi/core/dist/declarations/src/types'
import clsx from 'clsx'
import { utils } from 'ethers'
import React, { useCallback, useEffect, useState } from 'react'
import Confetti from 'react-confetti'
import { Button } from 'react-daisyui'
import { TwitterShareButton } from 'react-twitter-embed'
import { useWindowSize } from 'usehooks-ts'
import {
  useAccount, useContract, useContractWrite, usePrepareContractWrite,
  useNetwork, useSwitchNetwork,
} from 'wagmi'

import AbiERC20 from './abi/erc20.json'
import AbiLoopedExec from './abi/loopedExec.json'
import holaSvg from '../assets/hola.svg'
import {
  USDT_TOKEN_ADDRESS,
  USDT_TOKEN_AMOUNT,
  GOERLI_BRIDGE_CONTRACT_ADDRESS,
  SIMPLIFIED_LOOPED_EXEC_CONTRACT_ADDRESS,
  GOERLI_MESSAGE_BUS_CONTRACT_ADDRESS,
  SPOOKY_UNBOUND_CONTRACT_ADDRESS,
} from './constants'

const goerliBridgeABI = [
  'function goerliToFantomTestnetBridge(address _receiver, address _token, uint256 _amount, address _message_bus, address originalAddress, address[] calldata tos, bytes[] memory datas)',
]

const goerliBridgeIface = new utils.Interface(goerliBridgeABI)

export default function ExampleStrategy() {
  const { address } = useAccount()
  const { width, height } = useWindowSize()
  const { chain } = useNetwork()
  const {
    chains, error: errorSwitchChain, isLoading: isLoadingSwitchChain, pendingChainId, switchNetworkAsync,
  } = useSwitchNetwork()

  const [tos, setTos] = useState<string[]>([])
  const [datas, setDatas] = useState<string[]>([])
  const [showConfetti, setShowConfetti] = useState<boolean>(false)
  const [isLikeBtnActive, setIsLikeBtnActive] = useState<boolean>(false)

  const { config: configUSDT } = usePrepareContractWrite({
    addressOrName: USDT_TOKEN_ADDRESS,
    contractInterface: AbiERC20,
    functionName: 'approve',
    args: [SIMPLIFIED_LOOPED_EXEC_CONTRACT_ADDRESS, USDT_TOKEN_AMOUNT],
  })

  // const { config: configLoopedExec } = usePrepareContractWrite({
  //   addressOrName: SIMPLIFIED_LOOPED_EXEC_CONTRACT_ADDRESS,
  //   contractInterface: AbiLoopedExec,
  //   functionName: 'initiate',
  //   args: [tos, datas],
  // })

  useEffect(() => {
    const goerliBridgeFuncEncoded = goerliBridgeIface.encodeFunctionData(
      'goerliToFantomTestnetBridge',
      [
        SPOOKY_UNBOUND_CONTRACT_ADDRESS,
        USDT_TOKEN_ADDRESS,
        USDT_TOKEN_AMOUNT,
        GOERLI_MESSAGE_BUS_CONTRACT_ADDRESS,
        address as string,
        [],
        [],
      ],
    )
    setTos([GOERLI_BRIDGE_CONTRACT_ADDRESS])
    setDatas([goerliBridgeFuncEncoded])
  }, [address])

  const {
    data: txUSDTApproval,
    isLoading: isLoadingUSDTApproval,
    isSuccess: isSuccessUSDTApproval,
    writeAsync: approveUSDT,
  } = useContractWrite(configUSDT)

  // const {
  //   data: txLoopedExec,
  //   isLoading: isLoadingLoopedExec,
  //   isSuccess: isSuccessLoopedExec,
  //   write: initiateExec,
  // } = useContractWrite(configLoopedExec)
  const {
    data: txLoopedExec,
    isLoading: isLoadingLoopedExec,
    isSuccess: isSuccessLoopedExec,
    writeAsync: initiateExec,
  } = useContractWrite({
    mode: 'recklesslyUnprepared',
    addressOrName: SIMPLIFIED_LOOPED_EXEC_CONTRACT_ADDRESS,
    contractInterface: AbiLoopedExec,
    functionName: 'initiate',
    args: [tos, datas],
  })

  const executeStrategy = useCallback(async () => {
    if (!approveUSDT || !initiateExec || !chain || !switchNetworkAsync) return

    if (chain.id !== 5) {
      await switchNetworkAsync(5)
    }

    const txApprove = await approveUSDT()

    const txInitiate = await initiateExec({
      recklesslySetUnpreparedOverrides: {
        value: utils.parseEther('0.002'),
        gasLimit: 300000,
        gasPrice: utils.parseUnits('2', 'gwei'),
      },
    })
    console.log(txApprove, txInitiate)

    if (txInitiate) {
      setShowConfetti(true)
    }
  }, [approveUSDT, initiateExec, chain, switchNetworkAsync, isLoadingSwitchChain, pendingChainId])

  const likeBtnClick = useCallback(() => {
    setIsLikeBtnActive(true)
    setTimeout(() => {
      setIsLikeBtnActive(false)
    }, 2000)
  }, [])

  return (
    <>
      <div className="card w-full max-w-xl mx-auto bg-base-100 border border-base-200 shadow-none">
        <div className="card-body">
          <h2 className="card-title">Example Strategy</h2>
          <p className="text-sm">Constructed by @Yuma</p>
          <p className="text-sm">Bridge 5 USDT from Goerli to Fantom, then convert to TUSDT using Spooky</p>
          <div className="text-left">
            <ul className="steps steps-vertical">
              <li className="step step-primary">Goerli: Bridge 5 USDT to Fantom</li>
              <li className="step step-primary">Fantom: Swap 2.5 USDT to TUSDT on Spooky</li>
              <li className="step step-primary">Fantom: Swap 2.5 USDT to TUSDC on Spooky</li>
              <li className="step step-primary">Fantom: Stake in TUSDT/TUSDC pool on Unbound Finance</li>
              <li data-content="●" className="step">END: Earn LP token</li>
            </ul>
          </div>
          <div className="card-actions justify-center items-center space-x-4">
            <div>
              <button type="button" onClick={likeBtnClick}>
                <img
                  src={holaSvg}
                  alt="Hola"
                  className={clsx('h-12 w-12 cursor-pointer', isLikeBtnActive && 'animate-bounce')}
                />
              </button>
            </div>
            <div>
              <Button
                onClick={() => executeStrategy()}
              >
                Execute
              </Button>
            </div>
            <div>
              <TwitterShareButton
                url="https://holas.fi/strategy/example"
                onLoad={() => {}}
                options={{
                  size: 'large',
                  text: 'Check out this cross-chain DeFi strategy: ',
                  via: 'holastrades',
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <Confetti
        width={width}
        height={height}
        run={showConfetti}
        recycle={false}
        onConfettiComplete={() => setShowConfetti(false)}
      />
    </>
  )
}
