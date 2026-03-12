// TODO: Replace with real BetterAuth client when FE-AUTH-01 lands.
// This mock allows FE-AUTH-03 (login) and other frontend tasks to build
// independently without the `better-auth` package installed.

type AuthResponse<T> = {
    data: T | null
    error: { status: number; message: string } | null
}

type SignInOptions = {
    onError?: (ctx: { error: { status: number; message: string } }) => void
}

type MockAuthClient = {
    signIn: {
        email: (
            credentials: { email: string; password: string },
            options?: SignInOptions,
        ) => Promise<AuthResponse<{ user: { id: string; email: string; name: string } }>>
    }
    signUp: {
        email: (
            data: {
                email: string
                password: string
                name: string
                universityId: string
                year: number
                department?: string
            },
        ) => Promise<AuthResponse<{ user: { id: string; email: string } }>>
    }
    signOut: () => Promise<void>
    useSession: () => { data: Session | null; isPending: boolean }
}

export type Session = {
    user: {
        id: string
        email: string
        name: string
        role: string
        approved: boolean
        emailVerified: boolean
    }
}

export const authClient: MockAuthClient = {
    signIn: {
        email: async (credentials, options) => {
            // Simulate network delay
            await new Promise((resolve) => setTimeout(resolve, 800))

            // Mock: always return success for now
            return {
                data: {
                    user: {
                        id: "mock-user-id",
                        email: credentials.email,
                        name: "Mock User",
                    },
                },
                error: null,
            }
        },
    },
    signUp: {
        email: async (data) => {
            await new Promise((resolve) => setTimeout(resolve, 800))
            return {
                data: { user: { id: "mock-user-id", email: data.email } },
                error: null,
            }
        },
    },
    signOut: async () => { },
    useSession: () => ({ data: null, isPending: false }),
}
