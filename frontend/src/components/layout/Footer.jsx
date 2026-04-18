import { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'

const PROMPTS = [
  "What are you holding onto that no longer serves you?",
  "Describe your current mood in three unexpected words.",
  "What would you tell your past self from a year ago?",
  "What's one small thing that made today worth it?",
  "Who are you when no one's watching?",
  "What feeling have you been avoiding lately?",
  "What does your ideal Tuesday look like?",
  "What's the last thing that genuinely surprised you?",
  "If your life had a soundtrack right now, what would it be?",
  "What are you secretly proud of this week?",
]

const Footer = () => {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * PROMPTS.length))
  const [visible, setVisible] = useState(true)

  const shuffle = () => {
    setVisible(false)
    setTimeout(() => {
      setIndex((i) => {
        let next
        do { next = Math.floor(Math.random() * PROMPTS.length) } while (next === i)
        return next
      })
      setVisible(true)
    }, 300)
  }

  return (
    <footer className='mt-24 bg-[#1e1008] border-t border-[#3a1e0e]'>
      <div className='mx-auto max-w-5xl px-8 pt-16 pb-8'>

        {/* Top section */}
        <div className='flex flex-col md:flex-row justify-between gap-24 mb-14'>

          {/* Brand */}
          <div className='flex flex-col gap-5 max-w-xs'>
            <div className='flex items-center gap-2.5'>
              <div className='relative'>
                <div className='absolute inset-2 rounded-xl bg-orange-400/30 blur-md' />
                <img src={logo} alt='Mirror Journal' className='relative h-20 w-20 rounded-xl' />
              </div>
              <span className='gradient-title-dark text-xl pb-0'>
                Mirror Journal
              </span>
            </div>

            <p className='text-sm leading-relaxed text-[#c4a48d]'>
              A quiet space to write freely, reflect deeply, and understand yourself better — one entry at a time.
            </p>

            <div className='flex items-center gap-2 flex-wrap'>
              {[
                { word: 'Write', bg: 'bg-[#3d1f14]', text: 'text-[#e8905e]' },
                { word: 'Reflect', bg: 'bg-[#3a2510]', text: 'text-[#d4a45a]' },
                { word: 'Rewire', bg: 'bg-[#3a1820]', text: 'text-[#d47a8a]' },
              ].map(({ word, bg, text }, i) => (
                <span
                  key={word}
                  className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${bg} ${text}`}
                  style={{ animation: `fadeIn 0.5s ease ${i * 0.15 + 0.2}s both` }}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>

          {/* Prompt card */}
          <div className='flex flex-col gap-6 max-w-sm w-full'>
            <div className='flex items-center gap-2'>
              <span className='text-[#c9764d] text-base' style={{ animation: 'spin 8s linear infinite' }}>✦</span>
              <p className='text-xs font-bold uppercase tracking-[0.2em] text-[#c9764d]'>
                your sign to write
              </p>
            </div>

            <div className='rounded-2xl border border-[#3a1e0e] bg-[#2a1208]/80 px-5 py-5'>
              <p
                className='text-base font-medium leading-relaxed text-[#f3e5d6] min-h-[4.5rem]'
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(6px)',
                  transition: 'opacity 0.3s ease, transform 0.3s ease',
                }}
              >
                "{PROMPTS[index]}"
              </p>
            </div>

            <div className='flex items-center gap-4'>
              <button
                onClick={shuffle}
                className='group flex items-center gap-2 text-sm font-medium text-[#c9764d] hover:text-[#e0b38f] transition-colors w-fit'
              >
                <span className='inline-block transition-transform duration-300 group-hover:rotate-180'>↻</span>
                not this one
              </button>

              <span className='text-[#3a2820]'>|</span>

              <Link
                to='/newEntry'
                className='group flex items-center gap-1.5 text-sm font-semibold text-[#e8905e] hover:text-[#f3c09a] transition-colors w-fit'
              >
                write what you're feeling
                <span className='inline-block transition-transform duration-200 group-hover:translate-x-1'>→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Shimmer divider */}
        <div className='relative h-px w-full overflow-hidden rounded-full bg-[#3a1e0e] mb-8'>
          <div
            className='absolute top-0 h-full w-32 bg-gradient-to-r from-transparent via-orange-400 dark:via-[#c9764d] to-transparent opacity-80'
            style={{ animation: 'shimmer 3s ease-in-out infinite' }}
          />
        </div>

        {/* Bottom bar */}
        <div className='flex flex-col sm:flex-row items-center justify-between gap-2 text-xs'>
          <p className='text-[#7a5c4f]'>© {new Date().getFullYear()} Mirror Journal. All rights reserved.</p>
          <p className='italic text-[#a07060] font-medium'>Your thoughts, reflected.</p>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0%   { left: -128px; opacity: 0; }
          20%  { opacity: 0.9; }
          80%  { opacity: 0.9; }
          100% { left: 100%; opacity: 0; }
        }
      `}</style>
    </footer>
  )
}

export default Footer
