import { PageHeader } from "@/Components/ui/page-header";
import { FilterBar } from "@/Components/ui/filter-bar";
import AppLayout from "@/Layouts/AppLayout";
import { Head, router } from "@inertiajs/react";
import { Calendar, Download, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { useState } from "react";

interface Pertemuan {
    tanggal: string;
    formatted_date: string;
    day_name: string;
    total_siswa: number;
    hadir: number;
    izin: number;
    alfa: number;
    persentase: number;
    is_complete: boolean;
}

interface Props {
    pertemuan: Pertemuan[];
    bulan: number;
    tahun: number;
    total_siswa: number;
}

export default function Index({ pertemuan, bulan, tahun, total_siswa }: Props) {
    const [selectedBulan, setSelectedBulan] = useState(bulan);
    const [selectedTahun, setSelectedTahun] = useState(tahun);

    const handleFilterChange = (newBulan: number, newTahun: number) => {
        router.get(
            "/rekap/pertemuan",
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

    // Calculate overall stats
    const totalPertemuan = pertemuan.length;
    const totalHadir = pertemuan.reduce((sum, p) => sum + Number(p.hadir), 0);
    const totalIzin = pertemuan.reduce((sum, p) => sum + Number(p.izin), 0);
    const totalAlfa = pertemuan.reduce((sum, p) => sum + Number(p.alfa), 0);
    const avgPersentase =
        totalPertemuan > 0
            ? (
                  pertemuan.reduce((sum, p) => sum + Number(p.persentase), 0) /
                  totalPertemuan
              ).toFixed(2)
            : 0;

    return (
        <AppLayout>
            <Head title="Rekap Kehadiran Per Pertemuan" />
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="mx-auto">
                    <PageHeader
                        title="Rekap Per Pertemuan"
                        subtitle="Rekap Kehadiran / Per Pertemuan"
                        backIcon={ArrowLeft}
                        backHref="/rekap/dashboard"
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
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">
                                        Total Pertemuan
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        {totalPertemuan}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {monthNames[bulan - 1]} {tahun}
                                    </p>
                                </div>
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <Calendar className="w-8 h-8 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">
                                        Rata-rata Kehadiran
                                    </p>
                                    <p
                                        className={`text-3xl font-bold ${getStatusColor(
                                            Number(avgPersentase)
                                        )}`}
                                    >
                                        {avgPersentase}%
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Keseluruhan
                                    </p>
                                </div>
                                <div
                                    className={`${getStatusColor(
                                        Number(avgPersentase)
                                    )
                                        .replace("text-", "bg-")
                                        .replace("600", "50")} p-4 rounded-lg`}
                                >
                                    <CheckCircle
                                        className={`w-8 h-8 ${getStatusColor(
                                            Number(avgPersentase)
                                        )}`}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">
                                        Total Hadir
                                    </p>
                                    <p className="text-3xl font-bold text-green-600">
                                        {totalHadir}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Total keseluruhan
                                    </p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">
                                        Total Tidak Hadir
                                    </p>
                                    <p className="text-3xl font-bold text-red-600">
                                        {totalIzin + totalAlfa}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {totalIzin} izin, {totalAlfa} alfa
                                    </p>
                                </div>
                                <div className="bg-red-50 p-4 rounded-lg">
                                    <XCircle className="w-8 h-8 text-red-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Daftar Pertemuan
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    Total: {totalPertemuan} pertemuan di{" "}
                                    {monthNames[bulan - 1]} {tahun}
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
                                            Tanggal
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                            Total Siswa
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
                                    {pertemuan.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={9}
                                                className="px-6 py-8 text-center text-sm text-gray-500"
                                            >
                                                Tidak ada pertemuan di bulan ini
                                            </td>
                                        </tr>
                                    ) : (
                                        pertemuan.map((item, idx) => (
                                            <tr
                                                key={idx}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {idx + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {item.formatted_date}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {item.day_name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <span className="text-sm text-gray-900">
                                                        {item.total_siswa}
                                                    </span>
                                                    {!item.is_complete && (
                                                        <div className="text-xs text-orange-600 mt-1">
                                                            Belum lengkap
                                                        </div>
                                                    )}
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
                                                                `/rekap/pertemuan/${item.tanggal}`
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
                            Keterangan:
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
