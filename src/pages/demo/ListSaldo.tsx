import React, { useEffect, useState } from "react";

interface Saldo {
  userId: string;
  nama: string;
  saldo: number;
  category: "Registered" | "Unregistered";
  status: "Active" | "Inactive";
}

const ListSaldo: React.FC = () => {
  const [saldoList, setSaldoList] = useState<Saldo[]>([]);

  useEffect(() => {
    // Dummy data
    const dummyData: Saldo[] = [
      { userId: "U001", nama: "Andi", saldo: 150000, category: "Registered", status: "Active" },
      { userId: "U002", nama: "Budi", saldo: 250000, category: "Unregistered", status: "Inactive" },
      { userId: "U003", nama: "Citra", saldo: 320000, category: "Registered", status: "Active" },
    ];
    setSaldoList(dummyData);
  }, []);

  const formatRupiah = (number: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(number);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Daftar Saldo Virtual</h2>
      <table border={1} cellPadding={8} style={{ marginTop: "10px", width: "100%" }}>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Nama</th>
            <th>Saldo</th>
            <th>Category</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {saldoList.map((item) => (
            <tr key={item.userId}>
              <td>{item.userId}</td>
              <td>{item.nama}</td>
              <td>{formatRupiah(item.saldo)}</td>
              <td>{item.category}</td>
              <td style={{ color: item.status === "Active" ? "green" : "red" }}>
                {item.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListSaldo;
