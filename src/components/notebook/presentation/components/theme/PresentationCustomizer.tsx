"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePresentationState } from "@/states/presentation-state";
import { List } from "lucide-react";

export function PresentationCustomizer() {
  const {
    textContent,
    setTextContent,
    tone,
    setTone,
    audience,
    setAudience,
    scenario,
    setScenario,
  } = usePresentationState();

  const contentOptions = [
    { id: "minimal", label: "Minimal", lines: 2 },
    { id: "concise", label: "Concise", lines: 3 },
    { id: "detailed", label: "Detailed", lines: 3 },
    { id: "extensive", label: "Extensive", lines: 3 },
  ] as const;

  const toneOptions = [
    { id: "auto", label: "Auto" },
    { id: "general", label: "General" },
    { id: "persuasive", label: "Persuasive" },
    { id: "inspiring", label: "Inspiring" },
    { id: "instructive", label: "Instructive" },
    { id: "engaging", label: "Engaging" },
  ] as const;

  const audienceOptions = [
    { id: "auto", label: "Auto" },
    { id: "general", label: "General" },
    { id: "business", label: "Business" },
    { id: "investor", label: "Investor" },
    { id: "teacher", label: "Teacher" },
    { id: "student", label: "Student" },
  ] as const;

  const scenarioOptions = [
    { id: "auto", label: "Auto" },
    { id: "general", label: "General" },
    { id: "analysis-report", label: "Analysis Report" },
    { id: "teaching-training", label: "Teaching" },
    { id: "promotional-materials", label: "Promotional" },
    { id: "public-speeches", label: "Public Speeches" },
  ] as const;

  return (
    <div className="space-y-4 rounded-xl border bg-muted/40">
      {/* Text Content Section */}
      <div className="border-0 p-6 shadow-xs">
        <div className="mb-4 flex items-center gap-2">
          <List className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">
            Text Content
          </h2>
        </div>

        <p className="mb-4 text-sm text-muted-foreground">
          Amount of text per card
        </p>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {contentOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setTextContent(option.id)}
              className={`flex flex-col items-center gap-3 rounded-lg border-2 p-4 transition-all ${
                textContent === option.id
                  ? "border-primary bg-primary/10"
                  : "border-border bg-background hover:border-accent"
              }`}
            >
              <div className="flex h-12 w-full flex-col items-center justify-center gap-1">
                {Array.from({ length: option.lines }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full ${textContent === option.id ? "bg-primary" : "bg-muted-foreground"}`}
                    style={{
                      width: i === option.lines - 1 ? "60%" : "80%",
                    }}
                  />
                ))}
              </div>
              <span
                className={`text-sm font-medium ${textContent === option.id ? "text-primary" : "text-foreground"}`}
              >
                {option.label}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Tone Select */}
          <div>
            <label className="mb-3 block text-sm font-medium text-foreground">
              Tone
            </label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger>
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                {toneOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Audience Select */}
          <div>
            <label className="mb-3 block text-sm font-medium text-foreground">
              Audience
            </label>
            <Select value={audience} onValueChange={setAudience}>
              <SelectTrigger>
                <SelectValue placeholder="Select audience" />
              </SelectTrigger>
              <SelectContent>
                {audienceOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Scenario Select */}
          <div>
            <label className="mb-3 block text-sm font-medium text-foreground">
              Scenario
            </label>
            <Select value={scenario} onValueChange={setScenario}>
              <SelectTrigger>
                <SelectValue placeholder="Select scenario" />
              </SelectTrigger>
              <SelectContent>
                {scenarioOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
