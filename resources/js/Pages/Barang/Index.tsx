"use client";

import { PageHeader } from "@/Components/ui/page-header";
import Pagination from "@/Components/ui/pagination";
import { SearchToolbar } from "@/Components/ui/search-toolbar";
import AppLayout from "@/Layouts/AppLayout";
import { cn } from "@/lib/utils";
import { Head, router } from "@inertiajs/react";
import {
    ArrowUpDown,
    Download,
    Edit,
    FileText,
    Package,
    Plus,
    Trash2,
    X
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
        filter?: string;
    };
}

export default function Index({ barangs, filters }: Props) {
    const [search, setSearch] = useState(filters.search || "");
    const [showDownloadDropdown, setShowDownloadDropdown] = useState(false);
    const [sortBy, setSortBy] = useState(filters.sort_by || "created_at");
    const [sortDirection, setSortDirection] = useState(
        filters.sort_direction || "desc"
    );
    const [activeFilter, setActiveFilter] = useState<string | null>(
        filters.filter || null
    );
    const [perPage, setPerPage] = useState(barangs.per_page || 10);
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedBarang, setSelectedBarang] = useState<Barang | null>(null);
    const [activeTab, setActiveTab] = useState<"info" | "spec">("info");

    const sortDropdownRef = useRef<HTMLDivElement>(null);
    const downloadDropdownRef = useRef<HTMLDivElement>(null);

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
                updateQuery();
            }
        }, 500); // 500ms delay

        return () => clearTimeout(timeoutId);
    }, [search]);

    const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = parseInt(e.target.value);
        setPerPage(value);
        updateQuery({ perPage: value, page: 1 });
    };

    const handleTab = (tab: string | boolean | null) => {
        // Untuk tab filter, kirim string 'true' atau 'false' agar backend bisa memproses
        let filterValue: string | undefined = undefined;
        if (tab === true) filterValue = "true";
        else if (tab === false) filterValue = "false";
        else if (typeof tab === "string") filterValue = tab;
        setActiveFilter(filterValue || null);
        updateQuery({ filter: filterValue, page: 1 });
    };

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
    const updateQuery = (extra: Record<string, any> = {}) => {
        router.get(
            "/barang",
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
    console.log(activeFilter);

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
        setActiveFilter(null);
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
                    <PageHeader
                        title="Barang"
                        subtitle="Inventory / Barang / Daftar"
                        icon={Package}
                        actions={[
                            {
                                label: "Download Data",
                                href: "/export/excel",
                                icon: Download,
                            },
                            {
                                label: "Tambah Barang",
                                href: "/barang/create",
                                icon: Plus,
                                className:
                                    "bg-blue-500 text-white hover:bg-blue-700",
                            },
                        ]}
                        tabs={[
                            { id: "", label: "Semua", count: barangs.total },
                            {
                                id: "true",
                                label: "Dapat Dipinjam",
                                count: barangs.data.filter(
                                    (d) => d.boleh_dipinjam === true
                                ).length,
                            },
                            {
                                id: "false",
                                label: "Tidak Dapat Dipinjam",
                                count: barangs.data.filter(
                                    (d) => d.boleh_dipinjam === false
                                ).length,
                            },
                        ]}
                        activeTab={activeFilter || ""}
                        onTabChange={(tabId) => handleTab(tabId)}
                    />

                    <div className="mt-4">
                        <SearchToolbar
                            searchValue={search}
                            onSearchChange={(val) => setSearch(val)}
                            searchPlaceholder={"Cari barang..."}
                            activeFilters={{
                                search: search || undefined,
                                filters: activeFilter
                                    ? [
                                          {
                                              id: String(activeFilter),
                                              label:
                                                  activeFilter === "true"
                                                      ? "Dapat Dipinjam"
                                                      : "Tidak Dapat Dipinjam",
                                          },
                                      ]
                                    : [],
                            }}
                            onClearFilters={clearFilters}
                            filterOptions={[
                                {
                                    id: "true",
                                    label: "Dapat Dipinjam",
                                    section: "Status",
                                },
                                {
                                    id: "false",
                                    label: "Tidak Dapat Dipinjam",
                                    section: "Status",
                                },
                            ]}
                            onFilterSelect={(id) => {
                                setActiveFilter(id as any);
                                updateQuery({ filter: id, page: 1 });
                            }}
                            selectedFilters={
                                activeFilter ? [String(activeFilter)] : []
                            }
                            sortOptions={[
                                { id: "nama", label: "Nama" },
                                { id: "created_at", label: "Tanggal Dibuat" },
                            ]}
                            onSortSelect={(id) => handleSort(id)}
                            currentSortField={sortBy}
                            sortDirection={sortDirection as "asc" | "desc"}
                        />
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            No.
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Foto
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Barang
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Deskripsi
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Spesifikasi
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status Peminjaman
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tanggal Dibuat
                                        </th>

                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {barangs.data.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={9}
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
                                        barangs.data.map((barang, idx) => (
                                            <tr
                                                key={barang.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 text-center text-sm text-gray-900 ">
                                                    {(barangs.current_page -
                                                        1) *
                                                        barangs.per_page +
                                                        idx +
                                                        1}
                                                </td>
                                                <td className="px-6 py-4 text-center whitespace-nowrap">
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
                                                <td className="px-6 py-4 text-center whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="ml-4">
                                                            <div className="text-sm text-center font-medium text-gray-900">
                                                                {barang.nama}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="text-sm text-gray-900 max-w-xs truncate">
                                                        {barang.deskripsi ||
                                                            "-"}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="text-sm text-gray-900 max-w-xs truncate">
                                                        {barang.spesifikasi
                                                            ?.length ||
                                                            "-"}{" "}
                                                        Spesifikasi
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center whitespace-nowrap">
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
                                                <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(
                                                        barang.created_at
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-medium">
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
                                                            <FileText className="h-4 w-4" />
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
                        <Pagination
                            currentPage={barangs.current_page}
                            lastPage={barangs.last_page}
                            perPage={perPage}
                            total={barangs.total}
                            from={barangs.from}
                            to={barangs.to}
                            onPageChange={(page) => updateQuery({ page })}
                            onPerPageChange={(p) => {
                                setPerPage(p);
                                updateQuery({ perPage: p, page: 1 });
                            }}
                            variant="table"
                        />
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
