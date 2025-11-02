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
    Plus,
    Trash2,
    Users
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Role {
    id: number;
    name: string;
}

interface UserType {
    id: number;
    name: string;
    email: string;
    role?: Role | null;
    created_at: string;
    updated_at: string;
    status?: string;
}

interface Props {
    users: {
        data: UserType[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    filters: {
        search?: string;
        status?: string;
        sort_by?: string;
        sort_direction?: "asc" | "desc";
        role_id?: string;
        filter?: string;
    };
    roles: Role[];
}

export default function Index({ users, filters, roles }: Props) {
    const [search, setSearch] = useState(filters.search || "");
    const [status, setStatus] = useState(filters.status || "");
    const [sortBy, setSortBy] = useState(filters.sort_by || "created_at");
    const [sortDirection, setSortDirection] = useState(
        filters.sort_direction || "desc"
    );
    const [roleFilter, setRoleFilter] = useState(filters.role_id || "");
    const [perPage, setPerPage] = useState(users.per_page || 10);
    const [activeTab, setActiveTab] = useState(filters.status || "");
    const [showModal, setShowModal] = useState(false);
    const [selectedData, setSelectedData] = useState<UserType | null>(null);

    const filterDropdownRef = useRef<HTMLDivElement>(null);
    const sortDropdownRef = useRef<HTMLDivElement>(null);

    // live search debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (search !== filters.search) {
                handleFilter();
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [search]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (
                filterDropdownRef.current &&
                !filterDropdownRef.current.contains(target)
            ) {
                // no-op for now
            }
            if (
                sortDropdownRef.current &&
                !sortDropdownRef.current.contains(target)
            ) {
                // no-op for now
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const updateQuery = (extra: Record<string, any> = {}) => {
        router.get(
            "/user",
            {
                search,
                status: activeTab,
                sort_by: sortBy,
                sort_direction: sortDirection,
                role_id: roleFilter,
                perPage,
                ...extra,
            },
            { preserveState: true }
        );
    };

    const handleFilter = () => {
        router.get(
            "/user",
            {
                search,
                status: activeTab,
                sort_by: sortBy,
                sort_direction: sortDirection,
                role_id: roleFilter,
                perPage,
            },
            { preserveState: true }
        );
    };

    const handleTab = (tabStatus: string) => {
        setActiveTab(tabStatus);
        setStatus(tabStatus);
        router.get(
            "/user",
            {
                search,
                status: tabStatus,
                sort_by: sortBy,
                sort_direction: sortDirection,
                role_id: roleFilter,
            },
            { preserveState: true }
        );
    };

    const handleSort = (field: string) => {
        const newDirection =
            sortBy === field && sortDirection === "asc" ? "desc" : "asc";
        setSortBy(field);
        setSortDirection(newDirection);
        router.get(
            "/user",
            {
                search,
                status: activeTab,
                sort_by: field,
                sort_direction: newDirection,
                role_id: roleFilter,
            },
            { preserveState: true }
        );
    };

    const clearFilters = () => {
        setSearch("");
        setRoleFilter("");
        setActiveTab("");
        setStatus("");
        setSortBy("created_at");
        setSortDirection("desc");

        router.get("/user", {}, { preserveState: true });
    };

    const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = parseInt(e.target.value);
        setPerPage(value);
        updateQuery({ perPage: value, page: 1 });
    };

    const handleShow = (item: UserType) => {
        setSelectedData(item);
        setShowModal(true);
    };

    const handleEdit = (id: number) => router.visit(`/user/${id}/edit`);
    const handleDelete = (id: number) =>
        confirm("Apakah Anda yakin ingin menghapus users ini?") &&
        router.delete(`/user/${id}`);

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString("id-ID", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
        });

    return (
        <AppLayout>
            <Head title="Pengguna" />
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="mx-auto">
                    <PageHeader
                        title="Pengguna"
                        subtitle="Daftar Pengguna"
                        icon={Users}
                        actions={[
                            {
                                label: "Download Data",
                                href: "/export/excel",
                                icon: Download,
                            },
                            {
                                label: "Tambah Pengguna",
                                href: "/user/create",
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
                            searchPlaceholder="Cari Pengguna berdasarkan nama atau email"
                            activeFilters={{
                                search: search || undefined,
                                filters: [
                                    ...(roleFilter
                                        ? [
                                              {
                                                  id: roleFilter,
                                                  label:
                                                      roles.find(
                                                          (r) =>
                                                              r.id.toString() ===
                                                              roleFilter
                                                      )?.name || roleFilter,
                                              },
                                          ]
                                        : []),
                                    ...(activeTab
                                        ? [{ id: activeTab, label: activeTab }]
                                        : []),
                                ],
                            }}
                            onClearFilters={clearFilters}
                            filterOptions={roles.map((r) => ({
                                id: r.id.toString(),
                                label: r.name,
                                section: "Role",
                            }))}
                            onFilterSelect={(id) => {
                                setRoleFilter(id);
                                setTimeout(handleFilter, 100);
                            }}
                            selectedFilters={roleFilter ? [roleFilter] : []}
                            sortOptions={[
                                { id: "created_at", label: "Dibuat Pada" },
                            ]}
                            onSortSelect={handleSort}
                            currentSortField={sortBy}
                            sortDirection={sortDirection}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mt-6">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                        No.
                                    </th>
                                    <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                        Nama Pengguna
                                    </th>
                                    <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                        Email
                                    </th>
                                    <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                        Role
                                    </th>
                                    <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                        Dibuat Pada
                                    </th>
                                    <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.data.map((item, idx) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 text-sm text-gray-900 text-center">
                                            {(users.current_page - 1) *
                                                users.per_page +
                                                idx +
                                                1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                                            {item.role?.name ?? "Tidak ada"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                                            {formatDate(item.created_at)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center gap-2 justify-center">
                                                <button
                                                    onClick={() =>
                                                        handleShow(item)
                                                    }
                                                    className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-50 rounded"
                                                    title="Lihat Detail"
                                                >
                                                    <FileText className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleEdit(item.id)
                                                    }
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(item.id)
                                                    }
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <Trash2 className="h-4 w-4" />
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
                        currentPage={users.current_page}
                        lastPage={users.last_page}
                        perPage={perPage}
                        total={users.total}
                        from={users.from}
                        to={users.to}
                        onPageChange={(page) => updateQuery({ page })}
                        onPerPageChange={(p) => {
                            setPerPage(p);
                            updateQuery({ perPage: p, page: 1 });
                        }}
                        variant="table"
                    />
                </div>

                {/* Modal Show Data (left as before if needed) */}
            </div>
        </AppLayout>
    );
}
