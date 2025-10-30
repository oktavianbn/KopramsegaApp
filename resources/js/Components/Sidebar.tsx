"use client";

import { cn } from "@/lib/utils";
import { usePage } from "@inertiajs/react";
import {
    Blocks,
    CalendarDays,
    CalendarRange,
    ChevronDown,
    ClipboardCheck,
    ConciergeBell,
    DollarSign,
    FileCheck,
    FolderClosed,
    Group,
    Home,
    Layers,
    Layers2Icon,
    Layers3Icon,
    LayoutDashboard,
    List,
    ListChecks,
    LogOut,
    LucideLayers,
    LucideLayers2,
    LucideLayers3,
    Mail,
    Package,
    Pen,
    PresentationIcon,
    ReceiptText,
    SwitchCamera,
    Tag,
    TimerReset,
    User,
    UserCheck,
    UserLock,
    Users,
    Users2,
    UtensilsCrossed,
    Warehouse,
    X,
} from "lucide-react";
import { useState } from "react";
import Dropdown from "./Dropdown";

interface SimpleSidebarProps {
    className?: string;
    isMobileOpen?: boolean;
    onMobileClose?: () => void;
}

const menuItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: DollarSign, label: "Keuangan", href: "/keuangan" },
    {
        icon: Users,
        label: "Pengguna",
        group: true,
        children: [
            { icon: LucideLayers2, label: "Role", href: "/role" },
            { icon: Users, label: "User", href: "/user" },
        ],
    },
    {
        icon: Layers,
        label: "Inventory",
        group: true,
        children: [
            { icon: Package, label: "Barang", href: "/barang" },
            { icon: Warehouse, label: "Stok", href: "/stok" },
            { icon: UserCheck, label: "Peminjaman", href: "/peminjaman" },
        ],
    },
    {
        icon: FolderClosed,
        label: "Arsip",
        group: true,
        children: [
            { icon: Mail, label: "Surat", href: "/arsip-surat" },
            { icon: FileCheck, label: "Dokumen", href: "/dokumen" },
        ],
    },
    { icon: TimerReset, label: "Rencana", href: "/rencana" },
    { icon: SwitchCamera, label: "Dokumentasi", href: "/dokumentasi" },
    {
        icon: ReceiptText,
        label: "Usaha Dana",
        group: true,
        children: [
            { icon: CalendarRange, label: "Sesi Penjualan", href: "/sesi" },
            { icon: UtensilsCrossed, label: "Menu", href: "/menu" },
            { icon: ConciergeBell, label: "Transaksi", href: "/transaksi" },
            { icon: UserLock, label: "Pelanggan", href: "/pelanggan" },
        ],
    },
    {
        icon: ClipboardCheck,
        label: "Presensi",
        group: true,
        children: [
            { icon: ListChecks, label: "Kehadiran", href: "/kehadiran" },
            { icon: CalendarDays, label: "Rekap", href: "/rekap-absensi" },
        ],
    },
    {
        icon: Blocks,
        label: "CMS",
        group: true,
        children: [
            { icon: List, label: "Kategori", href: "/menu" },
            { icon: Tag, label: "Tag", href: "/sesi" },
            { icon: Pen, label: "Post", href: "/transaksi" },
        ],
    },
    {
        icon: Layers2Icon,
        label: "Master Data",
        group: true,
        children: [
            { icon: PresentationIcon, label: "Sangga", href: "/sangga" },
            { icon: Users2, label: "Siswa", href: "/siswa" },
        ],
    },
    // { icon: BarChart3, label: "Analytics", href: "/analytics" },
    // { icon: FileText, label: "Reports", href: "/reports" },
    // { icon: Settings, label: "Settings", href: "/settings" },
];

// Helper function to truncate text
const truncateText = (text: string, maxLength: number = 15): string => {
    if (text.length <= maxLength) {
        return text;
    }
    return text.substring(0, maxLength) + "...";
};

// Helper function to check if a route is active
const isActiveRoute = (href: string, currentUrl: string): boolean => {
    const normalizedHref = href.replace(/\/$/, "") || "/";
    const normalizedCurrentUrl = currentUrl.replace(/\/$/, "") || "/";

    // Untuk dashboard
    if (normalizedHref === "/dashboard") {
        return (
            normalizedCurrentUrl === "/dashboard" ||
            normalizedCurrentUrl === "/"
        );
    }

    // Exact match
    if (normalizedCurrentUrl === normalizedHref) {
        return true;
    }

    // Match prefix hanya kalau diikuti slash (sub route)
    return normalizedCurrentUrl.startsWith(normalizedHref + "/");
};

