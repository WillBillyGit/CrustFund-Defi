import React, { useState, useEffect, useCallback } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, 
  Wallet, 
  History, 
  RefreshCw, 
  ChevronRight, 
  Info, 
  AlertCircle,
  Zap,
  Utensils,
  Layers,
  Coins,
  Flame,
  ChefHat,
  Cookie,
  ArrowRightLeft,
  Rocket,
  TrendingUp,
  Skull,
  Ghost,
  Smile,
  ShieldAlert,
  ShieldCheck,
  Ban,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NETWORKS, MOCK_CRUMBS, Token, Network } from './types';
import { cn } from '@/lib/utils';
import { ethers } from 'ethers';

// --- Components ---

const MemeMascot = ({ progress, isBaking }: { progress: number, isBaking: boolean }) => {
  return (
    <div className="relative w-72 h-72 mx-auto mb-12">
      {/* The Burger Chef / Mascot */}
      <motion.div 
        className="absolute inset-0 z-10"
        animate={isBaking ? { 
          scale: [1, 1.1, 1], 
          rotate: [-5, 5, -5],
          filter: ["hue-rotate(0deg)", "hue-rotate(90deg)", "hue-rotate(0deg)"]
        } : { y: [0, -10, 0] }}
        transition={{ duration: 0.3, repeat: Infinity }}
      >
        <img 
          src={isBaking ? "/mascot-baking.jpg" : "/mascot-happy.jpg"} 
          alt="Mascot" 
          className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
          referrerPolicy="no-referrer"
        />
      </motion.div>

      {/* Floating Meme Icons */}
      <AnimatePresence>
        {isBaking && [Rocket, TrendingUp, Skull, Ghost, Smile].map((Icon, i) => (
          <motion.div
            key={i}
            initial={{ y: 0, opacity: 0, x: (i - 2) * 40 }}
            animate={{ y: -200, opacity: [0, 1, 0], x: (i - 2) * 80, rotate: 720 }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
            className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20"
          >
            <div className="bg-oven-orange border-4 border-messy-border rounded-full p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
              <Icon className="w-8 h-8 text-white fill-white/20" />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

const RewardModal = ({ isOpen, onClose, amount, networkName }: { isOpen: boolean, onClose: () => void, amount: string, networkName: string }) => {
  const addCrumbToWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              address: CRUMB_TOKEN_BASE,
              symbol: 'CRUMB',
              decimals: 18,
              image: 'https://crust.fund/logo.jpg', 
            },
          },
        });
      } catch (error) {
        console.error("Error adding token to wallet", error);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0, rotate: 10 }}
            className="sweeper-card max-w-lg w-full relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4">
              <Button variant="ghost" size="icon" onClick={onClose} className="text-crust hover:bg-crust/10">
                <AlertCircle className="w-6 h-6 rotate-45" />
              </Button>
            </div>

            <div className="p-12 text-center space-y-8">
              <div className="relative">
                <motion.div 
                  className="w-32 h-32 mx-auto bg-bakery-blue rounded-full border-8 border-messy-border flex items-center justify-center shadow-lg"
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  <Cookie className="w-16 h-16 text-crust" />
                </motion.div>
                <div className="absolute -top-4 -right-4">
                  <Badge className="bg-oven-orange text-white border-2 border-meme-black p-2 rounded-lg shadow-huge animate-bounce">
                    BONUS REWARD!
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-4xl font-display text-crust uppercase italic tracking-tighter comic-text">
                  KITCHEN SPECIAL!
                </h3>
                <p className="text-lg font-bold text-crust/70 leading-relaxed">
                  The Chef loved your bake! As a bonus, you've earned a batch of <span className="text-crust">$CRUMB</span> tokens.
                </p>
              </div>

              <div className="p-8 bg-bakery-blue/10 border-4 border-dashed border-messy-border rounded-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-white/5 group-hover:translate-x-full transition-transform duration-1000 -translate-x-full" />
                <div className="text-5xl font-display text-crust comic-text">
                  +{amount} $CRUMB
                </div>
                <div className="mt-2 text-[10px] font-black uppercase tracking-[0.2em] text-crust/40">
                  Transaction Verified • {networkName} Chain
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <Button 
                  onClick={addCrumbToWallet}
                  className="meme-button meme-button-primary w-full py-8 text-xl"
                >
                  ADD $CRUMB TO WALLET
                </Button>
                <Button 
                  variant="outline" 
                  onClick={onClose}
                  className="border-4 border-messy-border text-crust hover:bg-parchment py-8 font-black uppercase tracking-widest text-xs"
                >
                  KEEP BAKING
                </Button>
              </div>

              <p className="text-[10px] font-bold text-crust/30 uppercase tracking-widest">
                Bonus rewards are sent automatically to your wallet. Use them to unlock special deals in the CrustFund bakery!
              </p>
            </div>

            <Sparkles count={30} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

interface TokenCardProps {
  token: Token;
  isSelected: boolean;
  onToggle: () => void;
  key?: React.Key;
}

const TokenCard = ({ token, isSelected, onToggle }: TokenCardProps) => {
  const isRisky = token.risk && (token.risk.score < 60 || token.risk.isHoneypot || token.risk.isPhishing || token.risk.isUnverified);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      onClick={onToggle}
      className={cn(
        "p-6 rounded-lg border-4 cursor-pointer transition-all flex flex-col mb-4 relative",
        isSelected 
          ? "bg-oven-orange/20 border-oven-orange text-crust shadow-[inset_0_0_15px_rgba(255,140,0,0.1)]" 
          : "bg-meme-black/70 border-messy-border hover:border-oven-orange/50",
        isRisky && "border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.2)]"
      )}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-lg bg-meme-black border-4 border-messy-border flex items-center justify-center font-display text-2xl text-parchment shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] overflow-hidden">
            {token.icon ? (
              <img 
                src={token.icon} 
                alt={token.symbol} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : null}
            <div className={cn("w-full h-full items-center justify-center", token.icon ? "hidden" : "flex")}>
              {token.symbol[0]}
            </div>
          </div>
          <div>
            <div className="font-display text-2xl uppercase tracking-wider flex items-center gap-2 text-oven-orange">
              {token.symbol}
              {token.risk && (
                token.risk.isHoneypot ? (
                  <Ban className="w-5 h-5 text-red-500" title="Possible Honeypot!" />
                ) : isRisky ? (
                  <ShieldAlert className="w-5 h-5 text-red-500" title="High Risk Token" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-green-500" title="Security Verified" />
                )
              )}
            </div>
            <div className={cn("text-xs font-bold", isSelected ? "text-crust" : "text-parchment/60")}>{token.name}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-lg font-bold text-crust">{token.balance}</div>
          <div className="flex flex-col items-end">
            <div className={cn("text-sm font-bold font-mono", isSelected ? "text-oven-orange" : "text-oven-orange/70")}>
              ${token.valueUsd.toFixed(2)}
            </div>
            <div className={cn("text-[8px] font-black uppercase tracking-tighter opacity-40", isSelected ? "text-crust" : "text-parchment")}>
              {token.currentPriceUsd ? `$${token.currentPriceUsd.toLocaleString(undefined, { maximumFractionDigits: 6 })}` : '...'}
            </div>
          </div>
        </div>
      </div>

      {token.risk && (isRisky || token.risk.buyTax || token.risk.sellTax) && (
        <div className={cn(
          "mt-4 p-2 rounded-xl border-2 flex flex-wrap gap-2 text-[10px] uppercase font-black",
          isSelected ? "bg-white/10 border-white/20" : "bg-meme-black/5 border-meme-black/10"
        )}>
          {token.risk.isHoneypot && <Badge variant="destructive" className="bg-red-600">HONEYPOT</Badge>}
          {token.risk.isUnverified && <Badge variant="outline" className="text-orange-500 border-orange-500">UNVERIFIED</Badge>}
          {token.risk.isPhishing && <Badge variant="destructive" className="bg-red-800">SCAM</Badge>}
          {(token.risk.buyTax || token.risk.sellTax) && (
            <span className="flex items-center gap-1">
              TAX: {token.risk.buyTax || '0'}% | {token.risk.sellTax || '0'}%
            </span>
          )}
          <span className={cn(
            "ml-auto font-mono",
            token.risk.score > 80 ? "text-green-500" : token.risk.score > 50 ? "text-orange-500" : "text-red-500"
          )}>
            SAFETY: {token.risk.score}/100
          </span>
        </div>
      )}

      {isSelected && isRisky && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 bg-red-500/20 border-2 border-red-500 p-2 rounded-xl flex items-center gap-2 text-[10px] text-red-500 font-bold"
        >
          <AlertCircle className="w-4 h-4" />
          DYOR! THIS TOKEN HAS RED FLAGS. BAKE WITH CAUTION.
        </motion.div>
      )}
    </motion.div>
  );
};

