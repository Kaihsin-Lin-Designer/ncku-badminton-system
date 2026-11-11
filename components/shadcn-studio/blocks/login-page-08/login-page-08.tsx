'use client'

import { useRef, type CSSProperties, type PointerEvent, type ReactElement } from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Card } from '@/components/ui/card'

import Logo from '@/components/shadcn-studio/logo'
import LoginForm from '@/components/shadcn-studio/blocks/login-page-08/login-form'
import { LayoutGridIcon, CalendarRangeIcon, PaletteIcon } from "lucide-react"

type Capability = {
  icon: ReactElement
  label: string
}

const capabilities: Capability[] = [
  {
    icon: (
      <LayoutGridIcon className='size-4' />
    ),
    label: 'Companies, People, Opportunities, Tasks and Notes'
  },
  {
    icon: (
      <CalendarRangeIcon className='size-4' />
    ),
    label: 'Table, board and calendar views'
  },
  {
    icon: (
      <PaletteIcon className='size-4' />
    ),
    label: 'Twelve theme presets, light and dark'
  }
]

const Login = () => {
  const rootRef = useRef<HTMLDivElement>(null)

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const root = rootRef.current

    if (!root) return

    const rect = root.getBoundingClientRect()

    root.style.setProperty('--spot-x', `${event.clientX - rect.left}px`)
    root.style.setProperty('--spot-y', `${event.clientY - rect.top}px`)
  }

  const offScreen = { '--spot-x': '-100vw', '--spot-y': '-100vh' } as CSSProperties

  return (
    <div
      ref={rootRef}
      onPointerMove={handlePointerMove}
      style={offScreen}
      className='group/backdrop bg-background relative isolate flex h-screen flex-col overflow-hidden'
    >
      {/* Blurred background */}
      <div aria-hidden className='pointer-events-none absolute inset-0 -z-30 scale-105'>
        <img
          src='https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/auth/image-2.png'
          alt='Shadcn Studio login page background'
          fetchPriority='high'
          className='size-full object-cover opacity-90 blur-[7px] saturate-[0.3] dark:hidden'
        />
        <img
          src='https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/auth/image-2-dark.png'
          alt='Shadcn Studio login page background'
          fetchPriority='high'
          className='hidden size-full object-cover opacity-90 blur-[7px] saturate-[0.3] dark:block'
        />
      </div>
      <div aria-hidden className='bg-muted/75 dark:bg-background/80 pointer-events-none absolute inset-0 -z-20' />
      {/* Cursor spotlight reveal */}
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 -z-10 scale-105 opacity-0 transition-opacity duration-500 group-hover/backdrop:opacity-100 motion-reduce:hidden'
        style={{
          maskImage: 'radial-gradient(circle 300px at var(--spot-x) var(--spot-y), black 0%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(circle 300px at var(--spot-x) var(--spot-y), black 0%, transparent 70%)'
        }}
      >
        <img
          src='https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/auth/image-2.png'
          alt='Shadcn Studio login page background'
          loading='lazy'
          className='size-full object-cover dark:hidden'
        />
        <img
          src='https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/auth/image-2-dark.png'
          alt='Shadcn Studio login page background'
          loading='lazy'
          className='hidden size-full object-cover dark:block'
        />
      </div>

      <div className='relative z-10 flex items-center gap-2.5 px-6 py-4 sm:px-8'>
        <a href='#'>
          <Logo className='gap-3' />
        </a>
      </div>

      <div className='relative z-10 flex flex-1 items-center justify-center px-4 pt-2 pb-14 sm:px-6'>
        <Card className='bg-card/95 supports-backdrop-filter:bg-card/85 dark:bg-popover/95 dark:supports-backdrop-filter:bg-popover/85 w-full max-w-md gap-0 p-0 shadow-xl! backdrop-blur-2xl lg:grid lg:max-w-4xl lg:grid-cols-2'>
          <div className='flex flex-col gap-6 p-6 sm:p-8'>
            <div className='flex flex-col gap-2'>
              <h1 className='text-2xl font-semibold tracking-tight'>Sign in</h1>
              <p className='text-muted-foreground text-sm text-pretty'>Welcome back. Enter your details to continue.</p>
            </div>

            {/* Social Login */}
            <div className='flex flex-col gap-4'>
              <div className='grid grid-cols-2 gap-3'>
                <Button
                  variant='outline'
                  nativeButton={false}
                  render={
                    <a href='#'>
                      <img
                        src='https://cdn.shadcnstudio.com/ss-assets/brand-logo/google-icon.png'
                        alt=''
                        aria-hidden
                        className='size-4'
                      />
                      Google
                    </a>
                  }
                />
                <Button
                  variant='outline'
                  nativeButton={false}
                  render={
                    <a href='#'>
                      <img
                        src='https://cdn.shadcnstudio.com/ss-assets/brand-logo/microsoft-icon.png'
                        alt=''
                        aria-hidden
                        className='size-4 rounded-full'
                      />
                      Microsoft
                    </a>
                  }
                />
              </div>

              <div className='flex items-center gap-3'>
                <Separator className='flex-1' />
                <span className='text-muted-foreground shrink-0 text-xs'>or continue with</span>
                <Separator className='flex-1' />
              </div>
            </div>

            <LoginForm />

            <p className='text-muted-foreground text-center text-sm'>
              Don&apos;t have an account?{' '}
              <a href='#' className='text-foreground hover:underline'>
                Sign up
              </a>
            </p>
          </div>

          {/* Brand Panel */}
          <aside className='bg-muted/40 hidden flex-col justify-center gap-8 rounded-r-2xl border-s p-8 lg:flex'>
            <div>
              <p className='text-2xl font-semibold tracking-tight'>shadcn/studio</p>
              <p className='text-muted-foreground mt-3 text-sm leading-relaxed text-balance'>
                A complete admin interface, built on shadcn/ui and ready for your own data.
              </p>
            </div>

            <ul className='flex flex-col gap-5'>
              {capabilities.map(capability => (
                <li key={capability.label} className='flex items-center gap-3.5'>
                  <span className='bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-lg'>
                    {capability.icon}
                  </span>
                  <span className='text-sm leading-relaxed'>{capability.label}</span>
                </li>
              ))}
            </ul>
          </aside>
        </Card>
      </div>
    </div>
  )
}

export default Login
