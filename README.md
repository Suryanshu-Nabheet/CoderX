[![CoderX: AI-Powered Development Platform](./public/social_preview_index.jpg)](https://github.com/Suryanshu-Nabheet/CoderX)

<div align="center">

# CoderX
### AI-Powered Development Platform

[![GitHub stars](https://img.shields.io/github/stars/Suryanshu-Nabheet/CoderX?style=social)](https://github.com/Suryanshu-Nabheet/CoderX)
[![GitHub forks](https://img.shields.io/github/forks/Suryanshu-Nabheet/CoderX?style=social)](https://github.com/Suryanshu-Nabheet/CoderX)
[![GitHub issues](https://img.shields.io/github/issues/Suryanshu-Nabheet/CoderX)](https://github.com/Suryanshu-Nabheet/CoderX/issues)
[![GitHub license](https://img.shields.io/github/license/Suryanshu-Nabheet/CoderX)](https://github.com/Suryanshu-Nabheet/CoderX/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Remix](https://img.shields.io/badge/Remix-000000?logo=remix&logoColor=white)](https://remix.run/)
[![AI Powered](https://img.shields.io/badge/AI-Powered-blue?logo=openai&logoColor=white)](https://github.com/Suryanshu-Nabheet/CoderX)

</div>

Welcome to **CoderX**, the AI-powered development platform that allows you to choose the LLM that you use for each prompt! Currently, you can use OpenAI, Anthropic, Ollama, OpenRouter, Gemini, LMStudio, Mistral, xAI, HuggingFace, DeepSeek, Groq, Cohere, Together, Perplexity, Moonshot (Kimi), Hyperbolic, GitHub Models, Amazon Bedrock, and OpenAI-like providers - and it is easily extended to use any other model supported by the Vercel AI SDK!

> **⭐ If you find CoderX useful, please give it a star on GitHub!**  
> **🐛 Found a bug? [Report it here](https://github.com/Suryanshu-Nabheet/CoderX/issues)**  
> **💡 Have an idea? [Open an issue](https://github.com/Suryanshu-Nabheet/CoderX/issues)**  
> **🤝 Want to contribute? [Check our contributing guide](https://github.com/Suryanshu-Nabheet/CoderX/blob/main/CONTRIBUTING.md)**

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Recent Major Additions](#recent-major-additions)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [FAQ](#faq)
- [License](#license)

---

## About

CoderX is an AI-powered development platform created by [Suryanshu Nabheet](https://github.com/Suryanshu-Nabheet) that enables developers to build full-stack Node.js applications directly in the browser using AI assistance.

### About the Creator

**Suryanshu Nabheet** is a Full Stack Developer and AI/ML enthusiast who created CoderX to provide developers with a powerful, AI-driven development platform. With expertise in modern web technologies, blockchain development, and cloud architecture, Suryanshu has built CoderX to be a comprehensive solution for AI-powered development.

**Connect with Suryanshu:**
- 🌐 [LinkedIn](https://www.linkedin.com/in/suryanshu-nabheet/)
- 💻 [GitHub](https://github.com/Suryanshu-Nabheet)
- 🐦 [Twitter/X](https://x.com/suryanshuxdev)

### Community

Join our community discussions on [GitHub Issues](https://github.com/Suryanshu-Nabheet/CoderX/issues) for support, feature requests, and sharing your projects!

For project management and roadmap information, check the [Project Management Guide](./PROJECT.md).

---

## Features

- **AI-powered full-stack web development** for **Node.js based applications** directly in your browser
- **Support for 19+ LLMs** with an extensible architecture to integrate additional models
- **Attach images to prompts** for better contextual understanding
- **Integrated terminal** to view output of LLM-run commands
- **Revert code to earlier versions** for easier debugging and quicker changes
- **Download projects as ZIP** for easy portability and sync to a folder on the host
- **Integration-ready Docker support** for a hassle-free setup
- **Deploy directly** to **Netlify**, **Vercel**, or **GitHub Pages**
- **Electron desktop app** for native desktop experience
- **Data visualization and analysis** with integrated charts and graphs
- **Git integration** with clone, import, and deployment capabilities
- **MCP (Model Context Protocol)** support for enhanced AI tool integration
- **Search functionality** to search through your codebase
- **File locking system** to prevent conflicts during AI code generation
- **Diff view** to see changes made by the AI
- **Supabase integration** for database management and queries
- **Expo app creation** for React Native development
- **Voice prompting** - Audio input for prompts
- **Bulk chat operations** - Delete multiple chats at once
- **Project snapshot restoration** - Restore projects from snapshots on reload

---

## Recent Major Additions

### ✅ Completed Features

- **19+ AI Provider Integrations** - OpenAI, Anthropic, Google, Groq, xAI, DeepSeek, Mistral, Cohere, Together, Perplexity, HuggingFace, Ollama, LM Studio, OpenRouter, Moonshot, Hyperbolic, GitHub Models, Amazon Bedrock, OpenAI-like
- **Electron Desktop App** - Native desktop experience with full functionality
- **Advanced Deployment Options** - Netlify, Vercel, and GitHub Pages deployment
- **Supabase Integration** - Database management and query capabilities
- **Data Visualization & Analysis** - Charts, graphs, and data analysis tools
- **MCP (Model Context Protocol)** - Enhanced AI tool integration
- **Search Functionality** - Codebase search and navigation
- **File Locking System** - Prevents conflicts during AI code generation
- **Diff View** - Visual representation of AI-made changes
- **Git Integration** - Clone, import, and deployment capabilities
- **Expo App Creation** - React Native development support
- **Voice Prompting** - Audio input for prompts
- **Bulk Chat Operations** - Delete multiple chats at once
- **Project Snapshot Restoration** - Restore projects from snapshots on reload

### 🔄 In Progress / Planned

- **File Locking & Diff Improvements** - Enhanced conflict prevention
- **Backend Agent Architecture** - Move from single model calls to agent-based system
- **LLM Prompt Optimization** - Better performance for smaller models
- **Project Planning Documentation** - LLM-generated project plans in markdown
- **VSCode Integration** - Git-like confirmations and workflows
- **Document Upload for Knowledge** - Reference materials and coding style guides
- **Additional Provider Integrations** - Azure OpenAI, Vertex AI, Granite

---

## Quick Start

### Prerequisites

- **Node.js** >= 18.18.0 ([Download](https://nodejs.org/en/download/))
- **pnpm** (will be installed if missing, or install globally: `npm install -g pnpm`)

### Fastest Way to Get Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Suryanshu-Nabheet/CoderX.git
   cd CoderX
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Start the development server:**
   ```bash
   pnpm run dev
   ```

4. **Open your browser:**
   - Navigate to `http://localhost:5173`
   - The application will be ready to use!

> **💡 Tip for Beginners:** Use a sophisticated Provider/Model like Anthropic with Claude Sonnet 3.x Models to get the best results. The System Prompt currently implemented in CoderX works better with some models than others.

---

## Installation

### Option 1: Download Pre-built Binary (Recommended for Non-Developers)

[![Download Latest Release](https://img.shields.io/github/v/release/Suryanshu-Nabheet/CoderX?label=Download%20CoderX&sort=semver)](https://github.com/Suryanshu-Nabheet/CoderX/releases/latest)

1. Visit the [latest release](https://github.com/Suryanshu-Nabheet/CoderX/releases/latest)
2. Download the binary for your platform (Windows, macOS, or Linux)
3. **For macOS users:** If you get the error "This app is damaged", run:
   ```bash
   xattr -cr /path/to/CoderX.app
   ```

### Option 2: Install from Source (For Developers)

#### Prerequisites

1. **Node.js Installation:**
   - Visit the [Node.js Download Page](https://nodejs.org/en/download/)
   - Download the "LTS" (Long Term Support) version for your operating system
   - Run the installer, accepting the default settings
   - Verify installation:
     ```bash
     node --version  # Should show >= 18.18.0
     ```

2. **Package Manager (pnpm):**
   ```bash
   npm install -g pnpm
   ```

#### Setup Steps

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Suryanshu-Nabheet/CoderX.git
   cd CoderX
   ```

2. **Install Dependencies:**
   ```bash
   pnpm install
   ```

3. **Environment Setup (Optional):**
   Create a `.env.local` file in the root directory for API keys:
   ```bash
   # API Keys (optional - can also be set via UI)
   OPENAI_API_KEY=your_openai_key_here
   ANTHROPIC_API_KEY=your_anthropic_key_here
   GOOGLE_GENERATIVE_AI_API_KEY=your_google_key_here
   
   # Local Provider Base URLs
   OLLAMA_BASE_URL=http://127.0.0.1:11434
   LMSTUDIO_BASE_URL=http://127.0.0.1:1234
   ```

---

## Running the Application

### Option 1: Development Server (Recommended)

```bash
pnpm run dev
```

This will:
- Start the Remix development server
- Enable hot module replacement (HMR)
- Open the application at `http://localhost:5173`
- Show a welcome message with version information

### Option 2: Production Build

Build and run the production version locally:

```bash
# Build the application
pnpm run build

# Start the production server
pnpm run start
```

Or use the preview command (builds and starts in one step):

```bash
pnpm run preview
```

### Option 3: Docker

#### Development Mode

```bash
# Build the development Docker image
pnpm run dockerbuild

# OR using Docker directly
docker build . --target coderx-development

# Run the container
docker compose --profile development up
```

The application will be available at `http://localhost:5173`

#### Production Mode

```bash
# Build the production Docker image
pnpm run dockerbuild:prod

# Run the production container
docker compose --profile production up
```

#### Using Pre-built Image

```bash
docker compose --profile prebuilt up
```

### Option 4: Electron Desktop App

#### Run Electron in Development

```bash
pnpm run electron:dev
```

#### Build Electron App

```bash
# Build for all platforms
pnpm electron:build:dist

# OR build for specific platform:
pnpm electron:build:mac   # macOS
pnpm electron:build:win   # Windows
pnpm electron:build:linux # Linux
```

The built application will be in the `dist` folder.

### Staying Updated (For Git Users)

To get the latest changes from the repository:

```bash
# Save your local changes (if any)
git stash

# Pull latest updates
git pull

# Update dependencies
pnpm install

# Restore your local changes (if any)
git stash pop
```

---

## Configuration

### API Keys and Providers

CoderX features a modern, intuitive settings interface for managing AI providers and API keys. The settings are organized into dedicated panels for easy navigation and configuration.

#### Accessing Provider Settings

1. **Open Settings**: Click the settings icon (⚙️) in the sidebar
2. **Navigate to Providers**: Select the "Providers" tab from the settings menu
3. **Choose Provider Type**: Switch between "Cloud Providers" and "Local Providers" tabs

#### Cloud Providers Configuration

The Cloud Providers tab displays all cloud-based AI services in an organized card layout:

- **Toggle Provider**: Use the switch to enable/disable each provider
- **Set API Key**: Click the provider card to expand its configuration, then click on the "API Key" field to enter edit mode
- **Bulk Toggle**: Use "Enable All Cloud" to toggle all cloud providers at once
- **Visual Status**: Green checkmarks indicate properly configured providers

#### Local Providers Configuration

The Local Providers tab manages local AI installations and custom endpoints:

- **Ollama**: Configure endpoint (defaults to `http://127.0.0.1:11434`), manage models, install new models
- **LM Studio**: Configure custom base URLs for LM Studio endpoints
- **OpenAI-like**: Connect to any OpenAI-compatible API endpoint

#### Environment Variables vs UI Configuration

CoderX supports both methods for maximum flexibility:

**Environment Variables (Recommended for Production):**
Set API keys in your `.env.local` file:
```bash
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
OLLAMA_BASE_URL=http://127.0.0.1:11434
```

**UI-Based Configuration:**
- Real-time updates
- Secure storage in browser cookies
- Visual feedback with status indicators
- Easy management through the interface

#### Supported Providers

**Cloud Providers:**
- OpenAI, Anthropic, Google (Gemini), Groq, xAI, DeepSeek, Mistral, Cohere, Together AI, Perplexity, HuggingFace, OpenRouter, Moonshot (Kimi), Hyperbolic, GitHub Models, Amazon Bedrock

**Local Providers:**
- Ollama, LM Studio, OpenAI-like

> **💡 Pro Tip**: Start with OpenAI or Anthropic for the best results, then explore other providers based on your specific needs and budget considerations.

---

## Project Structure

```
CoderX/
├── app/                          # Main application code
│   ├── components/               # React components
│   │   ├── @settings/           # Settings panel components
│   │   ├── chat/                # Chat interface components
│   │   ├── deploy/              # Deployment components
│   │   ├── editor/              # Code editor components
│   │   ├── git/                 # Git integration components
│   │   ├── header/              # Header components
│   │   ├── sidebar/             # Sidebar components
│   │   ├── ui/                  # Reusable UI components
│   │   └── workbench/           # Workbench components
│   ├── lib/                     # Core libraries and utilities
│   │   ├── api/                 # API client functions
│   │   ├── common/              # Common utilities and prompts
│   │   ├── hooks/               # React hooks
│   │   ├── modules/             # Module definitions
│   │   │   └── llm/             # LLM provider implementations
│   │   ├── persistence/         # Data persistence layer
│   │   ├── runtime/             # Runtime execution
│   │   ├── services/           # Service integrations
│   │   ├── stores/              # State management stores
│   │   └── utils/               # Utility functions
│   ├── routes/                  # Remix routes
│   ├── styles/                  # SCSS stylesheets
│   ├── types/                   # TypeScript type definitions
│   └── utils/                   # Utility functions
├── electron/                     # Electron desktop app
│   ├── main/                    # Main process
│   └── preload/                 # Preload scripts
├── public/                       # Static assets
├── scripts/                      # Build and utility scripts
├── docs/                         # Documentation
├── assets/                       # App icons and assets
├── functions/                    # Cloudflare Functions
├── docker-compose.yaml           # Docker Compose configuration
├── Dockerfile                    # Docker build configuration
├── package.json                  # Project dependencies and scripts
├── vite.config.ts               # Vite configuration
└── wrangler.toml                 # Cloudflare Workers configuration
```

### Key Directories

- **`app/components/`**: All React components organized by feature
- **`app/lib/modules/llm/providers/`**: LLM provider implementations (OpenAI, Anthropic, etc.)
- **`app/routes/`**: Remix route handlers (API endpoints and pages)
- **`app/lib/stores/`**: State management using nanostores/zustand
- **`electron/`**: Desktop application code for Electron

---

## Available Scripts

### Development

- **`pnpm run dev`** - Starts the development server with HMR
- **`pnpm run electron:dev`** - Runs Electron app in development mode

### Building

- **`pnpm run build`** - Builds the project for production
- **`pnpm run preview`** - Builds and runs the production build locally
- **`pnpm run typecheck`** - Runs TypeScript type checking
- **`pnpm run typegen`** - Generates TypeScript types using Wrangler

### Electron

- **`pnpm electron:build:deps`** - Builds Electron main and preload scripts
- **`pnpm electron:build:main`** - Builds the Electron main process
- **`pnpm electron:build:preload`** - Builds the Electron preload script
- **`pnpm electron:build:renderer`** - Builds the Electron renderer
- **`pnpm electron:build:unpack`** - Creates an unpacked Electron build
- **`pnpm electron:build:mac`** - Builds for macOS
- **`pnpm electron:build:win`** - Builds for Windows
- **`pnpm electron:build:linux`** - Builds for Linux
- **`pnpm electron:build:dist`** - Builds for all platforms

### Docker

- **`pnpm run dockerbuild`** - Builds the Docker image for development
- **`pnpm run dockerbuild:prod`** - Builds the Docker image for production
- **`pnpm run dockerrun`** - Runs the Docker container
- **`pnpm run dockerstart`** - Starts the Docker container with proper bindings

### Code Quality

- **`pnpm run lint`** - Runs ESLint to check for code issues
- **`pnpm run lint:fix`** - Automatically fixes linting issues
- **`pnpm test`** - Runs the test suite using Vitest
- **`pnpm run clean`** - Cleans build artifacts and cache

### Deployment

- **`pnpm run deploy`** - Deploys the project to Cloudflare Pages
- **`pnpm run start`** - Runs the built application locally using Wrangler Pages

---

## Development

### Development Workflow

1. **Clone and Setup:**
   ```bash
   git clone https://github.com/Suryanshu-Nabheet/CoderX.git
   cd CoderX
   pnpm install
   ```

2. **Start Development Server:**
   ```bash
   pnpm run dev
   ```

3. **Make Changes:**
   - Edit files in `app/` directory
   - Changes will hot-reload automatically
   - Check browser console for any errors

4. **Run Tests:**
   ```bash
   pnpm test
   ```

5. **Check Code Quality:**
   ```bash
   pnpm run lint
   pnpm run typecheck
   ```

### Adding a New LLM Provider

1. Create a new provider file in `app/lib/modules/llm/providers/`
2. Implement the provider interface from `base-provider.ts`
3. Register the provider in `app/lib/modules/llm/registry.ts`
4. Add provider configuration in settings components

### Troubleshooting

#### Common Issues

**Port Already in Use:**
```bash
# Find and kill the process using port 5173
lsof -ti:5173 | xargs kill -9
```

**Node Version Issues:**
```bash
# Ensure you're using Node.js >= 18.18.0
node --version

# If needed, use nvm to switch versions
nvm install 18.18.0
nvm use 18.18.0
```

**Dependency Issues:**
```bash
# Clean installation
rm -rf node_modules pnpm-lock.yaml
pnpm store prune
pnpm install
```

**Git Reset (if needed):**
```bash
# Discard all local changes
git reset --hard origin/main
```

---

## Deployment

### Cloudflare Pages

```bash
pnpm run build
pnpm run deploy
```

### Docker Production

```bash
# Build production image
pnpm run dockerbuild:prod

# Run with docker-compose
docker compose --profile production up
```

### Environment Variables for Production

Ensure all required environment variables are set in your deployment platform:
- API keys for AI providers
- Base URLs for local providers
- Any service-specific configuration

---

## Contributing

We welcome contributions! Check out our [Contributing Guide](CONTRIBUTING.md) to get started.

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`pnpm test && pnpm run lint`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

For more details, see our [Contributing Guide](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md).

---

## FAQ

For answers to common questions, issues, and to see a list of recommended models, visit our [FAQ Page](FAQ.md).

Common questions include:
- What are the best models for CoderX?
- How do I get the best results?
- How do I contribute?
- What are the future plans?

---

## License

CoderX source code is distributed under the **MIT License**.

### WebContainer API License

**Important**: CoderX uses WebContainers API which [requires licensing](https://webcontainers.io/enterprise) for production usage in a commercial, for-profit setting. 

- **Prototypes or POCs** do not require a commercial license
- **Commercial use** (serving customers, employees, or prospects) requires a commercial license
- Usage of the API in violation of these terms may result in your access being revoked

For more information, visit the [WebContainers Enterprise Licensing page](https://webcontainers.io/enterprise).

---

<div align="center">

**Made with ❤️ by [Suryanshu Nabheet](https://github.com/Suryanshu-Nabheet)**

[⭐ Star on GitHub](https://github.com/Suryanshu-Nabheet/CoderX) | [🐛 Report Bug](https://github.com/Suryanshu-Nabheet/CoderX/issues) | [💡 Request Feature](https://github.com/Suryanshu-Nabheet/CoderX/issues) | [📖 Documentation](https://github.com/Suryanshu-Nabheet/CoderX#readme)

</div>
