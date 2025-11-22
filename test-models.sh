#!/bin/bash

# Test script for OpenRouter text models
# This script tests all the OpenRouter models to see which ones work

MODELS=(
    "deepseek"
    "gemini"
    "gemini-search"
    "mistral"
    "openai"
    "openai-audio"
    "openai-fast"
    "openai-large"
    "openai-reasoning"
    "qwen-coder"
    "roblox-rp"
    "bidara"
    "chickytutor"
    "evil"
    "midijourney"
    "rtist"
    "unity"
)

PROMPT="What is artificial intelligence? Explain in 2-3 sentences."
API_URL="http://localhost:7888/api/presentation/generate"

echo "Testing OpenRouter Text Models"
echo "=============================="
echo "API URL: $API_URL"
echo "Test Prompt: $PROMPT"
echo ""

for model in "${MODELS[@]}"; do
    echo "Testing model: $model"
    echo "Sending request..."

    # Create the request payload
    PAYLOAD=$(cat <<EOF
{
    "title": "AI Test",
    "prompt": "$PROMPT",
    "outline": ["What is AI", "How it works", "Future applications"],
    "language": "en-US",
    "tone": "professional",
    "modelProvider": "openrouter",
    "modelId": "$model"
}
EOF
)

    # Make the API call
    RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "$API_URL" \
        -H "Content-Type: application/json" \
        -d "$PAYLOAD")

    # Extract status code and response body
    HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS:" | cut -d: -f2)
    RESPONSE_BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS:/d')

    if [ "$HTTP_STATUS" = "200" ]; then
        echo "  ✅ Success: Model $model works!"
        # Show first 200 chars of response
        echo "     Response preview: $(echo "$RESPONSE_BODY" | head -c 200)..."
    else
        echo "  ❌ Failed: HTTP $HTTP_STATUS"
        echo "     Error: $(echo "$RESPONSE_BODY" | jq -r '.message // .error // "Unknown error"' 2>/dev/null || echo "$RESPONSE_BODY" | head -c 200)"
    fi

    echo ""
    # Small delay between requests to avoid rate limiting
    sleep 1
done

echo "Testing complete!"