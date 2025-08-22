import { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import AppLayout from "@/Layouts/AppLayout";

interface Keuangan {
    id: number;
    catatan: string;
    jenis_pemasukkan: "k" | "u" | "a" | "";
    tipe: "m" | "k" | "";
    jumlah: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    keuangan: {
        data: Keuangan[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
        jenis_pemasukkan?: string;
        tipe?: string;
        kategori?: string;
    };
}

export default function Index({ keuangan, filters }: Props) {
    const [search, setSearch] = useState(filters.search || "");
    const [activeTab, setActiveTab] = useState(filters.tipe || "");
    const [jenis_pemasukkan, setJenis_pemasukkan] = useState(
        filters.jenis_pemasukkan || ""
    );
    const [kategori, setKategori] = useState(filters.kategori || "");

    // Debounce search effect
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            router.get(
                "/keuangan",
                {
                    search,
                    tipe: activeTab,
                    jenis_pemasukkan,
                    kategori,
                    page: 1, // Reset ke halaman pertama saat search
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                }
            );
        }, 500); // Delay 500ms

        return () => clearTimeout(delayDebounceFn);
    }, [search]); // Hanya trigger saat search berubah

    // Tab handler
    const handleTab = (tabTipe: string) => {
        setActiveTab(tabTipe);
        router.get(
            "/keuangan",
            { search, tipe: tabTipe, jenis_pemasukkan, kategori },
            { preserveState: true }
        );
    };

    // Live search handler - sekarang tidak diperlukan karena sudah realtime
    const handleSearch = () => {
        router.get(
            "/keuangan",
            { search, tipe: activeTab, jenis_pemasukkan, kategori },
            { preserveState: true }
        );
    };

    // Search on enter - tetap dipertahankan untuk UX yang lebih baik
    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const handleDelete = (id: number) => {
        if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
            router.delete(`/keuangan/${id}`);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("id-ID");
    };

    return (
        <AppLayout>
            <Head title="Keuangan" />
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-2xl font-bold text-gray-700 whitespace-nowrap">
                                Keuangan
                            </h1>
                            <h2 className="text-base font-medium text-gray-700 whitespace-nowrap">
                                Manajemen Keuangan
                            </h2>
                        </div>
                        <Link
                            href="/keuangan/create"
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            Tambah Data
                        </Link>
                    </div>
                    {/* Tabs */}
                    <div className="flex gap-4 mb-6 border-b">
                        <button
                            onClick={() => handleTab("")}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === ""
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Semua
                        </button>
                        <button
                            onClick={() => handleTab("m")}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === "m"
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Pemasukan
                        </button>
                        <button
                            onClick={() => handleTab("k")}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === "k"
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Pengeluaran
                        </button>
                    </div>
                    {/* Pencarian dan Filter */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari catatan keuangan..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={handleSearchKeyDown}
                                className="pl-10 pr-4 py-2 md:w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <select
                            value={jenis_pemasukkan}
                            onChange={(e) => {
                                setJenis_pemasukkan(e.target.value);
                                router.get(
                                    "/keuangan",
                                    {
                                        search,
                                        tipe: activeTab,
                                        jenis_pemasukkan: e.target.value,
                                        kategori,
                                    },
                                    { preserveState: true }
                                );
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Semua Jenis Pemasukkan</option>
                            <option value="k">Kas</option>
                            <option value="u">Usaha Dana</option>
                            <option value="a">Anggaran</option>
                        </select>
                    </div>

                    {/* ...existing code... */}
                    {/* Table dan komponen lainnya tetap sama */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                            No.
                                        </th>
                                        <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                            Dibuat Pada
                                        </th>
                                        <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                            Tipe
                                        </th>
                                        <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                            Jenis Pemasukkan
                                        </th>
                                        <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                            Jumlah
                                        </th>
                                        <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                            Catatan
                                        </th>
                                        <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 text-center">
                                    {keuangan.data.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="px-6 py-4 text-gray-500"
                                            >
                                                Tidak ada data keuangan
                                                ditemukan.
                                            </td>
                                        </tr>
                                    ) : (
                                        keuangan.data.map((item, index) => (
                                            <tr
                                                key={item.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 font-medium text-sm text-gray-900">
                                                    {(keuangan.current_page -
                                                        1) *
                                                        keuangan.per_page +
                                                        index +
                                                        1}
                                                </td>
                                                <td className="px-6 py-4 font-medium text-sm text-gray-900">
                                                    {formatDate(
                                                        item.created_at
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 font-medium text-sm">
                                                    <span
                                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                            item.tipe === "m"
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-red-100 text-red-800"
                                                        }`}
                                                    >
                                                        {item.tipe === "m"
                                                            ? "Pemasukan"
                                                            : "Pengeluaran"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-medium text-sm">
                                                    {item.jenis_pemasukkan ===
                                                    "a"
                                                        ? "Anggaran"
                                                        : item.jenis_pemasukkan ===
                                                          "k"
                                                        ? "Kas"
                                                        : item.jenis_pemasukkan ===
                                                          "u"
                                                        ? "Usaha Dana"
                                                        : "-"}
                                                </td>
                                                <td className="px-6 py-4 font-medium text-sm">
                                                    <span
                                                        className={
                                                            item.tipe === "m"
                                                                ? "text-green-600"
                                                                : "text-red-600"
                                                        }
                                                    >
                                                        {item.tipe === "m"
                                                            ? ""
                                                            : "-"}
                                                        {formatCurrency(
                                                            item.jumlah
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-medium text-sm text-gray-500">
                                                    {item.catatan}
                                                </td>
                                                <td className="px-6 py-4 font-medium text-sm flex items-center justify-center gap-2">
                                                    <Link
                                                        href={`/keuangan/${item.id}/edit`}
                                                        className="text-blue-600 hover:text-blue-900"
                                                        title="Edit"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                item.id
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-900"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {keuangan.last_page > 1 && (
                            <div className="bg-white px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                                <span className="text-sm text-gray-700">
                                    {(keuangan.current_page - 1) *
                                        keuangan.per_page +
                                        1}
                                    -
                                    {(keuangan.current_page - 1) *
                                        keuangan.per_page +
                                        keuangan.data.length}{" "}
                                    dari {keuangan.total}
                                </span>
                                <div className="flex items-center gap-1">
                                    <button
                                        className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
                                        disabled={keuangan.current_page === 1}
                                        onClick={() =>
                                            router.get(
                                                "/keuangan",
                                                {
                                                    search,
                                                    tipe: activeTab,
                                                    jenis_pemasukkan,
                                                    kategori,
                                                    page:
                                                        keuangan.current_page -
                                                        1,
                                                },
                                                { preserveState: true }
                                            )
                                        }
                                    >
                                        <span className="sr-only">
                                            Sebelumnya
                                        </span>
                                        &#8592;
                                    </button>
                                    <button
                                        className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
                                        disabled={
                                            keuangan.current_page ===
                                            keuangan.last_page
                                        }
                                        onClick={() =>
                                            router.get(
                                                "/keuangan",
                                                {
                                                    search,
                                                    tipe: activeTab,
                                                    jenis_pemasukkan,
                                                    kategori,
                                                    page:
                                                        keuangan.current_page +
                                                        1,
                                                },
                                                { preserveState: true }
                                            )
                                        }
                                    >
                                        <span className="sr-only">
                                            Berikutnya
                                        </span>
                                        &#8594;
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
