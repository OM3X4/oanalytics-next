'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

function getOrCreateClientId() {
    const key = "oAnalytics_id";
    let id = localStorage.getItem(key);
    if (!id) {
        id = crypto.randomUUID(); // or use your own generator
        localStorage.setItem(key, id);
    }
    return id;
}

interface AnalyticsTrackerProps {
    appId: string; // ✅ mandatory
}

export const AnalyticsTracker = (
    { appId }: AnalyticsTrackerProps
) => {
    const router = useRouter();

    const [sessionId] = useState(() => crypto.randomUUID());


    // useEffect(() => {
    //     async function send() {
    //         const payload = {
    //             session_id: sessionId,
    //             client_id: getOrCreateClientId(),
    //             path: location.pathname + location.search + location.hash,
    //             search: location.search,
    //             hash: location.hash,
    //             timestamp: Date.now(),
    //             userAgent: navigator.userAgent,
    //             referrer: document.referrer || "direct",
    //             app_id: appId
    //         };

    //         // navigator.sendBeacon("http://localhost:3000/log", JSON.stringify(payload));


    //         const response = await fetch("https://oanalytics-server-production.up.railway.app/log", {
    //             method: "POST",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify(payload),
    //         });
    //         const result = await response.json();
    //         console.log(result);
    //     }

    //     send()
    // }, [location, navType]);

    useEffect(() => {
        const handleRouteChange = (url: string) => {

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


            // send page view event
            fetch("https://oanalytics-server-production.up.railway.app/log", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
        };

        // fire on mount
        handleRouteChange(window.location.pathname + window.location.search);

        // fire on route changes
        router.events.on("routeChangeComplete", handleRouteChange);
        return () => {
            router.events.off("routeChangeComplete", handleRouteChange);
        };
    }, [appId, router]);

    return null;
};



