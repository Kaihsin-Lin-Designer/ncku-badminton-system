'use client'
import { Button } from "@/components/ui/button"
import { FormCard, FormSeparator, FormRow  } from "@/components/custom/Form";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { payloadPreLogin, PreLoginResult } from "@/lib/auth/payload-login";
import React, { useState, useTransition } from "react";
import { redirect, useRouter } from "next/navigation";
import { toast } from "sonner";

type Field = "email" | "password" | "none"

export const ForgotPasswordForm = () => {
    const [isPending, startTransition] = useTransition();
    const [result, setResult] = useState<PreLoginResult | null>(null);
    const [invalidField, setInvalidField] = useState<Field>("none");

    const handleForgotPassword = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const fd = new FormData(e.currentTarget);
        const email = fd.get("email")?.toString();

        if (!email || typeof email !== "string") {
            setInvalidField("email");
            return;
        }
    }

    return(
        <FormCard>
            <CardHeader>
                <CardTitle>
                    忘記密碼
                </CardTitle>
            </CardHeader>
            <CardContent
                className="flex flex-col gap-4"
            >
                <FormSeparator>或以 Email 登入</FormSeparator>
                <form
                    className="flex flex-col gap-8"
                    onSubmit={() => {}}
                >
                    <FormRow>
                        <Label htmlFor='email'>Email</Label>
                        <Input id='email' type='email' name="email" placeholder='mail@example.com' 
                            aria-invalid={invalidField === "email"}
                            onFocus={() => setInvalidField("none")}
                        />
                        {invalidField === "password" &&
                            <p className='text-muted-foreground peer-aria-invalid:text-destructive text-xs'>無效的 email 格式</p>
                        }
                    </FormRow>
                    <FormRow>
                        <Button disabled={isPending} type="submit">
                            下一步
                        </Button>
                    </FormRow>
                </form>
                <div
                    className="flex justify-center items-center"
                >
                    沒有帳號？
                    <Button
                        variant="link"
                        render={
                            <Link
                                href="/sign-up"
                            >註冊</Link>
                        }
                    />
                    
                </div>
            </CardContent>
        </FormCard>
    )
}

export const ResendVerifyEmailButton = () => {
    const [isPending, startTransition] = useTransition();

    const handleResendVerifyEmail = () => {
        startTransition(async () => {
            const result = await fetch("/api/resend-verify-email", {
                method: "POST"
            })

            if (!result.ok) {
                toast.error("寄送失敗", {
                    position: "top-center"
                })
            }

            toast.error("寄送成功", {
                position: "top-center"
            })
        })
    }

    return(
        <Button 
            variant="default"
            onClick={handleResendVerifyEmail}
            disabled={isPending}
        >
            透過信箱重設密碼
        </Button>
    )
}