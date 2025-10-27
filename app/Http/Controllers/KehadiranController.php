<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Sangga;
use App\Models\Siswa;
use App\Models\Kehadiran;
use Illuminate\Support\Facades\Auth;

class KehadiranController extends Controller
{
    /**
     * Show a list of selectable days (simple calendar view)
     */
    public function pilihHari()
    {
        // Server-driven selectable dates so all users see the same availability.
        // Allow yesterday and today only.
        $dates = '';
        $today = now();
        $dates = $today->toDateString();

        return Inertia::render('Kehadiran/Hari/Index', [
            'dates' => $dates,
        ]);
    }

    /**
     * After selecting a day, show sangga (groups) to choose
     */
    public function pilihKelompok($hari)
    {
        // for now, return all sangga; extend later to filter by schedule
        $sangga = Sangga::orderBy('nama_sangga')->get();

        return Inertia::render('Kehadiran/Sangga/Index', [
            'sangga' => $sangga,
            'date' => $hari,
        ]);
    }

    /**
     * Show students in selected sangga for the chosen date and allow marking
     */
    public function formKehadiran($hari, $kelompok)
    {
        $sangga = Sangga::findOrFail($kelompok);
        $siswa = Siswa::where('sangga_id', $sangga->id)->orderBy('nama')->get();

        // check if any attendance records exist for this date and these students
        $siswaIds = $siswa->pluck('id')->toArray();
        $records = Kehadiran::where('tanggal', $hari)
            ->whereIn('siswa_id', $siswaIds)
            ->get()
            ->keyBy('siswa_id');

        if ($records->isEmpty()) {
            // no records yet -> show create form
            return Inertia::render('Kehadiran/Presensi/Create', [
                'sangga' => $sangga,
                'siswa' => $siswa,
                'date' => $hari,
            ]);
        }

        // some records exist -> build attendances array for edit
        $attendances = $siswa->map(function ($s) use ($records) {
            $rec = $records->get($s->id);
            return [
                'siswa_id' => $s->id,
                'status' => $rec ? $rec->status : '',
                'keterangan' => $rec ? $rec->keterangan : '',
            ];
        })->toArray();

        return Inertia::render('Kehadiran/Presensi/Edit', [
            'sangga' => $sangga,
            'siswa' => $siswa,
            'date' => $hari,
            'attendances' => $attendances,
        ]);
    }

    /**
     * Save attendance records
     */
    public function simpanKehadiran(Request $request, $hari, $kelompok)
    {
        $data = $request->validate([
            'attendances' => ['required', 'array'],
            'attendances.*.siswa_id' => ['required', 'integer', 'exists:siswa,id'],
            'attendances.*.status' => ['required', 'in:hadir,izin,alfa'],
            'attendances.*.keterangan' => ['nullable', 'string'],
        ]);

        $userId = Auth::id();

        foreach ($data['attendances'] as $a) {
            // upsert: if an attendance for siswa+tanggal exists, update; otherwise create
            Kehadiran::updateOrCreate(
                ['siswa_id' => $a['siswa_id'], 'tanggal' => $hari],
                ['status' => $a['status'], 'keterangan' => $a['keterangan'] ?? null, 'dicatat_oleh' => $userId]
            );
        }

        return redirect()->route('kehadiran.day', ['hari' => $hari])->with('success', 'Kehadiran disimpan.');
    }
}
