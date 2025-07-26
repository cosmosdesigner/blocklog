import React, { useMemo, useState, useRef } from "react";
import { Block } from "../../types";
import {
  calculateDuration,
  formatDuration,
  convertTotalHoursToDuration,
  isValidBlockArray,
} from "../lib/utils";
import { StatCard } from "./StatCard";
import { BlockChart } from "./BlockChart";
import { Button } from "./Button";
import { YearView } from "./YearView";

interface DashboardProps {
  blocks: Block[];
  onViewBlockDetails: (block: Block | null) => void;
  onImport: (blocks: Block[]) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  blocks,
  onViewBlockDetails,
  onImport,
}) => {
  const [viewMode, setViewMode] = useState<"chart" | "year">("chart");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stats = useMemo(() => {
    const totalBlocks = blocks.length;
    const ongoingBlocks = blocks.filter((b) => !b.resolved).length;

    const totalBlockedHours = blocks.reduce((acc, block) => {
      return acc + calculateDuration(block.created, block.resolved).totalHours;
    }, 0);

    const totalDurationParts = convertTotalHoursToDuration(totalBlockedHours);
    const formattedTotalDuration = formatDuration(totalDurationParts);

    const longestBlockObject =
      blocks.length > 0
        ? blocks.reduce((maxBlock, currentBlock) => {
            const maxDuration = calculateDuration(
              maxBlock.created,
              maxBlock.resolved
            ).totalHours;
            const currentDuration = calculateDuration(
              currentBlock.created,
              currentBlock.resolved
            ).totalHours;
            return currentDuration > maxDuration ? currentBlock : maxBlock;
          }, blocks[0])
        : null;

    const longestBlockDurationHours = longestBlockObject
      ? calculateDuration(
          longestBlockObject.created,
          longestBlockObject.resolved
        ).totalHours
      : 0;
    const longestBlockParts = convertTotalHoursToDuration(
      longestBlockDurationHours
    );
    const formattedLongestBlock = formatDuration(longestBlockParts);

    return {
      totalBlocks,
      ongoingBlocks,
      totalBlockedDuration: formattedTotalDuration,
      longestBlock: formattedLongestBlock,
      longestBlockObject,
    };
  }, [blocks]);

  const handleExport = () => {
    if (blocks.length === 0) {
      alert("No blocks to export.");
      return;
    }
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(blocks, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `blocklog_backup_${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== "string")
          throw new Error("File could not be read.");
        const data = JSON.parse(text);

        if (!isValidBlockArray(data)) {
          throw new Error(
            "Invalid file format. The file does not contain valid block data."
          );
        }

        const confirmed = window.confirm(
          "Are you sure you want to import this data? This will overwrite all your current blocks."
        );

        if (confirmed) {
          onImport(data);
          alert("Data imported successfully!");
        }
      } catch (error) {
        console.error("Import failed:", error);
        alert(
          `Import failed: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };
    reader.onerror = () => {
      alert("Error reading file.");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };
    reader.readAsText(file);
  };

  return (
    <section className="mb-8">
      <h2 className="text-3xl font-bold text-white mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Blocks" value={stats.totalBlocks} />
        <StatCard title="Ongoing Blocks" value={stats.ongoingBlocks} />
        <StatCard
          title="Total Time Blocked"
          value={stats.totalBlockedDuration}
        />
        <StatCard
          title="Longest Block"
          value={stats.longestBlock}
          onClick={
            stats.longestBlockObject
              ? () => onViewBlockDetails(stats.longestBlockObject)
              : undefined
          }
        />
      </div>

      <div className="bg-slate-800 p-4 sm:p-6 rounded-lg shadow-lg border border-slate-700 mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">
          Data Management
        </h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={handleExport} size="sm">
            Export All Data
          </Button>
          <Button onClick={handleImportClick} variant="secondary" size="sm">
            Import from Backup
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
            accept=".json"
          />
        </div>
      </div>

      <div className="bg-slate-800 p-4 sm:p-6 rounded-lg shadow-lg border border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">
            {viewMode === "chart"
              ? "Total Blocked Hours per Month"
              : "Yearly Block Overview"}
          </h3>
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              setViewMode((prev) => (prev === "chart" ? "year" : "chart"))
            }
          >
            {viewMode === "chart" ? "View Year View" : "View Chart View"}
          </Button>
        </div>

        {viewMode === "chart" ? (
          <BlockChart blocks={blocks} />
        ) : (
          <YearView blocks={blocks} />
        )}
      </div>
    </section>
  );
};
