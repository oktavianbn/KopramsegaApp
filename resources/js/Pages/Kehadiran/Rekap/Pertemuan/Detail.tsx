import { PageHeader } from "@/Components/ui/page-header";
import { StatsCard } from "@/Components/ui/stats-card";
import AppLayout from "@/Layouts/AppLayout";
import { Head, router } from "@inertiajs/react";
import {
    Calendar,
    CheckCircle,
    XCircle,
    AlertCircle,
    Users,
} from "lucide-react";

interface Member {
    id: number;
    nama: string;
    kelas: string;
    status: string | null;
    keterangan: string | null;
}

interface SanggaDetail {
    id: number;
    nama_sangga: string;
    logo_path: string | null;
    total_anggota: number;
    stats: {
        hadir: number;
        izin: number;
        alfa: number;
        belum_isi: number;
    };
    persentase: number;
    members: Member[];
}

interface OverallStats {
    total_siswa: number;
    total_records: number;
    hadir: number;
    izin: number;
    alfa: number;
    belum_isi: number;
    persentase: number;
}

interface Props {
    tanggal: string;
    formatted_date: string;
    day_name: string;
    sanggas: SanggaDetail[];
    overall_stats: OverallStats;
}

export default function Detail({
    tanggal,
    formatted_date,
    day_name,
    sanggas,
    overall_stats,
}: Props) {
    const getStatusBadge = (status: string | null) => {
        if (status === "hadir")
            return (
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                    Hadir
                </span>
            );
        if (status === "izin")
            return (
                <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                    Izin
                </span>
            );
        if (status === "alfa")
            return (
                <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                    Alfa
                </span>
            );
        return (
            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                Belum Isi
            </span>
        );
    };

    const getStatusColor = (perc: number) => {
        if (perc >= 90) return "text-green-600";
        if (perc >= 75) return "text-yellow-600";
        if (perc >= 60) return "text-orange-600";
        return "text-red-600";
    };

    return (
        <AppLayout>
            <Head title={`Detail Pertemuan ${formatted_date}`} />
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="mx-auto">
                    <PageHeader
                        title={formatted_date}
                        subtitle={`Rekap Kehadiran / Per Pertemuan / ${day_name}`}
                        icon={Calendar}
                        backHref="/rekap/pertemuan"
                    />

                    {/* Date Info Card */}
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 shadow-sm p-6 mb-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-500 text-white rounded-lg p-4">
                                <Calendar className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {formatted_date}
                                </h2>
                                <p className="text-gray-600">{day_name}</p>
                            </div>
                        </div>
                    </div>

                    {/* Overall Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <StatsCard
                            title="Persentase Kehadiran"
                            value={`${overall_stats.persentase}%`}
                            subtitle={`${overall_stats.total_records} dari ${overall_stats.total_siswa} siswa`}
                            icon={CheckCircle}
                            iconColor={getStatusColor(
                                overall_stats.persentase
                            ).replace("text-", "text-")}
                            iconBg={getStatusColor(overall_stats.persentase)
                                .replace("text-", "bg-")
                                .replace("600", "50")}
                        />
                        <StatsCard
                            title="Hadir"
                            value={overall_stats.hadir}
                            subtitle="siswa hadir"
                            icon={CheckCircle}
                            iconColor="text-green-600"
                            iconBg="bg-green-50"
                        />
                        <StatsCard
                            title="Izin"
                            value={overall_stats.izin}
                            subtitle="siswa izin"
                            icon={AlertCircle}
                            iconColor="text-yellow-600"
                            iconBg="bg-yellow-50"
                        />
                        <StatsCard
                            title="Alfa"
                            value={overall_stats.alfa}
                            subtitle="siswa alfa"
                            icon={XCircle}
                            iconColor="text-red-600"
                            iconBg="bg-red-50"
                        />
                    </div>

                    {/* Alert if incomplete */}
                    {overall_stats.belum_isi > 0 && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-orange-800">
                                        Data Belum Lengkap
                                    </p>
                                    <p className="text-sm text-orange-700 mt-1">
                                        Masih ada {overall_stats.belum_isi}{" "}
                                        siswa yang belum diisi kehadirannya.
                                        Silakan lengkapi data melalui halaman
                                        input kehadiran.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Per Sangga Details */}
                    <div className="space-y-6">
                        {sanggas.map((sangga) => (
                            <div
                                key={sangga.id}
                                className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
                            >
                                {/* Sangga Header */}
                                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {sangga.logo_path && (
                                                <img
                                                    src={`/storage/${sangga.logo_path}`}
                                                    alt={sangga.nama_sangga}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                            )}
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {sangga.nama_sangga}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {sangga.total_anggota}{" "}
                                                    anggota
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p
                                                className={`text-2xl font-bold ${getStatusColor(
                                                    sangga.persentase
                                                )}`}
                                            >
                                                {sangga.persentase}%
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Kehadiran
                                            </p>
                                        </div>
                                    </div>

                                    {/* Sangga Stats */}
                                    <div className="grid grid-cols-4 gap-4 mt-4">
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-green-600">
                                                {sangga.stats.hadir}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                Hadir
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-yellow-600">
                                                {sangga.stats.izin}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                Izin
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-red-600">
                                                {sangga.stats.alfa}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                Alfa
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-gray-600">
                                                {sangga.stats.belum_isi}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                Belum Isi
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Members Table */}
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
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                    Keterangan
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {sangga.members.map(
                                                (member, idx) => (
                                                    <tr
                                                        key={member.id}
                                                        className={`hover:bg-gray-50 ${
                                                            member.status ===
                                                            "hadir"
                                                                ? "bg-green-50"
                                                                : member.status ===
                                                                  "izin"
                                                                ? "bg-yellow-50"
                                                                : member.status ===
                                                                  "alfa"
                                                                ? "bg-red-50"
                                                                : ""
                                                        }`}
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {idx + 1}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {member.nama}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {member.kelas}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                                            {getStatusBadge(
                                                                member.status
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-900">
                                                            {member.keterangan ||
                                                                "-"}
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Action Button */}
                    <div className="mt-6 flex items-center justify-end gap-4">
                        <button
                            onClick={() =>
                                router.visit(`/kehadiran/${tanggal}`)
                            }
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Users className="w-4 h-4" />
                            Edit Kehadiran Hari Ini
                        </button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
