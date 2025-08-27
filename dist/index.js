"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  AnalyticsTracker: () => AnalyticsTracker
});
module.exports = __toCommonJS(index_exports);
var import_react = require("react");
var import_dynamic = __toESM(require("next/dynamic"));
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
var AnalyticsTrackerClient = ({ appId }) => {
  const { usePathname, useSearchParams } = require("next/navigation");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sessionId] = (0, import_react.useState)(() => crypto.randomUUID());
  (0, import_react.useEffect)(() => {
    async function send() {
      const url = pathname + ((searchParams == null ? void 0 : searchParams.toString()) ? `?${searchParams}` : "");
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
          body: JSON.stringify(payload)
        });
        const result = await response.json();
        console.log(result);
      } catch (error) {
        console.error("Analytics tracking failed:", error);
      }
    }
    send();
  }, [pathname, searchParams == null ? void 0 : searchParams.toString(), appId, sessionId]);
  return null;
};
var AnalyticsTracker = (0, import_dynamic.default)(() => Promise.resolve(AnalyticsTrackerClient), {
  ssr: false
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AnalyticsTracker
});
