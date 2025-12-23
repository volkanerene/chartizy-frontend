"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { chartsApi, aiApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoadingAnimation } from "@/components/LoadingAnimation";
import { cn } from "@/lib/utils";

interface FileWithData {
  file: File;
  extractedData: { labels: string[]; values: number[] } | null;
  charts: Array<{ id: string; config: any }> | null;
  error: string | null;
}

export default function BulkUploadPage() {
  const router = useRouter();
  const { user, token, incrementChartCount } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileWithData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingIndex, setProcessingIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length === 0) return;

    const newFiles: FileWithData[] = selectedFiles.map(file => ({
      file,
      extractedData: null,
      charts: null,
      error: null,
    }));

    setFiles([...files, ...newFiles]);
    setError(null);
  };

  const extractDataFromFile = async (file: File): Promise<{ labels: string[]; values: number[] } | null> => {
    try {
      const fileType = file.name.split('.').pop()?.toLowerCase();
      
      if (fileType === 'csv') {
        const text = await file.text();
        const lines = text.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim());
        const data: { labels: string[]; values: number[] } = { labels: [], values: [] };
        
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim());
          if (values.length >= 2) {
            data.labels.push(values[0]);
            const numValue = parseFloat(values[1]);
            data.values.push(isNaN(numValue) ? 0 : numValue);
          }
        }
        
        return data.labels.length > 0 ? data : null;
      } else if (fileType === 'json') {
        const text = await file.text();
        const json = JSON.parse(text);
        
        // Try to extract data from various JSON structures
        if (Array.isArray(json)) {
          const labels: string[] = [];
          const values: number[] = [];
          json.forEach((item, i) => {
            if (typeof item === 'object') {
              const keys = Object.keys(item);
              if (keys.length >= 2) {
                labels.push(String(item[keys[0]] || `Item ${i + 1}`));
                const val = parseFloat(String(item[keys[1]] || 0));
                values.push(isNaN(val) ? 0 : val);
              }
            }
          });
          return labels.length > 0 ? { labels, values } : null;
        }
      } else if (fileType === 'pdf' || fileType === 'xlsx' || fileType === 'xls') {
        // For PDF and Excel, use AI to extract data
        const text = await file.text().catch(() => '');
        if (text) {
          const prompt = `Extract numerical data from this ${fileType.toUpperCase()} file content. Return labels and values in JSON format: {"labels": ["label1", "label2"], "values": [value1, value2]}. Content: ${text.substring(0, 5000)}`;
          const aiResult = await aiApi.analyzePrompt(prompt, token || undefined);
          if (aiResult.success && aiResult.labels.length > 0) {
            return { labels: aiResult.labels, values: aiResult.values };
          }
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error extracting data:", error);
      return null;
    }
  };

  const generateChartsFromData = async (data: { labels: string[]; values: number[] }, fileIndex: number) => {
    if (!user || !token) return [];

    try {
      // Generate multiple chart types from the same data
      const chartTypes = ['bar', 'line', 'pie'];
      const charts = [];

      for (const chartType of chartTypes) {
        try {
          const result = await chartsApi.generate(
            {
              user_id: user.id,
              template_id: '', // No template for bulk
              data: {
                labels: data.labels,
                values: data.values,
                chart_type: chartType,
              },
              chart_type: chartType,
            },
            token
          );

          if (result.id) {
            charts.push({
              id: result.id,
              config: result.chart_config,
            });
          }
        } catch (error) {
          console.error(`Error generating ${chartType} chart:`, error);
        }
      }

      return charts;
    } catch (error) {
      console.error("Error generating charts:", error);
      return [];
    }
  };

  const processFiles = async () => {
    if (files.length === 0 || !user || !token) return;

    setIsProcessing(true);
    setError(null);

    for (let i = 0; i < files.length; i++) {
      setProcessingIndex(i);
      const fileData = files[i];

      try {
        // Extract data from file
        const extractedData = await extractDataFromFile(fileData.file);
        
        if (!extractedData || extractedData.labels.length === 0) {
          setFiles(prev => prev.map((f, idx) => 
            idx === i ? { ...f, error: "Could not extract data from file" } : f
          ));
          continue;
        }

        // Generate charts
        const charts = await generateChartsFromData(extractedData, i);
        
        setFiles(prev => prev.map((f, idx) => 
          idx === i ? { ...f, extractedData, charts } : f
        ));

        // Increment chart count
        if (charts.length > 0) {
          incrementChartCount(charts.length);
        }
      } catch (error) {
        console.error(`Error processing file ${i}:`, error);
        setFiles(prev => prev.map((f, idx) => 
          idx === i ? { ...f, error: error instanceof Error ? error.message : "Processing failed" } : f
        ));
      }
    }

    setIsProcessing(false);
    setProcessingIndex(null);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const viewChart = (chartId: string) => {
    router.push(`/dashboard/results/${chartId}`);
  };

  return (
    <motion.div
      className="min-h-screen px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-[#165DFC] to-[#8EC6FF] bg-clip-text text-transparent">
            Bulk Upload
          </h1>
          <p className="text-gray-500 text-xl">
            Process multiple files at once
          </p>
        </motion.div>

        {/* Upload Zone */}
        <motion.div
          className="mb-12 bg-white/50 backdrop-blur-xl rounded-3xl p-16 border-2 border-dashed border-gray-300 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".csv,.json,.pdf,.xlsx,.xls"
            onChange={handleFileSelect}
            className="hidden"
          />
          <h3 className="text-3xl font-bold mb-4">Drop Files Here</h3>
          <p className="text-gray-600 mb-8">
            CSV, Excel, JSON, or PDF files supported
          </p>
          <motion.button
            onClick={() => fileInputRef.current?.click()}
            className="px-8 py-4 bg-gradient-to-r from-[#165DFC] to-[#8EC6FF] text-white rounded-full font-bold shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Choose Files
          </motion.button>
        </motion.div>

        {/* Files List */}
        {files.length > 0 && (
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {files.length} file{files.length !== 1 ? 's' : ''} selected
              </span>
              <motion.button
                onClick={processFiles}
                disabled={isProcessing}
                className={`px-8 py-4 rounded-full font-bold text-white ${
                  !isProcessing
                    ? "bg-gradient-to-r from-[#165DFC] to-[#8EC6FF] shadow-xl"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
                whileHover={!isProcessing ? { scale: 1.05 } : {}}
              >
                {isProcessing ? "Processing..." : "Process All Files"}
              </motion.button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {files.map((fileData, index) => {
            const progress = fileData.charts ? 100 : processingIndex === index ? 50 : fileData.error ? 0 : 0;
            return (
              <motion.div
                key={index}
                className="bg-white/50 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="font-bold text-lg">{fileData.file.name}</h4>
                    <p className="text-sm text-gray-500 capitalize">
                      {fileData.error ? "error" : fileData.charts ? "completed" : processingIndex === index ? "processing" : "pending"}
                    </p>
                  </div>
                  {fileData.charts && fileData.charts.length > 0 && (
                    <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                      {fileData.charts.length} Charts Created
                    </span>
                  )}
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#165DFC] to-[#8EC6FF]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
                {fileData.charts && (
                  <div className="flex gap-2 mt-4">
                    {fileData.charts.map((chart) => (
                      <motion.button
                        key={chart.id}
                        onClick={() => viewChart(chart.id)}
                        className="px-4 py-2 bg-white/70 rounded-full text-sm font-semibold border border-white/20"
                        whileHover={{ scale: 1.05 }}
                      >
                        View Chart
                      </motion.button>
                    ))}
                  </div>
                )}
                {fileData.error && (
                  <div className="mt-2 text-sm text-red-600">{fileData.error}</div>
                )}
                {processingIndex === index && (
                  <div className="mt-2">
                    <LoadingAnimation text="Processing..." />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-red-50 border-2 border-red-200 text-red-700 mt-6"
          >
            {error}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
