import { Navbar } from "@/Components/Navbar";
import { Sidebar } from "@/Components/Sidebar";

import { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
    return (
        <>
            {/* <Navbar /> */}
            <Sidebar />

            {/* Main Content Area - seperti @yield di Blade */}
            <div className="md:ml-64  min-h-screen bg-gray-50">{children}</div>
        </>
    );
}
