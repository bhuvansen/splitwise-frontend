import { NextResponse } from "next/server";
import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const { name } = await req.json();

    const token = (session as any).accessToken;

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/groups`,
      { name },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(res.data, { status: 201 });
  } catch (error: any) {
    console.log("error:", error)
    console.error("Create group error:", error?.response?.data || error);

    return NextResponse.json(
      { message: error?.response?.data || error},
      { status: 500 }
    );
  }
}
