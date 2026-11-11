'use client'

import { Button } from "@/components/ui/button"
import { GoogleOAuthButton } from "../login/client";
import { FormCard, FormSeparator, FormRow  } from "@/components/custom/Form";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState, useTransition} from "react"
import type { User } from "@/payload-types";
import { payloadSignUp, SignUpResult } from "@/lib/auth/payload-sign-up";
import { redirect } from "next/navigation";
import { toast } from 'sonner'


const SignUpPage = () => {

    const [isPending, startTransition] = useTransition();
    const [result, setResult] = useState<SignUpResult | null>(null)

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log("start submit")

        const fd = new FormData(e.currentTarget);
        const email = fd.get("email")?.toString();

        if (!email) return;

        startTransition( async () => {
            const result = await payloadSignUp(email);
            console.log("end signup")
            setResult(result);
            if (result?.ok) {
                toast.success('註冊成功', {
                    position: "top-center",
                })
                redirect("/login");
            }
            else {
                toast.error('註冊失敗', {
                    position: "top-center",
                    description: "請檢查 email 輸入是否正確，或稍後再試。"
                })
            }
        })

        
    }


    return(
        <>
            <main
                className="bg-neutral-200"
            >
                <div className="container min-h-lvh flex items-center justify-center">
                    <FormCard>
                        <CardHeader>
                            <CardTitle>
                                Sign Up
                            </CardTitle>
                        </CardHeader>
                        <CardContent
                            className="flex flex-col gap-4"
                        >
                            <div
                                className="flex justify-center"
                            >
                                <GoogleOAuthButton/>
                            </div>
                            <FormSeparator>或以 Email 註冊</FormSeparator>
                            <form
                                className="flex flex-col gap-8"
                                onSubmit={(e) => handleSubmit(e)}
                            >
                                <FormRow>
                                    <Label htmlFor='email'>Email</Label>
                                    <Input id='email' type='email' name="email" placeholder='mail@example.com'/>

                                </FormRow>
                                {/* <FormRow>
                                    <Label htmlFor='password'>Password</Label>
                                    <Input id='password' type='password' />
                                </FormRow>
                                <FormRow>
                                    <Label htmlFor='repeat-password'>Password</Label>
                                    <Input id='repeat-password' type='password' />
                                </FormRow> */}
                                <FormRow>
                                    <Button type="submit"
                                        disabled={isPending}
                                    >
                                        Sign Up
                                    </Button>
                                </FormRow>
                            </form>
                            <div
                                className="flex justify-center items-center"
                            >
                                已有帳號？
                                <Button
                                    variant="link"
                                    render={
                                        <Link
                                            href="/login"
                                        >登入</Link>
                                    }
                                />
                                
                            </div>
                        </CardContent>
                        
                    </FormCard>
                </div>
            </main>
        </>
    )
}

export default SignUpPage
