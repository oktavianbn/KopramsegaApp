"use client";

import { useState } from "react";
import { Search, Bell, User, ChevronDown, Link, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePage } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import Dropdown from "./Dropdown";

interface NavbarProps {
    className?: string;
    onMenuToggle?: () => void;
}

export function Navbar({ className, onMenuToggle }: NavbarProps) {
    const user = usePage().props.auth.user;
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <nav
            className={cn(
                "fixed top-0 md:hidden flex right-0 left-0 md:left-64 z-30 bg-blue-600 shadow-sm",
                className
            )}
        >
            <div className="flex items-center justify-between px-6 py-4 w-full">
                {/* Left side - Hamburger and Logo */}
                <div className="flex items-center gap-4">
                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-white hover:bg-blue-700 rounded-lg transition-colors"
                        onClick={onMenuToggle}
                    >
                        <Menu className="h-5 w-5" />
                    </button>

                    <div className="logo">
                        <img
                            src="/simako.svg"
                            className="w-32 -mt-2"
                            alt="logo"
                        />
                    </div>
                </div>
                {/* Right side - Notifications and User */}
                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    <button className="relative p-2">
                        <Bell className="h-5 w-5 text-white" />
                        {/* Notification badge */}
                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                            3
                        </span>
                    </button>
                </div>
            </div>
        </nav>
    );
}
