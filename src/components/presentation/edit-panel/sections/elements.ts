"use client";
import { ColumnItemPlugin, ColumnPlugin } from "@platejs/layout/react";
import { KEYS, type TElement, type TText } from "platejs";

import {
  AREA_CHART_ELEMENT,
  ARROW_LIST,
  ARROW_LIST_ITEM,
  BAR_CHART_ELEMENT,
  BEFORE_AFTER_GROUP,
  BOX_GROUP,
  BOX_ITEM,
  BOX_PLOT_CHART_ELEMENT,
  BUBBLE_CHART_ELEMENT,
  BULLET_GROUP,
  BULLET_ITEM,
  BUTTON_ELEMENT,
  CANDLESTICK_CHART_ELEMENT,
  CHORD_CHART_ELEMENT,
  COMPARE_GROUP,
  COMPARE_SIDE,
  COMPOSED_CHART_ELEMENT,
  CONE_FUNNEL_CHART_ELEMENT,
  CONS_ITEM,
  CYCLE_GROUP,
  CYCLE_ITEM,
  DONUT_CHART_ELEMENT,
  FUNNEL_CHART_ELEMENT,
  HEATMAP_CHART_ELEMENT,
  HISTOGRAM_CHART_ELEMENT,
  ICON_ELEMENT,
  ICON_LIST,
  ICON_LIST_ITEM,
  LINE_CHART_ELEMENT,
  LINEAR_GAUGE_ELEMENT,
  NIGHTINGALE_CHART_ELEMENT,
  OHLC_CHART_ELEMENT,
  PIE_CHART_ELEMENT,
  PROS_CONS_GROUP,
  PROS_ITEM,
  PYRAMID_CHART_ELEMENT,
  PYRAMID_GROUP,
  PYRAMID_ITEM,
  RADAR_CHART_ELEMENT,
  RADIAL_BAR_CHART_ELEMENT,
  RADIAL_COLUMN_CHART_ELEMENT,
  RADIAL_GAUGE_ELEMENT,
  RANGE_AREA_CHART_ELEMENT,
  RANGE_BAR_CHART_ELEMENT,
  SANKEY_CHART_ELEMENT,
  SCATTER_CHART_ELEMENT,
  SEQUENCE_ARROW_GROUP,
  SEQUENCE_ARROW_ITEM,
  STAIR_ITEM,
  STAIRCASE_GROUP,
  SUNBURST_CHART_ELEMENT,
  TIMELINE_GROUP,
  TIMELINE_ITEM,
  TREEMAP_CHART_ELEMENT,
  WATERFALL_CHART_ELEMENT,
} from "@/components/notebook/presentation/editor/lib";
import { type PlateSlide } from "@/components/notebook/presentation/utils/parser";

export type PaletteItem = {
  key: string;
  label: string;
  node: TElement;
};

export const slideWith = (nodes: TElement[]): PlateSlide => ({
  id: Math.random().toString(36).slice(2),
  content: nodes,
  alignment: "start",
  width: "M",
});
const text = (value: string): TText => ({ text: value }) as const;

const paragraph = (children: Array<TElement | TText> = [text("")]): TElement =>
  ({ type: KEYS.p, children }) as unknown as TElement;

const h3 = (content: string): TElement =>
  ({ type: "h3", children: [text(content)] }) as unknown as TElement;

const h4 = (content: string): TElement =>
  ({ type: "h4", children: [text(content)] }) as unknown as TElement;

const codeBlock = (code: string, language = "tsx"): TElement => {
  const lines = code
    .split("\n")
    .map((l) => ({ type: KEYS.codeLine, children: [text(l)] }));
  return {
    type: KEYS.codeBlock,
    lang: language,
    children: lines as unknown as TElement["children"],
  } as unknown as TElement;
};

const callout = (icon: string, bg: string, content: string): TElement =>
  ({
    type: KEYS.callout,
    icon,
    backgroundColor: bg,
    children: [paragraph([text(content)])],
  }) as unknown as TElement;

const table = (headers: string[], rows: string[][]): TElement =>
  ({
    type: KEYS.table,
    children: [
      {
        type: KEYS.tr,
        children: headers.map((h) => ({
          type: KEYS.td,
          header: true,
          children: [paragraph([text(h)])],
        })),
      },
      ...rows.map((r) => ({
        type: KEYS.tr,
        children: r.map((c) => ({
          type: KEYS.td,
          children: [paragraph([text(c)])],
        })),
      })),
    ],
  }) as unknown as TElement;

