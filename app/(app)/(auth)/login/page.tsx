'use client'

import LoginForm from "./client"
import { Button } from "@/components/ui/button"
import { GoogleOAuthButton } from "./client";
import { FormCard, FormSeparator, FormRow  } from "@/components/custom/Form";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { payloadLogin, LoginResult } from "@/lib/auth/payload-login";
import { useState, useTransition } from "react";
import { redirect } from "next/navigation";
import { toast } from "sonner";



type Field = "email" | "password" | "none"

const LoginPage = () => {

    const [isPending, startTransition] = useTransition();
    const [result, setResult] = useState<LoginResult | null>(null);
    const [invalidField, setInvalidField] = useState<Field>("none");

    const handleLogin = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const fd = new FormData(e.currentTarget);
        const email = fd.get("email")?.toString();
        const password = fd.get("password")?.toString();

        if (!email || typeof email !== "string") {
            setInvalidField("email");
            return;
        }
        if (!password || typeof password !== "string") {
            setInvalidField("password");
            return;
        }


        startTransition(async () => {
            console.log("submit")
            const result = await payloadLogin(email, password);
            if (result.ok) {
                toast.success("登入成功", {
                    position: "top-center"
                })
                return redirect("/api/users/me");
            }

            console.log(result)

            switch (result.reason) {
                case "Invalid email":
                    setInvalidField("email");
                    break;
                case "Invalid password":
                    setInvalidField("password");
                    break;
                default:
                    toast.error("登入失敗", {
                        position: "top-center",
                        description: "可能是錯誤的帳號或密碼"
                    })
                    break;
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
                            <FormSeparator>或以密碼登入</FormSeparator>
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
                                    <div className='flex items-center justify-between'>
                                        <Label htmlFor='password'>Password</Label>
                                        <Button
                                            variant="link"
                                            render={
                                                <Link
                                                    href="/forgot-password"
                                                >忘記密碼?</Link>
                                            }
                                        />
                                    </div>
                                    <Input id='password' type='password' name="password" 
                                        aria-invalid={invalidField === "password"}
                                        onFocus={() => setInvalidField("none")}
                                    />
                                    {invalidField === "password" &&
                                        <p className='text-muted-foreground peer-aria-invalid:text-destructive text-xs'>無效的密碼</p>
                                    }
                                </FormRow>
                                <FormRow>
                                    <Button disabled={isPending} type="submit">
                                        Login
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
                </div>
            </main>
        </>
    )
}

export default LoginPage
