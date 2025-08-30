"use client"

import { ModalDetailDokumentasi } from "@/Components/ModalDetailDokumentasi"
import AppLayout from "@/Layouts/AppLayout"
import { Head, Link, router } from "@inertiajs/react"
import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Edit,
    FileText,
    Filter,
    Plus,
    Search,
    SortAsc,
    SortDesc,
    SwitchCamera,
    Trash2
} from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface Dokumentasi {
    id: number
    judul: string
    links: string[]
    kameramen?: string
    keterangan?: string
    created_at: string
    updated_at: string
}

interface Props {
    dokumentasis: {
        data: Dokumentasi[]
        current_page: number
        last_page: number
        per_page: number
        total: number
        from: number
        to: number
    }
    filters: {
        search?: string
        sort_by?: string
        sort_direction?: "asc" | "desc"
        kameramen?: string
    }
}

export default function Index({ dokumentasis, filters }: Props) {
    const [search, setSearch] = useState(filters.search || "")
    const [sortBy, setSortBy] = useState(filters.sort_by || "created_at")
    const [currentPage, setCurrentPage] = useState(1);
    const [sortDirection, setSortDirection] = useState(filters.sort_direction || "desc")
    const [kameramenFilter, setKameramenFilter] = useState(filters.kameramen || "")
    const [showFilterDropdown, setShowFilterDropdown] = useState(false)
    const [showSortDropdown, setShowSortDropdown] = useState(false)
    const [perPage, setPerPage] = useState(dokumentasis.per_page || 8)
    const [showModal, setShowModal] = useState(false);
    const [selectedData, setSelectedData] = useState<Dokumentasi | null>(null);

    const filterDropdownRef = useRef<HTMLDivElement>(null)
    const sortDropdownRef = useRef<HTMLDivElement>(null)

    /** 🔹 Update Query */
    const updateQuery = (extra: Record<string, any> = {}) => {
        router.get(
            "/dokumentasi",
            {
                search,
                kameramen: kameramenFilter || undefined,
                sort_by: sortBy,
                sort_direction: sortDirection,
                perPage,
                ...extra,
            },
            { preserveState: true }
        )
    }

    const handleShow = (item: Dokumentasi) => { setSelectedData(item); setShowModal(true); };

    /** 🔹 Live search dengan debounce */
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (search !== filters.search) {
                updateQuery({ page: 1 })
            }
        }, 500)
        return () => clearTimeout(timeoutId)
    }, [search])

    /** 🔹 Close dropdown kalau klik di luar */
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node
            if (filterDropdownRef.current && !filterDropdownRef.current.contains(target)) {
                setShowFilterDropdown(false)
            }
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(target)) {
                setShowSortDropdown(false)
            }
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

    const clearFilters = () => {
        setSearch("")
        setKameramenFilter("")
        setSortBy("created_at")
        setSortDirection("desc")
        router.get("/dokumentasi", {}, { preserveState: true })
        setShowFilterDropdown(false)
    }

    const handleDelete = (id: number) => {
        if (confirm("Apakah Anda yakin ingin menghapus dokumentasi ini?")) {
            router.delete(`/dokumentasi/${id}`)
        }
    }

    const renderLinks = (links: string[]) => {
        if (!links || links.length === 0) return <span className="italic text-gray-500">Tidak ada link</span>
        if (links.length === 1) {
            return (
                <a href={links[0]} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Lihat Link
                </a>
            )
        }
        return (
            <div className="flex flex-col gap-1">
                {links.map((link, i) => (
                    <a key={i} href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Link {i + 1}
                    </a>
                ))}
            </div>
        )
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    return (
        <AppLayout>
            <Head title="Dokumentasi" />
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="mx-auto">
                    {/* Header */}
                    <div className="grid gap-2 lg:flex items-center justify-between mb-6">
                        <div className="flex gap-6 items-center">
                            <div className="p-2 h-max bg-blue-100 rounded-lg flex justify-center items-center">
                                <SwitchCamera className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <h1 className="text-2xl font-bold text-gray-700 whitespace-nowrap">Dokumentasi</h1>
                                <h2 className="text-base font-medium text-gray-700 whitespace-nowrap">Dokumentasi / Daftar</h2>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link
                                href="/dokumentasi/create"
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Plus className="h-4 w-4" />
                                Tambah Dokumentasi
                            </Link>
                        </div>
                    </div>

                    {/* Search & Filter */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6 grid gap-2 lg:flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Cari dokumentasi berdasarkan judul atau kameramen"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10 pr-4 py-2 w-72 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Filter */}
                            <div className="relative" ref={filterDropdownRef}>
                                <button
                                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                                    className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${showFilterDropdown ? "border-blue-500 bg-blue-50 text-blue-600" : "border-gray-300 bg-white hover:bg-gray-50"
                                        }`}
                                >
                                    <Filter className="h-4 w-4" />
                                    Filter
                                    {kameramenFilter && <span className="bg-blue-500 w-2 h-2 rounded-full"></span>}
                                    <ChevronDown className={`h-4 w-4 transition-transform ${showFilterDropdown ? "rotate-180" : ""}`} />
                                </button>
                                {showFilterDropdown && (
                                    <div className="absolute -left-10 mt-2 w-72 bg-white border rounded-lg shadow-lg z-20">
                                        <div className="p-4 space-y-4">
                                            <div className="border-b pb-2">
                                                <h3 className="text-sm font-semibold text-gray-700">Filter Kameramen</h3>
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Nama kameramen..."
                                                value={kameramenFilter}
                                                onChange={(e) => setKameramenFilter(e.target.value)}
                                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                            />
                                            <div className="flex gap-2 pt-3 border-t">
                                                <button onClick={clearFilters} className="flex-1 border rounded-lg px-3 py-2 text-sm hover:bg-gray-50">
                                                    Clear
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setShowFilterDropdown(false)
                                                        updateQuery({ page: 1 })
                                                    }}
                                                    className="flex-1 bg-blue-500 text-white rounded-lg px-3 py-2 text-sm hover:bg-blue-600"
                                                >
                                                    Apply
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sort */}
                            <div className="relative" ref={sortDropdownRef}>
                                <button
                                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                                    className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${showSortDropdown ? "border-blue-500 bg-blue-50 text-blue-600" : "border-gray-300 bg-white hover:bg-gray-50"
                                        }`}
                                >
                                    Sort
                                    {sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                                    <ChevronDown className={`h-4 w-4 transition-transform ${showSortDropdown ? "rotate-180" : ""}`} />
                                </button>
                                {showSortDropdown && (
                                    <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg z-20">
                                        <div className="p-2">
                                            <button onClick={() => handleSort("judul")} className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 rounded">
                                                Judul
                                            </button>
                                            <button onClick={() => handleSort("created_at")} className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 rounded">
                                                Tanggal Dibuat
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        {dokumentasis.data.length === 0 ? (
                            <div className="col-span-full bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center text-gray-500">
                                Tidak ada data dokumentasi
                            </div>
                        ) : (
                            dokumentasis.data.map((item, idx) => (
                                <div
                                    key={item.id}
                                    className="relative bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
                                >
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-500">
                                            #{(dokumentasis.current_page - 1) * dokumentasis.per_page + idx + 1}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleShow(item)}
                                                className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-50 rounded"
                                            >
                                                <FileText className="h-4 w-4" />
                                            </button>
                                            <Link
                                                href={`/dokumentasi/${item.id}/edit`}
                                                className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                    {/* Judul */}
                                    <h3 className="mb-2 text-lg font-semibold text-gray-900 w-[200px] truncate">{item.judul}</h3>
                                    {item.keterangan && (
                                        <p className="text-sm text-gray-600 mb-2 line-clamp-2 ">{item.keterangan}</p>
                                    )}
                                    {/* Kameramen */}
                                    <div className="text-sm text-gray-600 mb-1 flex justify-between">
                                        <span className="font-medium">Kameramen:</span> <span className="font-bold text-black w-[100px] truncate text-end">{item.kameramen || "-"}</span>
                                    </div>
                                    {/* Keterangan */}
                                    {/* Footer */}
                                    <div className="mt-4 pt-4 border-t text-xs text-gray-500">Dibuat: {formatDate(item.created_at)}</div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    {dokumentasis.data.length > 0 && (
                        <div className="bg-white rounded-lg shadow-sm border px-4 py-3 mt-6">
                            <div className="flex items-center justify-between">
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
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-700">
                                        {dokumentasis.from}-{dokumentasis.to} dari {dokumentasis.total}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => setCurrentPage(currentPage - 1)}
                                            className={`p-2 rounded hover:bg-gray-100 ${dokumentasis.current_page === 1 ? "opacity-50 pointer-events-none" : ""
                                                }`}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => setCurrentPage(currentPage + 1)}
                                            className={`p-2 rounded hover:bg-gray-100 ${dokumentasis.current_page === dokumentasis.last_page
                                                ? "opacity-50 pointer-events-none"
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
            {/* Modal Show Data */}
            {
                showModal && selectedData && (
                    <ModalDetailDokumentasi
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                        data={selectedData}
                    />)
            }
        </AppLayout>
    )
}
