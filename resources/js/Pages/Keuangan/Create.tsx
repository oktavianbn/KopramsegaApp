import { useState, FormEventHandler } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { Navbar } from "@/Components/Navbar";
import { Sidebar } from "@/Components/Sidebar";
import { ArrowLeft, Save } from "lucide-react";

interface FormData {
    tanggal: string;
    jenis: "m" | "k" | "";
    tipe: "k" | "u" | "a" | "";
    jumlah: string;
    catatan: string;
}

export default function Create() {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        tanggal: new Date().toISOString().split("T")[0],
        jenis: "",
        tipe: "",
        jumlah: "",
        catatan: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post("/keuangan");
    };

    return (
        <>
            <Head title="Tambah Data Keuangan" />
            <Navbar />
            <Sidebar />

            <div className="md:ml-64 pt-16 min-h-screen bg-gray-50">
                <div className="p-6">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center gap-4 mb-4">
                            <Link
                                href="/keuangan"
                                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Tambah Data Keuangan
                                </h1>
                                <p className="text-gray-600">
                                    Tambahkan data pemasukan atau pengeluaran
                                    baru
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* Jenis */}
                                <div>
                                    <label
                                        htmlFor="jenis"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Jenis <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="jenis"
                                        value={data.jenis}
                                        onChange={(e) =>
                                            setData("jenis", e.target.value as "m" | "k")
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg
                   focus:outline-none focus:ring-2 focus:ring-blue-500
                   focus:border-transparent"
                                        required
                                    >
                                        <option value="">Pilih Jenis</option>
                                        <option value="m">Pemasukan</option>
                                        <option value="k">Pengeluaran</option>
                                    </select>
                                    {errors.jenis && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.jenis}
                                        </p>
                                    )}
                                </div>

                                {/* Tipe - hanya muncul kalau jenis === "m" */}
                                {data.jenis === "m" && (
                                    <div>
                                        <label
                                            htmlFor="tipe"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            Tipe <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="tipe"
                                            value={data.tipe}
                                            onChange={(e) =>
                                                setData("tipe", e.target.value as "k" | "u" | "a")
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       focus:border-transparent"
                                            required
                                        >
                                            <option value="">Pilih tipe</option>
                                            <option value="k">Kas</option>
                                            <option value="u">Usaha Dana</option>
                                            <option value="a">Anggaran</option>
                                        </select>
                                        {errors.tipe && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.tipe}
                                            </p>
                                        )}
                                    </div>
                                )}


                                {/* Jumlah */}
                                <div>
                                    <label
                                        htmlFor="jumlah"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Jumlah (Rp){" "}
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
                                        step="0.01"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                    {errors.jumlah && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.jumlah}
                                        </p>
                                    )}
                                </div>
                            </div>
                            {/* catatan */}
                            <div className="md:col-span-2">
                                <label
                                    htmlFor="catatan"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Catatan{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="catatan"
                                    value={data.catatan}
                                    onChange={(e) =>
                                        setData(
                                            "catatan",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Masukkan catatan..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                                {errors.catatan && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.catatan}
                                    </p>
                                )}
                            </div>
                            {/* Submit Buttons */}
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
            </div>
        </>
    );
}
