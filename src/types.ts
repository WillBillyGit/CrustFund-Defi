export interface Token {
  id: string;
  symbol: string;
  name: string;
  balance: string;
  valueUsd: number;
  currentPriceUsd?: number;
  coingeckoId?: string;
  icon?: string;
  risk?: {
    isHoneypot?: boolean;
    isUnverified?: boolean;
    isPhishing?: boolean;
    buyTax?: string;
    sellTax?: string;
    score: number; // 0 to 100, where 100 is safe
  };
}

export interface Network {
  id: string;
  name: string;
  icon: string;
  stickerUrl?: string;
  nativeCurrency: string;
  chainId?: number;
}

export const NETWORKS: Network[] = [
  { id: 'base', name: 'Base', icon: '🔵', stickerUrl: '/base.png', nativeCurrency: 'ETH', chainId: 8453 },
  { id: 'eth', name: 'Ethereum', icon: '💎', stickerUrl: '/ethereum.png', nativeCurrency: 'ETH', chainId: 1 },
  { id: 'polygon', name: 'Polygon', icon: '🟣', stickerUrl: '/ethereum.png', nativeCurrency: 'POL', chainId: 137 },
  { id: 'avalanche', name: 'Avalanche', icon: '🔺', stickerUrl: '/avalanche.png', nativeCurrency: 'AVAX', chainId: 43114 },
  { id: 'bsc', name: 'BSC', icon: '🟡', stickerUrl: '/bsc.png', nativeCurrency: 'BNB', chainId: 56 },
  { id: 'arbitrum', name: 'Arbitrum', icon: '💙', stickerUrl: '/arbitrum.png', nativeCurrency: 'ETH', chainId: 42161 },
];

export const MOCK_CRUMBS: Record<string, Token[]> = {
  base: [
    { id: '0x532f27101965dd1a5c9539c311c99f149653a9cd', symbol: 'BRETT', name: 'Brett', balance: '1000000', valueUsd: 1.50, coingeckoId: 'based-brett', icon: 'https://assets.coingecko.com/coins/images/35492/standard/brett.png' },
    { id: '0xac1bd24658511a126d2416166451a974bc07e4aa', symbol: 'TOSHI', name: 'Toshi', balance: '50000', valueUsd: 0.85, coingeckoId: 'toshi', icon: 'https://assets.coingecko.com/coins/images/31333/standard/toshi.png' },
    { id: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed', symbol: 'DEGEN', name: 'Degen', balance: '1200', valueUsd: 0.12, coingeckoId: 'degen-base', icon: 'https://assets.coingecko.com/coins/images/34515/standard/degen.png' },
  ],
  eth: [
    { id: '0x6982508145454ce325ddbe47a25d4ec3d2311933', symbol: 'PEPE', name: 'Pepe', balance: '1240500', valueUsd: 0.45, coingeckoId: 'pepe', icon: 'https://assets.coingecko.com/coins/images/29850/standard/pepe-token.png' },
    { id: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce', symbol: 'SHIB', name: 'Shiba Inu', balance: '50000', valueUsd: 1.20, coingeckoId: 'shiba-inu', icon: 'https://assets.coingecko.com/coins/images/11939/standard/shiba.png' },
    { id: '0x514910771af9ca656af840dff83e8264ecf986ca', symbol: 'LINK', name: 'Chainlink', balance: '0.005', valueUsd: 0.08, coingeckoId: 'chainlink', icon: 'https://assets.coingecko.com/coins/images/877/standard/chainlink.png' },
  ],
  polygon: [
    { id: '0xb5c064f985400a01062045416c41d545366424ca', symbol: 'QUICK', name: 'QuickSwap', balance: '0.01', valueUsd: 0.15, coingeckoId: 'quickswap', icon: 'https://assets.coingecko.com/coins/images/13970/standard/quick.png' },
    { id: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', symbol: 'WMATIC', name: 'Wrapped Matic', balance: '0.5', valueUsd: 0.30, coingeckoId: 'wmatic', icon: 'https://assets.coingecko.com/coins/images/14073/standard/matic.png' },
  ],
  avalanche: [
    { id: '0x6e84a6216ea6d082d73095012d4a5d099d15c66f', symbol: 'JOE', name: 'Trader Joe', balance: '1.2', valueUsd: 0.45, coingeckoId: 'trader-joe', icon: 'https://assets.coingecko.com/coins/images/17567/standard/trader_joe.png' },
    { id: '0x5f08d08cb769ecb3a2072e164ea20f0f35359a3c', symbol: 'QI', name: 'Benqi', balance: '50', valueUsd: 0.25, coingeckoId: 'benqi', icon: 'https://assets.coingecko.com/coins/images/15102/standard/benqi.png' },
  ],
  bsc: [
    { id: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82', symbol: 'CAKE', name: 'PancakeSwap', balance: '0.12', valueUsd: 0.35, coingeckoId: 'pancakeswap-token', icon: 'https://assets.coingecko.com/coins/images/12632/standard/pancakeswap.png' },
    { id: '0x8b3192f5e1829f0ce0402931a55957d903932782', symbol: 'SAFEMOON', name: 'SafeMoon', balance: '1000000', valueUsd: 0.01, coingeckoId: 'safemoon-2', icon: 'https://assets.coingecko.com/coins/images/14362/standard/safemoon.png' },
  ],
};
