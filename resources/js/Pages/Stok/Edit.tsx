import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, useForm, router } from "@inertiajs/react";
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

interface Props {
    barangs: Barang[];
    spesifikasis: Spesifikasi[];
    stok: {
        barang_id: number;
        spesifikasi_id?: number | null;
        jumlah: number;
    };
}

interface FormData {
    barang_id: string;
    spesifikasi_id: string;
    jumlah_sekarang: string;
    keterangan: string;
}

export default function Edit({ barangs, spesifikasis, stok }: Props) {
    // Note: the controller returns `stok` prop with current values.

    const { data, setData, processing, errors } = useForm<FormData>({
        barang_id: stok?.barang_id?.toString() ?? "",
        spesifikasi_id: stok?.spesifikasi_id ? stok.spesifikasi_id.toString() : "",
        jumlah_sekarang: stok?.jumlah?.toString() ?? "",
        keterangan: '',
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

    const handleSpesifikasiChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setData({ ...data, spesifikasi_id: e.target.value });
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // Use barang_id as route param (controller does not depend on the id value but resource route expects it)
        const barangIdForRoute = data.barang_id || stok?.barang_id;

        router.put(`/stok/${barangIdForRoute}`, {
            barang_id: data.barang_id,
            spesifikasi_id: data.spesifikasi_id || null,
            jumlah_sekarang: data.jumlah_sekarang,
            keterangan: data.keterangan,
        });
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

                            <div className="max-md:col-span-2">
                                <label
                                    htmlFor="barang_nama"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Barang <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="barang_nama"
                                    type="text"
                                    value={barangs.find((b) => b.id.toString() === data.barang_id)?.nama || ""}
                                    disabled
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                                />
                            </div>

                            <div className="max-md:col-span-2">
                                <label
                                    htmlFor="spesifikasi_nama"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Spesifikasi (opsional)
                                </label>
                                <input
                                    id="spesifikasi_nama"
                                    type="text"
                                    value={
                                        filteredSpesifikasis.find(
                                            (s) => s.id.toString() === data.spesifikasi_id
                                        )
                                            ? `${filteredSpesifikasis.find(
                                                (s) => s.id.toString() === data.spesifikasi_id
                                            )?.key} - ${filteredSpesifikasis.find(
                                                (s) => s.id.toString() === data.spesifikasi_id
                                            )?.value
                                            }`
                                            : ""
                                    }
                                    disabled
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                                />
                            </div>


                            <div className="max-md:col-span-2">
                                <label htmlFor="jumlah_sekarang" className=" items-center gap-1 text-sm font-medium text-gray-700 mb-2">
                                    Jumlah Stok Saat Ini <span className="text-red-500">*</span>
                                </label>
                                <input type="number" id="jumlah_sekarang" value={data.jumlah_sekarang} onChange={(e) => setData('jumlah_sekarang', e.target.value)} placeholder="0" min="0" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                                {errors.jumlah_sekarang && (<p className="mt-1 text-sm text-red-600">{errors.jumlah_sekarang}</p>)}
                            </div>
                            <div className="max-md:col-span-2">
                                <label htmlFor="keterangan" className=" items-center gap-1 text-sm font-medium text-gray-700 mb-2">Keterangan (opsional)</label>
                                <input id="keterangan" value={data.keterangan} onChange={e => setData('keterangan', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
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
