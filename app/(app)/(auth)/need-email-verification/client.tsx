'use client'
import { Button } from "@/components/ui/button"
import { useTransition } from "react"

export const ResendVerifyEmailButton = () => {
    const [isPending, startTransition] = useTransition();

    const handleResendVerifyEmail = () => {
        startTransition(async () => {
            await fetch("/api/resend-verify-email", {
                method: "POST"
            })
        })
    }

    return(
        <Button 
            variant="default"
            onClick={handleResendVerifyEmail}
            disabled={isPending}
        >
            重新寄送驗證信
        </Button>
    )
}