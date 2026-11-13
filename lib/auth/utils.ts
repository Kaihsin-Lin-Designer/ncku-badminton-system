import { redirect } from "next/navigation"

export type redirectReason = "login-required" | "already-verified"


export function redirectLogin(reason?: redirectReason): never {
    if (reason === undefined) redirect(`/login`);
    redirect(`/login?reason=${reason}`);
}

export function parseRedirectReason(reason: redirectReason | string | null): string | null {
    switch(reason as redirectReason) {
        case "login-required":
            return "需要登入";
        case "already-verified":
            return "帳號已驗證"
        default: 
            return null;
    }
}
