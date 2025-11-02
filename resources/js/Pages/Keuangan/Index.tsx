"use client";

import { ModalDetailKeuangan } from "@/Components/ModalDetailKeuangan";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    DollarSign,
    Download,
    Edit,
    FileText,
    Filter,
    Plus,
    Search,
    SortAsc,
    SortDesc,
    Trash2,
    X,
} from "lucide-react";
import { PageHeader } from "@/Components/ui/page-header";
import Pagination from "@/Components/ui/pagination";
import { SearchToolbar } from "@/Components/ui/search-toolbar";
import { useEffect, useRef, useState } from "react";

interface Keuangan {
    id: number;
    jumlah: number;
    tipe: "m" | "k";
    jenis_pemasukkan?: "k" | "u" | "a" | null;
    catatan?: string | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    keuangan: {
        data: Keuangan[];
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

export default function Index({ keuangan, filters }: Props) {
    const [search, setSearch] = useState(filters.search || "");
    const [sortBy, setSortBy] = useState(filters.sort_by || "created_at");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
        filters.sort_direction || "desc"
    );
    const [perPage, setPerPage] = useState(keuangan.per_page || 10);
    const [activeFilter, setActiveFilter] = useState<string | null>(
        filters.filter || null
    );
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [showDownloadDropdown, setShowDownloadDropdown] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedData, setSelectedData] = useState<Keuangan | null>(null);

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
            "/keuangan",
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

    // live search debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (search !== filters.search) updateQuery();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [search]);

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

    /** 🔹 tab & filter */
    const handleTab = (tab: string | null) => {
        setActiveFilter(tab);
        updateQuery({ filter: tab || undefined, page: 1 });
    };

