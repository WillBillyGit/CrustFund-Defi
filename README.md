# 🥐 CrustFund: The Degen Crumb Converter

**CrustFund** is the ultimate kitchen for your neglected crypto crumbs. Stop letting dust accumulate in your wallet—bake those tiny, worthless balances into one fresh loaf of native assets!

![CrustFund Banner](public/crustfundsweeper.jpg)

## 🥯 What is it?
Degens naturally accumulate hundreds of "crumbs"—tiny balances of tokens from previous trades, rugs, or random airdrops that are too small to swap individually due to gas costs. **CrustFund** sweeps these selected crumbs together and "bakes" them into a single asset (like ETH on Base) in a single transaction, saving you gas and cleaning up your portfolio.

## ✨ Features
- **Real-Time Sync**: Powered by **Alchemy**, instantly see every crumb in your jar across multiple chains.
- **Degen Pricing**: Integrated with **DexScreener** for real-time price discovery of even the most obscure tokens.
- **Safety First**: Every crumb is scanned by **GoPlus Security** to show you the risk score before you bake.
- **One-Click Cleaning**: Select multiple tokens and "Bake" them into native tokens in one go.
- **High-Energy UI**: A messy, vibrant, brewery/bakery-inspired interface that captures the high-stakes energy of on-chain trading.

## 🚀 Live on Base
The oven is currently hot on **Base Mainnet**!
- **Contract Address**: `0x0CDcD1499558C603B0244C66E7f9561C94dC3f31`
- *More chains (Ethereum, Polygon, Arbitrum, BSC, Avalanche) heating up soon...*

## 🛠️ Tech Stack
- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Web3**: ethers.js
- **Animations**: Framer Motion
- **APIs**:
  - **Alchemy**: Multi-chain token balances and metadata.
  - **DexScreener**: Real-time price feeds for all degen pairs.
  - **GoPlus**: Token security audit and risk scores.

## 🧑‍🍳 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Alchemy API Key](https://www.alchemy.com/)
- An EVM-compatible wallet (MetaMask, Rabby, etc.)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-username/crustfund.git

# Install dependencies
npm install

# Set up your environment
cp .env.example .env
```

### 3. Environment Variables
Add your Alchemy API key to `.env`:
```env
VITE_ALCHEMY_API_KEY=your_alchemy_key_here
```

### 4. Run Development Server
```bash
npm run dev
```

## ⚠️ Disclaimer
**CrustFund** is built for degens. Crypto markets are volatile, and "crumbs" can often be high-risk tokens. The chef's fee is 5% to keep the oven running. Use at your own risk. Not financial, nutritional, or technical advice.

---
*Made with 🥐 by CrustFund Team*
