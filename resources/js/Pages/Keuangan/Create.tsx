import { PageHeader } from "@/Components/ui/page-header";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Save } from "lucide-react";
import { FormEventHandler } from "react";

interface FormData {
    jenis_pemasukkan: "k" | "u" | "a" | "";
    tipe: "m" | "k" | "";
    jumlah: string;
    catatan: string;
}

export default function Create() {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        jenis_pemasukkan: "",
        tipe: "",
        jumlah: "",
        catatan: "",
    });

    // Handler untuk reset jenis_pemasukkan saat tipe diubah
    const handleTipeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setData({
            ...data,
            tipe: e.target.value as "m" | "k",
            jenis_pemasukkan: "",
        });
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post("/keuangan");
    };

    return (
        <AppLayout>
            <Head title="Tambah Data Keuangan" />

            <div className="p-6">
                {/* Header */}
                <PageHeader
                    title="Keuangan"
                    subtitle="Daftar / Tambah Data"
                    backHref="/keuangan"
                    backIcon={ArrowLeft}
                />

                {/* Form */}
                <div className="bg-white rounded-lg shadow p-6">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                            {/* Tipe (m/k) */}
                            <div className="max-md:col-span-2">
                                <label
                                    htmlFor="tipe"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Tipe <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="tipe"
                                    value={data.tipe}
                                    onChange={handleTipeChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg
                                        focus:outline-none focus:ring-2 focus:ring-blue-500
                                        focus:border-transparent"
                                    required
                                >
                                    <option value="" disabled>
                                        Pilih Tipe
                                    </option>
                                    <option value="m">Pemasukan</option>
                                    <option value="k">Pengeluaran</option>
                                </select>
                                {errors.tipe && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.tipe}
                                    </p>
                                )}
                            </div>

                            {/* jenis pemasukkan (k/u/a) → hanya muncul kalau jenis_pemasukkan === "m" */}
                            {data.tipe === "m" && (
                                <div className="max-md:col-span-2">
                                    <label
                                        htmlFor="jenis_pemasukkan"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Jenis Pemasukkan{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="jenis_pemasukkan"
                                        value={data.jenis_pemasukkan}
                                        onChange={(e) =>
                                            setData(
                                                "jenis_pemasukkan",
                                                e.target.value as
                                                | "k"
                                                | "u"
                                                | "a"
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg
                                        focus:outline-none focus:ring-2 focus:ring-blue-500
                                        focus:border-transparent"
                                        required
                                    >
                                        <option value="" disabled>
                                            Pilih Tipe
                                        </option>
                                        <option value="k">Kas</option>
                                        <option value="u">Usaha Dana</option>
                                        <option value="a">Anggaran</option>
                                    </select>
                                    {errors.tipe && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.tipe}
                                        </p>
                                    )}
                                </div>)}


                            {/* Jumlah */}
                            <div className="max-md:col-span-2">
                                <label
                                    htmlFor="jumlah"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Jumlah (Rp){" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="jumlah"
                                    value={data.jumlah}
                                    onChange={(e) =>
                                        setData("jumlah", e.target.value)
                                    }
                                    placeholder="0"
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
                            {/* Catatan */}
                            <div
                                className={`max-md:col-span-2 ${data.tipe === "m" ? "" : "col-span-2"
                                    }`}
                            >
                                <label
                                    htmlFor="catatan"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Catatan
                                </label>
                                <input
                                    type="text"
                                    id="catatan"
                                    value={data.catatan}
                                    onChange={(e) =>
                                        setData("catatan", e.target.value)
                                    }
                                    placeholder="Masukkan catatan..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg
                                        focus:outline-none focus:ring-2 focus:ring-blue-500
                                        focus:border-transparent"
                                />
                                {errors.catatan && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.catatan}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex items-center justify-end gap-4 pt-6 border-t">
                            <Link
                                href="/keuangan"
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
