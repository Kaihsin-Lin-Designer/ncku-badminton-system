'use client'
import { useState, useTransition } from "react"
import { CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { FormCard, FormRow } from '@/components/custom/Form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User } from "@/payload-types";
import { toast } from "sonner";
import { redirect } from "next/navigation";


type Field = "new_password" | "confirm_password"


export const ResetPasswordForm = ({token}: {token: User["resetPasswordToken"]}) => {
    const [isPending, startTransition] = useTransition();
    const [invalidField, setInvalidField] = useState<Field | null>(null);

    const handleResetPassword = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        startTransition( async () => {
            const fd = new FormData(e.currentTarget);
            const newPassword = fd.get("new_password")?.toString()
            const confirmPassword = fd.get("confirm_password")?.toString()

            console.log(newPassword, confirmPassword)
            
            if (!newPassword) {
                toast.error("請填入新密碼", {
                    position: "top-center"
                });
                setInvalidField("new_password");
                return;
            }
            if (newPassword !== confirmPassword) {
                toast.error("密碼不一致", {
                    position: "top-center"
                });
                setInvalidField("confirm_password");
                return;
            }

            const result = await fetch("/api/reset-password", {
                method: "POST",
                body: JSON.stringify({
                    token: token,
                    new_password: newPassword
                })
            })

            if (!result.ok) {
                toast.error("設定密碼時發生錯誤，請重試", {
                    position: "top-center"
                });
                return;
            }

            toast.success("設定密碼成功", {
                position: "top-center"
            });
            redirect("/login");
        })
    }

    return(
        <FormCard>
            <CardHeader>
                <CardTitle>
                    設定密碼
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form
                    className="flex flex-col gap-8"
                    onSubmit={(e) => handleResetPassword(e)}
                >
                    <FormRow>
                        <Label htmlFor="new_password">新密碼</Label>
                        <Input type="password" id="new_password" name="new_password"/>
                    </FormRow>
                    <FormRow>
                        <Label htmlFor="confirm_password">確認密碼</Label>
                        <Input type="password" id="confirm_password" name="confirm_password"/>
                    </FormRow>
                    <FormRow>
                        <Button
                            type="submit"
                            disabled={isPending}    
                        >設定密碼</Button>
                    </FormRow>
                </form>
            </CardContent>
        </FormCard>
        
    )
}