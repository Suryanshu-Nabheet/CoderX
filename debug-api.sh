#!/bin/bash

echo "🔍 CoderX API Key Debugging Script"
echo "=================================="

echo ""
echo "1. Server Health Check:"
curl -s http://localhost:5173/api/health | jq '.'

echo ""
echo "2. Environment Providers:"
curl -s http://localhost:5173/api/env-providers | jq '.'

echo ""
echo "3. Available Models (OpenRouter):"
curl -s http://localhost:5173/api/models | jq '.modelList[] | select(.provider == "OpenRouter") | select(.name | contains("free")) | {name: .name, label: .label}' | head -3

echo ""
echo "4. Testing Chat API with OpenAI Free Model:"
response=$(curl -s -X POST http://localhost:5173/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "[Model: openai/gpt-oss-20b:free]\n\n[Provider: OpenRouter]\n\nHello from debug script!"}],
    "apiKeys": {},
    "files": {},
    "promptId": "",
    "contextOptimization": false,
    "chatMode": "discuss",
    "designScheme": {"primaryColor": "#3b82f6", "secondaryColor": "#64748b", "accentColor": "#f59e0b"},
    "supabase": {"isConnected": false, "hasSelectedProject": false, "credentials": {}},
    "maxLLMSteps": 5
  }')

echo "Response preview:"
echo "$response" | head -5

echo ""
echo "5. Browser Instructions:"
echo "   - Open: http://localhost:5173"
echo "   - Select Model: openai/gpt-oss-20b:free"
echo "   - Select Provider: OpenRouter"
echo "   - Try sending a message"
echo ""
echo "6. If you get 'Payment Required' error:"
echo "   - Clear browser cache and cookies"
echo "   - Refresh the page"
echo "   - Make sure you're using the free model"
echo ""
echo "✅ Debug script complete!"
