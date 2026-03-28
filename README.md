# ALLWEONE® AI Presentation Generator

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Plate JS](https://img.shields.io/badge/Plate.js-3B82F6?logoColor=white)](https://platejs.org)

⭐ **Help us reach more developers and grow the ALLWEONE community. Star this repo!**

An open-source, AI-powered presentation generator alternative to Gamma.app that creates beautiful, customizable slides in minutes. This tool is part of the broader ALLWEONE AI platform.

<https://github.com/user-attachments/assets/a21dbd49-75b8-4822-bcec-a75b581d9c60>

## 🔗 Quick Links

- [Live Demo](http://presentation.allweone.com)
- [Video Tutorial](https://www.youtube.com/watch?v=UUePLJeFqVQ)
- [Discord Community](https://discord.gg/fsMHMhAHRV)
- [Contributing Guidelines](CONTRIBUTING.md)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Database Setup](#database-setup)
- [Usage](#-usage)
  - [Creating a Presentation](#creating-a-presentation)
  - [Custom Themes](#custom-themes)
- [Local Models Guide](#-local-models-guide)
- [Project Structure](#-project-structure)
- [Roadmap](#️-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgements](#-acknowledgements)
- [Support](#-support)

## 🌟 Features

### Core Functionality

- **AI-Powered Content Generation**: Create complete presentations on any topic with AI
- **Outline-First Workflow**: Generate an outline first, review it, then turn it into slides
- **Customizable Slides**: Choose the text model, number of slides, language, and whether web search is enabled
- **Blank Presentations**: Start from scratch when you do not want AI-generated content
- **Editable Outlines**: Review and modify AI-generated outlines before finalizing
- **Real-Time Generation**: Watch your presentation build live as content is created
- **Auto-Save**: Everything saves automatically as you work

### Design & Customization

- **Multiple Themes**: 38 built-in themes are available out of the box
- **Custom Theme Creation**: Create, save, and reuse your own themes
- **PPTX Theme Import**: Import theme inspiration directly from PowerPoint files
- **Full Editability**: Modify text, fonts, and design elements as needed
- **Image Generation**: Choose different AI image generation models for your slides
- **Audience-Focused Styles**: Select between professional and casual presentation styles

### Presentation Tools

- **Presentation Mode**: Present directly from the application
- **Public Sharing**: Generate a shareable public link for presentations
- **Presentation Recording**: Record presentations with microphone and webcam controls
- **PowerPoint Export**: Export presentations to `.pptx`
- **Charts, Infographics, and Media Embeds**: Add richer visual content beyond plain text slides
- **Rich Text Editing**: Powered by Plate Editor for comprehensive text and image handling
- **Drag and Drop**: Intuitive slide reordering and element manipulation

## 🧰 Tech Stack

| Category           | Technologies                               |
| ------------------ | ------------------------------------------ |
| **Framework**      | Next.js, React, TypeScript                 |
| **Styling**        | Tailwind CSS                               |
| **Database**       | PostgreSQL with Prisma ORM                 |
| **AI Integration** | OpenAI API, Together AI, Ollama, LM Studio |
| **Authentication** | NextAuth.js                                |
| **UI Components**  | Radix UI                                   |
| **Text Editor**    | Plate Editor                               |
| **File Uploads**   | UploadThing                                |
| **Drag & Drop**    | DND Kit                                    |

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18.x or higher
- npm, yarn, or pnpm package manager
- PostgreSQL database
- Google Client ID and Secret (for authentication)
- Optional provider keys depending on the features you want to use:
  - OpenAI API key (for cloud text generation)
  - Together AI API key (for image generation)
  - FAL API key (for additional image generation flows)
  - Tavily API key (for web search)
  - Unsplash access key (for stock images)

### Installation

1. **Clone the repository**

   ```bash
   git clone git@github.com:allweonedev/presentation-ai.git
   cd presentation-ai
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory with the following variables:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/presentation_ai"

   # Authentication
   NEXTAUTH_SECRET=""
   NEXTAUTH_URL="http://localhost:3000"

   # Google OAuth Provider
   GOOGLE_CLIENT_ID=""
   GOOGLE_CLIENT_SECRET=""

   # AI Providers
   OPENAI_API_KEY=""
   TOGETHER_AI_API_KEY=""
   FAL_API_KEY=""

   # File Upload Service
   UPLOADTHING_TOKEN=""

   # Optional search and media providers
   UNSPLASH_ACCESS_KEY=""
   TAVILY_API_KEY=""
   ```

   > 💡 **Tip**: Copy `.env.example` to `.env` and fill in your actual values. If you plan to use local text models through Ollama or LM Studio, you can run text generation without an `OPENAI_API_KEY`.

### Database Setup

1. **Initialize the database**

   ```bash
   pnpm db:push
   ```

2. **Start the development server**

   ```bash
   pnpm dev
   ```

3. **Open the application**

   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

```bash
pnpm dev       # Start the Next.js dev server
pnpm build     # Build the application
pnpm start     # Start the production server
pnpm db:push   # Push the Prisma schema to the database
pnpm db:studio # Open Prisma Studio
pnpm type      # Run TypeScript type-checking
pnpm check     # Run Biome checks
pnpm lint      # Run Biome linting
```

## 💻 Usage

### Creating a Presentation

Follow these steps to create your first AI-generated presentation:

1. Sign in to the app
1. Navigate to the presentation dashboard
1. Enter your presentation topic
1. Choose a text model (OpenAI, Ollama, or LM Studio)
1. Choose the number of slides (recommended: 5-10)
1. Select your preferred language
1. Toggle web search if you want outside context included
1. Click **"Generate Outline"**
1. Review and edit the AI-generated outline
1. Select a theme for your presentation
1. Choose an image source (ai / stock)
1. Select your presentation style (Professional/Casual)
1. Click **"Generate Presentation"**
1. Wait for the AI to create your slides in real-time
1. Preview, edit, and refine your presentation as needed
1. Present directly from the app or export your presentation

### Custom Themes

Create personalized themes to match your brand or style:

1. Click **"Create New Theme"**
2. Start from scratch or derive from an existing theme
3. Customize colors, fonts, and layout
4. Save your theme for future use

## 🧠 Local Models Guide

ALLWEONE Presentation AI now supports both Ollama and LM Studio as local model providers.

### LM Studio

1. Install [LM Studio](https://lmstudio.ai).
2. In the LM Studio app, turn the Server ON and enable CORS.
3. Download any model you want to use inside LM Studio.

### Ollama

1. Install [Ollama](https://ollama.com).
2. Download whichever model you want to use (for example: `ollama pull llama3.1`).

### Using Local Models in the App

1. Open the app and open the text model selector.
2. Choose the model you want to use.
3. For LM Studio, load the model in LM Studio first.
4. For Ollama, installed models appear automatically, and some recommended models can be downloaded on first use.
5. Enjoy the generation.

Notes:

- OpenAI remains available as the default cloud text model.
- Models will automatically appear in the Model Selector when the LM Studio server or the Ollama daemon is running.
- Make sure LM Studio has CORS enabled so the browser can connect.

## 📁 Project Structure

```text
presentation-ai/
├── prisma/                      # Prisma schema and seed data
├── src/
│   ├── ai/                     # AI agents, tools, and server integrations
│   ├── app/                    # Next.js app router pages, APIs, and server actions
│   ├── components/
│   │   ├── notebook/           # Dashboard, generation flow, theme creation, recording UI
│   │   ├── presentation/       # Presentation editor, present mode, sharing, export
│   │   ├── plate/              # Plate editor plugins and UI
│   │   ├── prose-mirror/       # Outline editor
│   │   └── ui/                 # Shared UI primitives
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Models, themes, export helpers, utilities
│   ├── provider/               # App providers
│   ├── server/                 # Auth, DB, and share authorization helpers
│   ├── states/                 # Zustand state stores
│   ├── styles/                 # Global styles
│   ├── env.js                  # Environment validation
│   └── proxy.ts                # Next.js proxy
├── README.md
├── package.json
├── next.config.js
└── tsconfig.json
```

## 🗺️ Roadmap

| Feature                      | Status            | Notes                                                                                            |
| ---------------------------- | ----------------- | ------------------------------------------------------------------------------------------------ |
| Export to PowerPoint (.pptx) | 🟡 Partially Done | Works but the images and other component do not translate one to one                             |
| Media embedding              | 🟡 Partially Done | Functionality is there, but ui/ux need improvement                                               |
| Additional built-in themes   | 🟡 In Progress    | The app currently ships with 38 built-in themes, and the library is still growing                |
| Mobile responsiveness        | 🟡 In Progress    | Improving layout and interactions for mobile devices                                             |
| Advanced charts              | 🟡 Partially Done | AI-generated charts and chart editing are available, with broader coverage still improving       |
| Write e2e tests              | 🔴 Not Started    | Writing test to check the core features, so that we can catch if any changes break anything      |
| Real-time collaboration      | 🔴 Not Started    | Multiple users editing the same presentation simultaneously                                      |
| Export to PDF                | 🔴 Not Started    | High priority - allow users to download presentations as PDFs                                    |
| Template library             | 🔴 Not Started    | Pre-built templates for common presentation types (pitch decks, reports, etc.)                   |
| Animation and transitions    | 🔴 Not Started    | Add slide transitions and element animations                                                     |
| Presentation recording       | 🟡 Partially Done | Present mode already supports webcam and microphone recording controls                           |
| Cloud storage integration    | 🔴 Not Started    | Connect with Google Drive, Dropbox, OneDrive                                                     |
| Presentation analytics       | 🔴 Not Started    | Track views, engagement, and presentation performance                                            |
| AI presenter notes           | 🔴 Not Started    | Auto-generate speaker notes for each slide                                                       |
| Custom font uploads          | 🔴 Not Started    | Allow users to upload and use their own fonts                                                    |
| Plugin system                | 🔴 Not Started    | Allow community to build and share extensions                                                    |
| API                          | 🔴 Not Started    | Allow developers to use the allweone presentation to generate content in their own applications. |

> 📝 **Note**: This roadmap is subject to change based on community feedback and priorities. Want to contribute to any of these features? Check out our [Contributing Guidelines](CONTRIBUTING.md)!

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**

   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Commit your changes**

   ```bash
   git commit -m 'Add some amazing feature'
   ```

4. **Push to the branch**

   ```bash
   git push origin feature/amazing-feature
   ```

5. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style and conventions
- Write clear commit messages
- Be respectful and constructive in discussions

For more details, please read our [Contributing Guidelines](CONTRIBUTING.md).

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

Special thanks to the following projects and organizations:

- [OpenAI](https://openai.com/) for AI generation capabilities
- [Plate Editor](https://plate.udecode.io/) for rich text editing
- [Radix UI](https://www.radix-ui.com/) for accessible UI components
- [Next.js](https://nextjs.org/) for the React framework
- All our open-source [contributors](https://github.com/allweonedev/presentation-ai/graphs/contributors)

## 💬 Support and Sponsors

https://github.com/sponsors/allweonedev

Need help or have questions?

- 💬 [Discord Community](https://discord.gg/kZaJjZ7HjR)
- 🐛 [Report a Bug](https://github.com/allweonedev/presentation-ai/issues)
- 💡 [Request a Feature](https://github.com/allweonedev/presentation-ai/issues)
- 📧 Contact us via GitHub Issues or Discord

---

**Built with ❤️ by the ALLWEONE® Team**

**[⭐ Star us on GitHub](https://github.com/allweonedev/presentation-ai)**

[![Star History Chart](https://api.star-history.com/svg?repos=allweonedev/presentation-ai&type=date&legend=top-left)](https://www.star-history.com/#allweonedev/presentation-ai&type=date&legend=top-left)
