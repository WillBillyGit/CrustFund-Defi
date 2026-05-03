import React, { useState, useEffect, useMemo } from 'react';
import { ethers } from 'ethers';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, 
  Wallet, 
  RefreshCw, 
  AlertTriangle, 
  ChevronDown, 
  ExternalLink,
  Coins,
  History,
  TrendingUp,
  Settings,
  Info
} from 'lucide-react';

// --- Constants & Types ---

const CRUMB_ABI = [
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
  "function balanceOf(address) view returns (uint256)",
  "function allowance(address, address) view returns (uint256)",
  "function approve(address, uint256) returns (bool)"
];

const SWEEPER_ABI = [
  "function bakeCrumbs(address[] calldata tokens, uint256[] calldata amounts) external",
  "function getCrumbBalance(address user) view returns (uint256)"
];

const CONTRACT_ADDRESSES: Record<string, string> = {
  base: "0x69689fF688231367069904323e0319777997876a", // CrustFund Swaper on Base
  eth: "0x0000000000000000000000000000000000000000",
  polygon: "0x0000000000000000000000000000000000000000",
  avalanche: "0x0000000000000000000000000000000000000000"
};

interface TokenData {
  id: string;
  symbol: string;
  name: string;
  balance: string;
  rawBalance: bigint;
  decimals: number;
  priceUsd: number;
  valueUsd: number;
  logoUrl?: string;
}

// --- Sub-Components ---

