"use client";

import StatusUpdateModal from "@/Components/StatusUpdateModal";
import { PageHeader } from "@/Components/ui/page-header";
import Pagination from "@/Components/ui/pagination";
import { SearchToolbar } from "@/Components/ui/search-toolbar";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import {
    CheckCircle,
    Clock,
    Download,
    Edit,
    Eye,
    Package,
    Trash2,
    UserCheck,
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
            router.get(
                "/transaksi",
                {},
                { preserveState: true, replace: true }
            );
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

    // numeric per-page handler for shared Pagination component
    const handlePerPageChangeNumber = (n: number) => {
        setPerPage(n);
        updateQuery({ perPage: n, page: 1 });
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
        const statusConfig: Record<
            string,
            { color: string; icon: any; text: string }
        > = {
            verifikasi: {
                color: "bg-yellow-100 text-yellow-800",
                icon: Clock,
                text: "Verifikasi",
            },
            proses: {
                color: "bg-blue-100 text-blue-800",
                icon: CheckCircle,
                text: "Proses",
            },
            sudah_siap: {
                color: "bg-indigo-100 text-indigo-800",
                icon: CheckCircle,
                text: "Sudah Siap",
            },
            sudah_ambil: {
                color: "bg-green-100 text-green-800",
                icon: Package,
                text: "Sudah Diambil",
            },
            dibatalkan: {
                color: "bg-red-100 text-red-800",
                icon: XCircle,
                text: "Dibatalkan",
            },
        };

        const fallback = {
            color: "bg-gray-100 text-gray-800",
            icon: Clock,
            text: "Unknown",
        };
        const cfg = statusConfig[status] || fallback;
        const IconComponent = cfg.icon || Clock;

        return (
            <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${cfg.color}`}
            >
                <IconComponent className="w-3 h-3" />
                {cfg.text}
            </span>
        );
    };

    const getJenisBadge = (jenis: string) => {
        return (
            <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    jenis === "pinjam"
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
            <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    diantar
                        ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800"
                }`}
            >
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
                <div>
                    <PageHeader
                        title="Data Transaksi"
                        subtitle="Inventory / Transaksi / Daftar"
                        icon={UserCheck}
                        iconClassName="h-5 w-5 text-blue-600"
                        iconBackground="bg-blue-100"
                        tabs={[
                            { id: "", label: `Semua `, count: transaksi.total },
                            { id: "diantar", label: `Diantar`, count: transaksi.data.filter((d: Transaksi) => d.diantar).length },
                            { id: "ambil", label: `Ambil`, count: transaksi.data.filter((d: Transaksi) => !d.diantar).length },
                        ]}
                        activeTab={activeFilter || ""}
                        onTabChange={(tabId: string) => handleTab(tabId || null)}
                        actions={[
                            {
                                label: "Download",
                                icon: Download,
                                onClick: () =>
                                    setShowDownloadDropdown(
                                        !showDownloadDropdown
                                    ),
                            },
                        ]}
                    />
                </div>

                {/* Search and Filters */}
                <div className="mt-4">
                    <SearchToolbar
                        searchValue={search}
                        onSearchChange={(val: string) => setSearch(val)}
                        searchPlaceholder="Cari nama peminjam, alamat, nomor telepon..."
                        activeFilters={{
                            search: search,
                            filters: activeFilter
                                ? [{ id: activeFilter, label: activeFilter }]
                                : [],
                        }}
                        onClearFilters={clearFilters}
                        filterOptions={[
                            { id: "", label: "Semua Status" },
                            { id: "verifikasi", label: "Menunggu Verifikasi" },
                            { id: "proses", label: "Proses" },
                            { id: "sudah_siap", label: "Sudah Siap" },
                            { id: "sudah_ambil", label: "Sudah Diambil" },
                            { id: "dibatalkan", label: "Dibatalkan" },
                            { id: "pinjam", label: "Jenis: Pinjam" },
                            { id: "sewa", label: "Jenis: Sewa" },
                            { id: "terlambat", label: "Terlambat" },
                        ]}
                        onFilterSelect={(id: string | number) =>
                            handleFilter(id as string)
                        }
                        selectedFilters={activeFilter ? [activeFilter] : []}
                        sortOptions={[
                            { id: "created_at", label: "Tanggal Dibuat" },
                            { id: "nama", label: "Nama" },
                            { id: "updated_at", label: "Waktu Terakhir" },
                            { id: "status", label: "Status" },
                        ]}
                        onSortSelect={(field: string) => handleSort(field)}
                        currentSortField={sortBy}
                        sortDirection={sortDirection}
                    />
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
                                {peminjaman.data.map(
                                    (item: Transaksi, idx: number) => (
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
                                                        {item.pelanggan?.name ||
                                                            "-"}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {item.pelanggan?.no_hp || "-"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center justify-center">
                                                    {getDiantarBadge(
                                                        item.diantar
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap ">
                                                <div className="flex items-center justify-center">
                                                    {getStatusBadge(
                                                        item.status
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap flex  items-center justify-center">
                                                <div className="justify-start flex-col">
                                                    <div className="text-sm text-gray-900">
                                                        {item.detail?.reduce(
                                                            (
                                                                total: number,
                                                                detail: DetailItem
                                                            ) =>
                                                                total +
                                                                (detail.jumlah ||
                                                                    0),
                                                            0
                                                        ) || 0}{" "}
                                                        item
                                                    </div>
                                                    <div className="text-sm text-gray-500 ">
                                                        {item.detail
                                                            ? item.detail.length
                                                            : 0}{" "}
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
                                                    {item.status !==
                                                        "sudah_ambil" &&
                                                        item.status !==
                                                            "dibatalkan" && (
                                                            <button
                                                                onClick={() =>
                                                                    openStatusModal(
                                                                        item
                                                                    )
                                                                }
                                                                className="text-green-600 hover:text-green-900"
                                                                title="Update Status"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                item.id
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-900"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="bg-white px-4 py-3 border-t border-gray-200">
                        <Pagination
                            currentPage={transaksi.current_page}
                            lastPage={transaksi.last_page}
                            perPage={perPage}
                            total={transaksi.total}
                            from={transaksi.from ?? 0}
                            to={transaksi.to ?? 0}
                            onPageChange={(p: number) =>
                                updateQuery({ page: p })
                            }
                            onPerPageChange={(n: number) =>
                                handlePerPageChangeNumber(n)
                            }
                            variant="table"
                        />
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