const columns = (cols: Array<{ title: string; body: string[] }>): TElement =>
  ({
    type: ColumnPlugin.key,
    children: cols.map((c) => ({
      type: ColumnItemPlugin.key,
      width: "M",
      children: [h3(c.title), ...c.body.map((b) => paragraph([text(b)]))],
    })),
  }) as unknown as TElement;

const simple = {
  hr: (): TElement =>
    ({ type: KEYS.hr, children: [{ text: "" }] }) as unknown as TElement,
  toc: (): TElement =>
    ({ type: KEYS.toc, children: [{ text: "" }] }) as unknown as TElement,
  blockquote: (content: string): TElement =>
    ({
      type: KEYS.blockquote,
      children: [paragraph([text(content)])],
    }) as unknown as TElement,
};

// ============================================================================
// HELPER FUNCTIONS - List & Group Builders
// ============================================================================

const createList = (
  type: string,
  itemType: string,
  items: Array<{ heading?: string; content: string }>,
): TElement =>
  ({
    type,
    ...(type === BULLET_GROUP && { columnSize: "md" }), // Add default columnSize for bullet groups
    children: items.map((item) => ({
      type: itemType,
      children: item.heading
        ? [h4(item.heading), paragraph([text(item.content)])]
        : [paragraph([text(item.content)])],
    })),
  }) as unknown as TElement;

const createIconListItem = (iconName: string, content: string) => ({
  type: ICON_LIST_ITEM,
  icon: iconName,
  children: [paragraph([text(content)])],
});

const createBoxItem = (title: string, content: string) => ({
  type: BOX_ITEM,
  children: [h3(title), paragraph([text(content)])],
});

const createCompareSide = (title: string, items: string[]) => ({
  type: COMPARE_SIDE,
  children: [h3(title), ...items.map((item) => paragraph([text(item)]))],
});

// ============================================================================
// CHART BUILDERS
// ============================================================================

// Helper to create a chart node with disableAnimation
const createChartNode = (
  type: string,
  data: unknown,
  options?: Record<string, unknown>,
): TElement =>
  ({
    type,
    data,
    disableAnimation: false,
    ...options,
    children: [{ text: "" }],
  }) as unknown as TElement;

