"use client";
"use client";

// src/index.ts
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
function getOrCreateClientId() {
  if (typeof window === "undefined") return "";
  const key = "oAnalytics_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}
var AnalyticsTracker = ({ appId }) => {
  if (typeof window === "undefined") return "";
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sessionId] = useState(() => crypto.randomUUID());
  const url = pathname + ((searchParams == null ? void 0 : searchParams.toString()) ? `?${searchParams}` : "");
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
      const response = await fetch("https://oanalytics-server-production.up.railway.app/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      console.log(result);
    }
    send();
  }, [pathname, searchParams, appId]);
  return null;
};
export {
  AnalyticsTracker
};