declare global {
  interface Window {
    ethereum?: any;
  }
}

// --- Constants & Types ---

// PROD CONTRACTS - Replace with your actual deployed addresses!
const CONTRACT_ADDRESSES: Record<string, string> = {
  base: "0x0CDcD1499558C603B0244C66E7f9561C94dC3f31",
  eth: "0x0000000000000000000000000000000000000000",
  polygon: "0x0000000000000000000000000000000000000000",
  avalanche: "0x0000000000000000000000000000000000000000",
  bsc: "0x6f2a94532a391aa66a79098cab033dd303bd2790",
  arbitrum: "0xDD76B610865cc82196AaB39d73E6028a5d96C7Aa",
};

const CRUMB_TOKEN_BASE = "0xa6de7624947d2b56d5d3f0351452d369428cec73";

const SWEEPER_ABI = [
  "function bakeCrumbs(address[] tokens, uint256[] amountsIn, uint256[] minAmountsOut) external",
  "event CrumbsBaked(address indexed user, uint256 totalReceived, uint256 feeTaken)"
];

const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  "function decimals() external view returns (uint8)"
];

const Sparkles = ({ count = 20 }: { count?: number }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="sparkle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            opacity: Math.random() * 0.5 + 0.2,
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
          }}
        />
      ))}
    </div>
  );
};

