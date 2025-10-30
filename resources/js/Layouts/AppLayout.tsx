import { Navbar } from "@/Components/Navbar";
import { Sidebar } from "@/Components/Sidebar";

import { ReactNode, useState } from "react";
import { Toaster } from "sonner";

export default function AppLayout({ children }: { children: ReactNode }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            <Navbar
                onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
            <Sidebar
                isMobileOpen={isMobileMenuOpen}
                onMobileClose={() => setIsMobileMenuOpen(false)}
            />

            {/* Main Content Area - seperti @yield di Blade */}
            <div className="md:ml-64 mt-20 md:mt-0 min-h-screen bg-gray-50">
                {children}
                <Toaster />
            </div>
        </>
    );
}
