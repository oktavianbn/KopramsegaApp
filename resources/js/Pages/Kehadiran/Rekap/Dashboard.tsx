import { PageHeader } from "@/Components/ui/page-header";
import { StatsCard } from "@/Components/ui/stats-card";
import { FilterBar } from "@/Components/ui/filter-bar";
import AppLayout from "@/Layouts/AppLayout";
import { Head, router } from "@inertiajs/react";
import {
    BarChart3,
    Calendar,
    TrendingUp,
    Users,
    CheckCircle,
    XCircle,
    AlertCircle,
} from "lucide-react";
import { useState } from "react";

interface Summary {
    total_pertemuan: number;
    total_siswa: number;
    persentase_kehadiran: number;
    total_hadir: number;
    total_izin: number;
    total_alfa: number;
}

interface RekapSangga {
    nama_sangga: string;
    total_anggota: number;
    hadir: number;
    izin: number;
    alfa: number;
    persentase: number;
}

interface TrendData {
    bulan: string;
    persentase: number;
}

interface LastMeeting {
    tanggal: string;
    hadir: number;
    izin: number;
    alfa: number;
    persentase: number;
}

interface Props {
    summary: Summary;
    rekap_sangga: RekapSangga[];
    trend_data: TrendData[];
    last_meeting: LastMeeting | null;
    bulan: number;
    tahun: number;
}

export default function Dashboard({
    summary,
    rekap_sangga,
    trend_data,
    last_meeting,
    bulan,
    tahun,
}: Props) {
    const [selectedBulan, setSelectedBulan] = useState(bulan);
    const [selectedTahun, setSelectedTahun] = useState(tahun);

    const handleFilterChange = (newBulan: number, newTahun: number) => {
        router.get(
            "/kehadiran/rekap/dashboard",
            { bulan: newBulan, tahun: newTahun },
            { preserveState: true }
        );
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
            <Head title="Dashboard Rekap Kehadiran" />
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="mx-auto">
                    <PageHeader
                        title="Rekap Kehadiran"
                        subtitle="Dashboard & Monitoring Kehadiran"
                        icon={BarChart3}
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

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <StatsCard
                            title="Total Pertemuan"
                            value={summary.total_pertemuan}
                            subtitle={`Periode ${
                                monthNames[bulan - 1]
                            } ${tahun}`}
                            icon={Calendar}
                            iconColor="text-blue-600"
                            iconBg="bg-blue-50"
                        />
                        <StatsCard
                            title="Total Siswa"
                            value={summary.total_siswa}
                            subtitle="Siswa aktif"
                            icon={Users}
                            iconColor="text-purple-600"
                            iconBg="bg-purple-50"
                        />
                        <StatsCard
                            title="Rata-rata Kehadiran"
                            value={`${summary.persentase_kehadiran}%`}
                            subtitle="Persentase keseluruhan"
                            icon={TrendingUp}
                            iconColor={getStatusColor(
                                summary.persentase_kehadiran
                            ).replace("text-", "text-")}
                            iconBg={getStatusColor(summary.persentase_kehadiran)
                                .replace("text-", "bg-")
                                .replace("600", "50")}
                        />
                        <StatsCard
                            title="Pertemuan Terakhir"
                            value={
                                last_meeting
                                    ? `${last_meeting.persentase}%`
                                    : "-"
                            }
                            subtitle={
                                last_meeting
                                    ? new Date(
                                          last_meeting.tanggal
                                      ).toLocaleDateString("id-ID")
                                    : "Belum ada data"
                            }
                            icon={CheckCircle}
                            iconColor="text-emerald-600"
                            iconBg="bg-emerald-50"
                        />
                    </div>
                    {/* Quick Links */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <button
                            onClick={() =>
                                router.visit("/kehadiran/rekap/siswa")
                            }
                            className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow text-left"
                        >
                            <Users className="w-8 h-8 text-blue-600 mb-3" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                Rekap Per Siswa
                            </h3>
                            <p className="text-sm text-gray-600">
                                Lihat detail kehadiran setiap siswa
                            </p>
                        </button>
                        <button
                            onClick={() =>
                                router.visit("/kehadiran/rekap/sangga")
                            }
                            className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow text-left"
                        >
                            <Users className="w-8 h-8 text-purple-600 mb-3" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                Rekap Per Sangga
                            </h3>
                            <p className="text-sm text-gray-600">
                                Bandingkan performa antar sangga
                            </p>
                        </button>
                        <button
                            onClick={() =>
                                router.visit("/kehadiran/rekap/pertemuan")
                            }
                            className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow text-left"
                        >
                            <Calendar className="w-8 h-8 text-emerald-600 mb-3" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                Rekap Per Pertemuan
                            </h3>
                            <p className="text-sm text-gray-600">
                                Lihat kehadiran berdasarkan tanggal
                            </p>
                        </button>
                    </div>
                    {/* Status Distribution */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Distribusi Status
                                </h3>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span className="text-sm text-gray-700">
                                            Hadir
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-gray-900">
                                            {summary.total_hadir}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {summary.total_pertemuan > 0
                                                ? (
                                                      (summary.total_hadir /
                                                          (summary.total_hadir +
                                                              summary.total_izin +
                                                              summary.total_alfa)) *
                                                      100
                                                  ).toFixed(1)
                                                : 0}
                                            %
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                        <span className="text-sm text-gray-700">
                                            Izin
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-gray-900">
                                            {summary.total_izin}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {summary.total_pertemuan > 0
                                                ? (
                                                      (summary.total_izin /
                                                          (summary.total_hadir +
                                                              summary.total_izin +
                                                              summary.total_alfa)) *
                                                      100
                                                  ).toFixed(1)
                                                : 0}
                                            %
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                        <span className="text-sm text-gray-700">
                                            Alfa
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-gray-900">
                                            {summary.total_alfa}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {summary.total_pertemuan > 0
                                                ? (
                                                      (summary.total_alfa /
                                                          (summary.total_hadir +
                                                              summary.total_izin +
                                                              summary.total_alfa)) *
                                                      100
                                                  ).toFixed(1)
                                                : 0}
                                            %
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Trend Chart */}
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 lg:col-span-2">
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
                    </div>

                    {/* Rekap Per Sangga */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-6">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Rekap Per Sangga
                            </h3>
                            <button
                                onClick={() =>
                                    router.visit("/kehadiran/rekap/sangga")
                                }
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Lihat Detail →
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
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
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {rekap_sangga.map((item, idx) => (
                                        <tr
                                            key={idx}
                                            className="hover:bg-gray-50 cursor-pointer"
                                            onClick={() =>
                                                router.visit(
                                                    `/kehadiran/rekap/sangga/${item.nama_sangga}`
                                                )
                                            }
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-bold text-gray-700">
                                                    {idx + 1}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {item.nama_sangga}
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
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
