"use client"

import { useState } from "react"
import { X, FileText, User, Camera, List, Link as LinkIcon, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface ModalDetailDokumentasi {
    id: number
    judul: string
    links: string[]
    kameramen?: string
    keterangan?: string
    created_at: string
    updated_at: string
}

interface ModalDetailDokumentasiProps {
  isOpen: boolean
  onClose: () => void
  data: ModalDetailDokumentasi
}

export function ModalDetailDokumentasi({ isOpen, onClose, data }: ModalDetailDokumentasiProps) {
  const [activeTab, setActiveTab] = useState<"info" | "links">("info")

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">

        {/* Header */}
        <div className="sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Detail Dokumentasi</h2>
                <p className="text-sm text-gray-500">Informasi lengkap dokumentasi</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("info")}
                className={cn(
                  "py-4 px-1 border-b-2 font-medium text-sm",
                  activeTab === "info"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                )}
              >
                Keterangan
              </button>
              <button
                onClick={() => setActiveTab("links")}
                className={cn(
                  "py-4 px-1 border-b-2 font-medium text-sm",
                  activeTab === "links"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                )}
              >
                Daftar Link
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
          {activeTab === "info" && (
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Judul</label>
                <p className="text-gray-900 bg-gray-50 p-4 rounded-lg text-lg font-medium">
                  {data.judul}
                </p>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Camera className="h-4 w-4" />
                  Kameramen
                </label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{data.kameramen}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Keterangan</label>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-900 leading-relaxed">
                    {data.keterangan || "-"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "links" && (
            <div className="space-y-4">
              {data.links && data.links.length > 0 ? (
                <ol className="list-decimal pl-6 space-y-2">
                  {data.links.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-2"
                      >
                        <LinkIcon className="h-4 w-4" />
                        {link}
                      </a>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="text-center py-8">
                  <List className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Tidak ada link dokumentasi tersedia</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <Clock className="h-4 w-4" />
              Dibuat Pada
            </label>
            <p className="text-gray-600 text-sm">{formatDateTime(data.created_at)}</p>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <Clock className="h-4 w-4" />
              Diperbarui Pada
            </label>
            <p className="text-gray-600 text-sm">{formatDateTime(data.updated_at)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
