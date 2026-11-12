'use client'
import { FormCard, FormSeparator, FormRow  } from "@/components/custom/Form";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useTransition } from "react";
import { LoginResult, payloadLogin } from "@/lib/auth/payload-login";
import { Separator } from "@/components/ui/separator";
import { PreLoginData } from "@/lib/auth/pre-login";
import { toast } from "sonner";
import { redirect } from "next/navigation";


type Field = "password" | "none"

export const LoginPasswordForm = ({
    preLoginData
}: {
    preLoginData: PreLoginData
}) => {
    const [isPending, startTransition] = useTransition();
    const [result, setResult] = useState<LoginResult | null>(null);
    const [invalidField, setInvalidField] = useState<Field>("none");

    const {email} = preLoginData; 

    const handleLogin = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const fd = new FormData(e.currentTarget);
        const password = fd.get("password")?.toString();
        if (!password) {
            setInvalidField("password");
            toast.error("請輸入密碼", {
                position: "top-center"
            });
            return;
        }

        startTransition( async () => {
            const result = await payloadLogin(email, password);

            if (!result.ok) {
                toast.error("登入失敗", {
                    position: "top-center",
                    description: "請檢查輸入或稍後再試"
                });
                return;
            }

            toast.success("登入成功", {
                position: "top-center",
            });
            redirect("/api/users/me");
        })

    }

    return(
        <FormCard>
            <CardHeader>
                <CardTitle>
                    {preLoginData.email}
                </CardTitle>
            </CardHeader>
            <CardContent
                className="flex flex-col gap-4"
            >
                <Separator/>
                <form
                    className="flex flex-col gap-8"
                    onSubmit={(e) => handleLogin(e)}
                >
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
    )
}