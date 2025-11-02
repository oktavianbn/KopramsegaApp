import { PageHeader } from "@/Components/ui/page-header";
import AppLayout from "@/Layouts/AppLayout";
import { Head, router } from "@inertiajs/react";
import { ArrowLeft, CheckLine, ChevronLeft, ChevronRight, ListCheckIcon, ListChecks, ListChecksIcon } from "lucide-react";
import { useMemo, useState } from "react";

interface Props {
    dates?: string; // optional list of selectable dates (ISO yyyy-mm-dd)
}

type DayCell = {
    iso: string;
    date: number;
    dayOfWeek: number;
    isCurrentMonth: boolean;
    isToday: boolean;
};

export default function Index({ dates }: Props) {
    const today = new Date();
    const [month, setMonth] = useState<number>(today.getMonth());
    const [year, setYear] = useState<number>(today.getFullYear());
    // helper to format a Date to local YYYY-MM-DD (avoid UTC shift)
    const toLocalIso = (d: Date) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
            2,
            "0"
        )}-${String(d.getDate()).padStart(2, "0")}`;

    const todayIso = toLocalIso(today);

    const dayNames = [
        "Minggu",
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu",
    ];
    const monthNames = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
    ];

    // compute previous and next month labels (include year when rolling)
    const prevMonth =
        month === 0
            ? `${monthNames[11]} ${year - 1}`
            : `${monthNames[month - 1]} ${year}`;
    const nextMonth =
        month === 11
            ? `${monthNames[0]} ${year + 1}`
            : `${monthNames[month + 1]} ${year}`;

    const getDayTextColor = (dow: number) => {
        if (dow === 5) return "text-emerald-700";
        if (dow === 6 || dow === 0) return "text-red-700";
        return "text-slate-700";
    };

    const calendarDays: DayCell[] = useMemo(() => {
        const firstOfMonth = new Date(year, month, 1);
        const lastOfMonth = new Date(year, month + 1, 0);
        const firstWeekDay = firstOfMonth.getDay();
        const daysInMonth = lastOfMonth.getDate();

        const cells: DayCell[] = [];

        // previous month's trailing days
        const prevMonthLastDate = new Date(year, month, 0).getDate();
        for (let i = firstWeekDay - 1; i >= 0; i--) {
            const dateNum = prevMonthLastDate - i;
            const d = new Date(year, month - 1, dateNum);
            cells.push({
                iso: toLocalIso(d),
                date: dateNum,
                dayOfWeek: d.getDay(),
                isCurrentMonth: false,
                isToday: toLocalIso(d) === toLocalIso(new Date()),
            });
        }

        // current month
        for (let d = 1; d <= daysInMonth; d++) {
            const cur = new Date(year, month, d);
            cells.push({
                iso: toLocalIso(cur),
                date: d,
                dayOfWeek: cur.getDay(),
                isCurrentMonth: true,
                isToday: toLocalIso(cur) === toLocalIso(new Date()),
            });
        }

        // next month's leading days to fill 42 cells (6 weeks)
        while (cells.length % 7 !== 0) {
            const nextIndex = cells.length - (firstWeekDay + daysInMonth) + 1;
            const d = new Date(year, month + 1, nextIndex);
            cells.push({
                iso: toLocalIso(d),
                date: d.getDate(),
                dayOfWeek: d.getDay(),
                isCurrentMonth: false,
                isToday: toLocalIso(d) === toLocalIso(new Date()),
            });
        }

        return cells;
    }, [month, year]);

    const handlePrevMonth = () => {
        if (month === 0) {
            setMonth(11);
            setYear((y) => y - 1);
        } else setMonth((m) => m - 1);
    };
    const handleNextMonth = () => {
        if (month === 11) {
            setMonth(0);
            setYear((y) => y + 1);
        } else setMonth((m) => m + 1);
    };

    const handleDayClick = (day: DayCell) => {
        if (!day.isCurrentMonth) return;
        // const selectable = Array.isArray(dates) ? dates : todayIso;
        if (new Date(day.iso) > new Date(dates || todayIso)) return;
        router.visit(`/kehadiran/${day.iso}`);
    };

    return (
        <AppLayout>
            <Head title="Hari dan Tanggal" />
            <div className="min-h-screen bg-gray-50 p-6 overflow-hidden">
                <div className="mx-auto">
                    {/* Header */}
                    <PageHeader
                        title="Hari"
                        subtitle="Hari dan Tanggal"
                        icon={ListChecksIcon}
                    />

                    {/* Calendar Card */}
                    <div className="bg-white shadow-sm border border-slate-200 overflow-hidden rounded-lg ">
                        {/* Month Navigation */}
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-8 py-6 flex items-center justify-between border-b border-slate-200">
                            <h2 className="text-lg font-semibold text-gray-800 text-start">
                                {monthNames[month]} {year}
                            </h2>
                            <div className="flex space-x-4 ">
                                <div
                                    className="inline-flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer"
                                    onClick={handlePrevMonth}
                                    aria-label="Bulan sebelumnya"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                    <h1>{prevMonth}</h1>
                                </div>
                                <div
                                    className="inline-flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer"
                                    onClick={handleNextMonth}
                                    aria-label="Bulan berikutnya"
                                >
                                    <h1>{nextMonth}</h1>
                                    <ChevronRight className="w-5 h-5" />
                                </div>
                            </div>
                        </div>

                        {/* Day Names Header */}
                        <div className="grid grid-cols-7 gap-0 bg-slate-100 border-b border-slate-200">
                            {dayNames.map((day, idx) => (
                                <div
                                    key={day}
                                    className={`p-2 text-center font-semibold text-sm border border-slate-200 ${
                                        idx === 5
                                            ? "text-emerald-700 bg-emerald-50"
                                            : idx === 6 || idx === 0
                                            ? "text-red-700 bg-red-50"
                                            : "text-slate-700 bg-white"
                                    }`}
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-0 ">
                            {calendarDays.map((day, idx) => {
                                const disabled =
                                    !day.isCurrentMonth ||
                                    new Date(day.iso) >
                                        new Date(dates || todayIso);

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleDayClick(day)}
                                        disabled={disabled}
                                        className={`aspect-square p-2 max-h-20 w-full border border-slate-200 flex flex-col items-center justify-center transition-all cursor-pointer disabled:cursor-not-allowed ${
                                            !day.isCurrentMonth
                                                ? "opacity-30"
                                                : ""
                                        } ${
                                            day.isToday
                                                ? "ring-2 ring-blue-500 ring-inset"
                                                : ""
                                        }`}
                                    >
                                        <div
                                            className={`text-lg font-semibold ${
                                                day.isToday
                                                    ? "bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center text-white"
                                                    : getDayTextColor(
                                                          day.dayOfWeek
                                                      )
                                            }`}
                                        >
                                            {day.date}
                                        </div>
                                        {day.isToday && (
                                            <div className="text-xs text-blue-500 font-medium mt-1">
                                                Hari ini
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Legend */}
                        <div className="bg-slate-50 px-8 py-4 border-t border-slate-200 flex flex-wrap gap-6">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                                <span className="text-sm text-slate-700">
                                    Jumat
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <span className="text-sm text-slate-700">
                                    Sabtu & Minggu
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                                <span className="text-sm text-slate-700">
                                    Hari ini
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
