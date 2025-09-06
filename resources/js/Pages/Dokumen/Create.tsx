import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, ArrowUpDown, Calendar, FileText, Hash, Paperclip, Pen, Plus, Save, Trash2, User, Users } from "lucide-react";
import { FormEventHandler, useEffect, useState } from "react";

interface Dokumen {
    nama: string;
    tanggal_dokumen: string;
    keterangan: string;
    file: (File | null)[];
}

export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm<Dokumen>({
        nama: "",
        tanggal_dokumen: "",
        keterangan: "",
        file: [null],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/dokumen", { forceFormData: true });
    };

    const addDocument = () => {
        setData("file", [...data.file, null]);
    };

    const updateDocument = (index: number, file: File | null) => {
        const newDocs = [...data.file];
        newDocs[index] = file;
        setData("file", newDocs);
    };

    const removeDocument = (index: number) => {
        setData("file", data.file.filter((_, i) => i !== index));
    };
    return (
        <AppLayout>
            <Head title="Tambah dokumen" />

            <div className="py-6">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="grid gap-2 md:flex items-center justify-between mb-6">
                        <div className="flex gap-6 items-center">
                            <Link
                                href="/dokumen"
                                className="p-2 h-max bg-gray-200 rounded-lg flex justify-center items-center">
                                <ArrowLeft className="h-5 w-5 text-gray-500" />
                            </Link>
                            <div className="flex flex-col gap-2">
                                <h1 className="text-2xl font-bold text-gray-700 whitespace-nowrap">Dokumen</h1>
                                <h2 className="text-base font-medium text-gray-700 whitespace-nowrap">Arsip / Dokumen/ Tambah Data</h2>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4 mb-6 border-b">

                    </div>

                    {/* Form */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Judul */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama Dokumen *
                                </label>
                                <input
                                    type="text"
                                    value={data.nama}
                                    onChange={(e) =>
                                        setData("nama", e.target.value)
                                    }
                                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.nama
                                        ? "border-red-500"
                                        : "border-gray-300"
                                        }`}
                                    placeholder="Masukkan nama dokumen"
                                />
                                {errors.nama && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.nama}
                                    </p>
                                )}
                            </div>

                            {/* Tanggal Surat */}
                            <div>
                                <label htmlFor="tanggal_dokumen" className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gray-500" /> Tanggal Surat <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    id="tanggal_dokumen"
                                    value={data.tanggal_dokumen}
                                    onChange={e => setData("tanggal_dokumen", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                                {errors.tanggal_dokumen && <p className="mt-1 text-sm text-red-600">{errors.tanggal_dokumen}</p>}
                            </div>

                            {/* File*/}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Upload File *
                                    </label>
                                    <button
                                        type="button"
                                        onClick={addDocument}
                                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                                    >
                                        <Plus size={16} />
                                        Tambah File
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {data.file.map((doc, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <div className="flex-1">
                                                <input
                                                    type="file"
                                                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                                    onChange={(e) =>
                                                        updateDocument(index, e.target.files?.[0] || null)
                                                    }
                                                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors[`file.${index}`] ? "border-red-500" : "border-gray-300"
                                                        }`}
                                                />
                                                {errors[`file.${index}`] && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {errors[`file.${index}`]}
                                                    </p>
                                                )}
                                                {doc && (
                                                    <p className="mt-1 text-sm text-gray-600">
                                                        File terpilih: {doc.name}
                                                    </p>
                                                )}
                                            </div>
                                            {data.file.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeDocument(index)}
                                                    className="text-red-600 hover:text-red-800 p-2"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {errors.file && (
                                    <p className="mt-1 text-sm text-red-600">{errors.file}</p>
                                )}
                            </div>

                            {/* Keterangan */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Keterangan
                                </label>
                                <textarea
                                    value={data.keterangan}
                                    onChange={(e) =>
                                        setData("keterangan", e.target.value)
                                    }
                                    rows={4}
                                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.keterangan
                                        ? "border-red-500"
                                        : "border-gray-300"
                                        }`}
                                    placeholder="Keterangan atau deskripsi dokumen"
                                />
                                {errors.keterangan && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.keterangan}
                                    </p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
                                <Link
                                    href="/dokumen"
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {processing ? "Menyimpan..." : "Simpan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
