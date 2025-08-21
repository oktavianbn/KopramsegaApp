import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { Plus, Edit, Trash2, Search, Filter } from "lucide-react";
import { Sidebar } from "@/Components/Sidebar";

import { Navbar } from "@/Components/Navbar";
import AppLayout from "@/Layouts/AppLayout";
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
    };
    filters: {
        search?: string;
        jenis?: string;
    };
}

export default function Index({ arsipSurat, filters }: Props) {
    const [search, setSearch] = useState(filters.search || "");
    const [jenis, setJenis] = useState(filters.jenis || "");

    const handleSearch = () => {
        router.get("/arsip-surat", { search, jenis }, { preserveState: true });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("id-ID");
    };

    return (
        <AppLayout>
            <Head title="Arsip Surat" />
            <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Arsip Surat
                    </h1>
                    <p className="text-gray-600">
                        Daftar surat masuk dan keluar
                    </p>
                </div>

                {/* Actions & Filters */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                        <div className="flex flex-col overflow-x-auto md:flex-row gap-4 flex-1">
                            <div className="relative m-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Cari judul/nomor/pengirim/penerima..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <select
                                value={jenis}
                                onChange={(e) => setJenis(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none m-1 focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Semua Jenis</option>
                                <option value="m">Masuk</option>
                                <option value="k">Keluar</option>
                            </select>
                        </div>
                        <button
                            onClick={handleSearch}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <Filter className="h-4 w-4" />
                            Filter
                        </button>
                        <Link
                            href="/arsip-surat/create"
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Tambah Surat
                        </Link>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        No.
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tanggal Surat
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Jenis
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Judul Surat
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nomor Surat
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Pengirim
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Penerima
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Keterangan
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {arsipSurat.data.map((item, index) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {(arsipSurat.current_page - 1) *
                                                arsipSurat.per_page +
                                                index +
                                                1}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {formatDate(item.tanggal_surat)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    item.jenis === "m"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-blue-100 text-blue-800"
                                                }`}
                                            >
                                                {item.jenis === "m"
                                                    ? "Masuk"
                                                    : "Keluar"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {item.judul_surat}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {item.nomor_surat}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {item.pengirim || "-"}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {item.penerima || "-"}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {item.keterangan}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/arsip-surat/${item.id}/edit`}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                                <Link
                                                    href={`/arsip-surat/${item.id}`}
                                                    className="text-gray-600 hover:text-gray-900"
                                                >
                                                    <Search className="h-4 w-4" />
                                                </Link>
                                                <button className="text-red-600 hover:text-red-900">
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
                    {arsipSurat.last_page > 1 && (
                        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                            <div className="flex items-center justify-between">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    {arsipSurat.current_page > 1 && (
                                        <Link
                                            href={`/arsip-surat?page=${
                                                arsipSurat.current_page - 1
                                            }`}
                                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                            Previous
                                        </Link>
                                    )}
                                    {arsipSurat.current_page <
                                        arsipSurat.last_page && (
                                        <Link
                                            href={`/arsip-surat?page=${
                                                arsipSurat.current_page + 1
                                            }`}
                                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                            Next
                                        </Link>
                                    )}
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Showing{" "}
                                            <span className="font-medium">
                                                {(arsipSurat.current_page - 1) *
                                                    arsipSurat.per_page +
                                                    1}
                                            </span>{" "}
                                            to{" "}
                                            <span className="font-medium">
                                                {Math.min(
                                                    arsipSurat.current_page *
                                                        arsipSurat.per_page,
                                                    arsipSurat.total
                                                )}
                                            </span>{" "}
                                            of{" "}
                                            <span className="font-medium">
                                                {arsipSurat.total}
                                            </span>{" "}
                                            results
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                            {Array.from(
                                                {
                                                    length: arsipSurat.last_page,
                                                },
                                                (_, i) => i + 1
                                            ).map((page) => (
                                                <Link
                                                    key={page}
                                                    href={`/arsip-surat?page=${page}`}
                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                        page ===
                                                        arsipSurat.current_page
                                                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                                    }`}
                                                >
                                                    {page}
                                                </Link>
                                            ))}
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
