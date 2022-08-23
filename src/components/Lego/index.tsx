import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-daisyui'

import {
  LegoBlockPlatformBackgrounds,
  LegoBlockPlatformDisplayNames,
  LegoBlockPlatformLogos,
} from './decorations'
import { ABIFunction, ABIFunctionIO, ReactPropChildren } from '../../types/common'
import {
  LegoActionProps,
  LegoBlockBuilder,
  LegoBlockIconProps,
  LegoBlockProps,
  LegoBlocks,
} from '../../types/lego'
import {
  ChainIds, ChainIdsReverse, SupportedChains, SupportedProtocols,
} from '../../utils/constants'
import { getABIFunctions } from '../../utils/web3'
import { buildPreset } from './preset'
import { getChainProtocols } from '../../utils/lego'
import { capitalizeFirstLetter } from '../../utils/misc'

function Lego() {}

Lego.Wrapper = (props: ReactPropChildren) => (
  <div className="w-full py-4">{props.children}</div>
)

Lego.BlockIcon = (props: LegoBlockIconProps) => (
  <div className="h-16 w-16 mx-auto my-0 p-2 bg-base-100/75 rounded-full">
    <img src={props.src} alt={props.alt} className="h-full m-auto" />
  </div>
)

Lego.Block = (props: LegoBlockProps) => {
  const { name } = props
  // console.log(props)
  const displayName = LegoBlockPlatformDisplayNames[name]
  const displayBgImg = LegoBlockPlatformBackgrounds[name]
  const displayLogo = LegoBlockPlatformLogos[name]
  return (
    <div className="flex justify-center w-full py-4">
      <div className="flex w-1/4">
        <div className="card w-full bg-base-100 shadow-xl image-full">
          {
            displayBgImg ? (
              <figure>
                <img src={displayBgImg} alt={displayName} />
              </figure>
            ) : (<></>)
          }
          <div className="card-body items-center text-center">
            <Lego.BlockIcon src={displayLogo} alt={displayName} />
            <h2 className="card-title">{displayName}</h2>
            <div className="card-actions justify-center">
              <button
                type="button"
                className="btn btn-sm btn-accent"
                onClick={props.moveUp}
              >
                Up
              </button>
              <button
                type="button"
                className="btn btn-sm btn-accent"
                onClick={props.moveDown}
              >
                Down
              </button>
            </div>
            <div className="card-actions justify-center">
              <button
                type="button"
                className="btn btn-sm btn-warning"
                onClick={props.removeBlock}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-3/4 px-4">
        <div className="card h-full w-full bg-base-100/50 shadow-xl border border-base-200">
          <div className="card-body">
            {/* eslint-disable-next-line @typescript-eslint/no-use-before-define */}
            <LegoBlockForm {...props} />
          </div>
        </div>
      </div>
    </div>
  )
}

Lego.BlockConnect = () => (
  <div className="w-full py-4">
    Down
  </div>
)

Lego.ActionWrapper = (props: ReactPropChildren) => (
  <div className="flex justify-center w-full pt-8 pb-4">
    {props.children}
  </div>
)

Lego.Action = (props: LegoActionProps) => (
  <div>
    <button
      type="button"
      className="btn btn-primary"
      onClick={props.onClick}
    >
      {props.name}
    </button>
  </div>
)

