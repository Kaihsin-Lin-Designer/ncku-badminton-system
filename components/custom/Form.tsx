import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { HTMLAttributes } from 'react'
import { Separator } from '@/components/ui/separator'

export const _FormCard = () => {
  return (
    <Card className='w-full max-w-md'>
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>Enter your email below to login to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className='flex flex-col gap-6'>
            <div className='grid gap-2'>
              <Label htmlFor='email'>Email</Label>
              <Input id='email' type='email' placeholder='m@example.com' />
            </div>
            <div className='grid gap-2'>
              <div className='flex items-center'>
                <Label htmlFor='password'>Password</Label>
                <a href='#' className='ml-auto inline-block text-sm underline-offset-4 hover:underline'>
                  Forgot your password?
                </a>
              </div>
              <Input id='password' type='password' />
            </div>
          </div>
        </form>
        <div className='mt-6 flex flex-col gap-2'>
          <Button type='submit' className='w-full'>
            Login
          </Button>
          <Button variant='outline' className='w-full'>
            Continue with Google
          </Button>
        </div>
      </CardContent>
      <CardFooter className='justify-center'>
        <div className='text-sm'>
          Don&apos;t have an account?{' '}
          <a href='#' className='underline underline-offset-4'>
            Sign up
          </a>
        </div>
      </CardFooter>
    </Card>
  )
}

export const FormCard = ({...props}: React.ComponentProps<typeof Card>) => {
    return(
        <Card className='w-full max-w-md mx-auto' {...props}>
        </Card>
    )
}

export const FormHeader = () => <CardHeader/>

export const FormTitle = () => {
    return(
        <Card className='w-full max-w-md'>

        </Card>
    )
}

export const FormSeparator = ({...props}: HTMLAttributes<HTMLDivElement>) => {
    return(
        <div className='flex items-center gap-2'>
            <Separator className="flex-1"/>
            <div>
                {props.children}
            </div>
            <Separator className="flex-1"/>
        </div>
    )
}

export const FormRow = ({...props}: HTMLAttributes<HTMLDivElement>) => {
    return(
        <div className='grid gap-2' {...props}>
            
        </div>
    )
}