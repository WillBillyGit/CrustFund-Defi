import React, { useState, useEffect } from 'react';
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
  Smile
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
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
          src={isBaking ? "Lever Pulled (Profit Frenzy Mode).jpg" : "Mascot Crusty the Melted Patty (Default Happy Mode).jpg"} 
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
            <div className="bg-white border-4 border-meme-black rounded-full p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Icon className="w-8 h-8 text-meme-pink fill-meme-pink" />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

interface TokenCardProps {
  token: Token;
  isSelected: boolean;
  onToggle: () => void;
  key?: React.Key;
}

const TokenCard = ({ token, isSelected, onToggle }: TokenCardProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.05, rotate: 1 }}
      onClick={onToggle}
      className={cn(
        "p-6 rounded-[1.5rem] border-4 cursor-pointer transition-all flex items-center justify-between mb-4",
        isSelected 
          ? "bg-meme-pink border-meme-black text-white shadow-[4px_4px_0px_0px_rgba(28,28,30,1)]" 
          : "bg-white border-meme-black hover:bg-bakery-blue/20"
      )}
    >
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-bakery-blue border-4 border-meme-black flex items-center justify-center font-display text-2xl text-meme-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          {token.symbol[0]}
        </div>
        <div>
          <div className="font-display text-2xl uppercase tracking-wider">{token.symbol}</div>
          <div className={cn("text-sm font-bold", isSelected ? "text-white/80" : "text-meme-black/40")}>{token.name}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-mono text-lg font-bold">{token.balance}</div>
        <div className={cn("text-sm font-bold font-mono", isSelected ? "text-bakery-deep" : "text-meme-pink")}>${token.valueUsd.toFixed(2)}</div>
      </div>
    </motion.div>
  );
};

declare global {
  interface Window {
    ethereum?: any;
  }
}

// --- Constants & Types ---

const CONTRACT_ADDRESSES: Record<string, string> = {
  base: "0x8453...Bake",
  eth: "0x1234...Bake",
  polygon: "0x137...Bake",
  avalanche: "0x43114...Bake",
  bsc: "0x56...Bake",
  arbitrum: "0x42161...Bake",
};

