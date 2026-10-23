# DevMate AI

A starter personal AI coding assistant built with Vite, React, Tailwind CSS, Express, and NVIDIA's OpenAI-compatible chat completions API.

## MVP features
- Coding-focused chat UI with quick prompts
- Express backend calls NVIDIA API; API key stays server-side
- Conversation context sent to the model
- Input validation, request limits, and rate limiting
- Clear API configuration errors

## Requirements
- Node.js 20+
- NVIDIA API key from https://build.nvidia.com/

## Setup
1. Copy `server/.env.example` to `server/.env` and add your NVIDIA API key.
2. From the project root run:

   ```bash
   npm install
   npm run dev
   ```

3. Open the Vite URL printed by the client (normally http://127.0.0.1:5173).

Default model: `qwen/qwen2.5-coder-32b-instruct`. Set `NVIDIA_MODEL` in `server/.env` to a model available to your account. The server calls `https://integrate.api.nvidia.com/v1/chat/completions`.

## Project structure
- `client/`: Vite + React + Tailwind UI
- `server/`: Express API

## API
- `GET /api/health`: checks server configuration without returning the API key
- `POST /api/chat`: accepts `{ "messages": [{"role":"user|assistant","content":"..."}] }`

## Limitations
This is the first UI + NVIDIA chat MVP. GitHub repository browsing and local VS Code workspace analysis are not implemented yet.

## Security
- Never put `NVIDIA_API_KEY` in client code or a `VITE_*` variable.
- Keep `.env` out of Git; `.gitignore` excludes it.
- Before public deployment, add authentication, per-user rate limits, abuse protection, and secret-redacting logs.
