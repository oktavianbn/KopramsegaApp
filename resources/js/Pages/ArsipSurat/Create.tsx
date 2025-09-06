import ModalPreviewFile from "@/Components/ModalPrifiewFile";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, ArrowUpDown, Calendar, Eye, FileText, Hash, Paperclip, Pen, Save, User, Users } from "lucide-react";
import { FormEventHandler, useEffect, useState } from "react";

interface ArsipSurat {
    judul_surat: string;
    nomor_surat: string;
    jenis: "m" | "k" | "";
    pengirim: string;
    penerima: string;
    tanggal_surat: string;
    keterangan: string;
    file_path?: File | null;
}
export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm<ArsipSurat>({
        judul_surat: "",
        nomor_surat: "",
        jenis: "",
        pengirim: "",
        penerima: "",
        tanggal_surat: "",
        keterangan: "",
        file_path: null,
    });

    // nomor_surat format (hanya untuk keluar)
    const [part1, setPart1] = useState("");
    const [part2, setPart2] = useState("");
    const [part3, setPart3] = useState("KPSG");
    const [part4, setPart4] = useState("");
    const [part5, setPart5] = useState("");

    const bulanRomawi = [
        "I", "II", "III", "IV", "V", "VI",
        "VII", "VIII", "IX", "X", "XI", "XII"
    ];
    const nomorSuratKeluar = `${part1}.${part2}/${part3}/${part4}/${part5}`;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null
        setData("file_path", file)
    }


    // kalau jenis = keluar, auto set pengirim
    useEffect(() => {
        if (data.jenis === "k") {
            setData("pengirim", "Dewan Ambalan Sambernyawa Dewi Sartika");
            setData("penerima", "");
            setData("nomor_surat", nomorSuratKeluar);
        } else if (data.jenis === "m") {
            setData("penerima", "Dewan Ambalan Sambernyawa Dewi Sartika");
            // reset nomor surat split jadi kosong, supaya tidak ada jejak
            setPart1("");
            setPart2("");
            setPart4("");
            setPart5("");
            setData("pengirim", "");
            setData("nomor_surat", "");
        }
    }, [data.jenis, part1, part2, part3, part4, part5]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post("/arsip-surat", {
            forceFormData: true,
            preserveScroll: true,
            onError: (err) => console.error("Validation Error:", err),
        })

    };

    return (
        <AppLayout>
            <Head title="Tambah Arsip Surat" />

            <div className="p-6">
                {/* Header */}
                <div className="grid gap-2 md:flex items-center justify-between mb-6">
                    <div className="flex gap-6 items-center">
                        <Link
                            href="/arsip-surat"
                            className="p-2 h-max bg-gray-200 rounded-lg flex justify-center items-center">
                            <ArrowLeft className="h-5 w-5 text-gray-500" />
                        </Link>
                        <div className="flex flex-col gap-2">
                            <h1 className="text-2xl font-bold text-gray-700 whitespace-nowrap">Arsip Surat</h1>
                            <h2 className="text-base font-medium text-gray-700 whitespace-nowrap">Arsip Surat / Tambah Data</h2>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 mb-6 border-b">

                </div>

                {/* Form Arsip Surat */}
                <div className="bg-white rounded-lg shadow p-6">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Judul Surat */}
                            <div>
                                <label htmlFor="judul_surat" className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-gray-500" /> Judul Surat <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="judul_surat"
                                    value={data.judul_surat}
                                    onChange={e => setData("judul_surat", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                                {errors.judul_surat && <p className="mt-1 text-sm text-red-600">{errors.judul_surat}</p>}
                            </div>

                            {/* Jenis Surat */}
                            <div>
                                <label htmlFor="jenis" className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <ArrowUpDown className="h-4 w-4 text-gray-500" /> Jenis <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="jenis"
                                    value={data.jenis}
                                    onChange={e => setData("jenis", e.target.value as "m" | "k")}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="" disabled>Pilih Jenis Surat</option>
                                    <option value="m">Masuk</option>
                                    <option value="k">Keluar</option>
                                </select>
                                {errors.jenis && <p className="mt-1 text-sm text-red-600">{errors.jenis}</p>}
                            </div>

                            {/* Nomor Surat */}
                            <div className="max-md:col-span-1 max-xl:col-span-2">
                                <label htmlFor="nomor_surat" className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Hash className="h-4 w-4 text-gray-500" /> Nomor Surat <span className="text-red-500">*</span>
                                </label>

                                {data.jenis === "k" ? (
                                    <div className="flex items-center gap-2 max-md:overflow-x-auto">
                                        {/* Part 1 */}
                                        <input
                                            type="text"
                                            value={part1}
                                            required={data.jenis === "k"}
                                            maxLength={2}
                                            onChange={(e) => setPart1(e.target.value.replace(/[^0-9]/g, ""))}
                                            className="w-16 px-3 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="01"
                                        />
                                        <span>.</span>
                                        {/* Part 2 */}
                                        <input
                                            type="text"
                                            value={part2}
                                            required={data.jenis === "k"}
                                            maxLength={3}
                                            onChange={(e) => setPart2(e.target.value.replace(/[^0-9]/g, ""))}
                                            className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="001"
                                        />
                                        <span>/</span>
                                        <input
                                            type="text"
                                            value={part3}
                                            maxLength={6}
                                            readOnly
                                            className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-center uppercase focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <span>/</span>
                                        <select
                                            value={part4}
                                            onChange={(e) => setPart4(e.target.value)}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required={data.jenis === "k"}
                                        >
                                            <option value="" disabled>Pilih</option>
                                            {bulanRomawi.map((b, idx) => (
                                                <option key={idx} value={b}>{b}</option>
                                            ))}
                                        </select>
                                        <span>/</span>
                                        <input
                                            type="text"
                                            value={part5}
                                            maxLength={4}
                                            onChange={(e) => setPart5(e.target.value.replace(/[^0-9]/g, ""))}
                                            className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="2025"
                                            required={data.jenis === "k"}
                                        />
                                    </div>
                                ) : (
                                    <input
                                        type="text"
                                        id="nomor_surat"
                                        value={data.nomor_surat}
                                        onChange={e => setData("nomor_surat", e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Nomor Surat"
                                        required={data.jenis === "m"}
                                    />
                                )}
                                {errors.nomor_surat && <p className="mt-1 text-sm text-red-600">{errors.nomor_surat}</p>}
                            </div>

                            {/* Pengirim */}
                            <div>
                                <label htmlFor="pengirim" className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <User className="h-4 w-4 text-gray-500" /> Pengirim
                                </label>
                                <input
                                    type="text"
                                    id="pengirim"
                                    value={data.pengirim}
                                    onChange={e => setData("pengirim", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    readOnly={data.jenis === "k"}
                                />
                                {errors.pengirim && <p className="mt-1 text-sm text-red-600">{errors.pengirim}</p>}
                            </div>

                            {/* Penerima */}
                            <div>
                                <label htmlFor="penerima" className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Users className="h-4 w-4 text-gray-500" /> Penerima
                                </label>
                                <input
                                    type="text"
                                    id="penerima"
                                    value={data.penerima}
                                    readOnly={data.jenis === "m"}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    onChange={e => setData("penerima", e.target.value)}
                                />
                                {errors.penerima && <p className="mt-1 text-sm text-red-600">{errors.penerima}</p>}
                            </div>

                            {/* Tanggal Surat */}
                            <div>
                                <label htmlFor="tanggal_surat" className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gray-500" /> Tanggal Surat <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    id="tanggal_surat"
                                    value={data.tanggal_surat}
                                    onChange={e => setData("tanggal_surat", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                                {errors.tanggal_surat && <p className="mt-1 text-sm text-red-600">{errors.tanggal_surat}</p>}
                            </div>

                            {/* Keterangan */}
                            <div className="md:col-span-2">
                                <label htmlFor="keterangan" className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Pen className="h-4 w-4 text-gray-500" /> Keterangan <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="keterangan"
                                    value={data.keterangan}
                                    onChange={e => setData("keterangan", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows={2}
                                />
                                {errors.keterangan && <p className="mt-1 text-sm text-red-600">{errors.keterangan}</p>}
                            </div>

                            {/* File Upload */}
                            <div className="md:col-span-2">
                                <label
                                    htmlFor="file_path"
                                    className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
                                >
                                    <Paperclip className="h-4 w-4 text-gray-500" /> File Surat (opsional)
                                </label>

                                <input
                                    type="file"
                                    id="file_path"
                                    onChange={handleFileChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />

                                <p className="mt-1 text-xs text-gray-500">
                                    Format: PDF, JPG, PNG, DOC, DOCX — Maks. 2MB
                                </p>

                                {errors.file_path && (
                                    <p className="mt-1 text-sm text-red-600">{errors.file_path}</p>
                                )}

                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex items-center justify-end gap-4 pt-6 border-t">
                            <Link
                                href="/arsip-surat"
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
