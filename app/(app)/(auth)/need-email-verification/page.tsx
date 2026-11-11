import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { payloadGetUser } from "@/lib/auth/payload-common";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Suspense } from "react";
import { User } from "@/payload-types";

export const instant = false

const NeedEmailVerificationPage = async ({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {

    const { email } = await searchParams
    if (!email || typeof email !== 'string') redirect('/login')

    const res = await payloadGetUser({ email })
    if (!res.ok || res.user._verified) redirect('/login')

    return (
        <main className="bg-neutral-200">
        <div className="container min-h-lvh flex items-center justify-center">
            <Card className="min-w-lg">
                <CardHeader>
                    <CardTitle>已寄送驗證信至 {res.user.email}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <p>沒有收到驗證信嗎？</p>
                    {/* <ResendVerificationButton email={res.user.email} /> */}
                    <Separator />
                    <div className="flex justify-center items-center gap-4">
                        <Button variant="link" render={<Link href="/login">登入</Link>} />
                        <span>或</span>
                        <Button variant="link" render={<Link href="/sign-up">註冊</Link>} />
                    </div>
                </CardContent>
            </Card>
        </div>
        </main>
    )
}

export default NeedEmailVerificationPage;

const NeedEmailVerificationCard = async ({email}: {email: User["email"]}) => {

    const res = await payloadGetUser({email: email});
    console.error(res)

    if (!res.ok) redirect("/login");

    if (res.user._verified) redirect("/login");
    return(
        <Card>
            <CardTitle>
                已寄送 Email 驗證信至 {res.user.email}
            </CardTitle>
            <CardContent>
                <h3>沒有收到驗證信嗎？</h3>
                <Button>
                    重新寄發驗證信
                </Button>
                <Separator/>
                <div
                    className="flex justify-center items-center gap-4"
                >
                    <Button
                        variant="link"
                        render={<Link href="/login">登入</Link>}
                    />
                    <span>或</span>
                    <Button
                        variant="link"
                        render={<Link href="/sign-up">註冊</Link>}
                    />
                </div>
            </CardContent>
        </Card>
    )
}