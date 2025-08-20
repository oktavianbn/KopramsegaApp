import { useState, FormEventHandler } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { Navbar } from "@/Components/Navbar";
import { Sidebar } from "@/Components/Sidebar";
import { ArrowLeft, Save } from "lucide-react";

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface FormData {
    name: string;
    email: string;
    role: string;
    password?: string;
}

interface Props {
    user: User;
}

export default function Edit({ user }: Props) {
    const { data, setData, put, processing, errors } = useForm<FormData>({
        name: user.name,
        email: user.email,
        role: user.role,
        password: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/user/${user.id}`);
    };

    return (
        <>
            <Head title="Edit Data User" />
            <Navbar />
            <Sidebar />

            <div className="md:ml-64 pt-16 min-h-screen bg-gray-50">
                <div className="p-6">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Edit Data User
                                </h1>
                                <p className="text-gray-600">
                                    Edit data user yang sudah ada
                                </p>
                            </div>
                        </div>
                    </div>

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

                                {/* Email */}
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Email
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
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
                                        <span className="text-gray-500 text-xs">
                                            (Kosongkan jika tidak ingin
                                            mengubah)
                                        </span>
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        placeholder="Masukkan password baru..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                        htmlFor="role"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Role
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="role"
                                        value={data.role}
                                        onChange={(e) =>
                                            setData("role", e.target.value)
                                        }
                                        placeholder="Masukkan role..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                    {errors.role && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.role}
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
                                    {processing ? "Menyimpan..." : "Update"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
