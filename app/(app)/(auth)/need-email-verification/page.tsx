import 'server-only'
import { Card, CardContent, CardTitle, CardHeader, CardDescription } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { requireUserPreLogin } from '@/lib/auth/require-login';
import { payloadGetUserByEmail } from '@/lib/auth/payload-server-only';
import { ResendVerifyEmailButton } from './client';
import { Suspense } from 'react';


export const instant = false

const NeedEmailVerificationPage = async ({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
    return (
        <Suspense fallback={"載入中"}>
            <NeedEmailVerificationSection searchParams={searchParams}/>
        </Suspense>
        
    )
}

export default NeedEmailVerificationPage;

const NeedEmailVerificationSection = async ({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
    const preLoginData = await requireUserPreLogin();

    const {email} = preLoginData;

    const user = await payloadGetUserByEmail(email);

    if (!user) redirect("/login?reason=login-required");

    if (user._verified) {
        redirect("/login?reason=already-verified");
    }


    return (
        <Card className="min-w-lg">
            <CardHeader>
                <CardTitle>已寄送驗證信至{user.email}</CardTitle>
                <CardDescription>請至信箱收件匣完成驗證</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <p>沒有收到驗證信嗎？</p>
                <ResendVerifyEmailButton/>
            </CardContent>
        </Card>
    )
}