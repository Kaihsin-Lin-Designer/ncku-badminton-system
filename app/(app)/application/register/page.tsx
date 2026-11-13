import 'server-only'
import { FormCard } from '@/components/custom/Form';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { headers as getHeaders } from 'next/headers'
import { getPayload, createLocalReq } from 'payload'
import config from '@payload-config'
import usersOnly, { isUser } from '@/access/users';
import { redirectLogin } from '@/lib/auth/utils';
import { RegisterForm } from './client';
import { Suspense } from 'react';
import { Separator } from '@/components/ui/separator';
import { isAdmin } from '@/access/admins';
import { connection } from 'next/server';

const RegisterPage = () => {
    return(
        <Suspense>
            <RegisterSection/>
        </Suspense>
    )
}

export default RegisterPage;

const RegisterSection = async () => {
    await connection();
    const headers = await getHeaders();
    const payload = await getPayload({config});

    const {user} = await payload.auth({headers: headers});

    const req = await createLocalReq({user: user ?? undefined}, payload);

    if (!usersOnly({req})) redirectLogin("login-required");

    return(
        <FormCard>
            <CardHeader>
                <CardTitle>
                    填寫校友資訊
                </CardTitle>
                <CardDescription>
                    {user?.email}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Separator />
                <RegisterForm/>
            </CardContent>
        </FormCard>
        
    )
}