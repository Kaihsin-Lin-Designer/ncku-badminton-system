import 'server-only'
import { payloadSendVerifyMail } from '@/lib/auth/payload-server-only'
import { ForgotPasswordForm } from './client'
import { Card, CardContent, CardTitle, CardHeader, CardDescription, CardFooter } from "@/components/ui/card";
import { Suspense } from 'react';
import { requireUserPreLogin } from '@/lib/auth/require-login';
import { payloadGetUserByEmail } from '@/lib/auth/payload-server-only';
import { redirect } from 'next/navigation';
import { ResendVerifyEmailButton } from './client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';


const ForgotPasswordPage = async () => {
    return(
        <Suspense fallback={"載入中"}>
            <ForgotPasswordSection/>
        </Suspense>
    )
}

export default ForgotPasswordPage;

const ForgotPasswordSection= async () => {
    const preLoginData = await requireUserPreLogin();

    const {email} = preLoginData;

    const user = await payloadGetUserByEmail(email);

    if (!user) redirect("/login?reason=login-required");

    return(
        <Card className="min-w-lg">
            <CardHeader>
                <CardTitle>我們會寄送一封至 {user.email}</CardTitle>
                <CardDescription>請至信箱收件匣完成密碼重設</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <ResendVerifyEmailButton/>
            </CardContent>
            <CardFooter>
                <p>這不是您？</p>
                <Button
                    variant="link"
                    render={<Link href="/login"></Link>}
                >切換 Email</Button>
            </CardFooter>
        </Card>
    )
}