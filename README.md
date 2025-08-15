# 🤖 Local LLMs - AI Assistant Platform

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15.4.4-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Ollama](https://img.shields.io/badge/Ollama-0.5.16-green?style=for-the-badge)
![Hugging Face](https://img.shields.io/badge/Hugging%20Face-4.6.1-yellow?style=for-the-badge&logo=huggingface)

*A powerful, privacy-focused AI assistant platform that runs locally on your machine*

[🚀 Features](#-features) • [🛠️ Tech Stack](#️-tech-stack) • [⚡ Quick Start](#-quick-start) • [🔧 Setup](#-setup) • [🚀 Usage](#-usage) • [🔮 Future Scope](#-future-scope)

</div>

---

## 🎯 What is Local LLMs?

**Local LLMs** is a cutting-edge AI assistant platform that brings the power of large language models directly to your local machine. Unlike cloud-based solutions, this platform ensures complete privacy and data sovereignty while providing a rich, interactive chat experience with both text and image generation capabilities.

### 🎯 **Mission**
To democratize AI technology by providing a powerful, privacy-first platform that runs entirely on your local hardware, eliminating concerns about data privacy, API costs, and internet dependency.

---

## 🚀 Features

### 💬 **Intelligent Chat Interface**
- **Multi-model Support**: Switch between different AI models seamlessly
- **Context-Aware Conversations**: Maintains conversation history and context
- **Real-time Streaming**: Experience fluid, responsive AI interactions
- **Smart Request Categorization**: Automatically detects and routes different types of requests

### 🎨 **AI Image Generation**
- **Stable Diffusion Integration**: Generate stunning images from text descriptions
- **Multiple Providers**: Support for various image generation backends (currently only supports "nebius", "nscale", "replicate", "hf-inference", and "together")
- **High-Quality Output**: Professional-grade image generation capabilities

### 🔧 **Model Management**
- **Custom Model Creation**: Build and deploy your own AI models
- **Model Switching**: Hot-swap between different AI models during conversations
- **Local Model Storage**: All models stored and run locally on your machine

### 🛡️ **Privacy & Security**
- **100% Local Processing**: No data leaves your machine
- **No API Keys Required**: Complete independence from external services (NOTE: image generation feature uses HuggingFace Inference Providers which requires you to generate a token)
- **Offline Capability**: Works without internet connection (after initial setup, except the image generation feature)

---

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 15** - Modern React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development experience
- **CSS Modules** - Scoped styling for maintainable UI

### **Backend & AI**
- **Ollama** - Local LLM inference engine
- **Hugging Face** - Image generation and model hosting
- **Next.js API Routes** - Serverless backend endpoints
- **Streaming Responses** - Real-time AI interaction

### **Development Tools**
- **ESLint** - Code quality and consistency
- **Turbopack** - Fast development builds
- **Git** - Version control and collaboration

---

## ⚡ Quick Start

Get up and running in under 5 minutes:

```bash
# Clone the repository
git clone https://github.com/StrixROX/local-llms.git
cd local-llms

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start chatting with your AI assistant! 🎉

---

## 🔧 Setup

### **Prerequisites**
- **Node.js 18+** - JavaScript runtime
- **Ollama** - Local LLM engine
- **Git** - Version control

### **Step-by-Step Installation**

#### 1. **Install Ollama**
```bash
# macOS & Linux
curl -fsSL https://ollama.ai/install.sh | sh

# Windows
# Download from https://ollama.ai/download
```

#### 2. **Clone & Setup Project**
```bash
git clone https://github.com/StrixROX/local-llms.git
cd local-llms
npm install
```

#### 3. **Environment Configuration**
Create a `.env` file in the project root:
```env
# Optional: Custom Ollama server URL (default: http://localhost:11434)
OLLAMA_URL=http://localhost:11434

# Optional: Hugging Face token for image generation
HF_TOKEN=your_huggingface_token_here
```

#### 4. **Download AI Models**
```bash
# Pull some models from ollama to get started
ollama pull codellama:latest
ollama pull deepseek-r1:latest

# Or use custom models from the models/ directory
ollama create alfred -f ./src/models/alfred.modelfile
ollama create ed -f ./src/models/ed.modelfile
```

#### 5. **Launch the Application**
```bash
npm run dev
```

---

## 🚀 Usage

### **Starting a Conversation**
1. **Select a Model**: Choose from available AI models in the header
2. **Type Your Message**: Ask questions, request help, or start a conversation
3. **Get AI Responses**: Receive intelligent, contextual responses in real-time

### **Image Generation**
1. **Describe Your Image**: Use natural language to describe what you want
2. **Select Image Model**: Choose from available image generation models
3. **Generate & Download**: Create and save AI-generated images

### **Model Management**
- **Switch Models**: Change AI models mid-conversation
- **Create Custom Models**: Build specialized AI assistants
- **Import/Export**: Share and deploy custom models

---

## 🔮 Future Scope


### **🗄️ Database Integration**
- **Replace JSON Storage**: Integrate PostgreSQL/MongoDB for model data instead of basic JSON files
- **Persistent Storage**: Store model configurations, chat history, and user preferences in database
- **Data Relationships**: Proper relational structure for models, conversations, and settings
- **Backup & Recovery**: Automated database backups and data recovery mechanisms

### **🌍 Online Deployment**
- **Public Hosting**: Deploy the application online for public access
- **Cloud Infrastructure**: Set up on AWS, Google Cloud, or Azure with proper scaling
- **Remote Ollama**: Configure remote Ollama server for online deployment
- **Load Balancing**: Handle multiple concurrent users and requests efficiently

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### **Ways to Contribute**
- 🐛 **Report Bugs** - Help us identify and fix issues
- 💡 **Feature Requests** - Suggest new features and improvements
- 📝 **Documentation** - Improve guides and tutorials
- 🔧 **Code Contributions** - Submit pull requests for enhancements
- 🌟 **Model Sharing** - Share your custom AI models

### **Getting Started**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Ollama Team** - For the amazing local LLM engine
- **Hugging Face** - For open-source AI models and infrastructure
- **Next.js Team** - For the incredible React framework
- **Open Source Community** - For making AI accessible to everyone

---

<div align="center">

**Made with ❤️ by StrixROX**

[⭐ Star this repo](https://github.com/StrixROX/local-llms) • [🐛 Report an issue](https://github.com/StrixROX/local-llms/issues) • [💬 Join discussions](https://github.com/StrixROX/local-llms/discussions)

*Empowering AI innovation, one local model at a time* 🚀

</div>
