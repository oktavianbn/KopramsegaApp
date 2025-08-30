"use client";

import AppLayout from "@/Layouts/AppLayout";
import StatusUpdateModal from "@/Components/StatusUpdateModal";
import { Head, Link, router } from "@inertiajs/react";
import {
    ArrowLeft,
    User,
    Calendar,
    Package,
    Camera,
    Phone,
    MapPin,
    Building,
    Clock,
    CheckCircle,
    XCircle,
    Edit,
    Eye,
} from "lucide-react";
import { useState } from "react";

interface DetailPeminjaman {
    id: number;
    stok_id: number;
    jumlah: number;
    jumlah_kembali?: number;
    stok: {
        id: number;
        barang: {
            id: number;
            nama: string;
            foto?: string;
        };
        spesifikasi?: {
            id: number;
            key: string;
            value: string;
        } | null;
    };
}

interface UserInterface {
    id: number;
    name: string;
}

interface Peminjaman {
    id: number;
    nama_peminjam: string;
    alamat: string;
    no_telp: string;
    asal: string;
    foto_identitas: string;
    jenis: "pinjam" | "sewa";
    waktu_pinjam_mulai: string;
    waktu_pinjam_selesai: string;
    waktu_kembali?: string;
    status:
        | "pending"
        | "disetujui"
        | "sudah_ambil"
        | "sudah_kembali"
        | "dibatalkan";
    tepat_waktu?: boolean;
    foto_barang_diambil: string;
    foto_barang_kembali?: string;
    pemberi_user?: {
        id: number;
        name: string;
    };
    penerima_user?: {
        id: number;
        name: string;
    };
    detail_peminjaman: DetailPeminjaman[];
    created_at: string;
    updated_at: string;
}

interface Props {
    peminjaman: Peminjaman;
    users: UserInterface[];
}

