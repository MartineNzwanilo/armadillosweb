"use server";

import { cookies } from "next/headers";

const ADMIN_PASSWORD = "admin123"; // Deprecated
const SESSION_COOKIE = "armadillos_admin_session";
const API_URL = "http://192.168.20.169:3005/api/v1/auth/login";

export async function setAdminSession(username: string, password: string) {
    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (!res.ok) {
            const errText = await res.text();
            console.error(`Auth Error: ${res.status} ${errText}`);
            throw new Error(`Invalid credentials: ${res.status}`);
        }

        const data = await res.json();
        const token = data.token;

        const cookieStore = await cookies();
        cookieStore.set(SESSION_COOKIE, token, {
            httpOnly: false, // Allow client access for API headers
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/",
        });
        return { success: true, token };
    } catch (e) {
        console.error("Auth Exception:", e);
        throw new Error("Authentication failed");
    }
}

export async function verifySession() {
    const cookieStore = await cookies();
    const session = cookieStore.get(SESSION_COOKIE);
    console.log("Verifying Session:", session?.value ? "Valid" : "Invalid");
    return !!session?.value;
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE);
}

export async function getAuthToken() {
    const cookieStore = await cookies();
    return cookieStore.get(SESSION_COOKIE)?.value;
}
