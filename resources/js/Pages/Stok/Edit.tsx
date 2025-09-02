import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Loader, Package, Save, Settings } from "lucide-react";
import { FormEventHandler } from "react";

interface Barang {
    id: number;
    nama: string;
    deskripsi?: string | null;
    foto?: string | null;
}

interface Spesifikasi {
    id: number;
    barang_id: number;
    key: string;
    value: string;
    description?: string | null;
}

interface Stok {
    id: number;
    barang_id: number;
    spesifikasi_id?: number | null;
    jumlah: number;
    barang: Barang;
    spesifikasi?: Spesifikasi | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    stok: Stok;
    barangs: Barang[];
    spesifikasis: Spesifikasi[];
}

interface FormData {
    barang_id: string;
    spesifikasi_id: string;
    jumlah: string;
}

export default function Edit({ stok, barangs, spesifikasis }: Props) {
    const { data, setData, put, processing, errors } = useForm<FormData>({
        barang_id: stok.barang_id.toString(),
        spesifikasi_id: stok.spesifikasi_id?.toString() || "",
        jumlah: stok.jumlah.toString(),
    });

    // Filter spesifikasi berdasarkan barang yang dipilih
    const filteredSpesifikasis = spesifikasis.filter(
        (spec) => spec.barang_id.toString() === data.barang_id
    );

    // Handler untuk reset spesifikasi saat barang diubah
    const handleBarangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setData({
            ...data,
            barang_id: e.target.value,
            spesifikasi_id: "",
        });
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/stok/${stok.id}`);
    };

    return (
        <AppLayout>
            <Head title="Edit Data Stok" />

            <div className="p-6">
                {/* Header */}
                <div className="grid gap-2 md:flex items-center justify-between mb-6">
                    <div className="flex gap-6 items-center">
                        <Link
                            href="/stok"
                            className="p-2 h-max bg-gray-200 rounded-lg flex justify-center items-center"
                        >
                            <ArrowLeft className="h-5 w-5 text-gray-500" />
                        </Link>
                        <div className="flex flex-col gap-2">
                            <h1 className="text-2xl font-bold text-gray-700 whitespace-nowrap">
                                Stok
                            </h1>
                            <h2 className="text-base font-medium text-gray-700 whitespace-nowrap">
                                Inventory / Barang / Edit Data
                            </h2>
                        </div>
                    </div>
                </div>
                <div className="flex gap-4 mb-6 border-b"></div>

                {/* Form */}
                <div className="bg-white rounded-lg shadow p-6">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                            {/* Barang */}
                            <div className="max-md:col-span-2">
                                <label
                                    htmlFor="barang_id"
                                    className="flex text-sm items-center gap-1 font-medium text-gray-700 mb-2"
                                >
                                    <Package className="w-4 h-4" />
                                    Barang
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="barang_id"
                                    value={data.barang_id}
                                    onChange={handleBarangChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg
                                        focus:outline-none focus:ring-2 focus:ring-blue-500
                                        focus:border-transparent"
                                    required
                                >
                                    <option value="" disabled>
                                        Pilih Barang
                                    </option>
                                    {barangs.map((barang) => (
                                        <option
                                            key={barang.id}
                                            value={barang.id}
                                        >
                                            {barang.nama}
                                        </option>
                                    ))}
                                </select>
                                {errors.barang_id && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.barang_id}
                                    </p>
                                )}
                            </div>

                            {/* Spesifikasi (optional) */}
                            <div className="max-md:col-span-2">
                                <label
                                    htmlFor="spesifikasi_id"
                                    className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-2"
                                >
                                    <Settings className="w-4 h-4" />
                                    Spesifikasi
                                </label>
                                <select
                                    id="spesifikasi_id"
                                    value={data.spesifikasi_id}
                                    onChange={(e) =>
                                        setData(
                                            "spesifikasi_id",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg
                                        focus:outline-none focus:ring-2 focus:ring-blue-500
                                        focus:border-transparent"
                                    disabled={!data.barang_id}
                                >
                                    <option value="">
                                        {!data.barang_id
                                            ? "Pilih barang terlebih dahulu"
                                            : "Tanpa spesifikasi"}
                                    </option>
                                    {filteredSpesifikasis.map((spec) => (
                                        <option key={spec.id} value={spec.id}>
                                            {spec.key}: {spec.value}
                                        </option>
                                    ))}
                                </select>
                                {errors.spesifikasi_id && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.spesifikasi_id}
                                    </p>
                                )}
                            </div>

                            {/* Jumlah */}
                            <div className="max-md:col-span-2">
                                <label
                                    htmlFor="jumlah"
                                    className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-2"
                                >
                                    <Loader className="w-4 h-4" />
                                    Jumlah Stok{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    id="jumlah"
                                    value={data.jumlah}
                                    onChange={(e) =>
                                        setData("jumlah", e.target.value)
                                    }
                                    placeholder="0"
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg
                                        focus:outline-none focus:ring-2 focus:ring-blue-500
                                        focus:border-transparent"
                                    required
                                />
                                {errors.jumlah && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.jumlah}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex items-center justify-end gap-4 pt-6 border-t">
                            <Link
                                href="/stok"
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
                                {processing ? "Menyimpan..." : "Perbarui"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