export function Sidebar({
    className,
    isMobileOpen = false,
    onMobileClose,
}: SimpleSidebarProps) {
    const user = usePage().props.auth.user;
    const { url } = usePage(); // Get current URL from Inertia page

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onMobileClose}
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
                        onClick={onMobileClose}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation - Flex grow to push user section to bottom */}
                <nav
                    className="p-4 flex-1 overflow-y-auto"
                    style={{
                        scrollbarWidth: "none", // Firefox
                        msOverflowStyle: "none", // IE & Edge lama
                    }}
                >
                    <ul className="space-y-1">
                        {menuItems.map((item, index) => {
                            if (item.group && item.children) {
                                // Inventory group with dropdown
                                const isGroupActive = item.children.some(
                                    (child) => isActiveRoute(child.href, url)
                                );
                                // Initialize dropdown as open if any child is active
                                const [open, setOpen] = useState(isGroupActive);

                                return (
                                    <li key={index} className="">
                                        <button
                                            type="button"
                                            className={cn(
                                                "flex items-center gap-3 px-4 py-3 rounded-lg w-full transition-colors group",
                                                isGroupActive
                                                    ? "bg-white text-blue-600"
                                                    : "text-blue-50 hover:text-white hover:bg-blue-500/30"
                                            )}
                                            onClick={() => setOpen((v) => !v)}
                                        >
                                            <item.icon className="h-5 w-5" />
                                            <span className="font-medium flex-1 text-left">
                                                {item.label}
                                            </span>
                                            <ChevronDown
                                                className={cn(
                                                    "h-4 w-4 transition-transform",
                                                    open ? "rotate-180" : ""
                                                )}
                                            />
                                        </button>
                                        {/* Dropdown submenu - Now only controlled by open state */}
                                        {open && (
                                            <ul className="ml-8 mt-1 space-y-1">
                                                {item.children.map(
                                                    (child, cidx) => {
                                                        const isActive =
                                                            isActiveRoute(
                                                                child.href,
                                                                url
                                                            );
                                                        return (
                                                            <li key={cidx}>
                                                                <a
                                                                    href={
                                                                        child.href
                                                                    }
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        if (
                                                                            isActive
                                                                        ) {
                                                                            e.preventDefault();
                                                                            return false;
                                                                        }
                                                                    }}
                                                                    className={cn(
                                                                        "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm",
                                                                        isActive
                                                                            ? "bg-white text-blue-600 cursor-default"
                                                                            : "text-blue-100 hover:text-white hover:bg-blue-500/30 cursor-pointer"
                                                                    )}
                                                                >
                                                                    {child.icon && (
                                                                        <child.icon className="h-4 w-4" />
                                                                    )}
                                                                    <span>
                                                                        {
                                                                            child.label
                                                                        }
                                                                    </span>
                                                                </a>
                                                            </li>
                                                        );
                                                    }
                                                )}
                                            </ul>
                                        )}
                                    </li>
                                );
                            }
                            // Normal menu item
                            const isActive = isActiveRoute(
                                item.href ?? "",
                                url
                            );
                            return (
                                <li key={index}>
                                    <a
                                        href={item.href}
                                        onClick={(e) => {
                                            if (isActive) {
                                                e.preventDefault();
                                                return false;
                                            }
                                        }}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group",
                                            isActive
                                                ? "bg-white text-blue-600 cursor-default"
                                                : "text-blue-50 hover:text-white hover:bg-blue-500/30 cursor-pointer"
                                        )}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        <span className="font-medium">
                                            {item.label}
                                        </span>
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* User Account Section - At bottom */}
                <div className="p-4 flex border-t border-blue-500/20">
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-blue-500/30 text-blue-50 hover:text-white group">
                                <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full">
                                    <User className="h-4 w-4" />
                                </div>
                                <div className="flex-1 text-left">
                                    <div
                                        className="font-medium text-sm"
                                        title={user.name}
                                    >
                                        {truncateText(user.name, 15)}
                                    </div>
                                    <div
                                        className="text-xs text-blue-200"
                                        title={user.email}
                                    >
                                        {truncateText(user.email, 15)}
                                    </div>
                                </div>
                                <ChevronDown className="h-4 w-4 text-blue-200" />
                            </button>
                        </Dropdown.Trigger>

                        <Dropdown.Content direction="up" align="right">
                            <Dropdown.Link
                                href={route("profile.edit")}
                                className="flex items-center w-full"
                            >
                                <User className="h-4 w-4 mr-2" />
                                Profile
                            </Dropdown.Link>
                            <Dropdown.Link
                                href={route("logout")}
                                method="post"
                                as="button"
                                className="flex items-center w-full bg-red-200 hover:bg-red-600 hover:text-white text-red-800"
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