    /** 🔹 sorting */
    const handleSort = (field: string) => {
        const newDirection =
            sortBy === field && sortDirection === "asc" ? "desc" : "asc";
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
    const handleEdit = (id: number) => router.visit(`/keuangan/${id}/edit`);
    const handleDelete = (id: number) =>
        confirm("Apakah Anda yakin ingin menghapus data ini?") &&
        router.delete(`/keuangan/${id}`);
    const handleShow = (item: Keuangan) => {
        setSelectedData(item);
        setShowModal(true);
    };

    /** 🔹 utils */
    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString("id-ID");

    const clearFilters = () => {
        setSearch("");
        setSortBy("created_at");
        setSortDirection("desc");
        setActiveFilter(null);
        updateQuery({ filter: undefined, page: 1 });
    };

    return (
        <AppLayout>
            <Head title="Keuangan" />
            <div className="min-h-screen bg-gray-50 p-6 overflow-hidden">
                <div className="mx-auto">
                    <PageHeader
                        title="Keuangan"
                        subtitle="Daftar Keuangan"
                        icon={DollarSign}
                        actions={[
                            {
                                label: "Download Data",
                                href: "/export/excel",
                                icon: Download,
                            },
                            {
                                label: "Tambah Data",
                                href: "/keuangan/create",
                                icon: Plus,
                                className:
                                    "bg-blue-500 text-white hover:bg-blue-700",
                            },
                        ]}
                        tabs={[
                            {
                                id: "",
                                label: "Seluruh Transaksi",
                                count: keuangan.total,
                            },
                            {
                                id: "m",
                                label: "Pemasukkan",
                                count: keuangan.data.filter(
                                    (d) => d.tipe === "m"
                                ).length,
                            },
                            {
                                id: "k",
                                label: "Pengeluaran",
                                count: keuangan.data.filter(
                                    (d) => d.tipe === "k"
                                ).length,
                            },
                        ]}
                        activeTab={activeFilter || ""}
                        onTabChange={(tabId) => handleTab(tabId || "")}
                    />

                    <div className="mt-4">
                        <SearchToolbar
                            searchValue={search}
                            onSearchChange={(val) => setSearch(val)}
                            searchPlaceholder="Cari berdasarkan jumlah atau catatan"
                            activeFilters={{
                                search: search || undefined,
                                filters: activeFilter
                                    ? [
                                          {
                                              id: activeFilter,
                                              label:
                                                  activeFilter === "m"
                                                      ? "Pemasukkan"
                                                      : activeFilter === "k"
                                                      ? "Pengeluaran"
                                                      : activeFilter === "i"
                                                      ? "Kas"
                                                      : activeFilter === "u"
                                                      ? "Usaha Dana"
                                                      : "Anggaran",
                                          },
                                      ]
                                    : [],
                            }}
                            onClearFilters={clearFilters}
                            filterOptions={[
                                {
                                    id: "m",
                                    label: "Pemasukkan",
                                    section: "Tipe",
                                },
                                {
                                    id: "k",
                                    label: "Pengeluaran",
                                    section: "Tipe",
                                },
                                {
                                    id: "i",
                                    label: "Kas",
                                    section: "Jenis Pemasukkan",
                                },
                                {
                                    id: "u",
                                    label: "Usaha Dana",
                                    section: "Jenis Pemasukkan",
                                },
                                {
                                    id: "a",
                                    label: "Anggaran",
                                    section: "Jenis Pemasukkan",
                                },
                            ]}
                            onFilterSelect={(id) => handleTab(id)}
                            selectedFilters={activeFilter ? [activeFilter] : []}
                            sortOptions={[
                                { id: "jumlah", label: "Nominal" },
                                { id: "created_at", label: "Dibuat Pada" },
                            ]}
                            onSortSelect={handleSort}
                            currentSortField={sortBy}
                            sortDirection={sortDirection}
                        />
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
                                        Nominal Uang
                                    </th>
                                    <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                        Tipe
                                    </th>
                                    <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                        Jenis Pemasukkan
                                    </th>
                                    <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                        Catatan
                                    </th>
                                    <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                        Dibuat Pada
                                    </th>
                                    <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 text-center">
                                {keuangan.data.map((item: Keuangan, idx) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 text-sm text-gray-900 ">
                                            {(keuangan.current_page - 1) *
                                                keuangan.per_page +
                                                idx +
                                                1}
                                        </td>
                                        <td
                                            className={`px-6 py-4 text-sm font-medium flex ${
                                                item.tipe === "m"
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                            }`}
                                        >
                                            {item.tipe === "m" ? "" : "- "}
                                            {new Intl.NumberFormat("id-ID", {
                                                style: "currency",
                                                currency: "IDR",
                                                minimumFractionDigits: 2,
                                            }).format(item.jumlah)}
                                        </td>

                                        <td
                                            className={`px-6 py-4 text-sm font-medium ${
                                                item.tipe === "m"
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                            }`}
                                        >
                                            {item.tipe === "m"
                                                ? "Pemasukkan"
                                                : "Pengeluaran"}
                                        </td>
                                        <td
                                            className={`px-6 py-4 text-sm font-medium ${
                                                item.jenis_pemasukkan === "k"
                                                    ? " text-blue-600"
                                                    : item.jenis_pemasukkan ===
                                                      "u"
                                                    ? " text-gray-600"
                                                    : item.jenis_pemasukkan ===
                                                      "a"
                                                    ? " text-yellow-600"
                                                    : " text-neutral-600"
                                            }`}
                                        >
                                            {item.jenis_pemasukkan === "k"
                                                ? "Kas"
                                                : item.jenis_pemasukkan === "u"
                                                ? "Usaha Dana"
                                                : item.jenis_pemasukkan === "a"
                                                ? "Anggaran"
                                                : "-"}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 max-w-[200px] truncate">
                                            {item.catatan || "-"}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {formatDate(item.created_at)}
                                        </td>
                                        <td className="px-6 py-4 text-sm flex justify-center gap-2">
                                            <button
                                                onClick={() => handleShow(item)}
                                                className="text-gray-600 hover:text-blue-600"
                                                title="Lihat Detail"
                                            >
                                                <FileText className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleEdit(item.id)
                                                }
                                                className="text-blue-600 hover:text-blue-900"
                                                title="Edit"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(item.id)
                                                }
                                                className="text-red-600 hover:text-red-900"
                                                title="Hapus"
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
                    <Pagination
                        currentPage={keuangan.current_page}
                        lastPage={keuangan.last_page}
                        perPage={perPage}
                        total={keuangan.total}
                        from={keuangan.from}
                        to={keuangan.to}
                        onPageChange={(page) => updateQuery({ page })}
                        onPerPageChange={(p) => {
                            setPerPage(p);
                            updateQuery({ perPage: p, page: 1 });
                        }}
                        variant="table"
                    />
                </div>
            </div>
            {/* Modal Show Data */}
            {showModal && selectedData && (
                <ModalDetailKeuangan
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    data={selectedData}
                />
            )}
        </AppLayout>
    );
}
