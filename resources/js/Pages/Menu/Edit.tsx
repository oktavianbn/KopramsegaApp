import { useState, useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import {
    ArrowLeft,
    Save,
    Package,
    Camera,
    Upload,
    X,
    DollarSign,
    Layers,
    Calendar,
    Image
} from "lucide-react";
import AppLayout from "@/Layouts/AppLayout";

interface Props {
    menu: any;
    sesis: any[];
}

export default function Edit({ menu, sesis }: Props) {
    const form = useForm({
        nama: menu.nama || "",
        harga: menu.harga ?? "",
        stok: menu.stok ?? "",
        foto: null as File | null,
        sesi_id: menu.sesi_id || "",
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(
        menu.foto ? `/storage/${menu.foto}` : null
    );

    useEffect(() => {
        if (menu.sesi_id) {
            form.setData('sesi_id', String(menu.sesi_id));
        }
    }, [menu]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(`/menu/${menu.id}`, {
            forceFormData: true,
            preserveState: true,
            _method: 'PUT'
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setData('foto', file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const removePhoto = () => {
        form.setData('foto', null);
        setPreviewUrl(menu.foto ? `/storage/${menu.foto}` : null);
        const fileInput = document.getElementById('foto') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = "";
        }
    };

    return (
        <AppLayout>
            <Head title={`Edit Menu: ${menu.nama}`} />

                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-6 items-center">
                                <button
                                    onClick={() => window.history.back()}
                                    className="p-2 h-max bg-gray-100 rounded-lg flex justify-center items-center hover:bg-gray-200 transition-colors"
                                >
                                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                                </button>
                                <div className="flex flex-col gap-2">
                                    <h1 className="text-2xl font-bold text-gray-700">
                                        Edit Menu
                                    </h1>
                                    <h2 className="text-base font-medium text-gray-700">
                                        Penjualan / Menu / Edit / {menu.nama}
                                    </h2>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Sesi Penjualan */}
                            <div>
                                <label
                                    htmlFor="sesi_id"
                                    className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
                                >
                                    <Calendar className="h-4 w-4" />
                                    Sesi Penjualan
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="sesi_id"
                                    value={form.data.sesi_id}
                                    onChange={(e) =>
                                        form.setData("sesi_id", e.target.value)
                                    }
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        form.errors.sesi_id
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                >
                                    <option value="">-- Pilih Sesi Penjualan --</option>
                                    {sesis.map((sesi) => (
                                        <option key={sesi.id} value={sesi.id}>
                                            {sesi.nama}
                                        </option>
                                    ))}
                                </select>
                                {form.errors.sesi_id && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {form.errors.sesi_id}
                                    </p>
                                )}
                            </div>

                            {/* Form Content - 2 Columns Layout */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-4">
                                    {/* Nama Menu */}
                                    <div>
                                        <label
                                            htmlFor="nama"
                                            className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
                                        >
                                            <Package className="h-4 w-4" />
                                            Nama Menu
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="nama"
                                            value={form.data.nama}
                                            onChange={(e) =>
                                                form.setData("nama", e.target.value)
                                            }
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                form.errors.nama
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            }`}
                                            placeholder="Masukkan nama menu"
                                        />
                                        {form.errors.nama && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {form.errors.nama}
                                            </p>
                                        )}
                                    </div>

                                    {/* Harga */}
                                    <div>
                                        <label
                                            htmlFor="harga"
                                            className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
                                        >
                                            <DollarSign className="h-4 w-4" />
                                            Harga
                                        </label>
                                        <input
                                            type="number"
                                            id="harga"
                                            value={form.data.harga}
                                            onChange={(e) =>
                                                form.setData("harga", e.target.value)
                                            }
                                            step="0.01"
                                            min="0"
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                form.errors.harga
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            }`}
                                            placeholder="0.00"
                                        />
                                        {form.errors.harga && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {form.errors.harga}
                                            </p>
                                        )}
                                    </div>

                                    {/* Stok */}
                                    <div>
                                        <label
                                            htmlFor="stok"
                                            className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
                                        >
                                            <Layers className="h-4 w-4" />
                                            Stok
                                        </label>
                                        <input
                                            type="number"
                                            id="stok"
                                            value={form.data.stok}
                                            onChange={(e) =>
                                                form.setData("stok", e.target.value)
                                            }
                                            min="0"
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                form.errors.stok
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            }`}
                                            placeholder="0"
                                        />
                                        {form.errors.stok && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {form.errors.stok}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Right Column - Foto */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        <Camera className="h-4 w-4" />
                                        Foto Menu
                                    </label>

                                    <div
                                        className={`border rounded-lg p-4 bg-white ${
                                            form.errors.foto
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
                                                            className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                                                        />
                                                        {form.data.foto && (
                                                            <button
                                                                type="button"
                                                                onClick={removePhoto}
                                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </button>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-gray-900 mb-1">
                                                            {form.data.foto
                                                                ? "Foto baru dipilih"
                                                                : "Foto saat ini"}
                                                        </p>
                                                        {form.data.foto && (
                                                            <p className="text-xs text-gray-500 mb-2">
                                                                {form.data.foto?.name} (
                                                                {Math.round(
                                                                    (form.data.foto?.size || 0) / 1024
                                                                )}{" "}
                                                                KB)
                                                            </p>
                                                        )}
                                                        <label
                                                            htmlFor="foto"
                                                            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors"
                                                        >
                                                            <Upload className="h-3 w-3" />
                                                            {form.data.foto ? "Ganti Foto" : "Upload Foto Baru"}
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <label
                                                htmlFor="foto"
                                                className="flex flex-col items-center justify-center py-8 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                                            >
                                                <div className="flex flex-col items-center text-center">
                                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                                        <Image className="w-6 h-6 text-gray-400" />
                                                    </div>
                                                    <p className="text-sm font-medium text-gray-900 mb-1">
                                                        Upload foto menu
                                                    </p>
                                                    <p className="text-xs text-gray-500 mb-2">
                                                        Klik untuk memilih file
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

                                    {form.errors.foto && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {form.errors.foto}
                                        </p>
                                    )}
                                    <p className="mt-2 text-xs text-gray-500">
                                        Kosongkan jika tidak ingin mengubah foto
                                    </p>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => window.history.back()}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Save className="h-4 w-4" />
                                    {form.processing ? "Menyimpan..." : "Simpan Perubahan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
        </AppLayout>
    );
}
