import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface Transaksi {
  id: string;
  tanggal: string;
  deskripsi: string;
  jumlah: number;
  tipe: "Debit" | "Kredit";
}

interface UserDetail {
  userId: string;
  nama: string;
  status: "Active" | "Inactive";
  category: "Register" | "Unregister";
}

export const DetailSaldo: React.FC = () => {
  const { userId } = useParams();
  const [transaksiList, setTransaksiList] = useState<Transaksi[]>([]);
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);

  useEffect(() => {
    // Dummy data user
    const dummyUsers: UserDetail[] = [
      { userId: "U001", nama: "Andi", status: "Active", category: "Register" },
      { userId: "U002", nama: "Budi", status: "Inactive", category: "Unregister" },
      { userId: "U003", nama: "Cici", status: "Active", category: "Register" },
      { userId: "U004", nama: "Doni", status: "Active", category: "Unregister" },
      { userId: "U005", nama: "Eka", status: "Inactive", category: "Register" },
    ];
    const user = dummyUsers.find(u => u.userId === userId);
    setUserDetail(user || null);

    // Dummy transaksi
    const dummyData: Transaksi[] = [
      { id: "T001", tanggal: "2025-09-01T09:15:23", deskripsi: "Top-up saldo", jumlah: 100000, tipe: "Kredit" },
      { id: "T002", tanggal: "2025-09-02T14:45:10", deskripsi: "Pembayaran", jumlah: 50000, tipe: "Debit" },
      { id: "T003", tanggal: "2025-09-03T16:20:05", deskripsi: "Transfer ke U003", jumlah: 20000, tipe: "Debit" },
      { id: "T004", tanggal: "2025-09-04T11:30:50", deskripsi: "Top-up saldo", jumlah: 150000, tipe: "Kredit" },
    ];
    setTransaksiList(dummyData);
  }, [userId]);

  const formatRupiah = (number: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(number);

  const formatTanggalJam = (tanggal: string) => {
    const d = new Date(tanggal);
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };

  if (!userDetail) return <div className="p-4">User tidak ditemukan</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Detail Saldo User {userDetail.userId}</h2>

      {/* Info User */}
      <div className="flex flex-wrap gap-6 mb-6 items-center text-sm">
        <div><strong>Nama:</strong> {userDetail.nama}</div>
        <div><strong>Status:</strong> {userDetail.status}</div>
        <div><strong>Category:</strong> {userDetail.category}</div>
      </div>

      {/* Riwayat Transaksi */}
      <Table className="border border-white mb-4">
        <TableHeader>
          <TableRow>
            <TableHead className="border border-white">ID Transaksi</TableHead>
            <TableHead className="border border-white">Tanggal & Jam</TableHead>
            <TableHead className="border border-white">Deskripsi</TableHead>
            <TableHead className="border border-white">Jumlah</TableHead>
            <TableHead className="border border-white">Tipe</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transaksiList.map(t => (
            <TableRow key={t.id} className="border border-white">
              <TableCell className="border border-white">{t.id}</TableCell>
              <TableCell className="border border-white">{formatTanggalJam(t.tanggal)}</TableCell>
              <TableCell className="border border-white">{t.deskripsi}</TableCell>
              <TableCell className="border border-white">{formatRupiah(t.jumlah)}</TableCell>
              <TableCell className={`border border-white font-semibold ${t.tipe === "Kredit" ? "text-green-600" : "text-red-600"}`}>{t.tipe}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4">
        <Link to="/saldo">
          <Button variant="default">Kembali ke Daftar Saldo</Button>
        </Link>
      </div>
    </div>
  );
};
