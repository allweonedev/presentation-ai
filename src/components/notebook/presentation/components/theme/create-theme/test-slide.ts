import { type PlateSlide } from "@/components/notebook/presentation/utils/parser";

export const testSlides: PlateSlide[] = [
  {
    id: "theme-preview-card",
    width: "M",
    fontSize: "M",
    alignment: "center",
    content: [
      {
        type: "boxes",
        children: [
          {
            type: "box-item",
            children: [
              {
                type: "p",
                children: [{ text: "Hello 👋", bold: true }],
              },
              {
                type: "h1",
                children: [{ text: "Welcome to ALLWEONE" }],
              },
              {
                type: "p",
                children: [
                  {
                    text: "Create beautiful, AI-powered presentations in minutes. Customize your theme with fonts, colors, and layouts.",
                  },
                ],
              },
              {
                type: "p",
                children: [
                  {
                    text: "Your accent color will be used for links.",
                    color: "var(--presentation-accent)",
                    underline: true,
                  },
                  {
                    text: " It will also be used for layouts and buttons.",
                  },
                ],
              },
              {
                type: "p",
                children: [
                  {
                    text: "Here are your buttons:",
                    bold: true,
                  },
                ],
              },
              {
                type: "flex_box",
                justify: "start",
                children: [
                  {
                    type: "p",
                    children: [
                      {
                        type: "button",
                        variant: "filled",
                        children: [{ text: "Primary button" }],
                      },
                    ],
                  },
                  {
                    type: "p",
                    children: [
                      {
                        type: "button",
                        variant: "outline",
                        children: [{ text: "Secondary button" }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "theme-preview-fonts",
    width: "M",
    fontSize: "M",
    alignment: "start",
    content: [
      {
        type: "h1",
        children: [{ text: "Fonts" }],
      },
      {
        type: "p",
        children: [
          {
            text: "ALLWEONE comes with pre-defined sizes of typography that work best for legibility. Feel free to choose font families for your headings and body font.",
          },
        ],
      },
      {
        type: "p",
        children: [
          {
            text: "You can choose a solid default color for your text. For headings, you can also choose a gradient color.",
          },
        ],
      },
      {
        type: "h1",
        children: [{ text: "Title font" }],
      },
      {
        type: "h1",
        children: [{ text: "Heading 1" }],
      },
      {
        type: "h2",
        children: [{ text: "Heading 2" }],
      },
      {
        type: "h3",
        children: [{ text: "Heading 3" }],
      },
      {
        type: "h4",
        children: [{ text: "Heading 4" }],
      },
    ],
  },
  {
    id: "theme-preview-layouts",
    width: "M",
    fontSize: "M",
    alignment: "start",
    content: [
      {
        type: "h1",
        children: [{ text: "Smart layouts" }],
      },
      {
        type: "h3",
        children: [{ text: "Timeline" }],
      },
      {
        type: "timeline",
        orientation: "horizontal",
        alignment: "center",
        children: [
          {
            type: "timeline-item",
            children: [
              { type: "h3", children: [{ text: "AI-Powered Creation" }] },
              {
                type: "p",
                children: [
                  { text: "Generate presentations with AI assistance" },
                ],
              },
            ],
          },
          {
            type: "timeline-item",
            children: [
              { type: "h3", children: [{ text: "Custom Themes" }] },
              {
                type: "p",
                children: [
                  {
                    text: "Personalize your presentations with custom fonts and colors",
                  },
                ],
              },
            ],
          },
          {
            type: "timeline-item",
            children: [
              { type: "h3", children: [{ text: "Smart Layouts" }] },
              {
                type: "p",
                children: [
                  {
                    text: "Use intelligent layouts that adapt to your content",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: "h3",
        children: [{ text: "Pyramid" }],
      },
      {
        type: "pyramid",
        children: [
          {
            type: "pyramid-item",
            children: [
              { type: "h3", children: [{ text: "Easy to Use" }] },
              {
                type: "p",
                children: [{ text: "Intuitive interface for everyone" }],
              },
            ],
          },
          {
            type: "pyramid-item",
            children: [
              { type: "h3", children: [{ text: "Fully Customizable" }] },
              {
                type: "p",
                children: [
                  { text: "Adjust layouts and styles to match your brand" },
                ],
              },
            ],
          },
          {
            type: "pyramid-item",
            children: [
              { type: "h3", children: [{ text: "Professional Results" }] },
              {
                type: "p",
                children: [
                  {
                    text: "Create stunning presentations that impress your audience",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
