import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Page() {
    // Force logout on this page visit
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (session) {
        // Sign out the user if they have a session
        await auth.api.signOut({
            headers: await headers(),
        })
    }

    // Always redirect to login page
    redirect('/auth/login')
}
