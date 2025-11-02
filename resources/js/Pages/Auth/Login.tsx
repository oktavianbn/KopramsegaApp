import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import logo from "../../../../public/simako.svg";
export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <div className="w-full min-h-screen  flex items-center justify-center bg-blue-500 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
            <Head title="Log in" />

            <div className="max-w-md w-full space-y-8">
                {/* Header Section */}
                <div className="text-center">
                    <h2 className="font-bold text-white text-2xl">
                        Selamat Datang Kembali
                    </h2>
                    <a className="header flex flex-col text-blue-500">
                        <img
                            src={logo}
                            className="text-white -my-5 px-14"
                            alt=""
                        />
                    </a>
                </div>

                {/* Status Message */}
                {status && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                        <div className="text-sm font-medium text-green-800 dark:text-green-200">
                            {status}
                        </div>
                    </div>
                )}

                {/* Login Form */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-8 ">
                    <form onSubmit={submit} className="space-y-6">
                        <h2 className="font-bold text-center text-2xl">
                            Login
                        </h2>
                        {/* Email Field */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Masukkan email Anda"
                                autoComplete="username"
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.email}
                                className="mt-2 text-sm text-red-600 dark:text-red-400"
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Masukkan password Anda"
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.password}
                                className="mt-2 text-sm text-red-600 dark:text-red-400"
                            />
                        </div>
                        <div className="flex sm:flex-row items-center justify-between">
                            {/* Remember Me */}
                            <div className="flex items-center">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-600 border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded"
                                    onChange={(e) =>
                                        setData(
                                            "remember",
                                            (e.target.checked || false) as false
                                        )
                                    }
                                />
                                <label className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                                    Ingat saya
                                </label>
                            </div>

                            {canResetPassword && (
                                <Link
                                    href={route("password.request")}
                                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                                >
                                    Lupa password?
                                </Link>
                            )}
                        </div>

                        {/* Login Button */}
                        <div>
                            <button
                                className="w-full bg-blue-600 hover:bg-blue-700 focus:ring-blue-600 text-white font-semibold px-3 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={processing}
                            >
                                {processing ? (
                                    <div className="flex items-center justify-center">
                                        <svg
                                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Memproses...
                                    </div>
                                ) : (
                                    "Login"
                                )}
                            </button>
                        </div>

                        {/* Footer Links */}
                        <div className="flex justify-center items-center space-y-3 sm:space-y-0 pt-4 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex text-sm text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 font-medium transition-colors">
                                <span>
                                    Keterpaksaan - Tanggung Jawab - Cinta
                                </span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
