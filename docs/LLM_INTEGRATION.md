# LLM Integration

ELEVARE uses the **Groq API** (Llama 3.3 70B) for all conversational AI. This document covers the integration architecture, configuration, and how the LLM fits into the broader NLP pipeline.

---

## How It Works

Every user message goes through a hybrid pipeline:

```
User Message
    ↓
1. NLP Analysis (NLTK + TextBlob)
   → keywords, sentiment, emotions, trait signals
    ↓
2. Input Sanitization
   → HTML/script tags stripped before embedding in LLM context
    ↓
3. Context Building
   → user profile + conversation history + NLP insights
    ↓
4. LLM Generation (Groq — Llama 3.3 70B)
   → career coach system prompt
   → empathetic, context-aware response
    ↓
5. Response + Trait Updates saved to MongoDB
```

The LLM never receives raw user input directly — it receives a structured context string built by `ConversationalAgent._build_context()` after sanitization.

---

## Configuration

```env
# ai-services/.env
GROQ_API_KEY=<your key from https://console.groq.com/keys>
```

LLM settings (in `utils/llm_client.py`):

| Setting | Value | Notes |
|---------|-------|-------|
| Model | `llama-3.3-70b-versatile` | Fast, high-quality |
| Max tokens | 500 | Keeps responses focused |
| Temperature | 0.7 | Balanced creativity |
| Context window | Last 5 turns | Prevents token bloat |
| Retry attempts | 3 | Exponential backoff |

---

## System Prompt

The system prompt is built dynamically by `prompts/career_coach_prompts.py` based on the user's current profile. It instructs the LLM to:

- Act as an empathetic career coach named ELEVARE
- Ask **one focused question at a time**
- Build on previous responses and detected traits
- Connect conversation insights to career paths
- Avoid generic advice

After 3+ conversations, the prompt includes the user's top career matches to guide the conversation toward actionable guidance.

---

## Groq API Client (`utils/llm_client.py`)

```python
client = GroqLLMClient()
response = client.generate_response(
    system_prompt=system_prompt,
    user_message=enhanced_context,
    conversation_history=last_5_turns,
    temperature=0.7
)
```

The client:
- Reads `GROQ_API_KEY` from environment (never hardcoded)
- Retries up to 3 times with exponential backoff on transient errors
- Returns a fallback string if all retries fail, so the backend never returns a 500 to the user

---

## Groq API Reference

**Endpoint:** `POST https://api.groq.com/openai/v1/chat/completions`

**Request:**
```json
{
  "model": "llama-3.3-70b-versatile",
  "messages": [
    {"role": "system", "content": "You are ELEVARE Career Coach..."},
    {"role": "user", "content": "I enjoy solving coding problems"}
  ],
  "max_tokens": 500,
  "temperature": 0.7
}
```

**Response:**
```json
{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "That's great! What kind of coding challenges do you find most engaging?"
      }
    }
  ]
}
```

---

## Performance

| Step | Typical Time |
|------|-------------|
| NLP analysis | < 100ms |
| LLM generation | 2–4s |
| Total per message | 2–5s |

Groq's inference is significantly faster than OpenAI for the same model size, making it well-suited for interactive chat.

---

## Groq API Limits

| Tier | Requests/min | Notes |
|------|-------------|-------|
| Free | 30 req/min | Sufficient for development and small deployments |
| Paid | Higher limits | Pay-per-token pricing |

Current pricing: ~$0.59 / 1M input tokens · ~$0.79 / 1M output tokens

Get a free API key: https://console.groq.com/keys

---

## Security

- API key is stored only in `ai-services/.env` — never committed to git, never sent to the frontend
- `ai-services/.dockerignore` excludes `.env` from Docker images
- User input is sanitized (HTML tags stripped) before being embedded in the LLM context string

---

## Testing

```bash
cd ai-services
source venv/bin/activate
python test_groq_api.py
```

This validates the API key is present and makes a test request. The key is masked in output (only first 4 and last 4 characters shown).

```bash
python test_llm_integration.py
```

Runs a full pipeline test: NLP analysis → context building → LLM generation.

---

## Fallback Behavior

If the Groq API is unavailable or all retries fail:
1. The AI service returns a generic encouraging response
2. NLP analysis and trait updates still proceed normally
3. The backend logs the error but returns a 200 to the frontend

This ensures the app remains usable even during LLM outages.

---

## Troubleshooting

**`GROQ_API_KEY not found`** — Add the key to `ai-services/.env` and restart the AI service.

**Slow responses (> 10s)** — Check your network latency to Groq's servers. Normal response time is 2–4s.

**Generic / repetitive responses** — Ensure the user profile is being passed correctly. Check that `main.py` is fetching the user profile from MongoDB before calling `ConversationalAgent.generate_response()`.

**`LLM Error` in logs** — Verify the API key is valid at https://console.groq.com/keys. Check if you've hit the rate limit.
