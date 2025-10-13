'use client'

import React, { useEffect, useState } from 'react'
import { getBalance, getTransactionHistory } from '@/services/rekening/rekening'
import type { BalanceData, TransactionItem } from '@/services/rekening/rekening'

export const RekeningPage: React.FC = () => {
  const [saldo, setSaldo] = useState<BalanceData | null>(null)
  const [transactions, setTransactions] = useState<TransactionItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.type.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'success' && tx.status.toLowerCase() === 'success') ||
      (statusFilter === 'failed' && tx.status.toLowerCase() === 'failed')
    return matchesSearch && matchesStatus
  })

  const currentRows = filteredTransactions.slice(indexOfFirstRow, indexOfLastRow)
  const totalPages = Math.ceil(filteredTransactions.length / rowsPerPage)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [balanceData, transactionData] = await Promise.all([
        getBalance(),
        getTransactionHistory(),
      ])

      setSaldo(balanceData)
      setTransactions(transactionData)
    } catch (err: any) {
      console.error('Error fetching rekening data:', err)
      setError('Failed to load account data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleRefresh = () => fetchData()
  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value))
    setCurrentPage(1)
  }

  return (
    <div className="p-6 space-y-6">
      {/* ================= HEADER WITH REFRESH ================= */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Operational Account Overview
        </h1>

        <button
          onClick={handleRefresh}
          disabled={loading}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                ></path>
              </svg>
              <span>Refreshing...</span>
            </>
          ) : (
            <>🔄 Refresh</>
          )}
        </button>
      </div>

      {/* ================= BALANCE ================= */}
      <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
          Operational Account Balance
        </h2>

        {error ? (
          <p className="text-red-500 text-sm">{error}</p>
        ) : loading && !saldo ? (
          <p className="text-gray-500">Loading balance...</p>
        ) : saldo ? (
          <>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              Rp {saldo.balance.toLocaleString('id-ID')}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {saldo.accountHolderName} • {saldo.accountNo}
            </p>
            <p className="text-xs text-gray-400">
              Last updated: {new Date(saldo.asOf).toLocaleString('id-ID')}
            </p>
          </>
        ) : (
          <p className="text-gray-500">No balance data available</p>
        )}
      </div>

      {/* ================= TRANSACTION HISTORY ================= */}
      <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Transaction History
          </h2>

          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Search by Type..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="border rounded px-3 py-1 text-sm dark:bg-gray-800 dark:text-gray-200"
            />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="border rounded px-2 py-1 text-sm dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {error ? (
          <p className="text-red-500 text-sm">{error}</p>
        ) : filteredTransactions.length === 0 && !loading ? (
          <p className="text-gray-500">No transaction history available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 dark:border-gray-700 text-sm">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-2 border border-gray-200 dark:border-gray-700">
                    Posted At
                  </th>
                  <th className="px-4 py-2 border border-gray-200 dark:border-gray-700">Ext Ref</th>
                  <th className="px-4 py-2 border border-gray-200 dark:border-gray-700">
                    Direction
                  </th>
                  <th className="px-4 py-2 border border-gray-200 dark:border-gray-700">Type</th>
                  <th className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-right">
                    Amount
                  </th>
                  <th className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-right">
                    Balance After
                  </th>
                  <th className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-right">
                    Status
                  </th>
                  <th className="px-4 py-2 border border-gray-200 dark:border-gray-700">
                    Narration
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentRows.map((tx, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-4 py-2 border">
                      {new Date(tx.postedAt).toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-2 border">{tx.extRef}</td>
                    <td className="px-4 py-2 border">{tx.direction}</td>
                    <td className="px-4 py-2 border">{tx.type}</td>
                    <td
                      className={`px-4 py-2 border text-right font-medium ${
                        tx.direction === 'IN'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {tx.direction === 'IN' ? '+' : '-'} Rp {tx.amount.toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-2 border text-right">
                      Rp {tx.balanceAfter.toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-2 border text-right">{tx.status}</td>
                    <td className="px-4 py-2 border">{tx.narration || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredTransactions.length > 0 && (
          <div className="flex items-center justify-between mt-4">
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
        )}
      </div>
    </div>
  )
}
