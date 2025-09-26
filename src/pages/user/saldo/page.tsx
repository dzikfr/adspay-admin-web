import React, { useState, useEffect } from 'react'
import { getListUser } from '@/services/user/end-user'

type Saldo = {
  id: string
  phoneNumber: string
  status: string
  registrationStatus: string
  saldo: number
  createdAt: string
}

export const SaldoPage: React.FC = () => {
  const [saldoData, setSaldoData] = useState<Saldo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getListUser()
        setSaldoData(data)
      } catch (err) {
        console.error('Failed fetching saldo:', err)
        setError('Gagal memuat data saldo')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return <div className="p-4">Loading...</div>
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">List Saldo</h1>
      <table className="table-auto w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Phone Number</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Registration</th>
            <th className="px-4 py-2 border">Saldo</th>
            <th className="px-4 py-2 border">Created At</th>
          </tr>
        </thead>
        <tbody>
          {saldoData.map(item => (
            <tr key={item.id}>
              <td className="px-4 py-2 border">{item.id}</td>
              <td className="px-4 py-2 border">{item.phoneNumber}</td>
              <td className="px-4 py-2 border">{item.status}</td>
              <td className="px-4 py-2 border">{item.registrationStatus}</td>
              <td className="px-4 py-2 border text-right">{item.saldo.toLocaleString()}</td>
              <td className="px-4 py-2 border">{new Date(item.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
