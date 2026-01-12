import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import axios from "axios"
import { NextResponse } from "next/server"

export async function DELETE(_req: Request, context: { params: Promise<{ groupId: string }> }) {
    const { groupId } = await context.params
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = (session as any).accessToken
    try {
        await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/groups/${groupId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        return NextResponse.json({ success: true })
    } catch (err: any) {
        return NextResponse.json({ message: "Cannot delete, please try again later" }, { status: 500 })
    }
}