export default function Show({ peminjaman, users }: Props) {
    const [showImageModal, setShowImageModal] = useState<string | null>(null);
    const [showStatusModal, setShowStatusModal] = useState(false);

    const getStatusBadge = (status: string, tepatWaktu?: boolean) => {
        const statusConfig = {
            pending: {
                color: "bg-yellow-100 text-yellow-800",
                icon: Clock,
                text: "Pending",
            },
            disetujui: {
                color: "bg-blue-100 text-blue-800",
                icon: CheckCircle,
                text: "Disetujui",
            },
            sudah_ambil: {
                color: "bg-green-100 text-green-800",
                icon: Package,
                text: "Sudah Diambil",
            },
            sudah_kembali: {
                color:
                    tepatWaktu === false
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800",
                icon: CheckCircle,
                text:
                    tepatWaktu === false
                        ? "Kembali Terlambat"
                        : "Sudah Kembali",
            },
            dibatalkan: {
                color: "bg-red-100 text-red-800",
                icon: XCircle,
                text: "Dibatalkan",
            },
        };

        const config = statusConfig[status as keyof typeof statusConfig];
        const IconComponent = config.icon;

        return (
            <span
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
            >
                <IconComponent className="w-4 h-4" />
                {config.text}
            </span>
        );
    };

    const getJenisBadge = (jenis: string) => {
        return (
            <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    jenis === "pinjam"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800"
                }`}
            >
                {jenis === "pinjam" ? "Pinjam" : "Sewa"}
            </span>
        );
    };

    const openStatusModal = () => {
        setShowStatusModal(true);
    };

    const totalItems = peminjaman.detail_peminjaman.reduce(
        (sum, detail) => sum + detail.jumlah,
        0
    );

    return (
        <AppLayout>
            <Head title={`Detail Peminjaman - ${peminjaman.nama_peminjam}`} />

            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/peminjaman"
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Kembali
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Detail Peminjaman
                            </h1>
                            <p className="text-gray-600">
                                #{peminjaman.id} - {peminjaman.nama_peminjam}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {getJenisBadge(peminjaman.jenis)}
                        {getStatusBadge(
                            peminjaman.status,
                            peminjaman.tepat_waktu
                        )}
                        {peminjaman.status !== "sudah_kembali" &&
                            peminjaman.status !== "dibatalkan" && (
                                <button
                                    onClick={openStatusModal}
                                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Edit className="w-4 h-4" />
                                    Update Status
                                </button>
                            )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Informasi Utama */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Informasi Peminjam */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Informasi Peminjam
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">
                                        Nama
                                    </label>
                                    <p className="text-gray-900 font-medium">
                                        {peminjaman.nama_peminjam}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">
                                        Nomor Telepon
                                    </label>
                                    <p className="text-gray-900 flex items-center gap-1">
                                        <Phone className="w-4 h-4" />
                                        {peminjaman.no_telp}
                                    </p>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-500">
                                        Alamat
                                    </label>
                                    <p className="text-gray-900 flex items-start gap-1">
                                        <MapPin className="w-4 h-4 mt-0.5" />
                                        {peminjaman.alamat}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">
                                        Asal Institusi
                                    </label>
                                    <p className="text-gray-900 flex items-center gap-1">
                                        <Building className="w-4 h-4" />
                                        {peminjaman.asal}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">
                                        Foto Identitas
                                    </label>
                                    <button
                                        onClick={() =>
                                            setShowImageModal(
                                                `/storage/${peminjaman.foto_identitas}`
                                            )
                                        }
                                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                                    >
                                        <Eye className="w-4 h-4" />
                                        Lihat Foto
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Detail Barang */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Package className="w-5 h-5" />
                                Detail Barang ({totalItems} item)
                            </h2>

                            <div className="space-y-4">
                                {peminjaman.detail_peminjaman.map(
                                    (detail, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-4 border rounded-lg"
                                        >
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900">
                                                    {detail.stok.barang.nama}
                                                </h4>
                                                {detail.stok.spesifikasi && (
                                                    <p className="text-sm text-gray-600">
                                                        {
                                                            detail.stok
                                                                .spesifikasi.key
                                                        }
                                                        :{" "}
                                                        {
                                                            detail.stok
                                                                .spesifikasi
                                                                .value
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <span className="text-lg font-semibold text-gray-900">
                                                    {detail.jumlah}
                                                </span>
                                                <p className="text-sm text-gray-500">
                                                    unit
                                                </p>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>

                        {/* Foto Barang */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Camera className="w-5 h-5" />
                                Dokumentasi Barang
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-2">
                                        Foto Barang Diambil
                                    </label>
                                    <button
                                        onClick={() =>
                                            setShowImageModal(
                                                `/storage/${peminjaman.foto_barang_diambil}`
                                            )
                                        }
                                        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
                                    >
                                        <div className="flex flex-col items-center">
                                            <Camera className="w-8 h-8 text-gray-400 mb-2" />
                                            <span className="text-sm text-blue-600">
                                                Lihat Foto
                                            </span>
                                        </div>
                                    </button>
                                </div>

                                {peminjaman.foto_barang_kembali && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-2">
                                            Foto Barang Kembali
                                        </label>
                                        <button
                                            onClick={() =>
                                                setShowImageModal(
                                                    `/storage/${peminjaman.foto_barang_kembali}`
                                                )
                                            }
                                            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
                                        >
                                            <div className="flex flex-col items-center">
                                                <Camera className="w-8 h-8 text-gray-400 mb-2" />
                                                <span className="text-sm text-blue-600">
                                                    Lihat Foto
                                                </span>
                                            </div>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Timeline & Admin */}
                    <div className="space-y-6">
                        {/* Timeline Peminjaman */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                Timeline Peminjaman
                            </h2>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <div>
                                        <p className="text-sm font-medium">
                                            Mulai Pinjam
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(
                                                peminjaman.waktu_pinjam_mulai
                                            ).toLocaleDateString("id-ID", {
                                                weekday: "long",
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                    <div>
                                        <p className="text-sm font-medium">
                                            Batas Kembali
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(
                                                peminjaman.waktu_pinjam_selesai
                                            ).toLocaleDateString("id-ID", {
                                                weekday: "long",
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </div>
                                </div>

                                {peminjaman.waktu_kembali && (
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-2 h-2 rounded-full ${
                                                peminjaman.tepat_waktu
                                                    ? "bg-green-500"
                                                    : "bg-red-500"
                                            }`}
                                        ></div>
                                        <div>
                                            <p className="text-sm font-medium">
                                                Waktu Kembali
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(
                                                    peminjaman.waktu_kembali
                                                ).toLocaleDateString("id-ID", {
                                                    weekday: "long",
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </p>
                                            {peminjaman.tepat_waktu ===
                                                false && (
                                                <span className="text-xs text-red-600 font-medium">
                                                    Terlambat
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Informasi Admin */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Admin
                            </h2>

                            <div className="space-y-4">
                                {peminjaman.pemberi_user && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">
                                            Admin Pemberi
                                        </label>
                                        <p className="text-gray-900 font-medium">
                                            {peminjaman.pemberi_user.name}
                                        </p>
                                    </div>
                                )}

                                {peminjaman.penerima_user && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">
                                            Admin Penerima
                                        </label>
                                        <p className="text-gray-900 font-medium">
                                            {peminjaman.penerima_user.name}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Metadata */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Metadata
                            </h2>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Dibuat:
                                    </span>
                                    <span className="text-gray-900">
                                        {new Date(
                                            peminjaman.created_at
                                        ).toLocaleDateString("id-ID")}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Diupdate:
                                    </span>
                                    <span className="text-gray-900">
                                        {new Date(
                                            peminjaman.updated_at
                                        ).toLocaleDateString("id-ID")}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">ID:</span>
                                    <span className="text-gray-900">
                                        #{peminjaman.id}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Image Modal */}
                {showImageModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                        <div className="relative max-w-4xl max-h-[90vh] p-4">
                            <button
                                onClick={() => setShowImageModal(null)}
                                className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
                            >
                                ✕
                            </button>
                            <img
                                src={showImageModal}
                                alt="Preview"
                                className="max-w-full max-h-full object-contain rounded-lg"
                            />
                        </div>
                    </div>
                )}

                {/* Status Update Modal */}
                {showStatusModal && (
                    <StatusUpdateModal
                        peminjaman={peminjaman}
                        users={users}
                        onClose={() => setShowStatusModal(false)}
                    />
                )}
            </div>
        </AppLayout>
    );
}
