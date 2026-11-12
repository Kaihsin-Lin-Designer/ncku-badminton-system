import 'server-only'
import { ResetPasswordForm } from './client';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { payloadVerifyResetPasswordToken } from '@/lib/auth/payload-server-only';

const ResetPasswordPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
    return(
      <main className='bg-neutral-200'>
        <div className="container min-h-lvh flex items-center justify-center">
          <Suspense fallback={"載入中"}>
            <ResetPasswordSection searchParams={searchParams}/>
          </Suspense>
        </div>

      </main>
    )

    
}

export default ResetPasswordPage

const ResetPasswordSection = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
    const {token} = await searchParams;
    if (!token || Array.isArray(token)) {
      redirect("/login");
    }

    const result = await payloadVerifyResetPasswordToken(token);

    if (!result.ok) {
      redirect("/need-email-verification");
    }

    return(
      <ResetPasswordForm token={token}/>
    )

    
}