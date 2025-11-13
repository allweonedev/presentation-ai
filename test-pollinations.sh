#!/bin/bash

# Test Pollinations text models
echo "Testing Pollinations Text Models"
echo "================================"

# Test a simple text generation
echo "Testing simple text generation..."
RESPONSE=$(curl -s "https://text.pollinations.ai/What%20is%20artificial%20intelligence?%20Explain%20in%202%20sentences.&model=openai")

if [ $? -eq 0 ] && [ -n "$RESPONSE" ]; then
    echo "✅ Simple text generation works!"
    echo "Response preview: $(echo "$RESPONSE" | head -c 100)..."
else
    echo "❌ Simple text generation failed"
fi

echo ""

# Test OpenAI-compatible API
echo "Testing OpenAI-compatible API..."
PAYLOAD='{
    "model": "openai",
    "messages": [
        {"role": "user", "content": "What is AI? Keep it brief."}
    ],
    "max_tokens": 100
}'

RESPONSE=$(curl -s -X POST "https://text.pollinations.ai/openai" \
    -H "Content-Type: application/json" \
    -d "$PAYLOAD")

if echo "$RESPONSE" | jq -e '.choices[0].message.content' >/dev/null 2>&1; then
    CONTENT=$(echo "$RESPONSE" | jq -r '.choices[0].message.content')
    echo "✅ OpenAI-compatible API works!"
    echo "Response: $(echo "$CONTENT" | head -c 100)..."
else
    echo "❌ OpenAI-compatible API failed"
    echo "Response: $RESPONSE"
fi

echo ""
echo "Pollinations integration test complete!"