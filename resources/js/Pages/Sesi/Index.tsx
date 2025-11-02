"use client";

import { PageHeader } from "@/Components/ui/page-header";
import Pagination from "@/Components/ui/pagination";
import { SearchToolbar } from "@/Components/ui/search-toolbar";
import AppLayout from "@/Layouts/AppLayout";
import { Head, router } from "@inertiajs/react";
import {
    Calendar,
    Download,
    Edit,
    FileText,
    Plus,
    TimerReset,
    Trash2
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Sesi {
    id: number;
    nama: string;
    deskripsi?: string;
    ditutup?: boolean;
    tanggal_mulai?: string;
    tanggal_selesai?: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    sesis: {
        data: Sesi[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    filters: {
        search?: string;
        ditutup?: string;
        sort_by?: string;
        sort_direction?: "asc" | "desc";
    };
}

export default function Index({ sesis, filters }: Props) {
    // 🔹 State konsisten dengan Arsip & Dokumentasi
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("created_at");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
        filters.sort_direction || "desc"
    );
    const [perPage, setPerPage] = useState(sesis.per_page || 8);
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState(filters.ditutup ?? "");
    const [showModal, setShowModal] = useState(false);
    const [selectedData, setSelectedData] = useState<Sesi | null>(null);
    const [showDownloadDropdown, setShowDownloadDropdown] = useState(false);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [showSortDropdown, setShowSortDropdown] = useState(false);

    // 🔹 Ref
    const downloadDropdownRef = useRef<HTMLDivElement>(null);
    const filterDropdownRef = useRef<HTMLDivElement>(null);
    const sortDropdownRef = useRef<HTMLDivElement>(null);

    const downloadOptions = [
        { label: "Excel", href: "/export/excel" },
        { label: "CSV", href: "/export/excel?format=csv" },
        { label: "PDF", href: "/export/pdf" },
        { label: "Word", href: "/export/word" },
    ];

    // Update ditutup flag handler (close/open sesi)
    const handleStatusUpdate = (id: number, ditutupValue: string) => {
        // ditutupValue expected to be '0' or '1'
        router.patch(
            `/sesi/${id}/status`,
            { ditutup: ditutupValue },
            { preserveState: true }
        );
    };

    /** 🔹 Update Query */
    const updateQuery = (extra: Record<string, any> = {}) => {
        router.get(
            "/sesi",
            {
                search,
                ditutup: activeTab !== "" ? activeTab : undefined,
                sort_by: sortBy,
                sort_direction: sortDirection,
                perPage,
                ...extra,
            },
            { preserveState: true }
        );
    };

    /** 🔹 Live search debounce */
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (search !== filters.search) updateQuery({ page: 1 });
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [search]);

    /** 🔹 Close dropdown di luar */
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (
                filterDropdownRef.current &&
                !filterDropdownRef.current.contains(target)
            )
                setShowFilterDropdown(false);
            if (
                sortDropdownRef.current &&
                !sortDropdownRef.current.contains(target)
            )
                setShowSortDropdown(false);
            if (
                downloadDropdownRef.current &&
                !downloadDropdownRef.current.contains(target)
            )
                setShowDownloadDropdown(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    /** 🔹 Handler */
    const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = parseInt(e.target.value);
        setPerPage(value);
        updateQuery({ perPage: value, page: 1 });
    };

    const handleSort = (field: string) => {
        const newDirection =
            sortBy === field && sortDirection === "asc" ? "desc" : "asc";
        setSortBy(field);
        setSortDirection(newDirection);
        updateQuery({ sort_by: field, sort_direction: newDirection });
        setShowSortDropdown(false);
    };

    const handleTab = (tab: string) => {
        setActiveTab(tab);
        updateQuery({ ditutup: tab, page: 1 });
    };

    const clearFilters = () => {
        setSearch("");
        setActiveTab("");
        setActiveFilter(null);
        setSortBy("created_at");
        setSortDirection("desc");
        updateQuery({ page: 1 });
    };

    const handleShow = (item: Sesi) => {
        setSelectedData(item);
        setShowModal(true);
    };
    const handleEdit = (id: number) => router.visit(`/sesi/${id}/edit`);
    const handleDelete = (id: number) =>
        confirm("Apakah Anda yakin ingin menghapus sesi ini?") &&
        router.delete(`/sesi/${id}`);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getTotalByStatus = (ditutupValue: string) => {
        if (ditutupValue === "") return sesis.total;
        return sesis.data.filter(
            (item) => String(item.ditutup ? 1 : 0) === ditutupValue
        ).length;
    };

    return (
        <AppLayout>
            <Head title="Sesi" />
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="mx-auto">
                    {/* Page header + search toolbar */}
                    <div className="mb-6">
                        <PageHeader
                            title="Sesi"
                            subtitle="Sesi / Daftar"
                            icon={TimerReset}
                            iconClassName="h-5 w-5 text-blue-600"
                            iconBackground="bg-blue-100"
                            tabs={[
                                { id: "", label: "Semua ",count: sesis.total },
                                {
                                    id: "0",
                                    label: "Terbuka ",count: getTotalByStatus("0"),
                                },
                                {
                                    id: "1",
                                    label: "Ditutup ",count: getTotalByStatus("1"),
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
                                    label: "Tambah Sesi",
                                    icon: Plus,
                                    onClick: () => router.visit("/sesi/create"),
                                },
                            ]}
                        />

                        <div className="mt-4">
                            <SearchToolbar
                                searchValue={search}
                                onSearchChange={(val: string) => setSearch(val)}
                                searchPlaceholder="Cari sesi berdasarkan nama atau deskripsi"
                                activeFilters={{
                                    search: search,
                                    filters: activeTab
                                        ? [
                                              {
                                                  id: activeTab,
                                                  label:
                                                      activeTab === "0"
                                                          ? "Terbuka"
                                                          : "Ditutup",
                                              },
                                          ]
                                        : [],
                                }}
                                onClearFilters={clearFilters}
                                filterOptions={[
                                    { id: "", label: "Semua" },
                                    { id: "0", label: "Terbuka" },
                                    { id: "1", label: "Ditutup" },
                                ]}
                                onFilterSelect={(id: string) => handleTab(id)}
                                selectedFilters={activeTab ? [activeTab] : []}
                                sortOptions={[
                                    { id: "nama", label: "Nama" },
                                    {
                                        id: "tanggal_mulai",
                                        label: "Tanggal Mulai",
                                    },
                                    {
                                        id: "tanggal_selesai",
                                        label: "Tanggal Selesai",
                                    },
                                    { id: "created_at", label: "Dibuat Pada" },
                                ]}
                                onSortSelect={(field: string) =>
                                    handleSort(field)
                                }
                                currentSortField={sortBy}
                                sortDirection={sortDirection}
                            />
                        </div>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 ">
                        {sesis.data.map((item: Sesi, idx: number) => (
                            <div
                                key={item.id}
                                className="relative overflow-hidden bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                            >
                                {/* Ribbon: show open/closed state */}
                                <div className="absolute -top-1 -left-2">
                                    <span
                                        style={{
                                            clipPath:
                                                "polygon(0 0, 100% 0, 80% 100%, 0 100%)",
                                        }}
                                        className={`relative inline-block pl-6 pr-8 py-1 text-xs font-semibold text-white ${
                                            item.ditutup
                                                ? "bg-red-600"
                                                : "bg-green-600"
                                        }`}
                                    >
                                        {item.ditutup ? "Ditutup" : "Terbuka"}
                                    </span>
                                </div>

                                {/* Card Header */}
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-500">
                                            #
                                            {(sesis.current_page - 1) *
                                                sesis.per_page +
                                                idx +
                                                1}
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
                                            onClick={() =>
                                                handleDelete(item.id)
                                            }
                                            className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Judul & Description */}
                                <h3 className="mb-2 text-lg font-semibold text-gray-900 w-[200px] truncate">
                                    {item.nama}
                                </h3>
                                {item.deskripsi && (
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 w-[180px] truncate">
                                        {item.deskripsi}
                                    </p>
                                )}

                                {/* Dates */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm justify-between">
                                        <div className="flex">
                                            <Calendar className="h-4 w-4 text-gray-400" />
                                            <span className="text-gray-600">
                                                Mulai:
                                            </span>
                                        </div>
                                        <span className="font-medium text-gray-900">
                                            {item.tanggal_mulai
                                                ? formatDate(item.tanggal_mulai)
                                                : "-"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm justify-between">
                                        <div className="flex">
                                            <Calendar className="h-4 w-4 text-gray-400" />
                                            <span className="text-gray-600">
                                                Selesai:
                                            </span>
                                        </div>
                                        <span className="font-medium text-gray-900">
                                            {item.tanggal_selesai
                                                ? formatDate(
                                                      item.tanggal_selesai
                                                  )
                                                : "-"}
                                        </span>
                                    </div>
                                </div>

                                {/* Simple action: toggle open/close */}
                                <div className="mb-4">
                                    <button
                                        onClick={() =>
                                            handleStatusUpdate(
                                                item.id,
                                                item.ditutup ? "0" : "1"
                                            )
                                        }
                                        className={`px-3 py-1 text-sm font-medium rounded ${
                                            item.ditutup
                                                ? "bg-green-600 text-white"
                                                : "bg-red-600 text-white"
                                        }`}
                                    >
                                        {item.ditutup
                                            ? "Buka Sesi"
                                            : "Tutup Sesi"}
                                    </button>
                                </div>

                                {/* Card Footer */}
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500">
                                            Dibuat:{" "}
                                            {formatDate(item.created_at)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {sesis.data.length > 0 && (
                        <div className="mt-6">
                            <Pagination
                                currentPage={sesis.current_page}
                                lastPage={sesis.last_page}
                                perPage={perPage}
                                total={sesis.total}
                                from={sesis.from}
                                to={sesis.to}
                                onPageChange={(page: number) =>
                                    updateQuery({ page })
                                }
                                onPerPageChange={(newPerPage: number) => {
                                    setPerPage(newPerPage);
                                    updateQuery({
                                        perPage: newPerPage,
                                        page: 1,
                                    });
                                }}
                                variant="card"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Modal: simple preview */}
            {showModal && selectedData && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">
                                {selectedData.nama}
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-500"
                            >
                                ✕
                            </button>
                        </div>
                        {selectedData.deskripsi && (
                            <p className="text-sm text-gray-700 mb-4">
                                {selectedData.deskripsi}
                            </p>
                        )}
                        <div className="flex justify-end">
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    router.visit(
                                        `/sesi/${selectedData.id}/edit`
                                    );
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
