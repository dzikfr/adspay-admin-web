import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Transaksi {
  id: string;
  tanggal: string;
  deskripsi: string;
  jumlah: number;
  tipe: "Debit" | "Kredit";
}

const DetailSaldo: React.FC = () => {
  const { userId } = useParams(); // ambil userId dari route
  const [transaksiList, setTransaksiList] = useState<Transaksi[]>([]);

  useEffect(() => {
    // Dummy data transaksi per user
    const dummyData: Transaksi[] = [
      { id: "T001", tanggal: "2025-09-01", deskripsi: "Top-up saldo", jumlah: 100000, tipe: "Kredit" },
      { id: "T002", tanggal: "2025-09-02", deskripsi: "Pembayaran", jumlah: 50000, tipe: "Debit" },
    ];
    setTransaksiList(dummyData);
  }, [userId]);

  const formatRupiah = (number: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(number);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Riwayat Transaksi User {userId}</h2>
      <table border={1} cellPadding={8} style={{ marginTop: "10px", width: "100%" }}>
        <thead>
          <tr>
            <th>ID Transaksi</th>
            <th>Tanggal</th>
            <th>Deskripsi</th>
            <th>Jumlah</th>
            <th>Tipe</th>
          </tr>
        </thead>
        <tbody>
          {transaksiList.map((t) => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.tanggal}</td>
              <td>{t.deskripsi}</td>
              <td>{formatRupiah(t.jumlah)}</td>
              <td style={{ color: t.tipe === "Kredit" ? "green" : "red" }}>{t.tipe}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DetailSaldo;
