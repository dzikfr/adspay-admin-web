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
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function TransactionPage() {
  const [transactions, setTransactions] = useState<TransactionItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [totalPages, setTotalPages] = useState(1)
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionDetail | null>(null)

  const fetchTransactions = async () => {
    setLoading(true)

    // Format tanggal menjadi ISO LocalDateTime
    const start = startDate ? `${startDate}T00:00:00` : undefined
    const end = endDate ? `${endDate}T23:59:59` : undefined

    const data = await getTransactions({
      page: currentPage - 1,
      size: rowsPerPage,
      status: statusFilter === 'All' ? undefined : statusFilter,
      type: typeFilter === 'ALL' ? undefined : typeFilter,
      startDate: start,
      endDate: end,
    })

    setTransactions(data.content)
    setTotalPages(data.totalPages)
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
  }, [currentPage, rowsPerPage, statusFilter, startDate, endDate, typeFilter])

  const handleRefresh = () => fetchTransactions()
  const handleRowsPerPageChange = (value: number) => {
    setRowsPerPage(value)
    setCurrentPage(1)
  }
  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1))
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages))

  // ===== EXPORT XLSX =====
  const handleExportXLSX = () => {
    const exportData = transactions.map(item => ({
      'Transaction Code': item.transactionCode,
      'User Name': item.userFullName,
      Type: item.type,
      Direction: item.direction,
      Amount: item.amount,
      BalanceAfter: item.balanceAfter,
      Channel: item.channel,
      Status: item.status,
      Date: new Date(item.createdAt).toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    }))

    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Transactions')

    const filenameParts = []
    if (statusFilter !== 'All') filenameParts.push(statusFilter)
    if (typeFilter !== 'ALL') filenameParts.push(typeFilter)
    if (startDate && endDate) filenameParts.push(`${startDate}_to_${endDate}`)

    const filename =
      filenameParts.length > 0
        ? `transactions_${filenameParts.join('_')}.xlsx`
        : 'transactions_all.xlsx'

    XLSX.writeFile(wb, filename)
  }

  // ===== EXPORT PDF =====
  const handleExportPDF = () => {
    const doc = new jsPDF('landscape')
    const tableColumn = [
      'Transaction Code',
      'User Name',
      'Type',
      'Direction',
      'Amount',
      'Balance After',
      'Channel',
      'Status',
      'Date',
    ]
    const tableRows: any[] = []

    transactions.forEach(item => {
      tableRows.push([
        item.transactionCode,
        item.userFullName,
        item.type,
        item.direction,
        `Rp ${item.amount.toLocaleString('id-ID')}`,
        `Rp ${item.balanceAfter.toLocaleString('id-ID')}`,
        item.channel,
        item.status,
        new Date(item.createdAt).toLocaleString('id-ID', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      ])
    })

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      styles: { fontSize: 8 },
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
      didDrawPage: data => {
        doc.setFontSize(14)
        doc.text('Transaction List', data.settings.margin.left, 15)
      },
      pageBreak: 'auto',
    })

    const filenameParts = []
    if (statusFilter !== 'All') filenameParts.push(statusFilter)
    if (typeFilter !== 'ALL') filenameParts.push(typeFilter)
    if (startDate && endDate) filenameParts.push(`${startDate}_to_${endDate}`)

    const filename =
      filenameParts.length > 0
        ? `transactions_${filenameParts.join('_')}.pdf`
        : 'transactions_all.pdf'

    doc.save(filename)
  }

  // ===== DETAIL VIEW =====
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
                    : key.toLowerCase().includes('createdat') ||
                        key.toLowerCase().includes('updatedat')
                      ? new Date(String(value)).toLocaleString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })
                      : String(value)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  // ===== LIST VIEW =====
  return (
    <div className="p-6 space-y-4">
      <Card className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Transaction List</CardTitle>

          <div className="flex items-center gap-2 flex-wrap">
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
              <SelectContent className="bg-white dark:bg-gray-700 dark:text-gray-700">
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="SUCCESS">Success</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px] bg-white dark:bg-gray-700 dark:text-gray-100">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-700 dark:text-gray-100">
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="TOPUP">Top Up</SelectItem>
                <SelectItem value="TRANSFER">Transfer</SelectItem>
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
              onClick={handleExportXLSX}
              disabled={transactions.length === 0}
            >
              <Download className="size-4 mr-2" />
              Export XLS
            </Button>

            <Button
              variant="outline"
              className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
              onClick={handleExportPDF}
              disabled={transactions.length === 0}
            >
              <Download className="size-4 mr-2" />
              Export PDF
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

        {/* TABLE & PAGINATION */}
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border border-gray-200 dark:border-gray-700 rounded-lg">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="p-3 text-left">Transaction Code</th>
                  <th className="p-3 text-left">User Name</th>
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-left">Direction</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Balance After</th>
                  <th className="p-3 text-left">Channel</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions
                    .filter(
                      item =>
                        item.transactionCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.userFullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.type.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map(item => (
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
                        <td className="p-3">{item.direction}</td>
                        <td className="p-3">Rp {item.amount.toLocaleString('id-ID')}</td>
                        <td className="p-3">Rp {item.balanceAfter.toLocaleString('id-ID')}</td>
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
                            second: '2-digit',
                          })}
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan={9} className="p-4 text-center text-gray-500 dark:text-gray-300">
                      {loading ? 'Loading...' : 'No transactions found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex justify-between items-center mt-4 flex-wrap gap-2">
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

            <div className="flex items-center gap-2 flex-wrap">
              <Button
                className="px-3 py-1 border rounded disabled:opacity-50 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                disabled={currentPage === 1}
                onClick={handlePrevPage}
              >
                Previous
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  className={`px-3 py-1 border rounded ${
                    currentPage === page
                      ? 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}

              <Button
                className="px-3 py-1 border rounded disabled:opacity-50 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                disabled={currentPage === totalPages}
                onClick={handleNextPage}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
