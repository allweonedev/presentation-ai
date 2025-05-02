# Presentation AI

An open-source AI presentation generator. Create professional slides with customizable themes and AI-generated content in minutes.

## Features

- Generate presentation outlines from a simple prompt
- Create fully-formatted slides with various layouts
- Customize themes and styles
- Edit and refine presentations
- Export presentations

## Technologies

- Next.js
- TypeScript
- Tailwind CSS
- LangChain
- Llama 4 (via Together.ai or local deployment)
- Pinokio (for local model deployment)
- Prisma (database)
- NextAuth (authentication)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Together.ai API key (for Llama 4 access)
- (Optional) Pinokio for local model deployment

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/exzosdigital/presentation-ai.git
   cd presentation-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your API keys and configuration.

4. Set up the database:
   ```bash
   npx prisma db push
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Using Llama 4

### Option 1: Together.ai (Cloud)

1. Get a Together.ai API key from [together.ai](https://together.ai)
2. Add your API key to the `.env.local` file:
   ```
   TOGETHER_AI_API_KEY="your-api-key"
   ```

### Option 2: Local Deployment with Pinokio

1. Install Pinokio from [pinokio.computer](https://pinokio.computer)
2. Open Pinokio and create a new project
3. Copy the `pinokio/llama4-local.js` script to your Pinokio project
4. Run the script to download and start the Llama 4 API server
5. Update your `.env.local` file:
   ```
   USE_LOCAL_LLAMA4="true"
   LOCAL_LLAMA4_API_URL="http://localhost:8000"
   ```

## Deployment

### Deploy on Vercel

The easiest way to deploy the application is to use the [Vercel Platform](https://vercel.com).

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Add the required environment variables
4. Deploy

### Other Deployment Options

You can also deploy the application on other platforms like:
- Railway
- Netlify
- AWS
- Google Cloud
- Azure

Make sure to set up the environment variables and database connection properly.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

