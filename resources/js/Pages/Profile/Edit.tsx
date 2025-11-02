import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Head, Link } from "@inertiajs/react";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import AppLayout from "@/Layouts/AppLayout";
import { Download, User } from "lucide-react";

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    return (
        <AppLayout>
            <Head title="Profile" />
            <div className="p-6">
                {/* Header */}

                <div className="grid gap-2 md:flex items-center justify-between mb-6">
                    <div className="flex gap-6 items-center">
                        <Link
                            href="/role"
                            className="p-2 h-max bg-blue-200 rounded-lg flex justify-center items-center"
                        >
                            <User className="h-5 w-5 text-blue-500" />
                        </Link>
                        <div className="flex flex-col gap-2">
                            <h1 className="text-2xl font-bold text-gray-700 whitespace-nowrap">
                                Profile
                            </h1>
                            <h2 className="text-base font-medium text-gray-700 whitespace-nowrap">
                                Informasi Tentang Profile Akun Anda
                            </h2>
                        </div>
                    </div>
                </div>
                <div className="flex gap-4 mb-6 border-b"></div>

                <div className=" max-w-7xl space-y-6">
                    <div className="lg:grid lg:grid-cols-3 gap-8">
                        <div className="bg-white p-4 col-span-2 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="max-w-xl"
                            />
                        </div>

                        <div className="bg-white p-4 col-span-1 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                            <UpdatePasswordForm className="max-w-xl" />
                        </div>
                    </div>
                    <div className="lg:grid lg:grid-cols-3 gap-8">
                        <div className="bg-white dark:bg-gray-800 shadow rounded-2xl p-6 sm:p-8">
                            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-100 flex items-center gap-2">
                                Bantuan Atau Petunjuk
                            </h2>
                            <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">
                                Butuh bantuan? Silakan hubungi tim berikut:
                            </p>

                            <div className="mt-4">
                                <ul className="mt-2 space-y-2">
                                    <li>
                                        <Link
                                            href="#"
                                            className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 transition"
                                        >
                                            <span className="flex w-6 h-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-700 text-blue-700 dark:text-blue-300 text-xs font-bold">
                                                D1
                                            </span>
                                            Dev 1
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="#"
                                            className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 transition"
                                        >
                                            <span className="flex w-6 h-6 items-center justify-center rounded-full bg-green-100 dark:bg-green-700 text-green-700 dark:text-green-300 text-xs font-bold">
                                                D2
                                            </span>
                                            Dev 2
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">
                                Butuh petunjuk penggunaan? Silakan unduh dokumen
                                berikut:
                            </p>

                            <div className="mt-4">
                                <div className="text-sm text-blue-500 flex space-x-2">
                                    <Download className="h-5 w-5" />
                                    <Link
                                        href="/path/to/Buku_Petunjuk.pdf"
                                        className="hover:underline"
                                    >
                                        Buku Petunjuk.pdf
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-4 col-span-2 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                            <DeleteUserForm className="max-w-xl" />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
