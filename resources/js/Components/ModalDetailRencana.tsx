"use client"

import { X, FileText, Calendar, User, Mail, Hash, Tag, Clock } from "lucide-react"

interface ModalDetailRencanaProps {
    isOpen: boolean;
    onClose: () => void;
    data: {
        id: number;
        nama_rencana: string;
        deskripsi?: string;
        tanggal_mulai: string;
        tanggal_selesai?: string;
        status: "belum_dimulai" | "sedang_dilaksanakan" | "selesai";
        role_id: number;
        created_at: string;
        updated_at: string;
    };
}

export function ModalDetailRencana({ isOpen, onClose, data }: ModalDetailRencanaProps) {

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
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Nama Rencana</label>
                        <p className="text-gray-900 bg-gray-50 p-4 rounded-lg text-lg font-medium">{data.nama_rencana}</p>
                    </div>

                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <Calendar className="h-4 w-4" />
                                    Tanggal Mulai
                                </label>
                                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{formatDate(data.tanggal_mulai)}</p>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <Calendar className="h-4 w-4" />
                                    Tanggal Selesai
                                </label>
                                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                                    {data.tanggal_selesai ? formatDate(data.tanggal_selesai) : "-"}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <Tag className="h-4 w-4" />
                                    Status
                                </label>
                                <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
          ${data.status === "belum_dimulai" ? "bg-gray-100 text-gray-800" : ""}
          ${data.status === "sedang_dilaksanakan" ? "bg-blue-100 text-blue-800" : ""}
          ${data.status === "selesai" ? "bg-green-100 text-green-800" : ""}
        `}
                                >
                                    {data.status.replace("_", " ")}
                                </span>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <User className="h-4 w-4" />
                                    Role
                                </label>
                                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{data.role_id} Diganti</p>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Deskripsi</label>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-900 leading-relaxed">{data.deskripsi || "-"}</p>
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
