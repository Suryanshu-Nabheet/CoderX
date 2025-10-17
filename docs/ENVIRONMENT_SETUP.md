# 🔐 Environment Setup Guide

## Quick Setup

1. **Run the setup script:**
   ```bash
   ./scripts/setup-env.sh
   ```

2. **Edit your `.env` file:**
   ```bash
   nano .env  # or use your preferred editor
   ```

3. **Add your API keys:**
   ```env
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

## Security Best Practices

### ✅ DO:
- Keep your `.env` file private and secure
- Use the provided setup script
- Add API keys only to your local `.env` file
- Use environment variables for all sensitive data

### ❌ DON'T:
- Commit `.env` files to version control
- Share API keys in code, documentation, or screenshots
- Use real API keys in example files
- Expose API keys in public repositories

## Available API Keys

CoderX supports 50+ providers across multiple categories:

### Core AI Providers
- **OpenAI** - GPT models (Primary)
- **Anthropic** - Claude models
- **Google** - Gemini models
- **Groq** - Fast inference
- **Cohere** - Command models
- **Hugging Face** - Open source models
- **Together** - Open source AI
- **Perplexity** - Search-powered AI
- **DeepSeek** - Advanced reasoning
- **Mistral** - European AI models
- **Moonshot** - Kimi models
- **XAI** - Grok models
- **OpenRouter** - Model routing
- **Ollama** - Local AI
- **LM Studio** - Local AI
- **Hyperbolic** - Specialized AI

### Cloud Providers
- **Amazon Bedrock** - AWS AI services
- **Azure OpenAI** - Microsoft AI services

### Development & Deployment
- **GitHub** - Code repositories
- **GitLab** - Git hosting
- **Supabase** - Backend-as-a-Service
- **Netlify** - Web deployment
- **Vercel** - Frontend deployment

### Specialized Services
- **Replicate** - AI model hosting
- **Stability AI** - Image generation
- **ElevenLabs** - Voice synthesis
- **AssemblyAI** - Speech recognition
- **Pinecone** - Vector database
- **LangSmith** - LLM monitoring
- **SendGrid** - Email delivery
- **Twilio** - Communication platform
- **Stripe** - Payment processing
- **PayPal** - Payment gateway

## Getting API Keys

Each provider has direct links in the API Key Configuration page:
1. Open CoderX
2. Click the "API Keys" button in the sidebar
3. Select your provider
4. Click the "Get API Key" link
5. Follow the provider's setup instructions

## Troubleshooting

### Common Issues:
- **"API key not found"** - Check your `.env` file has the correct variable name
- **"Invalid API key"** - Verify the key is correct and has proper permissions
- **"Rate limit exceeded"** - Check your provider's usage limits

### Support:
- Check the [FAQ](FAQ.md) for common questions
- Open an [issue](https://github.com/Suryanshu-Nabheet/CoderX/issues) for bugs
- Join [discussions](https://github.com/Suryanshu-Nabheet/CoderX/discussions) for help