const MemeMascot = ({ progress, isBaking }: { progress: number; isBaking: boolean }) => {
  return (
    <div className="relative w-64 h-64 mx-auto mb-8 flex items-center justify-center">
      <AnimatePresence>
        {isBaking && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-orange-500 rounded-full blur-3xl"
          />
        )}
      </AnimatePresence>

      <motion.div
        animate={isBaking ? { y: [0, -10, 0], rotate: [-1, 1, -1] } : { y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 w-full h-full"
      >
        <img
          src={isBaking ? "/crustfundlogo.jpg" : "/mascot-sad.png"}
          alt="Mascot"
          className={`w-full h-full object-contain rounded-2xl border-4 border-amber-900/20 shadow-xl transition-all duration-500 ${
            isBaking ? "sepia-0 brightness-110" : "grayscale opacity-80"
          }`}
        />
      </motion.div>

      <svg className="absolute inset-0 w-full h-full -rotate-90">
        <circle cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-black/5" />
        <motion.circle
          cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="8" fill="transparent"
          strokeDasharray="754"
          initial={{ strokeDashoffset: 754 }}
          animate={{ strokeDashoffset: 754 - (754 * progress) / 100 }}
          className="text-orange-500"
        />
      </svg>
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [account, setAccount] = useState<string | null>(null);
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isBaking, setIsBaking] = useState(false);
  const [bakeProgress, setBakeProgress] = useState(0);
  const [selectedTokens, setSelectedTokens] = useState<Set<string>>(new Set());
  const [network, setNetwork] = useState('base');

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Please install MetaMask");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      fetchBalances(accounts[0]);
    } catch (err) {
      console.error("Connection failed", err);
    }
  };

  const fetchBalances = async (address: string) => {
    setLoading(true);
    // Note: In a real app, use an indexer or Alchemy's getTokenBalances
    // This is a simplified mock for the UI logic
    setTimeout(() => {
      setTokens([
        { id: "0x123...", symbol: "DUST", name: "Dust Token", balance: "100.0", rawBalance: 100n, decimals: 18, priceUsd: 0.01, valueUsd: 1.00 },
        { id: "0x456...", symbol: "CRUMB", name: "Crumb Asset", balance: "50.5", rawBalance: 50n, decimals: 18, priceUsd: 0.02, valueUsd: 1.01 }
      ]);
      setLoading(false);
    }, 1000);
  };

  const handleBake = async () => {
    if (!account || selectedTokens.size === 0) return;
    setIsBaking(true);
    setBakeProgress(10);
    
    try {
      // Logic for approvals and bakeCrumbs contract call goes here
      setBakeProgress(50);
      // Simulate transaction
      await new Promise(r => setTimeout(r, 2000));
      setBakeProgress(100);
      alert("Successfully baked your crumbs!");
    } catch (err) {
      console.error(err);
    } finally {
      setIsBaking(false);
      setBakeProgress(0);
    }
  };

  const totalValue = useMemo(() => 
    tokens.reduce((acc, t) => acc + (selectedTokens.has(t.id) ? t.valueUsd : 0), 0),
  [tokens, selectedTokens]);

  return (
    <div className="min-h-screen bg-[#FDF6E3] text-amber-950 font-sans p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 p-2 rounded-xl rotate-3 shadow-lg">
              <Flame className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black tracking-tight italic">CRUST FUND</h1>
          </div>
          
          <button 
            onClick={connectWallet}
            className="group relative px-6 py-3 bg-white border-4 border-amber-900 rounded-2xl font-bold shadow-[4px_4px_0px_0px_rgba(120,67,24,1)] hover:translate-y-1 hover:shadow-none transition-all"
          >
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Connect Wallet"}
            </div>
          </button>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Mascot & Status */}
          <div className="flex flex-col items-center justify-center space-y-6">
            <MemeMascot progress={bakeProgress} isBaking={isBaking} />
            <div className="text-center">
              <h2 className="text-4xl font-black mb-2">
                {isBaking ? "BAKING IN PROGRESS..." : "YOUR PANTRY IS DUSTY"}
              </h2>
              <p className="text-lg opacity-70 font-medium">
                {tokens.length} tiny balances found. Turn them into something tasty.
              </p>
            </div>
          </div>

          {/* Right Column: Pantry/Token List */}
          <div className="bg-white border-4 border-amber-900 rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black flex items-center gap-2">
                <Coins className="w-6 h-6" /> THE PANTRY
              </h3>
              <span className="bg-amber-100 px-3 py-1 rounded-full text-sm font-bold border-2 border-amber-900/10">
                {selectedTokens.size} Selected
              </span>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {tokens.map((token) => (
                <div 
                  key={token.id}
                  onClick={() => {
                    const next = new Set(selectedTokens);
                    next.has(token.id) ? next.delete(token.id) : next.add(token.id);
                    setSelectedTokens(next);
                  }}
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedTokens.has(token.id) 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-amber-900/10 hover:border-amber-900/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 border-2 border-amber-900/10 flex items-center justify-center font-bold">
                      {token.symbol[0]}
                    </div>
                    <div>
                      <div className="font-black text-sm">{token.symbol}</div>
                      <div className="text-xs opacity-50">{token.balance}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm">${token.valueUsd.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Area */}
            <div className="mt-8 pt-6 border-t-4 border-dashed border-amber-900/10">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <div className="text-xs font-black opacity-40 uppercase tracking-widest">Total Value</div>
                  <div className="text-3xl font-black text-orange-600">${totalValue.toFixed(2)}</div>
                </div>
                <button
                  onClick={handleBake}
                  disabled={isBaking || selectedTokens.size === 0}
                  className="px-8 py-4 bg-orange-500 text-white border-4 border-amber-900 rounded-2xl font-black text-xl shadow-[4px_4px_0px_0px_rgba(120,67,24,1)] hover:translate-y-1 hover:shadow-none disabled:opacity-50 disabled:cursor-not-allowed transition-all uppercase tracking-tight"
                >
                  {isBaking ? "Baking..." : "Bake into Crumbs"}
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Footer Info */}
        <footer className="mt-16 flex flex-wrap justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
           <div className="flex items-center gap-2 font-bold"><TrendingUp size={16}/> Powered by Base</div>
           <div className="flex items-center gap-2 font-bold"><Settings size={16}/> Low Slippage</div>
           <div className="flex items-center gap-2 font-bold"><Info size={16}/> 0.3% Burn Fee</div>
        </footer>
      </div>
    </div>
  );
}
