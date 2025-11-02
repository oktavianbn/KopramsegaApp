import { PageHeader } from "@/Components/ui/page-header";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Camera, ImageIcon, Save, Upload, X } from "lucide-react";
import { FormEventHandler, useState } from "react";

interface FormData {
    id: number;
    nama_sangga: string;
    logo_path: File | null;
}

export default function Create() {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        id: 0,
        nama_sangga: "",
        logo_path: null,
    });
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    // handle file input

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post("/sangga");
    };

    const handleFileChange = (field: "logo_path", file: File | null) => {
        setData(field, file);
    };

    return (
        <AppLayout>
            <Head title="Tambah Data Sangga" />
            <div className="p-6">
                {/* Header */}
                <PageHeader
                    title="Sangga"
                    subtitle="Daftar / Tambah Data"
                    backHref="/sangga"
                    backIcon={ArrowLeft}
                />

                {/* Form */}
                <div className="bg-white rounded-lg shadow p-6">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                            <div className="max-md:col-span-2">
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Nama Sangga{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={data.nama_sangga}
                                    onChange={(e) =>
                                        setData("nama_sangga", e.target.value)
                                    }
                                    placeholder="sangga"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg
                                        focus:outline-none focus:ring-2 focus:ring-blue-500
                                        focus:border-transparent"
                                    required
                                />
                                {errors.nama_sangga && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.nama_sangga}
                                    </p>
                                )}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        <Camera className="h-4 w-4" />
                                        Foto Identitas{" "}
                                        <span className="text-red-500">*</span>
                                    </label>

                                    <div
                                        className={`border rounded-lg p-4 ${
                                            errors.logo_path
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                    >
                                        {previewUrl ? (
                                            <div className="space-y-4">
                                                <div className="flex items-start gap-4">
                                                    <div className="relative">
                                                        <img
                                                            src={previewUrl}
                                                            alt="Preview"
                                                            className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                handleFileChange(
                                                                    "logo_path",
                                                                    null
                                                                );
                                                                setPreviewUrl(
                                                                    null
                                                                );
                                                            }}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-gray-900 mb-1">
                                                            Foto berhasil
                                                            dipilih
                                                        </p>
                                                        <p className="text-xs text-gray-500 mb-2">
                                                            {
                                                                data.logo_path
                                                                    ?.name
                                                            }{" "}
                                                            (
                                                            {Math.round(
                                                                (data.logo_path
                                                                    ?.size ||
                                                                    0) / 1024
                                                            )}{" "}
                                                            KB)
                                                        </p>
                                                        <label
                                                            htmlFor="logo_path"
                                                            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors"
                                                        >
                                                            <Upload className="h-3 w-3" />
                                                            Ganti Foto
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <label
                                                htmlFor="logo_path"
                                                className="flex flex-col items-center justify-center py-8 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                                            >
                                                <div className="flex flex-col items-center text-center">
                                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                                        <ImageIcon className="w-6 h-6 text-gray-400" />
                                                    </div>
                                                    <p className="text-sm font-medium text-gray-900 mb-1">
                                                        Upload foto identitas
                                                    </p>
                                                    <p className="text-xs text-gray-500 mb-2">
                                                        Klik untuk memilih file
                                                        atau drag & drop
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        PNG, JPG, JPEG (Maks.
                                                        2MB)
                                                    </p>
                                                </div>
                                            </label>
                                        )}
                                        <input
                                            id="logo_path"
                                            type="file"
                                            className="hidden"
                                            accept="image/png,image/jpg,image/jpeg"
                                            onChange={(e) => {
                                                const file =
                                                    e.target.files?.[0] || null;
                                                handleFileChange(
                                                    "logo_path",
                                                    file
                                                );

                                                if (file) {
                                                    const reader =
                                                        new FileReader();
                                                    reader.onload = (event) => {
                                                        const result =
                                                            event.target
                                                                ?.result;
                                                        if (
                                                            typeof result ===
                                                            "string"
                                                        ) {
                                                            setPreviewUrl(
                                                                result
                                                            );
                                                        }
                                                    };
                                                    reader.readAsDataURL(file);
                                                } else {
                                                    setPreviewUrl(null);
                                                }
                                            }}
                                            required
                                        />
                                    </div>

                                    {errors.logo_path && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.logo_path}
                                        </p>
                                    )}
                                    <p className="mt-2 text-xs text-gray-500">
                                        Wajib - gunakan foto yang jelas
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex items-center justify-end gap-4 pt-6 border-t">
                            <Link
                                href="/sangga"
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                <Save className="h-4 w-4" />
                                {processing ? "Menyimpan..." : "Simpan"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
