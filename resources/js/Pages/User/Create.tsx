import { PageHeader } from "@/Components/ui/page-header";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Save } from "lucide-react";
import { FormEventHandler } from "react";

interface Role {
    id: number;
    name: string;
}

interface FormData {
    name: string;
    email: string;
    role_id: string;
    password: string;
}

interface Props {
    roles: Role[];
}

export default function Create({ roles }: Props) {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        name: "",
        email: "",
        role_id: "",
        password: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post("/user");
    };

    return (
        <AppLayout>
            <Head title="Tambah Data Pengguna" />
            <div className="p-6">
                {/* Header */}
                <PageHeader
                    title="Pengguna"
                    subtitle="Daftar / Tambah Data"
                    backHref="/user"
                    backIcon={ArrowLeft}
                />

                {/* Form */}
                <div className="bg-white rounded-lg shadow p-6">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Nama */}
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Nama
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    placeholder="Masukkan nama..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.name}
                                    </p>
                                )}
                            </div>
                            {/* email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Email
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="email"
                                    autoComplete="new-email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    placeholder="example@test.com"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Password
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    id="kategori"
                                    autoComplete="new-password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    placeholder="Masukkan password..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Role */}
                            <div>
                                <label
                                    htmlFor="role_id"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Role
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="role_id"
                                    value={data.role_id}
                                    onChange={(e) =>
                                        setData("role_id", e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Pilih Role</option>
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

                        {/* Submit Buttons */}
                        <div className="flex items-center justify-end gap-4 pt-6 border-t">
                            <Link
                                href="/user"
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
