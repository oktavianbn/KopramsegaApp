import React from "react";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: LucideIcon;
    iconColor?: string;
    iconBg?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    onClick?: () => void;
}

export function StatsCard({
    title,
    value,
    subtitle,
    icon: Icon,
    iconColor = "text-blue-600",
    iconBg = "bg-blue-50",
    trend,
    onClick,
}: StatsCardProps) {
    return (
        <div
            onClick={onClick}
            className={`bg-white rounded-lg border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow ${
                onClick ? "cursor-pointer" : ""
            }`}
        >
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">
                        {title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                    {subtitle && (
                        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
                    )}
                    {trend && (
                        <div className="flex items-center gap-1 mt-2">
                            <span
                                className={`text-xs font-medium ${
                                    trend.isPositive
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                {trend.isPositive ? "↑" : "↓"} {trend.value}%
                            </span>
                            <span className="text-xs text-gray-500">
                                vs bulan lalu
                            </span>
                        </div>
                    )}
                </div>
                <div className={`${iconBg} p-4 rounded-lg`}>
                    <Icon className={`w-8 h-8 ${iconColor}`} />
                </div>
            </div>
        </div>
    );
}
