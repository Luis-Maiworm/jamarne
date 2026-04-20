import './App.css'
import { VerificationCodeInput } from '@/lib/InputOTP'
import { Toaster } from './components/ui/sonner'

function App() {
  return (
    <>
      <Toaster />
      <main className="app-page dark">
        <VerificationCodeInput />
      </main>
    </>
  )
}

export default App
