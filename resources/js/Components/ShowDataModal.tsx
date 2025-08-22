"use client"

import { X, FileText, Calendar, User, Mail, Hash, Tag, Clock } from "lucide-react"

interface ShowDataModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: {
        id: number;
        judul_surat: string;
        nomor_surat: string;
        jenis: "m" | "k";
        pengirim?: string;
        penerima?: string;
        tanggal_surat: string;
        keterangan: string;
        file_path?: string;
        created_at: string;
        updated_at: string;
    };
}

export function ShowDataModal({ isOpen, onClose, data }: ShowDataModalProps) {

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        })
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
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white">

                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <FileText className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Detail Surat</h2>
                                <p className="text-sm text-gray-500">Informasi lengkap surat</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <X className="h-5 w-5 text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Title */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Judul Surat</label>
                        <p className="text-gray-900 bg-gray-50 p-4 rounded-lg text-lg font-medium">{data.judul_surat}</p>
                    </div>
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <Hash className="h-4 w-4" />
                                    Nomor Surat
                                </label>
                                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg font-mono">{data.nomor_surat}</p>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <Tag className="h-4 w-4" />
                                    Jenis Surat
                                </label>
                                <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${data.jenis === "m" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                                >
                                    {data.jenis === "m" ? "Surat Masuk" : "Surat Keluar"}
                                </span>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <Calendar className="h-4 w-4" />
                                    Tanggal Surat
                                </label>
                                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{formatDate(data.tanggal_surat)}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <User className="h-4 w-4" />
                                    Pengirim
                                </label>
                                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{data.pengirim || "-"}</p>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <Mail className="h-4 w-4" />
                                    Penerima
                                </label>
                                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{data.penerima || "-"}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">File Surat</label>
                                {data.file_path ? (
                                    <a
                                        href={`/storage/${data.file_path}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <FileText className="h-4 w-4" />
                                        Lihat File Surat
                                    </a>
                                ) : (
                                    <p className="text-gray-500 italic">Tidak ada file</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Keterangan</label>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-900 leading-relaxed">{data.keterangan}</p>
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
