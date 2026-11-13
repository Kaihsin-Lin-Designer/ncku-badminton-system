import 'server-only'
import { ResetPasswordForm } from './client';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { payloadVerifyResetPasswordToken } from '@/lib/auth/payload-server-only';
import { redirectLogin } from '@/lib/auth/utils';

const ResetPasswordPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
    return(
      <Suspense fallback={"載入中"}>
        <ResetPasswordSection searchParams={searchParams}/>
      </Suspense>
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
      redirectLogin();
    }

    const result = await payloadVerifyResetPasswordToken(token);

    if (!result.ok) {
      redirect("/need-email-verification");
    }

    return(
      <ResetPasswordForm token={token}/>
    )

    
}