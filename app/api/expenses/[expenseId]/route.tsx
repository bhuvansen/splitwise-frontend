import { NextRequest, NextResponse } from "next/server"
import axios from "axios"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function PUT(req: NextRequest, { params }: { params: { expenseId: string } }) {
    const { expenseId } = await params
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const res = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/expenses/${expenseId}`, body, {
            headers: {
                Authorization: `Bearer ${(session as any).accessToken}`,
                "Content-Type": "application/json",
            },
        })

        return NextResponse.json(res.data)
    } catch (err: any) {
        console.error("Update expense failed", err.response?.data || err)
        return NextResponse.json({ message: "Failed to update expense" }, { status: err.response?.status || 500 })
    }
}
