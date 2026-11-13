'use client'

import LoginForm from "./client"
import { Button } from "@/components/ui/button"
import { GoogleOAuthButton } from "./client";
import { FormCard, FormSeparator, FormRow  } from "@/components/custom/Form";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { payloadPreLogin, PreLoginResult } from "@/lib/auth/payload-login";
import { useState, useTransition, useEffect, Suspense } from "react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { parseRedirectReason } from "@/lib/auth/utils"



type Field = "email" | "password" | "none"

const LoginPage = () => {
    const router = useRouter();


    const [isPending, startTransition] = useTransition();
    const [result, setResult] = useState<PreLoginResult | null>(null);
    const [invalidField, setInvalidField] = useState<Field>("none");




    const handleLogin = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const fd = new FormData(e.currentTarget);
        const email = fd.get("email")?.toString();

        if (!email || typeof email !== "string") {
            setInvalidField("email");
            return;
        }


        startTransition(async () => {
            console.log("submit")
            const result = await payloadPreLogin(email);
            if (result.ok) {
                return router.push("/login/password");
            }

            console.log(result)

            toast.error("登入失敗", {
                position: "top-center",
            })
        })
    }

    return(
        <>
            <Suspense>
                <LoginToast/>
            </Suspense>
            <FormCard>
                <CardHeader>
                    <CardTitle>
                        Login
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
                    <FormSeparator>或以 Email 登入</FormSeparator>
                    <form
                        className="flex flex-col gap-8"
                        onSubmit={(e) => handleLogin(e)}
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
        </>
    )
}

export default LoginPage;

const LoginToast = () => {
    const searchParams = useSearchParams()
    const toastMessage = parseRedirectReason(searchParams.get("reason"));
    useEffect(() => {
        if (toastMessage) {
            toast.info(toastMessage, {
                position: "top-center"
            })
        }
    }, [toastMessage])

    return <></>
}
