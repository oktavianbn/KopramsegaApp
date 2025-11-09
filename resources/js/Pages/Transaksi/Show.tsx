"use client";

import AppLayout from "@/Layouts/AppLayout";
import TransaksiStatusUpdateModal from "@/Components/TransaksiStatusUpdateModal";
import { Head, Link } from "@inertiajs/react";
import {
    ArrowLeft,
    User,
    Calendar,
    Package,
    Phone,
    MapPin,
    Clock,
    CheckCircle,
    XCircle,
    Edit,
    MessageCircle,
} from "lucide-react";
import { useState } from "react";

interface DetailItem {
    id: number;
    jumlah: number;
    harga_satuan?: number;
    menu?: {
        id: number;
        nama: string;
    } | null;
}

interface Transaksi {
    id: number;
    nama_pelanggan?: string;
    nomor_telepon?: string;
    diantar: boolean;
    tujuan?: string;
    status:
        | "verifikasi"
        | "proses"
        | "sudah_siap"
        | "sudah_ambil"
        | "dibatalkan";
    total_harga?: number;
    catatan?: string | null;
    detail?: DetailItem[];
    created_at?: string | null;
    updated_at?: string | null;
}

interface Props {
    transaksi: Transaksi;
}

export default function Show({ transaksi }: Props) {
    // compatibility alias for templates still using peminjaman
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const peminjaman: any = transaksi as any;

    const [showStatusModal, setShowStatusModal] = useState<boolean>(false);

    const handleWhatsApp = () => {
        const phone = (transaksi.nomor_telepon || "").replace(/[^0-9]/g, "");
        const formattedPhone = phone.startsWith("0")
            ? "62" + phone.substring(1)
            : phone;

        const statusText =
            {
                verifikasi: "sedang dalam verifikasi",
                proses: "sedang diproses",
                sudah_siap: "sudah siap untuk diambil/diantar",
                sudah_ambil: "sudah selesai",
                dibatalkan: "dibatalkan",
            }[transaksi.status] || transaksi.status;

        const deliveryText = transaksi.diantar ? "diantar" : "diambil sendiri";

        const itemsList =
            transaksi.detail
                ?.map(
                    (d, i) => `${i + 1}. ${d.menu?.nama || "-"} (${d.jumlah}x)`
                )
                .join("%0A") || "";

        const totalHarga = `Rp ${Number(
            transaksi.total_harga || 0
        ).toLocaleString("id-ID")}`;

        const message = `Halo ${
            transaksi.nama_pelanggan
        },%0A%0AKami informasikan pesanan Anda dengan detail:%0A${itemsList}%0A%0ATotal: ${totalHarga}%0AStatus: ${statusText}%0AMetode: ${deliveryText}%0A${
            transaksi.tujuan ? `Alamat: ${transaksi.tujuan}` : ""
        }%0A%0ATerima kasih!`;

        window.open(
            `https://wa.me/${formattedPhone}?text=${message}`,
            "_blank"
        );
    };

    const getStatusBadge = (status: string) => {
        const statusConfig: any = {
            verifikasi: {
                color: "bg-yellow-100 text-yellow-800",
                icon: Clock,
                text: "Verifikasi",
            },
            proses: {
                color: "bg-blue-100 text-blue-800",
                icon: CheckCircle,
                text: "Proses",
            },
            sudah_siap: {
                color: "bg-indigo-100 text-indigo-800",
                icon: CheckCircle,
                text: "Sudah Siap",
            },
            sudah_ambil: {
                color: "bg-green-100 text-green-800",
                icon: Package,
                text: "Sudah Diambil",
            },
            dibatalkan: {
                color: "bg-red-100 text-red-800",
                icon: XCircle,
                text: "Dibatalkan",
            },
        };
        const cfg = (statusConfig as any)[status] || statusConfig.proses;
        const Icon = cfg.icon;
        return (
            <span
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${cfg.color}`}
            >
                <Icon className="w-4 h-4" />
                {cfg.text}
            </span>
        );
    };

    const getDiantarBadge = (diantar?: boolean) => (
        <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                diantar
                    ? "bg-blue-100 text-blue-800"
                    : "bg-purple-100 text-purple-800"
            }`}
        >
            {diantar ? "Diantar" : "Ambil"}
        </span>
    );

    const totalItems = (peminjaman.detail || []).reduce(
        (s: number, d: any) => s + (d.jumlah || 0),
        0
    );

    return (
        <AppLayout>
            <Head
                title={`Detail Transaksi - ${peminjaman.nama_pelanggan || "-"}`}
            />

            <div className="p-6">
                <div className="grid gap-2 md:flex items-center justify-between mb-6">
                    <div className="flex gap-6 items-center">
                        <Link
                            href="/transaksi/dashboard"
                            className="p-2 h-max bg-gray-200 rounded-lg flex justify-center items-center"
                        >
                            <ArrowLeft className="h-5 w-5 text-gray-500" />
                        </Link>
                        <div className="flex flex-col gap-2">
                            <h1 className="text-2xl font-bold text-gray-700 whitespace-nowrap">
                                Data Transaksi
                            </h1>
                            <h2 className="text-base font-medium text-gray-700 whitespace-nowrap">
                                Transaksi / Lihat Data
                            </h2>
                        </div>
                    </div>

                    {peminjaman.status !== "dibatalkan" && (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleWhatsApp}
                                className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <MessageCircle className="w-4 h-4" />
                                Hubungi via WhatsApp
                            </button>
                            <button
                                onClick={() => setShowStatusModal(true)}
                                className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Edit className="w-4 h-4" />
                                Update Status
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex gap-4 mb-6 border-b py-2">
                    <h3>Status Transaksi</h3>
                    {getDiantarBadge(peminjaman.diantar)}
                    {getStatusBadge(peminjaman.status)}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Informasi Pelanggan
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-500">
                                    Nama
                                </label>
                                <p className="text-gray-900 font-medium">
                                    {peminjaman.nama_pelanggan || "-"}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500">
                                    Nomor Telepon
                                </label>
                                <div className="flex items-center gap-2">
                                    <p className="text-gray-900 flex items-center gap-1">
                                        <Phone className="w-4 h-4" />
                                        {peminjaman.nomor_telepon || "-"}
                                    </p>
                                    {peminjaman.nomor_telepon && (
                                        <button
                                            onClick={handleWhatsApp}
                                            className="text-green-600 hover:text-green-700 p-1 rounded transition-colors"
                                            title="Hubungi via WhatsApp"
                                        >
                                            <MessageCircle className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-500">
                                    Tujuan Pengiriman
                                </label>
                                <p className="text-gray-900 flex items-start gap-1">
                                    <MapPin className="w-4 h-4 mt-0.5" />
                                    {peminjaman.tujuan || "-"}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500">
                                    Catatan
                                </label>
                                <p className="text-gray-900">
                                    {peminjaman.catatan || "-"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Timeline Transaksi
                        </h2>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <div>
                                    <p className="text-sm font-medium">
                                        Dibuat
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {peminjaman.created_at
                                            ? new Date(
                                                  peminjaman.created_at
                                              ).toLocaleDateString("id-ID", {
                                                  weekday: "long",
                                                  year: "numeric",
                                                  month: "long",
                                                  day: "numeric",
                                              })
                                            : "-"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                <div>
                                    <p className="text-sm font-medium">
                                        Terakhir Diubah
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {peminjaman.updated_at
                                            ? new Date(
                                                  peminjaman.updated_at
                                              ).toLocaleDateString("id-ID", {
                                                  weekday: "long",
                                                  year: "numeric",
                                                  month: "long",
                                                  day: "numeric",
                                              })
                                            : "-"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-2 h-2 rounded-full ${
                                        peminjaman.diantar
                                            ? "bg-green-500"
                                            : "bg-red-500"
                                    }`}
                                ></div>
                                <div>
                                    <p className="text-sm font-medium">
                                        Status Pembelian
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {peminjaman.status}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border p-6 mt-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Package className="w-5 h-5" /> Detail Pembelian (
                            {totalItems} item)
                        </h2>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                                            No
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                                            Menu
                                        </th>
                                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                                            Jumlah
                                        </th>
                                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                                            Harga Satuan
                                        </th>
                                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                                            Subtotal
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {(peminjaman.detail || []).map(
                                        (detail: any, index: number) => (
                                            <tr
                                                key={index}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-4 py-3 text-sm text-gray-900">
                                                    {index + 1}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="font-medium text-gray-900">
                                                        {detail.menu?.nama ||
                                                            "-"}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <span className="text-sm font-semibold text-gray-900">
                                                        {detail.jumlah}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right text-sm text-gray-900">
                                                    Rp{" "}
                                                    {Number(
                                                        detail.harga_satuan || 0
                                                    ).toLocaleString("id-ID")}
                                                </td>
                                                <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                                                    Rp{" "}
                                                    {Number(
                                                        (detail.jumlah || 0) *
                                                            (detail.harga_satuan ||
                                                                0)
                                                    ).toLocaleString("id-ID")}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                    <tr className="bg-gray-50 font-semibold">
                                        <td
                                            colSpan={4}
                                            className="px-4 py-3 text-right text-sm text-gray-900"
                                        >
                                            Total Harga
                                        </td>
                                        <td className="px-4 py-3 text-right text-base text-green-600">
                                            Rp{" "}
                                            {Number(
                                                peminjaman.total_harga || 0
                                            ).toLocaleString("id-ID")}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Status Update Modal */}
                {showStatusModal && (
                    <TransaksiStatusUpdateModal
                        transaksi={{
                            id: transaksi.id,
                            nama_pelanggan: transaksi.nama_pelanggan || "-",
                            status: transaksi.status,
                        }}
                        onClose={() => setShowStatusModal(false)}
                    />
                )}
            </div>
        </AppLayout>
    );
}
