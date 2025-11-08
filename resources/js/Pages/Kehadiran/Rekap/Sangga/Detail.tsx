import { PageHeader } from "@/Components/ui/page-header";
import { StatsCard } from "@/Components/ui/stats-card";
import { FilterBar } from "@/Components/ui/filter-bar";
import AppLayout from "@/Layouts/AppLayout";
import { Head, router } from "@inertiajs/react";
import {
    Users,
    CheckCircle,
    XCircle,
    AlertCircle,
    TrendingUp,
} from "lucide-react";
import { useState } from "react";

interface Sangga {
    id: number;
    nama_sangga: string;
    logo_path: string | null;
    total_anggota: number;
}

interface Stats {
    hadir: number;
    izin: number;
    alfa: number;
}

interface MemberStat {
    id: number;
    nama: string;
    kelas: string;
    hadir: number;
    izin: number;
    alfa: number;
    persentase: number;
}

interface Props {
    sangga: Sangga;
    stats: Stats;
    persentase: number;
    member_stats: MemberStat[];
    total_pertemuan: number;
    bulan: number;
    tahun: number;
}

export default function Detail({
    sangga,
    stats,
    persentase,
    member_stats,
    total_pertemuan,
    bulan,
    tahun,
}: Props) {
    const [selectedBulan, setSelectedBulan] = useState(bulan);
    const [selectedTahun, setSelectedTahun] = useState(tahun);

    const handleFilterChange = (newBulan: number, newTahun: number) => {
        router.get(
            `/kehadiran/rekap/sangga/${sangga.id}`,
            { bulan: newBulan, tahun: newTahun },
            { preserveState: true }
        );
    };

    const getStatusColor = (perc: number) => {
        if (perc >= 90) return "text-green-600";
        if (perc >= 75) return "text-yellow-600";
        if (perc >= 60) return "text-orange-600";
        return "text-red-600";
    };

    const getStatusBadge = (perc: number) => {
        if (perc >= 90)
            return (
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                    Sangat Baik
                </span>
            );
        if (perc >= 75)
            return (
                <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                    Baik
                </span>
            );
        if (perc >= 60)
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

    const expectedTotal = sangga.total_anggota * total_pertemuan;

    return (
        <AppLayout>
            <Head title={`Detail Sangga ${sangga.nama_sangga}`} />
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="mx-auto">
                    <PageHeader
                        title={sangga.nama_sangga}
                        subtitle="Rekap Kehadiran / Per Sangga / Detail"
                        icon={Users}
                        backHref="/kehadiran/rekap/sangga"
                    />

                    {/* Sangga Profile Card */}
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200 shadow-sm p-6 mb-6">
                        <div className="flex items-center gap-4">
                            {sangga.logo_path && (
                                <img
                                    src={`/storage/${sangga.logo_path}`}
                                    alt={sangga.nama_sangga}
                                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                                />
                            )}
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    {sangga.nama_sangga}
                                </h2>
                                <div className="flex items-center gap-6 text-sm">
                                    <div>
                                        <p className="text-gray-600">
                                            Total Anggota
                                        </p>
                                        <p className="font-semibold text-gray-900 text-lg">
                                            {sangga.total_anggota} siswa
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">
                                            Performa
                                        </p>
                                        <div className="mt-1">
                                            {getStatusBadge(persentase)}
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
                            title="Total Hadir"
                            value={stats.hadir}
                            subtitle={`dari ${expectedTotal} total`}
                            icon={CheckCircle}
                            iconColor="text-green-600"
                            iconBg="bg-green-50"
                        />
                        <StatsCard
                            title="Total Izin"
                            value={stats.izin}
                            subtitle="total izin"
                            icon={AlertCircle}
                            iconColor="text-yellow-600"
                            iconBg="bg-yellow-50"
                        />
                        <StatsCard
                            title="Total Alfa"
                            value={stats.alfa}
                            subtitle="total alfa"
                            icon={XCircle}
                            iconColor="text-red-600"
                            iconBg="bg-red-50"
                        />
                    </div>

                    {/* Member Stats Table */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Daftar Anggota
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Periode {monthNames[bulan - 1]} {tahun} - Total:{" "}
                                {member_stats.length} anggota
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
                                            Nama Siswa
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Kelas
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
                                    {member_stats.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={9}
                                                className="px-6 py-8 text-center text-sm text-gray-500"
                                            >
                                                Tidak ada data anggota
                                            </td>
                                        </tr>
                                    ) : (
                                        member_stats.map((item, idx) => (
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
                                                    {item.kelas}
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
                                                                `/kehadiran/rekap/siswa/${item.id}?bulan=${bulan}&tahun=${tahun}`
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

                    {/* Summary Info */}
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">
                            Informasi:
                        </h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>
                                • Total pertemuan: {total_pertemuan} pertemuan
                            </li>
                            <li>
                                • Total kehadiran yang diharapkan:{" "}
                                {expectedTotal} ({sangga.total_anggota} anggota
                                × {total_pertemuan} pertemuan)
                            </li>
                            <li>
                                • Persentase dihitung berdasarkan jumlah hadir
                                dibanding total yang diharapkan
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
