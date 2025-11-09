import { router } from "@inertiajs/react";
import { useState } from "react";
import { X } from "lucide-react";

interface Props {
    transaksi: {
        id: number;
        nama_pelanggan: string;
        status: string;
    };
    onClose: () => void;
}

export default function TransaksiStatusUpdateModal({
    transaksi,
    onClose,
}: Props) {
    const [status, setStatus] = useState(transaksi.status);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        router.patch(
            `/transaksi/${transaksi.id}/status`,
            { status },
            {
                preserveState: true,
                onSuccess: () => {
                    onClose();
                },
                onFinish: () => {
                    setIsSubmitting(false);
                },
            }
        );
    };

    const statusOptions = [
        {
            value: "verifikasi",
            label: "Verifikasi",
            color: "bg-yellow-100 text-yellow-800",
        },
        {
            value: "proses",
            label: "Proses",
            color: "bg-blue-100 text-blue-800",
        },
        {
            value: "sudah_siap",
            label: "Sudah Siap",
            color: "bg-indigo-100 text-indigo-800",
        },
        {
            value: "sudah_ambil",
            label: "Sudah Diambil",
            color: "bg-green-100 text-green-800",
        },
        {
            value: "dibatalkan",
            label: "Dibatalkan",
            color: "bg-red-100 text-red-800",
        },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Update Status Transaksi
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Pelanggan: {transaksi.nama_pelanggan}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Pilih Status Baru
                            </label>
                            <div className="space-y-2">
                                {statusOptions.map((option) => (
                                    <label
                                        key={option.value}
                                        className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                                            status === option.value
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-gray-200 hover:border-gray-300"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="status"
                                            value={option.value}
                                            checked={status === option.value}
                                            onChange={(e) =>
                                                setStatus(e.target.value)
                                            }
                                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="ml-3 flex items-center gap-2">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${option.color}`}
                                            >
                                                {option.label}
                                            </span>
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            disabled={isSubmitting}
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
