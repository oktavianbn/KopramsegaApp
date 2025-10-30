import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm } from "@inertiajs/react";
import { CheckCheckIcon, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

interface Siswa {
    id: number;
    nama: string;
    kelas: string;
    jurusan: string;
    rombel: string | null;
    jenis_kelamin: string;
}
interface Sangga {
    id: number;
    nama_sangga: string;
    logo_path: string | null;
}
interface AttendanceEntry {
    siswa_id: number;
    status: string;
    keterangan: string | null;
}

interface Props {
    siswa: Siswa[];
    sangga: Sangga;
    date: string;
    attendances?: AttendanceEntry[]; // prefilled attendances when editing
}

export default function Edit({ siswa, sangga, date, attendances }: Props) {
    // If the server passed attendances (editing existing records), use them.
    // Otherwise initialize an empty attendance status for each student.
    const initial =
        typeof ({} as any) !== "undefined" &&
        (Array.isArray([] as any) ? [] : []);

    const startingAttendances: AttendanceEntry[] = (Array.isArray([] as any) &&
        []) as any; // placeholder typed var

    const initialAttend =
        attendances && attendances.length > 0
            ? attendances
            : siswa.map((s) => ({
                  siswa_id: s.id,
                  status: "",
                  keterangan: "",
              }));

    const { data, setData, post, processing, errors } = useForm({
        attendances: initialAttend,
    });
    console.log("log 1", attendances);
    console.log("log2", attendances ? attendances[0].status : "data kosong");

    const handleStatusChange = (index: number, status: string) => {
        const copy = [...data.attendances];
        copy[index].status = status;
        setData("attendances", copy);
    };

    const handleKeteranganChange = (index: number, value: string) => {
        const copy = [...data.attendances];
        copy[index].keterangan = value;
        setData("attendances", copy);
    };

    const setAllHadir = () => {
        const copy = data.attendances.map((a: any) => ({
            ...a,
            status: "hadir",
        }));
        setData("attendances", copy);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/kehadiran/${date}/${sangga.id}`, {
            onSuccess: () => {
                toast.success("Kehadiran berhasil diperbarui", {
                    description: `Data kehadiran sangga ${sangga.nama_sangga} telah berhasil diperbarui.`,
                });
            },
        });
    };
    return (
        <AppLayout>
            <Head
                title={`Presensi ${sangga.nama_sangga} - ${new Date(
                    date
                ).toLocaleDateString("id-ID")}`}
            />
            <div className="min-h-screen bg-gray-50 p-6 overflow-hidden">
                <div className="mx-auto">
                    {/* Header */}
                    <div className="grid gap-2 lg:flex items-center justify-between mb-6">
                        <div className="flex gap-4 items-center">
                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                className="p-2 h-max bg-slate-100 rounded-lg flex items-center justify-center hover:bg-slate-200"
                                aria-label="Kembali"
                            >
                                <ChevronLeft className="h-5 w-5 text-slate-700" />
                            </button>
                            <div className="flex flex-col gap-2">
                                <h1 className="text-2xl font-bold text-gray-700 whitespace-nowrap">
                                    Kehadiran
                                </h1>
                                <h2 className="text-base font-medium text-gray-700 whitespace-nowrap">
                                    Hari dan Tanggal / Sangga / Edit Presensi
                                    Sangga {sangga.nama_sangga}
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-4 mb-6 border-b"></div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 mb-4">
                    <button
                        type="button"
                        onClick={setAllHadir}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                        <CheckCheckIcon className="w-4 h-4" />
                        Check all hadir
                    </button>
                    <button
                        onClick={submit}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Simpan Kehadiran
                    </button>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <form onSubmit={submit}>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                            No.
                                        </th>
                                        <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                            Nama Siswa
                                        </th>
                                        <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                            Kehadiran
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 text-center">
                                    {siswa.map((item: Siswa, idx) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 text-sm text-gray-900 ">
                                                {idx + 1}
                                            </td>
                                            <td className="px-6 flex flex-col text-start items-start py-4 text-sm text-gray-900 ">
                                                <p>{item.nama}</p>
                                                <p>
                                                    {" "}
                                                    {item.kelas +
                                                        " " +
                                                        item.jurusan +
                                                        " " +
                                                        (item.rombel
                                                            ? item.rombel
                                                            : "")}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 ">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleStatusChange(
                                                                idx,
                                                                "hadir"
                                                            )
                                                        }
                                                        className={`px-3 py-1 rounded text-sm ${
                                                            data.attendances[
                                                                idx
                                                            ].status === "hadir"
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-gray-100"
                                                        }`}
                                                    >
                                                        Hadir
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleStatusChange(
                                                                idx,
                                                                "izin"
                                                            )
                                                        }
                                                        className={`px-3 py-1 rounded text-sm ${
                                                            data.attendances[
                                                                idx
                                                            ].status === "izin"
                                                                ? "bg-yellow-100 text-yellow-800"
                                                                : "bg-gray-100"
                                                        }`}
                                                    >
                                                        Izin
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleStatusChange(
                                                                idx,
                                                                "alfa"
                                                            )
                                                        }
                                                        className={`px-3 py-1 rounded text-sm ${
                                                            data.attendances[
                                                                idx
                                                            ].status === "alfa"
                                                                ? "bg-red-100 text-red-800"
                                                                : "bg-gray-100"
                                                        }`}
                                                    >
                                                        Alfa
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
