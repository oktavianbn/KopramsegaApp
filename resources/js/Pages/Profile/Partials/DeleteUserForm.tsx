import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { Lock } from 'lucide-react';
import { FormEventHandler, useRef, useState } from 'react';

export default function DeleteUserForm({
    className = '',
}: {
    className?: string;
}) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 `}>
            <header>
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-100">
                    Hapus Akun
                </h2>

                <p className="mt-1 text-sm text-gray-700 dark:text-gray-400">
                    Apabila akun Anda dihapus, seluruh data dan informasi terkait akun Anda akan hilang <span className='font-bold text-black'>Secara Permanen</span>.
                    Sebelum melakukan penghapusan akun, harap pastikan Anda telah <span className='font-bold text-black'>Melakukan pencadangan  dengan mengunduh atau menyimpan data maupun informasi penting</span> yang ingin tetap Anda miliki.

                </p>
            </header>
            <div className="pt-2 border-t">
                <DangerButton onClick={confirmUserDeletion} >
                    Hapus Akun
                </DangerButton>
            </div>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    <h2 className="text-lg font-medium text-gray-700 dark:text-gray-100">
                        Apakah Anda yakin ingin menghapus akun Anda?
                    </h2>

                    <p className="mt-1 text-sm text-gray-700 dark:text-gray-400">
                        <span className='font-bold text-black'>Sekali lagi</span> Apabila akun Anda dihapus, seluruh data dan informasi terkait akun Anda akan hilang <span className='font-bold text-black'>Secara Permanen</span>.
                        Sebelum melakukan penghapusan akun, harap pastikan Anda telah <span className='font-bold text-black'>Melakukan pencadangan  dengan mengunduh atau menyimpan data maupun informasi penting</span> yang ingin tetap Anda miliki.
                    </p>

                    <div className='mt-6'>
                        <InputLabel htmlFor="password" value="Password Anda" />
                        <div className="relative mt-1">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                id="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                type="password"
                                className="pl-10 pr-3 py-1 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                autoComplete="current-password"
                                placeholder="••••••••"
                            />
                        </div>
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>
                            Batal
                        </SecondaryButton>

                        <DangerButton className="ms-3" disabled={processing}>
                            Hapus Akun
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
