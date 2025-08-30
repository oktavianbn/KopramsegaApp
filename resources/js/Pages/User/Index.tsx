"use client"

import AppLayout from "@/Layouts/AppLayout"
import { Head, Link, router } from "@inertiajs/react"
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
    X
} from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface Role {
    id: number
    name: string
}

interface user {
    id: number;
    name: string;
    email: string;
    role_id: number
    role: Role
    created_at: string
    updated_at: string
}

interface Props {
    users: {
        data: user[]
        current_page: number
        last_page: number
        per_page: number
        total: number
        from: number
        to: number
    }
    filters: {
        search?: string
        status?: string
        sort_by?: string
        sort_direction?: "asc" | "desc"
        role_id?: string
        filter?: string
    }
    roles: Role[]
}

export default function Index({ users, filters, roles }: Props) {
    const [search, setSearch] = useState(filters.search || "")
    const [status, setStatus] = useState(filters.status || "")
    const [sortBy, setSortBy] = useState(filters.sort_by || "created_at")
    const [sortDirection, setSortDirection] = useState(filters.sort_direction || "desc")
    const [roleFilter, setRoleFilter] = useState(filters.role_id || "")
    const [showFilterDropdown, setShowFilterDropdown] = useState(false)
    const [activeFilter, setActiveFilter] = useState<string | null>(
        filters.filter || null
    );
    const [showSortDropdown, setShowSortDropdown] = useState(false)
    const [perPage, setPerPage] = useState(users.per_page || 10);
    // Tab: "" = semua, "belum_dimulai" = belum dimulai, "sedang_dilaksanakan" = berlangsung, "selesai" = selesai
    const [activeTab, setActiveTab] = useState(filters.status || "")
    const [showModal, setShowModal] = useState(false);
    const [selectedData, setSelectedData] = useState<user | null>(null);
    const [showDownloadDropdown, setShowDownloadDropdown] = useState(false);

    const downloadDropdownRef = useRef<HTMLDivElement>(null);
    const filterDropdownRef = useRef<HTMLDivElement>(null)
    const sortDropdownRef = useRef<HTMLDivElement>(null)

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
                handleFilter()
            }
        }, 500) // 500ms delay

        return () => clearTimeout(timeoutId)
    }, [search])

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    const updateQuery = (extra: Record<string, any> = {}) => {
        router.get(
            "/user",
            {
                search,
                sort_by: sortBy,
                sort_direction: sortDirection,
                perPage,
                filter: activeFilter || undefined, // 🔹 selalu kirim filter
                ...extra,
            },
            { preserveState: true }
        );
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node

            // Close filter dropdown if clicked outside
            if (filterDropdownRef.current && !filterDropdownRef.current.contains(target)) {
                setShowFilterDropdown(false)
            }

            // Close sort dropdown if clicked outside
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(target)) {
                setShowSortDropdown(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    /** 🔹 perPage */
    const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = parseInt(e.target.value);
        setPerPage(value);
        updateQuery({ perPage: value, page: 1 });
    };

    // Filter handler
    const handleFilter = () => {
        router.get(
            "/user",
            {
                search,
                status: activeTab,
                sort_by: sortBy,
                sort_direction: sortDirection,
                role_id: roleFilter,
            },
            { preserveState: true },
        )
    }

    // Tab filter handler
    const handleTab = (tabStatus: string) => {
        setActiveTab(tabStatus)
        setStatus(tabStatus)
        router.get(
            "/user",
            {
                search,
                status: tabStatus,
                sort_by: sortBy,
                sort_direction: sortDirection,
                role_id: roleFilter,
            },
            { preserveState: true },
        )
    }

    // Sort handler
    const handleSort = (field: string) => {
        const newDirection = sortBy === field && sortDirection === "asc" ? "desc" : "asc"
        setSortBy(field)
        setSortDirection(newDirection)

        router.get(
            "/user",
            {
                search,
                status: activeTab,
                sort_by: field,
                sort_direction: newDirection,
                role_id: roleFilter,
            },
            { preserveState: true },
        )
        setShowSortDropdown(false)
    }

    // Clear filters
    const clearFilters = () => {
        setSearch("")
        setRoleFilter("")
        setActiveTab("")
        setStatus("")
        setSortBy("created_at")
        setSortDirection("desc")

        router.get("/user", {}, { preserveState: true })
        setShowFilterDropdown(false)
    }

    const handleShow = (item: user) => { setSelectedData(item); setShowModal(true); };


    // Edit handler
    const handleEdit = (id: number) => {
        router.visit(`/user/${id}/edit`)
    }

    // Delete handler
    const handleDelete = (id: number) => {
        if (confirm("Apakah Anda yakin ingin menghapus users ini?")) {
            router.delete(`/user/${id}`)
        }
    }

    // Update status handler
    const handleStatusUpdate = (id: number, newStatus: string) => {
        router.patch(
            `/user/${id}/status`,
            {
                status: newStatus,
            },
            {
                preserveState: true,
            },
        )
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "belum_dimulai":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <Clock className="w-3 h-3 mr-1" />
                        Belum Dimulai
                    </span>
                )
            case "sedang_dilaksanakan":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Calendar className="w-3 h-3 mr-1" />
                        Berlangsung
                    </span>
                )
            case "selesai":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Selesai
                    </span>
                )
            default:
                return status
        }
    }

    // const getTotalByStatus = (statusFilter: string) => {
    //     if (statusFilter === "") return users.total
    //     return users.data.filter((item) => item.status === statusFilter).length
    // }

    return (
        <AppLayout>
            <Head title="Pengguna" />
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="mx-auto">
                    {/* Header */}
                    <div className="grid gap-2 lg:flex items-center justify-between mb-6">
                        <div className="flex gap-6 items-center">
                            <div className="p-2 h-max bg-blue-100 rounded-lg flex justify-center items-center">
                                <Users className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <h1 className="text-2xl font-bold text-gray-700 whitespace-nowrap">Pengguna</h1>
                                <h2 className="text-base font-medium text-gray-700 whitespace-nowrap">Pengguna / Daftar</h2>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Dropdown Download */}
                            <div className="relative inline-block text-left" ref={downloadDropdownRef}>
                                <button
                                    onClick={() => setShowDownloadDropdown(!showDownloadDropdown)}
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
                                                onClick={() => setShowDownloadDropdown(false)}
                                            >
                                                <FileText className="h-4 w-4" />
                                                {opt.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <Link
                                href="/user/create"
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                <Plus className="h-4 w-4" />
                                Tambah Pengguna
                            </Link>
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
                                                {activeTab === "belum_dimulai"
                                                    ? "Belum Dimulai"
                                                    : activeTab === "sedang_dilaksanakan"
                                                        ? "Berlangsung"
                                                        : activeTab === "selesai"
                                                            ? "Selesai"
                                                            : activeTab}
                                            </span>
                                        )}
                                        {roleFilter && (
                                            <span className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full text-sm border border-blue-200">
                                                <UserPlus className="h-3 w-3" />
                                                Role: {roles.find((r) => r.id.toString() === roleFilter)?.name}
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
                                    placeholder="Cari Pengguna berdasarkan nama atau email"
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
                                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                                    className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${showFilterDropdown
                                        ? "border-blue-500 bg-blue-50 text-blue-600"
                                        : "border-gray-300 bg-white hover:bg-gray-50"
                                        }`}
                                >
                                    <Filter className="h-4 w-4" />
                                    Filter
                                    {(roleFilter || activeTab) && (
                                        <span className="bg-blue-500 text-white text-xs rounded-full w-2 h-2"></span>
                                    )}
                                    <ChevronDown className={`h-4 w-4 transition-transform ${showFilterDropdown ? "rotate-180" : ""}`} />
                                </button>

                                {showFilterDropdown && (
                                    <div className="absolute -left-10 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                                        <div className="p-4 space-y-4">
                                            <div className="border-b border-gray-100 pb-3">
                                                <h3 className="text-sm font-semibold text-gray-700 mb-3">Filter Options</h3>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Role</label>
                                                <select
                                                    value={roleFilter}
                                                    onChange={(e) => {
                                                        setRoleFilter(e.target.value)
                                                        setTimeout(handleFilter, 100)
                                                    }}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                    <option value="">Semua Role</option>
                                                    {roles.map((role) => (
                                                        <option key={role.id} value={role.id}>
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
                                                    onClick={() => setShowFilterDropdown(false)}
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
                                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                                    className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${showSortDropdown
                                        ? "border-blue-500 bg-blue-50 text-blue-600"
                                        : "border-gray-300 bg-white hover:bg-gray-50"
                                        }`}
                                >
                                    Sort
                                    {sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                                    <ChevronDown className={`h-4 w-4 transition-transform ${showSortDropdown ? "rotate-180" : ""}`} />
                                </button>

                                {showSortDropdown && (
                                    <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                                        <div className="p-2">
                                            <div className="px-3 py-2 border-b border-gray-100 mb-2">
                                                <h3 className="text-sm font-semibold text-gray-700">Sort by</h3>
                                            </div>
                                            <button
                                                onClick={() => handleSort("created_at")}
                                                className={`w-full flex items-center justify-between px-3 py-2 text-left text-sm rounded-lg hover:bg-gray-50 transition-colors ${sortBy === "created_at" ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                                                    }`}
                                            >
                                                <span>Dibuat Pada</span>
                                                {sortBy === "created_at" &&
                                                    (sortDirection === "asc" ? (
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
                                            Nama Pengguna
                                        </th>
                                        <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                            Email
                                        </th>
                                        <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                            Role
                                        </th>
                                        <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                            Dibuat Pada
                                        </th>
                                        <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.data.map((item, idx) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 text-sm text-gray-900 text-center">
                                                {(users.current_page - 1) *
                                                    users.per_page +
                                                    idx +
                                                    1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                                                {item.role_id ?? "Tidak ada"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                                                {formatDate(item.created_at)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleShow(item)}
                                                        className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-50 rounded"
                                                    >
                                                        <FileText className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                    onClick={()=>handleEdit(item.id)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(item.id)
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
                                    {users.from}-{users.to} dari{" "}
                                    {users.total}
                                </span>
                                <div className="flex items-center gap-1">
                                    <button
                                        className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
                                        disabled={users.current_page === 1}
                                        onClick={() =>
                                            router.get(
                                                "/user",
                                                {
                                                    search,
                                                    sort_by: sortBy,
                                                    sort_direction: sortDirection,
                                                    page: users.current_page - 1,
                                                    perPage,
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
                                            users.current_page ===
                                            users.last_page
                                        }
                                        onClick={() =>
                                            router.get(
                                                "/user",
                                                {
                                                    search,
                                                    sort_by: sortBy,
                                                    sort_direction: sortDirection,
                                                    page: users.current_page + 1,
                                                    perPage,
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
        </AppLayout >
    )
}
