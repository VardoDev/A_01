import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Github, Send, Globe, Copy, Check } from 'lucide-react'
import { ParticleBackground } from './components/ParticleBackground'

// SOL & ETH logos as inline SVG components
function SolanaLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 397 311" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z" fill="url(#sol-a)" />
      <path d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z" fill="url(#sol-b)" />
      <path d="M332.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" fill="url(#sol-c)" />
      <defs>
        <linearGradient id="sol-a" x1="360.879" y1="351.455" x2="141.213" y2="131.789" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00FFA3" />
          <stop offset="1" stopColor="#DC1FFF" />
        </linearGradient>
        <linearGradient id="sol-b" x1="264.829" y1="255.405" x2="45.163" y2="35.739" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00FFA3" />
          <stop offset="1" stopColor="#DC1FFF" />
        </linearGradient>
        <linearGradient id="sol-c" x1="312.548" y1="303.124" x2="92.882" y2="83.458" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00FFA3" />
          <stop offset="1" stopColor="#DC1FFF" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function EthereumLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 417" xmlns="http://www.w3.org/2000/svg">
      <path fill="#343434" d="m127.961 0-2.795 9.5v275.668l2.795 2.79 127.962-75.638z" />
      <path fill="#8C8C8C" d="M127.962 0 0 212.32l127.962 75.639V9.5z" />
      <path fill="#3C3C3B" d="m127.961 312.187-1.575 1.92v98.199l1.575 4.6L256 236.587z" />
      <path fill="#8C8C8C" d="M127.962 416.905v-104.72L0 236.585z" />
      <path fill="#141414" d="m127.961 287.995 127.962-75.637-127.962-58.162z" />
      <path fill="#393939" d="m0 212.32 127.96 75.676v-133.838z" />
    </svg>
  )
}

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

function WalletCard({
  name,
  address,
  logoSvg,
  copied,
  onCopy,
  delay = 0,
}: {
  name: string
  address: string
  logoSvg: React.ReactNode
  copied: boolean
  onCopy: () => void
  delay?: number
}) {
  return (
    <motion.div
      className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-[12px] md:p-5"
      style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center md:h-14 md:w-14">
        {logoSvg}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-white/80">{name}</p>
        <p className="truncate font-mono text-sm text-white" title={address}>
          {address}
        </p>
      </div>
      <button
        type="button"
        onClick={onCopy}
        className="flex shrink-0 items-center gap-2 rounded-xl border border-electric-purple/50 bg-electric-purple/10 px-3 py-2 text-sm font-medium text-electric-purple transition hover:bg-electric-purple/20 active:scale-95"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            Copy
          </>
        )}
      </button>
    </motion.div>
  )
}

const socialLinks = [
  { href: 'https://github.com', icon: Github, label: 'GitHub' },
  { href: 'https://t.me', icon: Send, label: 'Telegram' },
  { href: 'https://example.com', icon: Globe, label: 'Website' },
]

export default function App() {
  const [solCopied, setSolCopied] = useState(false)
  const [ethCopied, setEthCopied] = useState(false)

  const copySol = useCallback(() => {
    navigator.clipboard.writeText('vardo.sol')
    setSolCopied(true)
    setTimeout(() => setSolCopied(false), 2000)
  }, [])

  const copyEth = useCallback(() => {
    navigator.clipboard.writeText('vardo.eth')
    setEthCopied(true)
    setTimeout(() => setEthCopied(false), 2000)
  }, [])

  return (
    <div className="min-h-screen bg-background text-white">
      <ParticleBackground />

      <main className="relative z-10 mx-auto max-w-6xl px-4 py-12 md:py-20">
        {/* Hero */}
        <section className="mb-16 flex flex-col gap-10 md:mb-20 md:flex-row md:items-center md:gap-16">
          <motion.div
            className="flex-1 space-y-4 md:space-y-6"
            initial={fadeInUp.initial}
            animate={fadeInUp.animate}
            transition={fadeInUp.transition}
          >
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Web3 Developer
            </h1>
            <p className="max-w-lg text-lg text-white/70 md:text-xl">
              Building the future of Solana & Decentralized Web
            </p>
          </motion.div>

          <motion.div
            className="flex shrink-0 justify-center md:justify-end"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div
              className="relative h-48 w-48 rounded-full md:h-56 md:w-56"
              style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(30, 58, 95, 0.3))',
                boxShadow: '0 0 40px rgba(139, 92, 246, 0.4), inset 0 0 60px rgba(255,255,255,0.05)',
                border: '2px solid rgba(139, 92, 246, 0.5)',
                animation: 'neon-pulse 2s ease-in-out infinite',
              }}
            >
              <div className="absolute inset-2 flex items-center justify-center rounded-full bg-background/80 backdrop-blur-sm">
                <span className="text-4xl font-bold text-electric-purple/60 md:text-5xl">V</span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Wallet Cards */}
        <motion.section
          className="mb-16 space-y-4 md:mb-20 md:flex md:gap-6 md:space-y-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex-1">
            <WalletCard
              name="Solana"
              address="vardo.sol"
              logoSvg={<SolanaLogo className="h-10 w-10 md:h-12 md:w-12" />}
              copied={solCopied}
              onCopy={copySol}
              delay={0.4}
            />
          </div>
          <div className="flex-1">
            <WalletCard
              name="Ethereum"
              address="vardo.eth"
              logoSvg={<EthereumLogo className="h-8 w-8 md:h-10 md:w-10" />}
              copied={ethCopied}
              onCopy={copyEth}
              delay={0.5}
            />
          </div>
        </motion.section>

        {/* Social Links */}
        <motion.section
          className="flex flex-wrap justify-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {socialLinks.map(({ href, icon: Icon, label }, i) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-[12px] text-white/80 transition-colors hover:text-electric-purple"
              style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 + i * 0.1 }}
            >
              <Icon className="h-6 w-6" strokeWidth={1.5} />
            </motion.a>
          ))}
        </motion.section>
      </main>

    </div>
  )
}
