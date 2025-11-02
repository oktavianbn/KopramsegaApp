import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { router } from "@inertiajs/react";
import { cn } from "@/lib/utils";

interface PaginationProps {
    currentPage: number;
    lastPage: number;
    perPage?: number;
    total?: number;
    from?: number;
    to?: number;
    onPageChange?: (page: number) => void; // controlled handler
    onPerPageChange?: (perPage: number) => void; // controlled handler for per-page
    baseUrl?: string; // if provided and onPageChange is not, will use Inertia router.get(baseUrl, { page })
    queryParams?: Record<string, any>; // extra query params when using baseUrl navigation
    variant?: "table" | "card";
    pageWindow?: number; // how many pages to show around current (table variant)
    perPageOptions?: number[]; // options for per-page select (table variant)
    showPerPage?: boolean; // show per-page control (table variant)
    className?: string;
}

function defaultNavigate(
    baseUrl: string | undefined,
    page: number,
    queryParams?: Record<string, any>
) {
    if (!baseUrl) return;
    router.get(
        baseUrl,
        { ...(queryParams || {}), page },
        { preserveState: true, replace: false }
    );
}

function range(start: number, end: number) {
    const r: number[] = [];
    for (let i = start; i <= end; i++) r.push(i);
    return r;
}

export default function Pagination({
    currentPage,
    lastPage,
    perPage = 10,
    total = 0,
    from,
    to,
    onPageChange,
    onPerPageChange,
    baseUrl,
    queryParams,
    variant = "table",
    pageWindow = 2,
    perPageOptions = [10, 20, 50],
    showPerPage = true,
    className,
}: PaginationProps) {
    const go = (page: number) => {
        if (page < 1) page = 1;
        if (page > lastPage) page = lastPage;
        if (onPageChange) return onPageChange(page);
        if (baseUrl) return defaultNavigate(baseUrl, page, queryParams);
        // fallback: update location query param (best-effort)
        const url = new URL(window.location.href);
        url.searchParams.set("page", String(page));
        window.history.pushState({}, "", url.toString());
        // no reload; consumers expecting full navigation should pass onPageChange or baseUrl
    };

    const changePerPage = (value: number) => {
        if (onPerPageChange) return onPerPageChange(value);
        if (baseUrl) {
            // navigate to page 1 with new perPage param
            router.get(
                baseUrl,
                { ...(queryParams || {}), perPage: value, page: 1 },
                { preserveState: true }
            );
            return;
        }
        const url = new URL(window.location.href);
        url.searchParams.set("perPage", String(value));
        url.searchParams.set("page", "1");
        window.history.pushState({}, "", url.toString());
    };

    // Table variant: align with existing pages (select at left, range + prev/next at right)
    if (variant === "table") {
        // calculate display range if total and perPage provided (allow explicit from/to)
        const displayStart =
            typeof from === "number" ? from : (currentPage - 1) * perPage + 1;
        const displayEnd =
            typeof to === "number"
                ? to
                : Math.min(total || lastPage * perPage, currentPage * perPage);
        const startFinal = displayStart;
        const endFinal = displayEnd;

        return (
            <div
                className={cn(
                    "bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-3 flex items-center justify-between",
                    className
                )}
            >
                <div className="flex items-center gap-2">
                    {showPerPage && (
                        <select
                            value={perPage}
                            onChange={(e) =>
                                changePerPage(parseInt(e.target.value))
                            }
                            className="border border-gray-300 rounded px-2 py-1 text-sm"
                        >
                            {perPageOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt} data per halaman
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-700 whitespace-nowrap">
                        {startFinal}-{endFinal} dari {total}
                    </span>

                    <div className="flex items-center gap-1">
                        <button
                            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
                            disabled={currentPage <= 1}
                            onClick={() => go(currentPage - 1)}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
                            disabled={currentPage >= lastPage}
                            onClick={() => go(currentPage + 1)}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Card variant: simpler prev/next and page info
    return (
        <div
            className={cn(
                "flex items-center justify-between p-3 bg-white border-t border-gray-200",
                className
            )}
        >
            <div className="text-sm text-gray-700">
                Halaman <span className="font-medium">{currentPage}</span> dari{" "}
                <span className="font-medium">{lastPage}</span>
                {typeof total === "number" && total >= 0 && (
                    <span className="ml-2">• {total} item</span>
                )}
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => go(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50"
                >
                    <ChevronLeft className="h-4 w-4 inline-block" />
                </button>
                <button
                    onClick={() => go(currentPage + 1)}
                    disabled={currentPage >= lastPage}
                    className="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50"
                >
                    <ChevronRight className="h-4 w-4 inline-block" />
                </button>
            </div>
        </div>
    );
}
