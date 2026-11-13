
import { PLATFORMS } from "../assets/assets"
import { PlusIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import AccountList from "../components/AccountList";
import PlatformPickerModal from "../components/PlatformPickerModal";

import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Account() {
  const { apiFetch } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const callbackHandled = useRef(false);

  const fetchAccounts = async (isSync = false, platform?: string | null, successMsg?: string) => {
    try {
      if (isSync) await apiFetch("/api/Oauth/sync");
      const data = await apiFetch("/api/accounts");
      setAccounts(data);
      if (successMsg) {
        console.log(platform, successMsg);
      }
    } catch (e: any) {
      console.error("Error fetching accounts:", e);
      showToast("Error fetching accounts: " + (e.message || e), "error");
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const callbackResult = params.get("success") === "true" || params.has("accountId") || params.has("connected");
    const callbackError = params.get("error") || params.get("error_description");

    if (callbackHandled.current) return;
    callbackHandled.current = true;
    setLoadingAccounts(true);

    if (callbackError) {
      showToast(`Account connection failed: ${callbackError}`, "error");
    }

    // The provider redirects back only after completing OAuth. Sync at that
    // point so the newly connected account is reflected immediately.
    void fetchAccounts(callbackResult || !callbackError).finally(() => {
      setLoadingAccounts(false);
      if (location.search) {
        window.history.replaceState({}, document.title, location.pathname);
      }
    });
  }, [location.pathname, location.search]);

  const [connecting, setConnecting] = useState<string | null>(null)
  const [showPlatformPicker, setShowPlatformPicker] = useState(false)

  const handleConnect = async (platformId: string) => {
    setConnecting(platformId);
    try {
      const origin = window.location.origin;
      const res = await apiFetch(`/api/Oauth/${platformId}?origin=${encodeURIComponent(origin)}`);
      if (res.url) {
        window.location.href = res.url;
      } else {
        throw new Error("Failed to get authorization url");
      }
    } catch (err: any) {
      showToast("Failed to connect account: " + (err.message || err), "error");
      setConnecting(null);
    }
  }

  const handleDisconnect = async (accountId: string) => {
    try {
      await apiFetch(`/api/accounts/${accountId}`, { method: "DELETE" });
      setAccounts(accounts.filter((a) => a._id !== accountId));
      showToast("Account disconnected successfully", "success");
    } catch (err: any) {
      showToast("Failed to disconnect: " + (err.message || err), "error");
    }
  }

  const connectedIds = accounts.map((a) => a.platform)

  return (
    <div className="space-y-8 max-w-4xl">
      {/* header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between
      gap-4 text-sm">
        <div>
          <h2 className="text-xl text-slate-900">Connected Account</h2>
          <p className="text-slate-500 text-sm mt-0.5">{accounts.length} of {PLATFORMS.length} platforms connected</p>
        </div>
        <button onClick={() => setShowPlatformPicker(true)} className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-full font-medium transition-all w-full sm:w-auto justify-center">
          <PlusIcon className="size-4" />  Connect Account
        </button >
      </div>
      {/* platform picker modal */}
      {showPlatformPicker && (
        <PlatformPickerModal
          connectedIds={connectedIds}
          connecting={connecting}
          onClose={() => setShowPlatformPicker(false)}
          onConnect={handleConnect}
        />
      )}
      {/* Connected accounts list */}
      {loadingAccounts ? (
        <p className="text-sm text-slate-500">Loading connected accounts…</p>
      ) : (
        <AccountList accounts={accounts} onDisconnect={handleDisconnect} />
      )}


    </div>
  )
}
