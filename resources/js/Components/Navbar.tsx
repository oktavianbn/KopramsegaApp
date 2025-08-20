"use client";

import { useState } from "react";
import { Search, Bell, User, ChevronDown, Link } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePage } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import Dropdown from "./Dropdown";

interface NavbarProps {
    className?: string;
}

export function Navbar({ className }: NavbarProps) {
    const user = usePage().props.auth.user;
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <nav
            className={cn(
                "fixed top-0 right-0 left-0 md:left-64 z-30 bg-white border-b border-gray-200 shadow-sm",
                className
            )}
        >
            <div className="flex items-center justify-between px-6 py-4">
                {/* Left side - Search */}
                <div className="flex-1 max-w-md">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-sm"
                        />
                    </div>
                </div>

                {/* Right side - Notifications and User */}
                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                        <Bell className="h-5 w-5" />
                        {/* Notification badge */}
                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                            3
                        </span>
                    </button>

                    {/* User Menu */}
                    <div className="relative">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <span className="inline-flex rounded-md">
                                    <button
                                        type="button"
                                        className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                                    >
                                        {user.name}

                                        <svg
                                            className="-me-0.5 ms-2 h-4 w-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </span>
                            </Dropdown.Trigger>

                            <Dropdown.Content>
                                <Dropdown.Link href={route("profile.edit")}>
                                    Profile
                                </Dropdown.Link>
                                <Dropdown.Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                >
                                    Log Out
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </div>
            </div>
        </nav>
    );
}
