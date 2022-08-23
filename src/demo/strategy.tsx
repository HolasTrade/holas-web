import { Signer } from '@wagmi/core/dist/declarations/src/types'
import { utils } from 'ethers'
import React, { useCallback, useEffect, useState } from 'react'
import {
  useAccount, useContract, useContractWrite, usePrepareContractWrite,
} from 'wagmi'

import { Button } from 'react-daisyui'
import AbiERC20 from './abi/erc20.json'
import AbiLoopedExec from './abi/loopedExec.json'
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

  const [tos, setTos] = useState<string[]>([])

  const [datas, setDatas] = useState<string[]>([])

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
    if (!approveUSDT || !initiateExec) return

    const txApprove = await approveUSDT()

    const txInitiate = await initiateExec({
      recklesslySetUnpreparedOverrides: {
        value: utils.parseEther('0.002'),
        gasLimit: 300000,
        gasPrice: utils.parseUnits('2', 'gwei'),
      },
    })
    console.log(txInitiate)
  }, [address, approveUSDT, initiateExec])

  return (
    <div className="card w-full max-w-md bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Example Strategy</h2>
        <p className="text-sm">Constructed by @Yuma</p>
        <p className="text-sm">Bridge 10 USDT from Goerli to Fantom, then convert to TUSDT using Spooky</p>
        <div className="text-left">
          <ul className="steps steps-vertical">
            <li className="step step-primary">Goerli: Bridge 10 USDT to Fantom</li>
            <li className="step step-primary">Fantom: Swap 5 USDT to TUSDT on Spooky</li>
            <li className="step step-primary">Fantom: Swap 5 USDT to TUSDC on Spooky</li>
            <li className="step step-primary">Fantom: Stake in TUSDT/TUSDC pool on Unbound Finance</li>
            <li data-content="●" className="step">END: Earn LP token</li>
          </ul>
        </div>
        <div className="card-actions justify-center">
          <div>
            <Button
              onClick={() => executeStrategy()}
            >
              Execute
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
