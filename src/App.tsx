import './App.css'
import { useEffect, useRef, useState } from 'react'
import { VerificationCodeInput } from '@/lib/InputOTP'
import { SuccessPage } from '@/lib/Success'
import { Toaster } from './components/ui/sonner'
import { Button } from '@/components/ui/8bit/button'
import bgMusic from './assets/music/st_title_00.mp3'
import bgMusic2 from './assets/music/st_title_01.mp3'
import successMusic from './assets/music/st_title_03.mp3'

const DEFAULT_TRACKS = [bgMusic, bgMusic2]
const SUCCESS_TRACKS = [successMusic]

function App() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [trackIndex, setTrackIndex] = useState(0)
  const [isVerified, setIsVerified] = useState(false)
  const activeTracks = isVerified ? SUCCESS_TRACKS : DEFAULT_TRACKS

  useEffect(() => {
    const player = audioRef.current
    if (!player || !isPlaying) return

    player.load()
    player.play().catch(() => {
      setIsPlaying(false)
    })
  }, [trackIndex, isPlaying, isVerified])

  const handleSuccess = () => {
    setTrackIndex(0)
    setIsVerified(true)
  }

  const handleReset = () => {
    setTrackIndex(0)
    setIsVerified(false)
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
      <main className="app-page dark">
        <Button className="music-toggle" onClick={toggleMusic} type="button">
          {isPlaying ? 'Music: On' : 'Music: Off'}
        </Button>
        <audio
          ref={audioRef}
          src={activeTracks[trackIndex]}
          onEnded={handleTrackEnd}
          preload="metadata"
        />
        <div className="app-content">
          {isVerified ? (
            <SuccessPage onReset={handleReset} />
          ) : (
            <VerificationCodeInput onSuccess={handleSuccess} />
          )}
        </div>
      </main>
    </>
  )
}

export default App
