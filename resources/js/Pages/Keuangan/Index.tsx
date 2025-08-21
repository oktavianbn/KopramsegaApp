import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { Plus, Edit, Trash2, Search, Filter } from "lucide-react";
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
    const [tipe, setTipe] = useState(filters.tipe || "");
    const [jenis_pemasukkan, setJenis_pemasukkan] = useState(filters.jenis_pemasukkan || "");
    const [kategori, setKategori] = useState(filters.kategori || "");

    const handleSearch = () => {
        router.get(
            "/keuangan",
            { search, tipe, jenis_pemasukkan, kategori },
            { preserveState: true }
        );
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

            <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Manajemen Keuangan
                    </h1>
                    <p className="text-gray-600">
                        Kelola data pemasukan dan pengeluaran
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
                                    placeholder="Cari catatan..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <select
                                value={tipe}
                                onChange={(e) => setTipe(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none m-1 focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Semua Tipe</option>
                                <option value="m">Pemasukan</option>
                                <option value="k">Pengeluaran</option>
                            </select>
                            <select
                                value={jenis_pemasukkan}
                                onChange={(e) => setJenis_pemasukkan(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none   m-1 focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Semua Jenis Pemasukkan</option>
                                <option value="k">Kas</option>
                                <option value="u">Usaha Dana</option>
                                <option value="a">Anggaran</option>
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
                            href="/keuangan/create"
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Tambah Data
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
                                        Dibuat Pada
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tipe
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Jenis_pemasukkan
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Jumlah
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Catatan
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {keuangan.data.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        {/* No. */}
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {(keuangan.current_page - 1) * keuangan.per_page + index + 1}
                                        </td>
                                        {/* Dibuat pada */}
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {formatDate(item.created_at)}
                                        </td>
                                        {/* Tipe */}
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${item.tipe === "m"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                                }`}>
                                                {item.tipe === "m" ? "Pemasukan" : "Pengeluaran"}
                                            </span>
                                        </td>
                                        {/* Jenis_pemasukkan */}
                                        <td className="px-6 py-4 text-sm">
                                            {item.jenis_pemasukkan === "a" ? "Anggaran" : item.jenis_pemasukkan === "k" ? "Kas" : item.jenis_pemasukkan === "u" ? "Usaha Dana" : "-"}
                                        </td>
                                        {/* Jumlah */}
                                        <td className="px-6 py-4 text-sm font-medium">
                                            <span className={item.tipe === "m" ? "text-green-600" : "text-red-600"}>
                                                {item.tipe === "m" ?"":"-"}{formatCurrency(item.jumlah)}
                                            </span>
                                        </td>
                                        {/* Catatan */}
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {item.catatan}
                                        </td>
                                        {/* Aksi */}
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Link href={`/keuangan/${item.id}/edit`} className="text-blue-600 hover:text-blue-900">
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                                <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900">
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
                    {keuangan.last_page > 1 && (
                        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                            <div className="flex items-center justify-between">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    {keuangan.current_page > 1 && (
                                        <Link
                                            href={`/keuangan?page=${keuangan.current_page - 1
                                                }`}
                                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                            Previous
                                        </Link>
                                    )}
                                    {keuangan.current_page <
                                        keuangan.last_page && (
                                            <Link
                                                href={`/keuangan?page=${keuangan.current_page + 1
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
                                                {(keuangan.current_page - 1) *
                                                    keuangan.per_page +
                                                    1}
                                            </span>{" "}
                                            to{" "}
                                            <span className="font-medium">
                                                {Math.min(
                                                    keuangan.current_page *
                                                    keuangan.per_page,
                                                    keuangan.total
                                                )}
                                            </span>{" "}
                                            of{" "}
                                            <span className="font-medium">
                                                {keuangan.total}
                                            </span>{" "}
                                            results
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                            {Array.from(
                                                {
                                                    length: keuangan.last_page,
                                                },
                                                (_, i) => i + 1
                                            ).map((page) => (
                                                <Link
                                                    key={page}
                                                    href={`/keuangan?page=${page}`}
                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page ===
                                                        keuangan.current_page
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
