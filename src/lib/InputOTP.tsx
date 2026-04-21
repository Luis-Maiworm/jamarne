import { Button } from "@/components/ui/8bit/button"
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "@/components/ui/8bit/input-otp"
import { toast } from "@/components/ui/8bit/toast"

import { useState, useRef, useEffect } from "react"

const SOLUTION_WORD = "exactlyhere"
const OTP_LENGTH = SOLUTION_WORD.length

interface VerificationCodeInputProps {
	onSuccess?: () => void
}

export function VerificationCodeInput({ onSuccess }: VerificationCodeInputProps) {
	const [code, setCode] = useState("")
	const otpRef = useRef<HTMLDivElement>(null)
	const buttonRef = useRef<HTMLButtonElement>(null)

	useEffect(() => {
		const input = otpRef.current?.querySelector("input")
		input?.focus()
	}, [])

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === "Enter") {
			e.preventDefault()
			buttonRef.current?.click()
		}
	}

	const handleValidate = () => {
		const normalizedCode = code.trim().toLowerCase().replace(/\s+/g, " ")

		if (normalizedCode === SOLUTION_WORD) {
			toast("Correct solution word")
			onSuccess?.()
			return
		}

		toast("Wrong solution word")
	}

	return (
        <>
            <div ref={otpRef} className="flex flex-col gap-10" onKeyDown={handleKeyDown}>

				<InputOTP
					maxLength={OTP_LENGTH}
					value={code}
					onChange={setCode}
					pattern="[a-z ]*"
				>
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
						<InputOTPSlot index={3} />
						<InputOTPSlot index={4} />
						<InputOTPSlot index={5} />
						<InputOTPSlot index={6} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPSeparator />
                    <InputOTPGroup>
						<InputOTPSlot index={7} />
						<InputOTPSlot index={8} />
						<InputOTPSlot index={9} />
						<InputOTPSlot index={10} />
                    </InputOTPGroup>
                </InputOTP>
                <Button
                	ref={buttonRef}
                	onClick={handleValidate}
					disabled={code.length !== OTP_LENGTH}
                >
                    Validate
                </Button>
            </div>
        </>
	)
}
