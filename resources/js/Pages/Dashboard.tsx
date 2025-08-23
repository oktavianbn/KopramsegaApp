import { Head } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/Components/ui/chart";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
} from "recharts";
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Wallet,
    CreditCard,
    PiggyBank,
    Calendar,
    Target,
} from "lucide-react";

// Sample data - replace with real data from your backend
const monthlyData = [
    { month: "Jan", pemasukan: 15000000, pengeluaran: 8000000, saldo: 7000000 },
    {
        month: "Feb",
        pemasukan: 18000000,
        pengeluaran: 12000000,
        saldo: 6000000,
    },
    {
        month: "Mar",
        pemasukan: 22000000,
        pengeluaran: 15000000,
        saldo: 7000000,
    },
    {
        month: "Apr",
        pemasukan: 19000000,
        pengeluaran: 11000000,
        saldo: 8000000,
    },
    {
        month: "May",
        pemasukan: 25000000,
        pengeluaran: 16000000,
        saldo: 9000000,
    },
    {
        month: "Jun",
        pemasukan: 28000000,
        pengeluaran: 18000000,
        saldo: 10000000,
    },
];

const categoryData = [
    { name: "Kas", value: 45, color: "#3b82f6" },
    { name: "Usaha Dana", value: 35, color: "#10b981" },
    { name: "Anggaran", value: 20, color: "#f59e0b" },
];

const weeklyTrend = [
    { day: "Sen", amount: 2500000 },
    { day: "Sel", amount: 3200000 },
    { day: "Rab", amount: 1800000 },
    { day: "Kam", amount: 4100000 },
    { day: "Jum", amount: 3600000 },
    { day: "Sab", amount: 2900000 },
    { day: "Min", amount: 2200000 },
];

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(value);
};

