"use client";

import { useState } from "react";
import {
    Home,
    BarChart3,
    Users,
    Settings,
    FileText,
    Menu,
    X,
    DollarSign,
    Layers,
    FolderClosed,
    ChevronDown,
    LogOut,
    User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePage } from "@inertiajs/react";
import Dropdown from "./Dropdown";

interface SimpleSidebarProps {
    className?: string;
}

const menuItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: DollarSign, label: "Keuangan", href: "/keuangan" },
    { icon: Users, label: "Pengguna", href: "/user" },
    { icon: Layers, label: "Inventory", href: "/inventory" },
    { icon: FolderClosed, label: "Arsip Surat", href: "/arsip-surat" },
    // { icon: BarChart3, label: "Analytics", href: "/analytics" },
    // { icon: FileText, label: "Reports", href: "/reports" },
    // { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar({ className }: SimpleSidebarProps) {
    const user = usePage().props.auth.user;
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                className="fixed top-4 left-4 z-50 md:hidden p-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
                <Menu className="h-5 w-5" />
            </button>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={cn(
                    "fixed left-0 top-0 z-40 h-full w-64 bg-blue-600 text-white transition-transform duration-300 ease-in-out shadow-lg flex flex-col",
                    isMobileOpen
                        ? "translate-x-0"
                        : "-translate-x-full md:translate-x-0",
                    className
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-blue-500/20">
                    <a className="header flex flex-col">
                        <img
                            src="/simako.svg"
                            className="text-white -my-5"
                            alt=""
                        />
                    </a>

                    <button
                        className="md:hidden p-1 hover:bg-blue-500/30 rounded"
                        onClick={() => setIsMobileOpen(false)}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation - Flex grow to push user section to bottom */}
                <nav className="p-4">
                    <ul className="space-y-1">
                        {menuItems.map((item, index) => (
                            <li key={index}>
                                <a
                                    href={item.href}
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-blue-500/30 text-blue-50 hover:text-white group"
                                >
                                    <item.icon className="h-5 w-5" />
                                    <span className="font-medium">
                                        {item.label}
                                    </span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* User Account Section - At bottom */}
                <div className="p-4 border-t border-blue-500/20">
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-blue-500/30 text-blue-50 hover:text-white group">
                                <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full">
                                    <User className="h-4 w-4" />
                                </div>
                                <div className="flex-1 text-left">
                                    <div className="font-medium text-sm truncate">
                                        {user.name}
                                    </div>
                                    <div className="text-xs text-blue-200 truncate">
                                        {user.email}
                                    </div>
                                </div>
                                <ChevronDown className="h-4 w-4 text-blue-200" />
                            </button>
                        </Dropdown.Trigger>

                        <Dropdown.Content>
                            <Dropdown.Link href={route("profile.edit")}>
                                <User className="h-4 w-4 mr-2" />
                                Profile
                            </Dropdown.Link>
                            <Dropdown.Link
                                href={route("logout")}
                                method="post"
                                as="button"
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Log Out
                            </Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </div>
            </div>

            {/* Content Spacer for Desktop */}
            <div className="hidden md:block w-64" />
        </>
    );
}
