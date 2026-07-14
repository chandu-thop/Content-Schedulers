import { XIcon, CheckCircleIcon, ExternalLink } from "lucide-react";
import { PLATFORMS } from "../assets/assets";

interface PlatformPickerModalProps {
  connectedIds: string[];
  connecting: string | null;
  onClose: () => void;
  onConnect: (platformId: string) => void;
}

export default function PlatformPickerModal({ connectedIds, connecting, onClose, onConnect }: PlatformPickerModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-100 overflow-hidden">
        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-slate-700 font-medium">Choose a Platform</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
            <XIcon className="size-4" />
          </button>
        </div>

        {/*Platform list */}
        <div className="p-4">
          <ul className="flex flex-col gap-2">
            {PLATFORMS.map((p) => {
              const isConnected = connectedIds.includes(p.id);
              const isConnecting = connecting === p.id;
              return (
                <li key={p.id}>
                  <div
                    onClick={() => {
                      if (!isConnected && !isConnecting) onConnect(p.id);
                    }}
                    className={`flex items-center gap-3 w-full text-left p-3 rounded-lg ${isConnected ? 'bg-red-50 border border-red-100' : 'hover:bg-slate-50'}`}
                  >
                    <div className="size-8 text-slate-600">
                      <p.icon className={`size-6 ${isConnected ? 'text-red-600' : 'text-slate-500'}`} />
                    </div>
                    {/*label*/}
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm ${isConnected ? 'text-red-700' : 'text-slate-800'}`}>{p.name}</div>
                      <div className="text-xs text-slate-500 truncate">{isConnected ? 'Already connected' : p.description}</div>
                    </div>
                    {/*status*/}
                    <div className="shrink-0">
                      {isConnected ? (
                        <div className="flex items-center gap-2 text-red-600">
                          <CheckCircleIcon className="size-4 text-red-600" />
                        </div>
                      ) : isConnecting ? (
                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onConnect(p.id);
                          }}
                          aria-label={`Connect ${p.name}`}
                          className="p-2 rounded-full flex items-center justify-center text-slate-500 hover:bg-red-500 hover:text-white transition-colors"
                        >
                          <ExternalLink className="size-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="p-6">
          <p className="text-sm text-slate-500">Select a platform to connect.</p>
        </div>
      </div>
    </div>
  );
}
