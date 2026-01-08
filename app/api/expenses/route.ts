import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/expenses`,
      body,
      {
        headers: {
          Authorization: `Bearer ${(session as any).accessToken}`,
        },
      }
    );

    return NextResponse.json(res.data);
  } catch (err: any) {
    return NextResponse.json(
      { message: err.response?.data?.message || "Failed to create expense" },
      { status: err.response?.status || 500 }
    );
  }
}
