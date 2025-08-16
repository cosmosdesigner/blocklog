import React, { useMemo, useState, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { GoogleGenAI } from "@google/genai";
import { Brain, Loader2 } from "lucide-react";

import { Button } from "../../Button";
import { calculateDuration } from "@/src/lib/utils";
import { Block } from "@/types";

const COLORS = ["#0ea5e9", "#6366f1", "#ec4899", "#f97316", "#10b981"];

interface TagAnalysisWidgetProps {
  blocks: Block[];
}

export const TagAnalysisWidget: React.FC<TagAnalysisWidgetProps> = ({
  blocks,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  const tagDurations = useMemo(() => {
    const durations: {
      [tagTitle: string]: { duration: number; color?: string };
    } = {};

    blocks.forEach((block) => {
      const durationHours = calculateDuration(
        block.created,
        block.resolved
      ).totalHours;

      if (durationHours > 0) {
        (block.tags || []).forEach((tag) => {
          if (!durations[tag.title]) {
            durations[tag.title] = { duration: 0, color: tag.color };
          }

          durations[tag.title].duration += durationHours;

          if (!durations[tag.title].color && tag.color) {
            durations[tag.title].color = tag.color;
          }
        });
      }
    });

    return Object.entries(durations)
      .map(([name, { duration, color }]) => ({
        name,
        duration: Math.round(duration),
        color,
      }))
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 5);
  }, [blocks]);

  const handleAnalyze = useCallback(async () => {
    if (tagDurations.length === 0) {
      setError("Not enough tagged block data to analyze.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuggestion(null);

    const dataSummary = tagDurations
      .map((item) => `- Tag '${item.name}': ${item.duration} hours`)
      .join("\n");

    const prompt = `You are a senior productivity consultant analyzing a user's project blockers. Based on the following data, which shows the total hours blocked by different tags, identify the single most significant area of friction. Then, provide one concise, actionable suggestion for improvement to address this specific issue.

Your analysis should be direct and helpful. Format your response as a single paragraph.

Data:
${dataSummary}`;

    try {
      const ai = new GoogleGenAI({
        apiKey: import.meta.env.VITE_API_KEY,
      });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      setSuggestion(response.text!);
    } catch (e) {
      console.error(e);
      setError("Failed to get suggestion from AI. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [tagDurations]);

  if (blocks.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-800 p-4 sm:p-6 rounded-lg shadow-lg border border-slate-700 mt-8">
      <h3 className="text-xl font-semibold text-white mb-4">Analysis by Tag</h3>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Chart Section */}
        <div className="md:col-span-3 min-h-[250px]">
          {tagDurations.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={tagDurations}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis
                  type="number"
                  stroke="#94a3b8"
                  domain={[0, "dataMax + 10"]}
                  unit="h"
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#94a3b8"
                  width={80}
                  tick={{ fontSize: 12, fill: "#cbd5e1" }}
                  interval={0}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    borderColor: "#334155",
                    color: "#f1f5f9",
                    borderRadius: "0.5rem",
                  }}
                  cursor={{ fill: "#334155" }}
                  formatter={(value: number) => `${value}h`}
                  labelStyle={{ color: "#f1f5f9", fontWeight: "bold" }}
                />
                <Bar
                  dataKey="duration"
                  name="Total Hours Blocked"
                  radius={[0, 4, 4, 0]}
                >
                  {tagDurations.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 rounded-lg bg-slate-900/30">
              <p className="text-center p-4">
                Add tags to your blocks to see analysis here.
              </p>
            </div>
          )}
        </div>

        {/* AI Analysis Section */}
        <div className="md:col-span-2 flex flex-col justify-start items-start p-4 bg-slate-900/50 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Brain size={16} />
            <h4 className="text-lg font-semibold text-white">
              AI-Powered Insight
            </h4>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center w-full flex-grow text-slate-400">
              <Loader2 className="animate-spin h-5 w-5 text-white" />
              <p className="mt-2 text-sm">Analyzing...</p>
            </div>
          )}

          {!loading && suggestion && (
            <div className="text-slate-300 space-y-4 w-full">
              <p className="text-sm leading-relaxed">{suggestion}</p>
              <Button variant="secondary" size="sm" onClick={handleAnalyze}>
                Re-analyze
              </Button>
            </div>
          )}

          {!loading && !suggestion && (
            <div className="w-full">
              <p className="text-slate-400 mb-4 text-sm">
                Discover the most significant friction point in your workflow.
              </p>
              <Button
                onClick={handleAnalyze}
                disabled={tagDurations.length === 0}
                size="sm"
              >
                Generate Insight
              </Button>
              {tagDurations.length === 0 && (
                <p className="text-xs text-slate-500 mt-2">
                  Add tags to blocks to enable.
                </p>
              )}
            </div>
          )}

          {error && !loading && (
            <p className="text-red-400 text-sm mt-2">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
};
