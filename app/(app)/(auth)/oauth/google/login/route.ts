import { NextRequest } from "next/server"
import { signInWithGoogle } from "@/lib/auth/google"

export async function GET(req: NextRequest) {
    return await signInWithGoogle()
}