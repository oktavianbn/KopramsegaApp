import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Save, Calendar, FileText, User, Clock } from "lucide-react";
import AppLayout from "@/Layouts/AppLayout";
import { PageHeader } from "@/Components/ui/page-header";

interface Role {
    id: number;
    name: string;
}

interface Props {
    rencana: Rencana;
    roles: Role[];
}

interface Rencana {
    id: number;
    nama_rencana: string;
    deskripsi?: string | null;
    tanggal_mulai: string;
    tanggal_selesai?: string;
    status: "belum_dimulai" | "sedang_dilaksanakan" | "selesai";
    role_id: number;
}

export default function Edit({ rencana, roles }: Props) {
    const { data, setData, put, processing, errors } = useForm<Rencana>({
        id: rencana.id,
        nama_rencana: rencana.nama_rencana,
        deskripsi: rencana.deskripsi,
        tanggal_mulai: rencana.tanggal_mulai,
        tanggal_selesai: rencana.tanggal_selesai,
        status: rencana.status,
        role_id: rencana.role_id,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("rencana.update", rencana.id)); // pakai update
    };

    return (
        <AppLayout>
            <Head title="Edit Rencana" />

            <div className="min-h-screen bg-gray-50 p-6">
                <div className="mx-auto">
                {/* Header */}
                <PageHeader
                    title="Rencana"
                    subtitle={`Daftar / Edit Data ${rencana.nama_rencana}`}
                    backHref="/rencana"
                    backIcon={ArrowLeft}
                />

                    {/* Form */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Nama Rencana */}
                            <div>
                                <label
                                    htmlFor="nama_rencana"
                                    className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
                                >
                                    <FileText className="h-4 w-4" />
                                    Nama Rencana
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="nama_rencana"
                                    value={data.nama_rencana}
                                    onChange={(e) =>
                                        setData("nama_rencana", e.target.value)
                                    }
                                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.nama_rencana
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                    placeholder="Masukkan nama rencana"
                                />
                                {errors.nama_rencana && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.nama_rencana}
                                    </p>
                                )}
                            </div>

                            {/* Deskripsi */}
                            <div>
                                <label
                                    htmlFor="deskripsi"
                                    className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
                                >
                                    <FileText className="h-4 w-4" />
                                    Deskripsi
                                </label>
                                <textarea
                                    id="deskripsi"
                                    value={data.deskripsi ?? ""}
                                    onChange={(e) =>
                                        setData("deskripsi", e.target.value)
                                    }
                                    rows={4}
                                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.deskripsi
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                    placeholder="Masukkan deskripsi rencana (opsional)"
                                />
                                {errors.deskripsi && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.deskripsi}
                                    </p>
                                )}
                            </div>

                            {/* Row for Tanggal */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Tanggal Mulai */}
                                <div>
                                    <label
                                        htmlFor="tanggal_mulai"
                                        className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
                                    >
                                        <Calendar className="h-4 w-4" />
                                        Tanggal Mulai
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        id="tanggal_mulai"
                                        value={data.tanggal_mulai}
                                        onChange={(e) =>
                                            setData(
                                                "tanggal_mulai",
                                                e.target.value
                                            )
                                        }
                                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            errors.tanggal_mulai
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                    />
                                    {errors.tanggal_mulai && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.tanggal_mulai}
                                        </p>
                                    )}
                                </div>

                                {/* Tanggal Selesai */}
                                <div>
                                    <label
                                        htmlFor="tanggal_selesai"
                                        className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
                                    >
                                        <Calendar className="h-4 w-4" />
                                        Tanggal Selesai (Target)
                                    </label>
                                    <input
                                        type="date"
                                        id="tanggal_selesai"
                                        value={data.tanggal_selesai ?? ""}
                                        onChange={(e) =>
                                            setData(
                                                "tanggal_selesai",
                                                e.target.value
                                            )
                                        }
                                        min={data.tanggal_mulai}
                                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            errors.tanggal_selesai
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                    />
                                    {errors.tanggal_selesai && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.tanggal_selesai}
                                        </p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500">
                                        Opsional - tanggal target penyelesaian
                                    </p>
                                </div>
                            </div>

                            {/* Row for Status dan Role */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Status */}
                                <div>
                                    <label
                                        htmlFor="status"
                                        className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
                                    >
                                        <Clock className="h-4 w-4" />
                                        Status
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) =>
                                            setData(
                                                "status",
                                                e.target.value as Rencana["status"]
                                            )
                                        }
                                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            errors.status
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                    >
                                        <option value="belum_dimulai">
                                            Belum Dimulai
                                        </option>
                                        <option value="sedang_dilaksanakan">
                                            Sedang Dilaksanakan
                                        </option>
                                        <option value="selesai">Selesai</option>
                                    </select>
                                    {errors.status && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.status}
                                        </p>
                                    )}
                                </div>

                                {/* Role */}
                                <div>
                                    <label
                                        htmlFor="role_id"
                                        className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
                                    >
                                        <User className="h-4 w-4" />
                                        Role Penanggung Jawab
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="role_id"
                                        value={data.role_id}
                                        onChange={(e) =>
                                            setData("role_id", Number(e.target.value))
                                        }
                                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            errors.role_id
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                    >
                                        <option value="" disabled>Pilih Role</option>
                                        {roles.map((role) => (
                                            <option key={role.id} value={role.id}>
                                                {role.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.role_id && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.role_id}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
                                <Link
                                    href="/rencana"
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Save className="h-4 w-4" />
                                    {processing
                                        ? "Menyimpan..."
                                        : "Update Rencana"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
