"use client";

import type React from "react";

import { useState } from "react";
import { X, Save, Clock, CheckCircle, XCircle, Package } from "lucide-react";
import { router } from "@inertiajs/react";

interface User {
    id: number;
    name: string;
}

interface DetailPeminjaman {
    id: number;
    stok_id: number;
    jumlah: number;
    jumlah_kembali?: number;
    stok: {
        barang: {
            nama: string;
        };
        spesifikasi?: {
            key: string;
            value: string;
        } | null;
    };
}

interface Peminjaman {
    id: number;
    nama_peminjam: string;
    status:
        | "pending"
        | "disetujui"
        | "sudah_ambil"
        | "sudah_kembali"
        | "dibatalkan";
    pemberi_user?: {
        id: number;
        name: string;
    };
    penerima_user?: {
        id: number;
        name: string;
    };
    detail_peminjaman: DetailPeminjaman[];
}

interface StatusUpdateModalProps {
    peminjaman: Peminjaman;
    users: User[];
    onClose: () => void;
}

export default function StatusUpdateModal({
    peminjaman,
    users,
    onClose,
}: StatusUpdateModalProps) {
    const [selectedStatus, setSelectedStatus] = useState(peminjaman.status);
    const [selectedPemberi, setSelectedPemberi] = useState(
        peminjaman.pemberi_user?.id || ""
    );
    const [selectedPenerima, setSelectedPenerima] = useState(
        peminjaman.penerima_user?.id || ""
    );
    const [fotoBarangDiambil, setFotoBarangDiambil] = useState<File | null>(
        null
    );
    const [fotoBarangKembali, setFotoBarangKembali] = useState<File | null>(
        null
    );
    const [detailKembali, setDetailKembali] = useState(
        peminjaman.detail_peminjaman.map((detail) => ({
            id: detail.id,
            jumlah_kembali: detail.jumlah,
        }))
    );
    const [isLoading, setIsLoading] = useState(false);

    const statusOptions = [
        {
            value: "pending",
            label: "Pending",
            icon: Clock,
            color: "text-yellow-600",
        },
        {
            value: "disetujui",
            label: "Disetujui",
            icon: CheckCircle,
            color: "text-blue-600",
        },
        {
            value: "sudah_ambil",
            label: "Sudah Diambil",
            icon: Package,
            color: "text-green-600",
        },
        {
            value: "sudah_kembali",
            label: "Sudah Kembali",
            icon: CheckCircle,
            color: "text-green-600",
        },
        {
            value: "dibatalkan",
            label: "Dibatalkan",
            icon: XCircle,
            color: "text-red-600",
        },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Use different approaches based on whether files are involved
            const hasFiles =
                (selectedStatus === "sudah_ambil" && fotoBarangDiambil) ||
                (selectedStatus === "sudah_kembali" && fotoBarangKembali);

            if (hasFiles) {
                // Use FormData for file uploads
                const formData = new FormData();
                formData.append("status", selectedStatus);

                if (selectedStatus === "sudah_ambil") {
                    if (selectedPemberi) {
                        formData.append("pemberi", selectedPemberi.toString());
                    }
                    if (fotoBarangDiambil) {
                        formData.append(
                            "foto_barang_diambil",
                            fotoBarangDiambil
                        );
                    }
                }

                if (selectedStatus === "sudah_kembali") {
                    if (selectedPenerima) {
                        formData.append(
                            "penerima",
                            selectedPenerima.toString()
                        );
                    }
                    if (fotoBarangKembali) {
                        formData.append(
                            "foto_barang_kembali",
                            fotoBarangKembali
                        );
                    }

                    // Add detail kembali
                    detailKembali.forEach((detail, index) => {
                        formData.append(
                            `detail_kembali[${index}][id]`,
                            detail.id.toString()
                        );
                        formData.append(
                            `detail_kembali[${index}][jumlah_kembali]`,
                            detail.jumlah_kembali.toString()
                        );
                    });
                }

                router.post(`/peminjaman/${peminjaman.id}/status`, formData, {
                    headers: {
                        "X-HTTP-Method-Override": "PATCH",
                    },
                    onSuccess: () => {
                        onClose();
                    },
                    onError: (error) => {
                        console.error("Error updating status:", error);
                    },
                    onFinish: () => {
                        setIsLoading(false);
                    },
                });
            } else {
                // Use regular data object for simple status updates
                const data: any = {
                    status: selectedStatus,
                };

                router.patch(`/peminjaman/${peminjaman.id}/status`, data, {
                    onSuccess: () => {
                        onClose();
                    },
                    onError: (error) => {
                        console.error("Error updating status:", error);
                    },
                    onFinish: () => {
                        setIsLoading(false);
                    },
                });
            }
        } catch (error) {
            console.error("Error updating status:", error);
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">
                        Update Status Peminjaman
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Peminjaman Info */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">
                            #{peminjaman.id} - {peminjaman.nama_peminjam}
                        </h3>
                        {peminjaman.pemberi_user && (
                            <p className="text-sm text-gray-600">
                                Admin Pemberi: {peminjaman.pemberi_user.name}
                            </p>
                        )}
                    </div>

                    {/* Status Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Status Baru
                        </label>
                        <div className="space-y-2">
                            {statusOptions.map((option) => {
                                const IconComponent = option.icon;
                                return (
                                    <label
                                        key={option.value}
                                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                                            selectedStatus === option.value
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-gray-200 hover:border-gray-300"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="status"
                                            value={option.value}
                                            checked={
                                                selectedStatus === option.value
                                            }
                                            onChange={(e) =>
                                                setSelectedStatus(
                                                    e.target.value as any
                                                )
                                            }
                                            className="sr-only"
                                        />
                                        <IconComponent
                                            className={`w-5 h-5 mr-3 ${option.color}`}
                                        />
                                        <span className="font-medium text-gray-900">
                                            {option.label}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* User Selection for certain statuses */}
                    {selectedStatus === "sudah_ambil" && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Admin Pemberi (Yang Menyerahkan Barang)
                                </label>
                                <select
                                    value={selectedPemberi}
                                    onChange={(e) =>
                                        setSelectedPemberi(e.target.value)
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">
                                        Pilih Admin Pemberi
                                    </option>
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Foto Barang yang Diambil
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setFotoBarangDiambil(
                                            e.target.files?.[0] || null
                                        )
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {selectedStatus === "sudah_kembali" && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Admin Penerima (Yang Menerima Barang
                                    Kembali)
                                </label>
                                <select
                                    value={selectedPenerima}
                                    onChange={(e) =>
                                        setSelectedPenerima(e.target.value)
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">
                                        Pilih Admin Penerima
                                    </option>
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Foto Barang yang Dikembalikan
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setFotoBarangKembali(
                                            e.target.files?.[0] || null
                                        )
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Detail Jumlah Barang yang Dikembalikan
                                </label>
                                <div className="space-y-3">
                                    {peminjaman.detail_peminjaman.map(
                                        (detail, index) => (
                                            <div
                                                key={detail.id}
                                                className="flex items-center justify-between p-3 border rounded-lg"
                                            >
                                                <div className="flex-1">
                                                    <p className="font-medium">
                                                        {
                                                            detail.stok.barang
                                                                .nama
                                                        }
                                                    </p>
                                                    {detail.stok
                                                        .spesifikasi && (
                                                        <p className="text-sm text-gray-500">
                                                            {
                                                                detail.stok
                                                                    .spesifikasi
                                                                    .key
                                                            }
                                                            :{" "}
                                                            {
                                                                detail.stok
                                                                    .spesifikasi
                                                                    .value
                                                            }
                                                        </p>
                                                    )}
                                                    <p className="text-sm text-gray-600">
                                                        Dipinjam:{" "}
                                                        {detail.jumlah}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <label className="text-sm">
                                                        Kembali:
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max={detail.jumlah}
                                                        value={
                                                            detailKembali[index]
                                                                ?.jumlah_kembali ||
                                                            0
                                                        }
                                                        onChange={(e) => {
                                                            const newDetailKembali =
                                                                [
                                                                    ...detailKembali,
                                                                ];
                                                            newDetailKembali[
                                                                index
                                                            ] = {
                                                                ...newDetailKembali[
                                                                    index
                                                                ],
                                                                jumlah_kembali:
                                                                    parseInt(
                                                                        e.target
                                                                            .value
                                                                    ) || 0,
                                                            };
                                                            setDetailKembali(
                                                                newDetailKembali
                                                            );
                                                        }}
                                                        className="w-20 px-2 py-1 border rounded"
                                                    />
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Simpan
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
