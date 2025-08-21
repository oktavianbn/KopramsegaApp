"use client";

import { useState, useEffect, useRef } from "react";
import { Head, Link, router } from "@inertiajs/react";
import {
    Plus,
    Edit,
    Trash2,
    Search,
    Filter,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Download,
    UserPlus,
    Calendar,
    Clock,
    CheckCircle,
    SortAsc,
    SortDesc,
    X,
} from "lucide-react";
import AppLayout from "@/Layouts/AppLayout";

interface Role {
    id: number;
    name: string;
}

interface Rencana {
    id: number;
    nama_rencana: string;
    deskripsi?: string;
    tanggal_mulai: string;
    tanggal_selesai?: string;
    status: "belum_dimulai" | "sedang_dilaksanakan" | "selesai";
    role_id: number;
    role: Role;
    created_at: string;
    updated_at: string;
}

interface Props {
    rencanas: {
        data: Rencana[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    filters: {
        search?: string;
        status?: string;
        sort_by?: string;
        sort_direction?: "asc" | "desc";
        role_id?: string;
    };
    roles: Role[];
}

export default function Index({ rencanas, filters, roles }: Props) {
    const [search, setSearch] = useState(filters.search || "");
    const [status, setStatus] = useState(filters.status || "");
    const [sortBy, setSortBy] = useState(filters.sort_by || "created_at");
    const [sortDirection, setSortDirection] = useState(
        filters.sort_direction || "desc"
    );
    const [roleFilter, setRoleFilter] = useState(filters.role_id || "");
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    // Tab: "" = semua, "belum_dimulai" = belum dimulai, "sedang_dilaksanakan" = berlangsung, "selesai" = selesai
    const [activeTab, setActiveTab] = useState(filters.status || "");

    const filterDropdownRef = useRef<HTMLDivElement>(null);
    const sortDropdownRef = useRef<HTMLDivElement>(null);

    // Live search with debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (search !== filters.search) {
                handleFilter();
            }
        }, 500); // 500ms delay

        return () => clearTimeout(timeoutId);
    }, [search]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            // Close filter dropdown if clicked outside
            if (
                filterDropdownRef.current &&
                !filterDropdownRef.current.contains(target)
            ) {
                setShowFilterDropdown(false);
            }

            // Close sort dropdown if clicked outside
            if (
                sortDropdownRef.current &&
                !sortDropdownRef.current.contains(target)
            ) {
                setShowSortDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Filter handler
    const handleFilter = () => {
        router.get(
            "/rencana",
            {
                search,
                status: activeTab,
                sort_by: sortBy,
                sort_direction: sortDirection,
                role_id: roleFilter,
            },
            { preserveState: true }
        );
    };

    // Tab filter handler
    const handleTab = (tabStatus: string) => {
        setActiveTab(tabStatus);
        setStatus(tabStatus);
        router.get(
            "/rencana",
            {
                search,
                status: tabStatus,
                sort_by: sortBy,
                sort_direction: sortDirection,
                role_id: roleFilter,
            },
            { preserveState: true }
        );
    };

    // Sort handler
    const handleSort = (field: string) => {
        const newDirection =
            sortBy === field && sortDirection === "asc" ? "desc" : "asc";
        setSortBy(field);
        setSortDirection(newDirection);

        router.get(
            "/rencana",
            {
                search,
                status: activeTab,
                sort_by: field,
                sort_direction: newDirection,
                role_id: roleFilter,
            },
            { preserveState: true }
        );
        setShowSortDropdown(false);
    };

    // Clear filters
    const clearFilters = () => {
        setSearch("");
        setRoleFilter("");
        setActiveTab("");
        setStatus("");
        setSortBy("created_at");
        setSortDirection("desc");

        router.get("/rencana", {}, { preserveState: true });
        setShowFilterDropdown(false);
    };

    // Edit handler
    const handleEdit = (id: number) => {
        router.visit(`/rencana/${id}/edit`);
    };

    // Delete handler
    const handleDelete = (id: number) => {
        if (confirm("Apakah Anda yakin ingin menghapus rencana ini?")) {
            router.delete(`/rencana/${id}`);
        }
    };

    // Update status handler
    const handleStatusUpdate = (id: number, newStatus: string) => {
        router.patch(
            `/rencana/${id}/status`,
            {
                status: newStatus,
            },
            {
                preserveState: true,
            }
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("id-ID");
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "belum_dimulai":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <Clock className="w-3 h-3 mr-1" />
                        Belum Dimulai
                    </span>
                );
            case "sedang_dilaksanakan":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Calendar className="w-3 h-3 mr-1" />
                        Berlangsung
                    </span>
                );
            case "selesai":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Selesai
                    </span>
                );
            default:
                return status;
        }
    };

    const getTotalByStatus = (statusFilter: string) => {
        if (statusFilter === "") return rencanas.total;
        return rencanas.data.filter((item) => item.status === statusFilter)
            .length;
    };

    return (
        <AppLayout>
            <Head title="Rencana" />
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="mx-auto ">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-2xl font-bold text-gray-700">
                                Rencana
                            </h1>
                            <h2 className="text-base font-medium text-gray-700">
                                Rencana / Daftar
                            </h2>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                                <Download className="h-4 w-4" />
                                Download CSV
                            </button>
                            <Link
                                href="/rencana/create"
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                <Plus className="h-4 w-4" />
                                Tambah Rencana
                            </Link>
                        </div>
                    </div>

                    {/* Tabs Filter */}
                    <div className="mb-6">
                        <div className="flex border-b border-gray-200">
                            <button
                                onClick={() => handleTab("")}
                                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                                    activeTab === ""
                                        ? "border-blue-500 text-blue-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                Semua{" "}
                                <span className="ml-1 px-2 py-1 text-xs bg-gray-100 rounded-full">
                                    {rencanas.total}
                                </span>
                            </button>
                            <button
                                onClick={() => handleTab("sedang_dilaksanakan")}
                                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                                    activeTab === "sedang_dilaksanakan"
                                        ? "border-blue-500 text-blue-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                Berlangsung{" "}
                                <span className="ml-1 px-2 py-1 text-xs bg-yellow-100 rounded-full">
                                    {getTotalByStatus("sedang_dilaksanakan")}
                                </span>
                            </button>
                            <button
                                onClick={() => handleTab("selesai")}
                                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                                    activeTab === "selesai"
                                        ? "border-blue-500 text-blue-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                Selesai{" "}
                                <span className="ml-1 px-2 py-1 text-xs bg-green-100 rounded-full">
                                    {getTotalByStatus("selesai")}
                                </span>
                            </button>
                        </div>
                    </div>

                    {(search || roleFilter || activeTab) && (
                        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 text-sm font-medium text-blue-800">
                                        <Filter className="h-4 w-4" />
                                        <span>Filter aktif:</span>
                                    </div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {search && (
                                            <span className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full text-sm border border-blue-200">
                                                <Search className="h-3 w-3" />
                                                Pencarian: "{search}"
                                            </span>
                                        )}
                                        {activeTab && (
                                            <span className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full text-sm border border-blue-200">
                                                <Filter className="h-3 w-3" />
                                                Status:{" "}
                                                {activeTab ===
                                                "sedang_dilaksanakan"
                                                    ? "Berlangsung"
                                                    : activeTab === "selesai"
                                                    ? "Selesai"
                                                    : activeTab}
                                            </span>
                                        )}
                                        {roleFilter && (
                                            <span className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full text-sm border border-blue-200">
                                                <UserPlus className="h-3 w-3" />
                                                Role:{" "}
                                                {
                                                    roles.find(
                                                        (r) =>
                                                            r.id.toString() ===
                                                            roleFilter
                                                    )?.name
                                                }
                                            </span>
                                        )}
                                    </div>
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

                    {/* Search and Filter */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Cari rencana berdasarkan nama atau deskripsi"
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        onKeyPress={(e) => {
                                            if (e.key === "Enter") {
                                                handleFilter();
                                            }
                                        }}
                                        className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <button
                                    onClick={handleFilter}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Cari
                                </button>
                            </div>
                            <div className="flex items-center gap-2">
                                <div
                                    className="relative"
                                    ref={filterDropdownRef}
                                >
                                    <button
                                        onClick={() =>
                                            setShowFilterDropdown(
                                                !showFilterDropdown
                                            )
                                        }
                                        className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                                            showFilterDropdown
                                                ? "border-blue-500 bg-blue-50 text-blue-600"
                                                : "border-gray-300 bg-white hover:bg-gray-50"
                                        }`}
                                    >
                                        <Filter className="h-4 w-4" />
                                        Filter
                                        {(roleFilter || activeTab) && (
                                            <span className="bg-blue-500 text-white text-xs rounded-full w-2 h-2"></span>
                                        )}
                                        <ChevronDown
                                            className={`h-4 w-4 transition-transform ${
                                                showFilterDropdown
                                                    ? "rotate-180"
                                                    : ""
                                            }`}
                                        />
                                    </button>

                                    {showFilterDropdown && (
                                        <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                                            <div className="p-4 space-y-4">
                                                <div className="border-b border-gray-100 pb-3">
                                                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                                                        Filter Options
                                                    </h3>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Filter by Role
                                                    </label>
                                                    <select
                                                        value={roleFilter}
                                                        onChange={(e) => {
                                                            setRoleFilter(
                                                                e.target.value
                                                            );
                                                            setTimeout(
                                                                handleFilter,
                                                                100
                                                            );
                                                        }}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    >
                                                        <option value="">
                                                            Semua Role
                                                        </option>
                                                        {roles.map((role) => (
                                                            <option
                                                                key={role.id}
                                                                value={role.id}
                                                            >
                                                                {role.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="flex gap-2 pt-3 border-t border-gray-100">
                                                    <button
                                                        onClick={clearFilters}
                                                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                                    >
                                                        <X className="h-3 w-3" />
                                                        Clear
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            setShowFilterDropdown(
                                                                false
                                                            )
                                                        }
                                                        className="flex-1 px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                                    >
                                                        Apply
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="relative" ref={sortDropdownRef}>
                                    <button
                                        onClick={() =>
                                            setShowSortDropdown(
                                                !showSortDropdown
                                            )
                                        }
                                        className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                                            showSortDropdown
                                                ? "border-blue-500 bg-blue-50 text-blue-600"
                                                : "border-gray-300 bg-white hover:bg-gray-50"
                                        }`}
                                    >
                                        Sort
                                        {sortDirection === "asc" ? (
                                            <SortAsc className="h-4 w-4" />
                                        ) : (
                                            <SortDesc className="h-4 w-4" />
                                        )}
                                        <ChevronDown
                                            className={`h-4 w-4 transition-transform ${
                                                showSortDropdown
                                                    ? "rotate-180"
                                                    : ""
                                            }`}
                                        />
                                    </button>

                                    {showSortDropdown && (
                                        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                                            <div className="p-2">
                                                <div className="px-3 py-2 border-b border-gray-100 mb-2">
                                                    <h3 className="text-sm font-semibold text-gray-700">
                                                        Sort by
                                                    </h3>
                                                </div>
                                                <button
                                                    onClick={() =>
                                                        handleSort(
                                                            "nama_rencana"
                                                        )
                                                    }
                                                    className={`w-full flex items-center justify-between px-3 py-2 text-left text-sm rounded-lg hover:bg-gray-50 transition-colors ${
                                                        sortBy ===
                                                        "nama_rencana"
                                                            ? "bg-blue-50 text-blue-600 font-medium"
                                                            : "text-gray-700"
                                                    }`}
                                                >
                                                    <span>Nama Rencana</span>
                                                    {sortBy ===
                                                        "nama_rencana" &&
                                                        (sortDirection ===
                                                        "asc" ? (
                                                            <SortAsc className="h-3 w-3" />
                                                        ) : (
                                                            <SortDesc className="h-3 w-3" />
                                                        ))}
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleSort(
                                                            "tanggal_mulai"
                                                        )
                                                    }
                                                    className={`w-full flex items-center justify-between px-3 py-2 text-left text-sm rounded-lg hover:bg-gray-50 transition-colors ${
                                                        sortBy ===
                                                        "tanggal_mulai"
                                                            ? "bg-blue-50 text-blue-600 font-medium"
                                                            : "text-gray-700"
                                                    }`}
                                                >
                                                    <span>Tanggal Mulai</span>
                                                    {sortBy ===
                                                        "tanggal_mulai" &&
                                                        (sortDirection ===
                                                        "asc" ? (
                                                            <SortAsc className="h-3 w-3" />
                                                        ) : (
                                                            <SortDesc className="h-3 w-3" />
                                                        ))}
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleSort(
                                                            "tanggal_selesai"
                                                        )
                                                    }
                                                    className={`w-full flex items-center justify-between px-3 py-2 text-left text-sm rounded-lg hover:bg-gray-50 transition-colors ${
                                                        sortBy ===
                                                        "tanggal_selesai"
                                                            ? "bg-blue-50 text-blue-600 font-medium"
                                                            : "text-gray-700"
                                                    }`}
                                                >
                                                    <span>Tanggal Selesai</span>
                                                    {sortBy ===
                                                        "tanggal_selesai" &&
                                                        (sortDirection ===
                                                        "asc" ? (
                                                            <SortAsc className="h-3 w-3" />
                                                        ) : (
                                                            <SortDesc className="h-3 w-3" />
                                                        ))}
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleSort("status")
                                                    }
                                                    className={`w-full flex items-center justify-between px-3 py-2 text-left text-sm rounded-lg hover:bg-gray-50 transition-colors ${
                                                        sortBy === "status"
                                                            ? "bg-blue-50 text-blue-600 font-medium"
                                                            : "text-gray-700"
                                                    }`}
                                                >
                                                    <span>Status</span>
                                                    {sortBy === "status" &&
                                                        (sortDirection ===
                                                        "asc" ? (
                                                            <SortAsc className="h-3 w-3" />
                                                        ) : (
                                                            <SortDesc className="h-3 w-3" />
                                                        ))}
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleSort("created_at")
                                                    }
                                                    className={`w-full flex items-center justify-between px-3 py-2 text-left text-sm rounded-lg hover:bg-gray-50 transition-colors ${
                                                        sortBy === "created_at"
                                                            ? "bg-blue-50 text-blue-600 font-medium"
                                                            : "text-gray-700"
                                                    }`}
                                                >
                                                    <span>Dibuat Pada</span>
                                                    {sortBy === "created_at" &&
                                                        (sortDirection ===
                                                        "asc" ? (
                                                            <SortAsc className="h-3 w-3" />
                                                        ) : (
                                                            <SortDesc className="h-3 w-3" />
                                                        ))}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            No.
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nama Rencana
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Deskripsi
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tanggal Mulai
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tanggal Selesai
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Koordinator
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Dibuat Pada
                                        </th>
                                        <th className="px-6 py-3 text-left"></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {rencanas.data.map((item: Rencana, idx) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {(rencanas.current_page - 1) *
                                                    rencanas.per_page +
                                                    idx +
                                                    1}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                {item.nama_rencana}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                                {item.deskripsi || "-"}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {formatDate(item.tanggal_mulai)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {item.tanggal_selesai
                                                    ? formatDate(
                                                          item.tanggal_selesai
                                                      )
                                                    : "-"}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                <div className="flex flex-col gap-2">
                                                    <select
                                                        value={item.status}
                                                        onChange={(e) =>
                                                            handleStatusUpdate(
                                                                item.id,
                                                                e.target.value
                                                            )
                                                        }
                                                        className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        <option value="belum_dimulai">
                                                            Belum Dimulai
                                                        </option>
                                                        <option value="sedang_dilaksanakan">
                                                            Berlangsung
                                                        </option>
                                                        <option value="selesai">
                                                            Selesai
                                                        </option>
                                                    </select>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {item.role.name}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {formatDate(item.created_at)}
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm font-medium">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() =>
                                                            handleEdit(item.id)
                                                        }
                                                        className="text-blue-600 hover:text-blue-900 p-1"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                item.id
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-900 p-1"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="bg-white px-4 py-3 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-700">
                                        {rencanas.per_page} per halaman
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-700">
                                        {rencanas.from}-{rencanas.to} dari{" "}
                                        {rencanas.total}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <Link
                                            href={`/rencana?page=${
                                                rencanas.current_page - 1
                                            }&search=${search}&status=${status}&sort_by=${sortBy}&sort_direction=${sortDirection}&role_id=${roleFilter}`}
                                            className={`p-2 rounded hover:bg-gray-100 ${
                                                rencanas.current_page === 1
                                                    ? "opacity-50 pointer-events-none"
                                                    : ""
                                            }`}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Link>
                                        <Link
                                            href={`/rencana?page=${
                                                rencanas.current_page + 1
                                            }&search=${search}&status=${status}&sort_by=${sortBy}&sort_direction=${sortDirection}&role_id=${roleFilter}`}
                                            className={`p-2 rounded hover:bg-gray-100 ${
                                                rencanas.current_page ===
                                                rencanas.last_page
                                                    ? "opacity-50 pointer-events-none"
                                                    : ""
                                            }`}
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
