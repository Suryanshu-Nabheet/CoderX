#!/bin/bash

# CoderX Environment Setup Script
# This script helps you set up your environment variables securely

echo "🔐 CoderX Environment Setup"
echo "=========================="
echo ""

# Check if .env already exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists!"
    echo "Do you want to overwrite it? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 0
    fi
fi

echo "📝 Creating secure .env file..."

# Create .env file with secure template
cat > .env << 'EOF'
# CoderX Environment Variables
# This file contains sensitive API keys and should NEVER be committed to version control
# The .env file is already in .gitignore for security

# OpenAI API Key - Primary provider for CoderX
OPENAI_API_KEY=your_openai_api_key_here

# Default model configuration
DEFAULT_MODEL=gpt-oss-20b

# Additional AI Providers (uncomment and add your keys as needed)
# ANTHROPIC_API_KEY=your_anthropic_key_here
# GOOGLE_GENERATIVE_AI_API_KEY=your_google_key_here
# GROQ_API_KEY=your_groq_key_here
# COHERE_API_KEY=your_cohere_key_here
# HUGGINGFACE_API_KEY=your_huggingface_key_here
# TOGETHER_API_KEY=your_together_key_here
# PERPLEXITY_API_KEY=your_perplexity_key_here
# DEEPSEEK_API_KEY=your_deepseek_key_here
# MISTRAL_API_KEY=your_mistral_key_here
# MOONSHOT_API_KEY=your_moonshot_key_here
# XAI_API_KEY=your_xai_key_here
# OPEN_ROUTER_API_KEY=your_openrouter_key_here
# OLLAMA_API_BASE_URL=http://localhost:11434
# LMSTUDIO_API_BASE_URL=http://localhost:1234
# HYPERBOLIC_API_KEY=your_hyperbolic_key_here

# Cloud Providers
# AWS_ACCESS_KEY_ID=your_aws_access_key
# AWS_SECRET_ACCESS_KEY=your_aws_secret_key
# AWS_REGION=us-east-1
# AZURE_OPENAI_API_KEY=your_azure_key
# AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
# AZURE_OPENAI_DEPLOYMENT=gpt-4
# AZURE_OPENAI_API_VERSION=2024-02-15-preview

# Development & Deployment Services
# GITHUB_TOKEN=your_github_token
# GITLAB_TOKEN=your_gitlab_token
# SUPABASE_URL=your_supabase_url
# SUPABASE_ANON_KEY=your_supabase_anon_key
# NETLIFY_TOKEN=your_netlify_token
# VERCEL_TOKEN=your_vercel_token

# Specialized AI Services
# REPLICATE_API_TOKEN=your_replicate_token
# STABILITY_API_KEY=your_stability_key
# ELEVENLABS_API_KEY=your_elevenlabs_key
# ASSEMBLYAI_API_KEY=your_assemblyai_key
# SPEECHIFY_API_KEY=your_speechify_key
# WHISPER_API_KEY=your_whisper_key

# Database & Storage
# PINECONE_API_KEY=your_pinecone_key
# WEAVIATE_API_KEY=your_weaviate_key
# CHROMA_API_KEY=your_chroma_key
# QDRANT_API_KEY=your_qdrant_key
# MILVUS_API_KEY=your_milvus_key

# Monitoring & Analytics
# LANGSMITH_API_KEY=your_langsmith_key
# WANDB_API_KEY=your_wandb_key
# MLFLOW_TRACKING_URI=your_mlflow_uri
# NEPTUNE_API_TOKEN=your_neptune_token

# Communication & Payment Services
# SENDGRID_API_KEY=your_sendgrid_key
# TWILIO_ACCOUNT_SID=your_twilio_sid
# TWILIO_AUTH_TOKEN=your_twilio_token
# STRIPE_SECRET_KEY=your_stripe_key
# PAYPAL_CLIENT_ID=your_paypal_client_id
# PAYPAL_CLIENT_SECRET=your_paypal_secret
EOF

echo "✅ .env file created successfully!"
echo ""
echo "🔧 Next steps:"
echo "1. Edit the .env file and add your actual API keys"
echo "2. Replace 'your_openai_api_key_here' with your OpenAI API key"
echo "3. Uncomment and add other API keys as needed"
echo ""
echo "⚠️  Security reminders:"
echo "- Never commit the .env file to version control"
echo "- Keep your API keys secure and private"
echo "- The .env file is already in .gitignore"
echo ""
echo "🚀 You can now run: pnpm dev"