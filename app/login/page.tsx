"use client"

import { signIn, useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Spinner from "@/components/Spinner"

export default function LoginPage() {
    const { status } = useSession()
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (status === "authenticated") {
            router.replace("/")
        }
    }, [status])

    if (status === "loading") {
        return <Spinner />
    } else if (status === "authenticated") {
        return <Spinner />
    }
    return (
        <div className="min-h-screen px-6 pt-12">
            {!loading ? (
                <div>
                    <h1 className="text-3xl font-bold mb-6">Sign in to Splitwise</h1>

                    <button
                        onClick={() => {
                            setLoading(true)
                            signIn("google")
                        }}
                        className="px-6 py-2 border rounded hover:bg-gray-100"
                    >
                        Continue with Google
                    </button>
                </div>
            ) : (
                <Spinner />
            )}
        </div>
    )
}
