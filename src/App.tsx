import './App.css'
import { useEffect, useRef, useState } from 'react'
import { VerificationCodeInput } from '@/lib/InputOTP'
import { SuccessPage } from '@/lib/Success'
import { Toaster } from './components/ui/sonner'
import { Button } from '@/components/ui/8bit/button'
import bgMusic from './assets/music/st_title_00.mp3'
import bgMusic2 from './assets/music/st_title_01.mp3'
import successMusic from './assets/music/st_title_03.mp3'
import stTitle2 from './assets/gif/st_title2.gif'

const DEFAULT_TRACKS = [bgMusic, bgMusic2]
const SUCCESS_TRACKS = [successMusic]
const DARKEN_DURATION = 1200
const TITLE_DURATION = 1700
const SUCCESS_FADE_DURATION = 1800

type TransitionPhase = 'idle' | 'darken' | 'title' | 'reveal'

function App() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const transitionTimersRef = useRef<number[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [trackIndex, setTrackIndex] = useState(0)
  const [isVerified, setIsVerified] = useState(false)
  const [transitionPhase, setTransitionPhase] = useState<TransitionPhase>('idle')
  const activeTracks = isVerified ? SUCCESS_TRACKS : DEFAULT_TRACKS

  useEffect(() => {
    const player = audioRef.current
    if (!player || !isPlaying) return

    player.load()
    player.play().catch(() => {
      setIsPlaying(false)
    })
  }, [trackIndex, isPlaying, isVerified])

  useEffect(() => {
    return () => {
      transitionTimersRef.current.forEach((timer) => window.clearTimeout(timer))
    }
  }, [])

  const clearTransitionTimers = () => {
    transitionTimersRef.current.forEach((timer) => window.clearTimeout(timer))
    transitionTimersRef.current = []
  }

  const handleSuccess = () => {
    if (transitionPhase !== 'idle') return

    clearTransitionTimers()
    setTrackIndex(0)
    setTransitionPhase('darken')

    transitionTimersRef.current.push(
      window.setTimeout(() => {
        setTransitionPhase('title')
      }, DARKEN_DURATION)
    )

    transitionTimersRef.current.push(
      window.setTimeout(() => {
        setIsVerified(true)
        setTrackIndex(0)
        setTransitionPhase('reveal')
      }, DARKEN_DURATION + TITLE_DURATION)
    )

    transitionTimersRef.current.push(
      window.setTimeout(() => {
        setTransitionPhase('idle')
      }, DARKEN_DURATION + TITLE_DURATION + SUCCESS_FADE_DURATION)
    )
  }

  const handleReset = () => {
    clearTransitionTimers()
    setTrackIndex(0)
    setIsVerified(false)
    setTransitionPhase('idle')
  }

  const toggleMusic = async () => {
    const player = audioRef.current
    if (!player) return

    if (isPlaying) {
      player.pause()
      setIsPlaying(false)
      return
    }

    try {
      await player.play()
      setIsPlaying(true)
    } catch {
      setIsPlaying(false)
    }
  }

  const handleTrackEnd = () => {
    setTrackIndex((prev) => (prev + 1) % activeTracks.length)
  }

  return (
    <>
      <Toaster />
      <main className={`app-page dark phase-${transitionPhase}`}>
        <Button className="music-toggle" onClick={toggleMusic} type="button">
          {isPlaying ? 'Music: On' : 'Music: Off'}
        </Button>
        <audio
          ref={audioRef}
          src={activeTracks[trackIndex]}
          onEnded={handleTrackEnd}
          preload="metadata"
        />
        <div className="transition-dark-layer" aria-hidden="true" />
        <div className="transition-title-layer" aria-hidden="true">
          <img src={stTitle2} className="transition-title-gif" alt="" />
        </div>
        <div className="app-content">
          {isVerified ? (
            <div className={`success-shell ${transitionPhase === 'reveal' ? 'is-fading-in' : ''}`}>
              <SuccessPage onReset={handleReset} />
            </div>
          ) : (
            <VerificationCodeInput onSuccess={handleSuccess} />
          )}
        </div>
      </main>
    </>
  )
}

export default App
