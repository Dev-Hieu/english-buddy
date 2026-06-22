import { Menu, X } from "lucide-react";
import { useState } from "react";
import { AdminSidebar, type AdminTab } from "./AdminSidebar";

interface Props {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  adminName: string;
  onLogout: () => void;
  children: React.ReactNode;
}

export function AdminLayout({ activeTab, onTabChange, adminName, onLogout, children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:block shrink-0">
        <AdminSidebar activeTab={activeTab} onTabChange={onTabChange} adminName={adminName} onLogout={onLogout} />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10 h-full w-60 animate-in slide-in-from-left">
            <AdminSidebar activeTab={activeTab} onTabChange={onTabChange} adminName={adminName} onLogout={onLogout} onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="flex items-center gap-3 border-b border-border px-4 py-3 md:hidden">
          <button type="button" onClick={() => setSidebarOpen(true)} className="text-foreground">
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-black text-primary">English Buddy</h1>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mx-auto w-full max-w-4xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
