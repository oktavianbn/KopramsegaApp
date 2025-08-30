"use client";

import { ModalDetailArsipSurat } from "@/Components/ModalDetailArsipSurat";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import {
    ArrowDownAZ,
    ArrowDownZA,
    ChevronDown,
    ChevronLeft, ChevronRight,
    Download,
    Edit,
    FileText,
    Filter,
    FolderClosed,
    Plus,
    Search,
    SortAsc, SortDesc,
    Trash2,
    X
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ArsipSurat {
    id: number;
    judul_surat: string;
    nomor_surat: string;
    jenis: "m" | "k";
    pengirim?: string;
    penerima?: string;
    tanggal_surat: string;
    keterangan: string;
    file_path?: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    arsipSurat: {
        data: ArsipSurat[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    filters: {
        search?: string;
        sort_by?: string;
        sort_direction?: "asc" | "desc";
        filter?: string;
    };
}

export default function Index({ arsipSurat, filters }: Props) {
    const [search, setSearch] = useState(filters.search || "");
    const [sortBy, setSortBy] = useState(filters.sort_by || "created_at");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">(filters.sort_direction || "desc");
    const [perPage, setPerPage] = useState(arsipSurat.per_page || 10);
    const [activeFilter, setActiveFilter] = useState<string | null>(filters.filter || null);
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [showDownloadDropdown, setShowDownloadDropdown] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedData, setSelectedData] = useState<ArsipSurat | null>(null);

    const sortDropdownRef = useRef<HTMLDivElement>(null);
    const filterDropdownRef = useRef<HTMLDivElement>(null);
    const downloadDropdownRef = useRef<HTMLDivElement>(null);

    const downloadOptions = [
        { label: "Excel", href: "/export/excel" },
        { label: "CSV", href: "/export/excel?format=csv" },
        { label: "PDF", href: "/export/pdf" },
        { label: "Word", href: "/export/word" },
    ];

    /** 🔹 utilitas untuk request dengan parameter konsisten */
    const updateQuery = (extra: Record<string, any> = {}) => {
        router.get(
            "/arsip-surat",
            {
                search,
                sort_by: sortBy,
                sort_direction: sortDirection,
                perPage,
                filter: activeFilter || undefined,  // 🔹 selalu kirim filter
                ...extra,
            },
            { preserveState: true }
        );
    };


    // live search debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (search !== filters.search) updateQuery();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [search]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
                setShowSortDropdown(false);
            }
            if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
                setShowFilterDropdown(false);
            }
            if (downloadDropdownRef.current && !downloadDropdownRef.current.contains(event.target as Node)) {
                setShowDownloadDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    /** 🔹 tab & filter */
    const handleTab = (tab: string | null) => {
        setActiveFilter(tab);
        updateQuery({ filter: tab || undefined, page: 1 });
    };

    /** 🔹 sorting */
    const handleSort = (field: string) => {
        const newDirection = sortBy === field && sortDirection === "asc" ? "desc" : "asc";
        setSortBy(field);
        setSortDirection(newDirection);
        updateQuery({ sort_by: field, sort_direction: newDirection });
        setShowSortDropdown(false);
    };

    /** 🔹 perPage */
    const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = parseInt(e.target.value);
        setPerPage(value);
        updateQuery({ perPage: value, page: 1 });
    };

    /** 🔹 CRUD handlers */
    const handleEdit = (id: number) => router.visit(`/arsip-surat/${id}/edit`);
    const handleDelete = (id: number) => confirm("Apakah Anda yakin ingin menghapus data ini?") && router.delete(`/arisp-surat/${id}`);
    const handleShow = (item: ArsipSurat) => { setSelectedData(item); setShowModal(true); };

    /** 🔹 utils */
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("id-ID");
    const clearFilters = () => {
        setSearch("");
        setSortBy("created_at");
        setSortDirection("desc");
        setActiveFilter(null);
        updateQuery({ filter: undefined, page: 1 });

    };

    return (
        <AppLayout>
            <Head title="arsip-surat" />
            <div className="min-h-screen bg-gray-50 p-6 overflow-hidden">
                <div className="mx-auto">
                    {/* Header */}
                    <div className="grid gap-2 lg:flex items-center justify-between mb-6">
                        <div className="flex gap-6 items-center">
                            <div className="p-2 h-max bg-blue-100 rounded-lg flex justify-center items-center">
                                <FolderClosed className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <h1 className="text-2xl font-bold text-gray-700 whitespace-nowrap">Arsip Surat</h1>
                                <h2 className="text-base font-medium text-gray-700 whitespace-nowrap">Arsip Surat / Daftar</h2>
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
                                href="/arsip-surat/create"
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                <Plus className="h-4 w-4" />
                                Tambah Data
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="flex gap-4 mb-6 border-b">
                    <button
                        onClick={() => handleTab("")}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeFilter === "" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        Seluruh Surat{" "}
                        <span className="ml-1 px-2 py-1 text-xs bg-gray-100 ro unded-full">{arsipSurat.total}</span>
                    </button>
                    <button
                        onClick={() => handleTab("m")}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeFilter === "m" ? "border-green-500 text-green-600" : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        Surat Masuk{" "}
                        <span className="ml-1 px-2 py-1 text-xs bg-gray-100 rounded-full">
                            {arsipSurat.data.filter((d) => d.jenis === "m").length}
                        </span>
                    </button>
                    <button
                        onClick={() => handleTab("k")}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeFilter === "k" ? "border-red-500 text-red-600" : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        Surat Keluar{" "}
                        <span className="ml-1 px-2 py-1 text-xs bg-gray-100 rounded-full">
                            {arsipSurat.data.filter((d) => d.jenis === "k").length}
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
                                        {activeFilter === "m" ? "Surat Masuk" : activeFilter === "k" ? "Surat Keluar" : activeFilter === "with_file" ? "Dengan File" : "Tanpa File"}
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
                                placeholder="Cari berdasarkan jumlah atau catatan"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                        // handleSort();
                                    }
                                }}
                                className="pl-10 pr-6 py-2 border md:w-80 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />

                        </div>
                    </div>
                    <div className="flex gap-2">
                        {/* Filter Dropdown */}
                        <div className="relative"
                            ref={filterDropdownRef}
                        >
                            <button
                                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                                className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${showFilterDropdown
                                    ? "border-blue-500 bg-blue-50 text-blue-600"
                                    : "border-gray-300 bg-white hover:bg-gray-50"
                                    }`}
                            >
                                Filter
                                <ChevronDown
                                    className={`h-4 w-4 transition-transform ${showFilterDropdown ? "rotate-180" : ""
                                        }`}
                                />
                            </button>
                            {showFilterDropdown && (
                                <div className="absolute left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                                    <div className="p-2 flex flex-col">
                                        <span className="px-3 py-1 text-xs font-semibold text-gray-500">Jenis Surat</span>
                                        <button
                                            onClick={() => handleTab("m")}
                                            className={`px-3 py-2 text-left text-sm rounded-lg hover:bg-gray-50 ${activeFilter === "m" ? "bg-blue-50 text-blue-600 font-medium" : ""
                                                }`}
                                        >
                                            Surat Masuk
                                        </button>
                                        <button
                                            onClick={() => handleTab("k")}
                                            className={`px-3 py-2 text-left text-sm rounded-lg hover:bg-gray-50 ${activeFilter === "k" ? "bg-blue-50 text-blue-600 font-medium" : ""
                                                }`}
                                        >
                                            Surat Keluar
                                        </button>

                                        <span className="px-3 py-1 mt-2 text-xs font-semibold text-gray-500">
                                            File Surat
                                        </span>
                                        <button
                                            onClick={() => handleTab("with_file")}
                                            className={`px-3 py-2 text-left text-sm rounded-lg hover:bg-gray-50 ${activeFilter === "i" ? "bg-blue-50 text-blue-600 font-medium" : ""
                                                }`}
                                        >
                                            Ada
                                        </button>
                                        <button
                                            onClick={() => handleTab("without_file")}
                                            className={`px-3 py-2 text-left text-sm rounded-lg hover:bg-gray-50 ${activeFilter === "u" ? "bg-blue-50 text-blue-600 font-medium" : ""
                                                }`}
                                        >
                                            Tidak Ada
                                        </button>
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
                                Urutkan
                                {sortBy === "tanggal_surat" ?
                                    sortDirection === "asc" ? (
                                        <SortAsc className="h-4 w-4" />
                                    ) : (
                                        <SortDesc className="h-4 w-4" />
                                    )
                                    :
                                    sortDirection === "asc" ? (
                                        <ArrowDownAZ className="h-4 w-4" />
                                    ) : (
                                        <ArrowDownZA className="h-4 w-4" />
                                    )
                                }

                                <ChevronDown
                                    className={`h-4 w-4 transition-transform ${showSortDropdown ? "rotate-180" : ""
                                        }`}
                                />
                            </button>
                            {showSortDropdown && (
                                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                                    <div className="p-2">
                                        <button
                                            onClick={() => handleSort("judul_surat")}
                                            className={`w-full flex items-center justify-between px-3 py-2 text-left text-sm rounded-lg hover:bg-gray-50 ${sortBy === "jumlah" ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                                                }`}
                                        >
                                            <span>Judul Surat</span>
                                        </button>
                                        <button
                                            onClick={() => handleSort("pengirim")}
                                            className={`w-full flex items-center justify-between px-3 py-2 text-left text-sm rounded-lg hover:bg-gray-50 ${sortBy === "jumlah" ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                                                }`}
                                        >
                                            <span>Pengirim</span>
                                        </button>
                                        <button
                                            onClick={() => handleSort("penerima")}
                                            className={`w-full flex items-center justify-between px-3 py-2 text-left text-sm rounded-lg hover:bg-gray-50 ${sortBy === "jumlah" ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                                                }`}
                                        >
                                            <span>Penerima</span>
                                        </button>
                                        <button
                                            onClick={() => handleSort("tanggal_surat")}
                                            className={`w-full flex items-center justify-between px-3 py-2 text-left text-sm rounded-lg hover:bg-gray-50 ${sortBy === "created_at" ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                                                }`}
                                        >
                                            <span>Tanggal Surat</span>
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
                                    <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">No.</th>
                                    <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Judul Surat</th>
                                    <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Nomor Surat</th>
                                    <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Jenis Surat</th>
                                    <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Pengirim</th>
                                    <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Penerima</th>
                                    <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Tanggal Surat</th>
                                    <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">File</th>
                                    <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                    <th className="whitespace-nowrap px-6 py-3 text-center"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 text-center">
                                {arsipSurat.data.map((item: ArsipSurat, idx) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-sm text-gray-900">
                                            {(arsipSurat.current_page - 1) * arsipSurat.per_page + idx + 1}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-sm text-gray-900 max-w-[200px] truncate">{item.judul_surat}</td>
                                        <td className="px-6 py-4 font-medium text-sm text-gray-900">{item.nomor_surat}</td>
                                        <td
                                            className={`px-6 py-4 font-medium text-sm ${item.jenis === "m" ? "text-green-600" : "text-yellow-600"
                                                }`}
                                        >
                                            {item.jenis === "m" ? "Masuk" : "Keluar"}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 font-medium text-sm text-gray-900">{item.pengirim || "-"}</td>
                                        <td className="whitespace-nowrap px-6 py-4 font-medium text-sm text-gray-900">{item.penerima || "-"}</td>
                                        <td className="px-6 py-4 font-medium text-sm text-gray-900">{formatDate(item.tanggal_surat)}</td>
                                        <td className="px-6 py-4 font-medium text-sm ">
                                            {item.file_path ? (
                                                <a
                                                    href={`storage/${item.file_path}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="hover:underline text-blue-600"
                                                >
                                                    Lihat File
                                                </a>
                                            ) : (
                                                <span className="text-gray-600 italic whitespace-nowrap">Tidak Ada File</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-sm flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleShow(item)}
                                                className="text-gray-600 hover:text-blue-600"
                                                title="Lihat Detail"
                                            >
                                                <FileText className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(item.id)}
                                                className="text-blue-600 hover:text-blue-900"
                                                title="Edit Surat"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="text-red-600 hover:text-red-900"
                                                title="Hapus Surat"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
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
                                {arsipSurat.from}-{arsipSurat.to} dari {arsipSurat.total}
                            </span>
                            <div className="flex items-center gap-1">
                                <button
                                    className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
                                    disabled={arsipSurat.current_page === 1}
                                    onClick={() =>
                                        router.get(
                                            "/arsip-surat",
                                            { search, sort_by: sortBy, sort_direction: sortDirection, page: arsipSurat.current_page - 1, perPage },
                                            { preserveState: true }
                                        )
                                    }
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <button
                                    className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
                                    disabled={arsipSurat.current_page === arsipSurat.last_page}
                                    onClick={() =>
                                        router.get(
                                            "/arsip-surat",
                                            { search, sort_by: sortBy, sort_direction: sortDirection, page: arsipSurat.current_page + 1, perPage },
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
            {/* Modal Show Data */}
            {showModal && selectedData && (
                <ModalDetailArsipSurat
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    data={selectedData}
                />)}
        </AppLayout>
    );
}
