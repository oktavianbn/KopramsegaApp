import { PageHeader } from "@/Components/ui/page-header";
import { FilterBar } from "@/Components/ui/filter-bar";
import AppLayout from "@/Layouts/AppLayout";
import { Head, router } from "@inertiajs/react";
import { Users, Trophy, Download } from "lucide-react";
import { useState } from "react";

interface Sangga {
    id: number;
    nama_sangga: string;
    logo_path: string | null;
    total_anggota: number;
    hadir: number;
    izin: number;
    alfa: number;
    persentase: number;
}

interface Props {
    sanggas: Sangga[];
    bulan: number;
    tahun: number;
    total_pertemuan: number;
}

export default function Index({
    sanggas,
    bulan,
    tahun,
    total_pertemuan,
}: Props) {
    const [selectedBulan, setSelectedBulan] = useState(bulan);
    const [selectedTahun, setSelectedTahun] = useState(tahun);

    const handleFilterChange = (newBulan: number, newTahun: number) => {
        router.get(
            "/kehadiran/rekap/sangga",
            { bulan: newBulan, tahun: newTahun },
            { preserveState: true }
        );
    };

    const getRankIcon = (rank: number) => {
        if (rank === 1) return "🥇";
        if (rank === 2) return "🥈";
        if (rank === 3) return "🥉";
        return rank;
    };

    const getStatusColor = (persentase: number) => {
        if (persentase >= 90) return "text-green-600";
        if (persentase >= 75) return "text-yellow-600";
        if (persentase >= 60) return "text-orange-600";
        return "text-red-600";
    };

    const getStatusBadge = (persentase: number) => {
        if (persentase >= 90)
            return (
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                    Sangat Baik
                </span>
            );
        if (persentase >= 75)
            return (
                <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                    Baik
                </span>
            );
        if (persentase >= 60)
            return (
                <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded">
                    Cukup
                </span>
            );
        return (
            <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                Kurang
            </span>
        );
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
            <Head title="Rekap Kehadiran Per Sangga" />
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="mx-auto">
                    <PageHeader
                        title="Rekap Per Sangga"
                        subtitle="Rekap Kehadiran / Per Sangga"
                        icon={Users}
                        backHref="/kehadiran/rekap/dashboard"
                    />

                    {/* Filter */}
                    <FilterBar
                        bulan={selectedBulan}
                        tahun={selectedTahun}
                        onBulanChange={(b) => {
                            setSelectedBulan(b);
                            handleFilterChange(b, selectedTahun);
                        }}
                        onTahunChange={(t) => {
                            setSelectedTahun(t);
                            handleFilterChange(selectedBulan, t);
                        }}
                    />

                    {/* Summary Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-blue-800">
                            <span className="font-semibold">
                                Total Pertemuan:{" "}
                            </span>
                            {total_pertemuan} pertemuan di bulan{" "}
                            {monthNames[bulan - 1]} {tahun}
                        </p>
                    </div>

                    {/* Podium - Top 3 */}
                    {sanggas.length >= 3 && (
                        <div className="mb-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200 shadow-sm p-8">
                            <div className="flex items-center justify-center gap-2 mb-6">
                                <Trophy className="w-6 h-6 text-yellow-600" />
                                <h3 className="text-xl font-bold text-gray-900">
                                    Top 3 Sangga Terbaik
                                </h3>
                            </div>
                            <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
                                {/* Rank 2 */}
                                <div className="flex flex-col items-center order-1">
                                    <div className="bg-gray-200 rounded-lg p-4 w-full text-center mb-2">
                                        <div className="text-4xl mb-2">🥈</div>
                                        <h4 className="font-bold text-gray-900 mb-1">
                                            {sanggas[1].nama_sangga}
                                        </h4>
                                        <p
                                            className={`text-2xl font-bold ${getStatusColor(
                                                sanggas[1].persentase
                                            )}`}
                                        >
                                            {sanggas[1].persentase}%
                                        </p>
                                        <p className="text-xs text-gray-600 mt-1">
                                            {sanggas[1].total_anggota} anggota
                                        </p>
                                    </div>
                                    <div className="h-24 bg-gray-300 w-full rounded-t-lg flex items-center justify-center">
                                        <span className="text-2xl font-bold text-gray-700">
                                            #2
                                        </span>
                                    </div>
                                </div>

                                {/* Rank 1 */}
                                <div className="flex flex-col items-center order-2">
                                    <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-4 w-full text-center mb-2">
                                        <div className="text-5xl mb-2">🥇</div>
                                        <h4 className="font-bold text-gray-900 mb-1">
                                            {sanggas[0].nama_sangga}
                                        </h4>
                                        <p
                                            className={`text-3xl font-bold ${getStatusColor(
                                                sanggas[0].persentase
                                            )}`}
                                        >
                                            {sanggas[0].persentase}%
                                        </p>
                                        <p className="text-xs text-gray-600 mt-1">
                                            {sanggas[0].total_anggota} anggota
                                        </p>
                                    </div>
                                    <div className="h-32 bg-yellow-400 w-full rounded-t-lg flex items-center justify-center">
                                        <span className="text-3xl font-bold text-yellow-900">
                                            #1
                                        </span>
                                    </div>
                                </div>

                                {/* Rank 3 */}
                                <div className="flex flex-col items-center order-3">
                                    <div className="bg-orange-100 rounded-lg p-4 w-full text-center mb-2">
                                        <div className="text-4xl mb-2">🥉</div>
                                        <h4 className="font-bold text-gray-900 mb-1">
                                            {sanggas[2].nama_sangga}
                                        </h4>
                                        <p
                                            className={`text-2xl font-bold ${getStatusColor(
                                                sanggas[2].persentase
                                            )}`}
                                        >
                                            {sanggas[2].persentase}%
                                        </p>
                                        <p className="text-xs text-gray-600 mt-1">
                                            {sanggas[2].total_anggota} anggota
                                        </p>
                                    </div>
                                    <div className="h-20 bg-orange-300 w-full rounded-t-lg flex items-center justify-center">
                                        <span className="text-2xl font-bold text-orange-900">
                                            #3
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Full Ranking Table */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Ranking Lengkap
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    Total: {sanggas.length} sangga
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
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                            Peringkat
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Sangga
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                            Anggota
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
                                    {sanggas.map((item, idx) => (
                                        <tr
                                            key={item.id}
                                            className={`hover:bg-gray-50 ${
                                                idx < 3 ? "bg-yellow-50" : ""
                                            }`}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="flex items-center justify-center">
                                                    <div
                                                        className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg ${
                                                            idx === 0
                                                                ? "bg-yellow-100 text-yellow-700"
                                                                : idx === 1
                                                                ? "bg-gray-200 text-gray-700"
                                                                : idx === 2
                                                                ? "bg-orange-100 text-orange-700"
                                                                : "bg-gray-100 text-gray-700"
                                                        }`}
                                                    >
                                                        {getRankIcon(idx + 1)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    {item.logo_path && (
                                                        <img
                                                            src={`/storage/${item.logo_path}`}
                                                            alt={
                                                                item.nama_sangga
                                                            }
                                                            className="w-8 h-8 rounded-full object-cover"
                                                        />
                                                    )}
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {item.nama_sangga}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                                                {item.total_anggota}
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
                                                    item.persentase
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <button
                                                    onClick={() =>
                                                        router.visit(
                                                            `/kehadiran/rekap/sangga/${item.id}?bulan=${bulan}&tahun=${tahun}`
                                                        )
                                                    }
                                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                                >
                                                    Detail
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
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
