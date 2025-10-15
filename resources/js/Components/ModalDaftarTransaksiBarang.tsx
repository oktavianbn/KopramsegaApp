"use client"

import { ArrowUpDown, Calendar, Clock, FileText, Hash, Mail, Tag, User, X } from "lucide-react";
import { useState } from "react";
import ModalPreviewFile from "./ModalPrifiewFile";

interface TransaksiItem {
    id: number;
    tipe: 't' | 'k';
    peminjaman_id?: number | null;
    jumlah: number;
    keterangan: string;
    created_at: string;
}

interface ModalDaftarTransaksiBarangProps2 {
    isOpen: boolean;
    onClose: () => void;
    transactions: TransaksiItem[];
}

export function ModalDaftarTransaksiBarang({ isOpen, onClose, transactions }: ModalDaftarTransaksiBarangProps2) {

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    const formatToInteger = (value:any) => {
        if (value == null || isNaN(value)) return 0
        return Math.round(parseFloat(value))
    }

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
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] ">
                {/* Header */}
                <div className="sticky top-0 bg-white">

                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <ArrowUpDown className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Daftar Transaksi</h2>
                                <p className="text-sm text-gray-500">Informasi keluar/masuk barang</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <X className="h-5 w-5 text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {transactions.length === 0 ? (
                        <p className="text-sm text-gray-500">Tidak ada transaksi untuk kombinasi ini.</p>
                    ) : (
                        <div className="space-y-3 overflow-y-auto max-h-96">
                            {transactions.map((t) => (
                                <div key={t.id} className="p-3 border rounded-md flex justify-between items-center">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 rounded text-xs ${t.tipe === 'k' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                {t.tipe === 'k' ? 'Keluar' : 'Masuk'}
                                            </span>
                                            <span className="text-sm text-gray-700">{t.keterangan}</span>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">{formatDate(t.created_at)} — {t.peminjaman_id ? `Peminjaman #${t.peminjaman_id}` : 'Penyesuaian / Manual'}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-semibold">{formatToInteger(t.jumlah)}</div>
                                        <div className="text-xs text-gray-500">Buah / Unit</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
