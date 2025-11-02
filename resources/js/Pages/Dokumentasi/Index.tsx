"use client";

import { ModalDetailDokumentasi } from "@/Components/ModalDetailDokumentasi";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import { PageHeader } from "@/Components/ui/page-header";
import { SearchToolbar } from "@/Components/ui/search-toolbar";
import Pagination from "@/Components/ui/pagination";
import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Edit,
    FileText,
    Filter,
    Plus,
    Search,
    SortAsc,
    SortDesc,
    SwitchCamera,
    Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Dokumentasi {
    id: number;
    judul: string;
    links: string[];
    kameramen?: string;
    keterangan?: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    dokumentasis: {
        data: Dokumentasi[];
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
        kameramen?: string;
    };
}

export default function Index({ dokumentasis, filters }: Props) {
    const [search, setSearch] = useState(filters.search || "");
    const [sortBy, setSortBy] = useState(filters.sort_by || "created_at");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortDirection, setSortDirection] = useState(
        filters.sort_direction || "desc"
    );
    const [kameramenFilter, setKameramenFilter] = useState(
        filters.kameramen || ""
    );
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [perPage, setPerPage] = useState(dokumentasis.per_page || 8);
    const [showModal, setShowModal] = useState(false);
    const [selectedData, setSelectedData] = useState<Dokumentasi | null>(null);

    const filterDropdownRef = useRef<HTMLDivElement>(null);
    const sortDropdownRef = useRef<HTMLDivElement>(null);

    /** 🔹 Update Query */
    const updateQuery = (extra: Record<string, any> = {}) => {
        router.get(
            "/dokumentasi",
            {
                search,
                kameramen: kameramenFilter || undefined,
                sort_by: sortBy,
                sort_direction: sortDirection,
                perPage,
                ...extra,
            },
            { preserveState: true }
        );
    };

    const handleShow = (item: Dokumentasi) => {
        setSelectedData(item);
        setShowModal(true);
    };

    /** 🔹 Live search dengan debounce */
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (search !== filters.search) {
                updateQuery({ page: 1 });
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [search]);

    /** 🔹 Close dropdown kalau klik di luar */
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (
                filterDropdownRef.current &&
                !filterDropdownRef.current.contains(target)
            ) {
                setShowFilterDropdown(false);
            }
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

    const clearFilters = () => {
        setSearch("");
        setKameramenFilter("");
        setSortBy("created_at");
        setSortDirection("desc");
        router.get("/dokumentasi", {}, { preserveState: true });
        setShowFilterDropdown(false);
    };

    const handleDelete = (id: number) => {
        if (confirm("Apakah Anda yakin ingin menghapus dokumentasi ini?")) {
            router.delete(`/dokumentasi/${id}`);
        }
    };

    const renderLinks = (links: string[]) => {
        if (!links || links.length === 0)
            return <span className="italic text-gray-500">Tidak ada link</span>;
        if (links.length === 1) {
            return (
                <a
                    href={links[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                >
                    Lihat Link
                </a>
            );
        }
        return (
            <div className="flex flex-col gap-1">
                {links.map((link, i) => (
                    <a
                        key={i}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                    >
                        Link {i + 1}
                    </a>
                ))}
            </div>
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <AppLayout>
            <Head title="Dokumentasi" />
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="mx-auto">
                    <PageHeader
                        title="Dokumentasi"
                        subtitle="Dokumentasi / Daftar"
                        icon={SwitchCamera}
                        iconBackground="bg-blue-100"
                        iconClassName="h-5 w-5 text-blue-600"
                        actions={[
                            {
                                label: "Tambah Dokumentasi",
                                href: "/dokumentasi/create",
                                icon: Plus,
                            },
                        ]}
                    />

                    {/* Search & Filter via SearchToolbar */}
                    <div className="mb-6">
                        <SearchToolbar
                            searchValue={search}
                            onSearchChange={(v: string) => setSearch(v)}
                            searchPlaceholder="Cari dokumentasi berdasarkan judul atau kameramen"
                            activeFilters={{
                                search: search || undefined,
                                filters: kameramenFilter
                                    ? [
                                          {
                                              id: kameramenFilter,
                                              label: kameramenFilter,
                                          },
                                      ]
                                    : [],
                            }}
                            onClearFilters={clearFilters}
                            filterOptions={[]}
                            onFilterSelect={(id: string) => {
                                setKameramenFilter(id);
                                updateQuery({ page: 1 });
                            }}
                            selectedFilters={
                                kameramenFilter ? [kameramenFilter] : []
                            }
                            sortOptions={[
                                { id: "judul", label: "Judul" },
                                { id: "created_at", label: "Tanggal Dibuat" },
                            ]}
                            onSortSelect={(field: string) => handleSort(field)}
                            currentSortField={sortBy}
                            sortDirection={sortDirection as "asc" | "desc"}
                        />
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        {dokumentasis.data.length === 0 ? (
                            <div className="col-span-full bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center text-gray-500">
                                Tidak ada data dokumentasi
                            </div>
                        ) : (
                            dokumentasis.data.map((item, idx) => (
                                <div
                                    key={item.id}
                                    className="relative bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
                                >
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-500">
                                            #
                                            {(dokumentasis.current_page - 1) *
                                                dokumentasis.per_page +
                                                idx +
                                                1}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleShow(item)}
                                                className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-50 rounded"
                                            >
                                                <FileText className="h-4 w-4" />
                                            </button>
                                            <Link
                                                href={`/dokumentasi/${item.id}/edit`}
                                                className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Link>
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
                                    {/* Judul */}
                                    <h3 className="mb-2 text-lg font-semibold text-gray-900 w-[200px] truncate">
                                        {item.judul}
                                    </h3>
                                    {/* Keterangan */}
                                    {item.keterangan && (
                                        <p className="text-sm text-gray-600 mb-2 line-clamp-2 ">
                                            {item.keterangan}
                                        </p>
                                    )}
                                    {/* Kameramen */}
                                    <div className="text-sm text-gray-600 mb-1 flex justify-start">
                                        <span className="font-medium">
                                            Kameramen:
                                        </span>
                                        <span className="font-bold text-black w-[100px] truncate text-end">
                                            {item.kameramen || "-"}
                                        </span>
                                    </div>
                                    {/* Footer */}
                                    <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                                        Dibuat: {formatDate(item.created_at)}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Pagination component */}
                    {dokumentasis.data.length > 0 && (
                        <div className="mt-6">
                            <Pagination
                                currentPage={dokumentasis.current_page}
                                lastPage={dokumentasis.last_page}
                                perPage={perPage}
                                total={dokumentasis.total}
                                from={dokumentasis.from}
                                to={dokumentasis.to}
                                onPageChange={(p: number) =>
                                    updateQuery({ page: p })
                                }
                                onPerPageChange={(per: number) => {
                                    setPerPage(per);
                                    updateQuery({ perPage: per, page: 1 });
                                }}
                                variant="card"
                            />
                        </div>
                    )}
                </div>
            </div>
            {/* Modal Show Data */}
            {showModal && selectedData && (
                <ModalDetailDokumentasi
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    data={selectedData}
                />
            )}
        </AppLayout>
    );
}
