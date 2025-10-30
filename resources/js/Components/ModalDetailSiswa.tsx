"use client";

import {
    Calendar,
    Clock,
    FileText,
    Hash,
    Mail,
    Tag,
    User,
    X,
} from "lucide-react";
import { useState } from "react";
import ModalPreviewFile from "./ModalPrifiewFile";
import { cn } from "@/lib/utils";

interface Sangga{
    id: number;
    nama_sangga: string;
    logo_path: string | null;
}

interface ModalDetailArsipSuratProps {
    isOpen: boolean;
    onClose: () => void;
    data: {
        id: number;
        nis: string;
        nta: string;
        nama: string;
        kelas: string;
        jurusan: string;
        rombel: string;
        jenis_kelamin: string;
        sangga: Sangga | null;
        created_at: string;
        updated_at: string;
    };
}

export function ModalDetailArsipSurat({
    isOpen,
    onClose,
    data,
}: ModalDetailArsipSuratProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const [showPrefiewModal, setShowPrefiewModal] = useState<string | null>(
        null
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white">
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Mail className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Detail Surat
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Informasi lengkap surat
                                </p>
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
                    {/* Title */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Nama
                        </label>
                        <p className="text-gray-900 bg-gray-50 p-4 rounded-lg text-lg font-medium">
                            {data.nama}
                        </p>
                    </div>
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <Hash className="h-4 w-4" />
                                    NIS
                                </label>
                                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg font-mono">
                                    {data.nis}
                                </p>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <Hash className="h-4 w-4" />
                                    Kelas / Jurusan
                                </label>
                                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg font-mono">
                                    {data.kelas}{" "}{data.jurusan}{" "}{data.rombel?"-"+data.rombel:""}
                                </p>
                            </div>

                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <Hash className="h-4 w-4" />
                                    NTA
                                </label>
                                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg font-mono">
                                    {data.nta}
                                </p>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <Mail className="h-4 w-4" />
                                    Jenis Kelamin
                                </label>
                                <p className={cn("p-3 rounded-lg",data.jenis_kelamin==='l'?"text-blue-600 bg-blue-50":"text-pink-600 bg-pink-50")}>
                                    {data.jenis_kelamin==='l'?"Laki-laki":"Perempuan"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Sangga
                        </label>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-900 leading-relaxed">
                                {data.sangga?.nama_sangga || "Tidak ada sangga"}
                            </p>
                        </div>
                    </div>

                    {/* Timestamps */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <Clock className="h-4 w-4" />
                                Dibuat Pada
                            </label>
                            <p className="text-gray-600 text-sm">
                                {formatDateTime(data.created_at)}
                            </p>
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <Clock className="h-4 w-4" />
                                Diperbarui Pada
                            </label>
                            <p className="text-gray-600 text-sm">
                                {formatDateTime(data.updated_at)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            {showPrefiewModal && (
                <ModalPreviewFile
                    showPreviewModal={showPrefiewModal}
                    setShowPreviewModal={setShowPrefiewModal}
                    file={showPrefiewModal}
                />
            )}
        </div>
    );
}
