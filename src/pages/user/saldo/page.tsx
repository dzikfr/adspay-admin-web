'use client'

import React, { useEffect, useState } from 'react'
import { Routes, Route, useNavigate, useParams } from 'react-router-dom'
import {
  getListUser,
  getDetailUser,
  activateUser,
  deactivateUser,
  type ListUserItem,
  type DetailUser,
  type KycProfile,
  type Transaction,
} from '@/services/user/end-user'

// ==================== MAIN PAGE ====================
export const SaldoPage: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<SaldoList />} />
      <Route path=":id" element={<SaldoDetail />} />
    </Routes>
  )
}

// ==================== LIST USER ====================
const SaldoList: React.FC = () => {
  const [saldoData, setSaldoData] = useState<ListUserItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchId, setSearchId] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'SUSPEND'>('ALL')
  const [regFilter, setRegFilter] = useState<'ALL' | 'REGISTERED' | 'UNREGISTERED'>('ALL')
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getListUser()
        setSaldoData(data)
      } catch {
        setError('Gagal mengambil data user')
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const statusColor = (status: string) => (status === 'ACTIVE' ? 'text-green-600' : 'text-red-600')
  const displayStatus = (status: string) => (status === 'ACTIVE' ? 'ACTIVE' : 'SUSPEND')

  const filteredData = saldoData.filter(user => {
    const query = searchId.toLowerCase()
    const matchSearch = query
      ? user.id.toString().includes(query) ||
        user.phoneNumber?.toLowerCase().includes(query) ||
        user.status?.toLowerCase().includes(query) ||
        user.registrationStatus?.toLowerCase().includes(query) ||
        user.createdAt?.toLowerCase().includes(query)
      : true
    const matchStatus = statusFilter === 'ALL' ? true : user.status === statusFilter
    const matchReg =
      regFilter === 'ALL'
        ? true
        : regFilter === 'REGISTERED'
          ? user.registrationStatus === 'REGISTERED'
          : user.registrationStatus !== 'REGISTERED'
    return matchSearch && matchStatus && matchReg
  })

  const totalPages = Math.ceil(filteredData.length / rowsPerPage)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  useEffect(() => {
    const handler = (e: any) => {
      const { id, status } = e.detail
      setSaldoData(prev => prev.map(u => (u.id === id ? { ...u, status } : u)))
    }
    window.addEventListener('listStatusUpdate', handler)
    return () => window.removeEventListener('listStatusUpdate', handler)
  }, [])

  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>

  return (
    <div className="p-4 min-h-screen dark:bg-gray-900 dark:text-gray-100">
      <h1 className="text-xl font-bold mb-4">Daftar User</h1>
      {/* Filter & Search */}
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <input
          type="text"
          placeholder="Search by ID, Phone, Status, Registration, Created At"
          value={searchId}
          onChange={e => setSearchId(e.target.value)}
          className="px-3 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as any)}
          className="px-3 py-1 border rounded w-44 dark:bg-gray-700 dark:border-gray-600"
        >
          <option value="ALL">All Status</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="SUSPEND">SUSPEND</option>
        </select>
        <select
          value={regFilter}
          onChange={e => setRegFilter(e.target.value as any)}
          className="px-3 py-1 border rounded w-44 dark:bg-gray-700 dark:border-gray-600"
        >
          <option value="ALL">All Registration</option>
          <option value="REGISTERED">REGISTERED</option>
          <option value="UNREGISTERED">UNREGISTERED</option>
        </select>
      </div>
      {/* Table */}
      <table className="table-auto w-full border dark:border-gray-700">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <th className="p-2 border dark:border-gray-700">ID</th>
            <th className="p-2 border dark:border-gray-700">Phone</th>
            <th className="p-2 border dark:border-gray-700">Status</th>
            <th className="p-2 border dark:border-gray-700">Registration</th>
            <th className="p-2 border dark:border-gray-700">Saldo</th>
            <th className="p-2 border dark:border-gray-700">Created At</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map(user => (
            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td
                className="p-2 border dark:border-gray-700 text-blue-600 cursor-pointer"
                onClick={() => navigate(`/saldo/${user.id}`)}
              >
                {user.id}
              </td>
              <td className="p-2 border dark:border-gray-700">{user.phoneNumber}</td>
              <td className={`p-2 border dark:border-gray-700 ${statusColor(user.status)}`}>
                {displayStatus(user.status)}
              </td>
              <td className="p-2 border dark:border-gray-700">{user.registrationStatus}</td>
              <td className="p-2 border dark:border-gray-700">{user.saldo}</td>
              <td className="p-2 border dark:border-gray-700">{user.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination & Rows per page */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-2">
          <label>Rows per page:</label>
          <select
            value={rowsPerPage}
            onChange={e => {
              setRowsPerPage(Number(e.target.value))
              setCurrentPage(1)
            }}
            className="px-3 py-1 border rounded w-28 dark:bg-gray-700 dark:border-gray-600"
          >
            {[10, 25, 50, 100].map(n => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span>
            Showing {(currentPage - 1) * rowsPerPage + 1} to{' '}
            {Math.min(currentPage * rowsPerPage, filteredData.length)} of {filteredData.length}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              className={`px-3 py-1 border rounded ${
                currentPage === page ? 'bg-blue-600 text-white' : ''
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

// ==================== DETAIL USER ====================
const SaldoDetail: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [detailUser, setDetailUser] = useState<DetailUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [newStatus, setNewStatus] = useState<'ACTIVE' | 'SUSPEND'>('ACTIVE')
  const [activeTab, setActiveTab] = useState<'TRANSACTION' | 'KYC'>('TRANSACTION')
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return setLoading(true)
      try {
        const result = await getDetailUser(Number(id))
        setDetailUser(result)
        if (result) setNewStatus(result.status as 'ACTIVE' | 'SUSPEND')
      } catch {
        setError('Gagal mengambil detail user')
      } finally {
        setLoading(false)
      }
    }
    fetchDetail()
  }, [id])

  const getImageUrl = (path?: string) => (path ? `http://38.47.94.165:3124${path}` : '')
  const statusColor = (status: string) => (status === 'ACTIVE' ? 'text-green-600' : 'text-red-600')
  const buttonColor = (status: string) =>
    status === 'ACTIVE' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
  const displayStatus = (status: string) => (status === 'ACTIVE' ? 'ACTIVE' : 'SUSPEND')

  const confirmStatusChange = async () => {
    if (!detailUser) return

    try {
      let res
      if (newStatus === 'ACTIVE') {
        res = await activateUser(detailUser.id)
      } else {
        res = await deactivateUser(detailUser.id)
      }

      if (res.resp_code === '00') {
        setDetailUser({ ...detailUser, status: newStatus })
        window.dispatchEvent(
          new CustomEvent('listStatusUpdate', { detail: { id: detailUser.id, status: newStatus } })
        )
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 2000)
      } else {
        alert('Gagal update status')
      }
    } catch (err) {
      console.error(err)
      alert('Terjadi kesalahan saat update status')
    } finally {
      setShowModal(false)
    }
  }

  if (loading) return <div className="p-4">Loading detail...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>
  if (!detailUser) return null

  return (
    <div className="p-4 min-h-screen dark:bg-gray-900 dark:text-gray-100 relative">
      {/* Button status */}
      <div className="absolute top-4 right-4">
        <button
          className={`px-3 py-1 text-white rounded ${buttonColor(detailUser.status)}`}
          onClick={() => {
            setNewStatus(detailUser.status === 'ACTIVE' ? 'SUSPEND' : 'ACTIVE')
            setShowModal(true)
          }}
        >
          {detailUser.status === 'ACTIVE' ? 'SUSPEND' : 'ACTIVE'}
        </button>
      </div>

      <button
        className="mb-4 px-3 py-1 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
        onClick={() => navigate('/saldo')}
      >
        Kembali
      </button>

      <h1 className="text-xl font-bold mb-4">
        Detail User{' '}
        <span className={statusColor(detailUser.status)}>({displayStatus(detailUser.status)})</span>
      </h1>

      {/* Informasi user */}
      <table className="table-auto w-full border mb-4 dark:border-gray-700">
        <tbody>
          {[
            ['Id', detailUser.id],
            ['Phone', detailUser.phoneNumber],
            ['Saldo', detailUser.saldo],
            ['Status', displayStatus(detailUser.status)],
            ['Registration', detailUser.registrationStatus],
            ['Created At', detailUser.createdAt],
            ['Updated At', detailUser.updatedAt],
          ].map(([label, value]) => (
            <tr key={label}>
              <td className="p-2 border font-medium dark:border-gray-700">{label}</td>
              <td className="p-2 border dark:border-gray-700">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Tabs */}
      <div className="mb-4 flex gap-2 border-b dark:border-gray-700">
        <button
          className={`px-4 py-2 ${activeTab === 'TRANSACTION' ? 'border-b-2 border-blue-600 font-semibold' : ''}`}
          onClick={() => setActiveTab('TRANSACTION')}
        >
          Riwayat Transaksi
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'KYC' ? 'border-b-2 border-blue-600 font-semibold' : ''}`}
          onClick={() => setActiveTab('KYC')}
        >
          Riwayat KYC
        </button>
      </div>

      {activeTab === 'TRANSACTION' && (
        <div>
          {detailUser.transactions?.length ? (
            <table className="table-auto w-full border dark:border-gray-700">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="p-2 border dark:border-gray-700">Type</th>
                  <th className="p-2 border dark:border-gray-700">Amount</th>
                  <th className="p-2 border dark:border-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {detailUser.transactions.map((tx: Transaction, idx) => (
                  <tr key={idx}>
                    <td className="p-2 border dark:border-gray-700">{tx.type}</td>
                    <td className="p-2 border dark:border-gray-700">{tx.amount}</td>
                    <td className="p-2 border dark:border-gray-700">{tx.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">Tidak ada riwayat transaksi</p>
          )}
        </div>
      )}

      {activeTab === 'KYC' && (
        <div>
          {detailUser.kycProfiles.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">Tidak ada riwayat KYC</p>
          ) : (
            detailUser.kycProfiles.map((profile: KycProfile) => (
              <div
                key={profile.id}
                className="p-4 border rounded mb-4 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
              >
                {Object.entries(profile).map(([key, value]) => {
                  if (
                    key === 'selfieUrl' ||
                    key === 'ktpUrl' ||
                    key === 'id' ||
                    key === 'requestId'
                  )
                    return null
                  const label =
                    key === 'nik'
                      ? 'NIK'
                      : key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
                  return (
                    <p key={key}>
                      <strong>{label}:</strong> {value}
                    </p>
                  )
                })}
                <div className="mt-4 flex gap-6">
                  {profile.selfieUrl && (
                    <div>
                      <p className="font-medium">Selfie:</p>
                      <img
                        src={getImageUrl(profile.selfieUrl)}
                        alt="Selfie"
                        className="w-40 h-40 object-cover border rounded shadow dark:border-gray-600"
                      />
                    </div>
                  )}
                  {profile.ktpUrl && (
                    <div>
                      <p className="font-medium">KTP:</p>
                      <img
                        src={getImageUrl(profile.ktpUrl)}
                        alt="KTP"
                        className="w-40 h-40 object-cover border rounded shadow dark:border-gray-600"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-gray-400/20 z-40"></div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-96 z-50 relative">
            <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">Konfirmasi Status</h3>
            <p className="mb-4 dark:text-gray-200">
              Ubah status user menjadi <strong>{newStatus}</strong>?
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-1 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
                onClick={() => setShowModal(false)}
              >
                Batal
              </button>
              <button
                className={`px-4 py-1 text-white rounded ${buttonColor(detailUser.status)}`}
                onClick={confirmStatusChange}
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success popup */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50">
          Status berhasil diubah menjadi {newStatus}
        </div>
      )}
    </div>
  )
}