export default function App() {
  const [selectedNetwork, setSelectedNetwork] = useState<Network>(NETWORKS[0]);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [selectedTokens, setSelectedTokens] = useState<Set<string>>(new Set());
  const [isBaking, setIsBaking] = useState(false);
  const [bakeProgress, setBakeProgress] = useState(0);
  const [account, setAccount] = useState<string | null>(null);
  const [isLoadingPrices, setIsLoadingPrices] = useState(false);
  const [isLoadingRisk, setIsLoadingRisk] = useState(false);
  const [bakingStatus, setBakingStatus] = useState<string>("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [showBonusClaim, setShowBonusClaim] = useState(false);
  const [earnedBonus, setEarnedBonus] = useState("0");
  const [crumbBalance, setCrumbBalance] = useState<string>("0");
  const CHEF_FEE_PERCENT = 5; // 5% fee for profitability

  const ALCHEMY_KEY = (import.meta as any).env.VITE_ALCHEMY_API_KEY;

  // Fetch real $CRUMB balance from Base
  const fetchCrumbBalance = useCallback(async (userAddress: string) => {
    if (selectedNetwork.id !== 'base' || !window.ethereum) return;
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const crumbContract = new ethers.Contract(CRUMB_TOKEN_BASE, ["function balanceOf(address) view returns (uint256)"], provider);
      const balance = await crumbContract.balanceOf(userAddress);
      setCrumbBalance(ethers.formatUnits(balance, 18));
    } catch (err) {
      console.error("Error fetching $CRUMB balance:", err);
    }
  }, [selectedNetwork.id]);

  // Fetch real-time prices from DexScreener (more resilient implementation)
  const fetchPrices = async () => {
    if (!tokens.length) return;

    setIsLoadingPrices(true);
    try {
      // Filter out any invalid addresses and limit to DexScreener batch size (30)
      const validAddresses = tokens
        .map(t => t.id)
        .filter(id => id && id.startsWith('0x'))
        .slice(0, 30);

      if (validAddresses.length === 0) return;

      const addresses = validAddresses.join(',');
      
      // Use a more standard fetch with timeout/signal support if needed, but keeping it simple for now
      // Added cache: 'no-cache' and mode: 'cors' to try and bypass browser-level caching/CORS issues
      const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${addresses}`, {
        method: 'GET',
        headers: { 
          'Accept': 'application/json'
        },
        mode: 'cors',
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        throw new Error(`Price fetch failed with status: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.pairs && data.pairs.length > 0) {
        setTokens(prev => prev.map(token => {
          const tokenAddress = token.id.toLowerCase();
          const pairs = data.pairs.filter((p: any) => 
            p.baseToken.address.toLowerCase() === tokenAddress || 
            p.quoteToken.address.toLowerCase() === tokenAddress
          );
          
          if (pairs.length > 0) {
            // Prefer pairs where the token is the base token
            const basePairs = pairs.filter((p: any) => p.baseToken.address.toLowerCase() === tokenAddress);
            const targetPairs = basePairs.length > 0 ? basePairs : pairs;

            // Sort by liquidity to get the most reliable price
            const bestPair = targetPairs.sort((a: any, b: any) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0))[0];
            const newPrice = parseFloat(bestPair.priceUsd);
            
            if (!isNaN(newPrice)) {
              return {
                ...token,
                currentPriceUsd: newPrice,
                valueUsd: parseFloat(token.balance) * newPrice
              };
            }
          }
          return token;
        }));
      }
    } catch (error: any) {
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        console.warn("DexScreener API blocked by browser/network. This is usually CORS or an ad-blocker.");
      } else {
        console.error("DexScreener API Error:", error);
      }
    } finally {
      setIsLoadingPrices(false);
    }
  };

  // Fetch token risk scores from GoPlus Security
  const fetchRiskScores = async () => {
    if (!tokens.length || !selectedNetwork.chainId) return;

    setIsLoadingRisk(true);
    try {
      const addresses = tokens.map(t => t.id).join(',');
      const response = await fetch(
        `https://api.gopluslabs.io/api/v1/token_security/${selectedNetwork.chainId}?contract_addresses=${addresses}`
      );
      
      if (!response.ok) {
        throw new Error(`Risk fetch failed with status: ${response.status}`);
      }

      const res = await response.json();
      const riskData = res.result;

      if (riskData) {
        setTokens(prev => prev.map(token => {
          const security = riskData[token.id.toLowerCase()];
          if (security) {
            // Calculate a basic safety score
            let score = 100;
            if (security.is_honeypot === "1") score -= 80;
            if (security.is_open_source === "0") score -= 30;
            if (security.is_proxy === "1") score -= 10;
            if (security.owner_address === "0x0000000000000000000000000000000000000000") score += 5;
            
            // Tax impact
            const buyTax = parseFloat(security.buy_tax || "0") * 100;
            const sellTax = parseFloat(security.sell_tax || "0") * 100;
            if (buyTax > 10 || sellTax > 10) score -= 20;
            if (buyTax > 50 || sellTax > 50) score -= 50;

            return {
              ...token,
              risk: {
                isHoneypot: security.is_honeypot === "1",
                isUnverified: security.is_open_source === "0",
                isPhishing: security.is_phishing_external === "1",
                buyTax: buyTax.toFixed(1),
                sellTax: sellTax.toFixed(1),
                score: Math.max(0, Math.min(100, score))
              }
            };
          }
          return token;
        }));
      }
    } catch (error) {
      console.error("Failed to fetch risk scores:", error);
    } finally {
      setIsLoadingRisk(false);
    }
  };

  // Fetch real-time balances from Alchemy
  const fetchRealBalances = useCallback(async (address: string, network: Network) => {
    if (!ALCHEMY_KEY || !address) return;
    
    setIsSyncing(true);
    try {
      // Map common network IDs to Alchemy subdomains
      const subdomains: Record<string, string> = {
        base: 'base-mainnet',
        eth: 'eth-mainnet',
        polygon: 'polygon-mainnet',
        arbitrum: 'arb-mainnet',
        bsc: 'bnb-mainnet',
        avalanche: 'avax-mainnet'
      };

      const subdomain = subdomains[network.id] || 'eth-mainnet';
      const url = `https://${subdomain}.g.alchemy.com/v2/${ALCHEMY_KEY}`;

      // 1. Get Token Balances
      const balanceResponse = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'alchemy_getTokenBalances',
          params: [address],
          id: 1,
        }),
      });

      const balanceData = await balanceResponse.json();
      const balances = balanceData.result?.tokenBalances || [];

      // Only care about tokens with positive balances
      const nonZeroBalances = balances.filter((b: any) => b.tokenBalance !== '0x0000000000000000000000000000000000000000000000000000000000000000');

      // 2. Fetch Metadata for these tokens (limited to batch of 10 for performance)
      const tokenList: Token[] = [];
      const batch = nonZeroBalances.slice(0, 10);

      for (const b of batch) {
        const metadataResponse = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'alchemy_getTokenMetadata',
            params: [b.contractAddress],
            id: 1,
          }),
        });
        const meta = await metadataResponse.json();
        const result = meta.result;

        if (result && result.symbol) {
          const rawBalance = b.tokenBalance;
          const decimals = result.decimals || 18;
          const formattedBalance = (parseInt(rawBalance, 16) / Math.pow(10, decimals)).toString();

          tokenList.push({
            id: b.contractAddress,
            symbol: result.symbol,
            name: result.name || result.symbol,
            balance: formattedBalance,
            valueUsd: 0, // Will be filled by fetchPrices
            icon: result.logo || `https://api.dicebear.com/7.x/identicon/svg?seed=${b.contractAddress}`,
          });
        }
      }

      setTokens(tokenList.length > 0 ? tokenList : (MOCK_CRUMBS[network.id] || []));
    } catch (error) {
      console.error("Alchemy Sync Error:", error);
      setTokens(MOCK_CRUMBS[network.id] || []);
    } finally {
      setIsSyncing(false);
    }
  }, [ALCHEMY_KEY]);

  useEffect(() => {
    if (account) {
      fetchRealBalances(account, selectedNetwork);
      fetchCrumbBalance(account);
    } else {
      setTokens(MOCK_CRUMBS[selectedNetwork.id] || []);
    }
    setSelectedTokens(new Set());
  }, [selectedNetwork, account, fetchRealBalances]);

  useEffect(() => {
    if (tokens.length > 0) {
      fetchPrices();
      fetchRiskScores();
      const interval = setInterval(fetchPrices, 30000); // Refresh every 30s
      return () => clearInterval(interval);
    }
  }, [tokens.length, selectedNetwork.id]);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
      } catch (error) {
        console.error("User rejected connection", error);
      }
    } else {
      setAccount("0xDEGEN...69420");
    }
  };

  const toggleToken = (id: string) => {
    const newSelected = new Set(selectedTokens);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedTokens(newSelected);
  };

  const handleBake = async () => {
    if (selectedTokens.size === 0) return;
    if (!window.ethereum) {
      alert("Please install a wallet like MetaMsk to bake crumbs!");
      return;
    }
    
    setIsBaking(true);
    setBakeProgress(0);
    setBakingStatus("Preheating Oven...");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      const sweeperAddress = CONTRACT_ADDRESSES[selectedNetwork.id];

      if (!sweeperAddress || sweeperAddress === "0x0000000000000000000000000000000000000000") {
        throw new Error(`CrumbSweeper not deployed on ${selectedNetwork.name}. Please set a valid contract address.`);
      }

      const contract = new ethers.Contract(sweeperAddress, SWEEPER_ABI, signer);
      
      const selectedTokenData = tokens.filter(t => selectedTokens.has(t.id));
      
      // 1. Approval Step
      setBakeProgress(20);
      setBakingStatus("Gathering Ingredients (Approvals)...");
      
      for (let i = 0; i < selectedTokenData.length; i++) {
        const token = selectedTokenData[i];
        if (token.id === "0x0000000000000000000000000000000000000000") continue; // Skip native ETH if applicable

        const tokenContract = new ethers.Contract(token.id, ERC20_ABI, signer);
        
        // Safety check for decimals() call to prevent "could not decode result data" error
        let decimals = 18;
        try {
          // Check if contract has code at this address on current network
          const code = await provider.getCode(token.id);
          if (code === "0x") {
            console.warn(`Token ${token.symbol} not found on this network. Using default decimals.`);
          } else {
            decimals = await tokenContract.decimals();
          }
        } catch (err) {
          console.warn(`Could not fetch decimals for ${token.symbol}. Defaulting to 18.`, err);
        }

        const amount = ethers.parseUnits(token.balance, decimals);
        
        const allowance = await tokenContract.allowance(userAddress, sweeperAddress);
        
        if (allowance < amount) {
          setBakingStatus(`Approving ${token.symbol}...`);
          const approveTx = await tokenContract.approve(sweeperAddress, ethers.MaxUint256);
          await approveTx.wait();
        }
        
        const progress = 20 + ((i + 1) / selectedTokenData.length) * 40;
        setBakeProgress(progress);
      }

      // 2. Baking Step
      setBakeProgress(70);
      setBakingStatus("In the Oven! Baking Crumbs...");
      
      const tokenAddresses = selectedTokenData.map(t => t.id);
      const amounts = await Promise.all(selectedTokenData.map(async t => {
        const tokenContract = new ethers.Contract(t.id, ERC20_ABI, provider);
        let decimals = 18;
        try {
          const code = await provider.getCode(t.id);
          if (code !== "0x") {
            decimals = await tokenContract.decimals();
          }
        } catch (err) {
          console.warn(`Error fetching decimals for ${t.id}`, err);
        }
        return ethers.parseUnits(t.balance, decimals);
      }));
      const minOuts = selectedTokenData.map(() => 0); // User should ideally set slippage

      const tx = await contract.bakeCrumbs(tokenAddresses, amounts, minOuts);
      setBakingStatus("Final Glaze... Waiting for Confirmation");
      await tx.wait();

      setBakeProgress(100);
      setBakingStatus("Baguette Secured! Profit Freshly Baked.");
      
      // Calculate bonus reward based on value (1 CRUMB per 0.001 ETH worth of crumbs)
      const totalUsdValue = selectedTokenData.reduce((acc, t) => acc + (t.valueUsd || 0), 0);
      const bonusAmount = Math.max(10, Math.floor(totalUsdValue * 100)); // Minimum 10 $CRUMB
      setEarnedBonus(bonusAmount.toString());
      
      setTimeout(() => {
        setIsBaking(false);
        setTokens(tokens.filter(t => !selectedTokens.has(t.id)));
        setSelectedTokens(new Set());
        setBakingStatus("");
        if (selectedNetwork.id === 'base') {
          setShowBonusClaim(true);
        }
      }, 2000);

    } catch (e: any) {
      console.error("Baking failed!", e);
      setBakingStatus(`Bake Failed: ${e.reason || e.message || "Unknown Error"}`);
      setTimeout(() => {
        setIsBaking(false);
        setBakeProgress(0);
      }, 3000);
    }
  };

  const rawTotalValue = tokens
    .filter(t => selectedTokens.has(t.id))
    .reduce((sum, t) => sum + t.valueUsd, 0);

  const chefFee = (rawTotalValue * CHEF_FEE_PERCENT) / 100;
  const finalTotalValue = rawTotalValue - chefFee;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans selection:bg-oven-orange selection:text-meme-black">
      {/* Sidebar */}
      <aside className="w-full lg:w-96 bg-black/30 backdrop-blur-xl border-r-8 border-messy-border p-10 pb-32 lg:pb-10 flex flex-col gap-12 z-20 relative overflow-hidden shadow-2xl">
        <Sparkles count={15} />
        {/* Polka dot background for sidebar */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }} />
        
        <div className="relative z-10">
          <div className="flex flex-col items-center text-center gap-4">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="w-48 h-48 drop-shadow-[0_10px_20px_rgba(0,0,0,0.1)]"
            >
              <img 
                src="/logo.png" 
                alt="CrustFund Logo" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <div>
              <h1 className="font-display text-6xl tracking-tighter text-white italic comic-text">CRUSTFUND</h1>
              <p className="text-xs uppercase tracking-[0.3em] text-white/70 font-black mt-2">Degen Crumb Converter</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="text-xs uppercase tracking-widest text-oven-orange font-black px-2 flex items-center gap-2">
            <Rocket className="w-4 h-4" />
            Pick Your Chain
          </div>
          
          {/* Live Status Tag */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="mx-2 p-4 bg-white border-4 border-messy-border rounded-lg rotate-[-1deg] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-meme-green text-meme-black text-[8px] font-black px-2 py-1 rotate-[15deg] translate-x-3 -translate-y-1 border-b-2 border-meme-black">
              LIVE
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-bakery-blue rounded-full flex items-center justify-center border-2 border-meme-black shadow-sm">
                <ChefHat className="w-6 h-6 text-crust" />
              </div>
              <div>
                <div className="text-[10px] font-black text-crust uppercase tracking-tight">Status: Oven is Hot!</div>
                <div className="text-sm font-display text-oven-orange comic-text leading-none mt-1">
                  LIVE ON BASE 🔵, BNB 🟡 & ARB 💙
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t-2 border-messy-border/20 text-[9px] font-bold text-crust/40 italic uppercase tracking-widest">
              Ethereum, Polygon & Avalanche heating up... 🔥
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-12 px-2 mt-8 relative">
            {NETWORKS.map((network, index) => {
              const rotations = [-3, 2, -1, 4, -2, 3];
              const rotation = rotations[index % rotations.length];
              
              return (
                <button
                  key={network.id}
                  onClick={() => setSelectedNetwork(network)}
                  style={{ transform: `rotate(${rotation}deg)` }}
                  className={cn(
                    "sticker-button group flex flex-col items-center",
                    selectedNetwork.id === network.id && "sticker-active scale-110 z-20"
                  )}
                >
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    <div className={cn(
                      "sticker-outline transition-all duration-500 !bg-parchment/10 !border-messy-border",
                      selectedNetwork.id === network.id ? "rotate-[-5deg] !border-oven-orange !shadow-[0_0_15px_rgba(255,140,0,0.4)]" : ""
                    )} />
                    
                    {/* Sticker Image or Emoji Fallback */}
                    <div className="z-10 group-hover:scale-110 transition-transform drop-shadow-sm flex items-center justify-center w-full h-full">
                      {network.stickerUrl ? (
                        <img 
                          src={network.stickerUrl} 
                          alt={network.name}
                          className="w-24 h-24 object-contain"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            // If image fails, hide it and show emoji (handled by CSS or conditional rendering)
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'block';
                          }}
                        />
                      ) : null}
                      <div className={cn("text-6xl", network.stickerUrl ? "hidden" : "block")}>
                        {network.id === 'base' && '🍩'}
                        {network.id === 'eth' && '🥐'}
                        {network.id === 'polygon' && '🥨'}
                        {network.id === 'avalanche' && '🍓'}
                        {network.id === 'bsc' && '🥠'}
                        {network.id === 'arbitrum' && '🧁'}
                      </div>
                    </div>

                    {/* Label inside/near sticker style */}
                    <div className="absolute -bottom-2 bg-white border-2 border-meme-black px-2 py-0.5 rounded-md shadow-sm z-20 rotate-[-2deg]">
                      <span className="font-display text-[10px] text-meme-black uppercase tracking-tighter">
                        {network.name}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-auto space-y-6">
          <Button variant="ghost" className="w-full justify-start text-meme-black font-black hover:bg-white/40 gap-4 rounded-2xl p-6 h-auto text-xl">
            <History className="w-6 h-6" />
            Moon History
          </Button>
          <div className="space-y-4">
            <div className="p-6 bg-bakery-blue text-white rounded-[1.5rem] border-4 border-meme-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="text-[10px] uppercase font-black mb-2 opacity-60">Kitchen Counter</div>
              <div className="font-display text-4xl comic-text">6,420</div>
              <div className="text-[10px] opacity-60 mt-1 uppercase font-black">Crumbs Converted</div>
            </div>
            <div className="p-6 bg-meme-black text-white rounded-[1.5rem] border-4 border-meme-black">
              <div className="text-xs uppercase font-black mb-2 opacity-60">Chef's Tip</div>
              <div className="font-display text-2xl">5% FEE PER BAKE</div>
              <div className="text-[10px] opacity-40 mt-2 italic">Supporting the degen kitchen</div>
            </div>
          </div>

          <div className="p-4 bg-white/20 border-2 border-meme-black/10 rounded-2xl flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-meme-pink" />
            <div className="text-[10px] font-black uppercase tracking-widest leading-tight">
              Contract Scanning <br/> 
              <span className="opacity-40 font-bold">By GoPlus Security</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-20 pb-32 max-w-7xl mx-auto w-full relative">
        <Sparkles count={30} />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-20 gap-10 relative z-10">
          <div>
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <h2 className="text-6xl comic-text">CRUMB CONVERTER</h2>
              <Badge className="w-fit bg-white border-2 border-oven-orange text-oven-orange font-black text-[10px] py-1 px-3 rounded-md flex items-center gap-1 shadow-lg">
                <ShieldCheck className="w-3 h-3 text-oven-orange fill-oven-orange/20" /> 
                SECURED BY GOPLUS
              </Badge>
            </div>
            <p className="text-crust/60 font-bold text-xl uppercase tracking-tighter">Sweep your degen crumbs and bake them into fresh {selectedNetwork.nativeCurrency}!</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 items-end md:items-center">
            {account && selectedNetwork.id === 'base' && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-bakery-blue/10 border-2 border-messy-border px-6 py-4 rounded-2xl flex items-center gap-4 shadow-sm"
              >
                <div className="w-10 h-10 bg-white rounded-full border-2 border-messy-border flex items-center justify-center">
                  <Cookie className="w-6 h-6 text-crust" />
                </div>
                <div>
                  <div className="text-[10px] font-black text-crust/40 uppercase tracking-widest">Your $CRUMB Stash</div>
                  <div className="font-display text-2xl text-crust comic-text">
                    {parseFloat(crumbBalance) > 0 ? parseFloat(crumbBalance).toLocaleString(undefined, { maximumFractionDigits: 0 }) : "0"}
                  </div>
                </div>
              </motion.div>
            )}
            
            {!account ? (
              <Button 
                onClick={connectWallet}
                className="meme-button meme-button-primary h-auto text-3xl px-12 py-8"
              >
                <Wallet className="mr-4 w-8 h-8" />
                CONNECT WALLET
              </Button>
            ) : (
              <div className="flex items-center gap-6 bg-white p-4 pr-8 rounded-full border-4 border-meme-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <div className="w-14 h-14 rounded-full bg-meme-green flex items-center justify-center border-4 border-meme-black">
                  <div className="w-4 h-4 bg-white rounded-full animate-ping" />
                </div>
                <div>
                  <div className="text-xs text-meme-black/40 font-black uppercase tracking-widest">DEGEN CONNECTED</div>
                  <div className="font-mono text-xl font-black text-meme-black">{account.slice(0, 6)}...{account.slice(-4)}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {!account ? (
              <div className="sweeper-card text-center max-w-2xl mx-auto overflow-hidden relative">
                <div className="absolute inset-0 opacity-5 pointer-events-none">
                  <img 
                    src="/kitchen-is-closed.jpg" 
                    alt="Background" 
                    className="w-full h-full object-cover opacity-20"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="relative z-10">
                  <div className="w-48 h-48 mx-auto mb-8">
                    <img 
                      src="/kitchen-is-closed.jpg" 
                      alt="CrustFund Sweeper Mascot" 
                      className="w-full h-full object-contain rounded-lg border-2 border-messy-border"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h3 className="text-5xl font-display text-crust mb-6 uppercase italic tracking-tighter comic-text">
                    Kitchen is Closed!
                  </h3>
                  <p className="text-lg font-bold text-crust/70 mb-10 max-w-md mx-auto leading-relaxed">
                    Connect your wallet to start sweeping those worthless crumbs into massive gains!
                  </p>
                  <Button 
                    onClick={connectWallet}
                    className="meme-button meme-button-primary"
                  >
                    CONNECT NOW ANON
                  </Button>
                </div>
              </div>
        ) : (
          <Tabs defaultValue="sweeper" className="w-full">
            <div className="flex justify-center mb-12">
              <TabsList className="bg-black/10 p-2 rounded-2xl border-4 border-messy-border h-auto">
                <TabsTrigger value="sweeper" className="tabs-trigger px-10 py-4 text-xl data-[state=active]:bg-oven-orange data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all font-display comic-text uppercase">
                  🍞 Crumb Sweeper
                </TabsTrigger>
                <TabsTrigger value="rewards" className="tabs-trigger px-10 py-4 text-xl data-[state=active]:bg-bakery-blue data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all font-display comic-text uppercase">
                  🎨 NFT Oven
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="sweeper" className="outline-none focus:ring-0">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Left Column: Baker & Bake Action */}
            <div className="lg:col-span-5 space-y-12">
              <Card className="sweeper-card text-center">
                <MemeMascot progress={bakeProgress} isBaking={isBaking} />
                
                <div className="space-y-10">
                  <div className="bg-meme-black border-4 border-messy-border p-8 rounded-lg shadow-[inset_0_0_20px_rgba(255,140,0,0.1)]">
                    <div className="text-xs font-black uppercase tracking-widest text-parchment/30 mb-4">You'll Receive (After Fee)</div>
                    <div className="text-7xl font-display text-oven-orange comic-text">
                      {finalTotalValue > 0 ? finalTotalValue.toFixed(4) : "0.0000"}
                      <span className="text-xl ml-3 text-parchment opacity-40">USD</span>
                    </div>
                    <div className="mt-4 text-xs font-black text-oven-orange uppercase tracking-widest opacity-60">
                      Chef's Fee: -${chefFee.toFixed(4)} (5%)
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between text-xs font-black uppercase tracking-[0.2em] text-crust/60">
                      <span>{isBaking ? bakingStatus : "BAKING STATUS"}</span>
                      <span className="text-oven-orange">{bakeProgress}%</span>
                    </div>
                    <Progress value={bakeProgress} className="h-4 bg-bakery-blue/30 border-2 border-messy-border rounded-full overflow-hidden shadow-inner" />
                  </div>

                  <Button 
                    disabled={selectedTokens.size === 0 || isBaking}
                    onClick={handleBake}
                    className={cn(
                      "w-full h-24 text-4xl meme-button shadow-[0_10px_20px_rgba(0,0,0,0.5)] border-4 rounded-lg",
                      isBaking ? "bg-meme-black text-white/40 border-messy-border" : "bg-oven-orange text-white border-[#ffc482] font-display tracking-widest hover:brightness-110 active:translate-y-1"
                    )}
                  >
                    {isBaking ? (
                      <RefreshCw className="w-10 h-10 animate-spin mr-4" />
                    ) : (
                      <Flame className="w-10 h-10 mr-4 fill-white/20" />
                    )}
                    {isBaking ? "BAKING..." : `BAKE ${selectedTokens.size} CRUMBS`}
                  </Button>
                  
                  <p className="text-[10px] text-parchment/30 font-black uppercase tracking-widest flex items-center justify-center gap-3">
                    <TrendingUp className="w-4 h-4 text-meme-green" />
                    Moon mission guaranteed (not financial advice)
                  </p>
                </div>
              </Card>

              <div className="bg-meme-black/60 border-4 border-messy-border rounded-lg p-8 flex gap-6 items-start shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)]">
                <div className="p-4 bg-meme-black border-4 border-messy-border rounded-lg">
                  <Skull className="w-8 h-8 text-oven-orange" />
                </div>
                <div className="text-lg text-parchment font-bold leading-relaxed">
                  <strong className="text-oven-orange block mb-2 font-display text-3xl comic-text">WAGMI!</strong>
                  Crumbs are those tiny, useless balances. We bake them into one big loaf so you can actually trade them!
                </div>
              </div>
            </div>

            {/* Right Column: Crumb List */}
            <div className="lg:col-span-7">
              <Card className="sweeper-card h-full flex flex-col !p-0 overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between border-b-4 border-messy-border p-10 bg-bakery-blue/5">
                  <div>
                    <CardTitle className="text-4xl font-display text-crust comic-text">YOUR PANTRY</CardTitle>
                    <CardDescription className="text-crust/60 font-bold text-xl uppercase tracking-tighter">Found {tokens.length} crumbs in the jar</CardDescription>
                  </div>
                  <div className="flex flex-wrap justify-end gap-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={cn(
                        "text-[10px] font-black border-2 border-messy-border rounded-lg px-4 h-10 shadow-md transition-all",
                        isLoadingPrices || isLoadingRisk || isSyncing ? "bg-oven-orange text-white" : "bg-white text-crust hover:bg-bakery-blue/10"
                      )}
                      onClick={() => {
                        if (account) fetchRealBalances(account, selectedNetwork);
                        fetchPrices();
                        fetchRiskScores();
                      }}
                      disabled={isLoadingPrices || isLoadingRisk || isSyncing}
                    >
                      <RefreshCw className={cn("w-3 h-3 mr-2", (isLoadingPrices || isLoadingRisk || isSyncing) && "animate-spin")} />
                      {isLoadingPrices || isLoadingRisk || isSyncing ? "SYNCING..." : "REFRESH PANTRY"}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-[10px] font-black text-oven-orange hover:bg-oven-orange/10 border-2 border-oven-orange/20 rounded-lg px-4 h-10"
                      onClick={() => setSelectedTokens(new Set(tokens.map(t => t.id)))}
                    >
                      SELECT ALL
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-[10px] font-black text-crust/40 hover:bg-black/5 border-2 border-black/10 rounded-lg px-4 h-10"
                      onClick={() => setSelectedTokens(new Set())}
                    >
                      CLEAR
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0 flex-1 bg-white/50">
                  <ScrollArea className="h-[700px] p-10">
                    <AnimatePresence mode="popLayout">
                      {isSyncing ? (
                        <div className="flex flex-col items-center justify-center h-[500px] text-center space-y-8 animate-pulse">
                          <div className="w-32 h-32 relative">
                            <RefreshCw className="w-full h-full text-oven-orange animate-spin opacity-20" />
                            <ChefHat className="absolute inset-0 w-20 h-20 m-auto text-crust" />
                          </div>
                          <p className="font-display text-4xl text-crust/40 comic-text uppercase italic tracking-tighter">Counting Crumbs...</p>
                          <p className="text-crust/20 font-black uppercase tracking-widest text-[10px]">Checking the jars for your gems</p>
                        </div>
                      ) : tokens.length > 0 ? (
                        tokens.map(token => (
                          <TokenCard 
                            key={token.id} 
                            token={token} 
                            isSelected={selectedTokens.has(token.id)}
                            onToggle={() => toggleToken(token.id)}
                          />
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center h-[500px] text-center">
                          <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-48 h-48 mb-8"
                          >
                            <img 
                              src="/mascot-sad.jpg" 
                              alt="Crying Bread" 
                              className="w-full h-full object-contain grayscale opacity-30"
                              referrerPolicy="no-referrer"
                            />
                          </motion.div>
                          <p className="font-display text-4xl text-crust/20 comic-text">PANTRY IS EMPTY!</p>
                          <p className="text-crust/10 font-bold mt-2 uppercase tracking-widest text-xs">No crumbs detected. Go buy some shitcoins!</p>
                        </div>
                      )}
                    </AnimatePresence>
                  </ScrollArea>
                </CardContent>
                {selectedTokens.size > 0 && (
                  <div className="p-10 border-t-4 border-messy-border bg-bakery-blue/10 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-center text-crust/40 font-black uppercase tracking-widest text-[10px]">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-3 h-3 text-meme-green" />
                        Estimated Value
                      </div>
                      <span className="font-mono text-lg text-crust">${rawTotalValue.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between items-center text-oven-orange/60 font-black uppercase tracking-widest text-[10px]">
                      <div className="flex items-center gap-2">
                        <Skull className="w-3 h-3" />
                        Chef's Fee (5%)
                      </div>
                      <span className="font-mono text-lg text-oven-orange">-${chefFee.toFixed(4)}</span>
                    </div>

                    {tokens.some(t => selectedTokens.has(t.id) && t.risk && (t.risk.score < 60 || t.risk.isHoneypot)) && (
                      <div className="p-4 bg-red-600/10 border-2 border-red-600 rounded-lg flex items-center gap-4 text-red-500 animate-pulse">
                        <ShieldAlert className="w-8 h-8 flex-shrink-0" />
                        <div className="text-[10px] font-black uppercase tracking-widest leading-none">
                          Warning: One or more selected crumbs have CRITICAL security flags! 
                          <span className="block mt-1 opacity-60 font-bold">High risk of Honeypot or Scam detection.</span>
                        </div>
                      </div>
                    )}

                    <div className="pt-6 border-t-4 border-messy-border flex justify-between items-center">
                      <div className="text-xs font-black text-crust/40 uppercase tracking-widest leading-loose">
                        TOTAL TO BAKE: <span className="text-oven-orange font-display text-3xl block comic-text">{selectedTokens.size} CRUMBS</span>
                      </div>
                      <Badge className="bg-white text-oven-orange font-mono font-black text-xl px-8 py-3 rounded-lg border-2 border-oven-orange shadow-lg">
                        ~ {finalTotalValue.toFixed(4)} USD
                      </Badge>
                    </div>

                    {selectedNetwork.id === 'base' && (
                      <div className="flex items-center gap-4 p-4 bg-bakery-blue/10 border-2 border-messy-border rounded-lg animate-pulse">
                        <Cookie className="w-8 h-8 text-crust" />
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-widest text-crust/60">Estimated Bonus Reward</div>
                          <div className="font-display text-lg text-crust comic-text">
                            +{Math.max(10, Math.floor(rawTotalValue * 100))} $CRUMB
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="rewards" className="outline-none focus:ring-0">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-7xl comic-text italic uppercase tracking-tighter">THE NFT OVEN</h3>
                <p className="text-2xl font-bold text-crust/60 uppercase tracking-tighter max-w-3xl mx-auto leading-relaxed">
                  Stack your <span className="text-oven-orange">$CRUMB</span> tokens and exchange them for rare CrustFund Bakery collectibles!
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[
          { name: "Legendary Glow Pepe", image: "/nft_legendary.jpg", cost: 5000, rarity: "Legendary", emoji: "🥖", color: "from-yellow-400 to-amber-600", desc: "Forged in the heart of the CrustFund oven with extra gwei." },
                { name: "Realistic Pepe Burger", image: "/nft_rare.jpg", cost: 1000, rarity: "Rare", emoji: "🍞", color: "from-orange-500 to-red-700", desc: "Deliciously rare and slightly over-proofed." },
                { name: "Degen Bread Sticker", image: "/nft_comman.jpg", cost: 500, rarity: "Common", emoji: "🥯", color: "from-slate-400 to-slate-600", desc: "A classic crumb-sweeper essential sticker." },
              ].map((nft, i) => (
                <motion.div
                  key={nft.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="sweeper-card group hover:scale-105 transition-all cursor-pointer relative overflow-hidden flex flex-col h-full"
                >
                  <div className={cn("absolute inset-0 opacity-10 bg-gradient-to-br transition-opacity group-hover:opacity-20", nft.color)} />
                  <div className="relative z-10 p-10 space-y-8 flex flex-col items-center flex-1">
                    <div className={cn(
                      "w-40 h-40 rounded-[2.5rem] bg-gradient-to-br flex items-center justify-center text-7xl shadow-2xl border-8 border-messy-border transform transition-transform group-hover:rotate-12 overflow-hidden",
                      nft.color
                    )}>
                      {nft.image ? (
                        <img 
                          src={nft.image} 
                          alt={nft.name} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            // Fallback to emoji if image fails
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).parentElement!.innerText = nft.emoji;
                          }}
                        />
                      ) : nft.emoji}
                    </div>
                    <div className="text-center space-y-3 flex-1">
                      <div className="flex justify-center gap-2">
                        <Badge className="bg-black/10 border-2 border-messy-border text-crust font-black text-[10px] uppercase tracking-widest">{nft.rarity}</Badge>
                      </div>
                      <h4 className="text-3xl font-display comic-text mb-1 uppercase italic tracking-tighter">{nft.name}</h4>
                      <p className="text-xs font-bold text-crust/40 uppercase tracking-widest leading-loose">{nft.desc}</p>
                    </div>
                    
                    <div className="w-full pt-8 border-t-4 border-messy-border/20 mt-auto">
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-[10px] font-black text-crust/40 uppercase tracking-widest">Rewards Cost</span>
                        <span className="font-display text-2xl text-crust comic-text">{nft.cost} $CRUMB</span>
                      </div>
                      <Button className="w-full meme-button-primary opacity-50 cursor-not-allowed py-8 text-lg font-display tracking-widest">
                        OVEN READY SOON
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <Card className="sweeper-card bg-oven-orange/5 border-dashed p-16 text-center border-oven-orange/30 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 rotate-12 opacity-10">
                <ChefHat className="w-48 h-48 text-oven-orange" />
              </div>
              <div className="flex flex-col items-center gap-8 relative z-10">
                <div className="w-24 h-24 bg-white rounded-full border-4 border-oven-orange flex items-center justify-center shadow-lg">
                  <Flame className="w-12 h-12 text-oven-orange animate-pulse" />
                </div>
                <div className="space-y-6">
                  <h4 className="text-5xl comic-text italic uppercase">Preheating the Rewards Oven</h4>
                  <p className="text-xl font-bold text-crust/70 max-w-2xl mx-auto leading-relaxed">
                    Our NFT collection is currently proofing in the kitchen. Once the oven reaches full temp, you'll be able to claim these exclusive assets with the <span className="text-oven-orange">$CRUMB</span> tokens you earn from sweeping crumbs!
                  </p>
                </div>
                <div className="pt-8 flex gap-4">
                  <div className="w-4 h-4 rounded-full bg-oven-orange animate-bounce" style={{ animationDelay: '0s' }} />
                  <div className="w-4 h-4 rounded-full bg-oven-orange animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-4 h-4 rounded-full bg-oven-orange animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    )}
      </main>

      {/* Footer / Status Bar */}
      <footer className="fixed bottom-0 left-0 right-0 bg-black/40 backdrop-blur-xl border-t-8 border-messy-border px-10 py-4 flex justify-between items-center text-[10px] uppercase tracking-[0.3em] text-white font-black z-50">
        <div className="flex gap-12">
          <div className="flex items-center gap-4">
            <div className="w-4 h-4 bg-meme-green rounded-sm border-2 border-meme-black" />
            KITCHEN STATUS: <span className="text-meme-green animate-pulse">BAKING GAINS</span>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <Flame className="w-5 h-5 text-oven-orange fill-oven-orange" />
            OVEN TEMP: <span className="text-oven-orange tracking-normal">69 GWEI</span>
          </div>
        </div>
        <div className="flex gap-10 items-center">
          <div className="hidden lg:flex items-center gap-2 text-oven-orange">
            <Cookie className="w-4 h-4" />
            REWARDS LIVE ON BASE & ARB
          </div>
          <span className="hover:text-oven-orange cursor-pointer transition-colors">RECIPE BOOK</span>
          <span className="hover:text-oven-orange cursor-pointer transition-colors">CONTACT CHEF</span>
          <span className="text-crust/10">v6.9.0-DEGEN</span>
        </div>
      </footer>

      <RewardModal 
        isOpen={showBonusClaim} 
        onClose={() => setShowBonusClaim(false)} 
        amount={earnedBonus}
        networkName={selectedNetwork.name}
      />
      <Analytics />
    </div>
  );
}
