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
    Plus,
    Trash2,
    UserCheck,
    XCircle
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface DetailPeminjaman {
    id: number;
    jumlah: number;
    jumlah_hilang?: number;
    barang?: {
        id: number;
        nama: string;
    } | null;
    spesifikasi?: {
        id: number;
        key: string;
        value: string;
    } | null;
}

interface User {
    id: number;
    name: string;
}

interface Peminjaman {
    id: number;
    nama_peminjam: string;
    alamat: string;
    no_telp: string;
    asal: string;
    foto_identitas: string;
    jenis: "pinjam" | "sewa";
    waktu_pinjam_mulai: string;
    waktu_pinjam_selesai: string;
    waktu_kembali?: string;
    status:
        | "pending"
        | "disetujui"
        | "sudah_ambil"
        | "sudah_kembali"
        | "dibatalkan";
    tepat_waktu?: boolean;
    foto_barang_diambil: string;
    foto_barang_kembali?: string;
    pemberi_user?: {
        id: number;
        name: string;
    };
    penerima_user?: {
        id: number;
        name: string;
    };
    detail_peminjaman: DetailPeminjaman[];
    created_at: string;
    updated_at: string;
}

interface Props {
    peminjaman: {
        data: Peminjaman[];
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
    users: User[];
}

export default function Index({ peminjaman, filters, users }: Props) {
    const [search, setSearch] = useState(filters.search || "");
    const [sortBy, setSortBy] = useState(filters.sort_by || "created_at");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
        filters.sort_direction || "desc"
    );
    const [perPage, setPerPage] = useState(peminjaman.per_page || 10);
    const [activeFilter, setActiveFilter] = useState<string | null>(
        filters.filter || null
    );
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [showDownloadDropdown, setShowDownloadDropdown] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedPeminjaman, setSelectedPeminjaman] =
        useState<Peminjaman | null>(null);

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
            "/peminjaman",
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
            (peminjaman.per_page || 10) === defaults.perPage;

        if (areDefaults) {
            // Replace the current history entry with the route without query params
            router.get(
                "/peminjaman",
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
        const statusConfig = {
            pending: {
                color: "bg-yellow-100 text-yellow-800",
                icon: Clock,
                text: "Pending",
            },
            disetujui: {
                color: "bg-blue-100 text-blue-800",
                icon: CheckCircle,
                text: "Disetujui",
            },
            sudah_ambil: {
                color: "bg-green-100 text-green-800",
                icon: Package,
                text: "Sudah Diambil",
            },
            sudah_kembali: {
                color:
                    tepatWaktu === false
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800",
                icon: CheckCircle,
                text:
                    tepatWaktu === false
                        ? "Kembali Terlambat"
                        : "Sudah Kembali",
            },
            dibatalkan: {
                color: "bg-red-100 text-red-800",
                icon: XCircle,
                text: "Dibatalkan",
            },
        };

        const config = statusConfig[status as keyof typeof statusConfig];
        const IconComponent = config.icon;

        return (
            <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
            >
                <IconComponent className="w-3 h-3" />
                {config.text}
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

    const handleDelete = (id: number) => {
        if (confirm("Apakah Anda yakin ingin menghapus data peminjaman ini?")) {
            router.delete(`/peminjaman/${id}`);
        }
    };

    const openStatusModal = (peminjamanData: Peminjaman) => {
        setSelectedPeminjaman(peminjamanData);
        setShowStatusModal(true);
    };

    return (
        <AppLayout>
            <Head title="Data Peminjaman" />

            <div className="p-6">
                <PageHeader
                    title="Data Peminjaman"
                    subtitle="Inventory / Peminjaman / Daftar"
                    icon={UserCheck}
                    actions={[
                        {
                            label: "Download Data",
                            href: "/export/excel",
                            icon: Download,
                        },
                        {
                            label: "Tambah Peminjaman",
                            href: "/peminjaman/create",
                            icon: Plus,
                            className:
                                "bg-blue-600 text-white hover:bg-blue-700",
                        },
                    ]}
                    tabs={[
                        {
                            id: "",
                            label: "Seluruh Data",
                            count: peminjaman.total,
                        },
                        {
                            id: "pinjam",
                            label: "Peminjaman",
                            count: peminjaman.data.filter(
                                (d) => d.jenis === "pinjam"
                            ).length,
                        },
                        {
                            id: "sewa",
                            label: "Penyewaan",
                            count: peminjaman.data.filter(
                                (d) => d.jenis === "sewa"
                            ).length,
                        },
                    ]}
                    activeTab={activeFilter || ""}
                    onTabChange={(tabId) => handleTab(tabId || null)}
                />

                <div className="mt-4">
                    <SearchToolbar
                        searchValue={search}
                        onSearchChange={(val) => setSearch(val)}
                        searchPlaceholder={
                            "Cari nama peminjam, alamat, nomor telepon..."
                        }
                        activeFilters={{
                            search: search || undefined,
                            filters: activeFilter
                                ? [
                                      {
                                          id: activeFilter,
                                          label: String(activeFilter),
                                      },
                                  ]
                                : [],
                        }}
                        onClearFilters={clearFilters}
                        filterOptions={[
                            {
                                id: "pending",
                                label: "Pending",
                                section: "Status",
                            },
                            {
                                id: "disetujui",
                                label: "Disetujui",
                                section: "Status",
                            },
                            {
                                id: "sudah_ambil",
                                label: "Sudah Diambil",
                                section: "Status",
                            },
                            {
                                id: "sudah_kembali",
                                label: "Sudah Kembali",
                                section: "Status",
                            },
                            {
                                id: "dibatalkan",
                                label: "Dibatalkan",
                                section: "Status",
                            },
                            {
                                id: "pinjam",
                                label: "Jenis: Pinjam",
                                section: "Jenis",
                            },
                            {
                                id: "sewa",
                                label: "Jenis: Sewa",
                                section: "Jenis",
                            },
                            {
                                id: "terlambat",
                                label: "Terlambat",
                                section: "Status",
                            },
                        ]}
                        onFilterSelect={(id) => handleFilter(id || null)}
                        selectedFilters={activeFilter ? [activeFilter] : []}
                        sortOptions={[
                            { id: "created_at", label: "Tanggal Dibuat" },
                            { id: "nama_peminjam", label: "Nama Peminjam" },
                            { id: "waktu_pinjam_mulai", label: "Waktu Mulai" },
                            {
                                id: "waktu_pinjam_selesai",
                                label: "Waktu Selesai",
                            },
                            { id: "status", label: "Status" },
                        ]}
                        onSortSelect={(id) => handleSort(id)}
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
                                        Peminjam
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Jenis & Status
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Waktu Pinjam
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Admin
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total Barang
                                    </th>
                                    <th className="px-6 py-3 text-center  text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {peminjaman.data.map((item, idx) => (
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
                                                    {item.nama_peminjam}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {item.asal}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {item.no_telp}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className=" gap-2 flex items-center">
                                                {getJenisBadge(item.jenis)}
                                                {getStatusBadge(
                                                    item.status,
                                                    item.tepat_waktu
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                <div>
                                                    {new Date(
                                                        item.waktu_pinjam_mulai
                                                    ).toLocaleDateString(
                                                        "id-ID"
                                                    )}
                                                </div>
                                                <div className="text-gray-500">
                                                    s/d{" "}
                                                    {new Date(
                                                        item.waktu_pinjam_selesai
                                                    ).toLocaleDateString(
                                                        "id-ID"
                                                    )}
                                                </div>
                                                {item.waktu_kembali && (
                                                    <div className="text-blue-600">
                                                        Kembali:{" "}
                                                        {new Date(
                                                            item.waktu_kembali
                                                        ).toLocaleDateString(
                                                            "id-ID"
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {item.pemberi_user && (
                                                    <div>
                                                        Pemberi:{" "}
                                                        {item.pemberi_user.name}
                                                    </div>
                                                )}
                                                {item.penerima_user && (
                                                    <div className="text-gray-500">
                                                        Penerima:{" "}
                                                        {
                                                            item.penerima_user
                                                                .name
                                                        }
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {item.detail_peminjaman.reduce(
                                                    (total, detail) =>
                                                        total + detail.jumlah,
                                                    0
                                                )}{" "}
                                                item
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {item.detail_peminjaman.length}{" "}
                                                jenis barang
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/peminjaman/${item.id}`}
                                                    className="text-blue-600 hover:text-blue-900"
                                                    title="Lihat Detail"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                {item.status !==
                                                    "sudah_kembali" &&
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
                                                        handleDelete(item.id)
                                                    }
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
                    <Pagination
                        currentPage={peminjaman.current_page}
                        lastPage={peminjaman.last_page}
                        perPage={perPage}
                        total={peminjaman.total}
                        from={peminjaman.from}
                        to={peminjaman.to}
                        onPageChange={(page) => updateQuery({ page })}
                        onPerPageChange={(p) => {
                            setPerPage(p);
                            updateQuery({ perPage: p, page: 1 });
                        }}
                        variant="table"
                    />
                </div>

                {/* Status Update Modal */}
                {showStatusModal && selectedPeminjaman && (
                    <StatusUpdateModal
                        peminjaman={selectedPeminjaman}
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
