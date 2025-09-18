import { SocialProviderButton } from './social-provider-button'

interface SocialProvidersProps {
    callbackUrl: string
}

export function SocialProviders({ callbackUrl }: SocialProvidersProps) {
    const providers = ['google']
    return (
        <div className="flex flex-col gap-4">
            {providers.map((provider) => (
                <SocialProviderButton
                    key={provider}
                    provider={provider}
                    callbackURL={callbackUrl}
                />
            ))}
        </div>
    )
}
