"use client";

import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import {
    ArrowLeft,
    Minus,
    Package,
    Plus,
    User,
    X
} from "lucide-react";
import { useState } from "react";

interface AvailableStok {
    id: number;
    barang_id: number;
    barang_nama: string;
    spesifikasi_id: number;
    spesifikasi_key: string;
    spesifikasi_value: string;
    jumlah_tersedia: number;
}

interface User {
    id: number;
    name: string;
}

interface DetailPeminjamanForm {
    barang_id: number;
    spesifikasi_id?: number | null;
    jumlah: number;
    barang_nama: string;
    spesifikasi_key: string;
    spesifikasi_value: string;
    jumlah_tersedia: number;
}

interface Props {
    availableStok: AvailableStok[];
    users: User[];
}

export default function Create({ availableStok, users }: Props) {
    const [detailPeminjaman, setDetailPeminjaman] = useState<
        DetailPeminjamanForm[]
    >([]);
    const [showAddItemModal, setShowAddItemModal] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        nama_peminjam: "",
        alamat: "",
        no_telp: "",
        asal: "",
        foto_identitas: null as File | null,
        jenis: "pinjam" as "pinjam" | "sewa",
        waktu_pinjam_mulai: "",
        waktu_pinjam_selesai: "",
        penerima: "",
        detail_peminjaman: [] as { barang_id: number; spesifikasi_id?: number | null; jumlah: number }[],
    });

    const addItem = (stok: AvailableStok, jumlah: number) => {
        // Check if item already exists by barang+spesifikasi
        const existingIndex = detailPeminjaman.findIndex((item) =>
            item.barang_id === stok.barang_id &&
            ((item.spesifikasi_id ?? null) === (stok.spesifikasi_id ?? null))
        );

        const newItem = {
            barang_id: stok.barang_id,
            spesifikasi_id: stok.spesifikasi_id ?? null,
            jumlah: Math.min(jumlah, stok.jumlah_tersedia),
            barang_nama: stok.barang_nama,
            spesifikasi_key: stok.spesifikasi_key,
            spesifikasi_value: stok.spesifikasi_value,
            jumlah_tersedia: stok.jumlah_tersedia,
        };

        if (existingIndex >= 0) {
            const updatedDetail = [...detailPeminjaman];
            updatedDetail[existingIndex].jumlah = Math.min(
                updatedDetail[existingIndex].jumlah + jumlah,
                stok.jumlah_tersedia
            );
            setDetailPeminjaman(updatedDetail);
        } else {
            setDetailPeminjaman([...detailPeminjaman, newItem]);
        }

        // Update form data
        const formDetails = [...detailPeminjaman];
        if (existingIndex >= 0) {
            formDetails[existingIndex].jumlah = Math.min(
                formDetails[existingIndex].jumlah + jumlah,
                stok.jumlah_tersedia
            );
        } else {
            formDetails.push(newItem);
        }

        setData(
            "detail_peminjaman",
            formDetails.map((item) => ({
                barang_id: item.barang_id,
                spesifikasi_id: item.spesifikasi_id ?? null,
                jumlah: item.jumlah,
            }))
        );

        setShowAddItemModal(false);
    };

    const removeItem = (index: number) => {
        const updatedDetail = detailPeminjaman.filter((_, i) => i !== index);
        setDetailPeminjaman(updatedDetail);
        setData(
            "detail_peminjaman",
            updatedDetail.map((item) => ({
                barang_id: item.barang_id,
                spesifikasi_id: item.spesifikasi_id ?? null,
                jumlah: item.jumlah,
            }))
        );
    };

    const updateItemQuantity = (index: number, newQuantity: number) => {
        const updatedDetail = [...detailPeminjaman];
        updatedDetail[index].jumlah = Math.max(
            1,
            Math.min(newQuantity, updatedDetail[index].jumlah_tersedia)
        );
        setDetailPeminjaman(updatedDetail);
        setData(
            "detail_peminjaman",
            updatedDetail.map((item) => ({
                barang_id: item.barang_id,
                spesifikasi_id: item.spesifikasi_id ?? null,
                jumlah: item.jumlah,
            }))
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/peminjaman");
    };

    const handleFileChange = (field: "foto_identitas", file: File | null) => {
        setData(field, file);
    };

    return (
        <AppLayout>
            <Head title="Tambah Peminjaman" />

            <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-6 items-center">
                        <Link
                            href={"/peminjaman"}
                            className="p-2 h-max bg-gray-100 rounded-lg flex justify-center items-center">
                            <ArrowLeft className="h-5 w-5 text-gray-600" />
                        </Link>
                        <div className="flex flex-col gap-2">
                            <h1 className="text-2xl font-bold text-gray-700 whitespace-nowrap">
                                Data Peminjaman
                            </h1>
                            <h2 className="text-base font-medium text-gray-700 whitespace-nowrap">
                                Inventory / Peminjaman/ Tambah Data
                            </h2>
                        </div>
                    </div>
                </div>
                <div className="flex gap-4 mb-6 border-b">

                </div>

                <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow p-6">
                    {/* Informasi Peminjam */}
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Informasi Peminjam
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nama Peminjam <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.nama_peminjam}
                                onChange={(e) =>
                                    setData("nama_peminjam", e.target.value)
                                }
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.nama_peminjam
                                    ? "border-red-500"
                                    : "border-gray-300"
                                    }`}
                                required
                            />
                            {errors.nama_peminjam && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.nama_peminjam}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nomor Telepon <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                value={data.no_telp}
                                maxLength={18}
                                onChange={(e) =>
                                    setData("no_telp", e.target.value.replace(/[^0-9]/g, ""))
                                }
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.no_telp
                                    ? "border-red-500"
                                    : "border-gray-300"
                                    }`}
                                required
                            />
                            {errors.no_telp && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.no_telp}
                                </p>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Alamat <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={data.alamat}
                                onChange={(e) =>
                                    setData("alamat", e.target.value)
                                }
                                rows={3}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.alamat
                                    ? "border-red-500"
                                    : "border-gray-300"
                                    }`}
                                required
                            />
                            {errors.alamat && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.alamat}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Asal Institusi/Organisasi <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.asal}
                                onChange={(e) =>
                                    setData("asal", e.target.value)
                                }
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.asal
                                    ? "border-red-500"
                                    : "border-gray-300"
                                    }`}
                                required
                            />
                            {errors.asal && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.asal}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Foto Identitas <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    handleFileChange(
                                        "foto_identitas",
                                        e.target.files?.[0] || null
                                    )
                                }
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.foto_identitas
                                    ? "border-red-500"
                                    : "border-gray-300"
                                    }`}
                                required
                            />
                            {errors.foto_identitas && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.foto_identitas}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="pt-6 border-t">

                        {/* Detail Peminjaman */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Package className="w-5 h-5" />
                                Detail Peminjaman
                            </h2>
                            <button
                                type="button"
                                onClick={() => setShowAddItemModal(true)}
                                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Tambah Barang
                            </button>
                        </div>

                        {/* Items List */}
                        {detailPeminjaman.length > 0 ? (
                            <div className="space-y-3">
                                {detailPeminjaman.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-4 border rounded-lg"
                                    >
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">
                                                {item.barang_nama}
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                {item.spesifikasi_key}:{" "}
                                                {item.spesifikasi_value}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Tersedia: {item.jumlah_tersedia}{" "}
                                                unit
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        updateItemQuantity(
                                                            index,
                                                            item.jumlah - 1
                                                        )
                                                    }
                                                    disabled={item.jumlah <= 1}
                                                    className="p-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-12 text-center font-medium">
                                                    {item.jumlah}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        updateItemQuantity(
                                                            index,
                                                            item.jumlah + 1
                                                        )
                                                    }
                                                    disabled={
                                                        item.jumlah >=
                                                        item.jumlah_tersedia
                                                    }
                                                    className="p-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeItem(index)
                                                }
                                                className="p-1 text-red-600 hover:text-red-800"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                Belum ada barang yang dipilih
                            </div>
                        )}

                        {/* Jenis dan Waktu Peminjaman */}
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Jenis Peminjaman <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.jenis}
                                    onChange={(e) =>
                                        setData(
                                            "jenis",
                                            e.target.value as "pinjam" | "sewa"
                                        )
                                    }
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.jenis
                                        ? "border-red-500"
                                        : "border-gray-300"
                                        }`}
                                    required
                                >
                                    <option value="pinjam">Pinjam</option>
                                    <option value="sewa">Sewa</option>
                                </select>
                                {errors.jenis && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.jenis}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Waktu Mulai <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={data.waktu_pinjam_mulai}
                                    onChange={(e) =>
                                        setData(
                                            "waktu_pinjam_mulai",
                                            e.target.value
                                        )
                                    }
                                    min={new Date().toISOString().split("T")[0]}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.waktu_pinjam_mulai
                                        ? "border-red-500"
                                        : "border-gray-300"
                                        }`}
                                    required
                                />
                                {errors.waktu_pinjam_mulai && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.waktu_pinjam_mulai}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Waktu Selesai <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={data.waktu_pinjam_selesai}
                                    onChange={(e) =>
                                        setData(
                                            "waktu_pinjam_selesai",
                                            e.target.value
                                        )
                                    }
                                    min={
                                        data.waktu_pinjam_mulai ||
                                        new Date().toISOString().split("T")[0]
                                    }
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.waktu_pinjam_selesai
                                        ? "border-red-500"
                                        : "border-gray-300"
                                        }`}
                                    required
                                />
                                {errors.waktu_pinjam_selesai && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.waktu_pinjam_selesai}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Submit Buttons */}
                    <div className="flex items-center justify-end gap-4 pt-6 border-t">
                        <Link
                            href="/peminjaman"
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={
                                processing || detailPeminjaman.length === 0
                            }
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            {processing ? "Menyimpan..." : "Simpan Peminjaman"}
                        </button>
                    </div>
                </form>

                {/* Add Item Modal */}
                {showAddItemModal && (
                    <AddItemModal
                        availableStok={availableStok}
                        onAdd={addItem}
                        onClose={() => setShowAddItemModal(false)}
                        usedStokIds={availableStok
                            .filter((stok) =>
                                detailPeminjaman.some(
                                    (d) =>
                                        d.barang_id === stok.barang_id &&
                                        ((d.spesifikasi_id ?? null) === (stok.spesifikasi_id ?? null))
                                )
                            )
                            .map((s) => s.id)}
                    />
                )}
            </div>
        </AppLayout>
    );
}

