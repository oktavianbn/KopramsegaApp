"use client";

import AppLayout from "@/Layouts/AppLayout";
import StatusUpdateModal from "@/Components/StatusUpdateModal";
import { Head, Link } from "@inertiajs/react";
import {
    ArrowLeft,
    User,
    Calendar,
    Package,
    Camera,
    Phone,
    MapPin,
    Clock,
    CheckCircle,
    XCircle,
    Edit,
    Eye,
} from "lucide-react";
import { useState } from "react";

interface DetailItem {
    id: number;
    jumlah: number;
    jumlah_kembali?: number;
    jumlah_hilang?: number;
    barang?: {
        id: number;
        nama: string;
        foto?: string;
    } | null;
    spesifikasi?: {
        id: number;
        key: string;
        value: string;
    } | null;
}

interface UserInterface {
    id: number;
    name: string;
}

interface Transaksi {
    id: number;
    nama: string;
    alamat?: string;
    no_telp?: string;
    diantar: boolean;
    tujuan?: string;
    status: "verifikasi" | "proses" | "sudah_siap" | "sudah_ambil" | "dibatalkan";
    total_harga?: number;
    catatan?: string | null;
    detail?: DetailItem[];
    foto_barang_diambil?: string | null;
    foto_barang_kembali?: string | null;
    pelanggan?: { id: number; name: string } | null;
    created_at?: string | null;
    updated_at?: string | null;
}

interface Props {
    transaksi: Transaksi;
    users: UserInterface[];
}

