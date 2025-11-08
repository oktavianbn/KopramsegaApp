<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Sangga;
use App\Models\Siswa;
use App\Models\Kehadiran;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class RekapKehadiranController extends Controller
{
    /**
     * Get valid Fridays (with at least 100 attendance records)
     */
    private function getValidFridays($bulan, $tahun)
    {
        $startDate = Carbon::create($tahun, $bulan, 1);
        $endDate = $startDate->copy()->endOfMonth();

        $allFridays = [];
        $current = $startDate->copy();
        while ($current <= $endDate) {
            if ($current->dayOfWeek === Carbon::FRIDAY && $current <= now()) {
                $allFridays[] = $current->format('Y-m-d');
            }
            $current->addDay();
        }

        // Filter only Fridays with at least 100 attendance records
        $validFridays = [];
        foreach ($allFridays as $friday) {
            $count = Kehadiran::where('tanggal', $friday)->count();
            if ($count >= 100) {
                $validFridays[] = $friday;
            }
        }

        return $validFridays;
    }

    /**
     * Dashboard Overview - Main Rekap Page
     */
    public function dashboard(Request $request)
    {
        $bulan = $request->get('bulan', now()->month);
        $tahun = $request->get('tahun', now()->year);

        // Get valid Fridays (with at least 100 attendance records)
        $fridays = $this->getValidFridays($bulan, $tahun);

        $totalPertemuan = count($fridays);
        $totalSiswa = Siswa::count();

        // Calculate overall statistics
        $stats = Kehadiran::whereIn('tanggal', $fridays)
            ->selectRaw('
                COUNT(*) as total_records,
                SUM(CASE WHEN status = "hadir" THEN 1 ELSE 0 END) as total_hadir,
                SUM(CASE WHEN status = "izin" THEN 1 ELSE 0 END) as total_izin,
                SUM(CASE WHEN status = "alfa" THEN 1 ELSE 0 END) as total_alfa
            ')
            ->first();

        $persentaseKehadiran = $stats->total_records > 0
            ? round(($stats->total_hadir / $stats->total_records) * 100, 2)
            : 0;

        // Attendance per sangga
        $rekapSangga = Sangga::withCount(['siswa'])
            ->get()
            ->map(function ($sangga) use ($fridays) {
                $siswaIds = $sangga->siswa->pluck('id');

                $sanggaStats = Kehadiran::whereIn('siswa_id', $siswaIds)
                    ->whereIn('tanggal', $fridays)
                    ->selectRaw('
                        COUNT(*) as total,
                        SUM(CASE WHEN status = "hadir" THEN 1 ELSE 0 END) as hadir,
                        SUM(CASE WHEN status = "izin" THEN 1 ELSE 0 END) as izin,
                        SUM(CASE WHEN status = "alfa" THEN 1 ELSE 0 END) as alfa
                    ')
                    ->first();

                $persentase = $sanggaStats->total > 0
                    ? round(($sanggaStats->hadir / $sanggaStats->total) * 100, 2)
                    : 0;

                return [
                    'id' => $sangga->id,
                    'nama_sangga' => $sangga->nama_sangga,
                    'total_anggota' => $sangga->siswa_count,
                    'hadir' => $sanggaStats->hadir ?? 0,
                    'izin' => $sanggaStats->izin ?? 0,
                    'alfa' => $sanggaStats->alfa ?? 0,
                    'persentase' => $persentase,
                ];
            });

        // Monthly trend data (last 6 months)
        $trendData = [];
        for ($i = 5; $i >= 0; $i--) {
            $monthDate = now()->subMonths($i);

            // Get valid Fridays for this month
            $monthFridays = $this->getValidFridays($monthDate->month, $monthDate->year);

            if (empty($monthFridays)) {
                continue;
            }

            $monthStats = Kehadiran::whereIn('tanggal', $monthFridays)
                ->selectRaw('
                    COUNT(*) as total,
                    SUM(CASE WHEN status = "hadir" THEN 1 ELSE 0 END) as hadir
                ')
                ->first();

            $persentase = $monthStats->total > 0
                ? round(($monthStats->hadir / $monthStats->total) * 100, 2)
                : 0;

            $trendData[] = [
                'bulan' => $monthDate->format('M Y'),
                'persentase' => $persentase,
            ];
        }

        // Last meeting info
        $lastMeeting = null;
        if (!empty($fridays)) {
            $lastDate = end($fridays);
            $lastStats = Kehadiran::where('tanggal', $lastDate)
                ->selectRaw('
                    COUNT(*) as total,
                    SUM(CASE WHEN status = "hadir" THEN 1 ELSE 0 END) as hadir,
                    SUM(CASE WHEN status = "izin" THEN 1 ELSE 0 END) as izin,
                    SUM(CASE WHEN status = "alfa" THEN 1 ELSE 0 END) as alfa
                ')
                ->first();

            $lastMeeting = [
                'tanggal' => $lastDate,
                'hadir' => $lastStats->hadir ?? 0,
                'izin' => $lastStats->izin ?? 0,
                'alfa' => $lastStats->alfa ?? 0,
                'persentase' => $lastStats->total > 0
                    ? round(($lastStats->hadir / $lastStats->total) * 100, 2)
                    : 0,
            ];
        }

        return Inertia::render('Kehadiran/Rekap/Dashboard', [
            'summary' => [
                'total_pertemuan' => $totalPertemuan,
                'total_siswa' => $totalSiswa,
                'persentase_kehadiran' => $persentaseKehadiran,
                'total_hadir' => $stats->total_hadir ?? 0,
                'total_izin' => $stats->total_izin ?? 0,
                'total_alfa' => $stats->total_alfa ?? 0,
            ],
            'rekap_sangga' => $rekapSangga,
            'trend_data' => $trendData,
            'last_meeting' => $lastMeeting,
            'bulan' => $bulan,
            'tahun' => $tahun,
        ]);
    }

    /**
     * Rekap Per Siswa
     */
    public function rekapSiswa(Request $request)
    {
        $bulan = $request->get('bulan', now()->month);
        $tahun = $request->get('tahun', now()->year);
        $sanggaId = $request->get('sangga_id');
        $kelas = $request->get('kelas');
        $search = $request->get('search');

        // Get valid Fridays (with at least 100 attendance records)
        $fridays = $this->getValidFridays($bulan, $tahun);

        $totalPertemuan = count($fridays);

        // Query siswa
        $query = Siswa::with('sangga')
            ->select('siswa.*')
            ->leftJoin('kehadiran', function ($join) use ($fridays) {
                $join->on('siswa.id', '=', 'kehadiran.siswa_id')
                    ->whereIn('kehadiran.tanggal', $fridays);
            })
            ->selectRaw('
                COUNT(kehadiran.id) as total_kehadiran,
                SUM(CASE WHEN kehadiran.status = "hadir" THEN 1 ELSE 0 END) as hadir,
                SUM(CASE WHEN kehadiran.status = "izin" THEN 1 ELSE 0 END) as izin,
                SUM(CASE WHEN kehadiran.status = "alfa" THEN 1 ELSE 0 END) as alfa
            ')
            ->groupBy('siswa.id', 'siswa.nis', 'siswa.nta', 'siswa.nama', 'siswa.kelas', 'siswa.jurusan', 'siswa.rombel', 'siswa.jenis_kelamin', 'siswa.sangga_id', 'siswa.created_at', 'siswa.updated_at');

        if ($sanggaId) {
            $query->where('siswa.sangga_id', $sanggaId);
        }

        if ($kelas) {
            $query->where('siswa.kelas', $kelas);
        }

        if ($search) {
            $query->where('siswa.nama', 'like', "%{$search}%");
        }

        $siswa = $query->get()->map(function ($s) use ($totalPertemuan) {
            $persentase = $totalPertemuan > 0 && $s->total_kehadiran > 0
                ? round(($s->hadir / $totalPertemuan) * 100, 2)
                : 0;

            $status = 'excellent';
            if ($persentase < 60)
                $status = 'poor';
            elseif ($persentase < 75)
                $status = 'fair';
            elseif ($persentase < 90)
                $status = 'good';

            return [
                'id' => $s->id,
                'nama' => $s->nama,
                'kelas' => $s->kelas,
                'jurusan' => $s->jurusan,
                'rombel' => $s->rombel,
                'sangga' => $s->sangga ? $s->sangga->nama_sangga : '-',
                'hadir' => $s->hadir ?? 0,
                'izin' => $s->izin ?? 0,
                'alfa' => $s->alfa ?? 0,
                'persentase' => $persentase,
                'status' => $status,
            ];
        });

        $sanggas = Sangga::orderBy('nama_sangga')->get();
        $kelasList = Siswa::select('kelas')->distinct()->orderBy('kelas')->pluck('kelas');

        return Inertia::render('Kehadiran/Rekap/Siswa/Index', [
            'siswa' => $siswa,
            'sanggas' => $sanggas,
            'kelas_list' => $kelasList,
            'filters' => [
                'bulan' => $bulan,
                'tahun' => $tahun,
                'sangga_id' => $sanggaId,
                'kelas' => $kelas,
                'search' => $search,
            ],
            'total_pertemuan' => $totalPertemuan,
        ]);
    }

    /**
     * Detail Siswa
     */
    public function detailSiswa($id, Request $request)
    {
        $bulan = $request->get('bulan', now()->month);
        $tahun = $request->get('tahun', now()->year);

        $siswa = Siswa::with('sangga')->findOrFail($id);

        // Get valid Fridays (with at least 100 attendance records)
        $fridays = $this->getValidFridays($bulan, $tahun);

        // Get attendance history
        $kehadiran = Kehadiran::where('siswa_id', $id)
            ->whereIn('tanggal', $fridays)
            ->orderBy('tanggal', 'desc')
            ->get()
            ->map(function ($k) {
                return [
                    'tanggal' => $k->tanggal,
                    'status' => $k->status,
                    'keterangan' => $k->keterangan,
                    'formatted_date' => Carbon::parse($k->tanggal)->format('d M Y'),
                ];
            });

        // Calculate stats
        $stats = [
            'hadir' => $kehadiran->where('status', 'hadir')->count(),
            'izin' => $kehadiran->where('status', 'izin')->count(),
            'alfa' => $kehadiran->where('status', 'alfa')->count(),
        ];

        $totalPertemuan = count($fridays);
        $persentase = $totalPertemuan > 0
            ? round(($stats['hadir'] / $totalPertemuan) * 100, 2)
            : 0;

        // Monthly trend (last 6 months)
        $trendData = [];
        for ($i = 5; $i >= 0; $i--) {
            $monthDate = now()->subMonths($i);

            // Get valid Fridays for this month
            $monthFridays = $this->getValidFridays($monthDate->month, $monthDate->year);

            if (empty($monthFridays)) {
                continue;
            }

            $monthKehadiran = Kehadiran::where('siswa_id', $id)
                ->whereIn('tanggal', $monthFridays)
                ->selectRaw('
                    COUNT(*) as total,
                    SUM(CASE WHEN status = "hadir" THEN 1 ELSE 0 END) as hadir
                ')
                ->first();

            $monthPersentase = count($monthFridays) > 0 && $monthKehadiran->hadir > 0
                ? round(($monthKehadiran->hadir / count($monthFridays)) * 100, 2)
                : 0;

            $trendData[] = [
                'bulan' => $monthDate->format('M Y'),
                'persentase' => $monthPersentase,
            ];
        }

        return Inertia::render('Kehadiran/Rekap/Siswa/Detail', [
            'siswa' => [
                'id' => $siswa->id,
                'nama' => $siswa->nama,
                'kelas' => $siswa->kelas,
                'jurusan' => $siswa->jurusan,
                'rombel' => $siswa->rombel,
                'jenis_kelamin' => $siswa->jenis_kelamin,
                'sangga' => $siswa->sangga ? $siswa->sangga->nama_sangga : '-',
            ],
            'kehadiran' => $kehadiran,
            'stats' => $stats,
            'persentase' => $persentase,
            'total_pertemuan' => $totalPertemuan,
            'trend_data' => $trendData,
            'bulan' => $bulan,
            'tahun' => $tahun,
        ]);
    }

    /**
     * Rekap Per Sangga
     */
    public function rekapSangga(Request $request)
    {
        $bulan = $request->get('bulan', now()->month);
        $tahun = $request->get('tahun', now()->year);

        // Get valid Fridays (with at least 100 attendance records)
        $fridays = $this->getValidFridays($bulan, $tahun);

        $totalPertemuan = count($fridays);

        // Get sangga with stats
        $sanggas = Sangga::withCount('siswa')
            ->get()
            ->map(function ($sangga) use ($fridays, $totalPertemuan) {
                $siswaIds = Siswa::where('sangga_id', $sangga->id)->pluck('id');

                $stats = Kehadiran::whereIn('siswa_id', $siswaIds)
                    ->whereIn('tanggal', $fridays)
                    ->selectRaw('
                        SUM(CASE WHEN status = "hadir" THEN 1 ELSE 0 END) as hadir,
                        SUM(CASE WHEN status = "izin" THEN 1 ELSE 0 END) as izin,
                        SUM(CASE WHEN status = "alfa" THEN 1 ELSE 0 END) as alfa
                    ')
                    ->first();

                $expectedTotal = $sangga->siswa_count * $totalPertemuan;
                $persentase = $expectedTotal > 0
                    ? round((($stats->hadir ?? 0) / $expectedTotal) * 100, 2)
                    : 0;

                return [
                    'id' => $sangga->id,
                    'nama_sangga' => $sangga->nama_sangga,
                    'logo_path' => $sangga->logo_path,
                    'total_anggota' => $sangga->siswa_count,
                    'hadir' => $stats->hadir ?? 0,
                    'izin' => $stats->izin ?? 0,
                    'alfa' => $stats->alfa ?? 0,
                    'persentase' => $persentase,
                ];
            })
            ->sortByDesc('persentase')
            ->values();

        return Inertia::render('Kehadiran/Rekap/Sangga/Index', [
            'sanggas' => $sanggas,
            'bulan' => $bulan,
            'tahun' => $tahun,
            'total_pertemuan' => $totalPertemuan,
        ]);
    }

    /**
     * Detail Sangga
     */
    public function detailSangga($id, Request $request)
    {
        $bulan = $request->get('bulan', now()->month);
        $tahun = $request->get('tahun', now()->year);

        $sangga = Sangga::with('siswa')->findOrFail($id);

        // Get valid Fridays (with >= 100 attendance records)
        $fridays = $this->getValidFridays($bulan, $tahun);
        $totalPertemuan = count($fridays);
        $siswaIds = $sangga->siswa->pluck('id');

        // Overall stats
        $overallStats = Kehadiran::whereIn('siswa_id', $siswaIds)
            ->whereIn('tanggal', $fridays)
            ->selectRaw('
                SUM(CASE WHEN status = "hadir" THEN 1 ELSE 0 END) as hadir,
                SUM(CASE WHEN status = "izin" THEN 1 ELSE 0 END) as izin,
                SUM(CASE WHEN status = "alfa" THEN 1 ELSE 0 END) as alfa
            ')
            ->first();

        $expectedTotal = $sangga->siswa->count() * $totalPertemuan;
        $persentase = $expectedTotal > 0
            ? round((($overallStats->hadir ?? 0) / $expectedTotal) * 100, 2)
            : 0;

        // Per member stats
        $memberStats = $sangga->siswa->map(function ($siswa) use ($fridays, $totalPertemuan) {
            $stats = Kehadiran::where('siswa_id', $siswa->id)
                ->whereIn('tanggal', $fridays)
                ->selectRaw('
                    SUM(CASE WHEN status = "hadir" THEN 1 ELSE 0 END) as hadir,
                    SUM(CASE WHEN status = "izin" THEN 1 ELSE 0 END) as izin,
                    SUM(CASE WHEN status = "alfa" THEN 1 ELSE 0 END) as alfa
                ')
                ->first();

            $persentase = $totalPertemuan > 0
                ? round((($stats->hadir ?? 0) / $totalPertemuan) * 100, 2)
                : 0;

            return [
                'id' => $siswa->id,
                'nama' => $siswa->nama,
                'kelas' => $siswa->kelas . ' ' . $siswa->jurusan . ($siswa->rombel ? ' ' . $siswa->rombel : ''),
                'hadir' => $stats->hadir ?? 0,
                'izin' => $stats->izin ?? 0,
                'alfa' => $stats->alfa ?? 0,
                'persentase' => $persentase,
            ];
        })->sortByDesc('persentase')->values();

        return Inertia::render('Kehadiran/Rekap/Sangga/Detail', [
            'sangga' => [
                'id' => $sangga->id,
                'nama_sangga' => $sangga->nama_sangga,
                'logo_path' => $sangga->logo_path,
                'total_anggota' => $sangga->siswa->count(),
            ],
            'stats' => [
                'hadir' => $overallStats->hadir ?? 0,
                'izin' => $overallStats->izin ?? 0,
                'alfa' => $overallStats->alfa ?? 0,
            ],
            'persentase' => $persentase,
            'member_stats' => $memberStats,
            'total_pertemuan' => $totalPertemuan,
            'bulan' => $bulan,
            'tahun' => $tahun,
        ]);
    }

    /**
     * Rekap Per Pertemuan (Per Tanggal)
     */
    public function rekapPertemuan(Request $request)
    {
        $bulan = $request->get('bulan', now()->month);
        $tahun = $request->get('tahun', now()->year);

        // Get all Fridays
        // Get valid Fridays (with >= 100 attendance records)
        $fridays = $this->getValidFridays($bulan, $tahun);

        $totalSiswa = Siswa::count();

        // Get stats for each Friday
        $pertemuanStats = collect($fridays)->map(function ($tanggal) use ($totalSiswa) {
            $stats = Kehadiran::where('tanggal', $tanggal)
                ->selectRaw('
                    COUNT(*) as total_records,
                    SUM(CASE WHEN status = "hadir" THEN 1 ELSE 0 END) as hadir,
                    SUM(CASE WHEN status = "izin" THEN 1 ELSE 0 END) as izin,
                    SUM(CASE WHEN status = "alfa" THEN 1 ELSE 0 END) as alfa
                ')
                ->first();

            $persentase = $stats->total_records > 0
                ? round(($stats->hadir / $stats->total_records) * 100, 2)
                : 0;

            $isComplete = $stats->total_records >= $totalSiswa;

            return [
                'tanggal' => $tanggal,
                'formatted_date' => Carbon::parse($tanggal)->format('d F Y'),
                'day_name' => Carbon::parse($tanggal)->locale('id')->dayName,
                'total_siswa' => $stats->total_records ?? 0,
                'hadir' => $stats->hadir ?? 0,
                'izin' => $stats->izin ?? 0,
                'alfa' => $stats->alfa ?? 0,
                'persentase' => $persentase,
                'is_complete' => $isComplete,
            ];
        })->reverse()->values();

        return Inertia::render('Kehadiran/Rekap/Pertemuan/Index', [
            'pertemuan' => $pertemuanStats,
            'bulan' => $bulan,
            'tahun' => $tahun,
            'total_siswa' => $totalSiswa,
        ]);
    }

    /**
     * Detail Pertemuan
     */
    public function detailPertemuan($tanggal, Request $request)
    {
        $date = Carbon::parse($tanggal);

        // Get all attendance for this date grouped by sangga
        $sanggas = Sangga::with([
            'siswa' => function ($query) use ($tanggal) {
                $query->with([
                    'kehadiran' => function ($q) use ($tanggal) {
                        $q->where('tanggal', $tanggal);
                    }
                ]);
            }
        ])->get()->map(function ($sangga) use ($tanggal) {
            $stats = [
                'hadir' => 0,
                'izin' => 0,
                'alfa' => 0,
                'belum_isi' => 0,
            ];

            $members = $sangga->siswa->map(function ($siswa) use (&$stats) {
                $kehadiran = $siswa->kehadiran->first();

                if ($kehadiran) {
                    $stats[$kehadiran->status]++;
                } else {
                    $stats['belum_isi']++;
                }

                return [
                    'id' => $siswa->id,
                    'nama' => $siswa->nama,
                    'kelas' => $siswa->kelas . ' ' . $siswa->jurusan . ($siswa->rombel ? ' ' . $siswa->rombel : ''),
                    'status' => $kehadiran ? $kehadiran->status : null,
                    'keterangan' => $kehadiran ? $kehadiran->keterangan : null,
                ];
            });

            $totalAnggota = $sangga->siswa->count();
            $persentase = $totalAnggota > 0
                ? round(($stats['hadir'] / $totalAnggota) * 100, 2)
                : 0;

            return [
                'id' => $sangga->id,
                'nama_sangga' => $sangga->nama_sangga,
                'logo_path' => $sangga->logo_path,
                'total_anggota' => $totalAnggota,
                'stats' => $stats,
                'persentase' => $persentase,
                'members' => $members,
            ];
        });

        // Overall stats
        $totalSiswa = Siswa::count();
        $overallStats = Kehadiran::where('tanggal', $tanggal)
            ->selectRaw('
                COUNT(*) as total_records,
                SUM(CASE WHEN status = "hadir" THEN 1 ELSE 0 END) as hadir,
                SUM(CASE WHEN status = "izin" THEN 1 ELSE 0 END) as izin,
                SUM(CASE WHEN status = "alfa" THEN 1 ELSE 0 END) as alfa
            ')
            ->first();

        $persentase = $overallStats->total_records > 0
            ? round(($overallStats->hadir / $overallStats->total_records) * 100, 2)
            : 0;

        return Inertia::render('Kehadiran/Rekap/Pertemuan/Detail', [
            'tanggal' => $tanggal,
            'formatted_date' => $date->format('d F Y'),
            'day_name' => $date->locale('id')->dayName,
            'sanggas' => $sanggas,
            'overall_stats' => [
                'total_siswa' => $totalSiswa,
                'total_records' => $overallStats->total_records ?? 0,
                'hadir' => $overallStats->hadir ?? 0,
                'izin' => $overallStats->izin ?? 0,
                'alfa' => $overallStats->alfa ?? 0,
                'belum_isi' => $totalSiswa - ($overallStats->total_records ?? 0),
                'persentase' => $persentase,
            ],
        ]);
    }
}
