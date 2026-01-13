import { authOptions } from "@/lib/auth"
import axios from "axios"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function DELETE(_req: Request, context: { params: Promise<{ groupId: string, memberId: string }> }) {
    const { groupId, memberId } = await context.params
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = (session as any).accessToken
    try {
        await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/groups/${groupId}/members/${memberId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        return NextResponse.json({ success: true })
    } catch (err: any) {
        if (err.response) {
            return NextResponse.json(err.response.data, { status: err.response.status })
        }

        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}
