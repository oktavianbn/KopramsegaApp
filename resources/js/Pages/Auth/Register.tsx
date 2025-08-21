import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import logo from '../../../../public/simako.svg';


export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation:'',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'));
    };

    return (
        <div className="w-full min-h-screen  flex items-center justify-center bg-blue-500 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">

            <Head title="Register" />

            <div className="max-w-md w-full space-y-8">
                {/* Header Section */}
                <div className="text-center">
                    <h2 className='font-bold text-white text-2xl'>Selamat Datang Kembali</h2>
                    <a className="header flex flex-col text-blue-500">
                        <img
                            src={logo}
                            className="text-white -my-5 px-14"
                            alt=""
                        />
                    </a>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-8 w-full max-w-md mx-auto">
                    <form onSubmit={submit} className="space-y-6">
                        <h2 className="font-bold text-center text-2xl">Register</h2>

                        {/* Name */}
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Nama
                            </label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={data.name}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Masukkan nama Anda"
                                autoComplete="name"
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            <InputError
                                message={errors.name}
                                className="mt-2 text-sm text-red-600 dark:text-red-400"
                            />
                        </div>

                        {/* Email */}
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
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError
                                message={errors.email}
                                className="mt-2 text-sm text-red-600 dark:text-red-400"
                            />
                        </div>

                        {/* Password */}
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
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <InputError
                                message={errors.password}
                                className="mt-2 text-sm text-red-600 dark:text-red-400"
                            />
                        </div>

                        {/* Password confirm*/}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Password
                            </label>
                            <input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Masukkan password Anda Kembali"
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                            />
                            <InputError
                                message={errors.password_confirmation}
                                className="mt-2 text-sm text-red-600 dark:text-red-400"
                            />
                        </div>

                        {/* Register Button */}
                        <div>
                            <button
                                className="w-full bg-blue-600 hover:bg-blue-700 focus:ring-blue-600 text-white font-semibold px-3 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={processing}
                            >
                                {processing ? 'Memproses...' : 'Register'}
                            </button>
                        </div>

                        {/* Footer Links */}
                        <div className="flex justify-center items-center pt-4 border-t border-gray-100 dark:border-gray-700">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                Sudah punya akun?{" "}
                                <Link
                                    href={route('login')}
                                    className="text-blue-500 hover:text-blue-700 transition-colors"
                                >
                                    Login
                                </Link>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
