import { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import {
    Plus,
    Edit,
    Trash2,
    Search,
    ExternalLink,
    Download,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
} from "lucide-react";
import AppLayout from "@/Layouts/AppLayout";

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
    };
    filters: {
        search?: string;
    };
}

export default function Index({ dokumentasis, filters }: Props) {
    const [search, setSearch] = useState(filters.search || "");
    const [sortBy, setSortBy] = useState("created_at");
    const [sortDir, setSortDir] = useState("desc");
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [perPage, setPerPage] = useState(dokumentasis.per_page || 10);

    // Search handler
    const handleSearch = () => {
        router.get(
            "/dokumentasi",
            { search, sortBy, sortDir, perPage },
            { preserveState: true }
        );
    };

    // Search on enter
    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    // Sort handler
    const handleSort = (field: string, direction: string) => {
        setSortBy(field);
        setSortDir(direction);
        router.get(
            "/dokumentasi",
            {
                search,
                sortBy: field,
                sortDir: direction,
                page: dokumentasis.current_page,
                perPage,
            },
            { preserveState: true }
        );
    };

    // Per page handler
    const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = parseInt(e.target.value);
        setPerPage(value);
        router.get(
            "/dokumentasi",
            { search, sortBy, sortDir, page: 1, perPage: value },
            { preserveState: true }
        );
    };

    const handleDelete = (id: number) => {
        if (confirm("Apakah Anda yakin ingin menghapus dokumentasi ini?")) {
            router.delete(`/dokumentasi/${id}`);
        }
    };

    const renderLinks = (links: string[]) => {
        if (!links || links.length === 0) {
            return (
                <span className="text-gray-600 italic whitespace-nowrap">
                    Tidak ada link
                </span>
            );
        }

        if (links.length === 1) {
            return (
                <a
                    href={links[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-blue-600"
                >
                    Lihat Link
                </a>
            );
        }

        return (
            <div className="flex flex-col gap-1">
                {links.map((link, index) => (
                    <a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-blue-600"
                    >
                        Lihat Link {index + 1}
                    </a>
                ))}
            </div>
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("id-ID");
    };

    return (
        <AppLayout>
            <Head title="Dokumentasi" />

            <div className="min-h-screen bg-gray-50 p-6">
                <div className="mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-2xl font-bold text-gray-700 whitespace-nowrap">
                                Dokumentasi
                            </h1>
                            <h2 className="text-base font-medium text-gray-700 whitespace-nowrap">
                                Dokumentasi / Daftar
                            </h2>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                                <Download className="h-4 w-4" />
                                Download CSV
                            </button>
                            <Link
                                href="/dokumentasi/create"
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                <Plus className="h-4 w-4" />
                                Tambah Data
                            </Link>
                        </div>
                    </div>

                    {/* Pencarian dan Filter */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                        <div className="md:flex items-center md:justify-between grid gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Cari dokumentasi berdasarkan judul atau kameramen"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={handleSearchKeyDown}
                                    className="pl-10 pr-4 py-2 md:w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="relative">
                                <button
                                    className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                                    onClick={() =>
                                        setShowSortDropdown((prev) => !prev)
                                    }
                                    type="button"
                                >
                                    Urutkan
                                    <ChevronDown className="h-4 w-4" />
                                </button>
                                {showSortDropdown && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                        <button
                                            className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                                                sortBy === "created_at"
                                                    ? "text-blue-600"
                                                    : "text-gray-700"
                                            }`}
                                            onClick={() => {
                                                setShowSortDropdown(false);
                                                handleSort(
                                                    "created_at",
                                                    sortDir === "asc"
                                                        ? "desc"
                                                        : "asc"
                                                );
                                            }}
                                        >
                                            Tanggal Dibuat{" "}
                                            {sortBy === "created_at"
                                                ? sortDir === "asc"
                                                    ? "↑"
                                                    : "↓"
                                                : ""}
                                        </button>
                                        <button
                                            className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                                                sortBy === "judul"
                                                    ? "text-blue-600"
                                                    : "text-gray-700"
                                            }`}
                                            onClick={() => {
                                                setShowSortDropdown(false);
                                                handleSort(
                                                    "judul",
                                                    sortDir === "asc"
                                                        ? "desc"
                                                        : "asc"
                                                );
                                            }}
                                        >
                                            Judul{" "}
                                            {sortBy === "judul"
                                                ? sortDir === "asc"
                                                    ? "↑"
                                                    : "↓"
                                                : ""}
                                        </button>
                                    </div>
                                )}
                            </div>
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
                                            Judul
                                        </th>
                                        <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                            Kameramen
                                        </th>
                                        <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                            Keterangan
                                        </th>
                                        <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                            Link
                                        </th>
                                        <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                            Tanggal
                                        </th>
                                        <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 text-center">
                                    {dokumentasis.data.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="px-6 py-8 text-center text-gray-500"
                                            >
                                                Tidak ada data dokumentasi
                                            </td>
                                        </tr>
                                    ) : (
                                        dokumentasis.data.map(
                                            (dokumentasi, idx) => (
                                                <tr
                                                    key={dokumentasi.id}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="px-6 py-4 font-medium text-sm text-gray-900">
                                                        {(dokumentasis.current_page -
                                                            1) *
                                                            dokumentasis.per_page +
                                                            idx +
                                                            1}
                                                    </td>
                                                    <td className="px-6 py-4 font-medium text-sm text-gray-900 max-w-[200px] truncate">
                                                        {dokumentasi.judul}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 font-medium text-sm text-gray-900">
                                                        {dokumentasi.kameramen ||
                                                            "-"}
                                                    </td>
                                                    <td className="px-6 py-4 font-medium text-sm text-gray-900 max-w-[200px] truncate">
                                                        {dokumentasi.keterangan ||
                                                            "-"}
                                                    </td>
                                                    <td className="px-6 py-4 font-medium text-sm">
                                                        {renderLinks(
                                                            dokumentasi.links
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 font-medium text-sm text-gray-900">
                                                        {formatDate(
                                                            dokumentasi.created_at
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 font-medium text-sm flex items-center justify-center gap-2">
                                                        <Link
                                                            href={`/dokumentasi/${dokumentasi.id}/edit`}
                                                            className="text-blue-600 hover:text-blue-900"
                                                            title="Edit Dokumentasi"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    dokumentasi.id
                                                                )
                                                            }
                                                            className="text-red-600 hover:text-red-900"
                                                            title="Hapus Dokumentasi"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="bg-white px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <select
                                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                                    value={perPage}
                                    onChange={handlePerPageChange}
                                >
                                    <option value={10}>
                                        10 data per halaman
                                    </option>
                                    <option value={20}>
                                        20 data per halaman
                                    </option>
                                    <option value={50}>
                                        50 data per halaman
                                    </option>
                                </select>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-700">
                                    {(dokumentasis.current_page - 1) *
                                        dokumentasis.per_page +
                                        1}
                                    -
                                    {(dokumentasis.current_page - 1) *
                                        dokumentasis.per_page +
                                        dokumentasis.data.length}{" "}
                                    dari {dokumentasis.total}
                                </span>
                                <div className="flex items-center gap-1">
                                    <button
                                        className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
                                        disabled={
                                            dokumentasis.current_page === 1
                                        }
                                        onClick={() =>
                                            router.get(
                                                "/dokumentasi",
                                                {
                                                    search,
                                                    sortBy,
                                                    sortDir,
                                                    page:
                                                        dokumentasis.current_page -
                                                        1,
                                                    perPage,
                                                },
                                                { preserveState: true }
                                            )
                                        }
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>
                                    <button
                                        className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
                                        disabled={
                                            dokumentasis.current_page ===
                                            dokumentasis.last_page
                                        }
                                        onClick={() =>
                                            router.get(
                                                "/dokumentasi",
                                                {
                                                    search,
                                                    sortBy,
                                                    sortDir,
                                                    page:
                                                        dokumentasis.current_page +
                                                        1,
                                                    perPage,
                                                },
                                                { preserveState: true }
                                            )
                                        }
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
