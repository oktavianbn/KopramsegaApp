"use client";

import StatusUpdateModal from "@/Components/StatusUpdateModal";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import {
    CheckCircle,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Clock,
    Download,
    Edit,
    Eye,
    FileText,
    Filter,
    Package,
    Plus,
    Search,
    SortAsc,
    SortDesc,
    Trash2,
    UserCheck,
    X,
    XCircle
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Pelanggan {
    id: number;
    name: string;
    no_hp: string;
}

interface SesiPenjualan {
    id: number;
    name: string;
    status: boolean;
}

interface DetailItem {
    id: number;
    jumlah: number;
    harga_satuan?: number;
    barang?: { nama?: string } | null;
}

// Transaksi model interface matching transaksi_usdan table
interface Transaksi {
    id: number;
    alamat?: string;
    diantar: boolean;
    tujuan?: string;
    sesi_penjualan_id?: number | null;
    pelanggan?: { id: number; name: string; no_hp?: string } | null;
    status:
    | "verifikasi"
    | "proses"
    | "sudah_siap"
    | "sudah_ambil"
    | "dibatalkan";
    total_harga?: number;
    catatan?: string | null;
    detail?: DetailItem[];
    created_at: string;
    updated_at: string;
}

interface Props {
    transaksi: {
        data: Transaksi[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number | null;
        to: number | null;
    };
    filters: {
        search?: string;
        sort_by?: string;
        sort_direction?: "asc" | "desc";
        filter?: string;
    };
    users: Pelanggan[];
}

export default function Index({ transaksi, filters, users }: Props) {
    // compatibility alias: existing UI code uses `peminjaman` variable names
    // keep `peminjaman` to avoid rewriting every template reference immediately
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const peminjaman = transaksi as any;
    const [search, setSearch] = useState(filters.search || "");
    const [sortBy, setSortBy] = useState(filters.sort_by || "created_at");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
        filters.sort_direction || "desc"
    );
    const [perPage, setPerPage] = useState(transaksi.per_page || 10);
    const [activeFilter, setActiveFilter] = useState<string | null>(
        filters.filter || null
    );
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [showDownloadDropdown, setShowDownloadDropdown] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedPeminjaman, setSelectedPeminjaman] =
        useState<Transaksi | null>(null);

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
            "/transaksi",
            {
                search,
                sort_by: sortBy,
                sort_direction: sortDirection,
                perPage,
                filter: activeFilter || undefined,
                ...extra,
            },
            { preserveState: true }
        );
    };

    // On initial render, avoid polluting the URL with default query parameters.
    // If the current filters are the defaults, replace the history state without adding the querystring.
    useEffect(() => {
        const defaults = {
            search: "",
            sort_by: "created_at",
            sort_direction: "desc",
            perPage: 10,
        };

        const areDefaults =
            (filters.search || "") === defaults.search &&
            (filters.sort_by || "created_at") === defaults.sort_by &&
            (filters.sort_direction || "desc") === defaults.sort_direction &&
            (transaksi.per_page || 10) === defaults.perPage;

        if (areDefaults) {
            // Replace the current history entry with the route without query params
            router.get('/transaksi', {}, { preserveState: true, replace: true });
        }
        // run once on mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // live search debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (search !== filters.search) updateQuery();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [search]);

    // handle sort
    const handleSort = (column: string) => {
        if (sortBy === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setSortDirection("asc");
        }
        setShowSortDropdown(false);
        updateQuery({
            sort_by: column,
            sort_direction:
                sortBy === column
                    ? sortDirection === "asc"
                        ? "desc"
                        : "asc"
                    : "asc",
        });
    };

    // handle filter
    const handleFilter = (filterValue: string | null) => {
        setActiveFilter(filterValue);
        setShowFilterDropdown(false);
        updateQuery({ filter: filterValue });
    };

    // handle per page change
    const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = parseInt(e.target.value);
        setPerPage(value);
        updateQuery({ perPage: value, page: 1 });
    };

    // close dropdowns when clicking outside
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

    const handleTab = (tab: string | null) => {
        setActiveFilter(tab);
        updateQuery({ filter: tab || undefined, page: 1 });
    };

    const clearFilters = () => {
        setSearch("");
        setSortBy("created_at");
        setSortDirection("desc");
        setActiveFilter(null);
        updateQuery({ filter: undefined, page: 1 });
    };

    const getStatusBadge = (status: string, tepatWaktu?: boolean) => {
        const statusConfig: Record<string, { color: string; icon: any; text: string }> = {
            verifikasi: { color: "bg-yellow-100 text-yellow-800", icon: Clock, text: "Verifikasi" },
            proses: { color: "bg-blue-100 text-blue-800", icon: CheckCircle, text: "Proses" },
            sudah_siap: { color: "bg-indigo-100 text-indigo-800", icon: CheckCircle, text: "Sudah Siap" },
            sudah_ambil: { color: "bg-green-100 text-green-800", icon: Package, text: "Sudah Diambil" },
            dibatalkan: { color: "bg-red-100 text-red-800", icon: XCircle, text: "Dibatalkan" },
        };

        const fallback = { color: "bg-gray-100 text-gray-800", icon: Clock, text: "Unknown" };
        const cfg = statusConfig[status] || fallback;
        const IconComponent = cfg.icon || Clock;

        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
                <IconComponent className="w-3 h-3" />
                {cfg.text}
            </span>
        );
    };

    const getJenisBadge = (jenis: string) => {
        return (
            <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${jenis === "pinjam"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-purple-100 text-purple-800"
                    }`}
            >
                {jenis === "pinjam" ? "Pinjam" : "Sewa"}
            </span>
        );
    };
    const getDiantarBadge = (diantar?: boolean) => {
        return (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${diantar ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"}`}>
                {diantar ? "Diantar" : "Ambil"}
            </span>
        );
    };

    const handleDelete = (id: number) => {
        if (confirm("Apakah Anda yakin ingin menghapus data transaksi ini?")) {
            router.delete(`/transaksi/${id}`);
        }
    };

    const openStatusModal = (transaksiData: Transaksi) => {
        setSelectedPeminjaman(transaksiData);
        setShowStatusModal(true);
    };

    return (
        <AppLayout>
            <Head title="Data Transaksi" />

            <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-6 items-center">
                        <div className="p-2 h-max bg-blue-100 rounded-lg flex justify-center items-center">
                            <UserCheck className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h1 className="text-2xl font-bold text-gray-700 whitespace-nowrap">
                                Data Transaksi
                            </h1>
                            <h2 className="text-base font-medium text-gray-700 whitespace-nowrap">
                                Inventory / Transaksi / Daftar
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
                <div className="flex gap-4 mb-6 border-b">
                    <button
                        onClick={() => handleTab("")}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeFilter === ""
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        Seluruh Data{" "}
                        <span className="ml-1 px-2 py-1 text-xs bg-gray-100 ro unded-full">
                            {transaksi.total}
                        </span>
                    </button>
                    <button
                        onClick={() => handleTab("diantar")}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeFilter === "diantar"
                            ? "border-blue-700 text-blue-800"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        Diantar
                        <span className="ml-1 px-2 py-1 text-xs bg-gray-100 rounded-full">
                            {transaksi.data.filter((d: Transaksi) => d.diantar).length}
                        </span>
                    </button>
                    <button
                        onClick={() => handleTab("ambil")}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeFilter === "ambil"
                            ? "border-purple-700 text-purple-800"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        Ambil
                        <span className="ml-1 px-2 py-1 text-xs bg-gray-100 rounded-full">
                            {transaksi.data.filter((d: Transaksi) => !d.diantar).length}
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
                                        {activeFilter === "verifikasi"
                                            ? "Menunggu Verifikasi"
                                            : activeFilter === "proses"
                                                ? "Proses"
                                                : activeFilter === "sudah_siap"
                                                    ? "Sudah Siap"
                                                    : activeFilter === "sudah_ambil"
                                                        ? "Sudah Diambil"
                                                        : activeFilter === "dibatalkan"
                                                            ? "Dibatalkan"
                                                            : activeFilter === "pinjam"
                                                                ? "Peminjaman"
                                                                : activeFilter === "sewa"
                                                                    ? "Sewa"
                                                                    : activeFilter === "terlambat"
                                                                        ? "Terlambat"
                                                                        : "Semua"}
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

                {/* Search and Filters */}
                <div className="bg-white rounded-lg shadow-sm border mb-6">
                    <div className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Cari nama peminjam, alamat, nomor telepon..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        className="pl-10 pr-6 py-2 border md:w-80 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {search && (
                                        <button
                                            onClick={() => setSearch("")}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Sort Dropdown */}
                            <div className="relative" ref={sortDropdownRef}>
                                <button
                                    onClick={() =>
                                        setShowSortDropdown(!showSortDropdown)
                                    }
                                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                                >
                                    {sortDirection === "asc" ? (
                                        <SortAsc className="w-4 h-4" />
                                    ) : (
                                        <SortDesc className="w-4 h-4" />
                                    )}
                                    <span>Urutkan</span>
                                    <ChevronDown className="w-4 h-4" />
                                </button>

                                {showSortDropdown && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                        <div className="py-1">
                                            {[
                                                {
                                                    value: "created_at",
                                                    label: "Tanggal Dibuat",
                                                },
                                                {
                                                    value: "nama",
                                                    label: "Nama",
                                                },
                                                {
                                                    value: "created_at",
                                                    label: "Waktu Dibuat",
                                                },
                                                {
                                                    value: "updated_at",
                                                    label: "Waktu Terakhir",
                                                },
                                                {
                                                    value: "status",
                                                    label: "Status",
                                                },
                                            ].map((sort) => (
                                                <button
                                                    key={sort.value}
                                                    onClick={() =>
                                                        handleSort(sort.value)
                                                    }
                                                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${sortBy === sort.value
                                                        ? "bg-blue-50 text-blue-700"
                                                        : ""
                                                        }`}
                                                >
                                                    {sort.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Filter Dropdown */}
                            <div className="relative" ref={filterDropdownRef}>
                                <button
                                    onClick={() =>
                                        setShowFilterDropdown(
                                            !showFilterDropdown
                                        )
                                    }
                                    className={`flex items-center gap-2 px-4 py-2 border rounded-lg ${activeFilter
                                        ? "border-blue-500 bg-blue-50 text-blue-700"
                                        : "border-gray-200 hover:bg-gray-50"
                                        }`}
                                >
                                    <Filter className="w-4 h-4" />
                                    <span>Filter</span>
                                    <ChevronDown className="w-4 h-4" />
                                </button>

                                {showFilterDropdown && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                        <div className="py-1">
                                            <button
                                                onClick={() =>
                                                    handleFilter(null)
                                                }
                                                className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${!activeFilter
                                                    ? "bg-blue-50 text-blue-700"
                                                    : ""
                                                    }`}
                                            >
                                                Semua Status
                                            </button>
                                            {[
                                                {
                                                    value: "verifikasi",
                                                    label: "Menunggu Verifikasi",
                                                },
                                                {
                                                    value: "proses",
                                                    label: "Proses",
                                                },
                                                {
                                                    value: "sudah_siap",
                                                    label: "Sudah Siap",
                                                },
                                                {
                                                    value: "sudah_ambil",
                                                    label: "Sudah Diambil",
                                                },
                                                {
                                                    value: "dibatalkan",
                                                    label: "Dibatalkan",
                                                },
                                                {
                                                    value: "pinjam",
                                                    label: "Jenis: Pinjam",
                                                },
                                                {
                                                    value: "sewa",
                                                    label: "Jenis: Sewa",
                                                },
                                                {
                                                    value: "terlambat",
                                                    label: "Terlambat",
                                                },
                                            ].map((filter) => (
                                                <button
                                                    key={filter.value}
                                                    onClick={() =>
                                                        handleFilter(
                                                            filter.value
                                                        )
                                                    }
                                                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${activeFilter ===
                                                        filter.value
                                                        ? "bg-blue-50 text-blue-700"
                                                        : ""
                                                        }`}
                                                >
                                                    {filter.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        No.
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Pembeli
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        No Telephone
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Pengiriman
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Pembelian/Total Harga
                                    </th>
                                    <th className="px-6 py-3 text-center  text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {peminjaman.data.map((item: Transaksi, idx: number) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 text-sm text-gray-900 text-center">
                                            {(peminjaman.current_page - 1) *
                                                peminjaman.per_page +
                                                idx +
                                                1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {item.pelanggan?.name || "-"}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {item.pelanggan?.no_hp || "-"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center justify-center">
                                                {getDiantarBadge(item.diantar)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap ">
                                            <div className="flex items-center justify-center">
                                                {getStatusBadge(item.status)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap flex  items-center justify-center">
                                            <div className="justify-start flex-col">
                                                <div className="text-sm text-gray-900">
                                                    {item.detail?.reduce((total: number, detail: DetailItem) => total + (detail.jumlah || 0), 0) || 0} {" "}
                                                    item
                                                </div>
                                                <div className="text-sm text-gray-500 ">
                                                    {item.detail ? item.detail.length : 0} {" "}
                                                    jenis barang
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link
                                                    href={`/transaksi/${item.id}`}
                                                    className="text-blue-600 hover:text-blue-900"
                                                    title="Lihat Detail"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                {item.status !== "sudah_ambil" && item.status !== "dibatalkan" && (
                                                    <button
                                                        onClick={() => openStatusModal(item)}
                                                        className="text-green-600 hover:text-green-900"
                                                        title="Update Status"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="w-4 h-4" />
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
                                {transaksi.from}-{transaksi.to} dari{" "}
                                {transaksi.total}
                            </span>
                            <div className="flex items-center gap-1">
                                <button
                                    className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
                                    disabled={transaksi.current_page === 1}
                                    onClick={() =>
                                        router.get(
                                            "/transaksi",
                                            {
                                                search,
                                                sort_by: sortBy,
                                                sort_direction: sortDirection,
                                                page: transaksi.current_page - 1,
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
                                        transaksi.current_page ===
                                        transaksi.last_page
                                    }
                                    onClick={() =>
                                        router.get(
                                            "/transaksi",
                                            {
                                                search,
                                                sort_by: sortBy,
                                                sort_direction: sortDirection,
                                                page: transaksi.current_page + 1,
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

                {/* Status Update Modal */}
                {showStatusModal && selectedPeminjaman && (
                    <StatusUpdateModal
                        peminjaman={selectedPeminjaman as any}
                        users={users}
                        onClose={() => {
                            setShowStatusModal(false);
                            setSelectedPeminjaman(null);
                        }}
                    />
                )}
            </div>
        </AppLayout>
    );
}
