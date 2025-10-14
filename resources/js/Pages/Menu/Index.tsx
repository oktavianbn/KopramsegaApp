import AppLayout from "@/Layouts/AppLayout";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import { Package, Search, Plus, Edit, Trash2 } from "lucide-react";

export interface MenuModel {
    id: number;
    sesi_id: number;
    nama: string;
    harga?: number | null;
    stok?: number | null;
    foto?: string | null;
}

export interface SesiModel {
    id: number;
    nama: string;
    deskripsi?: string | null;
    tanggal_mulai: string;
    tanggal_selesai?: string | null;
    ditutup?: boolean;
    status?: string;
    menus?: MenuModel[];
}

interface Props {
    sesis: SesiModel[];
}

export default function MenuIndex({ sesis }: Props) {
    const [localSesis, setLocalSesis] = useState<SesiModel[]>(sesis || []);
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState<string | null>(null);

    const formatDate = (dateString?: string | null) => {
        if (!dateString) return "-";
        const d = new Date(dateString);
        if (isNaN(d.getTime())) return "-";
        return d.toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    };

    const handleDeleteMenu = (menuId: number) => {
        if (!confirm("Apakah Anda yakin ingin menghapus menu ini?")) return;
        router.delete(`/menu/${menuId}`, {
            onSuccess: () => {
                setLocalSesis((prev) => prev.map(s => ({ ...s, menus: (s.menus || []).filter((m: any) => m.id !== menuId) })));
            }
        });
    };

    const filteredSesis = localSesis.filter((s) => {
        const menus = s.menus || [];
        const matchesSearch = !search || s.nama.toLowerCase().includes(search.toLowerCase()) || menus.some((m: any) => (m.nama || '').toLowerCase().includes(search.toLowerCase()));
        const matchesFilter = !activeFilter || s.status === activeFilter;
        return matchesSearch && matchesFilter;
    });

    return (
        <AppLayout>
            <Head title="Menu" />
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-6 items-center">
                                <div className="p-2 h-max bg-orange-100 rounded-lg flex justify-center items-center">
                                    <Package className="h-5 w-5 text-orange-600" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h1 className="text-2xl font-bold text-gray-700">Menu</h1>
                                    <h2 className="text-base font-medium text-gray-700">Penjualan / Menu / Daftar</h2>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6 flex items-center justify-between gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input type="text" placeholder="Cari sesi atau menu..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 pr-6 py-2 border w-full max-w-md border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredSesis.map((sesi) => (
                            <div key={sesi.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 border-b flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">{sesi.nama}</h3>
                                        <p className="text-sm text-gray-600">{formatDate(sesi.tanggal_mulai)}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <a href={`/menu/create?sesi_id=${sesi.id}`} className="inline-flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"> <Plus className="h-4 w-4" /> Tambah Menu</a>
                                    </div>
                                </div>

                                <div className="p-4">
                                    <div className="space-y-3">
                                        {(sesi.menus || []).length === 0 && (
                                            <p className="text-sm text-gray-500">Belum ada menu untuk sesi ini.</p>
                                        )}
                                        {(sesi.menus || []).map((m) => (
                                            <div key={m.id} className="flex items-center justify-between gap-4 p-3 border rounded-lg">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                                                        {m.foto ? <img src={`/storage/${m.foto}`} alt={m.nama} className="w-full h-full object-cover" /> : <Package className="h-6 w-6 text-gray-400" />}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-800">{m.nama}</div>
                                                        <div className="text-xs text-gray-500">{m.harga ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(m.harga) : '-'}</div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <a href={`/menu/${m.id}/edit`} className="px-3 py-1.5 border rounded text-sm flex items-center gap-2 hover:bg-gray-50"><Edit className="h-4 w-4" /> Edit</a>
                                                    <button onClick={() => handleDeleteMenu(m.id)} className="px-3 py-1.5 border rounded text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"><Trash2 className="h-4 w-4" /> Hapus</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