function LegoBlockForm(props: LegoBlockProps) {
  const [chainId, setChainId] = useState<number | undefined>()
  const [protocol, setProtocol] = useState<string | undefined>()
  const [availProtocols, setAvailProtocols] = useState<string[]>()
  const [functions, setFunctions] = useState<ABIFunction[]>([])
  const [fnListLoading, setFnListLoading] = useState<boolean>(false)
  const [selectedFnIdx, setSelectedFnIdx] = useState<number | undefined>()
  const [fnInputs, setFnInputs] = useState<ABIFunctionIO[]>([])

  const [visibleChainModal, setVisibleChainModal] = useState<boolean>(false)
  const [visibleProtocolModal, setVisibleProtocolModal] = useState<boolean>(false)

  useEffect(() => {
    // console.log(chainId, protocol)
    if (typeof chainId === 'undefined' || typeof protocol === 'undefined') return
    (async () => {
      setFnListLoading(true)
      const proto = capitalizeFirstLetter(protocol)
      console.log(buildPreset, proto, chainId)
      const fns = await getABIFunctions(buildPreset[proto][chainId], chainId)
      // console.log(fns)
      setFunctions(fns)
      setFnListLoading(false)
    })()
  }, [chainId, protocol])

  useEffect(() => {
    if (!chainId) return
    setProtocol(undefined)
    setAvailProtocols(getChainProtocols(chainId))
  }, [chainId])

  useEffect(() => {
    if (typeof selectedFnIdx !== 'number') return
    const fnDetail = functions[selectedFnIdx]
    // console.log(fnDetail)
    setFnInputs(fnDetail.inputs)
  }, [selectedFnIdx])

  return (
    <>
      <div className="flex flex-col space-y-4">
        <div className="flex space-x-4 items-start">
          <div>
            <div className="font-bold">Chain</div>
            <button
              type="button"
              onClick={() => setVisibleChainModal(true)}
              className="p-4 bg-accent font-bold rounded shadow"
            >
              {chainId ? ChainIdsReverse[chainId] : 'SELECT'}
            </button>
          </div>
          <div>
            <div className="font-bold">Action</div>
            <button
              type="button"
              onClick={() => {
                if (chainId) setVisibleProtocolModal(true)
              }}
              className={clsx(
                'p-4 bg-accent font-bold rounded shadow',
                !chainId && 'btn-disabled',
              )}
              disabled={!chainId}
            >
              {protocol ?? 'SELECT'}
            </button>
          </div>
          <div>
            <div className="font-bold">Function</div>
            <select
              className="mt-1 select select-sm select-bordered w-full max-w-xs"
              onChange={(e) => {
                if (chainId && protocol) setSelectedFnIdx(parseInt(e.target.value))
              }}
              value={typeof selectedFnIdx === 'number' ? functions[selectedFnIdx].name : undefined}
              disabled={!chainId || !protocol || fnListLoading}
            >
              <option value={undefined}>{fnListLoading ? 'LOADING' : 'SELECT'}</option>
              {
                functions.map((fn, idx) => (
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                  <option key={idx} value={idx}>{fn.name}</option>
                ))
              }
            </select>
          </div>
        </div>
        <div>
          <div className="font-bold">Params</div>
          <div>
            {
              fnInputs.map((fnInput) => (
                <div key={`${fnInput.name}`}>
                  <div>{`${fnInput.type}: ${fnInput.name}`}</div>
                  <input type="text" placeholder="Value" className="input input-sm input-bordered w-full max-w-xs" />
                </div>
              ))
            }
          </div>
        </div>
      </div>

      <Modal open={visibleChainModal}>
        <Modal.Header className="flex font-bold justify-between">
          <div>Select Chain</div>
          <button
            type="button"
            className="p-2 leading-3 rounded bg-accent/50 hover:bg-accent"
            onClick={() => setVisibleChainModal(false)}
          >
            x
          </button>
        </Modal.Header>

        <Modal.Body>
          <div className="grid grid-cols-4 gap-1.5 pt-4">
            {
              SupportedChains.map((chainName) => (
                <button
                  type="button"
                  key={chainName}
                  className="p-4 border rounded bg-white text-sm hover:bg-accent"
                  onClick={() => {
                    setChainId(ChainIds[chainName])
                    setVisibleChainModal(false)
                  }}
                >
                  {chainName}
                </button>
              ))
            }
          </div>
        </Modal.Body>
      </Modal>

      <Modal open={visibleProtocolModal}>
        <Modal.Header className="flex font-bold justify-between">
          <div>Select Action / Protocol</div>
          <button
            type="button"
            className="p-2 leading-3 rounded bg-accent/50 hover:bg-accent"
            onClick={() => setVisibleProtocolModal(false)}
          >
            x
          </button>
        </Modal.Header>

        <Modal.Body>
          <div className="grid grid-cols-4 gap-1.5 pt-4">
            {
              availProtocols && availProtocols.length
                ? availProtocols.map((protocolName) => (
                  <button
                    type="button"
                    key={protocolName}
                    className="p-4 border rounded bg-white text-sm hover:bg-accent"
                    onClick={() => {
                      setProtocol(protocolName)
                      setVisibleProtocolModal(false)
                    }}
                  >
                    {protocolName}
                  </button>
                )) : (<div>No Protocols available!</div>)
            }
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

Lego.BlockRenderer = (props: { blocks: LegoBlocks }): JSX.Element => {
  const LegoBlockElements = props.blocks.map((block: LegoBlockBuilder, idx) => (
    <Lego.Block
      key={idx}
      {...block}
    />
  ))
  return <>{LegoBlockElements}</>
}

export default Lego
