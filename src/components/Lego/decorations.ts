// bg images
import UniswapBgImg from '../../assets/platforms/Uniswap/bg/Uniswap_Image_01.png'
// logos
import thinkingFace from '../../assets/emojis/thinking-face.svg'
import UniswapLogo from '../../assets/platforms/Uniswap/logo/256x256_Black-1.png'
import AaveLogo from '../../assets/platforms/Aave/logo/aave_ghost_gradient.svg'

export const LegoBlockPlatformDisplayNames: { [key: string]: string } = {
  select: 'Select',
  unknown: 'Unknown',
  uniswap_v2: 'Uniswap V2',
  uniswap_v3: 'Uniswap V3',
  aave_v2: 'Aave v2',
  aave_v3: 'Aave v3',
}

export const LegoBlockPlatformBackgrounds: { [key: string]: string | undefined } = {
  select: undefined,
  unknown: undefined,
  uniswap_v2: UniswapBgImg,
  uniswap_v3: UniswapBgImg,
  aave_v2: 'https://placeimg.com/400/225/arch',
  aave_v3: 'https://placeimg.com/400/225/arch',
}

export const LegoBlockPlatformLogos: { [key: string]: string } = {
  select: thinkingFace,
  unknown: thinkingFace,
  uniswap_v2: UniswapLogo,
  uniswap_v3: UniswapLogo,
  aave_v2: AaveLogo,
  aave_v3: AaveLogo,
}

enum SupportedChains {
  Ethereum = 'Ethereum',
  // Avalanche = 'Avalanche',
  Fantom = 'Fantom',
}

interface ContractCall {
  chain: SupportedChains
  address: string
  parameters: {
    type: string
    value: string
  }[]
}

type ContractCalls = ContractCall[]
