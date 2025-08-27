import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

function getOrCreateClientId() {
    if (typeof window === "undefined") return ""; // server: return empty
    const key = "oAnalytics_id";
    let id = localStorage.getItem(key);
    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem(key, id);
    }
    return id;
}

interface AnalyticsTrackerProps {
    appId: string;
}

const AnalyticsTrackerClient = ({ appId }: AnalyticsTrackerProps) => {
    const { usePathname, useSearchParams } = require("next/navigation");
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [sessionId] = useState(() => crypto.randomUUID());

    useEffect(() => {
        async function send() {
            const url = pathname + (searchParams?.toString() ? `?${searchParams}` : "");

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

            try {
                const response = await fetch("https://oanalytics-server-production.up.railway.app/log", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                const result = await response.json();
                console.log(result);
            } catch (error) {
                console.error("Analytics tracking failed:", error);
            }
        }

        send();
    }, [pathname, searchParams?.toString(), appId, sessionId]);

    return null;
};

// Export with dynamic import and ssr disabled
export const AnalyticsTracker = dynamic(() => Promise.resolve(AnalyticsTrackerClient), {
    ssr: false,
});