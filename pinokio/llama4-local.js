/**
 * Pinokio script to run Llama 4 locally
 * 
 * This script sets up and runs Llama 4 locally using Pinokio.
 * It creates a local API endpoint that the presentation-ai application can use.
 */

module.exports = {
  title: "Llama 4 for Presentation AI",
  description: "Run Llama 4 locally for the presentation-ai application",
  icon: "🦙",
  menu: async (kernel) => {
    return [
      {
        icon: "🔽",
        text: "Download Llama 4",
        href: "download",
      },
      {
        icon: "🚀",
        text: "Start Llama 4 API Server",
        href: "start",
      },
      {
        icon: "⏹️",
        text: "Stop Llama 4 API Server",
        href: "stop",
      }
    ]
  },
  download: async (kernel) => {
    // Create the model directory if it doesn't exist
    await kernel.shell.run({
      message: "Creating model directory",
      cmd: "mkdir -p models"
    })

    // Download Llama 4 8B Instruct model
    await kernel.shell.run({
      message: "Downloading Llama 4 8B Instruct model (this may take a while)",
      cmd: "cd models && curl -L -o llama-4-8b-instruct.gguf https://huggingface.co/meta-llama/Meta-Llama-4-8B-Instruct/resolve/main/Meta-Llama-4-8B-Instruct-Q4_K_M.gguf"
    })

    // Install required packages
    await kernel.shell.run({
      message: "Installing required packages",
      cmd: "pip install llama-cpp-python fastapi uvicorn"
    })

    return {
      success: true,
      message: "Llama 4 model downloaded successfully"
    }
  },
  start: async (kernel) => {
    // Create the API server script
    await kernel.file.write({
      path: "llama4_api_server.py",
      content: `
import os
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from llama_cpp import Llama
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import json
import asyncio
from sse_starlette.sse import EventSourceResponse

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the model
model_path = os.path.join("models", "llama-4-8b-instruct.gguf")
llm = Llama(
    model_path=model_path,
    n_ctx=4096,
    n_gpu_layers=-1,  # Use all available GPU layers
    verbose=False
)

class CompletionRequest(BaseModel):
    prompt: str
    max_tokens: Optional[int] = 2048
    temperature: Optional[float] = 0.7
    stream: Optional[bool] = False

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatCompletionRequest(BaseModel):
    messages: List[ChatMessage]
    max_tokens: Optional[int] = 2048
    temperature: Optional[float] = 0.7
    stream: Optional[bool] = False

@app.post("/v1/completions")
async def create_completion(request: CompletionRequest):
    try:
        if request.stream:
            return EventSourceResponse(
                generate_completion_stream(request),
                media_type="text/event-stream"
            )
        
        response = llm(
            request.prompt,
            max_tokens=request.max_tokens,
            temperature=request.temperature,
            echo=False
        )
        
        return {
            "id": "cmpl-llama4",
            "object": "text_completion",
            "created": 0,
            "model": "llama-4-8b-instruct",
            "choices": [
                {
                    "text": response["choices"][0]["text"],
                    "index": 0,
                    "finish_reason": "stop"
                }
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def generate_completion_stream(request: CompletionRequest):
    try:
        for chunk in llm(
            request.prompt,
            max_tokens=request.max_tokens,
            temperature=request.temperature,
            echo=False,
            stream=True
        ):
            text = chunk["choices"][0]["text"]
            if text:
                yield {
                    "data": json.dumps({
                        "id": "cmpl-llama4",
                        "object": "text_completion",
                        "created": 0,
                        "model": "llama-4-8b-instruct",
                        "choices": [
                            {
                                "text": text,
                                "index": 0,
                                "finish_reason": None
                            }
                        ]
                    })
                }
                await asyncio.sleep(0.01)  # Small delay to prevent overwhelming the client
        
        # Send the final chunk with finish_reason
        yield {
            "data": json.dumps({
                "id": "cmpl-llama4",
                "object": "text_completion",
                "created": 0,
                "model": "llama-4-8b-instruct",
                "choices": [
                    {
                        "text": "",
                        "index": 0,
                        "finish_reason": "stop"
                    }
                ]
            })
        }
    except Exception as e:
        yield {
            "data": json.dumps({
                "error": {
                    "message": str(e),
                    "type": "server_error"
                }
            })
        }

@app.post("/v1/chat/completions")
async def create_chat_completion(request: ChatCompletionRequest):
    try:
        # Convert chat messages to prompt format
        prompt = ""
        for message in request.messages:
            if message.role == "system":
                prompt += f"<|system|>\n{message.content}</s>\n"
            elif message.role == "user":
                prompt += f"<|user|>\n{message.content}</s>\n"
            elif message.role == "assistant":
                prompt += f"<|assistant|>\n{message.content}</s>\n"
        
        # Add the final assistant prompt
        prompt += "<|assistant|>\n"
        
        if request.stream:
            return EventSourceResponse(
                generate_chat_stream(prompt, request),
                media_type="text/event-stream"
            )
        
        response = llm(
            prompt,
            max_tokens=request.max_tokens,
            temperature=request.temperature,
            echo=False
        )
        
        return {
            "id": "chatcmpl-llama4",
            "object": "chat.completion",
            "created": 0,
            "model": "llama-4-8b-instruct",
            "choices": [
                {
                    "message": {
                        "role": "assistant",
                        "content": response["choices"][0]["text"]
                    },
                    "index": 0,
                    "finish_reason": "stop"
                }
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def generate_chat_stream(prompt: str, request: ChatCompletionRequest):
    try:
        for chunk in llm(
            prompt,
            max_tokens=request.max_tokens,
            temperature=request.temperature,
            echo=False,
            stream=True
        ):
            text = chunk["choices"][0]["text"]
            if text:
                yield {
                    "data": json.dumps({
                        "id": "chatcmpl-llama4",
                        "object": "chat.completion.chunk",
                        "created": 0,
                        "model": "llama-4-8b-instruct",
                        "choices": [
                            {
                                "delta": {
                                    "content": text
                                },
                                "index": 0,
                                "finish_reason": None
                            }
                        ]
                    })
                }
                await asyncio.sleep(0.01)  # Small delay to prevent overwhelming the client
        
        # Send the final chunk with finish_reason
        yield {
            "data": json.dumps({
                "id": "chatcmpl-llama4",
                "object": "chat.completion.chunk",
                "created": 0,
                "model": "llama-4-8b-instruct",
                "choices": [
                    {
                        "delta": {},
                        "index": 0,
                        "finish_reason": "stop"
                    }
                ]
            })
        }
    except Exception as e:
        yield {
            "data": json.dumps({
                "error": {
                    "message": str(e),
                    "type": "server_error"
                }
            })
        }

@app.get("/health")
async def health_check():
    return {"status": "ok", "model": "llama-4-8b-instruct"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
`
    })

    // Start the API server
    const server = await kernel.shell.run({
      message: "Starting Llama 4 API Server",
      cmd: "python llama4_api_server.py",
      on: {
        stdout: (data) => {
          kernel.print(data)
        }
      }
    })

    return {
      success: true,
      message: "Llama 4 API Server started successfully",
      server: server
    }
  },
  stop: async (kernel) => {
    // Stop the API server
    await kernel.shell.run({
      message: "Stopping Llama 4 API Server",
      cmd: "pkill -f llama4_api_server.py || true"
    })

    return {
      success: true,
      message: "Llama 4 API Server stopped successfully"
    }
  }
}

