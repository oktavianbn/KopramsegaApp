"use client"

import AppLayout from "@/Layouts/AppLayout"
import { Head, Link, router } from "@inertiajs/react"
import { useState, useEffect, useRef } from "react"
import {
    Calendar,
    CheckCircle,
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
    TimerReset,
    Trash2,
    UserPlus,
    X,
} from "lucide-react"

interface Sesi {
    id: number
    nama: string
    deskripsi?: string
    ditutup?: boolean
    tanggal_mulai?: string
    tanggal_selesai?: string
    created_at: string
    updated_at: string
}

interface Props {
    sesis: {
        data: Sesi[]
        current_page: number
        last_page: number
        per_page: number
        total: number
        from: number
        to: number
    }
    filters: {
        search?: string
        ditutup?: string
        sort_by?: string
        sort_direction?: "asc" | "desc"
    }
}

export default function Index({ sesis, filters }: Props) {
    // 🔹 State konsisten dengan Arsip & Dokumentasi
    const [search, setSearch] = useState("")
    const [sortBy, setSortBy] = useState("created_at")
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">(filters.sort_direction || "desc")
    const [perPage, setPerPage] = useState(sesis.per_page || 8)
    const [activeFilter, setActiveFilter] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState(filters.ditutup ?? "")
    const [showModal, setShowModal] = useState(false)
    const [selectedData, setSelectedData] = useState<Sesi | null>(null)
    const [showDownloadDropdown, setShowDownloadDropdown] = useState(false)
    const [showFilterDropdown, setShowFilterDropdown] = useState(false)
    const [showSortDropdown, setShowSortDropdown] = useState(false)

    // 🔹 Ref
    const downloadDropdownRef = useRef<HTMLDivElement>(null)
    const filterDropdownRef = useRef<HTMLDivElement>(null)
    const sortDropdownRef = useRef<HTMLDivElement>(null)

    const downloadOptions = [
        { label: "Excel", href: "/export/excel" },
        { label: "CSV", href: "/export/excel?format=csv" },
        { label: "PDF", href: "/export/pdf" },
        { label: "Word", href: "/export/word" },
    ]

    // Update ditutup flag handler (close/open sesi)
    const handleStatusUpdate = (id: number, ditutupValue: string) => {
        // ditutupValue expected to be '0' or '1'
        router.patch(`/sesi/${id}/status`, { ditutup: ditutupValue }, { preserveState: true });
    }

    /** 🔹 Update Query */
    const updateQuery = (extra: Record<string, any> = {}) => {
        router.get(
            "/sesi",
            {
                search,
                ditutup: activeTab !== "" ? activeTab : undefined,
                sort_by: sortBy,
                sort_direction: sortDirection,
                perPage,
                ...extra,
            },
            { preserveState: true },
        )
    }

    /** 🔹 Live search debounce */
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (search !== filters.search) updateQuery({ page: 1 })
        }, 500)
        return () => clearTimeout(timeoutId)
    }, [search])

    /** 🔹 Close dropdown di luar */
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node
            if (filterDropdownRef.current && !filterDropdownRef.current.contains(target)) setShowFilterDropdown(false)
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(target)) setShowSortDropdown(false)
            if (downloadDropdownRef.current && !downloadDropdownRef.current.contains(target)) setShowDownloadDropdown(false)
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    /** 🔹 Handler */
    const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = parseInt(e.target.value)
        setPerPage(value)
        updateQuery({ perPage: value, page: 1 })
    }

    const handleSort = (field: string) => {
        const newDirection = sortBy === field && sortDirection === "asc" ? "desc" : "asc"
        setSortBy(field)
        setSortDirection(newDirection)
        updateQuery({ sort_by: field, sort_direction: newDirection })
        setShowSortDropdown(false)
    }

    const handleTab = (tab: string) => {
        setActiveTab(tab)
        updateQuery({ ditutup: tab, page: 1 })
    }

    const clearFilters = () => {
        setSearch("")
        setActiveTab("")
        setActiveFilter(null)
        setSortBy("created_at")
        setSortDirection("desc")
        updateQuery({ page: 1 })
    }

    const handleShow = (item: Sesi) => { setSelectedData(item); setShowModal(true) }
    const handleEdit = (id: number) => router.visit(`/sesi/${id}/edit`)
    const handleDelete = (id: number) => confirm("Apakah Anda yakin ingin menghapus sesi ini?") && router.delete(`/sesi/${id}`)

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    const getTotalByStatus = (ditutupValue: string) => {
        if (ditutupValue === "") return sesis.total
        return sesis.data.filter((item) => String(item.ditutup ? 1 : 0) === ditutupValue).length
    }

    return (
        <AppLayout>
            <Head title="Sesi" />
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="mx-auto">
                    {/* Header */}
                    <div className="grid gap-2 lg:flex items-center justify-between mb-6">
                        <div className="flex gap-6 items-center">
                            <div className="p-2 h-max bg-blue-100 rounded-lg flex justify-center items-center">
                                <TimerReset className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <h1 className="text-2xl font-bold text-gray-700 whitespace-nowrap">Sesi</h1>
                                <h2 className="text-base font-medium text-gray-700 whitespace-nowrap">Sesi / Daftar</h2>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Download Dropdown */}
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
                                href="/sesi/create"
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Plus className="h-4 w-4" />
                                Tambah Sesi
                            </Link>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="mb-6 flex gap-4 border-b overflow-x-auto">
                        <button
                            onClick={() => handleTab("")}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                        >
                            Semua{" "}
                            <span className="ml-1 px-2 py-1 text-xs bg-gray-100 rounded-full">{sesis.total}</span>
                        </button>
                        <button
                            onClick={() => handleTab("0")}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "0" ? "border-gray-500 text-gray-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                        >
                            Terbuka{" "}
                            <span className="ml-1 px-2 py-1 text-xs bg-gray-100 rounded-full">{getTotalByStatus("0")}</span>
                        </button>
                        <button
                            onClick={() => handleTab("1")}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "1" ? "border-green-500 text-green-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                        >
                            Ditutup{" "}
                            <span className="ml-1 px-2 py-1 text-xs bg-gray-100 rounded-full">{getTotalByStatus("1")}</span>
                        </button>
                    </div>

                    {/* Filter Aktif */}
                    {(search || activeTab) && (
                        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm font-medium text-blue-800">
                                    <Filter className="h-4 w-4" />
                                    <span>Filter aktif:</span>
                                    {search && <span className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-blue-200"><Search className="h-3 w-3" /> Pencarian: "{search}"</span>}
                                    {activeTab && <span className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-blue-200">Status: {activeTab==="belum_dimulai"?"Belum Dimulai":activeTab==="selesai"?"Selesai":"Berlangsung"}</span>}
                                    {/* role filter removed for sesi */}
                                </div>
                                <button onClick={clearFilters} className="flex items-center gap-1 px-3 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg text-sm">
                                    <X className="h-3 w-3" /> Clear All
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Search & Filter */}
                    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6 grid gap-2 lg:flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Cari rencana berdasarkan nama atau deskripsi"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        {/* Filter & Sort */}
                        <div className="flex items-center gap-2">
                            <div className="relative" ref={filterDropdownRef}>
                                <button
                                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                                    className={`flex items-center gap-2 px-4 py-2 border rounded-lg ${showFilterDropdown ? "border-blue-500 bg-blue-50 text-blue-600" : "border-gray-300 bg-white hover:bg-gray-50"}`}>
                                    <Filter className="h-4 w-4" /> Filter
                                    {activeTab && <span className="bg-blue-500 w-2 h-2 rounded-full"></span>}
                                    <ChevronDown className={`h-4 w-4 transition-transform ${showFilterDropdown ? "rotate-180" : ""}`} />
                                </button>
                                {showFilterDropdown && (
                                    <div className="absolute left-0 mt-2 w-72 bg-white border rounded-lg shadow-lg z-20">
                                        <div className="p-4 space-y-4">
                                            <div className="px-4 py-2 text-sm text-gray-600">Filter by status (Terbuka / Ditutup)</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="relative" ref={sortDropdownRef}>
                                <button
                                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                                    className={`flex items-center gap-2 px-4 py-2 border rounded-lg ${showSortDropdown ? "border-blue-500 bg-blue-50 text-blue-600" : "border-gray-300 bg-white hover:bg-gray-50"}`}>
                                    Sort {sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                                    <ChevronDown className={`h-4 w-4 transition-transform ${showSortDropdown ? "rotate-180" : ""}`} />
                                </button>
                                {showSortDropdown && (
                                    <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg z-20">
                                        <div className="p-2">
                                            <button onClick={() => handleSort("nama_rencana")} className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 rounded">Nama Rencana</button>
                                            <button onClick={() => handleSort("tanggal_mulai")} className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 rounded">Tanggal Mulai</button>
                                            <button onClick={() => handleSort("tanggal_selesai")} className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 rounded">Tanggal Selesai</button>
                                            <button onClick={() => handleSort("status")} className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 rounded">Status</button>
                                            <button onClick={() => handleSort("created_at")} className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 rounded">Dibuat Pada</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 ">
                        {sesis.data.map((item: Sesi, idx: number) => (
                            <div
                                key={item.id}
                                className="relative overflow-hidden bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                            >
                                {/* Ribbon: show open/closed state */}
                                <div className="absolute -top-1 -left-2">
                                    <span
                                        style={{ clipPath: "polygon(0 0, 100% 0, 80% 100%, 0 100%)" }}
                                        className={`relative inline-block pl-6 pr-8 py-1 text-xs font-semibold text-white ${item.ditutup ? 'bg-red-600' : 'bg-green-600'}`}>
                                        {item.ditutup ? 'Ditutup' : 'Terbuka'}
                                    </span>
                                </div>


                                {/* Card Header */}
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-500">
                                            #{(sesis.current_page - 1) * sesis.per_page + idx + 1}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleShow(item)}
                                            className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-50 rounded"
                                        >
                                            <FileText className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleEdit(item.id)}
                                            className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Judul & Description */}
                                <h3 className="mb-2 text-lg font-semibold text-gray-900 w-[200px] truncate">{item.nama}</h3>
                                {item.deskripsi && <p className="text-sm text-gray-600 mb-4 line-clamp-2 w-[180px] truncate">{item.deskripsi}</p>}

                                                                {/* Dates */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm justify-between">
                                        <div className="flex">
                                            <Calendar className="h-4 w-4 text-gray-400" />
                                            <span className="text-gray-600">Mulai:</span>
                                        </div>
                                        <span className="font-medium text-gray-900">{item.tanggal_mulai ? formatDate(item.tanggal_mulai) : '-'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm justify-between">
                                        <div className="flex">
                                            <Calendar className="h-4 w-4 text-gray-400" />
                                            <span className="text-gray-600">Selesai:</span>
                                        </div>
                                        <span className="font-medium text-gray-900">{item.tanggal_selesai ? formatDate(item.tanggal_selesai) : "-"}</span>
                                    </div>
                                </div>

                                {/* Simple action: toggle open/close */}
                                <div className="mb-4">
                                    <button
                                        onClick={() => handleStatusUpdate(item.id, item.ditutup ? '0' : '1')}
                                        className={`px-3 py-1 text-sm font-medium rounded ${item.ditutup ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
                                    >
                                        {item.ditutup ? 'Buka Sesi' : 'Tutup Sesi'}
                                    </button>
                                </div>

                                {/* Card Footer */}
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500">Dibuat: {formatDate(item.created_at)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>

                    {/* Pagination */}
                    {sesis.data.length > 0 && (
                        <div className="bg-white rounded-lg shadow-sm border px-4 py-3 mt-6">
                            <div className="flex items-center justify-between">
                                {/* Per Page */}
                                <div className="flex items-center gap-2">
                                    <select
                                        className="border rounded px-2 py-1 text-sm"
                                        value={perPage}
                                        onChange={handlePerPageChange}
                                    >
                                        <option value={8}>8 data per halaman</option>
                                        <option value={16}>16 data per halaman</option>
                                        <option value={40}>40 data per halaman</option>
                                    </select>
                                </div>

                                {/* Info + Navigasi */}
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-700">
                                        {sesis.from}-{sesis.to} dari {sesis.total}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <button
                                            disabled={sesis.current_page === 1}
                                            onClick={() => updateQuery({ page: sesis.current_page - 1 })}
                                            className={`p-2 rounded hover:bg-gray-100 ${sesis.current_page === 1
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : ""
                                                }`}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </button>
                                        <button
                                            disabled={sesis.current_page === sesis.last_page}
                                            onClick={() => updateQuery({ page: sesis.current_page + 1 })}
                                            className={`p-2 rounded hover:bg-gray-100 ${sesis.current_page === sesis.last_page
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : ""
                                                }`}
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Modal: simple preview */}
            {showModal && selectedData && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">{selectedData.nama}</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-500">✕</button>
                        </div>
                        {selectedData.deskripsi && <p className="text-sm text-gray-700 mb-4">{selectedData.deskripsi}</p>}
                        <div className="flex justify-end">
                            <button onClick={() => { setShowModal(false); router.visit(`/sesi/${selectedData.id}/edit`) }} className="px-4 py-2 bg-blue-600 text-white rounded">Edit</button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    )
}
