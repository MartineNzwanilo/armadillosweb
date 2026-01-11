
import React from "react";
import { verifySession } from "../../lib/auth";
import { redirect } from "next/navigation";
import { AdminLayoutClient } from "./layout-client";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const isAuth = await verifySession();
    if (!isAuth) {
        redirect("/auth/login");
    }

    return (
        <AdminLayoutClient>
            {children}
        </AdminLayoutClient>
    );
}
