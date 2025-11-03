import { useState, useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import {
    ArrowLeft,
    Save,
    Package,
    Camera,
    Upload,
    X,
    Plus,
    Trash2,
    DollarSign,
    Layers,
    Calendar,
    Image
} from "lucide-react";
import AppLayout from "@/Layouts/AppLayout";
import { PageHeader } from "@/Components/ui/page-header";

interface MenuItem {
    nama: string;
    harga: string;
    stok: string;
    foto: File | null;
}

interface MenuCreateProps {
    sesis: any[];
    sesi_id?: string | number | null;
}

export default function Create({ sesis, sesi_id }: MenuCreateProps) {
    const form = useForm({
        sesi_id: sesi_id ? String(sesi_id) : "",
        items: [
            {
                nama: "",
                harga: "",
                // stok: "0",
                foto: null as File | null,
            },
        ] as MenuItem[],
    });

    const [previewUrls, setPreviewUrls] = useState<(string | null)[]>([null]);

    useEffect(() => {
        if (sesi_id) {
            form.setData('sesi_id', String(sesi_id));
        }
    }, [sesi_id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/menu', {
            forceFormData: true,
            preserveState: true,
        });
    };

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            const newItems = [...form.data.items];
            newItems[index].foto = file;
            form.setData("items", newItems);

            const url = URL.createObjectURL(file);
            const newPreviewUrls = [...previewUrls];
            newPreviewUrls[index] = url;
            setPreviewUrls(newPreviewUrls);
        }
    };

    const removePhoto = (index: number) => {
        const newItems = [...form.data.items];
        newItems[index].foto = null;
        form.setData("items", newItems);

        const newPreviewUrls = [...previewUrls];
        newPreviewUrls[index] = null;
        setPreviewUrls(newPreviewUrls);

        const fileInput = document.getElementById(
            `foto-${index}`
        ) as HTMLInputElement;
        if (fileInput) {
            fileInput.value = "";
        }
    };

    const addItem = () => {
        form.setData("items", [
            ...form.data.items,
            { nama: "", harga: "", stok: "0", foto: null },
        ]);
        setPreviewUrls([...previewUrls, null]);
    };

    const removeItem = (index: number) => {
        const newItems = form.data.items.filter((_, i) => i !== index);
        const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
        form.setData("items", newItems);
        setPreviewUrls(newPreviewUrls);
    };

    const updateItem = (
        index: number,
        field: keyof MenuItem,
        value: string | File | null
    ) => {
        const newItems = [...form.data.items];
        // allow assigning different types (string for text fields, File for foto)
        (newItems[index] as any)[field] = value;
        form.setData("items", newItems);
    };

    return (
        <AppLayout>
            <Head title="Tambah Menu" />

                <div className="p-6">
                {/* Header */}
                <PageHeader
                    title="Menu"
                    subtitle="Daftar / Tambah Data"
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
                                    disabled
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

                            {/* Items Section */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                        <Package className="h-4 w-4" />
                                        Daftar Menu
                                    </label>
                                    <button
                                        type="button"
                                        onClick={addItem}
                                        className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Tambah Menu
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {form.data.items.map((item, index) => (
                                        <div
                                            key={index}
                                            className="border rounded-lg border-gray-300 p-6 bg-gray-50"
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-lg font-semibold text-gray-700">
                                                    Menu #{index + 1}
                                                </h3>
                                                {form.data.items.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeItem(index)
                                                        }
                                                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        Hapus
                                                    </button>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                {/* Left Column */}
                                                <div className="space-y-4">
                                                    {/* Nama Menu */}
                                                    <div>
                                                        <label
                                                            htmlFor={`nama-${index}`}
                                                            className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
                                                        >
                                                            <Package className="h-4 w-4" />
                                                            Nama Menu
                                                            <span className="text-red-500">
                                                                *
                                                            </span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id={`nama-${index}`}
                                                            value={item.nama}
                                                            onChange={(e) =>
                                                                updateItem(
                                                                    index,
                                                                    "nama",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                            placeholder="Masukkan nama menu"
                                                        />
                                                        {form.errors[
                                                            `items.${index}.nama`
                                                        ] && (
                                                            <p className="mt-1 text-sm text-red-600">
                                                                {
                                                                    form.errors[
                                                                        `items.${index}.nama`
                                                                    ]
                                                                }
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Harga */}
                                                    <div>
                                                        <label
                                                            htmlFor={`harga-${index}`}
                                                            className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
                                                        >
                                                            <DollarSign className="h-4 w-4" />
                                                            Harga
                                                        </label>
                                                        <input
                                                            type="number"
                                                            id={`harga-${index}`}
                                                            value={item.harga}
                                                            onChange={(e) =>
                                                                updateItem(
                                                                    index,
                                                                    "harga",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            step="0.01"
                                                            min="0"
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                            placeholder="0.00"
                                                        />
                                                        {form.errors[
                                                            `items.${index}.harga`
                                                        ] && (
                                                            <p className="mt-1 text-sm text-red-600">
                                                                {
                                                                    form.errors[
                                                                        `items.${index}.harga`
                                                                    ]
                                                                }
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Stok */}
                                                    {/* <div>
                                                        <label
                                                            htmlFor={`stok-${index}`}
                                                            className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
                                                        >
                                                            <Layers className="h-4 w-4" />
                                                            Stok
                                                        </label>
                                                        <input
                                                            type="number"
                                                            id={`stok-${index}`}
                                                            value={item.stok}
                                                            onChange={(e) =>
                                                                updateItem(
                                                                    index,
                                                                    "stok",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            min="0"
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                            placeholder="0"
                                                        />
                                                        {form.errors[
                                                            `items.${index}.stok`
                                                        ] && (
                                                            <p className="mt-1 text-sm text-red-600">
                                                                {
                                                                    form.errors[
                                                                        `items.${index}.stok`
                                                                    ]
                                                                }
                                                            </p>
                                                        )}
                                                    </div> */}
                                                </div>

                                                {/* Right Column - Foto */}
                                                <div>
                                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                                        <Camera className="h-4 w-4" />
                                                        Foto Menu
                                                    </label>

                                                    <div
                                                        className={`border rounded-lg p-3 bg-white ${
                                                            form.errors[
                                                                `items.${index}.foto`
                                                            ]
                                                                ? "border-red-500"
                                                                : "border-gray-300"
                                                        }`}
                                                    >
                                                        {previewUrls[index] ? (
                                                            <div className="space-y-4">
                                                                <div className="flex items-start gap-4">
                                                                    <div className="relative">
                                                                        <img
                                                                            src={
                                                                                previewUrls[
                                                                                    index
                                                                                ]
                                                                            }
                                                                            alt="Preview"
                                                                            className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                                                                        />
                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                removePhoto(
                                                                                    index
                                                                                )
                                                                            }
                                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                                                        >
                                                                            <X className="h-3 w-3" />
                                                                        </button>
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <p className="text-sm font-medium text-gray-900 mb-1">
                                                                            Foto
                                                                            berhasil
                                                                            dipilih
                                                                        </p>
                                                                        <p className="text-xs text-gray-500 mb-2">
                                                                            {
                                                                                item
                                                                                    .foto
                                                                                    ?.name
                                                                            }{" "}
                                                                            (
                                                                            {Math.round(
                                                                                (item
                                                                                    .foto
                                                                                    ?.size ||
                                                                                    0) /
                                                                                    1024
                                                                            )}{" "}
                                                                            KB)
                                                                        </p>
                                                                        <label
                                                                            htmlFor={`foto-${index}`}
                                                                            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors"
                                                                        >
                                                                            <Upload className="h-3 w-3" />
                                                                            Ganti
                                                                            Foto
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <label
                                                                htmlFor={`foto-${index}`}
                                                                className="flex flex-col items-center justify-center py-8 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                                                            >
                                                                <div className="flex flex-col items-center text-center">
                                                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                                                        <Image className="w-6 h-6 text-gray-400" />
                                                                    </div>
                                                                    <p className="text-sm font-medium text-gray-900 mb-1">
                                                                        Upload
                                                                        foto menu
                                                                    </p>
                                                                    <p className="text-xs text-gray-500 mb-2">
                                                                        Klik
                                                                        untuk
                                                                        memilih
                                                                        file
                                                                    </p>
                                                                    <p className="text-xs text-gray-400">
                                                                        PNG, JPG,
                                                                        JPEG
                                                                        (Maks.
                                                                        2MB)
                                                                    </p>
                                                                </div>
                                                            </label>
                                                        )}

                                                        <input
                                                            id={`foto-${index}`}
                                                            name={`items[${index}][foto]`}
                                                            type="file"
                                                            className="hidden"
                                                            accept="image/png,image/jpg,image/jpeg"
                                                            onChange={(e) =>
                                                                handleFileChange(
                                                                    e,
                                                                    index
                                                                )
                                                            }
                                                        />
                                                    </div>

                                                    {form.errors[
                                                        `items.${index}.foto`
                                                    ] && (
                                                        <p className="mt-2 text-sm text-red-600">
                                                            {
                                                                form.errors[
                                                                    `items.${index}.foto`
                                                                ]
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
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
                                    {form.processing
                                        ? "Menyimpan..."
                                        : "Simpan Menu"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
        </AppLayout>
    );
}
