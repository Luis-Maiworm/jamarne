import { cn } from '@/lib/utils'

import '@/components/ui/8bit/styles/retro.css'

interface CardProps extends React.ComponentProps<'div'> {
  font?: 'normal' | 'retro'
}

function Card({ className, font, ...props }: CardProps) {
  return (
    <div
      {...props}
      className={cn(
        'rounded-none border-2 border-foreground bg-background/85 text-foreground shadow-[6px_6px_0px_0px_var(--color-foreground)]',
        font !== 'normal' && 'retro',
        className
      )}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div {...props} className={cn('flex flex-col gap-3 p-5', className)} />
}

function CardTitle({ className, ...props }: React.ComponentProps<'h2'>) {
  return <h2 {...props} className={cn('text-2xl uppercase tracking-widest', className)} />
}

function CardDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return <p {...props} className={cn('text-sm opacity-85 leading-relaxed', className)} />
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div {...props} className={cn('px-5 pb-5', className)} />
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent }
