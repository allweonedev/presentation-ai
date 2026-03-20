import {
  ArrowRight,
  BarChart3,
  Circle as CircleIcon,
  CreditCard,
  Grid3x3,
  Hash,
  ImageIcon,
  List,
  ListOrdered,
  Quote,
  Square,
  Triangle,
} from "lucide-react";
import { nanoid } from "nanoid";
import {
  AREA_CHART_ELEMENT,
  ARROW_LIST,
  ARROW_LIST_ITEM,
  BAR_CHART_ELEMENT,
  BOX_GROUP,
  BOX_ITEM,
  BOX_PLOT_CHART_ELEMENT,
  BUBBLE_CHART_ELEMENT,
  BULLET_GROUP,
  BULLET_ITEM,
  CANDLESTICK_CHART_ELEMENT,
  CHART_TYPES,
  CHORD_CHART_ELEMENT,
  COLUMN_GROUP,
  COLUMN_ITEM,
  COMPOSED_CHART_ELEMENT,
  CONE_FUNNEL_CHART_ELEMENT,
  CYCLE_GROUP,
  CYCLE_ITEM,
  DEFAULT_CHART_DATA,
  FUNNEL_CHART_ELEMENT,
  HEATMAP_CHART_ELEMENT,
  HISTOGRAM_CHART_ELEMENT,
  LINE_CHART_ELEMENT,
  LINEAR_GAUGE_ELEMENT,
  NIGHTINGALE_CHART_ELEMENT,
  OHLC_CHART_ELEMENT,
  PIE_CHART_ELEMENT,
  PYRAMID_CHART_ELEMENT,
  PYRAMID_GROUP,
  PYRAMID_ITEM,
  QUOTE_ELEMENT,
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
  STATS_GROUP,
  STATS_ITEM,
  SUNBURST_CHART_ELEMENT,
  TIMELINE_GROUP,
  TIMELINE_ITEM,
  TREEMAP_CHART_ELEMENT,
  WATERFALL_CHART_ELEMENT,
} from "../editor/lib";
import { type PlateSlide } from "./parser";
import * as Previews from "./template-previews";

export interface TemplateCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export interface TemplateDefinition {
  id: string;
  name: string;
  categoryId: string;
  preview: React.ReactNode;
  template: Omit<PlateSlide, "id">;
}

const createBaseContent = (
  title: string = "Title",
  desc: string = "Description",
) => [
  { type: "h2", id: nanoid(), children: [{ text: title }] },
  {
    type: "p",
    id: nanoid(),
    children: [{ text: desc }],
  },
];

const createListContent = ({
  type = "basic",
  items = 4,
}: {
  type?: "basic" | "numbered" | "arrow";
  items?: number;
}) => [
  { type: "h2", id: nanoid(), children: [{ text: "List Title" }] },
  {
    type: BULLET_GROUP,
    id: nanoid(),
    bulletType: type, // Default to basic
    children: Array.from({ length: items }).map(() => ({
      type: BULLET_ITEM,
      id: nanoid(),
      children: [{ text: "List item" }],
    })),
  },
];

const createBoxContent = (
  variant: "solid" | "outline" | "icon" | "sideline" | "joined" | "leaf",
  items: number = 4,
) => [
  { type: "h2", id: nanoid(), children: [{ text: "Box Layout" }] },
  {
    type: BOX_GROUP,
    id: nanoid(),
    boxType: variant,
    columnSize: "sm",
    children: Array.from({ length: items }).map(() => ({
      type: BOX_ITEM,
      id: nanoid(),
      children: [{ text: "Box Content" }],
    })),
  },
];
const createChartContent = (type: string, title: string, variant?: string) => {
  const isCoordinate = CHART_TYPES.COORDINATE_CHARTS.includes(
    type as (typeof CHART_TYPES.COORDINATE_CHARTS)[number],
  );
  const isOHLC =
    type === CANDLESTICK_CHART_ELEMENT || type === OHLC_CHART_ELEMENT;
  const isBoxPlot = type === BOX_PLOT_CHART_ELEMENT;

  // Determine the correct default data based on chart type
  const data = isCoordinate
    ? DEFAULT_CHART_DATA.scatter
    : isOHLC
      ? DEFAULT_CHART_DATA.ohlc
      : isBoxPlot
        ? DEFAULT_CHART_DATA.boxPlot
        : DEFAULT_CHART_DATA.labelValue;

  return [
    { type: "h2", id: nanoid(), children: [{ text: title }] },
    {
      type,
      id: nanoid(),
      data,
      variant,
      children: [{ text: "" }], // Void element
    },
  ];
};

const createCycleContent = (items: number = 4) => [
  { type: "h2", id: nanoid(), children: [{ text: "Cycle Process" }] },
  {
    type: CYCLE_GROUP,
    id: nanoid(),
    children: Array.from({ length: items }).map(() => ({
      type: CYCLE_ITEM,
      id: nanoid(),
      children: [{ text: "Step" }],
    })),
  },
];

const createStaircaseContent = (items: number = 4) => [
  { type: "h2", id: nanoid(), children: [{ text: "Staircase" }] },
  {
    type: STAIRCASE_GROUP,
    id: nanoid(),
    children: Array.from({ length: items }).map(() => ({
      type: STAIR_ITEM,
      id: nanoid(),
      children: [{ text: "Step" }],
    })),
  },
];

const createPyramidContent = (variant: "pyramid" | "funnel") => [
  {
    type: "h2",
    id: nanoid(),
    children: [{ text: variant === "pyramid" ? "Pyramid" : "Funnel" }],
  },
  {
    type: PYRAMID_GROUP,
    id: nanoid(),
    isFunnel: variant === "funnel",
    children: Array.from({ length: 4 }).map(() => ({
      type: PYRAMID_ITEM,
      id: nanoid(),
      children: [{ text: "Level" }],
    })),
  },
];

const createTimelineContent = (
  variant: "timeline" | "arrow" | "pill" | "parallelogram" | "arrow-vertical",
  items: number = 4,
) => {
  let groupType = TIMELINE_GROUP;
  let itemType = TIMELINE_ITEM;
  let extraProps = {};

  if (variant === "arrow") {
    groupType = ARROW_LIST;
    itemType = ARROW_LIST_ITEM;
    extraProps = { svgType: "arrow" };
  } else if (variant === "pill") {
    groupType = ARROW_LIST;
    itemType = ARROW_LIST_ITEM;
    extraProps = { svgType: "pill" };
  } else if (variant === "parallelogram") {
    groupType = ARROW_LIST;
    itemType = ARROW_LIST_ITEM;
    extraProps = { svgType: "parallelogram" };
  } else if (variant === "arrow-vertical") {
    groupType = SEQUENCE_ARROW_GROUP;
    itemType = SEQUENCE_ARROW_ITEM;
  }

  return [
    { type: "h2", id: nanoid(), children: [{ text: "Timeline / Sequence" }] },
    {
      type: groupType,
      id: nanoid(),
      ...extraProps,
      children: Array.from({ length: items }).map(() => ({
        type: itemType,
        id: nanoid(),
        children: [{ text: "Step" }],
      })),
    },
  ];
};

const createStatsContent = (
  variant:
    | "plain"
    | "circle"
    | "star"
    | "bar"
    | "dot-grid"
    | "dot-line"
    | "circle-bold",
  items: number = 3,
) => [
  { type: "h2", id: nanoid(), children: [{ text: "Statistics" }] },
  {
    type: STATS_GROUP,
    id: nanoid(),
    statsType: variant,
    columnSize: "md",
    children: Array.from({ length: items }).map(() => ({
      type: STATS_ITEM,
      id: nanoid(),
      children: [{ text: "Stat" }],
    })),
  },
];

const createColumnContent = (cols: number = 2) => [
  { type: "h2", id: nanoid(), children: [{ text: "Columns Layout" }] },
  {
    type: COLUMN_GROUP,
    id: nanoid(),
    layout: Array(cols).fill(1),
    children: Array.from({ length: cols }).map(() => ({
      type: COLUMN_ITEM,
      id: nanoid(),
      children: [{ type: "p", children: [{ text: "Column content" }] }],
    })),
  },
];

const createQuoteContent = (
  variant: "large" | "sidequote-icon" | "sidequote",
) => [
  {
    type: QUOTE_ELEMENT,
    id: nanoid(),
    variant,
    author: "Author Name",
    children: [
      {
        text: "This is an inspiring quote that captures the essence of your message.",
      },
    ],
  },
];

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  { id: "basic", name: "Basic", icon: <Grid3x3 className="size-4" /> },
  { id: "boxes", name: "Boxes", icon: <Square className="size-4" /> },
  { id: "bullets", name: "Bullets", icon: <List className="size-4" /> },
  {
    id: "card-layouts",
    name: "Card layouts",
    icon: <CreditCard className="size-4" />,
  },
  {
    id: "charts",
    name: "Charts & data",
    icon: <BarChart3 className="size-4" />,
  },
  { id: "circles", name: "Circles", icon: <CircleIcon className="size-4" /> },
  { id: "images", name: "Images", icon: <ImageIcon className="size-4" /> },
  { id: "numbers", name: "Numbers", icon: <Hash className="size-4" /> },
  { id: "pyramids", name: "Pyramids", icon: <Triangle className="size-4" /> },
  { id: "sequence", name: "Sequence", icon: <ArrowRight className="size-4" /> },
  { id: "steps", name: "Steps", icon: <ListOrdered className="size-4" /> },
  { id: "quotes", name: "Quotes", icon: <Quote className="size-4" /> },
];

export const TEMPLATE_DEFINITIONS: TemplateDefinition[] = [
  // Basic
  {
    id: "text-boxes",
    name: "Text and Heading",
    categoryId: "basic",
    preview: <Previews.TextAndHeadingPreview />,
    template: {
      content: createColumnContent(2),
    },
  },
  {
    id: "text-and-image",
    name: "Text and image",
    categoryId: "basic",
    preview: <Previews.TextAndImagePreview />,
    template: {
      content: [
        {
          type: COLUMN_GROUP,
          id: nanoid(),
          layout: [1, 1],
          children: [
            {
              type: COLUMN_ITEM,
              id: nanoid(),
              children: [
                { type: "h3", id: nanoid(), children: [{ text: "Title" }] },
                {
                  type: "p",
                  id: nanoid(),
                  children: [{ text: "Description text goes here." }],
                },
              ],
            },
            {
              type: COLUMN_ITEM,
              id: nanoid(),
              children: [
                {
                  type: "img", // or generic image placeholder
                  url: "https://placehold.co/600x400",
                  id: nanoid(),
                  children: [{ text: "" }],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: "image-and-text",
    name: "Text and image",
    categoryId: "basic",
    preview: <Previews.ImageAndTextPreview />,
    template: {
      content: [
        {
          type: COLUMN_GROUP,
          id: nanoid(),
          layout: [1, 1],
          children: [
            {
              type: COLUMN_ITEM,
              id: nanoid(),
              children: [
                {
                  type: "img", // or generic image placeholder
                  url: "https://placehold.co/600x400",
                  id: nanoid(),
                  children: [{ text: "" }],
                },
              ],
            },
            {
              type: COLUMN_ITEM,
              id: nanoid(),
              children: [
                { type: "h3", id: nanoid(), children: [{ text: "Title" }] },
                {
                  type: "p",
                  id: nanoid(),
                  children: [{ text: "Description text goes here." }],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: "two-columns",
    name: "Two columns",
    categoryId: "basic",
    preview: <Previews.TwoColumnsPreview />,
    template: {
      content: [
        {
          type: COLUMN_GROUP,
          id: nanoid(),
          layout: [1, 1],
          children: [
            {
              type: COLUMN_ITEM,
              id: nanoid(),
              children: [
                {
                  type: "h3",
                  id: nanoid(),
                  children: [{ text: "First Column" }],
                },
                {
                  type: "p",
                  id: nanoid(),
                  children: [{ text: "Description text goes here." }],
                },
              ],
            },
            {
              type: COLUMN_ITEM,
              id: nanoid(),
              children: [
                {
                  type: "h3",
                  id: nanoid(),
                  children: [{ text: "Second Column" }],
                },
                {
                  type: "p",
                  id: nanoid(),
                  children: [{ text: "Description text goes here." }],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: "two-columns-with-heading",
    name: "Two columns with heading",
    categoryId: "basic",
    preview: <Previews.TwoColumnsWithHeadingPreview />,
    template: {
      content: [
        {
          type: "h2",
          id: nanoid(),
          children: [{ text: "Two columns with heading" }],
        },
        {
          type: COLUMN_GROUP,
          id: nanoid(),
          layout: [1, 1],
          children: [
            {
              type: COLUMN_ITEM,
              id: nanoid(),
              children: [
                {
                  type: "h3",
                  id: nanoid(),
                  children: [{ text: "First Column" }],
                },
                {
                  type: "p",
                  id: nanoid(),
                  children: [{ text: "Description text goes here." }],
                },
              ],
            },
            {
              type: COLUMN_ITEM,
              id: nanoid(),
              children: [
                { type: "h3", id: nanoid(), children: [{ text: "Title" }] },
                {
                  type: "p",
                  id: nanoid(),
                  children: [{ text: "Description text goes here." }],
                },
              ],
            },
          ],
        },
      ],
    },
  },

  // Boxes
  {
    id: "solid-boxes",
    name: "Solid boxes",
    categoryId: "boxes",
    preview: <Previews.SolidBoxesPreview />,
    template: { content: createBoxContent("solid") },
  },
  {
    id: "outline-boxes",
    name: "Outline boxes",
    categoryId: "boxes",
    preview: <Previews.OutlineBoxesPreview />,
    template: { content: createBoxContent("outline") },
  },
  {
    id: "side-line-boxes",
    name: "Side line boxes",
    categoryId: "boxes",
    preview: <Previews.SideLineBoxesPreview />,
    template: { content: createBoxContent("sideline") },
  },

  {
    id: "joined-boxes",
    name: "Joined boxes",
    categoryId: "boxes",
    preview: <Previews.JoinedBoxesPreview />,
    template: { content: createBoxContent("joined") },
  },
  {
    id: "boxes-with-icons",
    name: "Boxes with icons",
    categoryId: "boxes",
    preview: <Previews.BoxesWithIconsPreview />,
    template: { content: createBoxContent("joined") },
  },
  {
    id: "leaf-boxes",
    name: "Leaf boxes",
    categoryId: "boxes",
    preview: <Previews.LeafBoxesPreview />,
    template: { content: createBoxContent("leaf") },
  },

  // Bullets
  {
    id: "numbered-bullets",
    name: "Numbered bullets",
    categoryId: "bullets",
    preview: <Previews.LargeBulletsPreview />,
    template: { content: createListContent({ type: "numbered" }) },
  },
  {
    id: "small-bullets",
    name: "Small bullets",
    categoryId: "bullets",
    preview: <Previews.SmallBulletsPreview />,
    template: { content: createListContent({ type: "basic" }) },
  },
  {
    id: "arrow-bullets",
    name: "Arrow bullets",
    categoryId: "bullets",
    preview: <Previews.ArrowBulletsPreview />,
    template: { content: createListContent({ type: "arrow" }) },
  },

  // Card Layouts
  {
    id: "accent-left-layout",
    name: "Accent left",
    categoryId: "card-layouts",
    preview: <Previews.AccentLeftPreview />,
    template: {
      layoutType: "left",
      content: createBaseContent(),
      rootImage: {
        query: "accent-left",
        url: "https://placehold.co/600x400",
        layoutType: "left",
      },
    },
  },
  {
    id: "accent-right-layout",
    name: "Accent right",
    categoryId: "card-layouts",
    preview: <Previews.AccentRightPreview />,
    template: {
      content: createBaseContent(),
      layoutType: "right",
      rootImage: {
        query: "accent-right",
        url: "https://placehold.co/600x400",
        layoutType: "right",
      },
    },
  },
  {
    id: "accent-top-layout",
    name: "Accent top",
    categoryId: "card-layouts",
    preview: <Previews.AccentTopPreview />,
    template: {
      content: createBaseContent(),
      layoutType: "vertical",
      rootImage: {
        query: "accent-top",
        url: "https://placehold.co/600x400",
        layoutType: "vertical",
      },
    },
  },
  {
    id: "accent-right-fit",
    name: "Accent right (fit)",
    categoryId: "card-layouts",
    preview: <Previews.AccentRightFitPreview />,
    template: {
      content: createBaseContent(),
      layoutType: "right",
      rootImage: {
        query: "accent-right-fit",
        url: "https://placehold.co/600x400",
        layoutType: "right",
        cropSettings: {
          objectFit: "contain",
          objectPosition: {
            x: 50,
            y: 50,
          },
        },
      },
    },
  },
  {
    id: "accent-left-fit",
    name: "Accent left (fit)",
    categoryId: "card-layouts",
    preview: <Previews.AccentLeftFitPreview />,
    template: {
      content: createBaseContent(),
      layoutType: "left",
      rootImage: {
        query: "accent-left-fit",
        url: "https://placehold.co/600x400",
        layoutType: "left",
        cropSettings: {
          objectFit: "contain",
          objectPosition: {
            x: 50,
            y: 50,
          },
        },
      },
    },
  },
  {
    id: "accent-background",
    name: "Accent background",
    categoryId: "card-layouts",
    preview: <Previews.AccentBackgroundPreview />,
    template: {
      content: createBaseContent(),
      layoutType: "background",
      rootImage: {
        query: "accent-background",
        url: "https://placehold.co/600x400",
        layoutType: "background",
      },
    },
  },

  {
    id: "bar-chart",
    name: "Bar chart",
    categoryId: "charts",
    preview: <Previews.BarChartPreview />,
    template: {
      content: createChartContent(BAR_CHART_ELEMENT, "Bar Chart", "horizontal"),
    },
  },
  {
    id: "line-chart",
    name: "Line chart",
    categoryId: "charts",
    preview: <Previews.LineChartPreview />,
    template: {
      content: createChartContent(LINE_CHART_ELEMENT, "Line Chart"),
    },
  },
  {
    id: "pie-chart",
    name: "Pie chart",
    categoryId: "charts",
    preview: <Previews.PieChartPreview />,
    template: { content: createChartContent(PIE_CHART_ELEMENT, "Pie Chart") },
  },
  {
    id: "donut-chart",
    name: "Donut chart",
    categoryId: "charts",
    preview: <Previews.DonutChartPreview />,
    template: {
      content: createChartContent(PIE_CHART_ELEMENT, "Donut Chart", "donut"),
    },
  },
  // New chart templates
  {
    id: "area-chart",
    name: "Area chart",
    categoryId: "charts",
    preview: <Previews.AreaChartPreview />,
    template: { content: createChartContent(AREA_CHART_ELEMENT, "Area Chart") },
  },
  {
    id: "scatter-chart",
    name: "Scatter chart",
    categoryId: "charts",
    preview: <Previews.ScatterChartPreview />,
    template: {
      content: createChartContent(SCATTER_CHART_ELEMENT, "Scatter Chart"),
    },
  },
  {
    id: "bubble-chart",
    name: "Bubble chart",
    categoryId: "charts",
    preview: <Previews.BubbleChartPreview />,
    template: {
      content: createChartContent(BUBBLE_CHART_ELEMENT, "Bubble Chart"),
    },
  },
  {
    id: "histogram-chart",
    name: "Histogram",
    categoryId: "charts",
    preview: <Previews.HistogramChartPreview />,
    template: {
      content: createChartContent(HISTOGRAM_CHART_ELEMENT, "Histogram Chart"),
    },
  },
  {
    id: "range-bar-chart",
    name: "Range Bar",
    categoryId: "charts",
    preview: <Previews.RangeBarChartPreview />,
    template: {
      content: createChartContent(RANGE_BAR_CHART_ELEMENT, "Range Bar Chart"),
    },
  },
  {
    id: "range-area-chart",
    name: "Range Area",
    categoryId: "charts",
    preview: <Previews.RangeAreaChartPreview />,
    template: {
      content: createChartContent(RANGE_AREA_CHART_ELEMENT, "Range Area Chart"),
    },
  },
  {
    id: "waterfall-chart",
    name: "Waterfall",
    categoryId: "charts",
    preview: <Previews.WaterfallChartPreview />,
    template: {
      content: createChartContent(WATERFALL_CHART_ELEMENT, "Waterfall Chart"),
    },
  },
  {
    id: "box-plot-chart",
    name: "Box Plot",
    categoryId: "charts",
    preview: <Previews.BoxPlotChartPreview />,
    template: {
      content: createChartContent(BOX_PLOT_CHART_ELEMENT, "Box Plot Chart"),
    },
  },
  {
    id: "candlestick-chart",
    name: "Candlestick",
    categoryId: "charts",
    preview: <Previews.CandlestickChartPreview />,
    template: {
      content: createChartContent(
        CANDLESTICK_CHART_ELEMENT,
        "Candlestick Chart",
      ),
    },
  },
  {
    id: "ohlc-chart",
    name: "OHLC",
    categoryId: "charts",
    preview: <Previews.OHLCChartPreview />,
    template: {
      content: createChartContent(OHLC_CHART_ELEMENT, "OHLC Chart"),
    },
  },
  {
    id: "radar-line-chart",
    name: "Radar Line",
    categoryId: "charts",
    preview: <Previews.RadarLineChartPreview />,
    template: {
      content: createChartContent(RADAR_CHART_ELEMENT, "Radar Chart"),
    },
  },
  {
    id: "radar-area-chart",
    name: "Radar Area",
    categoryId: "charts",
    preview: <Previews.RadarAreaChartPreview />,
    template: {
      content: createChartContent(
        RADAR_CHART_ELEMENT,
        "Radar Chart",
        "outline",
      ),
    },
  },
  {
    id: "nightingale-chart",
    name: "Nightingale",
    categoryId: "charts",
    preview: <Previews.NightingaleChartPreview />,
    template: {
      content: createChartContent(
        NIGHTINGALE_CHART_ELEMENT,
        "Nightingale Chart",
      ),
    },
  },
  {
    id: "radial-column-chart",
    name: "Radial Column",
    categoryId: "charts",
    preview: <Previews.RadialColumnChartPreview />,
    template: {
      content: createChartContent(
        RADIAL_COLUMN_CHART_ELEMENT,
        "Radial Column Chart",
      ),
    },
  },
  {
    id: "radial-bar-chart",
    name: "Radial Bar",
    categoryId: "charts",
    preview: <Previews.RadialBarChartPreview />,
    template: {
      content: createChartContent(RADIAL_BAR_CHART_ELEMENT, "Radial Bar Chart"),
    },
  },
  {
    id: "sunburst-chart",
    name: "Sunburst",
    categoryId: "charts",
    preview: <Previews.SunburstChartPreview />,
    template: {
      content: createChartContent(SUNBURST_CHART_ELEMENT, "Sunburst Chart"),
    },
  },
  {
    id: "treemap-chart",
    name: "Treemap",
    categoryId: "charts",
    preview: <Previews.TreemapChartPreview />,
    template: {
      content: createChartContent(TREEMAP_CHART_ELEMENT, "Treemap Chart"),
    },
  },
  {
    id: "heatmap-chart",
    name: "Heatmap",
    categoryId: "charts",
    preview: <Previews.HeatmapChartPreview />,
    template: {
      content: createChartContent(HEATMAP_CHART_ELEMENT, "Heatmap Chart"),
    },
  },
  {
    id: "sankey-chart",
    name: "Sankey",
    categoryId: "charts",
    preview: <Previews.SankeyChartPreview />,
    template: {
      content: createChartContent(SANKEY_CHART_ELEMENT, "Sankey Chart"),
    },
  },
  {
    id: "chord-chart",
    name: "Chord",
    categoryId: "charts",
    preview: <Previews.ChordChartPreview />,
    template: {
      content: createChartContent(CHORD_CHART_ELEMENT, "Chord Chart"),
    },
  },
  {
    id: "funnel-chart",
    name: "Funnel",
    categoryId: "charts",
    preview: <Previews.FunnelChartPreview />,
    template: {
      content: createChartContent(FUNNEL_CHART_ELEMENT, "Funnel Chart"),
    },
  },
  {
    id: "cone-funnel-chart",
    name: "Cone Funnel",
    categoryId: "charts",
    preview: <Previews.ConeFunnelChartPreview />,
    template: {
      content: createChartContent(
        CONE_FUNNEL_CHART_ELEMENT,
        "Cone Funnel Chart",
      ),
    },
  },
  {
    id: "pyramid-chart",
    name: "Pyramid Chart",
    categoryId: "charts",
    preview: <Previews.PyramidChartPreview2 />,
    template: {
      content: createChartContent(PYRAMID_CHART_ELEMENT, "Pyramid Chart"),
    },
  },
  {
    id: "radial-gauge-chart",
    name: "Radial Gauge",
    categoryId: "charts",
    preview: <Previews.RadialGaugeChartPreview />,
    template: {
      content: createChartContent(RADIAL_GAUGE_ELEMENT, "Radial Gauge"),
    },
  },
  {
    id: "linear-gauge-chart",
    name: "Linear Gauge",
    categoryId: "charts",
    preview: <Previews.LinearGaugeChartPreview />,
    template: {
      content: createChartContent(LINEAR_GAUGE_ELEMENT, "Linear Gauge"),
    },
  },
  {
    id: "combination-chart",
    name: "Combination",
    categoryId: "charts",
    preview: <Previews.CombinationChartPreview />,
    template: {
      content: createChartContent(COMPOSED_CHART_ELEMENT, "Combination Chart"),
    },
  },

  {
    id: "cycle",
    name: "Cycle",
    categoryId: "circles",
    preview: <Previews.CyclePreview />,
    template: { content: createCycleContent(4) },
  },

  {
    id: "two-image-columns",
    name: "2 Image columns",
    categoryId: "images",
    preview: <Previews.TwoImageColumnsPreview />,
    template: { content: createColumnContent(2) },
  },
  {
    id: "three-image-columns",
    name: "3 Image columns",
    categoryId: "images",
    preview: <Previews.ThreeImageColumnsCardPreview />,
    template: { content: createColumnContent(3) },
  },
  {
    id: "four-image-columns",
    name: "4 image columns",
    categoryId: "images",
    preview: <Previews.FourImageColumnsPreview />,
    template: { content: createColumnContent(4) },
  },
  {
    id: "images-with-text",
    name: "Images with text",
    categoryId: "images",
    preview: <Previews.ImagesWithTextPreview />,
    template: { content: createColumnContent(3) }, // Assumed 3 based on name/preview usually
  },
  {
    id: "image-gallery",
    name: "Image gallery",
    categoryId: "images",
    preview: <Previews.ImageGalleryPreview />,
    template: { content: createColumnContent(3) }, // Gallery grid
  },
  {
    id: "team-photos",
    name: "Team photos",
    categoryId: "images",
    preview: <Previews.TeamPhotosPreview />,
    template: { content: createColumnContent(4) }, // Team usually small cards
  },

  {
    id: "stats",
    name: "Stats",
    categoryId: "numbers",
    preview: <Previews.StatsPreview />,
    template: { content: createStatsContent("plain") },
  },
  {
    id: "circle-stats",
    name: "Circle stats",
    categoryId: "numbers",
    preview: <Previews.CircleStatsPreview />,
    template: { content: createStatsContent("circle") },
  },
  {
    id: "bar-stats",
    name: "Bar stats",
    categoryId: "numbers",
    preview: <Previews.BarStatsPreview />,
    template: { content: createStatsContent("bar") },
  },
  {
    id: "star-rating",
    name: "Star rating",
    categoryId: "numbers",
    preview: <Previews.StarRatingPreview />,
    template: { content: createStatsContent("star") },
  },
  {
    id: "dot-grid-stats",
    name: "Dot grid stats",
    categoryId: "numbers",
    preview: <Previews.DotGridStatsPreview />,
    template: { content: createStatsContent("dot-grid") },
  },
  {
    id: "dot-line-stats",
    name: "Dot line stats",
    categoryId: "numbers",
    preview: <Previews.DotLineStatsPreview />,
    template: { content: createStatsContent("dot-line") },
  },
  {
    id: "circle-stats-bold",
    name: "Circle stats (bold)",
    categoryId: "numbers",
    preview: <Previews.CircleStatsMiddleBoldPreview />,
    template: { content: createStatsContent("circle-bold") },
  },

  // Pyramids

  {
    id: "pyramid",
    name: "Pyramid",
    categoryId: "pyramids",
    preview: <Previews.PyramidPreview />,
    template: { content: createPyramidContent("pyramid") },
  },
  {
    id: "vertical-funnel",
    name: "Vertical funnel",
    categoryId: "pyramids",
    preview: <Previews.VerticalFunnelPreview />,
    template: { content: createPyramidContent("funnel") },
  },

  // Sequence
  {
    id: "timeline-sequence",
    name: "Timeline",
    categoryId: "sequence",
    preview: <Previews.TimelineSequencePreview />,
    template: { content: createTimelineContent("timeline") },
  },
  {
    id: "minimal-timeline",
    name: "Minimal timeline",
    categoryId: "sequence",
    preview: <Previews.MinimalTimelinePreview />,
    template: { content: createTimelineContent("timeline") },
  },
  {
    id: "minimal-timeline-boxes",
    name: "Minimal timeline boxes",
    categoryId: "sequence",
    preview: <Previews.MinimalTimelineWithBoxesPreview />,
    template: { content: createTimelineContent("timeline") },
  },
  {
    id: "arrows-sequence",
    name: "Arrows",
    categoryId: "sequence",
    preview: <Previews.ArrowListPreview />,
    template: { content: createTimelineContent("arrow") },
  },
  {
    id: "pills-sequence",
    name: "Pills",
    categoryId: "sequence",
    preview: <Previews.PillsSequencePreview />,
    template: { content: createTimelineContent("pill") },
  },
  {
    id: "slanted-labels",
    name: "Slanted labels",
    categoryId: "sequence",
    preview: <Previews.SlantedLabelsPreview />,
    template: { content: createTimelineContent("parallelogram") },
  },

  // Steps
  {
    id: "staircase",
    name: "Staircase",
    categoryId: "steps",
    preview: <Previews.StaircasePreview />,
    template: { content: createStaircaseContent() },
  },
  {
    id: "sequence-arrow",
    name: "Sequence Arrow",
    categoryId: "steps",
    preview: <Previews.SequenceArrowPreview />,
    template: { content: createTimelineContent("arrow-vertical") },
  },

  // Quotes
  {
    id: "large-quote",
    name: "Large quote",
    categoryId: "quotes",
    preview: <Previews.LargeQuotePreview />,
    template: { content: createQuoteContent("large") },
  },
  {
    id: "side-quote-icon",
    name: "Side quote with icon",
    categoryId: "quotes",
    preview: <Previews.SideQuoteWithIconPreview />,
    template: { content: createQuoteContent("sidequote-icon") },
  },
  {
    id: "simple-side-quote",
    name: "Simple side quote",
    categoryId: "quotes",
    preview: <Previews.SimpleSideQuotePreview />,
    template: { content: createQuoteContent("sidequote") },
  },
];
