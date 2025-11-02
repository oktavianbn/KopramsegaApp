import { PageHeader } from "@/Components/ui/page-header";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

interface FormData {
    judul: string;
    links: string[];
    kameramen: string;
    keterangan: string;
}

export default function Create() {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        judul: "",
        links: [""],
        kameramen: "",
        keterangan: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Filter out empty links and update data
        const filteredLinks = data.links.filter((link) => link.trim() !== "");
        setData("links", filteredLinks);

        post("/dokumentasi");
    };

    const addLink = () => {
        setData("links", [...data.links, ""]);
    };

    const removeLink = (index: number) => {
        if (data.links.length > 1) {
            const newLinks = data.links.filter((_, i) => i !== index);
            setData("links", newLinks);
        }
    };

    const updateLink = (index: number, value: string) => {
        const newLinks = [...data.links];
        newLinks[index] = value;
        setData("links", newLinks);
    };

    return (
        <AppLayout>
            <Head title="Tambah Dokumentasi" />

            <div className="py-6">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <PageHeader
                    title="Dokumentasi"
                    subtitle="Daftar / Tambah Data"
                    backHref="/dokumentasi"
                    backIcon={ArrowLeft}
                />

                    {/* Form */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Judul */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Judul Dokumentasi *
                                </label>
                                <input
                                    type="text"
                                    value={data.judul}
                                    onChange={(e) =>
                                        setData("judul", e.target.value)
                                    }
                                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.judul
                                            ? "border-red-500"
                                            : "border-gray-300"
                                        }`}
                                    placeholder="Masukkan judul dokumentasi"
                                />
                                {errors.judul && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.judul}
                                    </p>
                                )}
                            </div>

                            {/* Links */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Link Dokumentasi *
                                    </label>
                                    <button
                                        type="button"
                                        onClick={addLink}
                                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                                    >
                                        <Plus size={16} />
                                        Tambah Link
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {data.links.map((link, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2"
                                        >
                                            <div className="flex-1">
                                                <input
                                                    type="url"
                                                    value={link}
                                                    onChange={(e) =>
                                                        updateLink(
                                                            index,
                                                            e.target.value
                                                        )
                                                    }
                                                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors[`links.${index}`]
                                                            ? "border-red-500"
                                                            : "border-gray-300"
                                                        }`}
                                                    placeholder="https://example.com/dokumentasi"
                                                />
                                                {errors[`links.${index}`] && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {
                                                            errors[
                                                            `links.${index}`
                                                            ]
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                            {data.links.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeLink(index)
                                                    }
                                                    className="text-red-600 hover:text-red-800 p-2"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {errors.links && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.links}
                                    </p>
                                )}
                            </div>

                            {/* Kameramen */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kameramen
                                </label>
                                <input
                                    type="text"
                                    value={data.kameramen}
                                    onChange={(e) =>
                                        setData("kameramen", e.target.value)
                                    }
                                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.kameramen
                                            ? "border-red-500"
                                            : "border-gray-300"
                                        }`}
                                    placeholder="Nama kameramen"
                                />
                                {errors.kameramen && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.kameramen}
                                    </p>
                                )}
                            </div>

                            {/* Keterangan */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Keterangan
                                </label>
                                <textarea
                                    value={data.keterangan}
                                    onChange={(e) =>
                                        setData("keterangan", e.target.value)
                                    }
                                    rows={4}
                                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.keterangan
                                            ? "border-red-500"
                                            : "border-gray-300"
                                        }`}
                                    placeholder="Keterangan atau deskripsi dokumentasi"
                                />
                                {errors.keterangan && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.keterangan}
                                    </p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
                                <Link
                                    href="/dokumentasi"
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {processing ? "Menyimpan..." : "Simpan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
