import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import AppLayout from "@/Layouts/AppLayout";

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    user: {
        data: User[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters?: {
        search?: string;
    };
}

export default function Index({ user, filters = {} }: Props) {
    const [search, setSearch] = useState(filters.search || "");

    const handleSearch = () => {
        router.get("/user", { search }, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
            router.delete(`/user/${id}`);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("id-ID");
    };

    return (
        <AppLayout>
            <Head title="User" />

            <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Manajemen User
                    </h1>
                    <p className="text-gray-600">Kelola data user</p>
                </div>

                {/* Actions & Filters */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                        <div className="flex flex-col md:flex-row gap-4 flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Cari user..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <Link
                            href="/user/create"
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Tambah Data
                        </Link>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nama
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tanggal Dibuat
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {user.data.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item.role ?? "Tidak ada"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatDate(item.created_at)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/user/${item.id}/edit`}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(item.id)
                                                    }
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {user.last_page > 1 && (
                        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                            <div className="flex items-center justify-between">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    {user.current_page > 1 && (
                                        <Link
                                            href={`/user?page=${
                                                user.current_page - 1
                                            }`}
                                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                            Previous
                                        </Link>
                                    )}
                                    {user.current_page < user.last_page && (
                                        <Link
                                            href={`/user?page=${
                                                user.current_page + 1
                                            }`}
                                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                            Next
                                        </Link>
                                    )}
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Showing{" "}
                                            <span className="font-medium">
                                                {(user.current_page - 1) *
                                                    user.per_page +
                                                    1}
                                            </span>{" "}
                                            to{" "}
                                            <span className="font-medium">
                                                {Math.min(
                                                    user.current_page *
                                                        user.per_page,
                                                    user.total
                                                )}
                                            </span>{" "}
                                            of{" "}
                                            <span className="font-medium">
                                                {user.total}
                                            </span>{" "}
                                            results
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                            {Array.from(
                                                {
                                                    length: user.last_page,
                                                },
                                                (_, i) => i + 1
                                            ).map((page) => (
                                                <Link
                                                    key={page}
                                                    href={`/user?page=${page}`}
                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                        page ===
                                                        user.current_page
                                                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                                    }`}
                                                >
                                                    {page}
                                                </Link>
                                            ))}
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
