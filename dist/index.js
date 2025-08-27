"use strict";
"use client";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  AnalyticsTracker: () => AnalyticsTracker
});
module.exports = __toCommonJS(index_exports);
var import_react = require("react");
var import_router = require("next/router");
function getOrCreateClientId() {
  const key = "oAnalytics_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}
var AnalyticsTracker = ({ appId }) => {
  const router = (0, import_router.useRouter)();
  const [sessionId] = (0, import_react.useState)(() => crypto.randomUUID());
  (0, import_react.useEffect)(() => {
    const handleRouteChange = (url) => {
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
      fetch("https://oanalytics-server-production.up.railway.app/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    };
    handleRouteChange(window.location.pathname + window.location.search);
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [appId, router]);
  return null;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AnalyticsTracker
});
