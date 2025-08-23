import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

type ButtonActionDynamicProps = React.ComponentPropsWithoutRef<typeof Button> & {
  icon: React.ReactNode
  tooltip: string
}

export function ButtonActionDynamic({
  icon,
  tooltip,
  className,
  ...props
}: ButtonActionDynamicProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="sm" className={cn('p-2', className)} {...props}>
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="center">
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
