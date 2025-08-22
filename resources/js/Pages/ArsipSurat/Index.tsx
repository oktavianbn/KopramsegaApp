import { ShowDataModal } from "@/Components/ShowDataModal";
import AppLayout from "@/Layouts/AppLayout";
import { Link, router } from "@inertiajs/react";
import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Download,
    Edit,
    FileText,
    Filter,
    Plus,
    Search,
    Trash2
} from "lucide-react";
import { useState } from "react";

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
    const [activeTab, setActiveTab] = useState(filters.jenis || "");
    const [sortBy, setSortBy] = useState("tanggal_surat");
    const [sortDir, setSortDir] = useState("desc");
    const [showModal, setShowModal] = useState(false);
    const [selectedSurat, setSelectedSurat] = useState<ArsipSurat | null>(null);
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [perPage, setPerPage] = useState(arsipSurat.per_page || 10);

    // Tab filter handler
    const handleTab = (tabJenis: string) => {
        setActiveTab(tabJenis);
        setJenis(tabJenis);
        router.get(
            "/arsip-surat",
            { search, jenis: tabJenis, sortBy, sortDir, page: 1, perPage },
            { preserveState: true }
        );
    };

    // Search handler
    const handleSearch = () => {
        router.get(
            "/arsip-surat",
            { search, jenis: activeTab, sortBy, sortDir, perPage },
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
            "/arsip-surat",
            { search, jenis: activeTab, sortBy: field, sortDir: direction, page: arsipSurat.current_page, perPage },
            { preserveState: true }
        );
    };

    // Per page handler
    const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = parseInt(e.target.value);
        setPerPage(value);
        router.get(
            "/arsip-surat",
            { search, jenis: activeTab, sortBy, sortDir, page: 1, perPage: value },
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

    // Show handler
    const handleShow = (surat: ArsipSurat) => {
        setSelectedSurat(surat);
        setShowModal(true);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("id-ID");
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="mx-auto">

                    {/* Header */}
                    <div className="flex items-center justify-between ¬¬mb-6">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-2xl font-bold text-gray-700 whitespace-nowrap">Arsip Surat</h1>
                            <h2 className="text-base font-medium text-gray-700 whitespace-nowrap">Arsip Surat / Daftar</h2>
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
                    {/* Tabs */}
                    <div className="flex gap-4 mb-6 border-b">
                        <button
                            onClick={() => handleTab("")}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Seluruh Surat{" "}
                            {/* <span className="ml-1 px-2 py-1 text-xs bg-gray-100 rounded-full">{arsipSurat.total}</span> */}
                        </button>
                        <button
                            onClick={() => handleTab("m")}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "m" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Surat Masuk{" "}
                            {/* <span className="ml-1 px-2 py-1 text-xs bg-gray-100 rounded-full">
                                {arsipSurat.data.filter((d) => d.jenis === "m").length}
                            </span> */}
                        </button>
                        <button
                            onClick={() => handleTab("k")}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "k" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Surat Keluar{" "}
                            {/* <span className="ml-1 px-2 py-1 text-xs bg-gray-100 rounded-full">
                                {arsipSurat.data.filter((d) => d.jenis === "k").length}
                            </span> */}
                        </button>
                    </div>

                    {/* Pencarian dan Filter */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                        <div className="md:flex items-center md:justify-between grid gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Cari surat berdasarkan judul atau nomor surat"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={handleSearchKeyDown}
                                    className="pl-10 pr-4 py-2 md:w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="relative">
                                <button
                                    className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                                    onClick={() => setShowSortDropdown((prev) => !prev)}
                                    type="button"
                                >
                                    Urutkan
                                    <ChevronDown className="h-4 w-4" />
                                </button>
                                {showSortDropdown && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                        <button
                                            className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${sortBy === "tanggal_surat" ? "text-blue-600" : "text-gray-700"
                                                }`}
                                            onClick={() => {
                                                setShowSortDropdown(false);
                                                handleSort("tanggal_surat", sortDir === "asc" ? "desc" : "asc");
                                            }}
                                        >
                                            Tanggal Surat {sortBy === "tanggal_surat" ? (sortDir === "asc" ? "↑" : "↓") : ""}
                                        </button>
                                        <button
                                            className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${sortBy === "nomor_surat" ? "text-blue-600" : "text-gray-700"
                                                }`}
                                            onClick={() => {
                                                setShowSortDropdown(false);
                                                handleSort("nomor_surat", sortDir === "asc" ? "desc" : "asc");
                                            }}
                                        >
                                            Nomor Surat {sortBy === "nomor_surat" ? (sortDir === "asc" ? "↑" : "↓") : ""}
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
                                        <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">No.</th>
                                        <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Judul Surat</th>
                                        <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Nomor Surat</th>
                                        <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Jenis Surat</th>
                                        <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Pengirim</th>
                                        <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Penerima</th>
                                        <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Tanggal Surat</th>
                                        <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">File Surat</th>
                                        <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 text-center">
                                    {arsipSurat.data.map((item: ArsipSurat, idx) => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-sm text-gray-900">
                                                {(arsipSurat.current_page - 1) * arsipSurat.per_page + idx + 1}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-sm text-gray-900 max-w-[200px] truncate">{item.judul_surat}</td>
                                            <td className="px-6 py-4 font-medium text-sm text-gray-900">{item.nomor_surat}</td>
                                            <td
                                                className={`px-6 py-4 font-medium text-sm ${item.jenis === "m" ? "text-green-600" : "text-yellow-600"
                                                    }`}
                                            >
                                                {item.jenis === "m" ? "Surat Masuk" : "Surat Keluar"}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm text-gray-900">{item.pengirim || "-"}</td>
                                            <td className="whitespace-nowrap px-6 py-4 font-medium text-sm text-gray-900">{item.penerima || "-"}</td>
                                            <td className="px-6 py-4 font-medium text-sm text-gray-900">{formatDate(item.tanggal_surat)}</td>
                                            <td className="px-6 py-4 font-medium text-sm ">
                                                {item.file_path ? (
                                                    <a
                                                        href={`storage/${item.file_path}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="hover:underline text-blue-600"
                                                    >
                                                        Lihat File
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-600 italic whitespace-nowrap">Tidak Ada File</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-sm flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleShow(item)}
                                                    className="text-gray-600 hover:text-blue-600"
                                                    title="Lihat Detail"
                                                >
                                                    <FileText className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(item.id)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                    title="Edit Surat"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                    title="Hapus Surat"
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
                        <div className="bg-white px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <select
                                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                                    value={perPage}
                                    onChange={handlePerPageChange}
                                >
                                    <option value={10}>10 data per halaman</option>
                                    <option value={20}>20 data per halaman</option>
                                    <option value={50}>50 data per halaman</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-700">
                                    {(arsipSurat.current_page - 1) * arsipSurat.per_page + 1}-
                                    {(arsipSurat.current_page - 1) * arsipSurat.per_page + arsipSurat.data.length} dari {arsipSurat.total}
                                </span>
                                <div className="flex items-center gap-1">
                                    <button
                                        className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
                                        disabled={arsipSurat.current_page === 1}
                                        onClick={() =>
                                            router.get(
                                                "/arsip-surat",
                                                { search, jenis: activeTab, sortBy, sortDir, page: arsipSurat.current_page - 1, perPage },
                                                { preserveState: true }
                                            )
                                        }
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>
                                    <button
                                        className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
                                        disabled={arsipSurat.current_page === arsipSurat.last_page}
                                        onClick={() =>
                                            router.get(
                                                "/arsip-surat",
                                                { search, jenis: activeTab, sortBy, sortDir, page: arsipSurat.current_page + 1, perPage },
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

            {/* Modal Show Data Surat */}
            {showModal && selectedSurat && (
                <ShowDataModal isOpen={showModal} onClose={() => setShowModal(false)} data={selectedSurat} />
            )}
        </AppLayout>
    );
}
