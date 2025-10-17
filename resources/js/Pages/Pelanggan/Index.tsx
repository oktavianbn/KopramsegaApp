"use client";

import AppLayout from "@/Layouts/AppLayout";
import { cn } from "@/lib/utils";
import { Head, Link, router } from "@inertiajs/react";
import {
    Calendar,
    CheckCircle,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Clock,
    Download,
    Edit,
    FileText,
    Filter,
    Plus,
    Search,
    SortAsc,
    SortDesc,
    Trash2,
    UserPlus,
    Users,
    X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Pelanggan {
    id: number;
    name: string;
    nohp: string;
    status: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    pelanggans: {
        data: Pelanggan[];
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
        filter?: string;
        perPage?: number;
    };
}
export default function Index({ pelanggans, filters }: Props) {
    const [search, setSearch] = useState(filters.search || "");
    const [status, setStatus] = useState(filters.status || "");
    const [sortBy, setSortBy] = useState(filters.sort_by || "name");
    const [sortDirection, setSortDirection] = useState(
        filters.sort_direction || "asc"
    );
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [activeFilter, setActiveFilter] = useState<string | number | null>(
        filters.filter || null
    );
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [perPage, setPerPage] = useState<any>(pelanggans.per_page || 10);
    // Tab: "" = semua, "belum_dimulai" = belum dimulai, "sedang_dilaksanakan" = berlangsung, "selesai" = selesai
    const [activeTab, setActiveTab] = useState<string>(filters.filter || "");
    const [showModal, setShowModal] = useState(false);
    const [selectedData, setSelectedData] = useState<Pelanggan | null>(null);
    const [showDownloadDropdown, setShowDownloadDropdown] = useState(false);

    const downloadDropdownRef = useRef<HTMLDivElement>(null);
    const filterDropdownRef = useRef<HTMLDivElement>(null);
    const sortDropdownRef = useRef<HTMLDivElement>(null);

    const downloadOptions = [
        { label: "Excel", href: "/export/excel" },
        { label: "CSV", href: "/export/excel?format=csv" },
        { label: "PDF", href: "/export/pdf" },
        { label: "Word", href: "/export/word" },
    ];

    // Live search with debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (search !== filters.search) {
                updateQuery({ page: 1 });
            }
        }, 500); // 500ms delay

        return () => clearTimeout(timeoutId);
    }, [search]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const updateQuery = (extra: Record<string, any> = {}) => {
        router.get(
            "/pelanggan",
            {
                search,
                perPage,
                sort_by: sortBy,
                sort_direction: sortDirection,
                filter: activeFilter,
                ...extra,
            },
            { preserveState: true }
        );
    };

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

    /** 🔹 perPage */
    const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setPerPage(value);
        updateQuery({ perPage: value, page: 1 });
    };

    // Filter handler
    const handleFilter = () => {
        updateQuery({ page: 1 });
    };

    // Tab filter handler
    const handleTab = (tabStatus: string) => {
        setActiveTab(tabStatus);
        setStatus(tabStatus);
        setActiveFilter(tabStatus || null);
        updateQuery({ page: 1 });
    };

    // Sort handler
    const handleSort = (field: string) => {
        const newDirection =
            sortBy === field && sortDirection === "asc" ? "desc" : "asc";
        setSortBy(field);
        setSortDirection(newDirection);
        updateQuery({ page: 1 });
        setShowSortDropdown(false);
    };

    // Clear filters
    const clearFilters = () => {
        // reset local state
        setSearch("");
        setActiveTab("");
        setActiveFilter(null);
        setStatus("");
        setSortBy("name");
        setSortDirection("asc");
        setPerPage(10);

        // explicitly request server with reset params (avoid stale state)
        updateQuery({
            page: 1,
            search: "",
            perPage: 10,
            sort_by: "name",
            sort_direction: "asc",
            filter: null,
        });

        setShowFilterDropdown(false);
    };

    const handleShow = (item: Pelanggan) => {
        setSelectedData(item);
        setShowModal(true);
    };

    // Edit handler
    const handleEdit = (id: number) => {
        router.visit(`/pelanggan/${id}/edit`);
    };

    // Delete handler
    const handleDelete = (id: number) => {
        if (confirm("Apakah Anda yakin ingin menghapus pelanggan ini?")) {
            router.delete(`/pelanggan/${id}`);
        }
    };
    // Toggle status handler: flip 0 <-> 1 and patch, then refresh list
    const toggleStatus = (item: Pelanggan) => {
        const newIsActive = item.status === 1 ? 0 : 1;
        router.patch(
            `/pelanggan/${item.id}/status`,
            { is_active: newIsActive },
            {
                preserveState: true,
                onSuccess: () => {
                    // refresh listing (preserve current filters)
                    updateQuery();
                },
            }
        );
    };
    const getStatusBadge = (status: number) => {
        if (status === 1) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Aktif
                </span>
            );
        }

        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Nonaktif
            </span>
        );
    };

    // const getTotalByStatus = (statusFilter: string) => {
    //     if (statusFilter === "") return users.total
    //     return users.data.filter((item) => item.status === statusFilter).length
    // }

    return (
        <AppLayout>
            <Head title="Pelanggan" />
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="mx-auto">
                    {/* Header */}
                    <div className="grid gap-2 lg:flex items-center justify-between mb-6">
                        <div className="flex gap-6 items-center">
                            <div className="p-2 h-max bg-blue-100 rounded-lg flex justify-center items-center">
                                <Users className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <h1 className="text-2xl font-bold text-gray-700 whitespace-nowrap">
                                    Pelanggan
                                </h1>
                                <h2 className="text-base font-medium text-gray-700 whitespace-nowrap">
                                    Pelanggan / Daftar
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
                        </div>
                    </div>

                    {/* Tabs Filter */}
                    <div className="mb-6 flex gap-4 border-b overflow-x-auto">
                        {/* <button
                            onClick={() => handleTab("")}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                        >
                            Semua{" "}
                            <span className="ml-1 px-2 py-1 text-xs bg-gray-100 rounded-full">{users.total}</span>
                        </button>
                        <button
                            onClick={() => handleTab("belum_dimulai")}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "belum_dimulai" ? "border-gray-500 text-gray-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                        >
                            Belum Dimulai{" "}
                            <span className="ml-1 px-2 py-1 text-xs bg-gray-100 rounded-full">{getTotalByStatus("belum_dimulai")}</span>
                        </button>
                        <button
                            onClick={() => handleTab("sedang_dilaksanakan")}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "sedang_dilaksanakan" ? "border-yellow-500 text-yellow-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                        >
                            Berlangsung{" "}
                            <span className="ml-1 px-2 py-1 text-xs bg-yellow-100 rounded-full">{getTotalByStatus("sedang_dilaksanakan")}</span>
                        </button>
                        <button
                            onClick={() => handleTab("selesai")}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "selesai" ? "border-green-500 text-green-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                        >
                            Selesai{" "}
                            <span className="ml-1 px-2 py-1 text-xs bg-green-100 rounded-full">{getTotalByStatus("selesai")}</span>
                        </button> */}
                    </div>

                    {/* Active Filters (tetap sama dari kode 1) */}
                    {(search || activeFilter) && (
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
                                        {activeFilter && (
                                            <span className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full text-sm border border-blue-200">
                                                <Filter className="h-3 w-3" />
                                                Status: {" "}
                                                {activeFilter === 'inactive'
                                                    ? "Nonaktif"
                                                    : activeFilter === 'active'
                                                        ? "Aktif"
                                                        : "Semua"}
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

                    {/* Search & Filter */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6 grid gap-2 lg:flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Cari Pelanggan berdasarkan nama atau nohp"
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                    }}
                                    className="pl-10 pr-4 py-2 w-72 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative" ref={filterDropdownRef}>
                                <button
                                    onClick={() =>
                                        setShowFilterDropdown(
                                            !showFilterDropdown
                                        )
                                    }
                                    className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${showFilterDropdown
                                        ? "border-blue-500 bg-blue-50 text-blue-600"
                                        : "border-gray-300 bg-white hover:bg-gray-50"
                                        }`}
                                >
                                    <Filter className="h-4 w-4" />
                                    Filter
                                    <ChevronDown
                                        className={`h-4 w-4 transition-transform ${showFilterDropdown
                                            ? "rotate-180"
                                            : ""
                                            }`}
                                    />
                                </button>

                                {showFilterDropdown && (
                                    <div className="absolute -left-10 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                                        <div className="p-2">
                                            <div className="px-3 py-2 border-b border-gray-100 mb-2">
                                                <h3 className="text-sm font-semibold text-gray-700">Filter</h3>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const v = null;
                                                    setActiveFilter(v);
                                                    setActiveTab("");
                                                    updateQuery({ page: 1, filter: v });
                                                    setShowFilterDropdown(false);
                                                }}
                                                className={`w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-50 ${activeFilter === null ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'}`}
                                            >
                                                Semua
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const v = 'active';
                                                    setActiveFilter(v);
                                                    setActiveTab(v);
                                                    updateQuery({ page: 1, filter: v });
                                                    setShowFilterDropdown(false);
                                                }}
                                                className={`w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-50 ${activeFilter === 'active' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'}`}
                                            >
                                                Aktif
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const v = 'inactive';
                                                    setActiveFilter(v);
                                                    setActiveTab(v);
                                                    updateQuery({ page: 1, filter: v });
                                                    setShowFilterDropdown(false);
                                                }}
                                                className={`w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-50 ${activeFilter === 'inactive' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'}`}
                                            >
                                                Nonaktif
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="relative" ref={sortDropdownRef}>
                                <button
                                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                                    className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${showSortDropdown ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-300 bg-white hover:bg-gray-50'}`}
                                >
                                    Sort
                                    {sortDirection === "asc" ? (
                                        <SortAsc className="h-4 w-4" />
                                    ) : (
                                        <SortDesc className="h-4 w-4" />
                                    )}
                                    <ChevronDown
                                        className={`h-4 w-4 transition-transform ${showSortDropdown ? "rotate-180" : ""
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
                                                onClick={() => handleSort("created_at")}
                                                className={`w-full flex items-center justify-between px-3 py-2 text-left text-sm rounded-lg hover:bg-gray-50 transition-colors ${sortBy === 'created_at' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'}`}
                                            >
                                                <span>Dibuat Pada</span>
                                                {sortBy === "created_at" &&
                                                    (sortDirection === "asc" ? (
                                                        <SortAsc className="h-3 w-3" />
                                                    ) : (
                                                        <SortDesc className="h-3 w-3" />
                                                    ))}
                                            </button>
                                            <button
                                                onClick={() => handleSort('name')}
                                                className={`w-full flex items-center justify-between px-3 py-2 text-left text-sm rounded-lg hover:bg-gray-50 transition-colors ${sortBy === 'name' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'}`}
                                            >
                                                <span>Nama</span>
                                                {sortBy === 'name' && (sortDirection === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />)}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                            No.
                                        </th>
                                        <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                            Nama Pelanggan
                                        </th>
                                        <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                            No Hp
                                        </th>
                                        <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                            Status
                                        </th>
                                        <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {pelanggans.data.map((item: Pelanggan, idx: number) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 text-sm text-gray-900 text-center">
                                                {(pelanggans.current_page - 1) *
                                                    pelanggans.per_page +
                                                    idx +
                                                    1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.nohp}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                                                <div className="flex items-center justify-center gap-3">
                                                    <button
                                                        onClick={() => toggleStatus(item)}
                                                        className={cn("px-3 py-1 rounded-lg text-sm font-medium", {
                                                            "bg-green-100 text-green-800": item.status === 1,
                                                            "bg-gray-100 text-gray-800": item.status === 0,
                                                        })}
                                                    >
                                                        {item.status === 1 ? 'Aktif' : 'Nonaktif'}
                                                    </button>

                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex justify-center ">
                                                <div className="flex items-center gap-2 w-max">
                                                    <button
                                                        onClick={() =>
                                                            handleShow(item)
                                                        }
                                                        className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-50 rounded"
                                                    >
                                                        <FileText className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleEdit(item.id)
                                                        }
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                item.id
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-900"
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
                        <div className="bg-white px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <select
                                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                                    value={perPage}
                                    onChange={handlePerPageChange}
                                >
                                    <option value={10}>10 data per halaman</option>
                                    <option value={20}>20 data per halaman</option>
                                    <option value={50}>50 data per halaman</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-700 whitespace-nowrap">
                                    {pelanggans.from}-{pelanggans.to} dari {pelanggans.total}
                                </span>
                                <div className="flex items-center gap-1">
                                    <button
                                        className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
                                        disabled={pelanggans.current_page === 1}
                                        onClick={() =>
                                            router.get(
                                                "/pelanggan",
                                                {
                                                    search,
                                                    sort_by: sortBy,
                                                    sort_direction:
                                                        sortDirection,
                                                    page:
                                                        pelanggans.current_page - 1,
                                                    perPage,
                                                    filter: activeFilter,
                                                },
                                                { preserveState: true }
                                            )
                                        }
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>
                                    <button
                                        className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
                                        disabled={
                                            pelanggans.current_page ===
                                            pelanggans.last_page
                                        }
                                        onClick={() =>
                                            router.get(
                                                "/pelanggan",
                                                {
                                                    search,
                                                    sort_by: sortBy,
                                                    sort_direction:
                                                        sortDirection,
                                                    page:
                                                        pelanggans.current_page + 1,
                                                    perPage,
                                                    filter: activeFilter,
                                                },
                                                { preserveState: true }
                                            )
                                        }
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal Show Data */}
            {/* {
                showModal && selectedData && (
                    <ModalDetailRencana
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                        data={selectedData}
                    />)
            } */}
        </AppLayout>
    );
}
