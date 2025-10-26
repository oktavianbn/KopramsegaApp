<?php

namespace App\Http\Controllers;

use App\Models\Sangga;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SanggaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Retrieve all Sangga records
        $sanggas = Sangga::all();
        return Inertia::render('Sangga/Index', [
            'sanggas' => $sanggas,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Sangga $sangga)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Sangga $sangga)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Sangga $sangga)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Sangga $sangga)
    {
        //
    }
}
