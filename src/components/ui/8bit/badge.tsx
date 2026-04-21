import { cn } from '@/lib/utils'

import '@/components/ui/8bit/styles/retro.css'

interface BadgeProps extends React.ComponentProps<'span'> {
  font?: 'normal' | 'retro'
}

function Badge({ className, font, ...props }: BadgeProps) {
  return (
    <span
      {...props}
      className={cn(
        'inline-flex items-center border-2 border-foreground bg-foreground px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-background',
        font !== 'normal' && 'retro',
        className
      )}
    />
  )
}

export { Badge }
