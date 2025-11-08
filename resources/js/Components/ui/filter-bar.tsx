import React from "react";
import { ChevronDown } from "lucide-react";

interface FilterBarProps {
    bulan: number;
    tahun: number;
    onBulanChange: (bulan: number) => void;
    onTahunChange: (tahun: number) => void;
    extraFilters?: React.ReactNode;
}

export function FilterBar({
    bulan,
    tahun,
    onBulanChange,
    onTahunChange,
    extraFilters,
}: FilterBarProps) {
    const months = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6">
            <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                        Periode:
                    </label>
                    <div className="relative">
                        <select
                            value={bulan}
                            onChange={(e) =>
                                onBulanChange(Number(e.target.value))
                            }
                            className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                        >
                            {months.map((month, index) => (
                                <option key={index + 1} value={index + 1}>
                                    {month}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                    <div className="relative">
                        <select
                            value={tahun}
                            onChange={(e) =>
                                onTahunChange(Number(e.target.value))
                            }
                            className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                        >
                            {years.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                </div>
                {extraFilters && (
                    <>
                        <div className="h-8 w-px bg-gray-300" />
                        {extraFilters}
                    </>
                )}
            </div>
        </div>
    );
}
