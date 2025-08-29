"use client";

import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Download,
    Edit,
    FileText,
    Filter,
    Plus,
    Search,
    SortAsc,
    SortDesc,
    Trash2,
    X,
    Package,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Barang {
    id: number;
    nama: string;
    deskripsi?: string | null;
    foto?: string | null;
    boleh_dipinjam: boolean;
}

interface Spesifikasi {
    id: number;
    barang_id: number;
    key: string;
    value: string;
    description?: string | null;
}

interface Stok {
    id: number;
    barang_id: number;
    spesifikasi_id?: number | null;
    jumlah: number;
    barang: Barang;
    spesifikasi?: Spesifikasi | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    stoks: Stok[];
}

// Group stok by barang
interface GroupedStok {
    barang: Barang;
    stoks: Stok[];
    totalStok: number;
}

export default function Index({ stoks }: Props) {
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("nama");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [perPage, setPerPage] = useState(12);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [showDownloadDropdown, setShowDownloadDropdown] = useState(false);

    const sortDropdownRef = useRef<HTMLDivElement>(null);
    const filterDropdownRef = useRef<HTMLDivElement>(null);
    const downloadDropdownRef = useRef<HTMLDivElement>(null);

    const downloadOptions = [
        { label: "Excel", href: "/export/excel" },
        { label: "CSV", href: "/export/excel?format=csv" },
        { label: "PDF", href: "/export/pdf" },
        { label: "Word", href: "/export/word" },
    ];

    // Group stoks by barang
    const groupedStoks = stoks.reduce((acc, stok) => {
        const existingGroup = acc.find(
            (group) => group.barang.id === stok.barang.id
        );
        if (existingGroup) {
            existingGroup.stoks.push(stok);
            existingGroup.totalStok += stok.jumlah;
        } else {
            acc.push({
                barang: stok.barang,
                stoks: [stok],
                totalStok: stok.jumlah,
            });
        }
        return acc;
    }, [] as GroupedStok[]);

    // Filter and search logic
    const filteredGroups = groupedStoks.filter((group) => {
        const matchesSearch = search
            ? group.barang.nama.toLowerCase().includes(search.toLowerCase()) ||
              group.barang.deskripsi
                  ?.toLowerCase()
                  .includes(search.toLowerCase()) ||
              group.stoks.some(
                  (stok) =>
                      stok.spesifikasi?.key
                          .toLowerCase()
                          .includes(search.toLowerCase()) ||
                      stok.spesifikasi?.value
                          .toLowerCase()
                          .includes(search.toLowerCase())
              )
            : true;

        const matchesFilter = activeFilter
            ? activeFilter === "low" && group.totalStok < 10
                ? true
                : activeFilter === "out" && group.totalStok === 0
                ? true
                : activeFilter === "available" && group.totalStok > 0
                ? true
                : false
            : true;

        return matchesSearch && matchesFilter;
    });

    // Sort logic
    const sortedGroups = [...filteredGroups].sort((a, b) => {
        let aValue: any, bValue: any;

        switch (sortBy) {
            case "nama":
                aValue = a.barang.nama.toLowerCase();
                bValue = b.barang.nama.toLowerCase();
                break;
            case "total_stok":
                aValue = a.totalStok;
                bValue = b.totalStok;
                break;
            default:
                aValue = a.barang.nama.toLowerCase();
                bValue = b.barang.nama.toLowerCase();
        }

        if (sortDirection === "asc") {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    // Pagination logic
    const totalItems = sortedGroups.length;
    const totalPages = Math.ceil(totalItems / perPage);
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedGroups = sortedGroups.slice(startIndex, endIndex);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                sortDropdownRef.current &&
                !sortDropdownRef.current.contains(event.target as Node)
            ) {
                setShowSortDropdown(false);
            }
            if (
                filterDropdownRef.current &&
                !filterDropdownRef.current.contains(event.target as Node)
            ) {
                setShowFilterDropdown(false);
            }
            if (
                downloadDropdownRef.current &&
                !downloadDropdownRef.current.contains(event.target as Node)
            ) {
                setShowDownloadDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    /** tab & filter */
    const handleTab = (tab: string | null) => {
        setActiveFilter(tab);
        setCurrentPage(1);
    };

    /** sorting */
    const handleSort = (field: string) => {
        const newDirection =
            sortBy === field && sortDirection === "asc" ? "desc" : "asc";
        setSortBy(field);
        setSortDirection(newDirection);
        setShowSortDropdown(false);
    };

    /** perPage */
    const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = parseInt(e.target.value);
        setPerPage(value);
        setCurrentPage(1);
    };

    /** CRUD handlers */
    const handleEdit = (id: number) => router.visit(`/stok/${id}/edit`);
    const handleDelete = (id: number) =>
        confirm("Apakah Anda yakin ingin menghapus data ini?") &&
        router.delete(`/stok/${id}`);

    const clearFilters = () => {
        setSearch("");
        setSortBy("nama");
        setSortDirection("asc");
        setActiveFilter(null);
        setCurrentPage(1);
    };

    // Counts for tabs
    const lowStockCount = groupedStoks.filter(
        (group) => group.totalStok < 10
    ).length;
    const outOfStockCount = groupedStoks.filter(
        (group) => group.totalStok === 0
    ).length;
    const availableCount = groupedStoks.filter(
        (group) => group.totalStok > 0
    ).length;

    return (
        <AppLayout>
            <Head title="Stok" />
            <div className="min-h-screen bg-gray-50 p-6 overflow-hidden">
                <div className="mx-auto">
                    {/* Header */}
                    <div className="grid gap-2 lg:flex items-center justify-between mb-6">
                        <div className="flex gap-6 items-center">
                            <div className="flex flex-col gap-2">
                                <h1 className="text-2xl font-bold text-gray-700 whitespace-nowrap">
                                    Stok
                                </h1>
                                <h2 className="text-base font-medium text-gray-700 whitespace-nowrap">
                                    Stok / Daftar
                                </h2>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Dropdown Download */}
                            <div
                                className="relative inline-block text-left"
                                ref={downloadDropdownRef}
                            >
                                <button
                                    onClick={() =>
                                        setShowDownloadDropdown(
                                            !showDownloadDropdown
                                        )
                                    }
                                    className="inline-flex justify-center items-center px-4 py-2 bg-white text-black rounded-lg border border-black hover:bg-gray-200 text-left"
                                >
                                    <Download className="mr-2 h-5 w-5" />
                                    Download Data
                                    <ChevronDown className="ml-2 h-4 w-4" />
                                </button>

                                {showDownloadDropdown && (
                                    <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow-lg z-50">
                                        {downloadOptions.map((opt) => (
                                            <Link
                                                key={opt.label}
                                                href={opt.href}
                                                method="get"
                                                as="button"
                                                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                                                onClick={() =>
                                                    setShowDownloadDropdown(
                                                        false
                                                    )
                                                }
                                            >
                                                <FileText className="h-4 w-4" />
                                                {opt.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <Link
                                href="/stok/create"
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Plus className="h-4 w-4" />
                                Tambah Data
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="flex gap-4 mb-6 border-b">
                    <button
                        onClick={() => handleTab(null)}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                            activeFilter === null
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Semua Barang{" "}
                        <span className="ml-1 px-2 py-1 text-xs bg-gray-100 rounded-full">
                            {groupedStoks.length}
                        </span>
                    </button>
                    <button
                        onClick={() => handleTab("available")}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                            activeFilter === "available"
                                ? "border-green-500 text-green-600"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Tersedia{" "}
                        <span className="ml-1 px-2 py-1 text-xs bg-gray-100 rounded-full">
                            {availableCount}
                        </span>
                    </button>
                    <button
                        onClick={() => handleTab("low")}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                            activeFilter === "low"
                                ? "border-yellow-500 text-yellow-600"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Stok Rendah{" "}
                        <span className="ml-1 px-2 py-1 text-xs bg-gray-100 rounded-full">
                            {lowStockCount}
                        </span>
                    </button>
                    <button
                        onClick={() => handleTab("out")}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                            activeFilter === "out"
                                ? "border-red-500 text-red-600"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Habis{" "}
                        <span className="ml-1 px-2 py-1 text-xs bg-gray-100 rounded-full">
                            {outOfStockCount}
                        </span>
                    </button>
                </div>
                {/* Filter Status */}
                {(search || activeFilter) && (
                    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm font-medium text-blue-800">
                                <Filter className="h-4 w-4" />
                                <span>Filter aktif:</span>
                                {search && (
                                    <span className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full text-sm border border-blue-200">
                                        <Search className="h-3 w-3" />
                                        Cari: "{search}"
                                    </span>
                                )}
                                {activeFilter && (
                                    <span className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full text-sm border border-blue-200">
                                        {activeFilter === "available"
                                            ? "Tersedia"
                                            : activeFilter === "low"
                                            ? "Stok Rendah"
                                            : "Habis"}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-1 px-3 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors"
                            >
                                <X className="h-3 w-3" />
                                Clear All
                            </button>
                        </div>
                    </div>
                )}
                {/* Search & Sort */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6 grid gap-2 lg:flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1 w-full">
                        <div className="relative ">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari berdasarkan nama barang atau spesifikasi"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 pr-6 py-2 border md:w-80 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {/* Filter Dropdown */}
                        <div className="relative" ref={filterDropdownRef}>
                            <button
                                onClick={() =>
                                    setShowFilterDropdown(!showFilterDropdown)
                                }
                                className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                                    showFilterDropdown
                                        ? "border-blue-500 bg-blue-50 text-blue-600"
                                        : "border-gray-300 bg-white hover:bg-gray-50"
                                }`}
                            >
                                Filter
                                <ChevronDown
                                    className={`h-4 w-4 transition-transform ${
                                        showFilterDropdown ? "rotate-180" : ""
                                    }`}
                                />
                            </button>
                            {showFilterDropdown && (
                                <div className="absolute left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                                    <div className="p-2 flex flex-col">
                                        <span className="px-3 py-1 text-xs font-semibold text-gray-500">
                                            Status Stok
                                        </span>
                                        <button
                                            onClick={() =>
                                                handleTab("available")
                                            }
                                            className={`px-3 py-2 text-left text-sm rounded-lg hover:bg-gray-50 ${
                                                activeFilter === "available"
                                                    ? "bg-blue-50 text-blue-600 font-medium"
                                                    : ""
                                            }`}
                                        >
                                            Tersedia
                                        </button>
                                        <button
                                            onClick={() => handleTab("low")}
                                            className={`px-3 py-2 text-left text-sm rounded-lg hover:bg-gray-50 ${
                                                activeFilter === "low"
                                                    ? "bg-blue-50 text-blue-600 font-medium"
                                                    : ""
                                            }`}
                                        >
                                            Stok Rendah (&lt; 10)
                                        </button>
                                        <button
                                            onClick={() => handleTab("out")}
                                            className={`px-3 py-2 text-left text-sm rounded-lg hover:bg-gray-50 ${
                                                activeFilter === "out"
                                                    ? "bg-blue-50 text-blue-600 font-medium"
                                                    : ""
                                            }`}
                                        >
                                            Habis
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="relative" ref={sortDropdownRef}>
                            <button
                                onClick={() =>
                                    setShowSortDropdown(!showSortDropdown)
                                }
                                className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                                    showSortDropdown
                                        ? "border-blue-500 bg-blue-50 text-blue-600"
                                        : "border-gray-300 bg-white hover:bg-gray-50"
                                }`}
                            >
                                Urutkan
                                {sortDirection === "asc" ? (
                                    <SortAsc className="h-4 w-4" />
                                ) : (
                                    <SortDesc className="h-4 w-4" />
                                )}
                                <ChevronDown
                                    className={`h-4 w-4 transition-transform ${
                                        showSortDropdown ? "rotate-180" : ""
                                    }`}
                                />
                            </button>
                            {showSortDropdown && (
                                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                                    <div className="p-2">
                                        <button
                                            onClick={() => handleSort("nama")}
                                            className={`w-full flex items-center justify-between px-3 py-2 text-left text-sm rounded-lg hover:bg-gray-50 ${
                                                sortBy === "nama"
                                                    ? "bg-blue-50 text-blue-600 font-medium"
                                                    : "text-gray-700"
                                            }`}
                                        >
                                            <span>Nama Barang</span>
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleSort("total_stok")
                                            }
                                            className={`w-full flex items-center justify-between px-3 py-2 text-left text-sm rounded-lg hover:bg-gray-50 ${
                                                sortBy === "total_stok"
                                                    ? "bg-blue-50 text-blue-600 font-medium"
                                                    : "text-gray-700"
                                            }`}
                                        >
                                            <span>Total Stok</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2  gap-6 mb-6">
                    {paginatedGroups.map((group) => (
                        <div
                            key={group.barang.id}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow h-80"
                        >
                            {/* Card Content with Flex Layout */}
                            <div className="flex h-full">
                                {/* Image Section - Left Side */}
                                <div className=" bg-gray-100 flex items-center justify-center">
                                    {group.barang.foto ? (
                                        <img
                                            src={`storage/${group.barang.foto}`}
                                            alt={group.barang.nama}
                                            className="w-48 h-full object-cover"
                                        />
                                    ) : (
                                        <Package className="h-12 w-12 text-gray-400" />
                                    )}
                                </div>

                                {/* Content Section - Right Side */}
                                <div className="flex-1 p-4 flex flex-col">
                                    {/* Header */}
                                    <div className="mb-3">
                                        <h3 className="font-semibold text-base text-gray-900 mb-1 line-clamp-1">
                                            {group.barang.nama}
                                        </h3>
                                        <p className="text-xs text-gray-500 line-clamp-2">
                                            {group.barang.deskripsi ||
                                                "Tidak ada deskripsi"}
                                        </p>
                                    </div>

                                    {/* Total Stock Badge */}
                                    <div className="mb-3 space-y-2">
                                        {group.totalStok === 0 ? (
                                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                                Habis - {group.totalStok} unit
                                            </span>
                                        ) : group.totalStok < 10 ? (
                                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                Rendah - {group.totalStok} unit
                                            </span>
                                        ) : (
                                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                Tersedia - {group.totalStok}{" "}
                                                unit
                                            </span>
                                        )}

                                        {/* Status Peminjaman Badge */}
                                        {group.barang.boleh_dipinjam ? (
                                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 ml-2">
                                                Dapat Dipinjam
                                            </span>
                                        ) : (
                                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 ml-2">
                                                Tidak Dapat Dipinjam
                                            </span>
                                        )}
                                    </div>

                                    {/* Specifications with Scroll */}
                                    <div className="flex-1 overflow-hidden">
                                        <h4 className="text-xs font-medium text-gray-700 mb-2">
                                            SPESIFIKASI:
                                        </h4>
                                        {group.stoks.length > 0 ? (
                                            <div className="space-y-2 overflow-y-auto h-32">
                                                {group.stoks.map((stok) => (
                                                    <div
                                                        key={stok.id}
                                                        className="flex items-center justify-between p-2 bg-gray-50 rounded border"
                                                    >
                                                        <div className="flex-1 min-w-0">
                                                            <span className="text-xs text-gray-600 block truncate">
                                                                {stok.spesifikasi
                                                                    ? `${stok.spesifikasi.key}: ${stok.spesifikasi.value}`
                                                                    : "Tanpa spesifikasi"}
                                                            </span>
                                                            <span className="text-xs font-medium text-gray-900">
                                                                Stok:{" "}
                                                                {stok.jumlah}
                                                            </span>
                                                        </div>
                                                        <div className="flex gap-1 ml-2">
                                                            <button
                                                                onClick={() =>
                                                                    handleEdit(
                                                                        stok.id
                                                                    )
                                                                }
                                                                className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-100 rounded transition-colors"
                                                                title="Edit"
                                                            >
                                                                <Edit className="h-3 w-3" />
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        stok.id
                                                                    )
                                                                }
                                                                className="p-1 text-red-600 hover:text-red-900 hover:bg-red-100 rounded transition-colors"
                                                                title="Hapus"
                                                            >
                                                                <Trash2 className="h-3 w-3" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-gray-400">
                                                Tidak ada spesifikasi
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {/* Pagination */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <select
                            className="border border-gray-300 rounded px-2 py-1 text-sm"
                            value={perPage}
                            onChange={handlePerPageChange}
                        >
                            <option value={12}>12 data per halaman</option>
                            <option value={24}>24 data per halaman</option>
                            <option value={48}>48 data per halaman</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-700 whitespace-nowrap">
                            {startIndex + 1}-{Math.min(endIndex, totalItems)}{" "}
                            dari {totalItems}
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button
                                className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(currentPage + 1)}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
