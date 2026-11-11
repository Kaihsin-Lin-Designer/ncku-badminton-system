import { NextRequest } from "next/server";
import { payloadSignUp } from "@/lib/auth/payload-sign-up";
import { redirect } from "next/navigation";

export async function POST(req: NextRequest) {
    const res = await req.json();

    const {email} = res;

    if (!email || typeof email !== "string") {
        redirect(`/sign-up`)
    }
}