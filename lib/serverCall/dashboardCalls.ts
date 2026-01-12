import axios from "axios"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth"

export type OverallBalance = {
    userId: string
    userName: string
    amount: number
}

export async function getOverallBalances(): Promise<OverallBalance[]> {
    const session = await getServerSession(authOptions)
    if (!session) {
        throw new Error("Not authenticated")
    }
    console.log("Session:", session)
    const token = (session as any).accessToken
    console.log("Access Token:", token)
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/groups/overall/balances`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return res.data
    } catch (err: any) {
        throw new Error(err.message || "Something went wrong")
    }
}
