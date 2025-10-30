import { fetchPresentations } from "@/app/_actions/presentation/fetchPresentations";
import { Button } from "@/components/ui/button";
import { usePresentationState } from "@/states/presentation-state";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Shuffle } from "lucide-react";
import { useState } from "react";

export const EXAMPLE_PROMPTS = [
  {
    id: "ai-future",
    icon: "⚡",
    title: "The Future of Artificial Intelligence in Engineering",
    slides: 5,
    lang: "en-US",
    style: "professional",
    color: { background: "rgba(168, 85, 247, 0.1)", color: "#A855F7" },
  },
  {
    id: "sustainable-materials",
    icon: "🌍",
    title: "Sustainable Materials for Construction Projects",
    slides: 5,
    lang: "en-US",
    style: "traditional",
    color: { background: "rgba(239, 68, 68, 0.1)", color: "#EF4444" },
  },
  {
    id: "project-management",
    icon: "🎯",
    title: "Best Practices for Project Management in Engineering",
    slides: 5,
    lang: "en-US",
    style: "default",
    color: { background: "rgba(6, 182, 212, 0.1)", color: "#06B6D4" },
  },
  {
    id: "robotics",
    icon: "🤖",
    title: "Advancements in Robotics and Automation",
    slides: 5,
    lang: "en-US",
    style: "professional",
    color: { background: "rgba(239, 68, 68, 0.1)", color: "#EF4444" },
  },
  {
    id: "renewable-energy",
    icon: "🌱",
    title: "Innovations in Renewable Energy Technology",
    slides: 5,
    lang: "en-US",
    style: "default",
    color: { background: "rgba(34, 197, 94, 0.1)", color: "#22C55E" },
  },
  {
    id: "cybersecurity",
    icon: "🔒",
    title: "Cybersecurity Challenges in Engineering Systems",
    slides: 5,
    lang: "en-US",
    style: "professional",
    color: { background: "rgba(59, 130, 246, 0.1)", color: "#3B82F6" },
  },
  {
    id: "smart-cities",
    icon: "🌆",
    title: "Smart Cities: The Future of Urban Development",
    slides: 5,
    lang: "en-US",
    style: "traditional",
    color: { background: "rgba(99, 102, 241, 0.1)", color: "#6366F1" },
  },
  {
    id: "quantum-computing",
    icon: "⚛️",
    title: "Quantum Computing in Engineering Applications",
    slides: 5,
    lang: "en-US",
    style: "professional",
    color: { background: "rgba(139, 92, 246, 0.1)", color: "#8B5CF6" },
  },
  {
    id: "biotech",
    icon: "🧬",
    title: "Biotechnology Innovations in Engineering",
    slides: 5,
    lang: "en-US",
    style: "default",
    color: { background: "rgba(16, 185, 129, 0.1)", color: "#10B981" },
  },
  {
    id: "space-tech",
    icon: "🚀",
    title: "Space Technology and Engineering Challenges",
    slides: 5,
    lang: "en-US",
    style: "traditional",
    color: { background: "rgba(249, 115, 22, 0.1)", color: "#F97316" },
  },
  {
    id: "digital-twins",
    icon: "👥",
    title: "Digital Twins in Modern Engineering",
    slides: 5,
    lang: "en-US",
    style: "professional",
    color: { background: "rgba(236, 72, 153, 0.1)", color: "#EC4899" },
  },
  {
    id: "materials-science",
    icon: "⚗️",
    title: "Advanced Materials Science Breakthroughs",
    slides: 5,
    lang: "en-US",
    style: "default",
    color: { background: "rgba(234, 179, 8, 0.1)", color: "#EAB308" },
  },
  {
    id: "iot-engineering",
    icon: "📱",
    title: "IoT Applications in Engineering",
    slides: 5,
    lang: "en-US",
    style: "traditional",
    color: { background: "rgba(20, 184, 166, 0.1)", color: "#14B8A6" },
  },
  {
    id: "green-engineering",
    icon: "♻️",
    title: "Green Engineering Solutions",
    slides: 5,
    lang: "en-US",
    style: "professional",
    color: { background: "rgba(132, 204, 22, 0.1)", color: "#84CC16" },
  },
  {
    id: "vr-engineering",
    icon: "🥽",
    title: "VR and AR in Engineering Design",
    slides: 5,
    lang: "en-US",
    style: "traditional",
    color: { background: "rgba(217, 70, 239, 0.1)", color: "#D946EF" },
  },
  {
    id: "machine-learning",
    icon: "🧠",
    title: "Machine Learning for Engineering Optimization",
    slides: 5,
    lang: "en-US",
    style: "default",
    color: { background: "rgba(244, 63, 94, 0.1)", color: "#F43F5E" },
  },
];

export function PresentationExamples({ isModal = false, onExampleSelect }: { isModal?: boolean; onExampleSelect?: () => void } = {}) {
  const [examples, setExamples] = useState(EXAMPLE_PROMPTS.slice(0, 6));
  const { setNumSlides, setLanguage, setPageStyle, setPresentationInput } =
    usePresentationState();

  // Use useQuery to subscribe to the same data as RecentPresentations
  const { data, isLoading: isPresentationsLoading } = useInfiniteQuery({
    queryKey: ["presentations-all"],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await fetchPresentations(pageParam);
      return response;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage?.hasMore ? 0 : 0),
  });

  // Check if there are any actual presentations in the data
  const presentationsPages = data?.pages;
  const hasPresentations = !!presentationsPages?.[0]?.items?.length;

  // Don't show examples if presentations are still loading OR if there are presentations (only in dashboard mode)
  if (!isModal && (isPresentationsLoading || hasPresentations)) return null;

  const handleExampleClick = (example: (typeof EXAMPLE_PROMPTS)[0]) => {
    setPresentationInput(example.title);
    setNumSlides(example.slides);
    setLanguage(example.lang);
    setPageStyle(example.style);
    if (onExampleSelect) {
      onExampleSelect();
    }
  };

  const handleShuffle = () => {
    const shuffled = [...EXAMPLE_PROMPTS]
      .sort(() => Math.random() - 0.5)
      .slice(0, 6);
    setExamples(shuffled);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Try these examples
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleShuffle}
          className="gap-2"
        >
          <Shuffle className="h-4 w-4" />
          Shuffle
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {examples.map((example) => (
          <button
            key={example.id}
            onClick={() => handleExampleClick(example)}
            className="group flex items-center gap-3 rounded-lg border bg-card p-4 text-left transition-all hover:border-primary hover:bg-accent hover:shadow-sm"
          >
            <div
              className="rounded-lg p-2"
              style={{
                background: example.color.background,
                color: example.color.color,
              }}
            >
              <span className="text-lg">{example.icon}</span>
            </div>
            <span className="line-clamp-2 flex-1 text-sm font-medium text-card-foreground group-hover:text-accent-foreground">
              {example.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
