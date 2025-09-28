'use client'

import React, { useEffect, useState } from 'react'
import { Routes, Route, useNavigate, useParams } from 'react-router-dom'
import {
  getListUser,
  getDetailUser,
  type ListUserItem,
  type DetailUser,
  type KycProfile,
} from '@/services/user/end-user'

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

  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>

  return (
    <div className="p-4 min-h-screen dark:bg-gray-900 dark:text-gray-100">
      <h1 className="text-xl font-bold mb-4">Daftar User</h1>
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
          {saldoData.map(user => (
            <tr
              key={user.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
              onClick={() => navigate(`/saldo/${user.id}`)}
            >
              <td className="p-2 border dark:border-gray-700 text-blue-600">{user.id}</td>
              <td className="p-2 border dark:border-gray-700">{user.phoneNumber}</td>
              <td className={`p-2 border dark:border-gray-700 ${statusColor(user.status)}`}>
                {user.status}
              </td>
              <td className="p-2 border dark:border-gray-700">{user.registrationStatus}</td>
              <td className="p-2 border dark:border-gray-700">{user.saldo}</td>
              <td className="p-2 border dark:border-gray-700">{user.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
  const [newStatus, setNewStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE')

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return
      setLoading(true)
      try {
        // Ambil data dari API, bisa array atau object
        const result = await getDetailUser(Number(id))
        // Pastikan kita ambil data array kalau API mengembalikan array
        const userData = Array.isArray(result) ? result[0] : result
        setDetailUser(userData)
        if (userData) setNewStatus(userData.status as 'ACTIVE' | 'INACTIVE')
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
    status === 'ACTIVE' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'

  const handleChangeStatus = () => setShowModal(true)
  const confirmStatusChange = () => {
    if (detailUser) setDetailUser({ ...detailUser, status: newStatus })
    setShowModal(false)
  }

  if (loading) return <div className="p-4">Loading detail...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>
  if (!detailUser) return null

  return (
    <div className="p-4 min-h-screen dark:bg-gray-900 dark:text-gray-100">
      <button
        className="mb-4 px-3 py-1 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
        onClick={() => navigate('/saldo')}
      >
        Kembali
      </button>

      <h1 className="text-xl font-bold mb-4">
        Detail User <span className={statusColor(detailUser.status)}>({detailUser.status})</span>
      </h1>

      <button
        className={`mb-4 px-3 py-1 text-white rounded ${buttonColor(detailUser.status)}`}
        onClick={handleChangeStatus}
      >
        {detailUser.status}
      </button>

      {/* Informasi user */}
      <table className="table-auto w-full border mb-4 dark:border-gray-700">
        <tbody>
          {[
            ['ID', detailUser.id],
            ['Keycloak ID', detailUser.keycloakUserId],
            ['Phone', detailUser.phoneNumber],
            ['Saldo', detailUser.saldo],
            ['Status', detailUser.status],
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

      {/* KYC Profiles */}
      <h3 className="text-md font-semibold mb-2">KYC Profiles</h3>
      {detailUser.kycProfiles.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">Tidak ada KYC Profile</p>
      ) : (
        detailUser.kycProfiles.map((profile: KycProfile) => (
          <div
            key={profile.id}
            className="p-4 border rounded mb-4 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
          >
            {Object.entries(profile).map(([key, value]) =>
              key === 'selfieUrl' || key === 'ktpUrl' || key === 'id' ? null : (
                <p key={key}>
                  <strong>{key.replace(/([A-Z])/g, ' $1')}:</strong> {value}
                </p>
              )
            )}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-gray-400/20 z-40"></div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-96 z-50 relative">
            <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">Konfirmasi Status</h3>
            <p className="mb-4 dark:text-gray-200">
              Ubah status user menjadi{' '}
              <strong>{detailUser.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'}</strong>?
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-3 py-1 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
                onClick={() => setShowModal(false)}
              >
                Batal
              </button>
              <button
                className={`px-3 py-1 text-white rounded ${
                  detailUser.status === 'ACTIVE'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
                onClick={() => {
                  setNewStatus(detailUser.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')
                  confirmStatusChange()
                }}
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
