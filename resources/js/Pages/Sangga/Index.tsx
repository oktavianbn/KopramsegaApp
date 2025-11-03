"use client";

import { PageHeader } from "@/Components/ui/page-header";
import Pagination from "@/Components/ui/pagination";
import { SearchToolbar } from "@/Components/ui/search-toolbar";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import {
    Download,
    Edit,
    FileText,
    Plus,
    Presentation,
    Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Sangga {
    id: number;
    nama_sangga: string;
    logo_path: string;
}

interface Props {
    sangga: {
        data: Sangga[];
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

export default function Index({ sangga, filters }: Props) {
    const [search, setSearch] = useState(filters.search || "");
    // Sorting is fixed to nama_sangga; UI for changing sort removed per request
    const [perPage, setPerPage] = useState(sangga.per_page || 10);
    const [activeFilter, setActiveFilter] = useState<string | null>(
        filters.filter || null
    );
    const [sortBy, setSortBy] = useState(filters.sort_by || "created_at");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
        filters.sort_direction || "desc"
    );
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [showDownloadDropdown, setShowDownloadDropdown] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedData, setSelectedData] = useState<Sangga | null>(null);

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
            "/sangga",
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
        if (sortBy === field) {
            const newDir = sortDirection === "asc" ? "desc" : "asc";
            setSortDirection(newDir);
            updateQuery({ sort_by: field, sort_direction: newDir });
        } else {
            setSortBy(field);
            setSortDirection("asc");
            updateQuery({ sort_by: field, sort_direction: "asc" });
        }
    };
    // no client-side sort handler (sorting fixed server-side by nama_sangga)

    /** 🔹 perPage */
    const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = parseInt(e.target.value);
        setPerPage(value);
        updateQuery({ perPage: value, page: 1 });
    };

    /** 🔹 CRUD handlers */
    const handleEdit = (id: number) => router.visit(`/sangga/${id}/edit`);
    const handleDelete = (id: number) =>
        confirm("Apakah Anda yakin ingin menghapus data ini?") &&
        router.delete(`/sangga/${id}`);
    const handleShow = (item: Sangga) => {
        setSelectedData(item);
        setShowModal(true);
    };

    /** 🔹 utils */
    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString("id-ID");

    const clearFilters = () => {
        setSearch("");
        setActiveFilter(null);
        updateQuery({ filter: undefined, page: 1 });
    };

    return (
        <AppLayout>
            <Head title="Sangga" />
            <div className="min-h-screen bg-gray-50 p-6 overflow-hidden">
                <div className="mx-auto">
                    <PageHeader
                        title="Sangga"
                        subtitle="Sangga / Daftar"
                        icon={Presentation}
                        iconClassName="h-5 w-5 text-blue-600"
                        iconBackground="bg-blue-100"
                        actions={[
                            {
                                label: "Download",
                                icon: Download,
                                onClick: () =>
                                    setShowDownloadDropdown(
                                        !showDownloadDropdown
                                    ),
                            },
                            {
                                label: "Tambah Data",
                                icon: Plus,
                                onClick: () => router.visit("/sangga/create"),
                            },
                        ]}
                    />

                    <div className="mt-4">
                        <SearchToolbar
                            searchValue={search}
                            onSearchChange={(val: string) => setSearch(val)}
                            searchPlaceholder="Cari berdasarkan jumlah atau catatan"
                            activeFilters={{
                                search: search,
                                filters: activeFilter
                                    ? [
                                          {
                                              id: activeFilter,
                                              label:
                                                  activeFilter === "with_logo"
                                                      ? "Dengan Logo"
                                                      : "Tanpa Logo",
                                          },
                                      ]
                                    : [],
                            }}
                            onClearFilters={clearFilters}
                            onFilterSelect={(id: string) =>
                                handleTab(id || null)
                            }
                            selectedFilters={activeFilter ? [activeFilter] : []}
                            sortOptions={[
                                { id: "nama_sangga", label: "Nama Sangga" },
                                { id: "created_at", label: "Tanggal Dibuat" },
                            ]}
                            onSortSelect={(field: string) => handleSort(field)}
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
                                        Nama Sangga
                                    </th>
                                    <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                        Logo
                                    </th>
                                    <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 text-center">
                                {sangga.data.map((item: Sangga, idx) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 text-sm text-gray-900 ">
                                            {(sangga.current_page - 1) *
                                                sangga.per_page +
                                                idx +
                                                1}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 ">
                                            {item.nama_sangga}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 ">
                                            {item.logo_path ? (
                                                <img
                                                    src={`/storage/${item.logo_path}`}
                                                    alt="logo"
                                                    className="h-12 w-12 object-cover mx-auto rounded"
                                                />
                                            ) : (
                                                <span className="text-gray-400">
                                                    -
                                                </span>
                                            )}
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
                    <div className="mt-4">
                        <Pagination
                            currentPage={sangga.current_page}
                            lastPage={sangga.last_page}
                            perPage={perPage}
                            total={sangga.total}
                            from={sangga.from}
                            to={sangga.to}
                            onPageChange={(page: number) =>
                                updateQuery({ page })
                            }
                            onPerPageChange={(newPerPage: number) => {
                                setPerPage(newPerPage);
                                updateQuery({ perPage: newPerPage, page: 1 });
                            }}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
