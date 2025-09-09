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

interface Transaksi {
  id: string;
  userId: string;
  jenis:
    | "Topup Shopee"
    | "Topup Gopay"
    | "Transfer BCA"
    | "Transfer OVO"
    | "Pembayaran PLN"
    | "Pembayaran Pulsa";
  nominal: number;
  tanggal: string;
}

/* ---------- Dummy Data ---------- */
const initialSaldoData: Saldo[] = [
  { userId: "U001", nama: "Andi", saldo: 500000, status: "Active", category: "Register" },
  { userId: "U002", nama: "Budi", saldo: 300000, status: "Inactive", category: "Unregister" },
  { userId: "U003", nama: "Cici", saldo: 700000, status: "Active", category: "Register" },
  { userId: "U004", nama: "Doni", saldo: 200000, status: "Active", category: "Unregister" },
  { userId: "U005", nama: "Eka", saldo: 1000000, status: "Inactive", category: "Register" },
  { userId: "U006", nama: "Fajar", saldo: 450000, status: "Active", category: "Unregister" },
  { userId: "U007", nama: "Gita", saldo: 850000, status: "Inactive", category: "Register" },
  { userId: "U008", nama: "Hadi", saldo: 950000, status: "Active", category: "Unregister" },
  { userId: "U009", nama: "Indra", saldo: 620000, status: "Active", category: "Register" },
  { userId: "U010", nama: "Joko", saldo: 410000, status: "Inactive", category: "Unregister" },
  { userId: "U011", nama: "Kiki", saldo: 530000, status: "Active", category: "Register" },
  { userId: "U012", nama: "Lina", saldo: 770000, status: "Inactive", category: "Unregister" },
];

/* ---------- Dummy Transaksi ---------- */
const randomDate = (start: Date, end: Date) => {
  const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')} ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}:${d.getSeconds().toString().padStart(2,'0')}`;
};

const transaksiJenis: Transaksi["jenis"][] = [
  "Topup Shopee", "Topup Gopay", "Transfer BCA", "Transfer OVO", "Pembayaran PLN", "Pembayaran Pulsa"
];

const generateTransaksi = (userId: string, jumlah: number) => {
  return Array.from({ length: jumlah }, (_, i) => ({
    id: `T${userId}${i+1}`,
    userId,
    jenis: transaksiJenis[Math.floor(Math.random() * transaksiJenis.length)],
    nominal: Math.floor(Math.random() * 500000) + 50000,
    tanggal: randomDate(new Date(2025, 0, 1), new Date(2025, 8, 8))
  }));
};

const initialTransaksiData: Transaksi[] = [
  ...generateTransaksi("U001", 12),
  ...generateTransaksi("U002", 5),
  ...generateTransaksi("U003", 20),
  ...generateTransaksi("U004", 8),
  ...generateTransaksi("U005", 6),
  ...generateTransaksi("U006", 0),
  ...generateTransaksi("U007", 7),
  ...generateTransaksi("U008", 9),
  ...generateTransaksi("U009", 0),
  ...generateTransaksi("U010", 4),
  ...generateTransaksi("U011", 10),
  ...generateTransaksi("U012", 3),
];

/* ---------- ListSaldo ---------- */
interface ListSaldoProps {
  saldoData: Saldo[];
}

