"use client";

import { ModalDaftarTransaksiBarang } from "@/Components/ModalDaftarTransaksiBarang";
import { PageHeader } from "@/Components/ui/page-header";
import Pagination from "@/Components/ui/pagination";
import { SearchToolbar } from "@/Components/ui/search-toolbar";
import AppLayout from "@/Layouts/AppLayout";
import { Head, router } from "@inertiajs/react";
import {
    Download,
    Edit,
    Eye,
    Package,
    Trash2,
    Warehouse
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Barang {
    id: number;
    nama: string;
    deskripsi?: string | null;
    foto?: string | null;
    boleh_dipinjam: boolean;
}

interface Spesifikasi {
    id: number;
    barang_id: number;
    key: string;
    value: string;
    description?: string | null;
}

interface StokItem {
    id?: number;
    barang_id?: number;
    spesifikasi_id?: number | null;
    barang: Barang;
    spesifikasi?: Spesifikasi | null;
    jumlah: number;
}

// Group stok by barang
interface GroupedStok {
    barang: Barang;
    stoks: StokItem[];
    totalStok: number;
}

interface TransaksiItem {
    id: number;
    tipe: "t" | "k";
    peminjaman_id?: number | null;
    jumlah: number;
    keterangan: string;
    created_at: string;
}

export default function Index({ stoks }: { stoks: StokItem[] }) {
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("nama");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [perPage, setPerPage] = useState(8);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [showDownloadDropdown, setShowDownloadDropdown] = useState(false);
    const [txModalOpen, setTxModalOpen] = useState(false);
    const [txList, setTxList] = useState<TransaksiItem[]>([]);

    const sortDropdownRef = useRef<HTMLDivElement>(null);
    const filterDropdownRef = useRef<HTMLDivElement>(null);
    const downloadDropdownRef = useRef<HTMLDivElement>(null);

    const downloadOptions = [
        { label: "Excel", href: "/export/excel" },
        { label: "CSV", href: "/export/excel?format=csv" },
        { label: "PDF", href: "/export/pdf" },
        { label: "Word", href: "/export/word" },
    ];

    // fetch transaksi for a given barang and optional spesifikasi, then show modal
    const lihatTransactions = async (
        barangId: number,
        spesifikasiId?: number | null
    ) => {
        try {
            let url = `/stok/${barangId}/transactions`;
            if (spesifikasiId !== undefined) {
                // send explicit param; if null, send 'null' so backend treats as IS NULL
                const val =
                    spesifikasiId === null ? "null" : String(spesifikasiId);
                url += `?spesifikasi_id=${encodeURIComponent(val)}`;
            }

            const res = await fetch(url, {
                headers: { Accept: "application/json" },
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            setTxList(data as TransaksiItem[]);
            setTxModalOpen(true);
        } catch (err) {
            console.error("Gagal memuat transaksi:", err);
            // Optionally, show a toast or alert
            alert("Gagal memuat data transaksi.");
        }
    };

    // Group stoks by barang
    const groupedStoks = stoks.reduce((acc: GroupedStok[], stok: StokItem) => {
        const existingGroup = acc.find(
            (group: GroupedStok) => group.barang.id === stok.barang.id
        );
        if (existingGroup) {
            existingGroup.stoks.push(stok);
            existingGroup.totalStok += stok.jumlah;
        } else {
            acc.push({
                barang: stok.barang,
                stoks: [stok],
                totalStok: stok.jumlah,
            });
        }
        return acc;
    }, [] as GroupedStok[]);

    // Filter and search logic
    const filteredGroups = groupedStoks.filter((group: GroupedStok) => {
        const matchesSearch = search
            ? group.barang.nama.toLowerCase().includes(search.toLowerCase()) ||
              group.barang.deskripsi
                  ?.toLowerCase()
                  .includes(search.toLowerCase()) ||
              group.stoks.some(
                  (stok: StokItem) =>
                      stok.spesifikasi?.key
                          .toLowerCase()
                          .includes(search.toLowerCase()) ||
                      stok.spesifikasi?.value
                          .toLowerCase()
                          .includes(search.toLowerCase())
              )
            : true;

        const matchesFilter = activeFilter
            ? activeFilter === "low" && group.totalStok < 10
                ? true
                : activeFilter === "out" && group.totalStok === 0
                ? true
                : activeFilter === "available" && group.totalStok > 0
                ? true
                : false
            : true;

        return matchesSearch && matchesFilter;
    });

    // Sort logic
    const sortedGroups = [...filteredGroups].sort((a, b) => {
        let aValue: any, bValue: any;

        switch (sortBy) {
            case "nama":
                aValue = a.barang.nama.toLowerCase();
                bValue = b.barang.nama.toLowerCase();
                break;
            case "total_stok":
                aValue = a.totalStok;
                bValue = b.totalStok;
                break;
            default:
                aValue = a.barang.nama.toLowerCase();
                bValue = b.barang.nama.toLowerCase();
        }

        if (sortDirection === "asc") {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    // Pagination logic
    const totalItems = sortedGroups.length;
    const totalPages = Math.ceil(totalItems / perPage);
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedGroups = sortedGroups.slice(startIndex, endIndex);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                sortDropdownRef.current &&
                !sortDropdownRef.current.contains(event.target as Node)
            ) {
                setShowSortDropdown(false);
            }
            if (
                filterDropdownRef.current &&
                !filterDropdownRef.current.contains(event.target as Node)
            ) {
                setShowFilterDropdown(false);
            }
            if (
                downloadDropdownRef.current &&
                !downloadDropdownRef.current.contains(event.target as Node)
            ) {
                setShowDownloadDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    /** tab & filter */
    const handleTab = (tab: string | null) => {
        setActiveFilter(tab);
        setCurrentPage(1);
    };

    /** sorting */
    const handleSort = (field: string) => {
        const newDirection =
            sortBy === field && sortDirection === "asc" ? "desc" : "asc";
        setSortBy(field);
        setSortDirection(newDirection);
        setShowSortDropdown(false);
    };

    /** perPage */
    const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = parseInt(e.target.value);
        setPerPage(value);
        setCurrentPage(1);
    };

    /** CRUD handlers */
    const handleEdit = (barangId: number, spesifikasiId?: number | null) => {
        const qs = spesifikasiId ? `?spesifikasi_id=${spesifikasiId}` : "";
        router.visit(`/stok/${barangId}/edit${qs}`);
    };

    const handleDelete = (barangId: number, spesifikasiId?: number | null) =>
        confirm("Apakah Anda yakin ingin menghapus data ini?") &&
        router.delete(`/stok`, {
            data: { barang_id: barangId, spesifikasi_id: spesifikasiId },
        });

    const clearFilters = () => {
        setSearch("");
        setSortBy("nama");
        setSortDirection("asc");
        setActiveFilter(null);
        setCurrentPage(1);
    };

    // Counts for tabs
    const lowStockCount = groupedStoks.filter(
        (group: GroupedStok) => group.totalStok < 10
    ).length;
    const outOfStockCount = groupedStoks.filter(
        (group: GroupedStok) => group.totalStok === 0
    ).length;
    const availableCount = groupedStoks.filter(
        (group: GroupedStok) => group.totalStok > 0
    ).length;

    return (
        <AppLayout>
            <Head title="Stok" />
            <div className="min-h-screen bg-gray-50 p-6 overflow-hidden">
                <div className="mx-auto">
                    <PageHeader
                        title="Stok"
                        subtitle="Inventory / Stok / Daftar"
                        icon={Warehouse}
                        actions={[
                            {
                                label: "Download Data",
                                href: "/export/excel",
                                icon: Download,
                            },
                        ]}
                        tabs={[
                            {
                                id: null as any,
                                label: "Semua Barang",
                                count: groupedStoks.length,
                            },
                            {
                                id: "available",
                                label: "Tersedia",
                                count: availableCount,
                            },
                            {
                                id: "low",
                                label: "Stok Rendah",
                                count: lowStockCount,
                            },
                            {
                                id: "out",
                                label: "Habis",
                                count: outOfStockCount,
                            },
                        ]}
                        activeTab={activeFilter || ""}
                        onTabChange={(tabId) =>
                            handleTab(tabId === "null" ? null : (tabId as any))
                        }
                    />
                </div>
                <div className="mt-4">
                    <SearchToolbar
                        searchValue={search}
                        onSearchChange={(val) => setSearch(val)}
                        searchPlaceholder={
                            "Cari berdasarkan nama barang atau spesifikasi"
                        }
                        activeFilters={{
                            search: search || undefined,
                            filters: activeFilter
                                ? [
                                      {
                                          id: activeFilter,
                                          label:
                                              activeFilter === "available"
                                                  ? "Tersedia"
                                                  : activeFilter === "low"
                                                  ? "Stok Rendah"
                                                  : "Habis",
                                      },
                                  ]
                                : [],
                        }}
                        onClearFilters={clearFilters}
                        filterOptions={[
                            {
                                id: "available",
                                label: "Tersedia",
                                section: "Status Stok",
                            },
                            {
                                id: "low",
                                label: "Stok Rendah (< 10)",
                                section: "Status Stok",
                            },
                            {
                                id: "out",
                                label: "Habis",
                                section: "Status Stok",
                            },
                        ]}
                        onFilterSelect={(id) => handleTab(id as any)}
                        selectedFilters={activeFilter ? [activeFilter] : []}
                        sortOptions={[
                            { id: "nama", label: "Nama Barang" },
                            { id: "total_stok", label: "Total Stok" },
                        ]}
                        onSortSelect={(id) => handleSort(id)}
                        currentSortField={sortBy}
                        sortDirection={sortDirection}
                    />
                </div>
                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2  gap-6 mb-6">
                    {paginatedGroups.map((group) => (
                        <div
                            key={group.barang.id}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow h-80"
                        >
                            {/* Card Content with Flex Layout */}
                            <div className="flex h-full">
                                {/* Image Section - Left Side */}
                                <div className=" bg-gray-100 flex items-center justify-center">
                                    {group.barang.foto ? (
                                        <img
                                            src={`storage/${group.barang.foto}`}
                                            alt={group.barang.nama}
                                            className="w-48 h-full object-cover"
                                        />
                                    ) : (
                                        <Package className="h-12 w-12 text-gray-400" />
                                    )}
                                </div>

                                {/* Content Section - Right Side */}
                                <div className="flex-1 p-4 flex flex-col">
                                    {/* Header */}
                                    <div className="mb-3">
                                        <h3 className="font-semibold text-base text-gray-900 mb-1 line-clamp-1">
                                            {group.barang.nama}
                                        </h3>
                                        <p className="text-xs text-gray-500 line-clamp-2">
                                            {group.barang.deskripsi ||
                                                "Tidak ada deskripsi"}
                                        </p>
                                    </div>

                                    {/* Total Stock Badge */}
                                    <div className="mb-3 space-y-2">
                                        {group.totalStok === 0 ? (
                                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                                Habis - {group.totalStok} unit
                                            </span>
                                        ) : group.totalStok < 10 ? (
                                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                Rendah - {group.totalStok} unit
                                            </span>
                                        ) : (
                                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                Tersedia - {group.totalStok}{" "}
                                                unit
                                            </span>
                                        )}

                                        {/* Status Peminjaman Badge */}
                                        {group.barang.boleh_dipinjam ? (
                                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 ml-2">
                                                Dapat Dipinjam
                                            </span>
                                        ) : (
                                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 ml-2">
                                                Tidak Dapat Dipinjam
                                            </span>
                                        )}
                                    </div>

                                    {/* Specifications with Scroll */}
                                    <div className="flex-1 overflow-hidden">
                                        <h4 className="text-xs font-medium text-gray-700 mb-2">
                                            SPESIFIKASI:
                                        </h4>
                                        {group.stoks.length > 0 ? (
                                            <div className="space-y-2 overflow-y-auto h-32">
                                                {group.stoks.map((stok) => (
                                                    <div
                                                        key={`${
                                                            stok.barang.id
                                                        }-${
                                                            stok.spesifikasi
                                                                ?.id ?? "none"
                                                        }`}
                                                        className="flex items-center justify-between p-2 bg-gray-50 rounded border"
                                                    >
                                                        <div className="flex-1 min-w-0">
                                                            <span className="text-xs text-gray-600 block truncate">
                                                                {stok.spesifikasi
                                                                    ? `${stok.spesifikasi.key}: ${stok.spesifikasi.value}`
                                                                    : "Tanpa spesifikasi"}
                                                            </span>
                                                            <span className="text-xs font-medium text-gray-900">
                                                                Stok:{" "}
                                                                {stok.jumlah}
                                                            </span>
                                                        </div>
                                                        <div className="flex gap-1 ml-2">
                                                            <button
                                                                onClick={() =>
                                                                    lihatTransactions(
                                                                        stok
                                                                            .barang
                                                                            .id,
                                                                        stok
                                                                            .spesifikasi
                                                                            ?.id ??
                                                                            null
                                                                    )
                                                                }
                                                                className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                                                                title="Lihat"
                                                            >
                                                                <Eye className="h-3 w-3" />
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleEdit(
                                                                        stok
                                                                            .barang
                                                                            .id,
                                                                        stok
                                                                            .spesifikasi
                                                                            ?.id ??
                                                                            null
                                                                    )
                                                                }
                                                                className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-100 rounded transition-colors"
                                                                title="Edit"
                                                            >
                                                                <Edit className="h-3 w-3" />
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        stok
                                                                            .barang
                                                                            .id,
                                                                        stok
                                                                            .spesifikasi
                                                                            ?.id ??
                                                                            null
                                                                    )
                                                                }
                                                                className="p-1 text-red-600 hover:text-red-900 hover:bg-red-100 rounded transition-colors"
                                                                title="Hapus"
                                                            >
                                                                <Trash2 className="h-3 w-3" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-gray-400">
                                                Tidak ada spesifikasi
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {/* Pagination */}
                <Pagination
                    currentPage={currentPage}
                    lastPage={totalPages}
                    perPage={perPage}
                    total={totalItems}
                    from={startIndex + 1}
                    to={Math.min(endIndex, totalItems)}
                    onPageChange={(p) => setCurrentPage(p)}
                    onPerPageChange={(p) => {
                        setPerPage(p);
                        setCurrentPage(1);
                    }}
                    variant="table"
                />
                {/* Modal transaksi */}
                <ModalDaftarTransaksiBarang
                    isOpen={txModalOpen}
                    onClose={() => setTxModalOpen(false)}
                    transactions={txList}
                />
            </div>
        </AppLayout>
    );
}
