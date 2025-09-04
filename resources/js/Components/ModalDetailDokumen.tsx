"use client"

import { cn } from "@/lib/utils"
import { Calendar, Camera, Clock, Link as LinkIcon, List, SwitchCamera, X } from "lucide-react"
import { useState } from "react"

interface DokumenFile {
    nama_asli: string;
    nama_tersimpan: string;
}

interface ModalDetailDokumen {
    id: number;
    nama: string;
    tanggal_dokumen: string;
    keterangan?: string;
    file?: DokumenFile[]; // ubah jadi array of object
    created_at: string;
    updated_at: string;
}

interface ModalDetailDokumenProps {
    isOpen: boolean
    onClose: () => void
    data: ModalDetailDokumen
}

export function ModalDetailDokumen({ isOpen, onClose, data }: ModalDetailDokumenProps) {
    const [activeTab, setActiveTab] = useState<"info" | "file">("info")
    const [showPrefiewModal, setShowPrefiewModal] = useState<string | null>(null);

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const formatDateTimeTwo = (dateString: string) => {
        return new Date(dateString).toLocaleString("id-ID", {
            year: "numeric",
            month: "numeric",
            day: "numeric"
        })
    }

    const removeFileExtension = (filename: string) => {
        return filename.replace(/\.[^/.]+$/, "");
    };


    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">

                {/* Header */}
                <div className="sticky top-0 bg-white z-10">
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <SwitchCamera className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Detail Dokumen</h2>
                                <p className="text-sm text-gray-500">Informasi lengkap dokumen</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="h-5 w-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6">
                            <button
                                onClick={() => setActiveTab("info")}
                                className={cn(
                                    "py-4 px-1 border-b-2 font-medium text-sm",
                                    activeTab === "info"
                                        ? "border-blue-500 text-blue-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                )}
                            >
                                Keterangan
                            </button>
                            <button
                                onClick={() => setActiveTab("file")}
                                className={cn(
                                    "py-4 px-1 border-b-2 font-medium text-sm",
                                    activeTab === "file"
                                        ? "border-blue-500 text-blue-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                )}
                            >
                                Daftar Dokumen
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
                    {activeTab === "info" && (
                        <div className="space-y-6">
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">Nama Dokumen</label>
                                <p className="text-gray-900 bg-gray-50 p-4 rounded-lg text-lg font-medium">
                                    {data.nama}
                                </p>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <Calendar className="h-4 w-4" />
                                    Tanggal
                                </label>
                                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{formatDateTimeTwo(data.tanggal_dokumen)}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">Keterangan</label>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-gray-900 leading-relaxed">
                                        {data.keterangan || "-"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "file" && (
                        <div className="space-y-4">
                            {data.file && data.file.length > 0 ? (
                                <ol className="list-decimal pl-6 space-y-2">
                                    {data.file.map((file, index) => (
                                        <li key={index}>
                                            <button
                                                onClick={() =>
                                                    setShowPrefiewModal(`/storage/${file.nama_tersimpan}`)
                                                }
                                                className="text-blue-600 hover:underline flex items-center gap-2 text-start md:whitespace-nowrap pr-6"
                                            >
                                                <LinkIcon className="h-4 w-4" />
                                                {file.nama_asli}
                                            </button>
                                        </li>
                                    ))}
                                </ol>
                            ) : (
                                <div className="text-center py-8">
                                    <List className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                                    <p className="text-gray-500">Tidak ada link dokumen tersedia</p>
                                </div>
                            )}

                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                            <Clock className="h-4 w-4" />
                            Dibuat Pada
                        </label>
                        <p className="text-gray-600 text-sm">{formatDateTime(data.created_at)}</p>
                    </div>
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                            <Clock className="h-4 w-4" />
                            Diperbarui Pada
                        </label>
                        <p className="text-gray-600 text-sm">{formatDateTime(data.updated_at)}</p>
                    </div>
                </div>
            </div>
            {/* Prefiew Modal */}
            {showPrefiewModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="relative max-w-4xl max-h-[90vh] p-4 bg-white rounded-lg">
                        <button
                            onClick={() => setShowPrefiewModal(null)}
                            className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
                        >
                            ✕
                        </button>

                        {/* Cek tipe file */}
                        {/\.(jpg|jpeg|png|gif)$/i.test(showPrefiewModal ?? "") ? (
                            <img
                                src={showPrefiewModal}
                                alt="Preview"
                                className="max-w-full max-h-[80vh] object-contain rounded-lg"
                            />
                        ) : /\.(pdf)$/i.test(showPrefiewModal ?? "") ? (
                            <div className="overflow-x-scroll">
                                <iframe
                                    src={showPrefiewModal}
                                    className="w-[80vw] h-[80vh] rounded-lg"
                                />
                            </div>
                        ) : /\.(docx?|xlsx?)$/i.test(showPrefiewModal ?? "") ? (
                            <div className="flex flex-col items-start gap-4 mr-10">
                                {/* Buka di Tab Baru */}
                                <a
                                    href={removeFileExtension(showPrefiewModal)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                >
                                    Buka di Tab Baru
                                </a>

                                {/* Unduh dengan nama asli */}
                                <a
                                    href={showPrefiewModal}
                                    download={data.file?.find(f => `/storage/${f.nama_tersimpan}` === showPrefiewModal)?.nama_asli || "dokumen"}
                                    className="text-green-600 underline"
                                >
                                    Unduh
                                </a>
                            </div>

                        ) : (
                            <p className="text-gray-700">Format file tidak didukung</p>
                        )}

                    </div>
                </div>
            )}

        </div>
    )
}
