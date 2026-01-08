import { NextRequest, NextResponse } from "next/server"
import axios from "axios"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(req: NextRequest, { params }: { params: { groupId: string } }) {
    try {
        const { groupId } = await params
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        const payload = await req.json()
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/groups/${groupId}/settlements`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${(session as any).accessToken}`,
                },
            }
        )
        return NextResponse.json(response.data)
    } catch (err: any) {
        console.error("Settlement API error", err.response?.data || err)

        return NextResponse.json({ message: "Settlement failed" }, { status: err.response?.status || 500 })
    }
}
