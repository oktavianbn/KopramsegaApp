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
import { PageHeader } from "@/Components/ui/page-header";

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
        _method: "PATCH",
    });

    const anyForm = form as any;

    const [previewUrl, setPreviewUrl] = useState<string | null>(
        menu.foto ? `/storage/${menu.foto}` : null
    );

    useEffect(() => {
        if (menu.sesi_id) {
            form.setData((data) => ({ ...data, sesi_id: String(menu.sesi_id) } as any));
        }
    }, [menu]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Some servers (and Inertia) handle multipart more reliably when using POST with _method override
        // ensure _method is present (useForm initialized it) and send as FormData
        anyForm.post(`/menu/${menu.id}`, {
            forceFormData: true,
            preserveState: true,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            anyForm.setData('foto', file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const removePhoto = () => {
        anyForm.setData('foto', null);
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
                <PageHeader
                    title="Menu"
                    subtitle={`Daftar / Edit Data ${menu.nama}`}
                    backHref="/menu"
                    backIcon={ArrowLeft}
                />

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
                                        value={anyForm.data.sesi_id}
                                    onChange={(e) =>
                                        anyForm.setData("sesi_id", e.target.value)
                                    }
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        anyForm.errors.sesi_id
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                    disabled
                                >
                                    <option value="">-- Pilih Sesi Penjualan --</option>
                                    {sesis.map((sesi) => (
                                        <option key={sesi.id} value={sesi.id}>
                                            {sesi.nama}
                                        </option>
                                    ))}
                                </select>
                                {anyForm.errors.sesi_id && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {anyForm.errors.sesi_id}
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
                                            value={anyForm.data.nama}
                                            onChange={(e) =>
                                                anyForm.setData("nama", e.target.value)
                                            }
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                anyForm.errors.nama
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            }`}
                                            placeholder="Masukkan nama menu"
                                        />
                                        {anyForm.errors.nama && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {anyForm.errors.nama}
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
                                            value={anyForm.data.harga}
                                            onChange={(e) =>
                                                anyForm.setData("harga", e.target.value)
                                            }
                                            step="0.01"
                                            min="0"
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                anyForm.errors.harga
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            }`}
                                            placeholder="0.00"
                                        />
                                        {anyForm.errors.harga && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {anyForm.errors.harga}
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
                                            value={anyForm.data.stok}
                                            onChange={(e) =>
                                                anyForm.setData("stok", e.target.value)
                                            }
                                            min="0"
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                anyForm.errors.stok
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            }`}
                                            placeholder="0"
                                        />
                                        {anyForm.errors.stok && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {anyForm.errors.stok}
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
                                            anyForm.errors.foto
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
                                                        {anyForm.data.foto && (
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
                                                            {anyForm.data.foto
                                                                ? "Foto baru dipilih"
                                                                : "Foto saat ini"}
                                                        </p>
                                                        {anyForm.data.foto && (
                                                            <p className="text-xs text-gray-500 mb-2">
                                                                {anyForm.data.foto?.name} (
                                                                {Math.round(
                                                                    (anyForm.data.foto?.size || 0) / 1024
                                                                )}{" "}
                                                                KB)
                                                            </p>
                                                        )}
                                                        <label
                                                            htmlFor="foto"
                                                            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors"
                                                        >
                                                            <Upload className="h-3 w-3" />
                                                            {anyForm.data.foto ? "Ganti Foto" : "Upload Foto Baru"}
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
                                            name="foto"
                                            type="file"
                                            className="hidden"
                                            accept="image/png,image/jpg,image/jpeg"
                                            onChange={handleFileChange}
                                        />
                                    </div>

                                    {anyForm.errors.foto && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {anyForm.errors.foto}
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
                                    disabled={anyForm.processing}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Save className="h-4 w-4" />
                                    {anyForm.processing ? "Menyimpan..." : "Simpan Perubahan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
        </AppLayout>
    );
}
