import { Button } from "@/components/ui/8bit/button"
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "@/components/ui/8bit/input-otp"
import { toast } from "@/components/ui/8bit/toast"

import { useState, useRef, useEffect } from "react"

export function VerificationCodeInput() {
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
		toast(`Validating code: ${code}`)
		// Add your validation logic here
	}

	return (
        <>
            <div ref={otpRef} className="flex flex-col gap-10" onKeyDown={handleKeyDown}>

                <InputOTP maxLength={6} value={code} onChange={setCode}>
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </InputOTP>
                <Button
                	ref={buttonRef}
                	onClick={handleValidate}
                	disabled={code.length !== 6}
                >
                    Validate
                </Button>
            </div>
        </>
	)
}
