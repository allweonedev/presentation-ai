#!/bin/bash

# Direct OpenRouter API test script
# Tests models directly against OpenRouter API

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
OPENROUTER_API_KEY=${OPENROUTER_API_KEY:-""}

if [ -z "$OPENROUTER_API_KEY" ]; then
    echo "Error: OPENROUTER_API_KEY environment variable not set"
    echo "Please set it with: export OPENROUTER_API_KEY=your_key_here"
    exit 1
fi

echo "Testing OpenRouter Models Directly"
echo "=================================="
echo "Test Prompt: $PROMPT"
echo ""

WORKING_MODELS=()
FAILED_MODELS=()

for model in "${MODELS[@]}"; do
    echo "Testing model: $model"

    # Create the request payload for OpenRouter
    PAYLOAD=$(cat <<EOF
{
    "model": "$model",
    "messages": [
        {
            "role": "user",
            "content": "$PROMPT"
        }
    ],
    "max_tokens": 200
}
EOF
)

    # Make the API call to OpenRouter
    RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "https://openrouter.ai/api/v1/chat/completions" \
        -H "Authorization: Bearer $OPENROUTER_API_KEY" \
        -H "Content-Type: application/json" \
        -H "HTTP-Referer: https://presentation-ai.com" \
        -H "X-Title: Presentation AI Test" \
        -d "$PAYLOAD")

    # Extract status code and response body
    HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS:" | cut -d: -f2)
    RESPONSE_BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS:/d')

    if [ "$HTTP_STATUS" = "200" ]; then
        # Check if the response contains an error
        if echo "$RESPONSE_BODY" | jq -e '.error' >/dev/null 2>&1; then
            ERROR_MSG=$(echo "$RESPONSE_BODY" | jq -r '.error.message // .error')
            echo "  ❌ Failed: $ERROR_MSG"
            FAILED_MODELS+=("$model: $ERROR_MSG")
        else
            CONTENT=$(echo "$RESPONSE_BODY" | jq -r '.choices[0].message.content // "No content"')
            echo "  ✅ Success: Model $model works!"
            echo "     Response: $(echo "$CONTENT" | head -c 100)..."
            WORKING_MODELS+=("$model")
        fi
    else
        echo "  ❌ Failed: HTTP $HTTP_STATUS"
        ERROR_MSG=$(echo "$RESPONSE_BODY" | jq -r '.error.message // .error // "Unknown error"' 2>/dev/null || echo "HTTP $HTTP_STATUS")
        FAILED_MODELS+=("$model: HTTP $HTTP_STATUS - $ERROR_MSG")
    fi

    echo ""
    # Small delay between requests to avoid rate limiting
    sleep 2
done

echo "Testing Summary"
echo "==============="
echo "Working Models (${#WORKING_MODELS[@]}):"
for model in "${WORKING_MODELS[@]}"; do
    echo "  ✅ $model"
done

echo ""
echo "Failed Models (${#FAILED_MODELS[@]}):"
for failure in "${FAILED_MODELS[@]}"; do
    echo "  ❌ $failure"
done

echo ""
echo "Testing complete!"