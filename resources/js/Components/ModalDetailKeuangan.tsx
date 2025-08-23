"use client"

import { X, Calendar, Tag, Clock, DollarSign, StickyNote, ArrowUpDown } from "lucide-react"

interface KeuanganData {
    id: number;
    jumlah: number;
    tipe: "m" | "k";
    jenis_pemasukkan?: "k" | "u" | "a" | null;
    catatan?: string | null;
    created_at: string;
    updated_at: string;
}

interface ModalDetailKeuanganProps {
    isOpen: boolean;
    onClose: () => void;
    data: KeuanganData;
}

export function ModalDetailKeuangan({ isOpen, onClose, data }: ModalDetailKeuanganProps) {

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white">
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <DollarSign className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Detail Keuangan</h2>
                                <p className="text-sm text-gray-500">Informasi lengkap transaksi</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="h-5 w-5 text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Nominal */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 gap-2 flex"><DollarSign className="h-4 w-4" />Nomnal Uang</label>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg font-mono">
                            {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 2 })
                                .format(data.jumlah)}
                        </p>
                    </div>

                    {/* Informasi Utama */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <ArrowUpDown className="h-4 w-4" />
                                Tipe
                            </label>
                            <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${data.tipe === "m"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                    }`}
                            >
                                {data.tipe === "m" ? "Pemasukkan" : "Penelkuaran"}
                            </span>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <Tag className="h-4 w-4" />
                                Jenis Pemasukkan
                            </label>
                            <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                                    ${data.jenis_pemasukkan === "k" ? "bg-blue-100 text-blue-800" : data.jenis_pemasukkan === "u" ? "bg-gray-100 text-gray-800" : data.jenis_pemasukkan === "a" ? "bg-yellow-100 text-yellow-800" : "bg-neutral-100 text-neutral-800"}`}
                            >
                                {data.jenis_pemasukkan === "k" ? "Kas" : data.jenis_pemasukkan === "u" ? "Usaha Dana" : data.jenis_pemasukkan === "a" ? "Anggaran" : "-"}
                            </span>
                        </div>
                    </div>

                    {/* Keterangan */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <StickyNote className="h-4 w-4" />
                            Keterangan
                        </label>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-900 leading-relaxed">{data.catatan || "-"}</p>
                        </div>
                    </div>

                    {/* Timestamps */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <Clock className="h-4 w-4" />
                                Dibuat Pada
                            </label>
                            <p className="text-gray-600 text-sm">{formatDateTime(data.created_at)}</p>
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <Clock className="h-4 w-4" />
                                Diperbarui Pada
                            </label>
                            <p className="text-gray-600 text-sm">{formatDateTime(data.updated_at)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
