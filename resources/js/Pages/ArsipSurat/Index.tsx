"use client";

import { ModalDetailArsipSurat } from "@/Components/ModalDetailArsipSurat";
import ModalPreviewFile from "@/Components/ModalPrifiewFile";
import { PageHeader } from "@/Components/ui/page-header";
import Pagination from "@/Components/ui/pagination";
import { SearchToolbar } from "@/Components/ui/search-toolbar";
import AppLayout from "@/Layouts/AppLayout";
import { Head, router } from "@inertiajs/react";
import {
    Edit,
    FileText,
    Mail,
    Plus,
    Trash2
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
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
        filters.sort_direction || "desc"
    );
    const [perPage, setPerPage] = useState(arsipSurat.per_page || 10);
    const [activeFilter, setActiveFilter] = useState<string | null>(
        filters.filter || null
    );
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [showDownloadDropdown, setShowDownloadDropdown] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedData, setSelectedData] = useState<ArsipSurat | null>(null);
    const [showPrefiewModal, setShowPrefiewModal] = useState<string | null>(
        null
    );

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
    const handleEdit = (id: number) => router.visit(`/arsip-surat/${id}/edit`);
    const handleDelete = (id: number) =>
        confirm("Apakah Anda yakin ingin menghapus data ini?") &&
        router.delete(`/arsip-surat/${id}`);
    const handleShow = (item: ArsipSurat) => {
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
            <Head title="arsip-surat" />
            <div className="min-h-screen bg-gray-50 p-6 overflow-hidden">
                <div className="mx-auto">
                    <PageHeader
                        title="Surat"
                        subtitle="Arsip / Surat / Daftar"
                        icon={Mail}
                        iconBackground="bg-blue-100"
                        iconClassName="h-5 w-5 text-blue-600"
                        actions={[
                            // keep the create action
                            {
                                label: "Tambah Data",
                                href: "/arsip-surat/create",
                                icon: Plus,
                            },
                        ]}
                        tabs={[
                            {
                                id: "",
                                label: "Seluruh Surat",
                                count: arsipSurat.total,
                            },
                            {
                                id: "m",
                                label: "Surat Masuk",
                                count: arsipSurat.data.filter(
                                    (d) => d.jenis === "m"
                                ).length,
                            },
                            {
                                id: "k",
                                label: "Surat Keluar",
                                count: arsipSurat.data.filter(
                                    (d) => d.jenis === "k"
                                ).length,
                            },
                        ]}
                        activeTab={activeFilter || ""}
                        onTabChange={(tabId) => handleTab(tabId || "")}
                    />
                </div>

                {/* Search & Filters via SearchToolbar */}
                <div className="mb-6">
                    <SearchToolbar
                        searchValue={search}
                        onSearchChange={(v: string) => setSearch(v)}
                        searchPlaceholder="Cari arsip surat..."
                        activeFilters={{
                            search: search || undefined,
                            filters: activeFilter
                                ? [
                                      {
                                          id: activeFilter,
                                          label:
                                              activeFilter === "m"
                                                  ? "Surat Masuk"
                                                  : activeFilter === "k"
                                                  ? "Surat Keluar"
                                                  : activeFilter === "with_file"
                                                  ? "Dengan File"
                                                  : activeFilter ===
                                                    "without_file"
                                                  ? "Tanpa File"
                                                  : activeFilter,
                                      },
                                  ]
                                : [],
                        }}
                        onClearFilters={clearFilters}
                        filterOptions={[
                            { id: "m", label: "Surat Masuk", section: "Jenis" },
                            {
                                id: "k",
                                label: "Surat Keluar",
                                section: "Jenis",
                            },
                            {
                                id: "with_file",
                                label: "Ada File",
                                section: "File",
                            },
                            {
                                id: "without_file",
                                label: "Tidak Ada File",
                                section: "File",
                            },
                        ]}
                        onFilterSelect={(id: string) => handleTab(id)}
                        selectedFilters={activeFilter ? [activeFilter] : []}
                        sortOptions={[
                            { id: "judul_surat", label: "Judul Surat" },
                            { id: "pengirim", label: "Pengirim" },
                            { id: "penerima", label: "Penerima" },
                            { id: "tanggal_surat", label: "Tanggal Surat" },
                        ]}
                        onSortSelect={(field: string) => handleSort(field)}
                        currentSortField={sortBy}
                        sortDirection={sortDirection}
                    />
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
                                        Judul Surat
                                    </th>
                                    <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                        Nomor Surat
                                    </th>
                                    <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                        Jenis Surat
                                    </th>
                                    <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                        Pengirim
                                    </th>
                                    <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                        Penerima
                                    </th>
                                    <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                        Tanggal Surat
                                    </th>
                                    <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                        File
                                    </th>
                                    <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                        Aksi
                                    </th>
                                    <th className="whitespace-nowrap px-6 py-3 text-center"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 text-center">
                                {arsipSurat.data.map(
                                    (item: ArsipSurat, idx) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 font-medium text-sm text-gray-900">
                                                {(arsipSurat.current_page - 1) *
                                                    arsipSurat.per_page +
                                                    idx +
                                                    1}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-sm text-gray-900 max-w-[200px] truncate">
                                                {item.judul_surat}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-sm text-gray-900">
                                                {item.nomor_surat}
                                            </td>
                                            <td
                                                className={`px-6 py-4 font-medium text-sm ${
                                                    item.jenis === "m"
                                                        ? "text-green-600"
                                                        : "text-yellow-600"
                                                }`}
                                            >
                                                {item.jenis === "m"
                                                    ? "Masuk"
                                                    : "Keluar"}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm text-gray-900">
                                                {item.pengirim || "-"}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm text-gray-900">
                                                {item.penerima || "-"}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-sm text-gray-900">
                                                {formatDate(item.tanggal_surat)}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-sm ">
                                                {item.file_path ? (
                                                    <button
                                                        onClick={() =>
                                                            setShowPrefiewModal(
                                                                `/storage/${item.file_path}`
                                                            )
                                                        }
                                                        rel="noopener noreferrer"
                                                        className="hover:underline text-blue-600"
                                                    >
                                                        Lihat File
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-600 italic whitespace-nowrap">
                                                        Tidak Ada File
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-sm flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() =>
                                                        handleShow(item)
                                                    }
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
                                                    title="Edit Surat"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(item.id)
                                                    }
                                                    className="text-red-600 hover:text-red-900"
                                                    title="Hapus Surat"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination component */}
                    {arsipSurat.data.length > 0 && (
                        <div className="mt-6">
                            <Pagination
                                currentPage={arsipSurat.current_page}
                                lastPage={arsipSurat.last_page}
                                perPage={perPage}
                                total={arsipSurat.total}
                                from={arsipSurat.from}
                                to={arsipSurat.to}
                                onPageChange={(p: number) =>
                                    updateQuery({ page: p })
                                }
                                onPerPageChange={(per: number) =>
                                    handlePerPageChange({
                                        target: { value: String(per) },
                                    } as any)
                                }
                                variant="table"
                            />
                        </div>
                    )}
                </div>
            </div>

            {showPrefiewModal && (
                <ModalPreviewFile
                    showPreviewModal={showPrefiewModal}
                    setShowPreviewModal={setShowPrefiewModal}
                    file={showPrefiewModal}
                />
            )}
            {/* Modal Show Data */}
            {showModal && selectedData && (
                <ModalDetailArsipSurat
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    data={selectedData}
                />
            )}
        </AppLayout>
    );
}