export default function Dashboard() {
    const totalPemasukan = 127000000;
    const totalPengeluaran = 80000000;
    const saldo = totalPemasukan - totalPengeluaran;
    const monthlyGrowth = 12.5;

    return (
        <AppLayout>
            <Head title="Dashboard" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
                <div className="mx-auto max-w-7xl space-y-6">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Dashboard Keuangan
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Pantau performa keuangan Anda secara real-time
                        </p>
                    </div>

                    {/* Key Metrics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500 to-green-600 text-white">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-green-100">
                                    Total Pemasukan
                                </CardTitle>
                                <TrendingUp className="h-5 w-5 text-green-100" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold mb-1">
                                    {formatCurrency(totalPemasukan)}
                                </div>
                                <p className="text-xs text-green-100">
                                    +{monthlyGrowth}% dari bulan lalu
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg bg-gradient-to-r from-red-500 to-red-600 text-white">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-red-100">
                                    Total Pengeluaran
                                </CardTitle>
                                <TrendingDown className="h-5 w-5 text-red-100" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold mb-1">
                                    {formatCurrency(totalPengeluaran)}
                                </div>
                                <p className="text-xs text-red-100">
                                    -2.1% dari bulan lalu
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-blue-100">
                                    Saldo Bersih
                                </CardTitle>
                                <Wallet className="h-5 w-5 text-blue-100" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold mb-1">
                                    {formatCurrency(saldo)}
                                </div>
                                <p className="text-xs text-blue-100">
                                    Saldo tersedia saat ini
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-purple-100">
                                    Target Bulanan
                                </CardTitle>
                                <Target className="h-5 w-5 text-purple-100" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold mb-1">
                                    85%
                                </div>
                                <p className="text-xs text-purple-100">
                                    Target tercapai bulan ini
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Monthly Trend Chart */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-blue-600" />
                                    Tren Bulanan
                                </CardTitle>
                                <CardDescription>
                                    Perbandingan pemasukan dan pengeluaran 6
                                    bulan terakhir
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer
                                    config={{
                                        pemasukan: {
                                            label: "Pemasukan",
                                            color: "#10b981",
                                        },
                                        pengeluaran: {
                                            label: "Pengeluaran",
                                            color: "#ef4444",
                                        },
                                    }}
                                    className="h-[300px]"
                                >
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <BarChart data={monthlyData}>
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                className="opacity-30"
                                            />
                                            <XAxis dataKey="month" />
                                            <YAxis
                                                tickFormatter={(value) =>
                                                    `${value / 1000000}M`
                                                }
                                            />
                                            <ChartTooltip
                                                content={
                                                    <ChartTooltipContent />
                                                }
                                                formatter={(value: number) => [
                                                    formatCurrency(value),
                                                    "",
                                                ]}
                                            />
                                            <Bar
                                                dataKey="pemasukan"
                                                fill="var(--color-pemasukan)"
                                                radius={[4, 4, 0, 0]}
                                            />
                                            <Bar
                                                dataKey="pengeluaran"
                                                fill="var(--color-pengeluaran)"
                                                radius={[4, 4, 0, 0]}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            </CardContent>
                        </Card>

                        {/* Category Distribution */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <PiggyBank className="h-5 w-5 text-green-600" />
                                    Distribusi Jenis Pemasukan
                                </CardTitle>
                                <CardDescription>
                                    Pembagian sumber pemasukan berdasarkan
                                    kategori
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer
                                    config={{
                                        kas: { label: "Kas", color: "#3b82f6" },
                                        usaha: {
                                            label: "Usaha Dana",
                                            color: "#10b981",
                                        },
                                        anggaran: {
                                            label: "Anggaran",
                                            color: "#f59e0b",
                                        },
                                    }}
                                    className="h-[300px]"
                                >
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <PieChart>
                                            <Pie
                                                data={categoryData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {categoryData.map(
                                                    (entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={entry.color}
                                                        />
                                                    )
                                                )}
                                            </Pie>
                                            <ChartTooltip
                                                content={
                                                    <ChartTooltipContent />
                                                }
                                                formatter={(value: number) => [
                                                    `${value}%`,
                                                    "",
                                                ]}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                                <div className="flex justify-center gap-6 mt-4">
                                    {categoryData.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2"
                                        >
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{
                                                    backgroundColor: item.color,
                                                }}
                                            />
                                            <span className="text-sm text-gray-600">
                                                {item.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Additional Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Weekly Activity */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <DollarSign className="h-5 w-5 text-yellow-600" />
                                    Aktivitas Mingguan
                                </CardTitle>
                                <CardDescription>
                                    Transaksi harian dalam seminggu terakhir
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer
                                    config={{
                                        amount: {
                                            label: "Jumlah",
                                            color: "#8b5cf6",
                                        },
                                    }}
                                    className="h-[250px]"
                                >
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <AreaChart data={weeklyTrend}>
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                className="opacity-30"
                                            />
                                            <XAxis dataKey="day" />
                                            <YAxis
                                                tickFormatter={(value) =>
                                                    `${value / 1000000}M`
                                                }
                                            />
                                            <ChartTooltip
                                                content={
                                                    <ChartTooltipContent />
                                                }
                                                formatter={(value: number) => [
                                                    formatCurrency(value),
                                                    "",
                                                ]}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="amount"
                                                stroke="var(--color-amount)"
                                                fill="var(--color-amount)"
                                                fillOpacity={0.3}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            </CardContent>
                        </Card>

                        {/* Saldo Growth */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5 text-indigo-600" />
                                    Pertumbuhan Saldo
                                </CardTitle>
                                <CardDescription>
                                    Perkembangan saldo bersih dari waktu ke
                                    waktu
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer
                                    config={{
                                        saldo: {
                                            label: "Saldo",
                                            color: "#06b6d4",
                                        },
                                    }}
                                    className="h-[250px]"
                                >
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <LineChart data={monthlyData}>
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                className="opacity-30"
                                            />
                                            <XAxis dataKey="month" />
                                            <YAxis
                                                tickFormatter={(value) =>
                                                    `${value / 1000000}M`
                                                }
                                            />
                                            <ChartTooltip
                                                content={
                                                    <ChartTooltipContent />
                                                }
                                                formatter={(value: number) => [
                                                    formatCurrency(value),
                                                    "",
                                                ]}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="saldo"
                                                stroke="var(--color-saldo)"
                                                strokeWidth={3}
                                                dot={{
                                                    fill: "var(--color-saldo)",
                                                    strokeWidth: 2,
                                                    r: 4,
                                                }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
