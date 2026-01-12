import { NextRequest, NextResponse } from "next/server"
import axios from "axios"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function PUT(req: NextRequest, context: { params: Promise<{ expenseId: string }> }) {
    const { expenseId } =  await context.params
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
    } catch (err: any)  {
        if (err.response) {
            return NextResponse.json(err.response.data, { status: err.response.status })
        }

        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}


export async function DELETE(req: NextRequest, context: { params: Promise<{ expenseId: string }> }) {
    const { expenseId } = await context.params
    try {
        const session = await getServerSession(authOptions) 
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }
        const res = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/expenses/${expenseId}`, {
            headers: {
                Authorization: `Bearer ${(session as any).accessToken}`,
            },
        })
        return NextResponse.json({ message: "Expense deleted successfully" }, { status: 200 })
    } catch (err: any)  {
        if (err.response) {
            return NextResponse.json(err.response.data, { status: err.response.status })
        }

        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}