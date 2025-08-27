'use client'
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function getOrCreateClientId() {
    if (typeof window === "undefined") return ""; // server: return empty
    const key = "oAnalytics_id";
    let id = localStorage.getItem(key);
    if (!id) {
        id = crypto.randomUUID(); // or use your own generator
        localStorage.setItem(key, id);
    }
    return id;
}

interface AnalyticsTrackerProps {
    appId: string;
}


export const AnalyticsTracker = (
    { appId }: AnalyticsTrackerProps
) => {
    console.log("I am working bitch")

    if (typeof window === "undefined") return ""; // server: return empty

    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [sessionId] = useState(() => crypto.randomUUID());

    const url = pathname + (searchParams?.toString() ? `?${searchParams}` : "");

    useEffect(() => {
        async function send() {
            const payload = {
                session_id: sessionId,
                client_id: getOrCreateClientId(),
                path: url,
                search: location.search,
                hash: location.hash,
                timestamp: Date.now(),
                userAgent: navigator.userAgent,
                referrer: document.referrer || "direct",
                app_id: appId
            };

            // navigator.sendBeacon("http://localhost:3000/log", JSON.stringify(payload));


            const response = await fetch("https://oanalytics-server-production.up.railway.app/log", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const result = await response.json();
            console.log(result);
        }

        send()
    }, [pathname, searchParams, appId]);

    return null;
};