export default function Show({ transaksi, users }: Props) {
    // compatibility alias for templates still using peminjaman
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const peminjaman: any = transaksi as any;

    const [showImageModal, setShowImageModal] = useState<string | null>(null);
    const [showStatusModal, setShowStatusModal] = useState<string | boolean | null>(false);

    const getStatusBadge = (status: string) => {
        const statusConfig: any = {
            verifikasi: { color: "bg-yellow-100 text-yellow-800", icon: Clock, text: "Verifikasi" },
            proses: { color: "bg-blue-100 text-blue-800", icon: CheckCircle, text: "Proses" },
            sudah_siap: { color: "bg-indigo-100 text-indigo-800", icon: CheckCircle, text: "Sudah Siap" },
            sudah_ambil: { color: "bg-green-100 text-green-800", icon: Package, text: "Sudah Diambil" },
            dibatalkan: { color: "bg-red-100 text-red-800", icon: XCircle, text: "Dibatalkan" },
        };
        const cfg = (statusConfig as any)[status] || statusConfig.proses;
        const Icon = cfg.icon;
        return (
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${cfg.color}`}>
                <Icon className="w-4 h-4" />
                {cfg.text}
            </span>
        );
    };

    const getDiantarBadge = (diantar?: boolean) => (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${diantar ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"}`}>
            {diantar ? "Diantar" : "Ambil"}
        </span>
    );

    const totalItems = (peminjaman.detail || []).reduce((s: number, d: any) => s + (d.jumlah || 0), 0);

    // Map transaksi -> peminjaman shape expected by StatusUpdateModal
    const mappedPeminjaman = {
        id: peminjaman.id,
        nama_peminjam: peminjaman.pelanggan?.name || peminjaman.nama || "-",
        status: ((): any => {
            switch (peminjaman.status) {
                case "verifikasi":
                    return "pending";
                case "proses":
                    return "disetujui";
                case "sudah_siap":
                    return "disetujui";
                case "sudah_ambil":
                    return "sudah_ambil";
                case "dibatalkan":
                    return "dibatalkan";
                default:
                    return "pending";
            }
        })(),
        pemberi_user: undefined,
        penerima_user: undefined,
        detail_peminjaman: (peminjaman.detail || []).map((d: any) => ({
            id: d.id,
            jumlah: d.jumlah,
            barang: { nama: d.barang?.nama || d.menu?.nama || "" },
            spesifikasi: d.spesifikasi || null,
        })),
    };

    return (
        <AppLayout>
            <Head title={`Detail Transaksi - ${peminjaman.pelanggan?.name || peminjaman.nama || "-"}`} />

            <div className="p-6">
                <div className="grid gap-2 md:flex items-center justify-between mb-6">
                    <div className="flex gap-6 items-center">
                        <Link href="/transaksi" className="p-2 h-max bg-gray-200 rounded-lg flex justify-center items-center">
                            <ArrowLeft className="h-5 w-5 text-gray-500" />
                        </Link>
                        <div className="flex flex-col gap-2">
                            <h1 className="text-2xl font-bold text-gray-700 whitespace-nowrap">Data Transaksi</h1>
                            <h2 className="text-base font-medium text-gray-700 whitespace-nowrap">Inventory / Transaksi / Lihat Data</h2>
                        </div>
                    </div>

                    {peminjaman.status !== "dibatalkan" && (
                        <div className="flex items-center gap-3">
                            {peminjaman.status === "proses" && (
                                <button onClick={() => setShowStatusModal("sudah_ambil")} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"><Package className="w-4 h-4" />Sudah Diambil</button>
                            )}

                            {peminjaman.status === "sudah_ambil" && (
                                // open modal with status 'sudah_kembali' which the modal recognizes
                                <button onClick={() => setShowStatusModal("sudah_kembali")} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"><CheckCircle className="w-4 h-4" />Sudah Kembali</button>
                            )}

                            <button onClick={() => setShowStatusModal(true)} className="flex items-center gap-2 bg-gray-200 text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-300 transition-colors"><Edit className="w-4 h-4" />Update Status</button>
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
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><User className="w-5 h-5" />Informasi Pelanggan</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Nama</label>
                                <p className="text-gray-900 font-medium">{peminjaman.pelanggan?.name || peminjaman.nama || "-"}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500">Nomor Telepon</label>
                                <p className="text-gray-900 flex items-center gap-1"><Phone className="w-4 h-4" />{peminjaman.pelanggan?.no_hp || peminjaman.no_telp || "-"}</p>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-500">Tujuan Pengiriman</label>
                                <p className="text-gray-900 flex items-start gap-1"><MapPin className="w-4 h-4 mt-0.5" />{peminjaman.tujuan || peminjaman.alamat || "-"}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500">Catatan</label>
                                <p className="text-gray-900">{peminjaman.catatan || "-"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Calendar className="w-5 h-5" />Timeline Transaksi</h2>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <div>
                                    <p className="text-sm font-medium">Dibuat</p>
                                    <p className="text-sm text-gray-500">{peminjaman.created_at ? new Date(peminjaman.created_at).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : "-"}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                <div>
                                    <p className="text-sm font-medium">Terakhir Diubah</p>
                                    <p className="text-sm text-gray-500">{peminjaman.updated_at ? new Date(peminjaman.updated_at).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : "-"}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${peminjaman.diantar ? "bg-green-500" : "bg-red-500"}`}></div>
                                <div>
                                    <p className="text-sm font-medium">Status Pengembalian</p>
                                    <p className="text-sm text-gray-500">{peminjaman.status}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border p-6 mt-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Package className="w-5 h-5" /> Detail Barang ({totalItems} item)</h2>

                        <div className="space-y-4">
                            {(peminjaman.detail || []).map((detail: DetailItem, index: number) => (
                                <div className="flex w-full space-x-4" key={index}>
                                    <div className="flex items-center justify-between p-4 border rounded-lg flex-1">
                                        <div>
                                            <h4 className="font-medium text-gray-900">{detail.barang?.nama || "-"}</h4>
                                            {detail.spesifikasi && (
                                                <p className="text-sm text-gray-600">{detail.spesifikasi.key}: {detail.spesifikasi.value}</p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <span className="text-lg font-semibold text-gray-900">{detail.jumlah}</span>
                                            <p className="text-sm text-gray-500">Buah / Unit</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 border rounded-lg space-x-2">
                                        <div className="text-end">
                                            <p className="text-sm text-blue-500 font-normal mt-1 text-start">Kembali</p>
                                            <div className="flex space-x-2">
                                                <span className="text-lg font-semibold text-gray-900 ">{peminjaman.status === 'sudah_ambil' ? (detail.jumlah_kembali ?? 0) : '-'}</span>
                                                <p className="text-sm text-gray-500 font-normal mt-1">Buah / Unit</p>
                                            </div>
                                        </div>

                                        {(peminjaman.status === 'sudah_ambil' && detail.jumlah_hilang && detail.jumlah_hilang > 0) ? (
                                            <div className="h-full flex space-x-2">
                                                <div className="bg-gray-500 h-full w-0.5 rounded-sm"></div>
                                                <div className="text-end">
                                                    <p className="text-sm text-red-500 font-normal mt-1 text-start">Hilang</p>
                                                    <div className="flex space-x-2">
                                                        <span className="text-lg font-semibold text-gray-900 ">{detail.jumlah_hilang}</span>
                                                        <p className="text-sm text-gray-500 font-normal mt-1">Buah / Unit</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : null}

                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border p-6 mt-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Camera className="w-5 h-5" /> Dokumentasi Barang</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">Foto Barang Diambil</label>
                                {peminjaman.foto_barang_diambil ? (
                                    <button onClick={() => setShowImageModal(`/storage/${peminjaman.foto_barang_diambil}`)} className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
                                        <div className="flex flex-col items-center">
                                            <Camera className="w-8 h-8 text-gray-400 mb-2" />
                                            <span className="text-sm text-blue-600">Lihat Foto</span>
                                        </div>
                                    </button>
                                ) : (
                                    <div className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-sm text-gray-400">Barang belum diambil <br />(Foto belum tersedia)</div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">Foto Barang Kembali</label>
                                {peminjaman.foto_barang_kembali ? (
                                    <button onClick={() => setShowImageModal(`/storage/${peminjaman.foto_barang_kembali}`)} className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
                                        <div className="flex flex-col items-center">
                                            <Camera className="w-8 h-8 text-gray-400 mb-2" />
                                            <span className="text-sm text-blue-600">Lihat Foto</span>
                                        </div>
                                    </button>
                                ) : (
                                    <div className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-sm text-gray-400">Barang belum dikembalikan <br />(Foto belum tersedia)</div>
                                )}
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
                                peminjaman={mappedPeminjaman as any}
                                users={users}
                                onClose={() => setShowStatusModal(false)}
                                // narrow the type so it matches the expected union in the modal
                                initialStatus={
                                    typeof showStatusModal === "string"
                                        ? (showStatusModal as
                                                | "pending"
                                                | "disetujui"
                                                | "sudah_ambil"
                                                | "sudah_kembali"
                                                | "dibatalkan")
                                        : null
                                }
                            />
                        )}

            </div>
        </AppLayout>
    );
}
