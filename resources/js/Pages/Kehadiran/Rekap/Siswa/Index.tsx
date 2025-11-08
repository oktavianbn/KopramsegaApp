import { PageHeader } from "@/Components/ui/page-header";
import { FilterBar } from "@/Components/ui/filter-bar";
import AppLayout from "@/Layouts/AppLayout";
import { Head, router } from "@inertiajs/react";
import { Users, Search, Download, ChevronDown } from "lucide-react";
import { useState } from "react";

interface Siswa {
    id: number;
    nama: string;
    kelas: string;
    jurusan: string;
    rombel: string | null;
    sangga: string;
    hadir: number;
    izin: number;
    alfa: number;
    persentase: number;
    status: "excellent" | "good" | "fair" | "poor";
}

interface Sangga {
    id: number;
    nama_sangga: string;
}

interface Props {
    siswa: Siswa[];
    sanggas: Sangga[];
    kelas_list: string[];
    filters: {
        bulan: number;
        tahun: number;
        sangga_id?: number;
        kelas?: string;
        search?: string;
    };
    total_pertemuan: number;
}

export default function Index({
    siswa,
    sanggas,
    kelas_list,
    filters,
    total_pertemuan,
}: Props) {
    const [search, setSearch] = useState(filters.search || "");
    const [selectedSangga, setSelectedSangga] = useState(
        filters.sangga_id || ""
    );
    const [selectedKelas, setSelectedKelas] = useState(filters.kelas || "");

    const handleFilter = (
        bulan: number,
        tahun: number,
        sanggaId?: string,
        kelas?: string,
        searchTerm?: string
    ) => {
        const params: any = { bulan, tahun };
        if (sanggaId) params.sangga_id = sanggaId;
        if (kelas) params.kelas = kelas;
        if (searchTerm) params.search = searchTerm;

        router.get("/kehadiran/rekap/siswa", params, { preserveState: true });
    };

    const handleSearch = () => {
        handleFilter(
            filters.bulan,
            filters.tahun,
            selectedSangga.toString(),
            selectedKelas,
            search
        );
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            excellent: (
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                    Sangat Baik
                </span>
            ),
            good: (
                <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                    Baik
                </span>
            ),
            fair: (
                <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded">
                    Cukup
                </span>
            ),
            poor: (
                <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                    Kurang
                </span>
            ),
        };
        return badges[status as keyof typeof badges] || badges.poor;
    };

    const getStatusColor = (persentase: number) => {
        if (persentase >= 90) return "text-green-600";
        if (persentase >= 75) return "text-yellow-600";
        if (persentase >= 60) return "text-orange-600";
        return "text-red-600";
    };

    const monthNames = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
    ];

    return (
        <AppLayout>
            <Head title="Rekap Kehadiran Per Siswa" />
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="mx-auto">
                    <PageHeader
                        title="Rekap Per Siswa"
                        subtitle="Rekap Kehadiran / Per Siswa"
                        icon={Users}
                        backHref="/kehadiran/rekap/dashboard"
                    />

                    {/* Filter */}
                    <FilterBar
                        bulan={filters.bulan}
                        tahun={filters.tahun}
                        onBulanChange={(b) =>
                            handleFilter(
                                b,
                                filters.tahun,
                                selectedSangga.toString(),
                                selectedKelas,
                                search
                            )
                        }
                        onTahunChange={(t) =>
                            handleFilter(
                                filters.bulan,
                                t,
                                selectedSangga.toString(),
                                selectedKelas,
                                search
                            )
                        }
                        extraFilters={
                            <>
                                <div className="flex items-center gap-2">
                                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                                        Sangga:
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={selectedSangga}
                                            onChange={(e) => {
                                                setSelectedSangga(
                                                    e.target.value
                                                );
                                                handleFilter(
                                                    filters.bulan,
                                                    filters.tahun,
                                                    e.target.value,
                                                    selectedKelas,
                                                    search
                                                );
                                            }}
                                            className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                                        >
                                            <option value="">Semua</option>
                                            {sanggas.map((s) => (
                                                <option key={s.id} value={s.id}>
                                                    {s.nama_sangga}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                                        Kelas:
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={selectedKelas}
                                            onChange={(e) => {
                                                setSelectedKelas(
                                                    e.target.value
                                                );
                                                handleFilter(
                                                    filters.bulan,
                                                    filters.tahun,
                                                    selectedSangga.toString(),
                                                    e.target.value,
                                                    search
                                                );
                                            }}
                                            className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                                        >
                                            <option value="">Semua</option>
                                            {kelas_list.map((k) => (
                                                <option key={k} value={k}>
                                                    {k}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(e) =>
                                                setSearch(e.target.value)
                                            }
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    handleSearch();
                                                }
                                            }}
                                            placeholder="Cari nama siswa..."
                                            className="w-64 pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    </div>
                                    <button
                                        onClick={handleSearch}
                                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        Cari
                                    </button>
                                </div>
                            </>
                        }
                    />

                    {/* Summary Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-blue-800">
                            <span className="font-semibold">
                                Total Pertemuan:{" "}
                            </span>
                            {total_pertemuan} pertemuan di bulan{" "}
                            {monthNames[filters.bulan - 1]} {filters.tahun}
                        </p>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Daftar Siswa
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    Total: {siswa.length} siswa
                                </p>
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">
                                <Download className="w-4 h-4" />
                                Export Excel
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            No
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Nama Siswa
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Kelas
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Sangga
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                            Hadir
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                            Izin
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                            Alfa
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                            Kehadiran
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {siswa.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={10}
                                                className="px-6 py-8 text-center text-sm text-gray-500"
                                            >
                                                Tidak ada data siswa
                                            </td>
                                        </tr>
                                    ) : (
                                        siswa.map((item, idx) => (
                                            <tr
                                                key={item.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {idx + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {item.nama}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {item.kelas} {item.jurusan}{" "}
                                                    {item.rombel || ""}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {item.sangga}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <span className="text-sm font-medium text-green-600">
                                                        {item.hadir}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <span className="text-sm font-medium text-yellow-600">
                                                        {item.izin}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <span className="text-sm font-medium text-red-600">
                                                        {item.alfa}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <span
                                                        className={`text-sm font-bold ${getStatusColor(
                                                            item.persentase
                                                        )}`}
                                                    >
                                                        {item.persentase}%
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    {getStatusBadge(
                                                        item.status
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <button
                                                        onClick={() =>
                                                            router.visit(
                                                                `/kehadiran/rekap/siswa/${item.id}?bulan=${filters.bulan}&tahun=${filters.tahun}`
                                                            )
                                                        }
                                                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                                    >
                                                        Detail
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="mt-6 bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">
                            Keterangan Status:
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-500 rounded"></div>
                                <span className="text-sm text-gray-700">
                                    Sangat Baik (≥ 90%)
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                                <span className="text-sm text-gray-700">
                                    Baik (75-89%)
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-orange-500 rounded"></div>
                                <span className="text-sm text-gray-700">
                                    Cukup (60-74%)
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-red-500 rounded"></div>
                                <span className="text-sm text-gray-700">
                                    Kurang (&lt; 60%)
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
