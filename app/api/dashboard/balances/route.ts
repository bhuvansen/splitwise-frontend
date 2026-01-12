import axios from "axios"
import { NextResponse } from "next/server"

export async function GET() {
  const res = await axios.get("/api/dashboard/balances")
  return NextResponse.json(res.data)
}
