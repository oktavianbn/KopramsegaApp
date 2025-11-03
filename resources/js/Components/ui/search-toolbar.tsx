import { cn } from "@/lib/utils";
import {
    ChevronDown,
    Filter,
    LucideIcon,
    Search,
    SortAsc,
    SortDesc,
    X,
} from "lucide-react";
import { useRef, useEffect, useState } from "react";

export interface FilterOption {
    id: string;
    label: string;
    section?: string;
}

export interface SortOption {
    id: string;
    label: string;
}

interface SearchToolbarProps {
    // Search
    searchValue: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder?: string;
    disableSearch?: boolean;

    // Active Filters Display
    activeFilters?: {
        search?: string;
        filters?: { id: string; label: string }[];
    };
    onClearFilters?: () => void;

    // Filter Options
    filterOptions?: FilterOption[];
    onFilterSelect?: (filterId: string) => void;
    selectedFilters?: string[];
    disableFilters?: boolean;

    // Sort Options
    sortOptions?: SortOption[];
    onSortSelect?: (sortId: string) => void;
    currentSortField?: string;
    sortDirection?: "asc" | "desc";
    disableSort?: boolean;

    className?: string;
}

export function SearchToolbar({
    // Search
    searchValue,
    onSearchChange,
    searchPlaceholder = "Cari...",
    disableSearch,

    // Active Filters
    activeFilters,
    onClearFilters,

    // Filter
    filterOptions,
    onFilterSelect,
    selectedFilters = [],
    disableFilters,

    // Sort
    sortOptions,
    onSortSelect,
    currentSortField,
    sortDirection = "asc",
    disableSort,

    className,
}: SearchToolbarProps) {
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [showSortDropdown, setShowSortDropdown] = useState(false);

    const filterDropdownRef = useRef<HTMLDivElement>(null);
    const sortDropdownRef = useRef<HTMLDivElement>(null);

    // Handle clicks outside dropdowns
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                filterDropdownRef.current &&
                !filterDropdownRef.current.contains(event.target as Node)
            ) {
                setShowFilterDropdown(false);
            }
            if (
                sortDropdownRef.current &&
                !sortDropdownRef.current.contains(event.target as Node)
            ) {
                setShowSortDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Group filter options by section
    const groupedFilters = filterOptions?.reduce((acc, filter) => {
        const section = filter.section || "default";
        if (!acc[section]) {
            acc[section] = [];
        }
        acc[section].push(filter);
        return acc;
    }, {} as Record<string, FilterOption[]>);

    return (
        <>
            {/* Active Filters Display */}
            {activeFilters &&
                (activeFilters.search ||
                    (activeFilters.filters &&
                        activeFilters.filters.length > 0)) && (
                    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm font-medium text-blue-800">
                                <Filter className="h-4 w-4" />
                                <span>Filter aktif:</span>
                                {activeFilters.search && (
                                    <span className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full text-sm border border-blue-200">
                                        <Search className="h-3 w-3" />
                                        Cari: "{activeFilters.search}"
                                    </span>
                                )}
                                {activeFilters.filters?.map((filter) => (
                                    <span
                                        key={filter.id}
                                        className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full text-sm border border-blue-200"
                                    >
                                        {filter.label}
                                    </span>
                                ))}
                            </div>
                            {onClearFilters && (
                                <button
                                    onClick={onClearFilters}
                                    className="flex items-center gap-1 px-3 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors"
                                >
                                    <X className="h-3 w-3" />
                                    Clear All
                                </button>
                            )}
                        </div>
                    </div>
                )}

            {/* Search and Filters Bar */}
            <div
                className={cn(
                    "bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6 grid gap-2 lg:flex items-center justify-between",
                    className
                )}
            >
                {/* Search Input */}
                {!disableSearch && (
                    <div className="flex items-center gap-4 flex-1 w-full">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder={searchPlaceholder}
                                value={searchValue}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="pl-10 pr-6 py-2 w-full md:max-w-md border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                )}

                {/* Filter and Sort Buttons */}
                <div className="flex gap-2">
                    {/* Filter Dropdown */}
                    {!disableFilters &&
                        filterOptions &&
                        filterOptions.length > 0 && (
                            <div className="relative" ref={filterDropdownRef}>
                                <button
                                    onClick={() =>
                                        setShowFilterDropdown(
                                            !showFilterDropdown
                                        )
                                    }
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors",
                                        showFilterDropdown
                                            ? "border-blue-500 bg-blue-50 text-blue-600"
                                            : "border-gray-300 bg-white hover:bg-gray-50"
                                    )}
                                >
                                    Filter
                                    <ChevronDown
                                        className={cn(
                                            "h-4 w-4 transition-transform",
                                            showFilterDropdown && "rotate-180"
                                        )}
                                    />
                                </button>
                                {showFilterDropdown && (
                                    <div className="absolute md:-left-10 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                                        <div className="p-2 flex flex-col max-h-60 overflow-y-auto">
                                            {Object.entries(
                                                groupedFilters || {}
                                            ).map(([section, filters]) => (
                                                <div key={section}>
                                                    {section !== "default" && (
                                                        <span className="px-3 py-1 text-xs font-semibold text-gray-500">
                                                            {section}
                                                        </span>
                                                    )}
                                                    {filters.map((filter) => (
                                                        <button
                                                            key={filter.id}
                                                            onClick={() => {
                                                                onFilterSelect?.(
                                                                    filter.id
                                                                );
                                                                setShowFilterDropdown(
                                                                    false
                                                                );
                                                            }}
                                                            className={cn(
                                                                "w-full px-3 py-2 text-left text-sm rounded-lg hover:bg-gray-50",
                                                                selectedFilters.includes(
                                                                    filter.id
                                                                )
                                                                    ? "bg-blue-50 text-blue-600 font-medium"
                                                                    : ""
                                                            )}
                                                        >
                                                            {filter.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                    {/* Sort Dropdown */}
                    {!disableSort && sortOptions && sortOptions.length > 0 && (
                        <div className="relative" ref={sortDropdownRef}>
                            <button
                                onClick={() =>
                                    setShowSortDropdown(!showSortDropdown)
                                }
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors",
                                    showSortDropdown
                                        ? "border-blue-500 bg-blue-50 text-blue-600"
                                        : "border-gray-300 bg-white hover:bg-gray-50"
                                )}
                            >
                                Urutkan
                                {sortDirection === "asc" ? (
                                    <SortAsc className="h-4 w-4" />
                                ) : (
                                    <SortDesc className="h-4 w-4" />
                                )}
                            </button>
                            {showSortDropdown && (
                                <div className="absolute lg:right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                                    <div className="p-2">
                                        {sortOptions.map((option) => (
                                            <button
                                                key={option.id}
                                                onClick={() => {
                                                    onSortSelect?.(option.id);
                                                    setShowSortDropdown(false);
                                                }}
                                                className={cn(
                                                    "w-full flex items-center justify-between px-3 py-2 text-left text-sm rounded-lg hover:bg-gray-50",
                                                    currentSortField ===
                                                        option.id
                                                        ? "bg-blue-50 text-blue-600 font-medium"
                                                        : "text-gray-700"
                                                )}
                                            >
                                                <span>{option.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
