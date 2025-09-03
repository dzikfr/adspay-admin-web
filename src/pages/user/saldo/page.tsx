import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
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

interface Saldo {
  userId: string;
  nama: string;
  saldo: number;
  status: "Active" | "Inactive";
  category: "Register" | "Unregister";
}

const ListSaldo: React.FC = () => {
  const [saldoList] = useState<Saldo[]>([
    { userId: "U001", nama: "Andi", saldo: 500000, status: "Active", category: "Register" },
    { userId: "U002", nama: "Budi", saldo: 300000, status: "Inactive", category: "Unregister" },
    { userId: "U003", nama: "Cici", saldo: 700000, status: "Active", category: "Register" },
    { userId: "U004", nama: "Doni", saldo: 200000, status: "Active", category: "Unregister" },
    { userId: "U005", nama: "Eka", saldo: 1000000, status: "Inactive", category: "Register" },
  ]);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortConfig, setSortConfig] = useState<{ key: keyof Saldo; direction: "asc" | "desc" } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const sortedFilteredData = useMemo(() => {
    let filtered = saldoList.filter(
      (s) =>
        (s.userId.toLowerCase().includes(search.toLowerCase()) ||
          s.nama.toLowerCase().includes(search.toLowerCase())) &&
        (filterStatus === "all" || s.status === filterStatus) &&
        (filterCategory === "all" || s.category === filterCategory)
    );

    if (sortConfig) {
      filtered = [...filtered].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [saldoList, search, filterStatus, filterCategory, sortConfig]);

  const totalPages = Math.ceil(sortedFilteredData.length / rowsPerPage);
  const paginatedData = sortedFilteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const requestSort = (key: keyof Saldo) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: keyof Saldo) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? " ↑" : " ↓";
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Daftar Saldo Virtual</h1>

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
      <Table className="mb-4 border border-gray-300 dark:border-gray-700">
        <TableHeader className="bg-gray-100 dark:bg-gray-800">
          <TableRow>
            <TableHead onClick={() => requestSort("userId")} className="cursor-pointer border border-gray-300 dark:border-gray-700">
              User ID{getSortIndicator("userId")}
            </TableHead>
            <TableHead onClick={() => requestSort("nama")} className="cursor-pointer border border-gray-300 dark:border-gray-700">
              Nama{getSortIndicator("nama")}
            </TableHead>
            <TableHead onClick={() => requestSort("saldo")} className="cursor-pointer border border-gray-300 dark:border-gray-700">
              Saldo{getSortIndicator("saldo")}
            </TableHead>
            <TableHead onClick={() => requestSort("status")} className="cursor-pointer border border-gray-300 dark:border-gray-700">
              Status{getSortIndicator("status")}
            </TableHead>
            <TableHead onClick={() => requestSort("category")} className="cursor-pointer border border-gray-300 dark:border-gray-700">
              Category{getSortIndicator("category")}
            </TableHead>
            <TableHead className="border border-gray-300 dark:border-gray-700 w-36">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((s) => (
            <TableRow
              key={s.userId}
              className="border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <TableCell className="border border-gray-300 dark:border-gray-700">{s.userId}</TableCell>
              <TableCell className="border border-gray-300 dark:border-gray-700">{s.nama}</TableCell>
              <TableCell className="border border-gray-300 dark:border-gray-700">Rp {s.saldo.toLocaleString()}</TableCell>
              <TableCell className="border border-gray-300 dark:border-gray-700">{s.status}</TableCell>
              <TableCell className="border border-gray-300 dark:border-gray-700">{s.category}</TableCell>
              <TableCell className="flex gap-1 justify-center border border-gray-300 dark:border-gray-700">
                <Link to={`/saldo/${s.userId}`}>
                  <Button size="sm" variant="default">Detail</Button>
                </Link>
                <Button size="sm" variant="secondary">Edit</Button>
                <Button size="sm" variant="destructive">Hapus</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <Select
            value={rowsPerPage.toString()}
            onValueChange={(val) => {
              setRowsPerPage(Number(val));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-20 h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="30">30</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <Button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>
            Prev
          </Button>
          <span>Page {currentPage} of {totalPages}</span>
          <Button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export { ListSaldo };
