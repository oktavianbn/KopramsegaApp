"use client";

import { ModalDetailArsipSurat } from "@/Components/ModalDetailSiswa";
import { PageHeader } from "@/Components/ui/page-header";
import Pagination from "@/Components/ui/pagination";
import { SearchToolbar } from "@/Components/ui/search-toolbar";
import AppLayout from "@/Layouts/AppLayout";
import { Head, router } from "@inertiajs/react";
import {
    DollarSign,
    Download,
    Edit,
    FileText,
    Plus,
    Trash2
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Sangga {
    id: number;
    nama_sangga: string;
    logo_path: string | null;
}
interface Siswa {
    id: number;
    nis: string;
    nta: string;
    nama: string;
    kelas: string;
    jurusan: string;
    rombel: string;
    jenis_kelamin: string;
    sangga?: Sangga | null;
    created_at: string;
}

interface Props {
    siswa: {
        data: Siswa[];
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

export default function Index({ siswa, filters }: Props) {
    const [search, setSearch] = useState(filters.search || "");
    const [sortBy, setSortBy] = useState(filters.sort_by || "created_at");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
        filters.sort_direction || "desc"
    );
    const [perPage, setPerPage] = useState(siswa.per_page || 10);
    const [activeFilter, setActiveFilter] = useState<string | null>(
        filters.filter || null
    );
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [showDownloadDropdown, setShowDownloadDropdown] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedData, setSelectedData] = useState<Siswa | null>(null);

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
            "/siswa",
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

    const handlePerPageChangeNumber = (n: number) => {
        setPerPage(n);
        updateQuery({ perPage: n, page: 1 });
    };

    /** 🔹 CRUD handlers */
    const handleEdit = (id: number) => router.visit(`/siswa/${id}/edit`);
    const handleDelete = (id: number) =>
        confirm("Apakah Anda yakin ingin menghapus data ini?") &&
        router.delete(`/siswa/${id}`);
    const handleShow = (item: Siswa) => {
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
            <Head title="Siswa" />
            <div className="min-h-screen bg-gray-50 p-6 overflow-hidden">
                <div className="mx-auto">
                    {/* Header */}
                    <PageHeader
                        title="Siswa"
                        subtitle="Siswa / Daftar"
                        icon={DollarSign}
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
                                onClick: () => router.visit("/siswa/create"),
                            },
                        ]}
                    />
                </div>

                {/* Search & Sort */}
                <div className="mt-4">
                    <SearchToolbar
                        searchValue={search}
                        onSearchChange={(val: string) => setSearch(val)}
                        searchPlaceholder="Cari siswa berdasarkan nama atau NIS"
                        activeFilters={{
                            search: search,
                            filters: activeFilter
                                ? [{ id: activeFilter, label: activeFilter }]
                                : [],
                        }}
                        onClearFilters={clearFilters}
                        filterOptions={[{ id: "", label: "Semua" }]}
                        onFilterSelect={(id: string) => handleTab(id)}
                        selectedFilters={activeFilter ? [activeFilter] : []}
                        sortOptions={[
                            { id: "created_at", label: "Dibuat Pada" },
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
                                        Nama
                                    </th>
                                    <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                        Kelas/Jurusan
                                    </th>
                                    <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                        Jenis Kelamin
                                    </th>
                                    <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                        Sangga
                                    </th>
                                    <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 text-center">
                                {siswa.data.map((item: Siswa, idx) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 text-sm text-gray-900 ">
                                            {(siswa.current_page - 1) *
                                                siswa.per_page +
                                                idx +
                                                1}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 ">
                                            {item.nama}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 ">
                                            {item.kelas} {item.jurusan}{" "}
                                            {item.rombel
                                                ? "-" + item.rombel
                                                : ""}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 ">
                                            {item.jenis_kelamin === "l"
                                                ? "Laki-laki"
                                                : "Perempuan"}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 ">
                                            {item.sangga
                                                ? item.sangga.nama_sangga
                                                : "Tidak ada sangga"}
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
                    <div className="bg-white px-4 py-3 border-t border-gray-200">
                        <Pagination
                            currentPage={siswa.current_page}
                            lastPage={siswa.last_page}
                            perPage={perPage}
                            total={siswa.total}
                            from={siswa.from}
                            to={siswa.to}
                            onPageChange={(p: number) =>
                                updateQuery({ page: p })
                            }
                            onPerPageChange={(n: number) =>
                                handlePerPageChangeNumber(n)
                            }
                            variant="table"
                        />
                    </div>
                </div>
            </div>
            {showModal && selectedData && (
                <ModalDetailArsipSurat
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    data={selectedData as any}
                />
            )}
        </AppLayout>
    );
}
