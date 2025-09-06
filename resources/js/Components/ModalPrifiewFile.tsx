"use client"


interface ModalPreviewFileProps {
    showPreviewModal: string | null
    setShowPreviewModal: (value: string | null) => void
    file?: string | string[] | File | null
}

export default function ModalPreviewFile({ showPreviewModal, setShowPreviewModal, file }: ModalPreviewFileProps) {
    if (!showPreviewModal) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="relative max-w-4xl max-h-[90vh] p-4 bg-white rounded-lg">
                {/* Tombol Tutup */}
                <button
                    onClick={() => setShowPreviewModal(null)}
                    className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
                >
                    ✕
                </button>

                {/* Cek tipe file */}
                {/\.(jpg|jpeg|png|gif)$/i.test(showPreviewModal) ? (
                    <img
                        src={showPreviewModal}
                        alt="Preview"
                        className="max-w-full max-h-[80vh] object-contain rounded-lg"
                    />
                ) : /\.(pdf)$/i.test(showPreviewModal) ? (
                    <div className="overflow-x-scroll">
                        <iframe
                            src={showPreviewModal}
                            className="w-[80vw] h-[80vh] rounded-lg"
                        />
                    </div>
                ) : /\.(docx?|xlsx?)$/i.test(showPreviewModal) ? (
                    <div className="flex flex-col items-start gap-4 mr-10">
                        {/* Buka di Tab Baru */}
                        <a
                            href={showPreviewModal}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                        >
                            Buka di Tab Baru
                        </a>

                        {/* Unduh dengan nama asli */}
                        <a
                            href={showPreviewModal}
                            download={showPreviewModal.split("/").pop() || "dokumen"}
                            className="text-green-600 underline"
                        >
                            Unduh
                        </a>
                    </div>
                ) : (
                    <p className="text-gray-700">Format file tidak didukung</p>
                )}
            </div>
        </div>
    )
}
