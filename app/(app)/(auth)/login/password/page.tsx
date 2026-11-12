import 'server-only'
import { LoginPasswordForm } from "./client"
import { getPreLoginData } from '@/lib/auth/pre-login'
import { Suspense } from 'react'
import { redirect } from 'next/navigation'

const LoginPasswordPage = async () => {
    

    return(
        <Suspense fallback={"載入中"}>
            <LoginPasswordSection />
        </Suspense>
    )
}

export default LoginPasswordPage

const LoginPasswordSection = async () => {
    const preLoginData = await getPreLoginData();

    if (!preLoginData) redirect("/login");

    return(
        <LoginPasswordForm preLoginData={preLoginData}/>
    )
}