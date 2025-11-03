import { PageHeader } from "@/Components/ui/page-header";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import {
    ArrowLeft,
    Package,
    PenBox,
    SearchIcon,
    XIcon
} from "lucide-react";
import { useEffect, useState } from "react";

interface Sangga {
    id: number;
    nama_sangga: string;
    logo_path: string | null;
}
interface Props {
    sangga: Sangga[];
    date: string;
}

export default function Index({ sangga, date }: Props) {
    const [search, setSearch] = useState<string>("");
    const [inputOpen, setInputOpen] = useState<boolean>(true);
    const [textOpen, setTextOpen] = useState<boolean>(false);
    const [isWide, setIsWide] = useState<boolean>(false);

    // pantau lebar layar
    useEffect(() => {
        const checkWidth = () => {
            if (window.innerWidth >= 768) {
                // md breakpoint
                setIsWide(true);
                setInputOpen(true);
                setTextOpen(true);
            } else {
                setIsWide(false);
                setInputOpen(true);
                setTextOpen(false);
            }
        };
        checkWidth();
        window.addEventListener("resize", checkWidth);
        return () => window.removeEventListener("resize", checkWidth);
    }, []);

    const filtered = search
        ? sangga.filter((s) =>
              s.nama_sangga.toLowerCase().includes(search.toLowerCase())
          )
        : sangga;

    return (
        <AppLayout>
            <Head title={`Sangga`} />
            <div className="min-h-screen bg-gray-50 p-6 overflow-hidden">
                <div className="mx-auto">
                    <PageHeader
                        title="Kehadiran"
                        subtitle="Hari dan Tanggal / Sangga"
                        backHref="/kehadiran"
                        backIcon={ArrowLeft}
                    />

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 border-b items-center flex justify-between space-x-2">
                            {textOpen && (
                                <div className="flex-col">
                                    <h2 className="text-lg font-semibold text-gray-800">
                                        Pilih Sangga untuk presensi{" "}
                                    </h2>
                                    <h3 className="text-sm text-gray-600">
                                        Tanggal{" "}
                                        {new Date(date).toLocaleDateString(
                                            "id-ID"
                                        )}
                                    </h3>
                                </div>
                            )}

                            {inputOpen && (
                                <div className="max-w-lg w-full md:w-auto">
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        placeholder="Cari sangga..."
                                        className="w-full px-3 py-2 border rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                            )}

                            {/* Tombol hanya muncul di layar kecil */}
                            {!isWide && (
                                <button
                                    className="rounded bg-blue-500 text-white w-max"
                                    onClick={() => {
                                        setInputOpen(!inputOpen);
                                        setTextOpen(!textOpen);
                                    }}
                                >
                                    {inputOpen ? <XIcon /> : <SearchIcon />}
                                </button>
                            )}
                        </div>

                        <div className="p-4">
                            {filtered.length === 0 ? (
                                <p className="text-sm text-gray-500">
                                    Belum ada sangga.
                                </p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                                    {filtered.map((m) => (
                                        <Link
                                            key={m.id}
                                            href={`/kehadiran/${date}/${m.id}`}
                                            className="flex items-center justify-between gap-4 p-3 border rounded-lg hover:bg-gray-50"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                                                    {m.logo_path ? (
                                                        <img
                                                            src={`/storage/${m.logo_path}`}
                                                            alt={m.nama_sangga}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <Package className="h-6 w-6 text-gray-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-800">
                                                        {m.nama_sangga}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-sm text-blue-600">
                                                <PenBox className="h-4 w-4" />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
