import React, { useState } from "react";
import { Routes, Route, useParams, Link } from "react-router-dom";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

/* ---------- Types ---------- */
interface Saldo {
  userId: string;
  nama: string;
  saldo: number;
  status: "Active" | "Inactive";
  category: "Register" | "Unregister";
}

/* ---------- Dummy Data ---------- */
const initialSaldoData: Saldo[] = [
  { userId: "U001", nama: "Andi", saldo: 500000, status: "Active", category: "Register" },
  { userId: "U002", nama: "Budi", saldo: 300000, status: "Inactive", category: "Unregister" },
  { userId: "U003", nama: "Cici", saldo: 700000, status: "Active", category: "Register" },
  { userId: "U004", nama: "Doni", saldo: 200000, status: "Active", category: "Unregister" },
  { userId: "U005", nama: "Eka", saldo: 1000000, status: "Inactive", category: "Register" },
];

/* ---------- ListSaldo ---------- */
interface ListSaldoProps {
  saldoData: Saldo[];
}

const ListSaldo: React.FC<ListSaldoProps> = ({ saldoData }) => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  const filteredData = saldoData.filter(
    (s) =>
      (s.userId.toLowerCase().includes(search.toLowerCase()) ||
        s.nama.toLowerCase().includes(search.toLowerCase())) &&
      (filterStatus === "all" || s.status === filterStatus) &&
      (filterCategory === "all" || s.category === filterCategory)
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Daftar Saldo Virtual User</h1>

      {/* Search & Filters */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <Input
          placeholder="Cari User ID atau Nama..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64 h-10"
        />
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-44 h-10">
            <SelectValue placeholder="Filter Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Category</SelectItem>
            <SelectItem value="Register">Register</SelectItem>
            <SelectItem value="Unregister">Unregister</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-36 h-10">
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Table className="mb-4 border-collapse border border-black dark:border-white">
        <TableHeader className="bg-gray-100 dark:bg-gray-800">
          <TableRow>
            <TableHead className="border border-black dark:border-white">User ID</TableHead>
            <TableHead className="border border-black dark:border-white">Nama</TableHead>
            <TableHead className="border border-black dark:border-white">Saldo</TableHead>
            <TableHead className="border border-black dark:border-white">Status</TableHead>
            <TableHead className="border border-black dark:border-white">Category</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((s) => (
            <TableRow
              key={s.userId}
              className="border border-black dark:border-white hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <TableCell className="border border-black dark:border-white">
                <Link to={`/saldo/${s.userId}`} className="text-blue-600 hover:underline">
                  {s.userId}
                </Link>
              </TableCell>
              <TableCell className="border border-black dark:border-white">{s.nama}</TableCell>
              <TableCell className="border border-black dark:border-white">Rp {s.saldo.toLocaleString()}</TableCell>
              <TableCell className="border border-black dark:border-white">{s.status}</TableCell>
              <TableCell className="border border-black dark:border-white">{s.category}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

/* ---------- DetailSaldo ---------- */
interface DetailSaldoProps {
  saldoData: Saldo[];
  updateStatus: (userId: string, newStatus: "Active" | "Inactive") => void;
}

const DetailSaldo: React.FC<DetailSaldoProps> = ({ saldoData, updateStatus }) => {
  const { userId } = useParams<{ userId: string }>();
  const saldo = saldoData.find((s) => s.userId === userId);

  if (!saldo) return <div className="p-4">Data tidak ditemukan</div>;

  const toggleStatus = () => {
    const newStatus = saldo.status === "Active" ? "Inactive" : "Active";
    updateStatus(saldo.userId, newStatus);
    alert(`Status berhasil diubah menjadi ${newStatus}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Detail Saldo - {saldo.nama}</h1>

      <Table className="border-collapse border border-black dark:border-white w-full">
        <TableBody>
          <TableRow className="border border-black dark:border-white">
            <TableCell className="font-semibold border border-black dark:border-white">User ID</TableCell>
            <TableCell className="border border-black dark:border-white">{saldo.userId}</TableCell>
          </TableRow>
          <TableRow className="border border-black dark:border-white">
            <TableCell className="font-semibold border border-black dark:border-white">Nama</TableCell>
            <TableCell className="border border-black dark:border-white">{saldo.nama}</TableCell>
          </TableRow>
          <TableRow className="border border-black dark:border-white">
            <TableCell className="font-semibold border border-black dark:border-white">Saldo</TableCell>
            <TableCell className="border border-black dark:border-white">Rp {saldo.saldo.toLocaleString()}</TableCell>
          </TableRow>
          <TableRow className="border border-black dark:border-white">
            <TableCell className="font-semibold border border-black dark:border-white">Status</TableCell>
            <TableCell className="border border-black dark:border-white">
              <Button onClick={toggleStatus} className="w-full">
                {saldo.status}
              </Button>
            </TableCell>
          </TableRow>
          <TableRow className="border border-black dark:border-white">
            <TableCell className="font-semibold border border-black dark:border-white">Category</TableCell>
            <TableCell className="border border-black dark:border-white">{saldo.category}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Link to="/saldo">
        <Button className="mt-4 w-32">Kembali ke List</Button>
      </Link>
    </div>
  );
};

/* ---------- Parent Component: SaldoPage ---------- */
export const SaldoPage: React.FC = () => {
  const [saldoData, setSaldoData] = useState<Saldo[]>(initialSaldoData);

  const updateStatus = (userId: string, newStatus: "Active" | "Inactive") => {
    setSaldoData((prev) =>
      prev.map((s) => (s.userId === userId ? { ...s, status: newStatus } : s))
    );
  };

  return (
    <Routes>
      <Route
        path="/"
        element={<ListSaldo saldoData={saldoData} />}
      />
      <Route
        path=":userId"
        element={<DetailSaldo saldoData={saldoData} updateStatus={updateStatus} />}
      />
    </Routes>
  );
};