// Modal untuk menambah barang
function AddItemModal({
    availableStok,
    onAdd,
    onClose,
    usedStokIds,
}: {
    availableStok: AvailableStok[];
    onAdd: (stok: AvailableStok, jumlah: number) => void;
    onClose: () => void;
    usedStokIds: number[];
}) {
    const [selectedStok, setSelectedStok] = useState<AvailableStok | null>(
        null
    );
    const [jumlah, setJumlah] = useState<number | string>(1);
    const [search, setSearch] = useState("");

    // reset state when modal closes
    const handleClose = () => {
        setSelectedStok(null);
        setJumlah(1);
        setSearch("");
        onClose();
    };

    const filteredStok = availableStok.filter(
        (stok) =>
            stok.barang_nama.toLowerCase().includes(search.toLowerCase()) ||
            stok.spesifikasi_value.toLowerCase().includes(search.toLowerCase())
    );

    const handleAdd = () => {
        if (!selectedStok) return;

        // allow empty input; coerce to number
        let qty = typeof jumlah === 'string' && jumlah === '' ? 1 : Number(jumlah);
        if (isNaN(qty) || qty <= 0) qty = 1;
        const finalQty = Math.min(qty, selectedStok.jumlah_tersedia);
        onAdd(selectedStok, finalQty);
        // reset selection after add
        setSelectedStok(null);
        setJumlah(1);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Tambah Barang</h3>
                    <button
                        onClick={handleClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Search */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Cari barang..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Stok List */}
                <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                    {filteredStok.map((stok) => (
                        <div
                            key={stok.id}
                            onClick={() => {
                                if (!usedStokIds.includes(stok.id)) setSelectedStok(stok);
                            }}
                            className={`p-3 border rounded-lg cursor-pointer transition-colors ${selectedStok?.id === stok.id
                                ? "border-blue-500 bg-blue-50"
                                : usedStokIds.includes(stok.id)
                                    ? "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed"
                                    : "border-gray-200 hover:bg-gray-50"
                                }`}
                        >
                            <h4 className="font-medium">{stok.barang_nama}</h4>
                            <p className="text-sm text-gray-600">
                                {stok.spesifikasi_key}: {stok.spesifikasi_value}
                            </p>
                            <p className="text-sm text-gray-500">
                                Tersedia: {stok.jumlah_tersedia} unit
                            </p>
                            {usedStokIds.includes(stok.id) && (
                                <p className="text-sm text-red-500">
                                    Sudah ditambahkan
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                {/* Quantity Input */}
                {selectedStok && (
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Jumlah
                        </label>
                        <input
                            type="number"
                            min="1"
                            max={selectedStok.jumlah_tersedia}
                            value={jumlah}
                            onChange={(e) => {
                                const raw = e.target.value;
                                if (raw === "") {
                                    setJumlah("");
                                    return;
                                }
                                const val = parseInt(raw);
                                if (isNaN(val)) {
                                    setJumlah("");
                                    return;
                                }
                                setJumlah(Math.max(1, Math.min(val, selectedStok.jumlah_tersedia)));
                            }}
                            onBlur={() => {
                                if (jumlah === "") setJumlah(1);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                )}

                {/* Buttons */}
                <div className="flex justify-end gap-2">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleAdd}
                        disabled={!selectedStok}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        Tambah
                    </button>
                </div>
            </div>
        </div>
    );
}
