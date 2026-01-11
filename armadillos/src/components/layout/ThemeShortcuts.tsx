"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

export function ThemeShortcuts() {
    const { setTheme } = useTheme();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if user is typing in an input or textarea
            if (
                e.target instanceof HTMLInputElement ||
                e.target instanceof HTMLTextAreaElement ||
                (e.target as HTMLElement).isContentEditable
            ) {
                return;
            }

            switch (e.key.toLowerCase()) {
                case "d":
                    setTheme("dark");
                    break;
                case "l":
                    setTheme("light");
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [setTheme]);

    return null; // This component renders nothing visual
}
