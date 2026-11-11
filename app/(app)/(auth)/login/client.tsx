'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export const GoogleOAuthButton = () => {

  return(
    <Button
      variant='outline'
      nativeButton={false}
      render={<a href="/oauth/google/login"></a>}
    >
      <img
        src='https://cdn.shadcnstudio.com/ss-assets/brand-logo/google-icon.png'
        alt=''
        aria-hidden
        className='size-4'
        />
        Google
    </Button>
  )
}

const LoginForm = () => {
  return (
    <form className='space-y-4' onSubmit={e => e.preventDefault()}>
      <FieldGroup className='gap-4'>
        {/* Email */}
        <Field className='gap-2'>
          <FieldLabel htmlFor='email'>Email</FieldLabel>
          <Input type='email' id='email' autoComplete='email' placeholder='you@company.com' />
        </Field>

        {/* Password */}
        <Field className='gap-2'>
          <div className='flex items-center justify-between gap-2'>
            <FieldLabel htmlFor='password'>Password</FieldLabel>
            <a href='#' className='text-muted-foreground text-xs text-nowrap hover:underline'>
              Forgot password?
            </a>
          </div>
          <Input id='password' type='password' placeholder='Enter new password' autoComplete='current-password' />
        </Field>

        {/* Remember Me */}
        <Field orientation='horizontal' className='flex items-center gap-2'>
          <Checkbox id='rememberMe' />
          <FieldLabel htmlFor='rememberMe' className='text-muted-foreground'>
            Remember me for 30 days
          </FieldLabel>
        </Field>

        <Field>
          <Button className='w-full' type='submit'>
            Sign in
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}

export default LoginForm
