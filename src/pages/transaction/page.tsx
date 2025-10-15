'use client'

import { useEffect, useState } from 'react'
import { getTransactions, getTransactionDetail } from '@/services/transaction/transaction'
import type { TransactionItem, TransactionDetail } from '@/services/transaction/transaction'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RefreshCw, Download, ArrowLeft } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import * as XLSX from 'xlsx'

export default function TransactionPage() {
  const [transactions, setTransactions] = useState<TransactionItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionDetail | null>(null)

  const fetchTransactions = async () => {
    setLoading(true)
    const data = await getTransactions()
    setTransactions(data)
    setLoading(false)
  }

  const fetchDetail = async (code: string) => {
    setLoading(true)
    const data = await getTransactionDetail(code)
    setSelectedTransaction(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  const handleRefresh = () => {
    fetchTransactions()
  }

  // ===== FILTERING =====
  const filteredData = transactions.filter(item => {
    const matchesSearch =
      item.transactionCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.userFullName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'All' || item.status === statusFilter
    const matchesDate =
      (!startDate || new Date(item.createdAt) >= new Date(startDate)) &&
      (!endDate || new Date(item.createdAt) <= new Date(endDate))

    return matchesSearch && matchesStatus && matchesDate
  })

  // ===== PAGINATION =====
  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage))
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  const handleRowsPerPageChange = (value: number) => {
    setRowsPerPage(value)
    setCurrentPage(1)
  }

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages))
  }

  // ===== EXPORT XLS =====
  const handleExport = () => {
    const exportData = filteredData.map(item => ({
      'Transaction Code': item.transactionCode,
      'User Name': item.userFullName,
      Type: item.type,
      Direction: item.direction,
      Amount: item.amount,
      Channel: item.channel,
      Status: item.status,
      Date: new Date(item.createdAt).toLocaleString('id-ID'),
    }))

    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Transactions')

    const filenameParts = []
    if (statusFilter !== 'All') filenameParts.push(statusFilter)
    if (startDate && endDate) filenameParts.push(`${startDate}_to_${endDate}`)

    const filename =
      filenameParts.length > 0
        ? `transactions_${filenameParts.join('_')}.xlsx`
        : 'transactions_all.xlsx'

    XLSX.writeFile(wb, filename)
  }

  // ================= DETAIL VIEW =================
  if (selectedTransaction) {
    return (
      <div className="p-6">
        <Card className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Transaction Detail</CardTitle>
            <Button
              variant="outline"
              className="bg-gray-600 text-white hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600"
              onClick={() => setSelectedTransaction(null)}
            >
              <ArrowLeft className="size-4 mr-2" /> Back to List
            </Button>
          </CardHeader>

          <CardContent className="space-y-2">
            {Object.entries(selectedTransaction).map(([key, value]) => (
              <div
                key={key}
                className="flex justify-between border-b border-gray-200 dark:border-gray-700 py-1"
              >
                <span className="font-semibold capitalize">{key}</span>
                <span className="text-right break-all">
                  {key.toLowerCase().includes('amount') || key === 'balanceAfter'
                    ? `Rp ${Number(value).toLocaleString('id-ID')}`
                    : String(value)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  // ================= LIST VIEW =================
  return (
    <div className="p-6 space-y-4">
      <Card className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Transaction List</CardTitle>

          <div className="flex items-center gap-2">
            <Input
              placeholder="Search by Code, Type, or Name..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-[240px] bg-white dark:bg-gray-700 dark:text-gray-100"
            />

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] bg-white dark:bg-gray-700 dark:text-gray-100">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-700 dark:text-gray-100">
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="SUCCESS">Success</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="bg-white dark:bg-gray-700 dark:text-gray-100"
              />
              <span className="text-gray-500 dark:text-gray-300">to</span>
              <Input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="bg-white dark:bg-gray-700 dark:text-gray-100"
              />
            </div>

            <Button
              variant="outline"
              className="bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
              onClick={handleExport}
              disabled={filteredData.length === 0}
            >
              <Download className="size-4 mr-2" />
              Export XLS
            </Button>

            <Button
              variant="outline"
              className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw className={`size-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="p-3 text-left">Transaction Code</th>
                  <th className="p-3 text-left">User Name</th>
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Channel</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData.map(item => (
                    <tr
                      key={item.transactionCode}
                      className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => fetchDetail(item.transactionCode)}
                    >
                      <td className="p-3 text-blue-600 dark:text-blue-400">
                        {item.transactionCode}
                      </td>
                      <td className="p-3">{item.userFullName}</td>
                      <td className="p-3">{item.type}</td>
                      <td className="p-3">Rp {item.amount.toLocaleString('id-ID')}</td>
                      <td className="p-3">{item.channel}</td>
                      <td
                        className={`p-3 font-semibold ${
                          item.status === 'SUCCESS'
                            ? 'text-green-600 dark:text-green-400'
                            : item.status === 'PENDING'
                              ? 'text-yellow-600 dark:text-yellow-400'
                              : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {item.status}
                      </td>
                      <td className="p-3">
                        {new Date(item.createdAt).toLocaleString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-4 text-center text-gray-500 dark:text-gray-300">
                      {loading ? 'Loading...' : 'No transactions found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION SECTION */}
          <div className="flex justify-between items-center mt-4">
            {/* Left side - Rows per page */}
            <div className="flex items-center">
              <label className="text-sm mr-2 text-gray-700 dark:text-gray-300">
                Rows per page:
              </label>
              <select
                value={rowsPerPage}
                onChange={e => handleRowsPerPageChange(Number(e.target.value))}
                className="border rounded px-2 py-1 text-sm dark:bg-gray-800 dark:text-gray-200"
              >
                {[10, 25, 50, 100].map(size => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            {/* Right side - Pagination */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="bg-gray-600 text-white hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600"
                  disabled={currentPage === 1}
                  onClick={handlePrevPage}
                >
                  Prev
                </Button>
                <Button
                  variant="outline"
                  className="bg-gray-600 text-white hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600"
                  disabled={currentPage === totalPages}
                  onClick={handleNextPage}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
