import './App.css'
import { useEffect, useRef, useState } from 'react'
import { VerificationCodeInput } from '@/lib/InputOTP'
import { SuccessPage } from '@/lib/Success'
import { Toaster } from './components/ui/sonner'
import { Button } from '@/components/ui/8bit/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './components/ui/8bit/dialog'
import bgMusic from './assets/music/st_title_00.mp3'
import bgMusic2 from './assets/music/st_title_01.mp3'
import successMusic from './assets/music/st_title_03.mp3'
import stTitle2 from './assets/gif/st_title2.gif'
import titleGif from './assets/gif/st_title.gif'

const DEFAULT_TRACKS = [bgMusic, bgMusic2]
const SUCCESS_TRACKS = [successMusic]
const DARKEN_DURATION = 1200
const TITLE_DURATION = 1700
const SUCCESS_FADE_DURATION = 1800
const ATTEMPT_STORAGE_KEY = 'jamarne_attempt_count'
const SMALL_SCREEN_MAX_WIDTH = 1200

const HINT_DIALOGS = [
  { label: 'Tipp 1', text: 'Das Ergebnis aus dem 1. Rätsel habt ihr?' },
  { label: 'Tipp 2', text: 'Was sagt Google zur 1. Rätsel-Lösung?' },
  { label: 'Tipp 3', text: 'Die finale Lösung ist Englisch!' },
  {
    label: 'Lösung',
    text: 'War das so schwer?!? Na dann:',
    href: 'https://www.netflix.com/watch/80077370?s=a&trkid=278685009&t=2711&d=26&momentUuid=d1042914-55c2-456a-89af-e590a3fe43fe&shareType=Moment&shareUuid=eeda929b-18db-4fe2-a054-41a6b0c23687&trg=wha&unifiedEntityIdEncoded=Video%3A80057281',
  },
]

type TransitionPhase = 'idle' | 'darken' | 'title' | 'reveal'

function App() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const transitionTimersRef = useRef<number[]>([])
  const [isSmallScreen, setIsSmallScreen] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }

    return window.innerWidth <= SMALL_SCREEN_MAX_WIDTH
  })
  const [isPlaying, setIsPlaying] = useState(true)
  const [trackIndex, setTrackIndex] = useState(0)
  const [isVerified, setIsVerified] = useState(false)
  const [transitionPhase, setTransitionPhase] = useState<TransitionPhase>('idle')
  const [attemptCount, setAttemptCount] = useState(() => {
    const storedValue = window.localStorage.getItem(ATTEMPT_STORAGE_KEY)
    const parsedValue = Number(storedValue)

    if (!Number.isFinite(parsedValue) || parsedValue < 0) {
      return 0
    }

    return Math.floor(parsedValue)
  })
  const activeTracks = isVerified ? SUCCESS_TRACKS : DEFAULT_TRACKS

  useEffect(() => {
    const handleResize = () => {
      const isNowSmall = window.innerWidth <= SMALL_SCREEN_MAX_WIDTH
      setIsSmallScreen(isNowSmall)

      if (isNowSmall) {
        audioRef.current?.pause()
        setIsPlaying(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    const player = audioRef.current
    if (!player || !isPlaying || isSmallScreen) return

    player.load()
    player.play().catch(() => {
      setIsPlaying(false)
    })
  }, [trackIndex, isPlaying, isVerified, isSmallScreen])

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

  const handleAttempt = () => {
    setAttemptCount((prev) => {
      const next = prev + 1
      window.localStorage.setItem(ATTEMPT_STORAGE_KEY, String(next))
      return next
    })
  }

  if (isSmallScreen) {
    return (
      <main className="small-screen-message" role="alert" aria-live="polite">
        Nice try! 😉 <br></br>Großer Bildschirm hatten wir gesagt!
      </main>
    )
  }

  return (
    <>
      <Toaster />
      <main className={`app-page dark phase-${transitionPhase}`}>
        <Button className="music-toggle" onClick={toggleMusic} type="button">
          {isPlaying ? 'Music: On' : 'Music: Off'}
        </Button>
        {!isVerified && transitionPhase === 'idle' && (
          <div className="hint-rail" aria-label="Hinweise">
            {HINT_DIALOGS.map((hint, index) => {
              const unlockAfterAttempts = (index + 1) * 3
              const remainingAttempts = Math.max(0, unlockAfterAttempts - attemptCount)
              const isUnlocked = remainingAttempts === 0
              const attemptLabel = remainingAttempts === 1 ? 'Versuch' : 'Versuche'

              return (
                <Dialog key={hint.label}>
                  <DialogTrigger asChild>
                    <Button className="hint-button" type="button" disabled={!isUnlocked}>
                      {isUnlocked
                        ? hint.label
                        : `${hint.label} (noch ${remainingAttempts} ${attemptLabel})`}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="hint-dialog-content">
                    <DialogHeader>
                      <DialogTitle>{hint.label}</DialogTitle>
                      <DialogDescription className="hint-dialog-description">
                        <span>{hint.text}</span>
                        {hint.href && (
                          <a
                            className="hint-dialog-link"
                            href={hint.href}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Klick hier
                          </a>
                        )}
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              )
            })}
          </div>
        )}
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
            <div className="">
              <div className="app-bg-gif" style={{ backgroundImage: `url(${titleGif})` }} />
              <VerificationCodeInput onSuccess={handleSuccess} onAttempt={handleAttempt} />
              {/* <div className="verification-shell-content"> */}
              {/* </div> */}
            </div>
          )}
        </div>
      </main>
    </>
  )
}

export default App
