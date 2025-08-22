import { useState, FormEventHandler, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { Navbar } from "@/Components/Navbar";
import { Sidebar } from "@/Components/Sidebar";
import { ArrowLeft, Save, FileText, Hash, Shuffle, User, Users, Calendar, StickyNote, Paperclip, ArrowUpDown, Pen } from "lucide-react";
import AppLayout from "@/Layouts/AppLayout";

interface FormData {
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
    const { data, setData, post, processing, errors } = useForm<FormData>({
        judul_surat: "",
        nomor_surat: "",
        jenis: "",
        pengirim: "",
        penerima: "",
        tanggal_surat: "",
        keterangan: "",
        file_path: null,
    });

    const [part1, setPart1] = useState("");
    const [part2, setPart2] = useState("");
    const [part3, setPart3] = useState("");
    const [part4, setPart4] = useState("");
    const [part5, setPart5] = useState("");

    const bulanRomawi = [
        "I", "II", "III", "IV", "V", "VI",
        "VII", "VIII", "IX", "X", "XI", "XII"
    ];
    const nomorSurat = `${part1}.${part2}/${part3}/${part4}/${part5}`;

    useEffect(() => {
        setData("nomor_surat", nomorSurat);
    }, [part1, part2, part3, part4, part5]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post("/arsip-surat", { forceFormData: true });
    };

    return (
        <AppLayout>
            <Head title="Tambah Arsip Surat" />

            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl font-bold text-gray-700">Arsip Surat</h1>
                        <h2 className="text-base font-medium text-gray-700">Arsip Surat / Tambah Data</h2>
                    </div>
                </div>

                <div className="mb-6">
                    <div className="flex border-b border-gray-200">
                    </div>
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

                            {/* Nomor Surat */}
                            <div>
                                <label htmlFor="nomor_surat" className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Hash className="h-4 w-4 text-gray-500" /> Nomor Surat <span className="text-red-500">*</span>
                                </label>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        {/* Part 1 */}
                                        <input
                                            type="text"
                                            value={part1}
                                            required
                                            maxLength={2}
                                            onChange={(e) => setPart1(e.target.value.replace(/[^0-9]/g, ""))}
                                            className="w-16 px-3 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="01"
                                        />
                                        <span>.</span>

                                        {/* Part 2 */}
                                        <input
                                            type="text"
                                            required
                                            value={part2}
                                            maxLength={3}
                                            onChange={(e) => setPart2(e.target.value.replace(/[^0-9]/g, ""))}
                                            className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="001"
                                        />
                                        <span>/</span>

                                        {/* Part 3 */}
                                        <input
                                            type="text"
                                            required
                                            value={part3}
                                            maxLength={6}
                                            onChange={(e) => setPart3(e.target.value.toUpperCase().replace(/[^A-Z]/g, ""))}
                                            className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-center uppercase focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="KPSG"
                                        />
                                        <span>/</span>

                                        {/* Part 4 */}
                                        <select
                                            value={part4}
                                            required
                                            onChange={(e) => setPart4(e.target.value)}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="" disabled>Pilih</option>
                                            {bulanRomawi.map((b, idx) => (
                                                <option key={idx} value={b}>{b}</option>
                                            ))}
                                        </select>
                                        <span>/</span>

                                        {/* Part 5 */}
                                        <input
                                            type="text"
                                            value={part5}
                                            maxLength={4}
                                            onChange={(e) => setPart5(e.target.value.replace(/[^0-9]/g, ""))}
                                            className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="2025"
                                            required
                                        />
                                    </div>

                                    {/* Preview Nomor Surat */}
                                    <div className="font-mono rounded border px-3 py-2 bg-gray-50 w-max">
                                        <strong>Preview:</strong> {nomorSurat}
                                    </div>
                                </div>
                                {errors.nomor_surat && <p className="mt-1 text-sm text-red-600">{errors.nomor_surat}</p>}
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
                                    onChange={e => setData("penerima", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                <label htmlFor="file_path" className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Paperclip className="h-4 w-4 text-gray-500" /> File Surat (opsional)
                                </label>
                                <input
                                    type="file"
                                    id="file_path"
                                    onChange={e => setData("file_path", e.target.files ? e.target.files[0] : null)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                {errors.file_path && <p className="mt-1 text-sm text-red-600">{errors.file_path}</p>}
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
