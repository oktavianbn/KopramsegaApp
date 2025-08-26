import { useState, useEffect } from "react";
import { Head, Link, router, useForm } from "@inertiajs/react";
import {
    ArrowLeft,
    Save,
    Package,
    FileText,
    Camera,
    Upload,
    X,
    Plus,
    Trash2,
    Settings,
    ImageIcon,
} from "lucide-react";
import AppLayout from "@/Layouts/AppLayout";

interface Spesifikasi {
    id?: number;
    key: string;
    value: string;
    description: string;
}

interface Barang {
    id: number;
    nama: string;
    deskripsi?: string;
    foto?: string;
    spesifikasi: Spesifikasi[];
}

interface Props {
    barang: Barang;
}

export default function Edit({ barang }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        nama: barang.nama || "",
        deskripsi: barang.deskripsi || "",
        foto: null as File | null,
        spesifikasi: barang.spesifikasi || [],
        _method: "PATCH",
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [currentPhoto, setCurrentPhoto] = useState<string | null>(
        barang.foto ? `/storage/${barang.foto}` : null
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("barang.update", barang.id), {
            forceFormData: true,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData("foto", file);

            // Create preview URL
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const removePhoto = () => {
        setData("foto", null);
        setPreviewUrl(null);
        // Reset the file input
        const fileInput = document.getElementById("foto") as HTMLInputElement;
        if (fileInput) {
            fileInput.value = "";
        }
    };

    const removeCurrentPhoto = () => {
        setCurrentPhoto(null);
        // You might want to add a flag to indicate photo should be deleted
        // For now, we'll handle this by setting foto to a special value
        setData("foto", "DELETE" as any);
    };

    // Spesifikasi functions
    const addSpesifikasi = () => {
        setData("spesifikasi", [
            ...data.spesifikasi,
            { key: "", value: "", description: "" },
        ]);
    };

    const removeSpesifikasi = (index: number) => {
        const newSpesifikasi = data.spesifikasi.filter((_, i) => i !== index);
        setData("spesifikasi", newSpesifikasi);
    };

    const updateSpesifikasi = (
        index: number,
        field: keyof Spesifikasi,
        value: string
    ) => {
        const newSpesifikasi = [...data.spesifikasi];
        (newSpesifikasi[index] as any)[field] = value;
        setData("spesifikasi", newSpesifikasi);
    };

    return (
        <AppLayout>
            <Head title={`Edit Barang - ${barang.nama}`} />

            <div className="min-h-screen bg-gray-50 p-6">
                <div className="mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col gap-1">
                                <h1 className="text-2xl font-bold text-gray-700">
                                    Edit Barang
                                </h1>
                                <h2 className="text-base font-medium text-gray-700">
                                    Inventory / Barang / Edit / {barang.nama}
                                </h2>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Nama Barang */}
                            <div>
                                <label
                                    htmlFor="nama"
                                    className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
                                >
                                    <Package className="h-4 w-4" />
                                    Nama Barang
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="nama"
                                    value={data.nama}
                                    onChange={(e) =>
                                        setData("nama", e.target.value)
                                    }
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.nama
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                    placeholder="Masukkan nama barang"
                                />
                                {errors.nama && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.nama}
                                    </p>
                                )}
                            </div>

                            {/* Deskripsi */}
                            <div>
                                <label
                                    htmlFor="deskripsi"
                                    className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
                                >
                                    <FileText className="h-4 w-4" />
                                    Deskripsi
                                </label>
                                <textarea
                                    id="deskripsi"
                                    value={data.deskripsi}
                                    onChange={(e) =>
                                        setData("deskripsi", e.target.value)
                                    }
                                    rows={4}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.deskripsi
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                    placeholder="Masukkan deskripsi barang (opsional)"
                                />
                                {errors.deskripsi && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.deskripsi}
                                    </p>
                                )}
                            </div>

                            {/* Foto Upload - Improved UI */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <Camera className="h-4 w-4" />
                                    Foto Barang
                                </label>

                                <div
                                    className={`border rounded-lg p-4 ${
                                        errors.foto
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                >
                                    {/* Current Photo */}
                                    {currentPhoto && !previewUrl && (
                                        <div className="space-y-4 mb-4">
                                            <div className="flex items-start gap-4">
                                                <div className="relative">
                                                    <img
                                                        src={currentPhoto}
                                                        alt="Current"
                                                        className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={
                                                            removeCurrentPhoto
                                                        }
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900 mb-1">
                                                        Foto saat ini
                                                    </p>
                                                    <p className="text-xs text-gray-500 mb-2">
                                                        Klik tombol X untuk
                                                        menghapus foto
                                                    </p>
                                                    <label
                                                        htmlFor="foto"
                                                        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer transition-colors"
                                                    >
                                                        <Upload className="h-3 w-3" />
                                                        Ganti Foto
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* New Photo Preview */}
                                    {previewUrl && (
                                        <div className="space-y-4 mb-4">
                                            <div className="flex items-start gap-4">
                                                <div className="relative">
                                                    <img
                                                        src={previewUrl}
                                                        alt="Preview"
                                                        className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={removePhoto}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900 mb-1">
                                                        Foto baru
                                                    </p>
                                                    <p className="text-xs text-gray-500 mb-2">
                                                        {data.foto?.name} (
                                                        {Math.round(
                                                            (data.foto?.size ||
                                                                0) / 1024
                                                        )}{" "}
                                                        KB)
                                                    </p>
                                                    <label
                                                        htmlFor="foto"
                                                        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors"
                                                    >
                                                        <Upload className="h-3 w-3" />
                                                        Ganti Foto
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Upload Area - Only show if no current photo or preview */}
                                    {!currentPhoto && !previewUrl && (
                                        <label
                                            htmlFor="foto"
                                            className="flex flex-col items-center justify-center py-8 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                                        >
                                            <div className="flex flex-col items-center text-center">
                                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                                    <ImageIcon className="w-6 h-6 text-gray-400" />
                                                </div>
                                                <p className="text-sm font-medium text-gray-900 mb-1">
                                                    Upload foto barang
                                                </p>
                                                <p className="text-xs text-gray-500 mb-2">
                                                    Klik untuk memilih file atau
                                                    drag & drop
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    PNG, JPG, JPEG (Maks. 2MB)
                                                </p>
                                            </div>
                                        </label>
                                    )}

                                    <input
                                        id="foto"
                                        type="file"
                                        className="hidden"
                                        accept="image/png,image/jpg,image/jpeg"
                                        onChange={handleFileChange}
                                    />
                                </div>

                                {errors.foto && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.foto}
                                    </p>
                                )}
                                <p className="mt-2 text-xs text-gray-500">
                                    Opsional - foto untuk identifikasi barang
                                </p>
                            </div>

                            {/* Spesifikasi Section - Improved UI */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                        <Settings className="h-4 w-4" />
                                        Spesifikasi Barang
                                    </label>
                                    <button
                                        type="button"
                                        onClick={addSpesifikasi}
                                        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                        <Plus className="h-3 w-3" />
                                        Tambah Spesifikasi
                                    </button>
                                </div>

                                <div className="border rounded-lg border-gray-300">
                                    {data.spesifikasi.length === 0 ? (
                                        <div className="p-8 text-center text-gray-500">
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <Settings className="h-6 w-6 text-gray-400" />
                                            </div>
                                            <p className="text-sm font-medium text-gray-900 mb-1">
                                                Belum ada spesifikasi
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Klik "Tambah Spesifikasi" untuk
                                                menambahkan detail barang
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-gray-200">
                                            {data.spesifikasi.map(
                                                (spec, index) => (
                                                    <div
                                                        key={index}
                                                        className="p-4"
                                                    >
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            {/* Key */}
                                                            <div>
                                                                <label className="block text-xs font-medium text-gray-700 mb-2">
                                                                    Key/Nama
                                                                    Spesifikasi
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={
                                                                        spec.key
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        updateSpesifikasi(
                                                                            index,
                                                                            "key",
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    placeholder="Contoh: Warna, Ukuran, Berat"
                                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                />
                                                            </div>

                                                            {/* Value */}
                                                            <div>
                                                                <label className="block text-xs font-medium text-gray-700 mb-2">
                                                                    Value/Nilai
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={
                                                                        spec.value
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        updateSpesifikasi(
                                                                            index,
                                                                            "value",
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    placeholder="Contoh: Merah, 30cm, 2kg"
                                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                />
                                                            </div>

                                                            {/* Description */}
                                                            <div>
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <label className="block text-xs font-medium text-gray-700">
                                                                        Deskripsi
                                                                        (Opsional)
                                                                    </label>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            removeSpesifikasi(
                                                                                index
                                                                            )
                                                                        }
                                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                                                                        title="Hapus spesifikasi"
                                                                    >
                                                                        <Trash2 className="h-3 w-3" />
                                                                    </button>
                                                                </div>
                                                                <input
                                                                    type="text"
                                                                    value={
                                                                        spec.description ||
                                                                        ""
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        updateSpesifikasi(
                                                                            index,
                                                                            "description",
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    placeholder="Deskripsi tambahan"
                                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )}
                                </div>

                                <p className="mt-2 text-xs text-gray-500">
                                    Spesifikasi membantu memberikan detail lebih
                                    lengkap tentang barang
                                </p>
                            </div>

                            {/* Form Actions */}
                            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
                                <Link
                                    href="/barang"
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Save className="h-4 w-4" />
                                    {processing
                                        ? "Menyimpan..."
                                        : "Update Barang"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
