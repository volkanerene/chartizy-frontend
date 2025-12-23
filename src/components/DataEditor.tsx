"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, ArrowUpDown, ArrowUp, ArrowDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface DataRow {
  label: string;
  value: number;
}

interface DataEditorProps {
  data: { labels: string[]; datasets: Array<{ data: number[] }> };
  onDataChange: (data: { labels: string[]; datasets: Array<{ data: number[] }> }) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function DataEditor({ data, onDataChange, isOpen, onClose }: DataEditorProps) {
  const [rows, setRows] = useState<DataRow[]>(
    data.labels.map((label, i) => ({
      label,
      value: data.datasets[0]?.data[i] || 0,
    }))
  );
  const [sortColumn, setSortColumn] = useState<"label" | "value" | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleAddRow = () => {
    setRows([...rows, { label: `Item ${rows.length + 1}`, value: 0 }]);
  };

  const handleDeleteRow = (index: number) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleUpdateRow = (index: number, field: "label" | "value", newValue: string | number) => {
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], [field]: newValue };
    setRows(newRows);
  };

  const handleSort = (column: "label" | "value") => {
    const newDirection = sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(newDirection);

    const sorted = [...rows].sort((a, b) => {
      if (column === "label") {
        return newDirection === "asc"
          ? a.label.localeCompare(b.label)
          : b.label.localeCompare(a.label);
      } else {
        return newDirection === "asc" ? a.value - b.value : b.value - a.value;
      }
    });
    setRows(sorted);
  };

  const handleSave = () => {
    onDataChange({
      labels: rows.map((r) => r.label),
      datasets: [{ data: rows.map((r) => r.value) }],
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
      />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl border-2 border-blue-100 p-6 w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900">Edit Data</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="border-2 border-blue-100 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <button
                      onClick={() => handleSort("label")}
                      className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-blue-600"
                    >
                      Label
                      {sortColumn === "label" && (
                        sortDirection === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                      )}
                      {sortColumn !== "label" && <ArrowUpDown className="w-4 h-4 opacity-50" />}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button
                      onClick={() => handleSort("value")}
                      className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-blue-600"
                    >
                      Value
                      {sortColumn === "value" && (
                        sortDirection === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                      )}
                      {sortColumn !== "value" && <ArrowUpDown className="w-4 h-4 opacity-50" />}
                    </button>
                  </th>
                  <th className="px-4 py-3 w-16"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index} className="border-t border-blue-100 hover:bg-blue-50/50">
                    <td className="px-4 py-3">
                      <Input
                        value={row.label}
                        onChange={(e) => handleUpdateRow(index, "label", e.target.value)}
                        className="border-blue-200 focus:border-blue-400"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Input
                        type="number"
                        value={row.value}
                        onChange={(e) => handleUpdateRow(index, "value", parseFloat(e.target.value) || 0)}
                        className="border-blue-200 focus:border-blue-400"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteRow(index)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 pt-6 border-t border-blue-100">
          <Button variant="outline" onClick={handleAddRow} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Row
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              Save Changes
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
