import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import { ArrowLeft, Calendar, Plus, Trash2 } from "lucide-react";
import { useForm } from "@inertiajs/react";
import { useState } from "react";

interface Dokumen {
    id: number;
    nama: string;
    tanggal_dokumen: string;
    keterangan: string;
    file: string[]; // dari DB pasti berupa path string
}

interface Props {
    dokumen: Dokumen;
}

export default function Edit({ dokumen }: Props) {
    const { data, setData, processing, errors } = useForm<{
        id: number;
        nama: string;
        tanggal_dokumen: string;
        keterangan: string;
        file: (File | string)[];
    }>({
        id: dokumen.id,
        nama: dokumen.nama,
        tanggal_dokumen: dokumen.tanggal_dokumen,
        keterangan: dokumen.keterangan,
        file: [],
    });


    // pisahkan state file lama & file baru
    const [existingFiles, setExistingFiles] = useState<string[]>(dokumen.file ?? []);
    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [replaceKeys, setReplaceKeys] = useState<number[]>([]);

    // const handleReplaceFile = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = e.target.files?.[0];
    //     if (file) {
    //         setNewFiles((prev) => [...prev, file]);
    //         setReplaceKeys((prev) => [...prev, index]); // tandai file lama yang diganti
    //     }
    // };

    const handleAddFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewFiles((prev) => [...prev, file]); // file baru tambahan (tanpa replace)
        }
    };

    const handleRemoveExisting = (index: number) => {
        setExistingFiles((prev) => prev.filter((_, i) => i !== index));
    };

    // Tambah field file baru
    const addDocument = () => {
        setNewFiles((prev) => [...prev, new File([], "")]);
    };

    // Ganti file baru sebelum submit
    const handleReplaceNew = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewFiles((prev) => prev.map((f, i) => (i === index ? file : f)));
        }
    };

    // Hapus file baru
    const removeNewFile = (index: number) => {
        setNewFiles((prev) => prev.filter((_, i) => i !== index));
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("_method", "PUT");

        formData.append("id", data.id.toString());
        formData.append("nama", data.nama);
        formData.append("tanggal_dokumen", data.tanggal_dokumen);
        formData.append("keterangan", data.keterangan);

        // kirim file lama yang masih dipakai
        existingFiles.forEach((file, index) => {
            formData.append(`existing_files[${index}]`, file);
        });

        // kirim file baru
        newFiles.forEach((file, index) => {
            formData.append(`file[${index}]`, file);
        });

        // kirim replace_keys
        replaceKeys.forEach((key, index) => {
            formData.append(`replace_keys[${index}]`, key.toString());
        });

        router.post(`/dokumen/${data.id}`, formData, {
            forceFormData: true,
            preserveScroll: true,
        });
    };


    return (
        <AppLayout>
            <Head title="Edit Dokumen" />

            <div className="py-6">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="grid gap-2 md:flex items-center justify-between mb-6">
                        <div className="flex gap-6 items-center">
                            <Link
                                href="/dokumen"
                                className="p-2 h-max bg-gray-200 rounded-lg flex justify-center items-center"
                            >
                                <ArrowLeft className="h-5 w-5 text-gray-500" />
                            </Link>
                            <div className="flex flex-col gap-2">
                                <h1 className="text-2xl font-bold text-gray-700 whitespace-nowrap">Dokumen</h1>
                                <h2 className="text-base font-medium text-gray-700 whitespace-nowrap">
                                    Arsip / Dokumen / Edit Data
                                </h2>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Nama Dokumen */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama Dokumen *
                                </label>
                                <input
                                    type="text"
                                    value={data.nama}
                                    onChange={(e) => setData("nama", e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.nama ? "border-red-500" : "border-gray-300"
                                        }`}
                                    placeholder="Masukkan nama dokumen"
                                />
                                {errors.nama && <p className="mt-1 text-sm text-red-600">{errors.nama}</p>}
                            </div>

                            {/* Tanggal Dokumen */}
                            <div>
                                <label
                                    htmlFor="tanggal_dokumen"
                                    className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
                                >
                                    <Calendar className="h-4 w-4 text-gray-500" /> Tanggal Surat{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    id="tanggal_dokumen"
                                    value={data.tanggal_dokumen}
                                    onChange={(e) => setData("tanggal_dokumen", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                                {errors.tanggal_dokumen && (
                                    <p className="mt-1 text-sm text-red-600">{errors.tanggal_dokumen}</p>
                                )}
                            </div>

                            {/* File */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-gray-700">Upload File *</label>
                                    <button
                                        type="button"
                                        onClick={addDocument}
                                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                                    >
                                        <Plus size={16} /> Tambah File
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {existingFiles.map((file, index) => (
                                        <div key={index} className="flex flex-col gap-2">
                                            {/* File lama */}
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-600">File saat ini:</span>
                                                <a
                                                    href={`/storage/${file}`}
                                                    target="_blank"
                                                    className="text-blue-600 underline text-sm"
                                                >
                                                    {file.split("/").pop()}
                                                </a>
                                            </div>

                                            {/* Input ganti file */}
                                            <div className="flex gap-2">
                                                <input
                                                    type="file"
                                                    disabled
                                                    // onChange={(e) => handleReplaceFile(index, e)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveExisting(index)}
                                                    className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    {/* File baru */}
                                    {newFiles.map((file, index) => (
                                        <div key={`new-${index}`} className="flex flex-col gap-2">
                                            <div className="text-sm text-green-600">
                                                File baru: {file.name}
                                            </div>
                                            <div className="flex gap-2">
                                                <input
                                                    type="file"
                                                    onChange={(e) => handleReplaceNew(index, e)} // kalau user ganti sebelum submit
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeNewFile(index)}
                                                    className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {errors.file && <p className="mt-1 text-sm text-red-600">{errors.file}</p>}
                            </div>


                            {/* Keterangan */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Keterangan</label>
                                <textarea
                                    value={data.keterangan}
                                    onChange={(e) => setData("keterangan", e.target.value)}
                                    rows={4}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.keterangan ? "border-red-500" : "border-gray-300"
                                        }`}
                                    placeholder="Keterangan atau deskripsi dokumen"
                                />
                                {errors.keterangan && (
                                    <p className="mt-1 text-sm text-red-600">{errors.keterangan}</p>
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
