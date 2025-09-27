'use client'

import React, { useState, useEffect } from 'react'
import {
  getListUser,
  getDetailUser,
  type ListUserItem,
  type DetailUser,
} from '@/services/user/end-user'

export const SaldoPage: React.FC = () => {
  const [saldoData, setSaldoData] = useState<ListUserItem[]>([])
  const [loading, setLoading] = useState(true)
  const [detailUser, setDetailUser] = useState<DetailUser | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getListUser()
        setSaldoData(data)
      } catch (err) {
        setError('Gagal mengambil data user')
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const handleShowDetail = async (id: number) => {
    setDetailLoading(true)
    setError(null)
    try {
      const detail = await getDetailUser(id)
      setDetailUser(detail)
    } catch (err) {
      setError('Gagal mengambil detail user')
    } finally {
      setDetailLoading(false)
    }
  }

  // helper bikin URL full ke static file
  const getImageUrl = (path?: string) => {
    if (!path) return ''
    // langsung nembak ke static file server
    return `http://38.47.94.165:3124${path}`
  }

  if (loading) {
    return <div className="p-4">Loading...</div>
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Daftar User</h1>
      <table className="table-auto w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Phone</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Registration</th>
            <th className="p-2 border">Saldo</th>
            <th className="p-2 border">Created At</th>
          </tr>
        </thead>
        <tbody>
          {saldoData.map(user => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td
                className="p-2 border text-blue-600 cursor-pointer"
                onClick={() => handleShowDetail(user.id)}
              >
                {user.id}
              </td>
              <td className="p-2 border">{user.phoneNumber}</td>
              <td className="p-2 border">{user.status}</td>
              <td className="p-2 border">{user.registrationStatus}</td>
              <td className="p-2 border">{user.saldo}</td>
              <td className="p-2 border">{user.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* DETAIL USER */}
      {detailLoading && <div className="mt-4">Loading detail...</div>}
      {detailUser && (
        <div className="mt-6 p-4 border rounded">
          <h2 className="text-lg font-semibold mb-2">Detail User</h2>
          <p>
            <strong>Full Name:</strong> {detailUser.fullName}
          </p>
          <p>
            <strong>NIK:</strong> {detailUser.nik}
          </p>
          <p>
            <strong>Address:</strong> {detailUser.address}
          </p>
          <p>
            <strong>Place of Birth:</strong> {detailUser.placeOfBirth}
          </p>
          <p>
            <strong>Date of Birth:</strong> {detailUser.dob}
          </p>
          <p>
            <strong>Gender:</strong> {detailUser.gender}
          </p>
          <p>
            <strong>Religion:</strong> {detailUser.religion}
          </p>
          <p>
            <strong>Marital Status:</strong> {detailUser.maritalStatus}
          </p>
          <p>
            <strong>Job:</strong> {detailUser.job}
          </p>
          <p>
            <strong>Status:</strong> {detailUser.status}
          </p>
          {detailUser.rejectionReason && (
            <p>
              <strong>Rejection Reason:</strong> {detailUser.rejectionReason}
            </p>
          )}

          <div className="mt-4 flex gap-6">
            {detailUser.selfieUrl && (
              <div>
                <p className="font-medium">Selfie:</p>
                <img
                  src={getImageUrl(detailUser.selfieUrl) || ''}
                  alt="Selfie"
                  className="w-40 h-40 object-cover border rounded shadow"
                />
              </div>
            )}
            {detailUser.ktpUrl && (
              <div>
                <p className="font-medium">KTP:</p>
                <img
                  src={getImageUrl(detailUser.ktpUrl) || ''}
                  alt="KTP"
                  className="w-40 h-40 object-cover border rounded shadow"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
