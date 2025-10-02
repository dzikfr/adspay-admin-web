'use client'

import React, { useState } from 'react'

// contoh dummy data transaksi khusus biaya admin AdsPay
const transaksi = [
  {
    id: 1,
    tanggal: '2025-10-01 09:15',
    keterangan: 'AdsPay Transfer ke BCA (Biaya Admin)',
    jumlah: -2500,
  },
  {
    id: 2,
    tanggal: '2025-09-30 14:20',
    keterangan: 'AdsPay Transfer ke Mandiri (Biaya Admin)',
    jumlah: -6500,
  },
  {
    id: 3,
    tanggal: '2025-09-29 11:05',
    keterangan: 'AdsPay Transfer ke BRI (Biaya Admin)',
    jumlah: -4000,
  },
  {
    id: 4,
    tanggal: '2025-09-28 16:30',
    keterangan: 'AdsPay Transfer ke BNI (Biaya Admin)',
    jumlah: -5000,
  },
  {
    id: 5,
    tanggal: '2025-09-27 10:00',
    keterangan: 'AdsPay Transfer ke BCA (Biaya Admin)',
    jumlah: -2500,
  },
  {
    id: 6,
    tanggal: '2025-09-26 13:50',
    keterangan: 'AdsPay Transfer ke Mandiri (Biaya Admin)',
    jumlah: -6500,
  },
  {
    id: 7,
    tanggal: '2025-09-25 08:45',
    keterangan: 'AdsPay Transfer ke CIMB (Biaya Admin)',
    jumlah: -3500,
  },
  {
    id: 8,
    tanggal: '2025-09-24 15:10',
    keterangan: 'AdsPay Transfer ke BTN (Biaya Admin)',
    jumlah: -4500,
  },
  {
    id: 9,
    tanggal: '2025-09-23 09:40',
    keterangan: 'AdsPay Transfer ke BCA (Biaya Admin)',
    jumlah: -2500,
  },
  {
    id: 10,
    tanggal: '2025-09-22 17:25',
    keterangan: 'AdsPay Transfer ke Mandiri (Biaya Admin)',
    jumlah: -6500,
  },
  {
    id: 11,
    tanggal: '2025-09-21 12:00',
    keterangan: 'AdsPay Transfer ke BRI (Biaya Admin)',
    jumlah: -4000,
  },
]

export const RekeningPage: React.FC = () => {
  // contoh saldo, nanti bisa diganti dari API
  const saldo = 2250000

  // state untuk pagination
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  // hitung index transaksi yang ditampilkan
  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentRows = transaksi.slice(indexOfFirstRow, indexOfLastRow)

  const totalPages = Math.ceil(transaksi.length / rowsPerPage)

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value))
    setCurrentPage(1) // reset ke halaman pertama
  }

  return (
    <div className="p-6 space-y-6">
      {/* SALDO */}
      <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
          Saldo Rekening
        </h1>
        <p className="text-3xl font-bold text-green-600 dark:text-green-400">
          Rp {saldo.toLocaleString('id-ID')}
        </p>
      </div>

      {/* HISTORI TRANSAKSI */}
      <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Histori Biaya Admin Transaksi AdsPay
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 dark:border-gray-700 text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                  Tanggal & Jam
                </th>
                <th className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                  Keterangan
                </th>
                <th className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-right text-gray-900 dark:text-gray-100">
                  Biaya Admin
                </th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map(tx => (
                <tr
                  key={tx.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                    {tx.tanggal}
                  </td>
                  <td className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                    {tx.keterangan}
                  </td>
                  <td className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-right font-medium text-red-600 dark:text-red-400">
                    Rp {Math.abs(tx.jumlah).toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between mt-4">
          {/* Rows per page */}
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-700 dark:text-gray-300">Rows per page:</label>
            <select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="border rounded px-2 py-1 text-sm dark:bg-gray-800 dark:text-gray-200"
            >
              {[10, 25, 50, 100].map(size => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          {/* Prev / Next */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50 dark:bg-gray-800 dark:text-gray-200"
            >
              Prev
            </button>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50 dark:bg-gray-800 dark:text-gray-200"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
