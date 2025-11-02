import { LucideIcon } from "lucide-react";
import { Link } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import React from "react";

export interface Tab {
    id: string;
    label: string;
    count?: number;
    disabled?: boolean;
}

export interface Action {
    label: string;
    href?: string;
    icon?: LucideIcon;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
}

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    icon?: LucideIcon;
    iconClassName?: string;
    iconBackground?: string;
    backHref?: string;
    backIcon?: LucideIcon;
    actions?: Action[];
    tabs?: Tab[];
    activeTab?: string;
    onTabChange?: (tabId: string) => void;
    className?: string;
}

export function PageHeader({
    title,
    subtitle,
    icon: Icon,
    iconClassName = "h-5 w-5 text-blue-600",
    iconBackground = "bg-blue-100",
    backHref,
    backIcon: BackIcon,
    actions = [],
    tabs = [],
    activeTab,
    onTabChange,
    className,
}: PageHeaderProps) {
    return (
        <>
            {/* Header */}
            <div
                className={cn(
                    "grid gap-2 md:flex items-center justify-between mb-6",
                    className
                )}
            >
                <div className="flex gap-6 items-center">
                    {backHref && (
                        <Link
                            href={backHref}
                            className="p-2 h-max bg-gray-200 rounded-lg flex justify-center items-center hover:bg-gray-300 transition-colors"
                        >
                            {BackIcon && (
                                <BackIcon className="h-5 w-5 text-gray-500" />
                            )}
                        </Link>
                    )}
                    <div className="flex gap-6 items-center">
                        {Icon && (
                            <div
                                className={cn(
                                    "p-2 h-max rounded-lg flex justify-center items-center",
                                    iconBackground
                                )}
                            >
                                <Icon className={iconClassName} />
                            </div>
                        )}
                        <div className="flex flex-col gap-2">
                            <h1 className="text-2xl font-bold text-gray-700 whitespace-nowrap">
                                {title}
                            </h1>
                            {subtitle && (
                                <h2 className="text-base font-medium text-gray-700 sm:whitespace-nowrap">
                                    {subtitle}
                                </h2>
                            )}
                        </div>
                    </div>
                </div>

                {actions.length > 0 && (
                    <div className="flex items-center gap-3">
                        {actions.map((action, index) => {
                            const Component = action.href ? Link : "button";
                            return (
                                <Component
                                    key={index}
                                    href={action.href}
                                    onClick={action.onClick}
                                    disabled={action.disabled}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors max-md:text-xs text-nowrap",
                                        action.disabled
                                            ? "opacity-50 cursor-not-allowed"
                                            : "",
                                        action.className ||
                                            "bg-blue-500 text-white hover:bg-blue-700"
                                    )}
                                >
                                    {action.icon && (
                                        <action.icon className="h-4 w-4" />
                                    )}
                                    {action.label}
                                </Component>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div className="mb-6 flex gap-4 border-b overflow-x-auto">
                {tabs.length > 0 && (
                    <div>
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() =>
                                    !tab.disabled && onTabChange?.(tab.id)
                                }
                                disabled={tab.disabled}
                                className={cn(
                                    "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                                    tab.disabled
                                        ? "cursor-not-allowed opacity-50 border-transparent text-gray-400"
                                        : activeTab === tab.id
                                        ? "border-blue-500 text-blue-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700"
                                )}
                            >
                                {tab.label}
                                {typeof tab.count !== "undefined" && (
                                    <span className="ml-1 px-2 py-1 text-xs bg-gray-100 rounded-full">
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
