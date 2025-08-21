import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { Plus, Edit, Trash2, Search, Filter, ChevronDown, ChevronLeft, ChevronRight, Download, MoreHorizontal, UserPlus } from "lucide-react";
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
    // Tab: "" = seluruh, "m" = masuk, "k" = keluar
    const [activeTab, setActiveTab] = useState(filters.jenis || "");

    // Tab filter handler
    const handleTab = (tabJenis: string) => {
        setActiveTab(tabJenis);
        setJenis(tabJenis);
        router.get(
            "/arsip-surat",
            { search, jenis: tabJenis },
            { preserveState: true }
        );
    };

    // Search handler
    const handleSearch = () => {
        router.get(
            "/arsip-surat",
            { search, jenis: activeTab },
            { preserveState: true }
        );
    };

    // Edit handler
    const handleEdit = (id: number) => {
        router.visit(`/arsip-surat/${id}/edit`);
    };

    // Delete handler
    const handleDelete = (id: number) => {
        if (confirm("Apakah Anda yakin ingin menghapus surat ini?")) {
            router.delete(`/arsip-surat/${id}`);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("id-ID");
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto ">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex flex-col gap-2">

                            <h1 className="text-2xl font-bold text-gray-700">Arsip Surat</h1>
                            <h2 className="text-base font-medium text-gray-700">Arsip Surat / Daftar</h2>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                                <Download className="h-4 w-4" />
                                Download CSV
                            </button>
                            <Link
                                href="/arsip-surat/create"
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-gray-800 transition-colors">
                                <Plus className="h-4 w-4" />
                                Tambah Data
                            </Link>
                        </div>
                    </div>

                    {/* Tabs Filter */}
                    <div className="mb-6">
                        <div className="flex border-b border-gray-200">
                            <button
                                onClick={() => handleTab("")}
                                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                            >
                                Seluruh Surat <span className="ml-1 px-2 py-1 text-xs bg-gray-100 rounded-full">{arsipSurat.total}</span>
                            </button>
                            <button
                                onClick={() => handleTab("m")}
                                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "m" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                            >
                                Surat Masuk <span className="ml-1 px-2 py-1 text-xs bg-gray-100 rounded-full">{arsipSurat.data.filter((d) => d.jenis === "m").length}</span>
                            </button>
                            <button
                                onClick={() => handleTab("k")}
                                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "k" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                            >
                                Surat Keluar <span className="ml-1 px-2 py-1 text-xs bg-gray-100 rounded-full">{arsipSurat.data.filter((d) => d.jenis === "k").length}</span>
                            </button>
                        </div>
                    </div>

                    {/* Search and Filter */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search Surat by Judul or Nomor"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                                    <Filter className="h-4 w-4" />
                                    Filter
                                </button>
                                <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                                    Sort
                                    <ChevronDown className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul Surat</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor Surat</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pengirim</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penerima</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Surat</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dibuat Pada</th>
                                        <th className="px-6 py-3 text-left"></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {arsipSurat.data.map((item: ArsipSurat, idx) => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-900">{(arsipSurat.current_page - 1) * arsipSurat.per_page + idx + 1}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{item.judul_surat}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{item.nomor_surat}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{item.jenis === "m" ? "Masuk" : "Keluar"}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{item.pengirim || "-"}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{item.penerima || "-"}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{formatDate(item.tanggal_surat)}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{item.keterangan}</td>
                                            <td className="px-6 py-4 text-sm text-blue-600">
                                                {item.file_path ? (
                                                    <a href={item.file_path} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                                        Lihat File
                                                    </a>
                                                ) : (
                                                    "-"
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{formatDate(item.created_at)}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{formatDate(item.updated_at)}</td>
                                            <td className="px-6 py-4 text-right text-sm font-medium flex gap-2">
                                                <button onClick={() => handleEdit(item.id)} className="text-blue-600 hover:text-blue-900">
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900">
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
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-700">10 per page</span>
                                    <ChevronDown className="h-4 w-4 text-gray-400" />
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-700">1-10 of 44</span>
                                    <div className="flex items-center gap-1">
                                        <button className="p-2 rounded hover:bg-gray-100 disabled:opacity-50" disabled>
                                            <ChevronLeft className="h-4 w-4" />
                                        </button>
                                        <button className="p-2 rounded hover:bg-gray-100">
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

