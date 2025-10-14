'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RefreshCw } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type TransactionItem = {
  transactionId: string
  date: string
  amount: number
  type: string
  status: 'Success' | 'Pending' | 'Failed'
}

export default function TransactionPage() {
  const [transactions, setTransactions] = useState<TransactionItem[]>([
    {
      transactionId: 'TRX-001',
      date: '2025-10-10T10:00:00Z',
      amount: 250000,
      type: 'Transfer',
      status: 'Success',
    },
    {
      transactionId: 'TRX-002',
      date: '2025-10-11T14:30:00Z',
      amount: 150000,
      type: 'Payment',
      status: 'Pending',
    },
    {
      transactionId: 'TRX-003',
      date: '2025-10-12T09:15:00Z',
      amount: 500000,
      type: 'Withdrawal',
      status: 'Failed',
    },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [loading, setLoading] = useState(false)

  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      console.log('Data refreshed!')
    }, 1000)
  }

  const filteredData = transactions.filter(item => {
    const matchesSearch =
      item.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'All' || item.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-6 space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Transaction List</CardTitle>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search by Transaction ID or Type..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-[240px]"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Success">Success</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw className={`size-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg dark:border-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="p-3 text-left">Transaction ID</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map(item => (
                    <tr
                      key={item.transactionId}
                      className="border-t hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-700"
                    >
                      <td className="p-3">{item.transactionId}</td>
                      <td className="p-3">
                        {new Date(item.date).toLocaleString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="p-3">{item.type}</td>
                      <td className="p-3">{item.amount.toLocaleString('id-ID')}</td>
                      <td
                        className={`p-3 font-semibold ${
                          item.status === 'Success'
                            ? 'text-green-600 dark:text-green-400'
                            : item.status === 'Pending'
                              ? 'text-yellow-600 dark:text-yellow-400'
                              : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {item.status}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-500 dark:text-gray-400">
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
