"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Upload, FileJson, Table } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { cn } from "@/lib/utils";

interface DataInputTableProps {
  onDataChange: (data: Record<string, unknown>) => void;
  className?: string;
}

interface TableRow {
  id: string;
  values: string[];
}

export function DataInputTable({
  onDataChange,
  className,
}: DataInputTableProps) {
  const [inputType, setInputType] = useState<"table" | "json" | "csv">("table");
  const [headers, setHeaders] = useState<string[]>(["Label", "Value"]);
  const [rows, setRows] = useState<TableRow[]>([
    { id: "1", values: ["January", "100"] },
    { id: "2", values: ["February", "150"] },
    { id: "3", values: ["March", "200"] },
  ]);
  const [jsonInput, setJsonInput] = useState("");
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const addColumn = useCallback(() => {
    setHeaders((prev) => [...prev, `Column ${prev.length + 1}`]);
    setRows((prev) =>
      prev.map((row) => ({ ...row, values: [...row.values, ""] }))
    );
  }, []);

  const removeColumn = useCallback((index: number) => {
    setHeaders((prev) => prev.filter((_, i) => i !== index));
    setRows((prev) =>
      prev.map((row) => ({
        ...row,
        values: row.values.filter((_, i) => i !== index),
      }))
    );
  }, []);

  const addRow = useCallback(() => {
    setRows((prev) => [
      ...prev,
      { id: Date.now().toString(), values: headers.map(() => "") },
    ]);
  }, [headers]);

  const removeRow = useCallback((id: string) => {
    setRows((prev) => prev.filter((row) => row.id !== id));
  }, []);

  const updateHeader = useCallback((index: number, value: string) => {
    setHeaders((prev) => prev.map((h, i) => (i === index ? value : h)));
  }, []);

  const updateCell = useCallback((rowId: string, colIndex: number, value: string) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === rowId
          ? {
              ...row,
              values: row.values.map((v, i) => (i === colIndex ? value : v)),
            }
          : row
      )
    );
  }, []);

  const handleSubmit = useCallback(() => {
    if (inputType === "table") {
      // Convert table to structured data
      const labels = rows.map((row) => row.values[0]);
      const datasets = headers.slice(1).map((header, i) => ({
        label: header,
        data: rows.map((row) => parseFloat(row.values[i + 1]) || 0),
      }));

      onDataChange({ labels, datasets });
    } else if (inputType === "json") {
      try {
        const parsed = JSON.parse(jsonInput);
        onDataChange(parsed);
      } catch {
        alert("Invalid JSON");
      }
    }
  }, [inputType, headers, rows, jsonInput, onDataChange]);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setCsvFile(file);
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target?.result as string;
          const lines = text.split("\n").filter((line) => line.trim());
          if (lines.length > 0) {
            const csvHeaders = lines[0].split(",").map((h) => h.trim());
            setHeaders(csvHeaders);
            const csvRows = lines.slice(1).map((line, i) => ({
              id: i.toString(),
              values: line.split(",").map((v) => v.trim()),
            }));
            setRows(csvRows);
            setInputType("table");
          }
        };
        reader.readAsText(file);
      }
    },
    []
  );

  return (
    <div className={cn("space-y-4", className)}>
      <Tabs value={inputType} onValueChange={(v) => setInputType(v as typeof inputType)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="table" className="flex items-center gap-2">
            <Table className="w-4 h-4" />
            Table
          </TabsTrigger>
          <TabsTrigger value="json" className="flex items-center gap-2">
            <FileJson className="w-4 h-4" />
            JSON
          </TabsTrigger>
          <TabsTrigger value="csv" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            CSV
          </TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="mt-4">
          <div className="overflow-x-auto rounded-xl border-2 border-violet-100">
            <table className="w-full">
              <thead>
                <tr className="bg-violet-50/50">
                  {headers.map((header, i) => (
                    <th key={i} className="p-2 border-b border-violet-100">
                      <div className="flex items-center gap-2">
                        <Input
                          value={header}
                          onChange={(e) => updateHeader(i, e.target.value)}
                          className="h-8 text-sm font-medium"
                        />
                        {i > 0 && (
                          <button
                            onClick={() => removeColumn(i)}
                            className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </th>
                  ))}
                  <th className="p-2 border-b border-violet-100 w-10">
                    <button
                      onClick={addColumn}
                      className="p-1 text-violet-500 hover:text-violet-600 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="hover:bg-violet-50/30 transition-colors"
                  >
                    {row.values.map((value, i) => (
                      <td key={i} className="p-2 border-b border-violet-50">
                        <Input
                          value={value}
                          onChange={(e) =>
                            updateCell(row.id, i, e.target.value)
                          }
                          className="h-8 text-sm"
                        />
                      </td>
                    ))}
                    <td className="p-2 border-b border-violet-50">
                      <button
                        onClick={() => removeRow(row.id)}
                        className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={addRow}
            className="mt-3"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Row
          </Button>
        </TabsContent>

        <TabsContent value="json" className="mt-4">
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder={`{
  "labels": ["Jan", "Feb", "Mar"],
  "datasets": [
    {
      "label": "Sales",
      "data": [100, 200, 150]
    }
  ]
}`}
            className="w-full h-64 p-4 rounded-xl border-2 border-violet-100 bg-white/80 font-mono text-sm resize-none focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-500/10"
          />
        </TabsContent>

        <TabsContent value="csv" className="mt-4">
          <div className="border-2 border-dashed border-violet-200 rounded-xl p-8 text-center">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              id="csv-upload"
            />
            <label
              htmlFor="csv-upload"
              className="cursor-pointer flex flex-col items-center gap-3"
            >
              <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center">
                <Upload className="w-8 h-8 text-violet-500" />
              </div>
              <div>
                <p className="font-medium text-slate-700">
                  {csvFile ? csvFile.name : "Drop your CSV file here"}
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  or click to browse
                </p>
              </div>
            </label>
          </div>
        </TabsContent>
      </Tabs>

      <Button onClick={handleSubmit} className="w-full">
        Apply Data
      </Button>
    </div>
  );
}

