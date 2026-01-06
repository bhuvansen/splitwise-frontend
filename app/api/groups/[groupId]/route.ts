import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import axios from "axios"
import { NextResponse } from "next/server"

export async function DELETE(_req: Request, { params }: { params: { groupId: string } }) {
    const { groupId } = await params
    console.log("groupId::", params, groupId)
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
        if (err.response) {
            return NextResponse.json(err.response.data, { status: err.response.status })
        }

        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}
