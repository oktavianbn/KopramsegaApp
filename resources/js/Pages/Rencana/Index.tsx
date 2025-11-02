"use client";

import { ModalDetailRencana } from "@/Components/ModalDetailRencana";
import { PageHeader } from "@/Components/ui/page-header";
import Pagination from "@/Components/ui/pagination";
import { SearchToolbar } from "@/Components/ui/search-toolbar";
import AppLayout from "@/Layouts/AppLayout";
import { Head, router } from "@inertiajs/react";
import { Calendar, Download, Edit, FileText, Plus, TimerReset, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Role {
    id: number;
    name: string;
}

interface Rencana {
    id: number;
    nama_rencana: string;
    deskripsi?: string;
    tanggal_mulai: string;
    tanggal_selesai?: string;
    status: "belum_dimulai" | "sedang_dilaksanakan" | "selesai";
    role_id: number;
    role: Role;
    created_at: string;
    updated_at: string;
}

interface Props {
    rencanas: {
        data: Rencana[];
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

export default function Index({ rencanas, filters, roles }: Props) {
    const [search, setSearch] = useState(filters.search || "");
    const [sortBy, setSortBy] = useState(filters.sort_by || "created_at");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
        filters.sort_direction || "desc"
    );
    const [perPage, setPerPage] = useState(rencanas.per_page || 8);
    const [activeFilter, setActiveFilter] = useState<string | null>(
        filters.filter || null
    );
    const [roleFilter, setRoleFilter] = useState(filters.role_id || "");
    const [activeTab, setActiveTab] = useState(filters.status || "");
    const [showModal, setShowModal] = useState(false);
    const [selectedData, setSelectedData] = useState<Rencana | null>(null);
    const [showDownloadDropdown, setShowDownloadDropdown] = useState(false);

    const downloadDropdownRef = useRef<HTMLDivElement>(null);

    const downloadOptions = [
        { label: "Excel", href: "/export/excel" },
        { label: "CSV", href: "/export/excel?format=csv" },
        { label: "PDF", href: "/export/pdf" },
        { label: "Word", href: "/export/word" },
    ];

    const handleStatusUpdate = (id: number, newStatus: string) => {
        router.patch(
            `/rencana/${id}/status`,
            { status: newStatus },
            { preserveState: true }
        );
    };

    const updateQuery = (extra: Record<string, any> = {}) => {
        router.get(
            "/rencana",
            {
                search,
                status: activeTab || undefined,
                sort_by: sortBy,
                sort_direction: sortDirection,
                perPage,
                filter: activeFilter || undefined,
                role_id: roleFilter || undefined,
                ...extra,
            },
            { preserveState: true }
        );
    };

    useEffect(() => {
        const t = setTimeout(() => updateQuery({ page: 1, search }), 500);
        return () => clearTimeout(t);
    }, [search]);

    useEffect(() => {
        const onDoc = (e: MouseEvent) => {
            if (
                downloadDropdownRef.current &&
                !downloadDropdownRef.current.contains(e.target as Node)
            ) {
                setShowDownloadDropdown(false);
            }
        };
        document.addEventListener("mousedown", onDoc);
        return () => document.removeEventListener("mousedown", onDoc);
    }, []);

    const formatDate = (d: string) => new Date(d).toLocaleDateString();

    const handleTab = (tab: string) => {
        setActiveTab(tab);
        updateQuery({ page: 1, status: tab || undefined });
    };

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

    const handlePerPageChange = (val: any) => {
        const v =
            typeof val === "number" ? val : Number(val.target?.value ?? val);
        setPerPage(v);
        updateQuery({ perPage: v });
    };

    const clearFilters = () => {
        setSearch("");
        setRoleFilter("");
        setActiveFilter(null);
        setActiveTab("");
        updateQuery({
            page: 1,
            search: undefined,
            role_id: undefined,
            status: undefined,
            filter: undefined,
        });
    };

    const handleShow = (data: Rencana) => {
        setSelectedData(data);
        setShowModal(true);
    };

    const handleEdit = (id: number) => router.visit(`/rencana/${id}/edit`);

    const handleDelete = (id: number) => {
        if (confirm("Yakin ingin menghapus rencana ini?")) {
            router.delete(`/rencana/${id}`, { preserveState: true });
        }
    };

    const getTotalByStatus = (status: string) =>
        rencanas.data.filter((r) => r.status === status).length;

    return (
        <AppLayout>
            <Head title="Rencana" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <PageHeader
                        title="Rencana"
                        subtitle="Rencana / Daftar"
                        icon={TimerReset}
                        iconClassName="h-5 w-5 text-blue-600"
                        iconBackground="bg-blue-100"
                        tabs={[
                            { id: "", label: "Semua ", count: rencanas.total },
                            {
                                id: "belum_dimulai",
                                label: "Belum Dimulai",
                                count: getTotalByStatus("belum_dimulai"),
                            },
                            {
                                id: "sedang_dilaksanakan",
                                label: "Berlangsung ",
                                count: getTotalByStatus("sedang_dilaksanakan"),
                            },
                            {
                                id: "selesai",
                                label: "Selesai ",
                                count: getTotalByStatus("selesai"),
                            },
                        ]}
                        activeTab={activeTab}
                        onTabChange={(tab: string) => handleTab(tab)}
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
                                label: "Tambah Rencana",
                                icon: Plus,
                                onClick: () => router.visit("/rencana/create"),
                            },
                        ]}
                    />

                    <div className="mt-4">
                        <SearchToolbar
                            searchValue={search}
                            onSearchChange={(val: string) => setSearch(val)}
                            searchPlaceholder="Cari rencana berdasarkan nama atau deskripsi"
                            activeFilters={{
                                search: search,
                                filters: activeTab
                                    ? [{ id: activeTab, label: activeTab }]
                                    : [],
                            }}
                            onClearFilters={clearFilters}
                            filterOptions={[{ id: "", label: "Semua" },
                                { id: "belum_dimulai", label: "Belum Dimulai" },
                                { id: "sedang_dilaksanakan", label: "Berlangsung" },
                                { id: "selesai", label: "Selesai"}
                            ]}
                            onFilterSelect={(id: string) => handleTab(id)}
                            selectedFilters={activeTab ? [activeTab] : []}
                            sortOptions={[
                                { id: "nama_rencana", label: "Nama" },
                                { id: "tanggal_mulai", label: "Tanggal Mulai" },
                                {
                                    id: "tanggal_selesai",
                                    label: "Tanggal Selesai",
                                },
                                { id: "created_at", label: "Dibuat Pada" },
                            ]}
                            onSortSelect={(field: string) => handleSort(field)}
                            currentSortField={sortBy}
                            sortDirection={sortDirection}
                        />
                    </div>

{/* Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 ">
                        {rencanas.data.map((item: Rencana, idx) => (
                            <div
                                key={item.id}
                                className="relative overflow-hidden bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                            >
                                {/* Ribbon Status */}
                                <div className="absolute -top-1 -left-2">
                                    <span
                                        style={{ clipPath: "polygon(0 0, 100% 0, 80% 100%, 0 100%)" }}
                                        className={`
      relative inline-block pl-8 pr-14 py-1 text-xs font-semibold text-white
      ${item.status === "belum_dimulai" ? "bg-gray-500" : ""}
      ${item.status === "sedang_dilaksanakan" ? "bg-blue-500" : ""}
      ${item.status === "selesai" ? "bg-green-500" : ""}
      after:content-[''] after:absolute after:top-0 after:right-0 after:w-2 after:h-full
      after:bg-inherit;
    `}
                                    >
                                        {item.status === "belum_dimulai"
                                            ? "Belum Dimulai"
                                            : item.status === "sedang_dilaksanakan"
                                                ? "Berlangsung"
                                                : "Selesai"}
                                    </span>
                                </div>


                                {/* Card Header */}
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-500">
                                            #{(rencanas.current_page - 1) * rencanas.per_page + idx + 1}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleShow(item)}
                                            className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-50 rounded"
                                        >
                                            <FileText className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleEdit(item.id)}
                                            className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Judul */}
                                <h3 className="mb-2 text-lg font-semibold text-gray-900 w-[200px] truncate">{item.nama_rencana}</h3>

                                {/* Description */}
                                {item.deskripsi && <p className="text-sm text-gray-600 mb-4 line-clamp-2 w-[180px] truncate">{item.deskripsi}</p>}

                                {/* Dates */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm justify-between">
                                        <div className="flex">
                                            <Calendar className="h-4 w-4 text-gray-400" />
                                            <span className="text-gray-600">Mulai:</span>
                                        </div>
                                        <span className="font-medium text-gray-900">{formatDate(item.tanggal_mulai)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm justify-between">
                                        <div className="flex">
                                            <Calendar className="h-4 w-4 text-gray-400" />
                                            <span className="text-gray-600">Selesai:</span>
                                        </div>
                                        <span className="font-medium text-gray-900">{item.tanggal_selesai ? formatDate(item.tanggal_selesai) : "-"}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {/* Role */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Koordinator:</span>
                                            <span className="text-sm font-medium text-gray-900">{item.role.name}</span>
                                        </div>
                                    </div>
                                    {/* Status */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Status:</span>
                                            <div className="flex flex-col gap-2">
                                                <select
                                                    value={item.status}
                                                    onChange={(e) =>
                                                        handleStatusUpdate(
                                                            item.id,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="belum_dimulai">
                                                        Belum Dimulai
                                                    </option>
                                                    <option value="sedang_dilaksanakan">
                                                        Berlangsung
                                                    </option>
                                                    <option value="selesai">
                                                        Selesai
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Footer */}
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500">Dibuat: {formatDate(item.created_at)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>

                    <div className="mt-6">
                        <Pagination
                            currentPage={rencanas.current_page}
                            lastPage={rencanas.last_page}
                            perPage={perPage}
                            total={rencanas.total}
                            from={rencanas.from}
                            to={rencanas.to}
                            onPageChange={(page: number) =>
                                updateQuery({ page })
                            }
                            onPerPageChange={(n: number) => {
                                setPerPage(n);
                                updateQuery({ perPage: n });
                            }}
                            variant="card"
                        />
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && selectedData && (
                <ModalDetailRencana
                    data={selectedData}
                    onClose={() => setShowModal(false)}
                    isOpen={showModal}
                />
            )}
        </AppLayout>
    );
}
