'use client'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { SocialProviders } from './social-providers'

export function LoginForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<'div'>) {
    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card className="border shadow-none">
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Welcome back</CardTitle>
                    <CardDescription>
                        Login with your Google account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">
                        <SocialProviders callbackUrl="/app" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
