"use client";

import { ModalDetailDokumen } from "@/Components/ModalDetailDokumen";
import { PageHeader } from "@/Components/ui/page-header";
import Pagination from "@/Components/ui/pagination";
import { SearchToolbar } from "@/Components/ui/search-toolbar";
import AppLayout from "@/Layouts/AppLayout";
import { Head, router } from "@inertiajs/react";
import {
    FileCheck,
    FileText,
    Plus,
    Trash2
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Dokumen {
    id: number;
    nama: string;
    tanggal_dokumen: string;
    keterangan?: string;
    created_at?: string;
    updated_at?: string;
}

interface Props {
    dokumen: {
        data: Dokumen[];
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

export default function Index({ dokumen, filters }: Props) {
    const [search, setSearch] = useState(filters.search || "");
    const [sortBy, setSortBy] = useState(filters.sort_by || "created_at");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
        filters.sort_direction || "desc"
    );
    const [perPage, setPerPage] = useState(dokumen.per_page || 10);
    const [activeFilter, setActiveFilter] = useState<string | null>(
        filters.filter || null
    );
    const [showDownloadDropdown, setShowDownloadDropdown] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedData, setSelectedData] = useState<Dokumen | null>(null);

    const downloadDropdownRef = useRef<HTMLDivElement>(null);

    const downloadOptions = [
        { label: "Excel", href: "/export/excel" },
        { label: "CSV", href: "/export/excel?format=csv" },
        { label: "PDF", href: "/export/pdf" },
        { label: "Word", href: "/export/word" },
    ];

    const updateQuery = (extra: Record<string, any> = {}) => {
        router.get(
            "/dokumen",
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

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (search !== filters.search) updateQuery();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [search]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
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

    const handleSort = (field: string) => {
        const newDirection =
            sortBy === field && sortDirection === "asc" ? "desc" : "asc";
        setSortBy(field);
        setSortDirection(newDirection);
        updateQuery({ sort_by: field, sort_direction: newDirection });
    };

    const handlePerPageChange = (per: number) => {
        setPerPage(per);
        updateQuery({ perPage: per, page: 1 });
    };

    const handleEdit = (id: number) => router.visit(`/dokumen/${id}/edit`);
    const handleDelete = (id: number) =>
        confirm("Apakah Anda yakin ingin menghapus data ini?") &&
        router.delete(`/dokumen/${id}`);
    const handleShow = (item: Dokumen) => {
        setSelectedData(item);
        setShowModal(true);
    };

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
            <Head title="Dokumen" />
            <div className="min-h-screen bg-gray-50 p-6 overflow-hidden">
                <div className="mx-auto">
                    <PageHeader
                        title="Dokumen"
                        subtitle="Arsip / Dokumen / Daftar"
                        icon={FileCheck}
                        iconBackground="bg-blue-100"
                        iconClassName="h-5 w-5 text-blue-600"
                        actions={[
                            {
                                label: "Tambah Data",
                                href: "/dokumen/create",
                                icon: Plus,
                            },
                        ]}
                    />

                    <div className="mb-6">
                        <SearchToolbar
                            searchValue={search}
                            onSearchChange={(v: string) => setSearch(v)}
                            searchPlaceholder="Cari dokumen..."
                            activeFilters={{
                                search: search || undefined,
                                filters: activeFilter
                                    ? [
                                          {
                                              id: activeFilter,
                                              label: activeFilter,
                                          },
                                      ]
                                    : [],
                            }}
                            onClearFilters={clearFilters}
                            filterOptions={[]}
                            onFilterSelect={(v: string | null) => handleTab(v)}
                            selectedFilters={activeFilter ? [activeFilter] : []}
                            sortOptions={[]}
                            onSortSelect={(field: string) => handleSort(field)}
                            currentSortField={sortBy}
                            sortDirection={sortDirection}
                        />
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                            No.
                                        </th>
                                        <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                            Nama Dokumen
                                        </th>
                                        <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                            Tanggal Dokumen
                                        </th>
                                        <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                            Keterangan
                                        </th>
                                        <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                            Aksi
                                        </th>
                                        <th className="whitespace-nowrap px-6 py-3 text-center"></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 text-center">
                                    {dokumen.data.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center text-gray-500"
                                            >
                                                Tidak ada data dokumen
                                            </td>
                                        </tr>
                                    ) : (
                                        dokumen.data.map(
                                            (item: Dokumen, idx) => (
                                                <tr
                                                    key={item.id}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="px-6 py-4 font-medium text-sm text-gray-900">
                                                        {(dokumen.current_page -
                                                            1) *
                                                            dokumen.per_page +
                                                            idx +
                                                            1}
                                                    </td>
                                                    <td className="px-6 py-4 font-medium text-sm text-gray-900 max-w-[200px] truncate">
                                                        {item.nama}
                                                    </td>
                                                    <td className="px-6 py-4 font-medium text-sm text-gray-900">
                                                        {formatDate(
                                                            item.tanggal_dokumen
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 font-medium text-sm text-gray-900">
                                                        {item.keterangan || "-"}
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
                                                                handleEdit(
                                                                    item.id
                                                                )
                                                            }
                                                            className="text-blue-600 hover:text-blue-900"
                                                            title="Edit"
                                                        >
                                                            <FileText className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    item.id
                                                                )
                                                            }
                                                            className="text-red-600 hover:text-red-900"
                                                            title="Hapus"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </td>
                                                    <td />
                                                </tr>
                                            )
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {dokumen.data.length > 0 && (
                            <div className="mt-6">
                                <Pagination
                                    currentPage={dokumen.current_page}
                                    lastPage={dokumen.last_page}
                                    perPage={perPage}
                                    total={dokumen.total}
                                    from={dokumen.from}
                                    to={dokumen.to}
                                    onPageChange={(p: number) =>
                                        updateQuery({ page: p })
                                    }
                                    onPerPageChange={(per: number) =>
                                        handlePerPageChange(per)
                                    }
                                    variant="table"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {showModal && selectedData && (
                    <ModalDetailDokumen
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                        data={selectedData as any}
                    />
                )}
            </div>
        </AppLayout>
    );
}