export const chartItems: PaletteItem[] = [
  {
    key: "chart-pie",
    label: "Pie Chart",
    node: createChartNode(PIE_CHART_ELEMENT, [
      { label: "Enterprise", value: 42 },
      { label: "Small Business", value: 28 },
      { label: "Mid-Market", value: 18 },
      { label: "Consumer", value: 8 },
      { label: "Government", value: 4 },
    ]),
  },
  // Donut Chart - dedicated donut type
  {
    key: "chart-donut",
    label: "Donut Chart",
    node: createChartNode(DONUT_CHART_ELEMENT, [
      { label: "Completed", value: 65 },
      { label: "In Progress", value: 20 },
      { label: "Pending", value: 10 },
      { label: "Cancelled", value: 5 },
    ]),
  },
  // Bar Chart - with more data points
  {
    key: "chart-bar",
    label: "Bar Chart",
    node: createChartNode(BAR_CHART_ELEMENT, [
      { label: "Q1 2023", value: 320 },
      { label: "Q2 2023", value: 410 },
      { label: "Q3 2023", value: 570 },
      { label: "Q4 2023", value: 680 },
      { label: "Q1 2024", value: 720 },
      { label: "Q2 2024", value: 850 },
      { label: "Q3 2024", value: 920 },
      { label: "Q4 2024", value: 1050 },
    ]),
  },
  // Line Chart - with more data points
  {
    key: "chart-line",
    label: "Line Chart",
    node: createChartNode(LINE_CHART_ELEMENT, [
      { name: "Jan", value: 120 },
      { name: "Feb", value: 190 },
      { name: "Mar", value: 170 },
      { name: "Apr", value: 230 },
      { name: "May", value: 290 },
      { name: "Jun", value: 310 },
      { name: "Jul", value: 280 },
      { name: "Aug", value: 350 },
      { name: "Sep", value: 420 },
      { name: "Oct", value: 390 },
      { name: "Nov", value: 450 },
      { name: "Dec", value: 520 },
    ]),
  },
  // Area Chart - with gradient fill
  {
    key: "chart-area",
    label: "Area Chart",
    node: createChartNode(AREA_CHART_ELEMENT, [
      { name: "Week 1", value: 1200 },
      { name: "Week 2", value: 1900 },
      { name: "Week 3", value: 1700 },
      { name: "Week 4", value: 2300 },
      { name: "Week 5", value: 2900 },
      { name: "Week 6", value: 3100 },
      { name: "Week 7", value: 2800 },
      { name: "Week 8", value: 3500 },
    ]),
  },
  // Scatter Chart - with X/Y coordinates
  {
    key: "chart-scatter",
    label: "Scatter Chart",
    node: createChartNode(SCATTER_CHART_ELEMENT, [
      { x: 10, y: 30 },
      { x: 25, y: 45 },
      { x: 35, y: 20 },
      { x: 45, y: 55 },
      { x: 55, y: 40 },
      { x: 65, y: 70 },
      { x: 75, y: 50 },
      { x: 85, y: 85 },
      { x: 95, y: 60 },
      { x: 40, y: 35 },
      { x: 60, y: 48 },
      { x: 80, y: 72 },
    ]),
  },
  // Bubble Chart - 3D scatter with z-axis for size
  {
    key: "chart-bubble",
    label: "Bubble Chart",
    node: createChartNode(BUBBLE_CHART_ELEMENT, [
      { x: 10, y: 30, z: 200 },
      { x: 25, y: 45, z: 350 },
      { x: 35, y: 20, z: 150 },
      { x: 45, y: 55, z: 400 },
      { x: 55, y: 40, z: 280 },
      { x: 65, y: 70, z: 520 },
      { x: 75, y: 50, z: 180 },
      { x: 85, y: 85, z: 600 },
    ]),
  },
  // Radar Chart - skills/attributes comparison
  {
    key: "chart-radar",
    label: "Radar Chart",
    node: createChartNode(RADAR_CHART_ELEMENT, [
      { name: "Speed", value: 85 },
      { name: "Reliability", value: 90 },
      { name: "Usability", value: 78 },
      { name: "Performance", value: 92 },
      { name: "Security", value: 88 },
      { name: "Scalability", value: 75 },
    ]),
  },
  // Radial Bar Chart - progress indicators
  {
    key: "chart-radial-bar",
    label: "Radial Bar",
    node: createChartNode(RADIAL_BAR_CHART_ELEMENT, [
      { label: "Marketing", value: 85 },
      { label: "Sales", value: 72 },
      { label: "Engineering", value: 94 },
      { label: "Design", value: 68 },
      { label: "Support", value: 81 },
    ]),
  },
  // Composed Chart - multi-series with bar, line, area
  {
    key: "chart-composed",
    label: "Composed Chart",
    node: createChartNode(COMPOSED_CHART_ELEMENT, [
      { label: "Jan", revenue: 4500, expenses: 3200, profit: 1300 },
      { label: "Feb", revenue: 5200, expenses: 3400, profit: 1800 },
      { label: "Mar", revenue: 4800, expenses: 3100, profit: 1700 },
      { label: "Apr", revenue: 6100, expenses: 3800, profit: 2300 },
      { label: "May", revenue: 5900, expenses: 3500, profit: 2400 },
      { label: "Jun", revenue: 6800, expenses: 4000, profit: 2800 },
    ]),
  },
  // Treemap Chart - hierarchical data
  {
    key: "chart-treemap",
    label: "Treemap",
    node: createChartNode(TREEMAP_CHART_ELEMENT, [
      { label: "North America", value: 45000 },
      { label: "Europe", value: 32000 },
      { label: "Asia Pacific", value: 28000 },
      { label: "Latin America", value: 12000 },
      { label: "Middle East", value: 8000 },
      { label: "Africa", value: 5000 },
    ]),
  },
  // Histogram - frequency distribution
  {
    key: "chart-histogram",
    label: "Histogram",
    node: createChartNode(HISTOGRAM_CHART_ELEMENT, [
      { value: 15 },
      { value: 22 },
      { value: 28 },
      { value: 35 },
      { value: 42 },
      { value: 48 },
      { value: 55 },
      { value: 62 },
      { value: 68 },
      { value: 72 },
      { value: 78 },
      { value: 85 },
      { value: 25 },
      { value: 32 },
      { value: 45 },
      { value: 58 },
    ]),
  },
  // Heatmap - matrix data
  {
    key: "chart-heatmap",
    label: "Heatmap",
    node: createChartNode(HEATMAP_CHART_ELEMENT, [
      { x: "Mon", y: "Morning", value: 75 },
      { x: "Mon", y: "Afternoon", value: 85 },
      { x: "Mon", y: "Evening", value: 45 },
      { x: "Tue", y: "Morning", value: 65 },
      { x: "Tue", y: "Afternoon", value: 92 },
      { x: "Tue", y: "Evening", value: 55 },
      { x: "Wed", y: "Morning", value: 80 },
      { x: "Wed", y: "Afternoon", value: 78 },
      { x: "Wed", y: "Evening", value: 40 },
    ]),
  },
  // Range Bar - value ranges
  {
    key: "chart-range-bar",
    label: "Range Bar",
    node: createChartNode(RANGE_BAR_CHART_ELEMENT, [
      { category: "Project A", low: 10, high: 45 },
      { category: "Project B", low: 20, high: 65 },
      { category: "Project C", low: 15, high: 55 },
      { category: "Project D", low: 30, high: 80 },
      { category: "Project E", low: 5, high: 35 },
    ]),
  },
  // Range Area - area with ranges
  {
    key: "chart-range-area",
    label: "Range Area",
    node: createChartNode(RANGE_AREA_CHART_ELEMENT, [
      { date: "Jan", low: 20, high: 45 },
      { date: "Feb", low: 25, high: 52 },
      { date: "Mar", low: 22, high: 48 },
      { date: "Apr", low: 28, high: 58 },
      { date: "May", low: 32, high: 65 },
      { date: "Jun", low: 35, high: 70 },
    ]),
  },
  // Waterfall - cumulative effects
  {
    key: "chart-waterfall",
    label: "Waterfall",
    node: createChartNode(WATERFALL_CHART_ELEMENT, [
      { category: "Start", amount: 100 },
      { category: "Revenue", amount: 50 },
      { category: "Costs", amount: -30 },
      { category: "Marketing", amount: -15 },
      { category: "Tax", amount: -10 },
      { category: "Net", amount: 95 },
    ]),
  },
  // Box Plot - statistical distribution
  {
    key: "chart-box-plot",
    label: "Box Plot",
    node: createChartNode(BOX_PLOT_CHART_ELEMENT, [
      { category: "Q1", min: 10, q1: 25, median: 35, q3: 48, max: 65 },
      { category: "Q2", min: 15, q1: 30, median: 42, q3: 55, max: 72 },
      { category: "Q3", min: 12, q1: 28, median: 38, q3: 52, max: 68 },
      { category: "Q4", min: 18, q1: 35, median: 48, q3: 62, max: 78 },
    ]),
  },
  // Candlestick - financial OHLC
  {
    key: "chart-candlestick",
    label: "Candlestick",
    node: createChartNode(CANDLESTICK_CHART_ELEMENT, [
      { date: "Mon", open: 100, high: 115, low: 95, close: 110 },
      { date: "Tue", open: 110, high: 125, low: 105, close: 120 },
      { date: "Wed", open: 120, high: 130, low: 112, close: 115 },
      { date: "Thu", open: 115, high: 128, low: 108, close: 125 },
      { date: "Fri", open: 125, high: 140, low: 118, close: 135 },
    ]),
  },
  // OHLC - Open-High-Low-Close
  {
    key: "chart-ohlc",
    label: "OHLC",
    node: createChartNode(OHLC_CHART_ELEMENT, [
      { date: "Week 1", open: 50, high: 58, low: 48, close: 55 },
      { date: "Week 2", open: 55, high: 62, low: 52, close: 60 },
      { date: "Week 3", open: 60, high: 68, low: 55, close: 58 },
      { date: "Week 4", open: 58, high: 72, low: 56, close: 70 },
    ]),
  },
  // Nightingale - rose/wind chart
  {
    key: "chart-nightingale",
    label: "Nightingale",
    node: createChartNode(NIGHTINGALE_CHART_ELEMENT, [
      { label: "North", value: 85 },
      { label: "Northeast", value: 65 },
      { label: "East", value: 45 },
      { label: "Southeast", value: 35 },
      { label: "South", value: 55 },
      { label: "Southwest", value: 75 },
      { label: "West", value: 90 },
      { label: "Northwest", value: 70 },
    ]),
  },
  // Radial Column - circular columns
  {
    key: "chart-radial-column",
    label: "Radial Column",
    node: createChartNode(RADIAL_COLUMN_CHART_ELEMENT, [
      { label: "Jan", value: 45 },
      { label: "Feb", value: 52 },
      { label: "Mar", value: 48 },
      { label: "Apr", value: 61 },
      { label: "May", value: 55 },
      { label: "Jun", value: 67 },
    ]),
  },
  // Sunburst - hierarchical radial
  {
    key: "chart-sunburst",
    label: "Sunburst",
    node: createChartNode(SUNBURST_CHART_ELEMENT, [
      {
        name: "Company",
        children: [
          { name: "Engineering", value: 45 },
          { name: "Sales", value: 30 },
          { name: "Marketing", value: 25 },
        ],
      },
    ]),
  },
  // Sankey - flow visualization
  {
    key: "chart-sankey",
    label: "Sankey",
    node: createChartNode(SANKEY_CHART_ELEMENT, [
      { from: "Website", to: "Signup", size: 100 },
      { from: "Referral", to: "Signup", size: 40 },
      { from: "Signup", to: "Trial", size: 80 },
      { from: "Trial", to: "Paid", size: 50 },
      { from: "Trial", to: "Churn", size: 30 },
    ]),
  },
  // Chord - relationship visualization
  {
    key: "chart-chord",
    label: "Chord",
    node: createChartNode(CHORD_CHART_ELEMENT, [
      { from: "Sales", to: "Marketing", size: 30 },
      { from: "Marketing", to: "Engineering", size: 20 },
      { from: "Engineering", to: "Sales", size: 25 },
      { from: "Sales", to: "Support", size: 15 },
      { from: "Support", to: "Engineering", size: 10 },
    ]),
  },
  // Funnel - pipeline visualization
  {
    key: "chart-funnel",
    label: "Funnel",
    node: createChartNode(FUNNEL_CHART_ELEMENT, [
      { label: "Visitors", value: 10000 },
      { label: "Prospects", value: 5000 },
      { label: "Leads", value: 2500 },
      { label: "Opportunities", value: 1000 },
      { label: "Customers", value: 500 },
    ]),
  },
  // Cone Funnel - funnel variant
  {
    key: "chart-cone-funnel",
    label: "Cone Funnel",
    node: createChartNode(CONE_FUNNEL_CHART_ELEMENT, [
      { label: "Awareness", value: 8000 },
      { label: "Interest", value: 4500 },
      { label: "Consideration", value: 2200 },
      { label: "Intent", value: 1100 },
      { label: "Purchase", value: 600 },
    ]),
  },
  // Pyramid Chart - triangular visualization
  {
    key: "chart-pyramid",
    label: "Pyramid Chart",
    node: createChartNode(PYRAMID_CHART_ELEMENT, [
      { label: "Executive", value: 5 },
      { label: "Management", value: 20 },
      { label: "Specialists", value: 50 },
      { label: "Staff", value: 100 },
    ]),
  },
  // Radial Gauge - circular gauge
  {
    key: "chart-radial-gauge",
    label: "Radial Gauge",
    node: createChartNode(RADIAL_GAUGE_ELEMENT, 75),
  },
  // Linear Gauge - linear gauge
  {
    key: "chart-linear-gauge",
    label: "Linear Gauge",
    node: createChartNode(LINEAR_GAUGE_ELEMENT, 65),
  },
];

