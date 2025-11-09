import AppLayout from "@/Layouts/AppLayout";
import { Head, router, Link } from "@inertiajs/react";
import { PageHeader } from "@/Components/ui/page-header";
import Pagination from "@/Components/ui/pagination";
import TransaksiStatusUpdateModal from "@/Components/TransaksiStatusUpdateModal";
import { ConciergeBellIcon, Eye, Edit, MessageCircle } from "lucide-react";
import { useState } from "react";

interface Sesi {
    id: number;
    nama: string;
}

interface RekapItem {
    menu_id: number;
    menu_nama: string;
    total_qty: number;
    estimated_revenue: number;
}

interface TransaksiItem {
    id: number;
    nama_pelanggan: string;
    nomor_telepon: string;
    diantar: boolean;
    status: string;
    total_harga?: number;
    detail?: { jumlah: number; menu?: { nama: string } }[];
    created_at?: string;
}

interface Props {
    sesis: Sesi[];
    rekap: RekapItem[];
    selected_sesi?: number | null;
    totals?: {
        total_orders: number;
        total_items: number;
        total_revenue: number;
    } | null;
    transaksi?: {
        data: TransaksiItem[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number | null;
        to: number | null;
    } | null;
}

export default function Dashboard({
    sesis,
    rekap,
    selected_sesi,
    totals,
    transaksi,
}: Props) {
    const [editingTransaksi, setEditingTransaksi] =
        useState<TransaksiItem | null>(null);

    const applyFilter = (val: number | string) => {
        const params: any = {};
        if (val) params.sesi_penjualan_id = val;
        router.get("/transaksi/dashboard", params, { preserveState: true });
    };

    const handleWhatsApp = (item: TransaksiItem) => {
        const phone = item.nomor_telepon.replace(/[^0-9]/g, "");
        const formattedPhone = phone.startsWith("0")
            ? "62" + phone.substring(1)
            : phone;

        const statusText =
            {
                verifikasi: "sedang dalam verifikasi",
                proses: "sedang diproses",
                sudah_siap: "sudah siap untuk diambil/diantar",
                sudah_ambil: "sudah selesai",
                dibatalkan: "dibatalkan",
            }[item.status] || item.status;

        const deliveryText = item.diantar ? "diantar" : "diambil sendiri";

        const itemsList =
            item.detail
                ?.map(
                    (d, i) => `${i + 1}. ${d.menu?.nama || "-"} (${d.jumlah}x)`
                )
                .join("%0A") || "";

        const message = `Halo ${item.nama_pelanggan},%0A%0AKami informasikan pesanan Anda dengan detail:%0A${itemsList}%0A%0AStatus: ${statusText}%0AMetode: ${deliveryText}%0A%0ATerima kasih!`;

        window.open(
            `https://wa.me/${formattedPhone}?text=${message}`,
            "_blank"
        );
    };

    const getStatusBadge = (status: string) => {
        const statusConfig: Record<string, { color: string; text: string }> = {
            verifikasi: {
                color: "bg-yellow-100 text-yellow-800",
                text: "Verifikasi",
            },
            proses: { color: "bg-blue-100 text-blue-800", text: "Proses" },
            sudah_siap: {
                color: "bg-indigo-100 text-indigo-800",
                text: "Sudah Siap",
            },
            sudah_ambil: {
                color: "bg-green-100 text-green-800",
                text: "Sudah Diambil",
            },
            dibatalkan: {
                color: "bg-red-100 text-red-800",
                text: "Dibatalkan",
            },
        };
        const cfg = statusConfig[status] || {
            color: "bg-gray-100 text-gray-800",
            text: status,
        };
        return (
            <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${cfg.color}`}
            >
                {cfg.text}
            </span>
        );
    };

    return (
        <AppLayout>
            <Head title="Dashboard Transaksi" />

            <div className="p-6">
                <PageHeader
                    title="Dashboard Transaksi"
                    subtitle="Transaksi / Dashboard"
                    icon={ConciergeBellIcon}
                />

                {/* Session Selector */}
                <div className="">
                    <div className="flex items-center gap-4 mb-4 bg-white rounded-lg shadow-sm border p-4">
                        <label className="block text-sm font-medium text-gray-500">
                            Pilih Sesi
                        </label>
                        <select
                            value={selected_sesi ?? ""}
                            onChange={(e) => applyFilter(e.target.value)}
                            className="border rounded p-2 min-w-[200px]"
                        >
                            <option value="">Pilih Sesi</option>
                            {sesis.map((s: Sesi) => (
                                <option key={s.id} value={s.id}>
                                    {s.nama}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Summary Cards */}
                    {totals && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg">
                                <div className="text-sm text-blue-600 font-medium">
                                    Total Pembelian
                                </div>
                                <div className="text-3xl font-bold text-blue-900 mt-2">
                                    {totals.total_orders}
                                </div>
                                <div className="text-xs text-blue-600 mt-1">
                                    pesanan
                                </div>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg">
                                <div className="text-sm text-green-600 font-medium">
                                    Total Item
                                </div>
                                <div className="text-3xl font-bold text-green-900 mt-2">
                                    {totals.total_items}
                                </div>
                                <div className="text-xs text-green-600 mt-1">
                                    item terjual
                                </div>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg">
                                <div className="text-sm text-purple-600 font-medium">
                                    Estimasi Pendapatan
                                </div>
                                <div className="text-3xl font-bold text-purple-900 mt-2">
                                    Rp{" "}
                                    {Number(
                                        totals.total_revenue || 0
                                    ).toLocaleString("id-ID")}
                                </div>
                                <div className="text-xs text-purple-600 mt-1">
                                    total
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Menu Recap Table */}
                    {selected_sesi && (
                        <div className="mt-4 rounded-lg shadow-sm border pt-4 bg-white">
                            <h3 className="text-lg font-semibold text-gray-900 px-4 mb-3">
                                Rekap Menu
                            </h3>
                            <div className="overflow-x-auto border">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">
                                                Menu
                                            </th>
                                            <th className="text-right px-4 py-3 text-sm font-medium text-gray-700">
                                                Jumlah Terpesan
                                            </th>
                                            <th className="text-right px-4 py-3 text-sm font-medium text-gray-700">
                                                Estimasi Pendapatan
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {rekap.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={3}
                                                    className="text-center p-4 text-gray-500"
                                                >
                                                    Tidak ada data menu
                                                </td>
                                            </tr>
                                        ) : (
                                            rekap.map((r: RekapItem) => (
                                                <tr
                                                    key={r.menu_id}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="px-4 py-3">
                                                        {r.menu_nama}
                                                    </td>
                                                    <td className="px-4 py-3 text-right font-medium">
                                                        {r.total_qty}
                                                    </td>
                                                    <td className="px-4 py-3 text-right font-medium text-green-600">
                                                        Rp{" "}
                                                        {Number(
                                                            r.estimated_revenue
                                                        ).toLocaleString(
                                                            "id-ID"
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Transaction List (Buyers) */}
                    {transaksi && (
                        <div className="mt-4 rounded-lg shadow-sm border pt-4 bg-white">
                            <h3 className="text-lg font-semibold text-gray-900 px-4 mb-3">
                                Daftar Pesanan
                            </h3>
                            <div className="bg-white shadow-sm border overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b">
                                            <tr>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    No.
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Pembeli
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    No Telephone
                                                </th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Pengiriman
                                                </th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Pembelian
                                                </th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {transaksi.data.map(
                                                (
                                                    item: TransaksiItem,
                                                    idx: number
                                                ) => (
                                                    <tr
                                                        key={item.id}
                                                        className="hover:bg-gray-50"
                                                    >
                                                        <td className="px-6 py-4 text-sm text-gray-900 text-center">
                                                            {(transaksi.current_page -
                                                                1) *
                                                                transaksi.per_page +
                                                                idx +
                                                                1}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {item.nama_pelanggan ||
                                                                    "-"}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">
                                                                {item.nomor_telepon ||
                                                                    "-"}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                                            <span
                                                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                                    item.diantar
                                                                        ? "bg-blue-100 text-blue-800"
                                                                        : "bg-purple-100 text-purple-800"
                                                                }`}
                                                            >
                                                                {item.diantar
                                                                    ? "Diantar"
                                                                    : "Ambil"}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                                            <div className="flex items-center gap-2 justify-center">
                                                                {getStatusBadge(
                                                                    item.status
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                                            <div className="text-sm text-gray-900">
                                                                {item.detail
                                                                    ? item.detail.reduce(
                                                                          (
                                                                              s: number,
                                                                              d: any
                                                                          ) =>
                                                                              s +
                                                                              (d.jumlah ||
                                                                                  0),
                                                                          0
                                                                      )
                                                                    : 0}{" "}
                                                                item
                                                            </div>
                                                            <div className="text-xs text-gray-500">
                                                                {item.detail
                                                                    ? item
                                                                          .detail
                                                                          .length
                                                                    : 0}{" "}
                                                                jenis
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                                            <div className="flex items-center gap-2 justify-center">
                                                                <button
                                                                    onClick={() =>
                                                                        setEditingTransaksi(
                                                                            item
                                                                        )
                                                                    }
                                                                    className="text-gray-600 hover:text-gray-900"
                                                                    title="Edit Status"
                                                                >
                                                                    <Edit className="w-4 h-4" />
                                                                </button>
                                                                <Link
                                                                    href={`/transaksi/${item.id}`}
                                                                    className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1"
                                                                    title="Lihat Detail"
                                                                >
                                                                    <Eye className="w-4 h-4" />
                                                                </Link>
                                                                <button
                                                                    onClick={() =>
                                                                        handleWhatsApp(
                                                                            item
                                                                        )
                                                                    }
                                                                    className="text-green-600 hover:text-green-900 inline-flex items-center gap-1"
                                                                    title="Hubungi via WhatsApp"
                                                                >
                                                                    <MessageCircle className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                <div className="bg-white border-t border-gray-200">
                                    <Pagination
                                        currentPage={transaksi.current_page}
                                        lastPage={transaksi.last_page}
                                        perPage={transaksi.per_page}
                                        total={transaksi.total}
                                        from={transaksi.from ?? 0}
                                        to={transaksi.to ?? 0}
                                        onPageChange={(p: number) =>
                                            router.get(
                                                "/transaksi/dashboard",
                                                {
                                                    sesi_penjualan_id:
                                                        selected_sesi,
                                                    page: p,
                                                },
                                                { preserveState: true }
                                            )
                                        }
                                        onPerPageChange={(n: number) =>
                                            router.get(
                                                "/transaksi/dashboard",
                                                {
                                                    sesi_penjualan_id:
                                                        selected_sesi,
                                                    per_page: n,
                                                    page: 1,
                                                },
                                                { preserveState: true }
                                            )
                                        }
                                        variant="table"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {!selected_sesi && sesis.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            <p className="text-lg">Belum ada sesi penjualan</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Status Update Modal */}
            {editingTransaksi && (
                <TransaksiStatusUpdateModal
                    transaksi={{
                        id: editingTransaksi.id,
                        nama_pelanggan: editingTransaksi.nama_pelanggan,
                        status: editingTransaksi.status,
                    }}
                    onClose={() => setEditingTransaksi(null)}
                />
            )}
        </AppLayout>
    );
}