const SWEEPER_ABI = [
  "function bakeCrumbs(address[] tokens, uint256[] amountsIn, uint256[] minAmountsOut) external",
  "event CrumbsBaked(address indexed user, uint256 totalReceived, uint256 feeTaken)"
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
  const [prices, setPrices] = useState<Record<string, number>>({});

  const CHEF_FEE_PERCENT = 5; // 5% fee for profitability

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => {
        const newPrices: Record<string, number> = { ...prev };
        tokens.forEach(t => {
          const change = (Math.random() - 0.5) * 0.05; // +/- 5% (more volatile for memes)
          newPrices[t.symbol] = (prev[t.symbol] || t.valueUsd) * (1 + change);
        });
        return newPrices;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [tokens]);

  useEffect(() => {
    setTokens(MOCK_CRUMBS[selectedNetwork.id] || []);
    setSelectedTokens(new Set());
  }, [selectedNetwork]);

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
    
    setIsBaking(true);
    setBakeProgress(0);

    // REAL ON-CHAIN LOGIC (Commented out for safety/simulation)
    /*
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESSES[selectedNetwork.id], SWEEPER_ABI, signer);
      
      const selectedTokenData = tokens.filter(t => selectedTokens.has(t.id));
      const tokenAddresses = selectedTokenData.map(t => t.id); // Assuming ID is the address
      const amounts = selectedTokenData.map(t => ethers.parseUnits(t.balance, 18));
      const minOuts = selectedTokenData.map(() => 0); // Simplified slippage

      const tx = await contract.bakeCrumbs(tokenAddresses, amounts, minOuts);
      await tx.wait();
    } catch (e) {
      console.error("Baking failed!", e);
      setIsBaking(false);
      return;
    }
    */

    const interval = setInterval(() => {
      setBakeProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsBaking(false);
            setTokens(tokens.filter(t => !selectedTokens.has(t.id)));
            setSelectedTokens(new Set());
          }, 800);
          return 100;
        }
        return prev + 4;
      });
    }, 40);
  };

  const rawTotalValue = tokens
    .filter(t => selectedTokens.has(t.id))
    .reduce((sum, t) => sum + (prices[t.symbol] || t.valueUsd), 0);

  const chefFee = (rawTotalValue * CHEF_FEE_PERCENT) / 100;
  const finalTotalValue = rawTotalValue - chefFee;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans selection:bg-meme-pink selection:text-white">
      {/* Sidebar */}
      <aside className="w-full lg:w-96 bg-bakery-blue border-r-8 border-meme-black p-10 flex flex-col gap-12 z-10 relative overflow-hidden">
        <Sparkles count={15} />
        {/* Polka dot background for sidebar */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '16px 16px' }} />
        
        <div className="relative z-10">
          <div className="flex flex-col items-center text-center gap-4">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="w-48 h-48 drop-shadow-[0_10px_10px_rgba(0,0,0,0.2)]"
            >
              <img 
                src="crustfundlogo (1).jpg" 
                alt="CrustFund Logo" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <div>
              <h1 className="font-display text-6xl tracking-tighter text-meme-black comic-text">CRUSTFUND</h1>
              <p className="text-sm uppercase tracking-[0.3em] text-meme-black font-black mt-2">Degen Crumb Converter</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="text-sm uppercase tracking-widest text-meme-black font-black px-2 flex items-center gap-2">
            <Rocket className="w-4 h-4" />
            Pick Your Chain
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 px-2 mt-8 relative">
            {NETWORKS.map((network, index) => {
              // Create a pseudo-random rotation based on index
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
                      "sticker-outline transition-all duration-500",
                      selectedNetwork.id === network.id ? "rotate-[-5deg]" : ""
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
          <div className="p-6 bg-meme-black text-white rounded-[1.5rem] border-4 border-meme-black">
            <div className="text-xs uppercase font-black mb-2 opacity-60">Chef's Tip</div>
            <div className="font-display text-2xl">5% FEE PER BAKE</div>
            <div className="text-[10px] opacity-40 mt-2 italic">Supporting the degen kitchen</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-20 max-w-7xl mx-auto w-full relative">
        <Sparkles count={30} />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-20 gap-10 relative z-10">
          <div>
            <h2 className="text-6xl font-display text-meme-black mb-4 comic-text">CRUMB CONVERTER</h2>
            <p className="text-meme-black/60 font-black text-xl">Sweep your degen crumbs and bake them into fresh {selectedNetwork.nativeCurrency}!</p>
          </div>
          
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

        {!account ? (
              <div className="bg-white border-8 border-meme-black rounded-3xl p-12 text-center shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] max-w-2xl mx-auto overflow-hidden relative">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <img 
                    src="JQyhOcBEIm2WQNbPVJGI--0--IWW-4.jpg" 
                    alt="Background" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="relative z-10">
                  <div className="w-48 h-48 mx-auto mb-8">
                    <img 
                      src="Mascot Crusty the Melted Patty (Default Happy Mode).jpg" 
                      alt="Robot Collector" 
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h3 className="text-5xl font-display text-meme-black mb-6 comic-text uppercase italic tracking-tighter">
                    Kitchen is Closed!
                  </h3>
                  <p className="text-xl font-bold text-meme-black/70 mb-10 max-w-md mx-auto">
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Left Column: Baker & Bake Action */}
            <div className="lg:col-span-5 space-y-12">
              <Card className="meme-card p-12 text-center bg-bakery-blue/10">
                <MemeMascot progress={bakeProgress} isBaking={isBaking} />
                
                <div className="space-y-10">
                  <div className="bg-white border-4 border-meme-black p-8 rounded-[2rem] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    <div className="text-sm font-black uppercase tracking-widest text-meme-black/40 mb-4">You'll Receive (After Fee)</div>
                    <div className="text-7xl font-display text-meme-black comic-text">
                      {finalTotalValue > 0 ? finalTotalValue.toFixed(4) : "0.0000"}
                      <span className="text-2xl ml-3 text-meme-pink">USD</span>
                    </div>
                    <div className="mt-4 text-xs font-black text-meme-pink uppercase tracking-widest">
                      Chef's Fee: -${chefFee.toFixed(4)} (5%)
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between text-sm font-black uppercase tracking-[0.2em] text-meme-black">
                      <span>BAKING STATUS</span>
                      <span>{bakeProgress}%</span>
                    </div>
                    <Progress value={bakeProgress} className="h-8 bg-white border-4 border-meme-black rounded-2xl overflow-hidden" />
                  </div>

                  <Button 
                    disabled={selectedTokens.size === 0 || isBaking}
                    onClick={handleBake}
                    className={cn(
                      "w-full h-24 text-4xl meme-button shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]",
                      isBaking ? "bg-meme-black text-white/40" : "meme-button-primary"
                    )}
                  >
                    {isBaking ? (
                      <RefreshCw className="w-10 h-10 animate-spin mr-4" />
                    ) : (
                      <Flame className="w-10 h-10 mr-4 fill-white/20" />
                    )}
                    {isBaking ? "BAKING..." : `BAKE ${selectedTokens.size} CRUMBS`}
                  </Button>
                  
                  <p className="text-xs text-meme-black/40 font-black uppercase tracking-widest flex items-center justify-center gap-3">
                    <TrendingUp className="w-5 h-5 text-meme-green" />
                    Moon mission guaranteed (not financial advice)
                  </p>
                </div>
              </Card>

              <div className="bg-meme-pink/10 border-4 border-meme-black rounded-[2rem] p-8 flex gap-6 items-start shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <div className="p-4 bg-white border-4 border-meme-black rounded-2xl">
                  <Skull className="w-8 h-8 text-meme-pink" />
                </div>
                <div className="text-lg text-meme-black font-black leading-relaxed">
                  <strong className="text-meme-pink block mb-2 font-display text-3xl comic-text">WAGMI!</strong>
                  Crumbs are those tiny, useless balances. We bake them into one big loaf so you can actually trade them!
                </div>
              </div>
            </div>

            {/* Right Column: Crumb List */}
            <div className="lg:col-span-7">
              <Card className="meme-card h-full flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between border-b-4 border-meme-black p-10 bg-meme-blue/10">
                  <div>
                    <CardTitle className="text-4xl font-display text-meme-black comic-text">YOUR PANTRY</CardTitle>
                    <CardDescription className="text-meme-black/60 font-black text-xl">Found {tokens.length} crumbs in the jar</CardDescription>
                  </div>
                  <div className="flex gap-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-sm font-black text-meme-blue hover:bg-meme-blue/10 rounded-xl px-6"
                      onClick={() => setSelectedTokens(new Set(tokens.map(t => t.id)))}
                    >
                      SELECT ALL
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-sm font-black text-meme-black/40 hover:bg-meme-black/5 rounded-xl px-6"
                      onClick={() => setSelectedTokens(new Set())}
                    >
                      CLEAR
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0 flex-1">
                  <ScrollArea className="h-[700px] p-10">
                    <AnimatePresence mode="popLayout">
                      {tokens.length > 0 ? (
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
                              src="Melted Sad Version (Down Market).jpg" 
                              alt="Crying Bread" 
                              className="w-full h-full object-contain grayscale opacity-50"
                              referrerPolicy="no-referrer"
                            />
                          </motion.div>
                          <p className="font-display text-4xl comic-text text-meme-black/40">PANTRY IS EMPTY!</p>
                          <p className="text-meme-black/30 font-bold mt-2">No crumbs detected. Go buy some shitcoins!</p>
                        </div>
                      )}
                    </AnimatePresence>
                  </ScrollArea>
                </CardContent>
                <div className="p-10 border-t-4 border-meme-black bg-bakery-blue/20">
                  <div className="flex justify-between items-center">
                    <div className="text-xl font-black text-meme-black/60">
                      SELECTED: <span className="text-meme-pink font-display text-3xl comic-text">{selectedTokens.size} CRUMBS</span>
                    </div>
                    <Badge className="bg-meme-black text-bakery-blue font-mono font-black text-xl px-8 py-3 rounded-2xl border-4 border-meme-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      ~ {finalTotalValue.toFixed(4)} USD
                    </Badge>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </main>

      {/* Footer / Status Bar */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t-8 border-meme-black px-10 py-4 flex justify-between items-center text-sm uppercase tracking-[0.3em] text-meme-black font-black z-50">
        <div className="flex gap-12">
          <div className="flex items-center gap-4">
            <div className="w-4 h-4 bg-meme-green rounded-full border-2 border-meme-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" />
            KITCHEN STATUS: BAKING GAINS
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <Flame className="w-5 h-5 text-meme-orange fill-meme-orange" />
            OVEN TEMP: 69 GWEI
          </div>
        </div>
        <div className="flex gap-10">
          <span className="hover:text-meme-pink cursor-pointer transition-colors">RECIPE BOOK</span>
          <span className="hover:text-meme-pink cursor-pointer transition-colors">CONTACT CHEF</span>
          <span className="text-meme-black/20">v6.9.0-DEGEN</span>
        </div>
      </footer>
    </div>
  );
}
