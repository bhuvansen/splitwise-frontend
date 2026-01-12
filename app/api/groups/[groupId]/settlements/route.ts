import { NextRequest, NextResponse } from "next/server"
import axios from "axios"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(req: NextRequest, context: { params: Promise<{ groupId: string }> }) {
    try {
        const { groupId } = await context.params
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
    } catch (err: any)  {
        if (err.response) {
            return NextResponse.json(err.response.data, { status: err.response.status })
        }

        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}
