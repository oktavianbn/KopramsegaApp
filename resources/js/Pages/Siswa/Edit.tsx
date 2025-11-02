import { PageHeader } from "@/Components/ui/page-header";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";

interface Sangga {
    id: number;
    nama_sangga: string;
}

interface Siswa {
    id: number;
    nis: string;
    nta: string;
    nama: string;
    kelas: string;
    jurusan: string;
    rombel: string | null;
    jenis_kelamin: string;
    sangga_id: number | null;
}

interface Props {
    siswa: Siswa;
    sangga: Sangga[];
}

export default function Edit({ siswa, sangga }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        nis: siswa.nis,
        nta: siswa.nta || "",
        nama: siswa.nama,
        kelas: siswa.kelas || "",
        jurusan: siswa.jurusan || "",
        rombel: siswa.rombel || "",
        jenis_kelamin: siswa.jenis_kelamin || "l",
        sangga_id: siswa.sangga_id || "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/siswa/${siswa.id}`);
    };

    return (
        <AppLayout>
            <Head title="Edit Siswa" />
            <div className="p-6">
                {/* Header */}
                <PageHeader
                    title="Siswa"
                    subtitle={`Daftar / Edit Data ${siswa.nama}`}
                    backHref="/siswa"
                    backIcon={ArrowLeft}
                />

                <div className="bg-white rounded-lg shadow p-6">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    NIS
                                </label>
                                <input
                                    value={data.nis}
                                    onChange={(e) =>
                                        setData("nis", e.target.value)
                                    }
                                    className="w-full px-3 py-2 border rounded"
                                />
                                {errors.nis && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.nis}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    NTA
                                </label>
                                <input
                                    value={data.nta}
                                    onChange={(e) =>
                                        setData("nta", e.target.value)
                                    }
                                    className="w-full px-3 py-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama
                                </label>
                                <input
                                    value={data.nama}
                                    onChange={(e) =>
                                        setData("nama", e.target.value)
                                    }
                                    className="w-full px-3 py-2 border rounded"
                                />
                                {errors.nama && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.nama}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kelas
                                </label>
                                <select
                                    value={data.kelas}
                                    onChange={(e) =>
                                        setData("kelas", e.target.value)
                                    }
                                    className="w-full px-3 py-2 border rounded"
                                >
                                    <option value="" disabled>
                                        -- Pilih Kelas --
                                    </option>
                                    <option value="X">X</option>
                                    <option value="XI">XI</option>
                                    <option value="XII">XII</option>
                                </select>
                                {errors.kelas && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.kelas}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Jurusan
                                </label>
                                <select
                                    value={data.jurusan}
                                    onChange={(e) =>
                                        setData("jurusan", e.target.value)
                                    }
                                    className="w-full px-3 py-2 border rounded"
                                >
                                    <option value="" disabled>
                                        -- Pilih Jurusan --
                                    </option>
                                    <option value="AKL">AKL</option>
                                    <option value="MPLB">MPLB</option>
                                    <option value="PM">PM</option>
                                    <option value="ULP">ULP</option>
                                    <option value="DKV">DKV</option>
                                    <option value="RPL">RPL</option>
                                    <option value="BC">BC</option>
                                </select>
                                {errors.jurusan && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.jurusan}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Rombel
                                </label>
                                <select
                                    value={data.rombel}
                                    onChange={(e) =>
                                        setData("rombel", e.target.value)
                                    }
                                    className="w-full px-3 py-2 border rounded"
                                >
                                    <option value="">
                                        -- Kosong / Tidak Ada --
                                    </option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                </select>
                                {errors.rombel && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.rombel}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Jenis Kelamin
                                </label>
                                <select
                                    value={data.jenis_kelamin}
                                    onChange={(e) =>
                                        setData("jenis_kelamin", e.target.value)
                                    }
                                    className="w-full px-3 py-2 border rounded"
                                >
                                    <option value="l">Laki-laki</option>
                                    <option value="p">Perempuan</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sangga
                                </label>
                                <select
                                    value={data.sangga_id}
                                    onChange={(e) =>
                                        setData("sangga_id", e.target.value)
                                    }
                                    className="w-full px-3 py-2 border rounded"
                                >
                                    <option value="">-- Pilih Sangga --</option>
                                    {sangga.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.nama_sangga}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-4 pt-6 border-t">
                            <Link
                                href="/siswa"
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                            >
                                {processing ? "Menyimpan..." : "Simpan"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
