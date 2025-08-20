import { Navbar } from "@/Components/Navbar";
import { Sidebar } from "@/Components/Sidebar";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Dashboard() {
    return (
        <>
            <Navbar />
            <Sidebar />
        </>
    );
}
