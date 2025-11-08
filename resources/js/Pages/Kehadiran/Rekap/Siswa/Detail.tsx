import { PageHeader } from "@/Components/ui/page-header";
import { StatsCard } from "@/Components/ui/stats-card";
import { FilterBar } from "@/Components/ui/filter-bar";
import AppLayout from "@/Layouts/AppLayout";
import { Head, router } from "@inertiajs/react";
import {
    User,
    CheckCircle,
    XCircle,
    AlertCircle,
    TrendingUp,
    Calendar,
} from "lucide-react";
import { useState } from "react";

interface Siswa {
    id: number;
    nama: string;
    kelas: string;
    jurusan: string;
    rombel: string | null;
    jenis_kelamin: string;
    sangga: string;
}

interface Kehadiran {
    tanggal: string;
    status: string;
    keterangan: string | null;
    formatted_date: string;
}

interface Stats {
    hadir: number;
    izin: number;
    alfa: number;
}

interface TrendData {
    bulan: string;
    persentase: number;
}

interface Props {
    siswa: Siswa;
    kehadiran: Kehadiran[];
    stats: Stats;
    persentase: number;
    total_pertemuan: number;
    trend_data: TrendData[];
    bulan: number;
    tahun: number;
}

export default function Detail({
    siswa,
    kehadiran,
    stats,
    persentase,
    total_pertemuan,
    trend_data,
    bulan,
    tahun,
}: Props) {
    const [selectedBulan, setSelectedBulan] = useState(bulan);
    const [selectedTahun, setSelectedTahun] = useState(tahun);

    const handleFilterChange = (newBulan: number, newTahun: number) => {
        router.get(
            `/kehadiran/rekap/siswa/${siswa.id}`,
            { bulan: newBulan, tahun: newTahun },
            { preserveState: true }
        );
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            hadir: (
                <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Hadir
                </span>
            ),
            izin: (
                <span className="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                    Izin
                </span>
            ),
            alfa: (
                <span className="px-3 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                    Alfa
                </span>
            ),
        };
        return badges[status as keyof typeof badges];
    };

    const getPerformanceBadge = (perc: number) => {
        if (perc >= 90)
            return (
                <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
                    🏆 Sangat Baik
                </span>
            );
        if (perc >= 75)
            return (
                <span className="px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-800 rounded-full">
                    ⭐ Baik
                </span>
            );
        if (perc >= 60)
            return (
                <span className="px-3 py-1 text-sm font-medium bg-orange-100 text-orange-800 rounded-full">
                    ⚠️ Cukup
                </span>
            );
        return (
            <span className="px-3 py-1 text-sm font-medium bg-red-100 text-red-800 rounded-full">
                ❌ Perlu Perhatian
            </span>
        );
    };

    const getStatusColor = (perc: number) => {
        if (perc >= 90) return "text-green-600";
        if (perc >= 75) return "text-yellow-600";
        if (perc >= 60) return "text-orange-600";
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
            <Head title={`Detail Kehadiran ${siswa.nama}`} />
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="mx-auto">
                    <PageHeader
                        title={siswa.nama}
                        subtitle="Rekap Kehadiran / Per Siswa / Detail"
                        icon={User}
                        backHref="/kehadiran/rekap/siswa"
                    />

                    {/* Student Profile Card */}
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 shadow-sm p-6 mb-6">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    {siswa.nama}
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-600">Kelas</p>
                                        <p className="font-semibold text-gray-900">
                                            {siswa.kelas} {siswa.jurusan}{" "}
                                            {siswa.rombel || ""}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Sangga</p>
                                        <p className="font-semibold text-gray-900">
                                            {siswa.sangga}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">
                                            Jenis Kelamin
                                        </p>
                                        <p className="font-semibold text-gray-900">
                                            {siswa.jenis_kelamin === "L"
                                                ? "Laki-laki"
                                                : "Perempuan"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">
                                            Performa
                                        </p>
                                        <div className="mt-1">
                                            {getPerformanceBadge(persentase)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

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

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <StatsCard
                            title="Persentase Kehadiran"
                            value={`${persentase}%`}
                            subtitle={`${monthNames[bulan - 1]} ${tahun}`}
                            icon={TrendingUp}
                            iconColor={getStatusColor(persentase).replace(
                                "text-",
                                "text-"
                            )}
                            iconBg={getStatusColor(persentase)
                                .replace("text-", "bg-")
                                .replace("600", "50")}
                        />
                        <StatsCard
                            title="Hadir"
                            value={stats.hadir}
                            subtitle={`dari ${total_pertemuan} pertemuan`}
                            icon={CheckCircle}
                            iconColor="text-green-600"
                            iconBg="bg-green-50"
                        />
                        <StatsCard
                            title="Izin"
                            value={stats.izin}
                            subtitle="kali izin"
                            icon={AlertCircle}
                            iconColor="text-yellow-600"
                            iconBg="bg-yellow-50"
                        />
                        <StatsCard
                            title="Alfa"
                            value={stats.alfa}
                            subtitle="kali alfa"
                            icon={XCircle}
                            iconColor="text-red-600"
                            iconBg="bg-red-50"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Trend Chart */}
                        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Trend Kehadiran (6 Bulan Terakhir)
                            </h3>
                            <div className="space-y-3">
                                {trend_data.map((item, idx) => (
                                    <div key={idx} className="space-y-1">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-700">
                                                {item.bulan}
                                            </span>
                                            <span
                                                className={`font-semibold ${getStatusColor(
                                                    item.persentase
                                                )}`}
                                            >
                                                {item.persentase}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all ${
                                                    item.persentase >= 90
                                                        ? "bg-green-500"
                                                        : item.persentase >= 75
                                                        ? "bg-yellow-500"
                                                        : item.persentase >= 60
                                                        ? "bg-orange-500"
                                                        : "bg-red-500"
                                                }`}
                                                style={{
                                                    width: `${item.persentase}%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Summary Pie */}
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Ringkasan
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                                        <span className="text-sm text-gray-700">
                                            Hadir
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-gray-900">
                                            {stats.hadir}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {total_pertemuan > 0
                                                ? (
                                                      (stats.hadir /
                                                          total_pertemuan) *
                                                      100
                                                  ).toFixed(1)
                                                : 0}
                                            %
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                                        <span className="text-sm text-gray-700">
                                            Izin
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-gray-900">
                                            {stats.izin}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {total_pertemuan > 0
                                                ? (
                                                      (stats.izin /
                                                          total_pertemuan) *
                                                      100
                                                  ).toFixed(1)
                                                : 0}
                                            %
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-4 bg-red-500 rounded"></div>
                                        <span className="text-sm text-gray-700">
                                            Alfa
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-gray-900">
                                            {stats.alfa}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {total_pertemuan > 0
                                                ? (
                                                      (stats.alfa /
                                                          total_pertemuan) *
                                                      100
                                                  ).toFixed(1)
                                                : 0}
                                            %
                                        </p>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700">
                                            Total
                                        </span>
                                        <span className="text-lg font-bold text-gray-900">
                                            {total_pertemuan}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* History Table */}
                    <div className="mt-6 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Riwayat Kehadiran
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Periode {monthNames[bulan - 1]} {tahun}
                            </p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            No
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Tanggal
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Keterangan
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {kehadiran.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="px-6 py-8 text-center text-sm text-gray-500"
                                            >
                                                Belum ada data kehadiran
                                            </td>
                                        </tr>
                                    ) : (
                                        kehadiran.map((item, idx) => (
                                            <tr
                                                key={idx}
                                                className={`hover:bg-gray-50 ${
                                                    item.status === "hadir"
                                                        ? "bg-green-50"
                                                        : item.status === "izin"
                                                        ? "bg-yellow-50"
                                                        : "bg-red-50"
                                                }`}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {idx + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {item.formatted_date}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {new Date(
                                                            item.tanggal
                                                        ).toLocaleDateString(
                                                            "id-ID",
                                                            { weekday: "long" }
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    {getStatusBadge(
                                                        item.status
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    {item.keterangan || "-"}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