const ListSaldo: React.FC<ListSaldoProps> = ({ saldoData }) => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredData = saldoData.filter(
    (s) =>
      (s.userId.toLowerCase().includes(search.toLowerCase()) ||
        s.nama.toLowerCase().includes(search.toLowerCase())) &&
      (filterStatus === "all" || s.status === filterStatus) &&
      (filterCategory === "all" || s.category === filterCategory)
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Daftar Saldo Virtual User</h1>

      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <Input
          placeholder="Cari User ID atau Nama..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64 h-10"
        />
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-52 h-10">
            <SelectValue placeholder="Filter Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Category</SelectItem>
            <SelectItem value="Register">Register</SelectItem>
            <SelectItem value="Unregister">Unregister</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-52 h-10">
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table className="mb-2 border-collapse border border-black dark:border-white w-full">
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
          {paginatedData.map((s) => (
            <TableRow key={s.userId} className="border border-black dark:border-white hover:bg-gray-50 dark:hover:bg-gray-700">
              <TableCell className="border border-black dark:border-white">
                <Link to={`/saldo/${s.userId}`} className="text-blue-600 hover:underline">{s.userId}</Link>
              </TableCell>
              <TableCell className="border border-black dark:border-white">{s.nama}</TableCell>
              <TableCell className="border border-black dark:border-white">Rp {s.saldo.toLocaleString()}</TableCell>
              <TableCell className="border border-black dark:border-white text-center">
                <span className={`px-2 py-1 text-sm font-semibold rounded-md ${s.status==="Active"?"bg-green-100 text-green-800":"bg-red-100 text-red-800"}`}>
                  {s.status}
                </span>
              </TableCell>
              <TableCell className="border border-black dark:border-white">{s.category}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center mt-2">
        <div>
          <span>Row per page: </span>
          <Select value={itemsPerPage.toString()} onValueChange={(val) => {setItemsPerPage(Number(val)); setCurrentPage(1);}}>
            <SelectTrigger className="w-20 h-8"><SelectValue /></SelectTrigger>
            <SelectContent>
              {[10,15,20,50,100].map(n => <SelectItem key={n} value={n.toString()}>{n}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-1">
          {Array.from({length: totalPages}, (_, i) => i+1).map(num => (
            <Button
              key={num}
              className={`w-8 ${currentPage===num?"bg-blue-600 text-white":"bg-gray-200 dark:bg-gray-700"}`}
              onClick={()=>setCurrentPage(num)}
            >{num}</Button>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ---------- DetailSaldo ---------- */
interface DetailSaldoProps {
  saldoData: Saldo[];
  updateStatus: (userId: string, newStatus: "Active" | "Inactive") => void;
}

const DetailSaldo: React.FC<DetailSaldoProps> = ({ saldoData, updateStatus }) => {
  const { userId } = useParams<{ userId:string }>();
  const saldo = saldoData.find(s=>s.userId===userId);
  const transaksiUser = initialTransaksiData.filter(t=>t.userId===userId);

  const [sortOrder, setSortOrder] = useState<"asc"|"desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  if(!saldo) return <div className="p-4">Data tidak ditemukan</div>;

  const toggleStatus = ()=>{
    const newStatus = saldo.status==="Active"?"Inactive":"Active";
    updateStatus(saldo.userId,newStatus);
    alert(`Status berhasil diubah menjadi ${newStatus}`);
  };

  const sortedTransaksi = [...transaksiUser].sort((a,b)=>
    sortOrder==="desc"? new Date(b.tanggal).getTime()-new Date(a.tanggal).getTime()
    : new Date(a.tanggal).getTime()-new Date(b.tanggal).getTime()
  );

  const totalPages = Math.ceil(sortedTransaksi.length / itemsPerPage);
  const paginatedTransaksi = sortedTransaksi.slice((currentPage-1)*itemsPerPage, currentPage*itemsPerPage);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Detail Saldo - {saldo.nama}</h1>
        <Button onClick={toggleStatus} className={`w-28 font-semibold text-white ${saldo.status==="Active"?"bg-green-600 hover:bg-green-700":"bg-red-600 hover:bg-red-700"}`}>{saldo.status}</Button>
      </div>

      <Table className="border-collapse border border-black dark:border-white w-full mb-6">
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
            <TableCell className="font-semibold border border-black dark:border-white">Category</TableCell>
            <TableCell className="border border-black dark:border-white">{saldo.category}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div className="flex items-center gap-3 mb-3">
        <span className="font-semibold">Urutkan:</span>
        <Select value={sortOrder} onValueChange={(val)=>setSortOrder(val as "asc"|"desc")}>
          <SelectTrigger className="w-56 h-10"><SelectValue placeholder="Urutkan Transaksi"/></SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Terbaru → Terlama</SelectItem>
            <SelectItem value="asc">Terlama → Terbaru</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <h2 className="text-xl font-semibold mb-2">Riwayat Transaksi</h2>
      <Table className="border-collapse border border-black dark:border-white w-full mb-2">
        <TableHeader className="bg-gray-100 dark:bg-gray-800">
          <TableRow>
            <TableHead className="border border-black dark:border-white">ID Transaksi</TableHead>
            <TableHead className="border border-black dark:border-white">Jenis</TableHead>
            <TableHead className="border border-black dark:border-white">Nominal</TableHead>
            <TableHead className="border border-black dark:border-white">Tanggal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedTransaksi.length>0 ? paginatedTransaksi.map(t=>(
            <TableRow key={t.id} className="border border-black dark:border-white">
              <TableCell className="border border-black dark:border-white">{t.id}</TableCell>
              <TableCell className="border border-black dark:border-white">{t.jenis}</TableCell>
              <TableCell className="border border-black dark:border-white">Rp {t.nominal.toLocaleString()}</TableCell>
              <TableCell className="border border-black dark:border-white">{t.tanggal}</TableCell>
            </TableRow>
          )): <TableRow><TableCell colSpan={4} className="text-center p-4">Tidak ada transaksi</TableCell></TableRow>}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center mt-2">
        <div>
          <span>Row per page: </span>
          <Select value={itemsPerPage.toString()} onValueChange={(val)=>{setItemsPerPage(Number(val)); setCurrentPage(1);}}>
            <SelectTrigger className="w-20 h-8"><SelectValue/></SelectTrigger>
            <SelectContent>
              {[10,15,20,50,100].map(n=><SelectItem key={n} value={n.toString()}>{n}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-1">
          {Array.from({length: totalPages}, (_, i)=>i+1).map(num=>(
            <Button key={num} className={`w-8 ${currentPage===num?"bg-blue-600 text-white":"bg-gray-200 dark:bg-gray-700"}`} onClick={()=>setCurrentPage(num)}>{num}</Button>
          ))}
        </div>
      </div>

      <Link to="/saldo"><Button className="mt-6 w-32">Kembali ke List</Button></Link>
    </div>
  );
};

/* ---------- Parent Component: SaldoPage ---------- */
export const SaldoPage: React.FC = () => {
  const [saldoData, setSaldoData] = useState<Saldo[]>(initialSaldoData);

  const updateStatus = (userId:string,newStatus:"Active"|"Inactive")=>{
    setSaldoData(prev=>prev.map(s=>s.userId===userId?{...s,status:newStatus}:s));
  };

  return (
    <Routes>
      <Route path="/" element={<ListSaldo saldoData={saldoData} />} />
      <Route path=":userId" element={<DetailSaldo saldoData={saldoData} updateStatus={updateStatus}/>} />
    </Routes>
  );
};
