import { PageHeader } from "@/Components/ui/page-header";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Save } from "lucide-react";
import { FormEventHandler } from "react";

interface FormData {
    nama: string;
    deskripsi: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    ditutup: string; // '0' or '1'
}

export default function Edit({ sesi }: { sesi: any }) {
    const { data, setData, put, processing, errors } = useForm<FormData>({
        nama: sesi.nama || "",
        deskripsi: sesi.deskripsi || sesi.keterangan || "",
        tanggal_mulai: sesi.tanggal_mulai ? sesi.tanggal_mulai.split(' ')[0] : "",
        tanggal_selesai: sesi.tanggal_selesai ? sesi.tanggal_selesai.split(' ')[0] : "",
        ditutup: typeof sesi.ditutup !== 'undefined' ? String(sesi.ditutup ? 1 : 0) : '0',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/sesi/${sesi.id}`);
    };

    return (
        <AppLayout>
            <Head title="Edit Sesi" />
            <div className="p-6">
                {/* Header */}
                <PageHeader
                    title="Sesi"
                    subtitle={`Daftar / Edit Data ${sesi.nama}`}
                    backHref="/sesi"
                    backIcon={ArrowLeft}
                />

                {/* Form */}
                <div className="bg-white rounded-lg shadow p-6">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Nama */}
                            <div className="max-md:col-span-2">
                                <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama Sesi <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="nama"
                                    value={data.nama}
                                    onChange={(e) => setData("nama", e.target.value)}
                                    placeholder="Contoh: Sesi Penjualan 1"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg
                                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                                {errors.nama && <p className="mt-1 text-sm text-red-600">{errors.nama}</p>}
                            </div>

                            {/* Status */}
                            <div className="max-md:col-span-2">
                                <label htmlFor="ditutup" className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <select
                                    id="ditutup"
                                    value={data.ditutup}
                                    onChange={(e) => setData('ditutup', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="0">Dibuka</option>
                                    <option value="1">Ditutup</option>
                                </select>
                            </div>

                            {/* Tanggal Mulai */}
                            <div>
                                <label htmlFor="tanggal_mulai" className="block text-sm font-medium text-gray-700 mb-2">
                                    Tanggal Mulai <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    id="tanggal_mulai"
                                    value={data.tanggal_mulai}
                                    onChange={(e) => setData("tanggal_mulai", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg
                                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                                {errors.tanggal_mulai && <p className="mt-1 text-sm text-red-600">{errors.tanggal_mulai}</p>}
                            </div>

                            {/* Tanggal Selesai */}
                            <div>
                                <label htmlFor="tanggal_selesai" className="block text-sm font-medium text-gray-700 mb-2">
                                    Tanggal Selesai <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    id="tanggal_selesai"
                                    value={data.tanggal_selesai}
                                    onChange={(e) => setData("tanggal_selesai", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg
                                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                                {errors.tanggal_selesai && <p className="mt-1 text-sm text-red-600">{errors.tanggal_selesai}</p>}
                            </div>

                            {/* Keterangan */}
                            <div className="max-md:col-span-3">
                                <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700 mb-2">
                                    Keterangan
                                </label>
                                <textarea
                                    id="deskripsi"
                                    value={data.deskripsi}
                                    onChange={(e) => setData("deskripsi", e.target.value)}
                                    placeholder="Masukkan deskripsi sesi"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg
                                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                    {errors.deskripsi && <p className="mt-1 text-sm text-red-600">{errors.deskripsi}</p>}
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex items-center justify-end gap-4 pt-6 border-t">
                            <Link
                                href="/sesi"
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
