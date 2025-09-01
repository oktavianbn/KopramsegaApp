import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Save } from "lucide-react";
import { FormEventHandler } from "react";

interface FormData {
    id: number
    name: string
    guard_name: string
}

export default function Create() {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        id: 0,
        name: "",
        guard_name: ""
    });

    const handleTipeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setData({
            ...data,
            guard_name: e.target.value as "web" | "api",
        });
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post("/role");
    };

    return (
        <AppLayout>
            <Head title="Tambah Data Role" />
            <div className="p-6">
                {/* Header */}
                <div className="grid gap-2 md:flex items-center justify-between mb-6">
                    <div className="flex gap-6 items-center">
                        <Link
                            href="/role"
                            className="p-2 h-max bg-gray-200 rounded-lg flex justify-center items-center">
                            <ArrowLeft className="h-5 w-5 text-gray-500" />
                        </Link>
                        <div className="flex flex-col gap-2">
                            <h1 className="text-2xl font-bold text-gray-700 whitespace-nowrap">Role</h1>
                            <h2 className="text-base font-medium text-gray-700 whitespace-nowrap">Role / Tambah Data</h2>
                        </div>
                    </div>
                </div>
                <div className="flex gap-4 mb-6 border-b">

                </div>

                {/* Form */}
                <div className="bg-white rounded-lg shadow p-6">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                            <div className="max-md:col-span-2">
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Nama Role{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    placeholder="Role"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg
                                        focus:outline-none focus:ring-2 focus:ring-blue-500
                                        focus:border-transparent"
                                    required
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.name}
                                    </p>
                                )}
                            </div>
                            <div className="max-md:col-span-2">
                                <label
                                    htmlFor="tipe"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Tipe <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="tipe"
                                    value={data.guard_name}
                                    onChange={handleTipeChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg
                                        focus:outline-none focus:ring-2 focus:ring-blue-500
                                        focus:border-transparent"
                                    required
                                >
                                    <option value="" disabled>
                                        Pilih Guard Name
                                    </option>
                                    <option value="web">Web</option>
                                    <option value="api">Api</option>
                                </select>
                                {errors.guard_name && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.guard_name}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex items-center justify-end gap-4 pt-6 border-t">
                            <Link
                                href="/role"
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
