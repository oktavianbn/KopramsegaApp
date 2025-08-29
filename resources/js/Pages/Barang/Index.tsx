"use client";

import { useState, useEffect, useRef } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import {
    Search,
    Filter,
    ArrowUpDown,
    ChevronDown,
    Plus,
    Download,
    Edit,
    Trash2,
    Package,
    Eye,
    X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Spesifikasi {
    id: number;
    key: string;
    value: string;
    description?: string;
}

interface Barang {
    id: number;
    nama: string;
    deskripsi?: string;
    foto?: string;
    boleh_dipinjam: boolean;
    spesifikasi?: Spesifikasi[];
    created_at: string;
    updated_at: string;
}

interface Props {
    barangs: {
        data: Barang[];
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
    };
}

export default function Index({ barangs, filters }: Props) {
    const [search, setSearch] = useState(filters.search || "");
    const [sortBy, setSortBy] = useState(filters.sort_by || "created_at");
    const [sortDirection, setSortDirection] = useState(
        filters.sort_direction || "desc"
    );
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedBarang, setSelectedBarang] = useState<Barang | null>(null);
    const [activeTab, setActiveTab] = useState<"info" | "spec">("info");

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

    const handleView = (barang: Barang) => {
        setSelectedBarang(barang);
        setActiveTab("info");
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedBarang(null);
    };

    // Filter handler
    const handleFilter = () => {
        router.get(
            "/barang",
            {
                search,
                sort_by: sortBy,
                sort_direction: sortDirection,
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
            "/barang",
            {
                search,
                sort_by: field,
                sort_direction: newDirection,
            },
            { preserveState: true }
        );
        setShowSortDropdown(false);
    };

    // Clear filters
    const clearFilters = () => {
        setSearch("");
        setSortBy("created_at");
        setSortDirection("desc");

        router.get("/barang", {}, { preserveState: true });
    };

    // Edit handler
    const handleEdit = (id: number) => {
        router.visit(`/barang/${id}/edit`);
    };

    // Delete handler
    const handleDelete = (id: number) => {
        if (confirm("Apakah Anda yakin ingin menghapus barang ini?")) {
            router.delete(`/barang/${id}`);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("id-ID");
    };

    const getSortIcon = (field: string) => {
        if (sortBy !== field) {
            return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
        }
        return sortDirection === "asc" ? (
            <ArrowUpDown className="h-4 w-4 text-blue-500 rotate-180" />
        ) : (
            <ArrowUpDown className="h-4 w-4 text-blue-500" />
        );
    };

    return (
        <AppLayout>
            <Head title="Barang" />
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-2xl font-bold text-gray-700">
                                Barang
                            </h1>
                            <h2 className="text-base font-medium text-gray-700">
                                Inventory / Barang / Daftar
                            </h2>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                                <Download className="h-4 w-4" />
                                Download CSV
                            </button>
                            <Link
                                href="/barang/create"
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                <Plus className="h-4 w-4" />
                                Tambah Barang
                            </Link>
                        </div>
                    </div>

                    {/* Active Filters */}
                    {search && (
                        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Filter className="h-4 w-4 text-blue-600" />
                                    <span className="text-sm font-medium text-blue-800">
                                        Filter aktif:
                                    </span>
                                    {search && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            Pencarian: "{search}"
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={clearFilters}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                    Hapus semua filter
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Search and Filter */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                                {/* Search */}
                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <input
                                        type="text"
                                        placeholder="Cari barang..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Sort Dropdown */}
                            <div className="relative" ref={sortDropdownRef}>
                                <button
                                    onClick={() =>
                                        setShowSortDropdown(!showSortDropdown)
                                    }
                                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                                >
                                    <ArrowUpDown className="h-4 w-4" />
                                    Urutkan
                                    <ChevronDown className="h-4 w-4" />
                                </button>
                                {showSortDropdown && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                        <div className="py-1">
                                            <button
                                                onClick={() =>
                                                    handleSort("nama")
                                                }
                                                className={cn(
                                                    "w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center justify-between",
                                                    sortBy === "nama" &&
                                                        "bg-blue-50 text-blue-700"
                                                )}
                                            >
                                                Nama
                                                {getSortIcon("nama")}
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleSort("created_at")
                                                }
                                                className={cn(
                                                    "w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center justify-between",
                                                    sortBy === "created_at" &&
                                                        "bg-blue-50 text-blue-700"
                                                )}
                                            >
                                                Tanggal Dibuat
                                                {getSortIcon("created_at")}
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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Foto
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Barang
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Deskripsi
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Spesifikasi
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status Peminjaman
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tanggal Dibuat
                                        </th>

                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {barangs.data.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-6 py-12 text-center text-gray-500"
                                            >
                                                <Package className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                                                <p className="text-lg font-medium">
                                                    Tidak ada barang
                                                </p>
                                                <p className="text-sm">
                                                    Belum ada data barang yang
                                                    tersedia.
                                                </p>
                                            </td>
                                        </tr>
                                    ) : (
                                        barangs.data.map((barang) => (
                                            <tr
                                                key={barang.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {barang.foto ? (
                                                        <div className="flex items-center">
                                                            <img
                                                                src={`/storage/${barang.foto}`}
                                                                alt={
                                                                    barang.nama
                                                                }
                                                                className="h-20 w-20 rounded-lg object-cover"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">
                                                            Tidak ada foto
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10"></div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {barang.nama}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900 max-w-xs truncate">
                                                        {barang.deskripsi ||
                                                            "-"}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900 max-w-xs truncate">
                                                        {barang.spesifikasi
                                                            ?.length ||
                                                            "-"}{" "}
                                                        Spesifikasi
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                            barang.boleh_dipinjam
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-red-100 text-red-800"
                                                        }`}
                                                    >
                                                        {barang.boleh_dipinjam
                                                            ? "Dapat Dipinjam"
                                                            : "Tidak Dapat Dipinjam"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(
                                                        barang.created_at
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() =>
                                                                handleView(
                                                                    barang
                                                                )
                                                            }
                                                            className="text-black p-1 hover:bg-green-50 rounded"
                                                            title="Lihat Detail"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleEdit(
                                                                    barang.id
                                                                )
                                                            }
                                                            className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                                                            title="Edit"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    barang.id
                                                                )
                                                            }
                                                            className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                                                            title="Hapus"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="bg-white px-4 py-3 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    {barangs.current_page > 1 && (
                                        <Link
                                            href={`/barang?page=${
                                                barangs.current_page - 1
                                            }`}
                                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                            Previous
                                        </Link>
                                    )}
                                    {barangs.current_page <
                                        barangs.last_page && (
                                        <Link
                                            href={`/barang?page=${
                                                barangs.current_page + 1
                                            }`}
                                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                            Next
                                        </Link>
                                    )}
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Menampilkan{" "}
                                            <span className="font-medium">
                                                {barangs.from}
                                            </span>{" "}
                                            sampai{" "}
                                            <span className="font-medium">
                                                {barangs.to}
                                            </span>{" "}
                                            dari{" "}
                                            <span className="font-medium">
                                                {barangs.total}
                                            </span>{" "}
                                            hasil
                                        </p>
                                    </div>
                                    <div>
                                        <nav
                                            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                                            aria-label="Pagination"
                                        >
                                            {/* Pagination buttons */}
                                            {Array.from(
                                                { length: barangs.last_page },
                                                (_, i) => i + 1
                                            ).map((page) => (
                                                <Link
                                                    key={page}
                                                    href={`/barang?page=${page}`}
                                                    className={cn(
                                                        "relative inline-flex items-center px-4 py-2 border text-sm font-medium",
                                                        page ===
                                                            barangs.current_page
                                                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                                    )}
                                                >
                                                    {page}
                                                </Link>
                                            ))}
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {showModal && selectedBarang && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                                {/* Modal Header */}
                                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Detail Barang
                                    </h3>
                                    <button
                                        onClick={closeModal}
                                        className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                {/* Modal Tabs */}
                                <div className="border-b border-gray-200">
                                    <nav className="flex space-x-8 px-6">
                                        <button
                                            onClick={() => setActiveTab("info")}
                                            className={cn(
                                                "py-4 px-1 border-b-2 font-medium text-sm",
                                                activeTab === "info"
                                                    ? "border-blue-500 text-blue-600"
                                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                            )}
                                        >
                                            Informasi Dasar
                                        </button>
                                        <button
                                            onClick={() => setActiveTab("spec")}
                                            className={cn(
                                                "py-4 px-1 border-b-2 font-medium text-sm",
                                                activeTab === "spec"
                                                    ? "border-blue-500 text-blue-600"
                                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                            )}
                                        >
                                            Spesifikasi
                                        </button>
                                    </nav>
                                </div>

                                {/* Modal Content */}
                                <div className="p-6 overflow-y-auto max-h-[60vh]">
                                    {activeTab === "info" && (
                                        <div className="space-y-6">
                                            {/* Photo */}
                                            {selectedBarang.foto && (
                                                <div className="flex justify-start">
                                                    <img
                                                        src={`/storage/${selectedBarang.foto}`}
                                                        alt={
                                                            selectedBarang.nama
                                                        }
                                                        className="h-48 w-48 rounded-lg object-cover border border-gray-200"
                                                    />
                                                </div>
                                            )}

                                            {/* Basic Information */}
                                            <div className="grid grid-cols-1 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Nama Barang
                                                    </label>
                                                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                                                        {selectedBarang.nama}
                                                    </p>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Deskripsi
                                                    </label>
                                                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg min-h-[80px]">
                                                        {selectedBarang.deskripsi ||
                                                            "Tidak ada deskripsi"}
                                                    </p>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Tanggal Dibuat
                                                        </label>
                                                        <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                                                            {formatDate(
                                                                selectedBarang.created_at
                                                            )}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Tanggal Diperbarui
                                                        </label>
                                                        <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                                                            {formatDate(
                                                                selectedBarang.updated_at
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === "spec" && (
                                        <div className="space-y-4">
                                            {selectedBarang.spesifikasi &&
                                            selectedBarang.spesifikasi.length >
                                                0 ? (
                                                <div className="space-y-3">
                                                    {selectedBarang.spesifikasi.map(
                                                        (spec) => (
                                                            <div
                                                                key={spec.id}
                                                                className="bg-gray-50 p-4 rounded-lg"
                                                            >
                                                                <div className="flex justify-between items-center ">
                                                                    <h4 className="font-medium text-gray-900">
                                                                        {
                                                                            spec.key
                                                                        }
                                                                    </h4>
                                                                    <span className="text-sm font-semibold text-blue-600">
                                                                        {
                                                                            spec.value
                                                                        }
                                                                    </span>
                                                                </div>
                                                                {spec.description && (
                                                                    <p className="text-sm text-gray-600">
                                                                        {
                                                                            spec.description
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="text-center py-8">
                                                    <Package className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                                                    <p className="text-gray-500">
                                                        Tidak ada spesifikasi
                                                        yang tersedia
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
