export interface Token {
  id: string;
  symbol: string;
  name: string;
  balance: string;
  valueUsd: number;
  icon?: string;
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
  { id: 'base', name: 'Base', icon: '🔵', stickerUrl: 'Base_sticker.png', nativeCurrency: 'ETH', chainId: 8453 },
  { id: 'eth', name: 'Ethereum', icon: '💎', stickerUrl: 'Ethereum_sticker.png', nativeCurrency: 'ETH', chainId: 1 },
  { id: 'polygon', name: 'Polygon', icon: '🟣', stickerUrl: 'Polygon_sticker.png', nativeCurrency: 'POL', chainId: 137 },
  { id: 'avalanche', name: 'Avalanche', icon: '🔺', stickerUrl: 'Avalanche_sticker.png', nativeCurrency: 'AVAX', chainId: 43114 },
  { id: 'bsc', name: 'BSC', icon: '🟡', stickerUrl: 'BSC_sticker.png', nativeCurrency: 'BNB', chainId: 56 },
  { id: 'arbitrum', name: 'Arbitrum', icon: '💙', stickerUrl: 'Arbitrum_sticker.png', nativeCurrency: 'ETH', chainId: 42161 },
];

export const MOCK_CRUMBS: Record<string, Token[]> = {
  base: [
    { id: '12', symbol: 'BRETT', name: 'Brett', balance: '1000000', valueUsd: 1.50 },
    { id: '13', symbol: 'TOSHI', name: 'Toshi', balance: '50000', valueUsd: 0.85 },
    { id: '14', symbol: 'DEGEN', name: 'Degen', balance: '1200', valueUsd: 0.12 },
  ],
  eth: [
    { id: '1', symbol: 'PEPE', name: 'Pepe', balance: '1240500', valueUsd: 0.45 },
    { id: '2', symbol: 'SHIB', name: 'Shiba Inu', balance: '50000', valueUsd: 1.20 },
    { id: '3', symbol: 'LINK', name: 'Chainlink', balance: '0.005', valueUsd: 0.08 },
  ],
  polygon: [
    { id: '8', symbol: 'QUICK', name: 'QuickSwap', balance: '0.01', valueUsd: 0.15 },
    { id: '9', symbol: 'WMATIC', name: 'Wrapped Matic', balance: '0.5', valueUsd: 0.30 },
  ],
  avalanche: [
    { id: '10', symbol: 'JOE', name: 'Trader Joe', balance: '1.2', valueUsd: 0.45 },
    { id: '11', symbol: 'QI', name: 'Benqi', balance: '50', valueUsd: 0.25 },
  ],
  bsc: [
    { id: '4', symbol: 'CAKE', name: 'PancakeSwap', balance: '0.12', valueUsd: 0.35 },
    { id: '5', symbol: 'SAFEMOON', name: 'SafeMoon', balance: '1000000', valueUsd: 0.01 },
  ],
};