export const tableItem: PaletteItem = {
  key: "table",
  label: "Table",
  node: table(
    ["Metric", "Q2 2024", "Q3 2024", "Change", "Target"],
    [
      ["Revenue", "$1.2M", "$1.37M", "+14%", "$1.5M"],
      ["Churn Rate", "2.7%", "2.1%", "-0.6pp", "<2.0%"],
      ["NPS Score", "51", "58", "+7", "60"],
      ["Active Users", "9.4K", "12.0K", "+28%", "15K"],
      ["Uptime", "99.92%", "99.96%", "+0.04pp", "99.9%"],
    ],
  ),
};

export const paletteItems: PaletteItem[] = [
  {
    key: "bullets",
    label: "Bullet Points",
    node: createList(BULLET_GROUP, BULLET_ITEM, [
      {
        heading: "Revenue Growth",
        content:
          "Revenue grew 14% year-over-year to $5.2M, driven by strong enterprise customer expansion and new market penetration",
      },
      {
        heading: "Customer Retention",
        content:
          "Customer churn reduced from 3.2% to 2.1%, achieving our lowest rate ever through improved onboarding and proactive support",
      },
      {
        heading: "Customer Satisfaction",
        content:
          "Net Promoter Score improved from 51 to 58, indicating strong product-market fit and high customer satisfaction",
      },
      {
        heading: "Performance Optimization",
        content:
          "Platform latency decreased 35% through comprehensive infrastructure optimization and edge caching implementation",
      },
    ]),
  },

  // TIMELINE & PROCESS
  {
    key: "timeline",
    label: "Timeline",
    node: createList(TIMELINE_GROUP, TIMELINE_ITEM, [
      {
        heading: "January 2024",
        content:
          "MVP shipped with core editing features, 20 templates, and basic AI suggestions for 100 beta users",
      },
      {
        heading: "March 2024",
        content:
          "Team expansion from 8 to 16 members, adding senior talent in Product Management and Engineering",
      },
      {
        heading: "April 2024",
        content:
          "Beta launch with 500 early adopters providing critical feedback on collaboration features",
      },
      {
        heading: "June 2024",
        content:
          "Analytics v2 released with real-time collaboration insights, usage tracking, and performance dashboards",
      },
    ]),
  },
  {
    key: "arrows",
    label: "Process (Arrows)",
    node: createList(ARROW_LIST, ARROW_LIST_ITEM, [
      {
        heading: "Discover",
        content:
          "Conduct user research, market analysis, and competitive intelligence to identify opportunities",
      },
      {
        heading: "Define",
        content:
          "Create requirements documentation, technical specifications, and establish clear success metrics",
      },
      {
        heading: "Design",
        content:
          "Develop UI/UX prototypes, conduct user testing, and integrate with design system guidelines",
      },
      {
        heading: "Develop",
        content:
          "Execute sprint planning, implement code with automated testing, and maintain continuous integration",
      },
    ]),
  },
  {
    key: "arrow-vertical",
    label: "Vertical Steps",
    node: createList(SEQUENCE_ARROW_GROUP, SEQUENCE_ARROW_ITEM, [
      {
        heading: "Plan",
        content:
          "Stakeholder alignment sessions, resource allocation planning, timeline definition, and comprehensive risk assessment",
      },
      {
        heading: "Build",
        content:
          "Feature development sprints, API integration work, technical documentation creation, and internal dogfooding cycles",
      },
      {
        heading: "Test",
        content:
          "Automated QA testing, performance benchmarking across regions, security audit completion, and beta user validation",
      },
      {
        heading: "Launch",
        content:
          "Phased rollout to user segments, real-time monitoring dashboards, customer communication campaigns, and support team readiness",
      },
    ]),
  },

  // HIERARCHIES
  {
    key: "pyramid",
    label: "Pyramid",
    node: createList(PYRAMID_GROUP, PYRAMID_ITEM, [
      {
        content:
          "Empower every team to create compelling, data-driven presentations 10x faster using AI technology",
      },
      {
        content:
          "Build the world's most intuitive AI-powered presentation platform with best-in-class collaboration",
      },
      {
        content:
          "Focus on enterprise feature expansion, integration ecosystem growth, and strategic global market expansion",
      },
      {
        content:
          "Ship weekly product releases, maintain 99.9% uptime SLA, and achieve sub-100ms response times globally",
      },
    ]),
  },
  {
    key: "staircase",
    label: "Staircase",
    node: createList(STAIRCASE_GROUP, STAIR_ITEM, [
      {
        content:
          "Core editor with 20 templates, 100 beta users, basic AI suggestions, and foundational collaboration features",
      },
      {
        content:
          "100+ professional templates, 1,000 active users, real-time collaboration, and advanced AI content generation",
      },
      {
        content:
          "Enterprise features including SSO and RBAC, 10,000 users, comprehensive API access, custom branding options",
      },
      {
        content:
          "100,000+ users across industries, multi-region deployment, 99.99% SLA, and white-label solutions for partners",
      },
    ]),
  },
  {
    key: "cycle",
    label: "Cycle",
    node: createList(CYCLE_GROUP, CYCLE_ITEM, [
      {
        heading: "Ideate",
        content:
          "Brainstorm innovative solutions, review comprehensive user feedback, and analyze competitor feature landscape",
      },
      {
        heading: "Prototype",
        content:
          "Create high-fidelity mockups, build working proof-of-concepts, and validate technical feasibility with engineering",
      },
      {
        heading: "Build",
        content:
          "Implement features with best practices, write comprehensive tests, conduct thorough code reviews, deploy to staging",
      },
      {
        heading: "Measure",
        content:
          "Track detailed usage metrics, monitor system performance, collect user feedback through surveys, analyze business impact",
      },
      {
        heading: "Learn",
        content:
          "Review results with stakeholders, identify areas for improvement, document key insights, and plan next iteration cycle",
      },
    ]),
  },

  // COMPARISON & EVALUATION
  {
    key: "boxes",
    label: "Feature Boxes",
    node: {
      type: BOX_GROUP,
      children: [
        createBoxItem(
          "Performance",
          "Sub-50ms p95 response times achieved through edge caching, CDN optimization, and deployment across 25+ global regions",
        ),
        createBoxItem(
          "Security",
          "SOC2 Type II compliance in final audit stage, end-to-end encryption, regular penetration testing, and full GDPR compliance",
        ),
        createBoxItem(
          "Reliability",
          "Multi-AZ failover architecture with automated backups every 6 hours, 99.96% historical uptime, and zero data loss guarantee",
        ),
        createBoxItem(
          "User Experience",
          "Intuitive interface with less than 5-minute learning curve, extensive keyboard shortcuts, and seamless real-time collaboration",
        ),
        createBoxItem(
          "Scalability",
          "Horizontally scalable infrastructure supporting 50,000+ concurrent users with automatic load balancing and resource optimization",
        ),
        createBoxItem(
          "Integration",
          "200+ integrations with popular tools including Slack, Microsoft Teams, Google Workspace, Salesforce, and Jira",
        ),
      ],
    } as unknown as TElement,
  },
  {
    key: "compare",
    label: "Comparison",
    node: {
      type: COMPARE_GROUP,
      children: [
        createCompareSide("Build In-House Solution", [
          "Complete architectural control and customization to meet exact business requirements",
          "No vendor lock-in concerns, full data ownership, and independence from third-party roadmaps",
          "Long-term cost efficiency after initial investment, with predictable operating expenses",
          "6-month development timeline requiring 3 additional senior engineers at $500K initial investment",
          "Higher initial risk but enables unique competitive differentiation and strategic advantages",
        ]),
        createCompareSide("Buy Third-Party Platform", [
          "Rapid 2-week deployment timeline enables quick market testing and faster time-to-value",
          "Proven reliability with established track record, dedicated 24/7 support team, and regular updates",
          "Predictable costs of $50K annually with transparent pricing and no hidden fees",
          "Limited customization options may not fit all use cases, potential vendor dependency risks",
          "Scaling limitations at high volume (10,000+ users) may require expensive enterprise tier upgrade",
        ]),
      ],
    } as unknown as TElement,
  },
  {
    key: "before-after",
    label: "Before / After",
    node: {
      type: BEFORE_AFTER_GROUP,
      children: [
        createCompareSide("Legacy System", [
          "Monolithic architecture requiring complete system redeployments for any code change or bug fix",
          "Manual deployment process taking 4+ hours with frequent rollback needs due to integration issues",
          "Average response time of 450ms with frequent timeout issues affecting user experience and productivity",
          "Weekly scheduled maintenance windows causing 2-3 hours of disruptive downtime for all users",
          "Limited scalability to only 500 concurrent users before significant performance degradation occurred",
        ]),
        createCompareSide("Modern Platform", [
          "Microservices architecture enabling independent service deployment without affecting other system components",
          "Automated CI/CD pipelines with 15-minute deploy-to-production cycle and automated rollback capabilities",
          "Average response time of 45ms with 99.9th percentile under 200ms across all geographic regions",
          "Zero-downtime deployments using blue-green strategy with automated health checks and traffic shifting",
          "Horizontally scalable infrastructure supporting 50,000+ concurrent users with intelligent auto-scaling policies",
        ]),
      ],
    } as unknown as TElement,
  },
  {
    key: "pros-cons",
    label: "Pros & Cons",
    node: {
      type: PROS_CONS_GROUP,
      children: [
        {
          type: PROS_ITEM,
          children: [
            paragraph([
              text(
                "Setup completed in just 2 days with excellent onboarding documentation, guided setup wizard, and responsive support team",
              ),
            ]),
          ],
        },
        {
          type: PROS_ITEM,
          children: [
            paragraph([
              text(
                "Comprehensive API documentation with 50+ code examples, interactive tutorials, and sub-2-hour support response times",
              ),
            ]),
          ],
        },
        {
          type: PROS_ITEM,
          children: [
            paragraph([
              text(
                "Vibrant community forum with 10,000+ active members, 200+ pre-built integrations, and monthly educational webinars",
              ),
            ]),
          ],
        },
        {
          type: PROS_ITEM,
          children: [
            paragraph([
              text(
                "Strong performance metrics including 99.95% uptime SLA, sub-100ms global latency, and automatic scaling capabilities",
              ),
            ]),
          ],
        },
        {
          type: CONS_ITEM,
          children: [
            paragraph([
              text(
                "Limited UI customization options with white-labeling only available on expensive enterprise tier at $50K annually",
              ),
            ]),
          ],
        },
        {
          type: CONS_ITEM,
          children: [
            paragraph([
              text(
                "Missing advanced RBAC features, no SCIM provisioning for automated user management, and basic audit logging only",
              ),
            ]),
          ],
        },
        {
          type: CONS_ITEM,
          children: [
            paragraph([
              text(
                "Vendor lock-in concerns due to proprietary data format, limited export options, and migration complexity to alternatives",
              ),
            ]),
          ],
        },
      ],
    } as unknown as TElement,
  },

  // ICONS
  {
    key: "icon",
    label: "Icon",
    node: {
      type: ICON_ELEMENT,
      query: "activity",
      children: [{ text: "" }],
    } as unknown as TElement,
  },
  {
    key: "icon-list",
    label: "Icon List",
    node: {
      type: ICON_LIST,
      children: [
        createIconListItem(
          "activity",
          "User engagement increased 38% quarter-over-quarter with average session duration growing from 12 to 18 minutes",
        ),
        createIconListItem(
          "shield",
          "SOC2 Type II audit completed successfully with zero findings, certification expected in Q1 2025",
        ),
        createIconListItem(
          "bolt",
          "Platform performance optimized to sub-100ms for 95% of user actions through intelligent caching improvements",
        ),
        createIconListItem(
          "users",
          "Team expanded from 24 to 35 talented members across Engineering, Product Management, and Customer Success",
        ),
        createIconListItem(
          "trending-up",
          "Revenue growth accelerated to 14% quarter-over-quarter, reaching $5.2M with robust enterprise pipeline",
        ),
        createIconListItem(
          "globe",
          "Global expansion to 15 new markets with localized content in 8 languages and regional data centers",
        ),
      ],
    } as unknown as TElement,
  },

  // INTERACTIVE & MEDIA
  {
    key: "button",
    label: "CTA Button",
    node: {
      type: BUTTON_ELEMENT,
      variant: "filled",
      size: "md",
      children: [paragraph([text("Apply for Beta Access")])],
    } as unknown as TElement,
  }, // LAYOUT

  {
    key: "image",
    label: "Image",
    node: {
      type: "img",
      url: "",
      query: "",
      children: [],
    } as unknown as TElement,
  },
  {
    key: "columns",
    label: "Columns",
    node: columns([
      {
        title: "Why Now",
        body: [
          "AI democratization is accelerating across industries, making advanced tools accessible to all teams",
          "Remote collaboration has become the default, requiring better async presentation tools",
          "Content velocity demands are increasing as organizations need to produce more high-quality materials faster",
        ],
      },
      {
        title: "Why Us",
        body: [
          "Design excellence with award-winning UI/UX that delights users and reduces learning curves",
          "Infrastructure maturity with proven 99.96% uptime and sub-100ms performance globally",
          "Data platform provides unique insights and analytics that competitors cannot match",
        ],
      },
      {
        title: "What's Next",
        body: [
          "Ship advanced insights dashboard with predictive analytics and automated recommendations",
          "Launch 100+ industry-specific templates based on customer research and feedback",
          "Release public SDK enabling developers to build custom integrations and extensions",
        ],
      },
    ]),
  },

  // CONTENT BLOCKS
  {
    key: "callout",
    label: "Callout",
    node: callout(
      "💡",
      "#FFF8DB",
      "Pro Tip: Use data visualization to tell compelling stories, not just to present numbers. Focus on insights and actionable takeaways that drive decision-making.",
    ),
  },

  {
    key: "toc",
    label: "Table of Contents",
    node: simple.toc(),
  },
  {
    key: "blockquote",
    label: "Blockquote",
    node: simple.blockquote(
      "Make it work, make it right, make it fast. This principle guides our engineering culture and ensures we ship quality features that scale sustainably.",
    ),
  },
  {
    key: "code",
    label: "Code Block",
    node: codeBlock(
      `// TypeScript utility for safe data fetching
export async function fetchWithRetry<T>(
  url: string,
  options: RequestInit = {},
  maxRetries = 3
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
      return await response.json();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(r => setTimeout(r, 1000 * Math.pow(2, i)));
    }
  }
  throw new Error("Max retries exceeded");
}`,
      "typescript",
    ),
  },
  {
    key: "hr",
    label: "Divider",
    node: simple.hr(),
  },
];
