"use client";

import { PageHeader } from "@/Components/ui/page-header";
import Pagination from "@/Components/ui/pagination";
import { SearchToolbar } from "@/Components/ui/search-toolbar";
import AppLayout from "@/Layouts/AppLayout";
import { Head, router } from "@inertiajs/react";
import {
    Download,
    Edit,
    FileText,
    Layers2,
    Plus,
    Trash2
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Role {
    id: number;
    name: string;
    guard_name: string;
}

interface Props {
    role: {
        data: Role[];
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

export default function Index({ role, filters }: Props) {
    const [search, setSearch] = useState(filters.search || "");
    const [sortBy, setSortBy] = useState(filters.sort_by || "created_at");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
        filters.sort_direction || "desc"
    );
    const [perPage, setPerPage] = useState(role.per_page || 10);
    const [activeFilter, setActiveFilter] = useState<string | null>(
        filters.filter || null
    );
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [showDownloadDropdown, setShowDownloadDropdown] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedData, setSelectedData] = useState<Role | null>(null);

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
            "/role",
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
    const handleEdit = (id: number) => router.visit(`/role/${id}/edit`);
    const handleDelete = (id: number) =>
        confirm("Apakah Anda yakin ingin menghapus data ini?") &&
        router.delete(`/role/${id}`);
    const handleShow = (item: Role) => {
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
            <Head title="role" />
            <div className="min-h-screen bg-gray-50 p-6 overflow-hidden">
                <div className="mx-auto">
                    <PageHeader
                        title="Role"
                        subtitle="Daftar Role"
                        icon={Layers2}
                        actions={[
                            {
                                label: "Download",
                                href: "/export/excel",
                                icon: Download,
                            },
                            {
                                label: "Tambah Data",
                                href: "/role/create",
                                icon: Plus,
                                className:
                                    "bg-blue-500 text-white hover:bg-blue-700",
                            },
                        ]}
                    />

                    <div className="mt-4">
                        <SearchToolbar
                            searchValue={search}
                            onSearchChange={(val) => setSearch(val)}
                            searchPlaceholder="Cari berdasarkan nama role"
                            activeFilters={{ search: search || undefined }}
                            onClearFilters={clearFilters}
                            sortOptions={[
                                { id: "name", label: "Nama" },
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
                                        Nama Role
                                    </th>
                                    <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                        Guard Name
                                    </th>
                                    <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 text-center">
                                {role.data.map((item: Role, idx) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 text-sm text-gray-900 ">
                                            {(role.current_page - 1) *
                                                role.per_page +
                                                idx +
                                                1}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 ">
                                            {item.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 ">
                                            {item.guard_name}
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
                        currentPage={role.current_page}
                        lastPage={role.last_page}
                        perPage={perPage}
                        total={role.total}
                        from={role.from}
                        to={role.to}
                        onPageChange={(page) => updateQuery({ page })}
                        onPerPageChange={(p) => {
                            setPerPage(p);
                            updateQuery({ perPage: p, page: 1 });
                        }}
                        variant="table"
                    />
                </div>
            </div>
        </AppLayout>
    );
}
