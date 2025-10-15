import AppLayout from "@/Layouts/AppLayout";
import { Head, router, Link } from "@inertiajs/react";
import { ArrowDownAZ, ArrowDownZA, ChevronDown, Download, Edit, FileText, Filter, ForkKnifeCrossed, Package, Plus, Search, SortAsc, SortDesc, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
    sesis: any; // paginator from server
    filters?: {
        search?: string;
        sort_by?: string;
        sort_direction?: string;
        perPage?: number;
        filter?: string | null;
    };
}

export default function MenuIndex({ sesis, filters = {} }: Props) {
    const [search, setSearch] = useState<string>(filters.search || "");
    const [activeFilter, setActiveFilter] = useState<string | null>(filters.filter ?? null);

    const [sortBy, setSortBy] = useState<string>(filters.sort_by || "tanggal_mulai")
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">((filters.sort_direction as "asc" | "desc") || "desc")
    const [perPage, setPerPage] = useState<number>(filters.perPage || 8)
    const [showModal, setShowModal] = useState(false)
    const [selectedData, setSelectedData] = useState<MenuModel | null>(null)
    const [showDownloadDropdown, setShowDownloadDropdown] = useState(false)
    const [showFilterDropdown, setShowFilterDropdown] = useState(false)
    const [showSortDropdown, setShowSortDropdown] = useState(false)

    const sortDropdownRef = useRef<HTMLDivElement>(null);
    const filterDropdownRef = useRef<HTMLDivElement>(null);
    const downloadDropdownRef = useRef<HTMLDivElement>(null);

    const downloadOptions = [
        { label: "Excel", href: "/export/excel" },
        { label: "CSV", href: "/export/excel?format=csv" },
        { label: "PDF", href: "/export/pdf" },
        { label: "Word", href: "/export/word" },
    ];

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
                // Let server re-render list via Inertia; optionally optimistically remove
                updateQuery();
            }
        });
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (search !== filters.search) updateQuery();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [search]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
                setShowSortDropdown(false);
            }
            if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
                setShowFilterDropdown(false);
            }
            if (downloadDropdownRef.current && !downloadDropdownRef.current.contains(event.target as Node)) {
                setShowDownloadDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    /** 🔹 utilitas untuk request dengan parameter konsisten */
    const updateQuery = (extra: Record<string, any> = {}) => {
        router.get(
            "/menu",
            {
                search,
                sort_by: sortBy,
                sort_direction: sortDirection,
                perPage,
                filter: activeFilter || undefined,  // always include filter
                ...extra,
            },
            { preserveState: true }
        );
    };

    /** 🔹 tab & filter */
    const handleTab = (tab: string | null) => {
        setActiveFilter(tab);
        updateQuery({ filter: tab || undefined, page: 1 });
    };

    /** 🔹 sorting */
    const handleSort = (field: string) => {
        const newDirection = sortBy === field && sortDirection === "asc" ? "desc" : "asc";
        setSortBy(field);
        setSortDirection(newDirection);
        setShowSortDropdown(false);
        updateQuery({ sort_by: field, sort_direction: newDirection, page: 1 });
    };

    /** 🔹 perPage */
    const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = parseInt(e.target.value);
        setPerPage(value);
        updateQuery({ perPage: value, page: 1 });
    };

    /** 🔹 CRUD handlers */
    const handleEdit = (id: number) => router.visit(`/menu/${id}/edit`);
    const handleDelete = (id: number) => confirm("Apakah Anda yakin ingin menghapus data ini?") && router.delete(`/menu/${id}`);
    const handleShow = (item: MenuModel) => { setSelectedData(item); setShowModal(true); };

    /** 🔹 utils */
    // removed duplicate formatDate - using the earlier `formatDate` helper above
    const clearFilters = () => {
        setSearch("");
        setSortBy("created_at");
        setSortDirection("desc");
        setActiveFilter(null);
        updateQuery({ filter: undefined, page: 1 });
    };

    // server-side: use `sesis` paginator passed from the controller
    // Inertia provides `sesis.data` (items) and pagination meta
    const paginatedSesis = Array.isArray(sesis?.data) ? (sesis.data as SesiModel[]) : (sesis as SesiModel[]);

    return (
        <AppLayout>
            <Head title="Menu" />
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="mx-auto">
                    <div className="grid gap-2 lg:flex items-center justify-between mb-6">
                        <div className="flex gap-6 items-center">
                            <div className="p-2 h-max bg-blue-100 rounded-lg flex justify-center items-center">
                                <ForkKnifeCrossed className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <h1 className="text-2xl font-bold text-gray-700">Menu</h1>
                                <h2 className="text-base font-medium text-gray-700">Penjualan / Menu / Daftar</h2>
                            </div>

                        </div>
                        <div className="flex items-center gap-3">
                            {/* Dropdown Download */}
                            <div className="relative inline-block text-left" ref={downloadDropdownRef}>
                                <button
                                    onClick={() => setShowDownloadDropdown(!showDownloadDropdown)}
                                    className="inline-flex justify-center items-center px-4 py-2 bg-white text-black rounded-lg border border-black hover:bg-gray-200 text-left"
                                >
                                    <Download className="mr-2 h-5 w-5" />
                                    Download Data
                                    <ChevronDown className="ml-2 h-4 w-4" />
                                </button>

                                {showDownloadDropdown && (
                                    <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow-lg z-50">
                                        {downloadOptions.map((opt) => (
                                            <Link
                                                key={opt.label}
                                                href={opt.href}
                                                method="get"
                                                as="button"
                                                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                                                onClick={() => setShowDownloadDropdown(false)}
                                            >
                                                <FileText className="h-4 w-4" />
                                                {opt.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 mb-6 border-b">

                    </div>


                    {/* Filter Status */}
                    {(search || activeFilter) && (
                        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm font-medium text-blue-800">
                                    <Filter className="h-4 w-4" />
                                    <span>Filter aktif:</span>
                                    {search && (
                                        <span className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full text-sm border border-blue-200">
                                            <Search className="h-3 w-3" />
                                            Cari: "{search}"
                                        </span>
                                    )}
                                    {activeFilter && (
                                        <span className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full text-sm border border-blue-200">
                                            {activeFilter === 'open' ? 'Terbuka' : activeFilter === 'closed' ? 'Ditutup' : activeFilter}
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={() => { clearFilters(); updateQuery({ page: 1 }); }}
                                    className="flex items-center gap-1 px-3 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors"
                                >
                                    <X className="h-3 w-3" />
                                    Clear All
                                </button>
                            </div>
                        </div>
                    )}


                    {/* Search & Sort */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6 grid gap-2 lg:flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1 w-full">
                            <div className="relative ">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input type="text" placeholder="Cari berdasarkan sesi atau menu" value={search} onChange={(e) => setSearch(e.target.value)} onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                        // handleSort();
                                    }
                                }} className="pl-10 pr-6 py-2 border md:w-80 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />

                            </div>
                        </div>
                        <div className="flex gap-2">
                            {/* Filter Dropdown */}
                            <div className="relative"
                                ref={filterDropdownRef}
                            >
                                <button
                                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                                    className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${showFilterDropdown
                                        ? "border-blue-500 bg-blue-50 text-blue-600"
                                        : "border-gray-300 bg-white hover:bg-gray-50"
                                        }`}
                                >
                                    Filter
                                    <ChevronDown
                                        className={`h-4 w-4 transition-transform ${showFilterDropdown ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>
                                {showFilterDropdown && (
                                    <div className="absolute left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                                        <div className="p-2 flex flex-col">
                                            <span className="px-3 py-1 text-xs font-semibold text-gray-500">Status Sesi</span>
                                            <button
                                                onClick={() => handleTab(null)}
                                                className={`px-3 py-2 text-left text-sm rounded-lg hover:bg-gray-50 ${activeFilter === null ? "bg-blue-50 text-blue-600 font-medium" : ""}
                                                    `}
                                            >
                                                Semua
                                            </button>
                                            <button
                                                onClick={() => handleTab('open')}
                                                className={`px-3 py-2 text-left text-sm rounded-lg hover:bg-gray-50 ${activeFilter === 'open' ? "bg-blue-50 text-blue-600 font-medium" : ""}
                                                    `}
                                            >
                                                Terbuka
                                            </button>
                                            <button
                                                onClick={() => handleTab('closed')}
                                                className={`px-3 py-2 text-left text-sm rounded-lg hover:bg-gray-50 ${activeFilter === 'closed' ? "bg-blue-50 text-blue-600 font-medium" : ""}
                                                    `}
                                            >
                                                Ditutup
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="relative" ref={sortDropdownRef}>
                                <button
                                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                                    className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${showSortDropdown
                                        ? "border-blue-500 bg-blue-50 text-blue-600"
                                        : "border-gray-300 bg-white hover:bg-gray-50"
                                        }`}
                                >
                                    Urutkan
                                    {sortBy === 'tanggal_mulai' ? (
                                        sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                                    ) : (
                                        sortDirection === 'asc' ? <ArrowDownAZ className="h-4 w-4" /> : <ArrowDownZA className="h-4 w-4" />
                                    )}

                                    <ChevronDown
                                        className={`h-4 w-4 transition-transform ${showSortDropdown ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>
                                {showSortDropdown && (
                                    <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                                        <div className="p-2">
                                            <button
                                                onClick={() => handleSort("nama")}
                                                className={`w-full flex items-center justify-between px-3 py-2 text-left text-sm rounded-lg hover:bg-gray-50 ${sortBy === "nama" ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                                                    }`}
                                            >
                                                <span>Nama Sesi</span>
                                            </button>
                                            <button
                                                onClick={() => handleSort("tanggal_mulai")}
                                                className={`w-full flex items-center justify-between px-3 py-2 text-left text-sm rounded-lg hover:bg-gray-50 ${sortBy === "tanggal_mulai" ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                                                    }`}
                                            >
                                                <span>Tanggal Mulai</span>
                                            </button>
                                        </div>
                                    </div>

                                )}
                            </div>
                        </div>
                    </div>


                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {paginatedSesis.map((sesi) => (
                            <div key={sesi.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 border-b flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">{sesi.nama}</h3>
                                        <p className="text-sm text-gray-600">{formatDate(sesi.tanggal_mulai)}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Link href={`/menu/create?sesi_id=${sesi.id}`} className="inline-flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"> <Plus className="h-4 w-4" /> Tambah Menu</Link>
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
                                                    <Link href={`/menu/${m.id}/edit`}
                                                        className="text-blue-600 hover:text-blue-900"
                                                        title="Edit"
                                                    ><Edit className="h-4 w-4" /></Link>
                                                    <button onClick={() => handleDeleteMenu(m.id)} className="text-red-600 hover:text-red-900" title="Edit"><Trash2 className="h-4 w-4" /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination controls (server-side) */}
                    {sesis && sesis.meta && (
                        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-3 flex items-center justify-between">
                            <div className="text-sm text-gray-700">Menampilkan halaman {sesis.meta.current_page} dari {sesis.meta.last_page} — total {sesis.meta.total} sesi</div>
                            <div className="flex items-center gap-2">
                                <button
                                    className="px-3 py-1 border rounded disabled:opacity-50"
                                    disabled={!sesis.links.prev}
                                    onClick={() => updateQuery({ page: sesis.meta.current_page - 1 })}
                                >
                                    Prev
                                </button>
                                <button
                                    className="px-3 py-1 border rounded disabled:opacity-50"
                                    disabled={!sesis.links.next}
                                    onClick={() => updateQuery({ page: sesis.meta.current_page + 1 })}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </AppLayout>
    );
}
