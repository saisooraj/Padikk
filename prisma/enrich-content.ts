// prisma/enrich-content.ts
// Run with:  npx tsx prisma/enrich-content.ts
//
// Enriches all 12 existing months with more topics, richer tasks (with descriptions),
// and a fuller resource list. Safe to run multiple times — deletes & recreates
// content for each month (same upsert pattern as seed.ts).

import "dotenv/config";
import { prisma } from "../lib/prisma";
import type { TaskType, ResourceType } from "@prisma/client";

interface TopicSeed {
  name: string;
  category: "learn" | "practice" | "build";
}
interface TaskSeed {
  title: string;
  description?: string;
  weekNumber: number;
  duration: number;
  type: TaskType;
}
interface ResourceSeed {
  title: string;
  url: string;
  type: ResourceType;
  priority: number;
}
interface ContentSeed {
  monthNumber: number;
  topics: TopicSeed[];
  tasks: TaskSeed[];
  resources: ResourceSeed[];
  project: { name: string; description: string; techStack: string[] };
}

// ---------------------------------------------------------------------------
// CONTENT
// ---------------------------------------------------------------------------

const content: ContentSeed[] = [

  // =========================================================================
  // MONTH 1 — Python Production
  // =========================================================================
  {
    monthNumber: 1,
    topics: [
      { name: "Type hints: Optional, Union, Literal, Annotated", category: "learn" },
      { name: "Advanced typing: TypeVar, Generic, Protocol, TypedDict", category: "learn" },
      { name: "Pydantic v2: BaseModel, field definitions, model_config", category: "learn" },
      { name: "Pydantic v2: @field_validator, @model_validator, computed_fields", category: "learn" },
      { name: "asyncio fundamentals: event loop, coroutines, Tasks", category: "learn" },
      { name: "asyncio patterns: gather, wait, create_task, Semaphore, timeout", category: "learn" },
      { name: "FastAPI: routing, path/query params, request body", category: "learn" },
      { name: "FastAPI: response models, status codes, HTTPException", category: "learn" },
      { name: "FastAPI: dependency injection with Depends() and scoped deps", category: "learn" },
      { name: "FastAPI: middleware, CORS, global exception handlers", category: "learn" },
      { name: "SQLAlchemy 2.0: async session, declarative models, mapped_column", category: "learn" },
      { name: "SQLAlchemy: relationships, lazy vs eager loading, joinedload", category: "learn" },
      { name: "JWT: access tokens, refresh tokens, token rotation", category: "learn" },
      { name: "pytest: fixtures, parametrize, monkeypatch, AsyncClient", category: "practice" },
      { name: "Alembic: autogenerate, upgrade, downgrade, branches", category: "practice" },
      { name: "pydantic-settings: .env files, SecretStr, layered config", category: "practice" },
      { name: "Build: IZBA Health Score API end-to-end", category: "build" },
    ],
    tasks: [
      // Week 1
      {
        title: "Master Python type hints: Optional, Union, Literal, Annotated",
        description: "Annotate 5 real functions you've written before. Add Literal for constrained strings and Annotated for metadata. Read PEP 484 & 526.",
        weekNumber: 1, duration: 60, type: "LEARN",
      },
      {
        title: "Learn advanced typing: TypeVar, Generic, Protocol",
        description: "Build a generic Repository[T] interface using Protocol. Compare Protocol vs ABC — understand structural vs nominal typing.",
        weekNumber: 1, duration: 60, type: "LEARN",
      },
      {
        title: "Learn Pydantic v2: BaseModel, validators, model_config",
        description: "Create User, Order, and Address models. Use @field_validator, @model_validator, and ConfigDict(str_strip_whitespace=True).",
        weekNumber: 1, duration: 75, type: "LEARN",
      },
      {
        title: "Deep-dive asyncio: coroutines, tasks, gather",
        description: "Write 3 async scripts: (1) sequential vs concurrent with gather, (2) task cancellation, (3) asyncio.wait with FIRST_COMPLETED.",
        weekNumber: 1, duration: 60, type: "LEARN",
      },
      {
        title: "Practice: async HTTP client with httpx + asyncio",
        description: "Fetch 10 URLs concurrently using httpx.AsyncClient. Add exponential backoff retry logic. Measure speedup vs sequential.",
        weekNumber: 1, duration: 45, type: "BUILD",
      },
      // Week 2
      {
        title: "Learn FastAPI: routing, params, request body, response models",
        description: "Build a full CRUD endpoint set for a 'Task' resource. Use Pydantic models for request/response. Add OpenAPI tags.",
        weekNumber: 2, duration: 75, type: "LEARN",
      },
      {
        title: "Learn FastAPI dependency injection: Depends() and scoped deps",
        description: "Implement a DB session dep and a get_current_user dep. Chain dependencies. Understand request-scoped vs app-scoped lifetime.",
        weekNumber: 2, duration: 60, type: "LEARN",
      },
      {
        title: "Learn FastAPI: middleware, CORS, global exception handlers",
        description: "Add request logging middleware (log method, path, duration). Configure CORS for localhost. Add a 422 validation error handler.",
        weekNumber: 2, duration: 60, type: "LEARN",
      },
      {
        title: "Practice: build a full CRUD FastAPI service with Pydantic",
        description: "Fully typed items API: POST /items, GET /items, GET /items/{id}, PATCH /items/{id}, DELETE /items/{id}. Response envelopes.",
        weekNumber: 2, duration: 75, type: "BUILD",
      },
      {
        title: "Review: REST API design best-practices checklist",
        description: "Check your service against: versioning, pagination, idempotency, error codes (RFC 7807), HATEOAS basics, content negotiation.",
        weekNumber: 2, duration: 30, type: "REVIEW",
      },
      // Week 3
      {
        title: "Learn SQLAlchemy 2.0: async session and declarative models",
        description: "Set up AsyncEngine + async_sessionmaker. Define User and Item models with mapped_column. Run queries with select().",
        weekNumber: 3, duration: 75, type: "LEARN",
      },
      {
        title: "Learn SQLAlchemy: relationships, lazy vs eager loading",
        description: "Add one-to-many (User → Items) and many-to-many (Item ↔ Tag). Use selectinload and joinedload to prevent N+1 queries.",
        weekNumber: 3, duration: 60, type: "LEARN",
      },
      {
        title: "Learn JWT: access + refresh token flow end-to-end",
        description: "Implement /auth/login (returns access + refresh), /auth/refresh (rotates both), /auth/me. Use python-jose. Store refresh in httpOnly cookie.",
        weekNumber: 3, duration: 60, type: "LEARN",
      },
      {
        title: "Practice: wire SQLAlchemy + JWT auth into your FastAPI service",
        description: "Replace in-memory store with PostgreSQL. Protect all write endpoints with the current_user dependency.",
        weekNumber: 3, duration: 75, type: "BUILD",
      },
      {
        title: "Practice: write pytest integration tests with AsyncClient",
        description: "Set up a test DB fixture (drop/create per test). Test every endpoint: happy path + 401 + 422 + 404. Use pytest-asyncio.",
        weekNumber: 3, duration: 60, type: "BUILD",
      },
      // Week 4
      {
        title: "Learn Alembic: autogenerate and apply migrations",
        description: "Configure env.py for async SQLAlchemy. Run alembic revision --autogenerate. Apply with upgrade head. Practice a downgrade.",
        weekNumber: 4, duration: 45, type: "LEARN",
      },
      {
        title: "Learn pydantic-settings: .env and layered config",
        description: "Create a Settings class with DATABASE_URL, SECRET_KEY, DEBUG. Use model_config(env_file='.env'). Inject via Depends().",
        weekNumber: 4, duration: 30, type: "LEARN",
      },
      {
        title: "Build: IZBA Health Score API — full production build",
        description: "FastAPI + PostgreSQL + JWT + Alembic. Expose health score as REST. Docker Compose for local dev (app + db + redis). Postman collection.",
        weekNumber: 4, duration: 120, type: "BUILD",
      },
      {
        title: "DSA warm-up: 3 easy array problems on LeetCode",
        description: "Two Sum, Contains Duplicate, Best Time to Buy and Sell Stock. Write the brute-force first, then optimize to O(n).",
        weekNumber: 4, duration: 45, type: "DSA",
      },
      {
        title: "Review: month 1 retro — notes and what you'd do differently",
        weekNumber: 4, duration: 30, type: "REVIEW",
      },
    ],
    resources: [
      { title: "FastAPI Official Docs", url: "https://fastapi.tiangolo.com/", type: "ARTICLE", priority: 1 },
      { title: "Pydantic v2 Docs", url: "https://docs.pydantic.dev/latest/", type: "ARTICLE", priority: 1 },
      { title: "SQLAlchemy 2.0 Docs", url: "https://docs.sqlalchemy.org/en/20/", type: "ARTICLE", priority: 1 },
      { title: "Python asyncio Docs", url: "https://docs.python.org/3/library/asyncio.html", type: "ARTICLE", priority: 1 },
      { title: "Alembic Docs", url: "https://alembic.sqlalchemy.org/en/latest/", type: "ARTICLE", priority: 2 },
      { title: "TestDriven.io: FastAPI + PostgreSQL (TDD)", url: "https://testdriven.io/blog/fastapi-crud/", type: "COURSE", priority: 2 },
      { title: "ArjanCodes YouTube — FastAPI series", url: "https://www.youtube.com/@ArjanCodes", type: "VIDEO", priority: 2 },
      { title: "pytest-asyncio Docs", url: "https://pytest-asyncio.readthedocs.io/", type: "ARTICLE", priority: 2 },
      { title: "Hypermodern Python (style guide)", url: "https://cjolowicz.github.io/posts/hypermodern-python-01-setup/", type: "ARTICLE", priority: 3 },
      { title: "The Pragmatic Programmer", url: "https://pragprog.com/titles/tpp20/", type: "BOOK", priority: 3 },
    ],
    project: {
      name: "IZBA Health Score API",
      description: "Production-grade FastAPI service computing and serving health scores via JWT-protected REST endpoints. PostgreSQL + Alembic migrations. Docker Compose for local dev. Full pytest suite.",
      techStack: ["FastAPI", "PostgreSQL", "SQLAlchemy 2.0", "JWT", "Pydantic v2", "Alembic", "Docker Compose"],
    },
  },

  // =========================================================================
  // MONTH 2 — Backend Architecture
  // =========================================================================
  {
    monthNumber: 2,
    topics: [
      { name: "Celery: task definition, decorators, result backend, workers", category: "learn" },
      { name: "Celery: chains, chords, groups, canvas — complex workflows", category: "learn" },
      { name: "Redis: strings, lists, hashes, sorted sets, sets — Python client", category: "learn" },
      { name: "Rate limiting: token bucket, sliding window, fixed window counter", category: "learn" },
      { name: "API versioning strategies: URL path, header, query param", category: "learn" },
      { name: "Structured logging with loguru / structlog + request context", category: "learn" },
      { name: "Error handling: custom exceptions, ProblemDetail (RFC 7807), Sentry", category: "learn" },
      { name: "Webhooks: payload signature, retry queues, idempotency keys", category: "learn" },
      { name: "Background tasks: FastAPI BackgroundTasks vs Celery — trade-offs", category: "learn" },
      { name: "asyncpg connection pooling, pgbouncer, pool sizing math", category: "learn" },
      { name: "N+1 query detection with sqlalchemy-utils", category: "practice" },
      { name: "Integration testing: TestClient, test DB fixtures, factory_boy", category: "practice" },
      { name: "Docker Compose: multi-service setup (API + DB + Redis + Worker)", category: "practice" },
      { name: "Build: AI Email Intelligence Service", category: "build" },
    ],
    tasks: [
      // Week 1
      {
        title: "Learn Celery: task definition, beat scheduler, workers",
        description: "Set up Celery with Redis broker. Define 3 tasks (one periodic). Run a worker. Check result backend in Redis with redis-cli.",
        weekNumber: 1, duration: 75, type: "LEARN",
      },
      {
        title: "Learn Redis data structures with Python client",
        description: "Practice each: string (counter), list (queue), hash (session store), sorted set (leaderboard). Use redis-py / redis.asyncio.",
        weekNumber: 1, duration: 60, type: "LEARN",
      },
      {
        title: "Learn rate limiting patterns: token bucket and sliding window",
        description: "Implement both in Redis. Understand pros/cons for each. Test under burst traffic with locust or a simple script.",
        weekNumber: 1, duration: 60, type: "LEARN",
      },
      {
        title: "Practice: add Redis-backed rate limiter as FastAPI middleware",
        description: "Limit by IP and by API key independently. Return 429 with Retry-After header. Write tests for the rate limit boundary.",
        weekNumber: 1, duration: 60, type: "BUILD",
      },
      {
        title: "DSA: 3 problems — arrays (LeetCode Easy/Medium)",
        description: "Product of Array Except Self, Maximum Subarray, 3Sum. Focus on the sliding-window and prefix-sum patterns.",
        weekNumber: 1, duration: 45, type: "DSA",
      },
      // Week 2
      {
        title: "Learn API versioning and structured logging",
        description: "Compare URL (/v1/), header (Accept-Version), and query param strategies. Add loguru with request_id context var.",
        weekNumber: 2, duration: 60, type: "LEARN",
      },
      {
        title: "Learn error handling: custom exceptions and RFC 7807",
        description: "Define AppError hierarchy. Write a global handler that returns application/problem+json. Integrate Sentry with FastAPI.",
        weekNumber: 2, duration: 60, type: "LEARN",
      },
      {
        title: "Learn webhooks: signature verification, retry, idempotency",
        description: "Build a /webhook endpoint that verifies HMAC-SHA256 signature. Add idempotency_key dedup with Redis TTL.",
        weekNumber: 2, duration: 60, type: "LEARN",
      },
      {
        title: "Practice: instrument structured logging in your API",
        description: "Log every request with method, path, status, duration, request_id. Add Sentry breadcrumbs for slow queries (> 500ms).",
        weekNumber: 2, duration: 45, type: "BUILD",
      },
      {
        title: "Review: API quality checklist — apply to month 1 project",
        description: "Check: versioning, pagination (cursor vs offset), structured errors, logging, rate limiting, OWASP basics.",
        weekNumber: 2, duration: 30, type: "REVIEW",
      },
      // Week 3
      {
        title: "Learn Celery: chains, chords, and canvas workflows",
        description: "Build a multi-step pipeline with chain(). Use chord() for fan-out/fan-in. Handle task retries and failure callbacks.",
        weekNumber: 3, duration: 60, type: "LEARN",
      },
      {
        title: "Learn asyncpg connection pooling and pool sizing",
        description: "Understand pool_size = (cores * 2) + 1. Set up asyncpg pool. Monitor with pg_stat_activity. Detect N+1 queries.",
        weekNumber: 3, duration: 45, type: "LEARN",
      },
      {
        title: "Learn Docker Compose: multi-service orchestration",
        description: "Write a compose.yml with: api, postgres, redis, celery-worker, flower. Add health checks and depends_on: condition.",
        weekNumber: 3, duration: 60, type: "LEARN",
      },
      {
        title: "Practice: Dockerize the full API stack",
        description: "Multi-stage Dockerfile (build + runtime stage). Non-root user. Layer caching for pip install. .dockerignore.",
        weekNumber: 3, duration: 60, type: "BUILD",
      },
      {
        title: "Practice: integration tests with factory_boy + test DB",
        description: "Set up a test Postgres container fixture. Use factory_boy to create test data. Test Celery tasks with CELERY_TASK_ALWAYS_EAGER.",
        weekNumber: 3, duration: 60, type: "BUILD",
      },
      // Week 4
      {
        title: "Build: AI Email Intelligence Service — core pipeline",
        description: "Celery worker receives email, calls LLM for classification + summary, stores result in PostgreSQL, returns job_id immediately.",
        weekNumber: 4, duration: 120, type: "BUILD",
      },
      {
        title: "Practice: add webhook callback to Email Intelligence Service",
        description: "On job completion, POST result to caller's webhook URL. Retry up to 3 times on failure. Log all attempts.",
        weekNumber: 4, duration: 60, type: "BUILD",
      },
      {
        title: "DSA: 3 problems — strings (LeetCode Medium)",
        description: "Longest Substring Without Repeating Characters, Longest Repeating Character Replacement, Minimum Window Substring.",
        weekNumber: 4, duration: 45, type: "DSA",
      },
      {
        title: "Review: month 2 retro and architecture diagram",
        description: "Draw the full data flow: HTTP request → rate limiter → handler → Celery task → Redis → PostgreSQL → webhook. Add to project README.",
        weekNumber: 4, duration: 30, type: "REVIEW",
      },
    ],
    resources: [
      { title: "Celery Docs", url: "https://docs.celeryq.dev/", type: "ARTICLE", priority: 1 },
      { title: "Redis Docs", url: "https://redis.io/docs/latest/", type: "ARTICLE", priority: 1 },
      { title: "Docker Docs", url: "https://docs.docker.com/", type: "ARTICLE", priority: 1 },
      { title: "FastAPI Advanced User Guide", url: "https://fastapi.tiangolo.com/advanced/", type: "ARTICLE", priority: 1 },
      { title: "Redis University: RU101 (free)", url: "https://university.redis.io/", type: "COURSE", priority: 2 },
      { title: "loguru Docs", url: "https://loguru.readthedocs.io/", type: "ARTICLE", priority: 2 },
      { title: "Sentry FastAPI Integration", url: "https://docs.sentry.io/platforms/python/integrations/fastapi/", type: "ARTICLE", priority: 2 },
      { title: "factory_boy Docs", url: "https://factoryboy.readthedocs.io/", type: "ARTICLE", priority: 2 },
      { title: "RFC 7807: Problem Details for HTTP APIs", url: "https://www.rfc-editor.org/rfc/rfc7807", type: "ARTICLE", priority: 3 },
      { title: "The Art of PostgreSQL", url: "https://theartofpostgresql.com/", type: "BOOK", priority: 3 },
    ],
    project: {
      name: "AI Email Intelligence Service",
      description: "Queue-backed FastAPI service: accepts email threads via REST, dispatches Celery workers to classify and summarize with an LLM, stores structured results in PostgreSQL, fires webhook callbacks on completion. Rate-limited, structured logging, RFC 7807 errors.",
      techStack: ["FastAPI", "Celery", "Redis", "PostgreSQL", "Docker Compose", "loguru"],
    },
  },

  // =========================================================================
  // MONTH 3 — LLM APIs + Structured Output
  // =========================================================================
  {
    monthNumber: 3,
    topics: [
      { name: "OpenAI API: completions, chat, vision, audio endpoints", category: "learn" },
      { name: "Anthropic API: messages, streaming, tool_use, extended thinking", category: "learn" },
      { name: "Gemini API: multimodal input, grounding, safety settings", category: "learn" },
      { name: "Structured output: JSON mode, response_format, Instructor library", category: "learn" },
      { name: "Tool / function calling: parallel calls, error handling, retries", category: "learn" },
      { name: "Streaming: SSE, chunked responses, token-by-token rendering", category: "learn" },
      { name: "Prompt engineering: few-shot, chain-of-thought, XML tags, role prompts", category: "learn" },
      { name: "Context window management: summarisation, chunking, sliding window", category: "learn" },
      { name: "Token counting, cost estimation, budget enforcement", category: "learn" },
      { name: "Model selection: capability vs latency vs cost trade-offs", category: "learn" },
      { name: "Retry logic: exponential backoff, rate-limit headers, fallback models", category: "practice" },
      { name: "Prompt versioning and A/B testing basics", category: "practice" },
      { name: "Build: AI Streaming Chat App", category: "build" },
    ],
    tasks: [
      // Week 1
      {
        title: "Learn OpenAI API: completions, chat, and vision",
        description: "Call gpt-4o with text, then with an image. Use response_format=json_object for a structured extraction. Check token usage in the response.",
        weekNumber: 1, duration: 60, type: "LEARN",
      },
      {
        title: "Learn Anthropic API: messages, streaming, tool_use",
        description: "Call claude-sonnet-4-6 with streaming. Implement tool_use for a simple calculator tool. Compare latency vs OpenAI.",
        weekNumber: 1, duration: 60, type: "LEARN",
      },
      {
        title: "Learn prompt engineering: few-shot, CoT, XML tags",
        description: "Write 5 prompts for the same task using different techniques. Measure output quality. Apply Anthropic's XML tag guidelines.",
        weekNumber: 1, duration: 60, type: "LEARN",
      },
      {
        title: "Practice: call all 3 providers from one FastAPI endpoint",
        description: "Build /completions?provider=openai|anthropic|gemini. Return normalized response. Track latency and token cost per call.",
        weekNumber: 1, duration: 60, type: "BUILD",
      },
      {
        title: "DSA: 3 hash map problems (LeetCode Easy/Medium)",
        description: "Group Anagrams, Top K Frequent Elements, Valid Anagram. Own the frequency-counting pattern.",
        weekNumber: 1, duration: 45, type: "DSA",
      },
      // Week 2
      {
        title: "Learn function/tool calling: parallel calls and error handling",
        description: "Build a weather + calendar dual-tool agent. Force the model to call both in parallel. Handle tool_call_id in the response.",
        weekNumber: 2, duration: 75, type: "LEARN",
      },
      {
        title: "Learn Instructor library for structured output extraction",
        description: "Use instructor to extract a PersonProfile Pydantic model from 5 different texts. Try with_retries for validation failures.",
        weekNumber: 2, duration: 60, type: "LEARN",
      },
      {
        title: "Learn context window management and token counting",
        description: "Count tokens with tiktoken. Implement a summarise-oldest strategy when conversation exceeds 80% of context window.",
        weekNumber: 2, duration: 60, type: "LEARN",
      },
      {
        title: "Practice: build a structured entity extraction endpoint",
        description: "POST /extract → returns {entities: [{name, type, confidence}]}. Support async streaming of partial results.",
        weekNumber: 2, duration: 60, type: "BUILD",
      },
      {
        title: "Review: provider trade-offs matrix — capability, latency, cost",
        description: "Build a table: GPT-4o vs Claude Sonnet vs Gemini Flash across 5 tasks. Note where each shines and where it fails.",
        weekNumber: 2, duration: 30, type: "REVIEW",
      },
      // Week 3
      {
        title: "Learn streaming: SSE, chunked responses, Next.js rendering",
        description: "Stream tokens to the browser using FastAPI + SSE + EventSource. Add a stop-generation button. Measure TTFB vs non-streaming.",
        weekNumber: 3, duration: 60, type: "LEARN",
      },
      {
        title: "Learn retry logic: backoff, rate-limit headers, fallback models",
        description: "Implement tenacity retry with jitter. Parse x-ratelimit-* headers. Fall back to cheaper model on 429. Log all retries.",
        weekNumber: 3, duration: 45, type: "LEARN",
      },
      {
        title: "Learn prompt versioning and basic A/B testing",
        description: "Store prompt versions in PostgreSQL with a hash. Track which version produced which output. Sample 50/50 between two versions.",
        weekNumber: 3, duration: 45, type: "LEARN",
      },
      {
        title: "Practice: add Celery worker for async LLM jobs",
        description: "For long completions: POST returns job_id, Celery worker calls LLM, result stored in Redis, GET /jobs/{id} polls status.",
        weekNumber: 3, duration: 60, type: "BUILD",
      },
      {
        title: "DSA: 3 two-pointer problems (LeetCode Medium)",
        description: "Two Sum II, 3Sum, Container With Most Water. Own the pattern of moving left/right pointers based on sum comparison.",
        weekNumber: 3, duration: 45, type: "DSA",
      },
      // Week 4
      {
        title: "Build: AI Streaming Chat App — frontend + backend",
        description: "Next.js chat UI with streaming token display. Multi-provider toggle (Claude / GPT-4o / Gemini Flash). Cost tracker per session. Dark theme.",
        weekNumber: 4, duration: 120, type: "BUILD",
      },
      {
        title: "Practice: add conversation history and context management",
        description: "Store messages in PostgreSQL per session. Implement sliding-window context: drop oldest when token count > 8000.",
        weekNumber: 4, duration: 60, type: "BUILD",
      },
      {
        title: "Read: Anthropic's prompt engineering guide cover-to-cover",
        description: "docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview — take notes on each technique, try each in the playground.",
        weekNumber: 4, duration: 45, type: "READ",
      },
      {
        title: "Review: month 3 retro — prompt quality improvements logged",
        weekNumber: 4, duration: 30, type: "REVIEW",
      },
    ],
    resources: [
      { title: "OpenAI API Docs", url: "https://platform.openai.com/docs", type: "ARTICLE", priority: 1 },
      { title: "Anthropic API Docs", url: "https://docs.anthropic.com/", type: "ARTICLE", priority: 1 },
      { title: "Google Gemini API Docs", url: "https://ai.google.dev/gemini-api/docs", type: "ARTICLE", priority: 1 },
      { title: "Instructor Library (structured output)", url: "https://python.useinstructor.com/", type: "REPO", priority: 1 },
      { title: "Anthropic Prompt Engineering Guide", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview", type: "ARTICLE", priority: 1 },
      { title: "Prompt Engineering Guide (promptingguide.ai)", url: "https://www.promptingguide.ai/", type: "ARTICLE", priority: 2 },
      { title: "tiktoken (OpenAI tokenizer)", url: "https://github.com/openai/tiktoken", type: "REPO", priority: 2 },
      { title: "tenacity (retry library)", url: "https://tenacity.readthedocs.io/", type: "ARTICLE", priority: 2 },
      { title: "Vercel AI SDK Docs (streaming UI)", url: "https://sdk.vercel.ai/docs", type: "ARTICLE", priority: 2 },
      { title: "Building LLM Applications for Production (Chip Huyen)", url: "https://huyenchip.com/2023/04/11/llm-engineering.html", type: "ARTICLE", priority: 2 },
    ],
    project: {
      name: "AI Streaming Chat App",
      description: "Next.js chat interface with real-time token streaming from Claude, GPT-4o, and Gemini Flash. Per-session cost tracking, conversation history in PostgreSQL, sliding-window context management, provider toggle, dark theme.",
      techStack: ["Next.js", "FastAPI", "OpenAI API", "Anthropic API", "Gemini API", "SSE", "PostgreSQL"],
    },
  },

  // =========================================================================
  // MONTH 4 — RAG + Embeddings + Vector Search
  // =========================================================================
  {
    monthNumber: 4,
    topics: [
      { name: "Embeddings: what they represent, cosine similarity, dot product", category: "learn" },
      { name: "Embedding models: OpenAI text-embedding-3, Cohere, sentence-transformers", category: "learn" },
      { name: "Chunking strategies: fixed-size, recursive, semantic, sliding window", category: "learn" },
      { name: "Vector DBs: Qdrant vs Pinecone vs pgvector — capabilities and trade-offs", category: "learn" },
      { name: "Qdrant: collections, points, payload, distance metrics, filters", category: "learn" },
      { name: "pgvector: hnsw index, ivfflat, ANN search, integration with SQLAlchemy", category: "learn" },
      { name: "Hybrid search: BM25 (sparse) + dense — reciprocal rank fusion", category: "learn" },
      { name: "Reranking: cross-encoders, Cohere Rerank, FlashRank", category: "learn" },
      { name: "Advanced RAG: query expansion, HyDE (hypothetical document embeddings)", category: "learn" },
      { name: "Multi-query retrieval and step-back prompting", category: "learn" },
      { name: "Retrieval evaluation: MRR, NDCG, recall@k, RAGAS", category: "practice" },
      { name: "PDF/document ingestion pipeline: PyMuPDF, pdfplumber, Unstructured", category: "practice" },
      { name: "Build: PDF RAG Chatbot with citations", category: "build" },
    ],
    tasks: [
      // Week 1
      {
        title: "Learn embeddings: cosine similarity, distance metrics",
        description: "Embed 20 sentences. Compute cosine similarity matrix. Visualise with PCA. Understand why L2 normalised embeddings make dot product == cosine.",
        weekNumber: 1, duration: 60, type: "LEARN",
      },
      {
        title: "Learn chunking strategies: fixed, recursive, semantic",
        description: "Chunk the same 10-page PDF 3 ways. Count chunks, measure average token length. Evaluate which preserves most context.",
        weekNumber: 1, duration: 60, type: "LEARN",
      },
      {
        title: "Learn Qdrant: collections, points, payload, filters",
        description: "Stand up Qdrant locally with Docker. Create a collection, upsert 100 points with payload, run a filtered nearest-neighbour search.",
        weekNumber: 1, duration: 60, type: "LEARN",
      },
      {
        title: "Practice: build a document ingestion pipeline",
        description: "PyMuPDF → text extract → recursive chunking → embed with text-embedding-3-small → upsert to Qdrant with metadata payload.",
        weekNumber: 1, duration: 75, type: "BUILD",
      },
      {
        title: "DSA: 3 binary search problems (LeetCode Easy/Medium)",
        description: "Binary Search, Search in Rotated Sorted Array, Find Minimum in Rotated Sorted Array. Own the lo/hi/mid pointer pattern.",
        weekNumber: 1, duration: 45, type: "DSA",
      },
      // Week 2
      {
        title: "Learn pgvector: hnsw index and SQLAlchemy integration",
        description: "Add pgvector extension to PostgreSQL. Define a Document model with Vector(1536) column. Create hnsw index. Run ANN queries from SQLAlchemy.",
        weekNumber: 2, duration: 60, type: "LEARN",
      },
      {
        title: "Learn hybrid search: BM25 + dense + reciprocal rank fusion",
        description: "Implement BM25 with rank_bm25. Merge BM25 and dense search results using RRF. Compare against pure dense search on 5 queries.",
        weekNumber: 2, duration: 75, type: "LEARN",
      },
      {
        title: "Learn reranking: cross-encoders and Cohere Rerank",
        description: "Run Cohere Rerank on the top-20 results from hybrid search. Measure MRR before and after. Understand latency trade-off.",
        weekNumber: 2, duration: 60, type: "LEARN",
      },
      {
        title: "Practice: wire retrieval pipeline to LLM generation",
        description: "retrieve(query) → rerank → build context with citations → stream LLM answer → return answer + source chunks.",
        weekNumber: 2, duration: 75, type: "BUILD",
      },
      {
        title: "Review: retrieval quality audit on 10 test questions",
        description: "For each question: check if the correct source chunk was in top-5. Log failures. Identify which chunking or retrieval step is the bottleneck.",
        weekNumber: 2, duration: 30, type: "REVIEW",
      },
      // Week 3
      {
        title: "Learn advanced RAG: HyDE and query expansion",
        description: "Implement HyDE: generate a hypothetical answer, embed it, use for retrieval. Compare recall@5 vs direct query embedding.",
        weekNumber: 3, duration: 60, type: "LEARN",
      },
      {
        title: "Learn RAGAS: retrieval evaluation framework",
        description: "Set up RAGAS. Evaluate your pipeline on 20 QA pairs: faithfulness, answer relevancy, context precision, context recall.",
        weekNumber: 3, duration: 60, type: "LEARN",
      },
      {
        title: "Learn multi-query retrieval and step-back prompting",
        description: "Generate 3 query variants per input. Deduplicate retrieved chunks. Compare RAGAS scores vs single-query baseline.",
        weekNumber: 3, duration: 45, type: "LEARN",
      },
      {
        title: "Practice: add citation tracking to RAG responses",
        description: "Every answer references source document, page, and chunk. Store citations in PostgreSQL. Display inline in the chat UI.",
        weekNumber: 3, duration: 60, type: "BUILD",
      },
      {
        title: "DSA: 3 linked list problems (LeetCode Easy/Medium)",
        description: "Reverse Linked List, Merge Two Sorted Lists, Linked List Cycle. Own the fast/slow pointer and dummy-head patterns.",
        weekNumber: 3, duration: 45, type: "DSA",
      },
      // Week 4
      {
        title: "Build: PDF RAG Chatbot — full app with React frontend",
        description: "Upload PDF → ingest pipeline → hybrid search + rerank → streaming answer with inline citations. FastAPI backend, Next.js frontend. Dockerised.",
        weekNumber: 4, duration: 120, type: "BUILD",
      },
      {
        title: "Practice: add multi-document support and namespace filtering",
        description: "Allow user to upload multiple PDFs. Add Qdrant payload filter to restrict retrieval to selected documents.",
        weekNumber: 4, duration: 60, type: "BUILD",
      },
      {
        title: "Read: RAGAS paper and Qdrant hybrid search docs",
        description: "https://arxiv.org/abs/2309.15217 — RAGAS paper. Note which metrics correlate with human judgment. Apply findings to your eval.",
        weekNumber: 4, duration: 30, type: "READ",
      },
      {
        title: "Review: month 4 retro — RAGAS scores vs baseline",
        weekNumber: 4, duration: 30, type: "REVIEW",
      },
    ],
    resources: [
      { title: "Qdrant Docs", url: "https://qdrant.tech/documentation/", type: "ARTICLE", priority: 1 },
      { title: "pgvector GitHub", url: "https://github.com/pgvector/pgvector", type: "REPO", priority: 1 },
      { title: "OpenAI Embeddings Guide", url: "https://platform.openai.com/docs/guides/embeddings", type: "ARTICLE", priority: 1 },
      { title: "RAGAS: RAG Evaluation Framework", url: "https://docs.ragas.io/", type: "ARTICLE", priority: 1 },
      { title: "LangChain Text Splitters Docs", url: "https://python.langchain.com/docs/concepts/text_splitters/", type: "ARTICLE", priority: 2 },
      { title: "Cohere Rerank Docs", url: "https://docs.cohere.com/docs/reranking", type: "ARTICLE", priority: 2 },
      { title: "sentence-transformers Docs", url: "https://www.sbert.net/", type: "ARTICLE", priority: 2 },
      { title: "PyMuPDF Docs", url: "https://pymupdf.readthedocs.io/", type: "ARTICLE", priority: 2 },
      { title: "Pinecone: Vector Embeddings Guide", url: "https://www.pinecone.io/learn/vector-embeddings/", type: "ARTICLE", priority: 3 },
      { title: "FlashRank: fast reranking library", url: "https://github.com/PrithivirajDamodaran/FlashRank", type: "REPO", priority: 3 },
    ],
    project: {
      name: "PDF RAG Chatbot",
      description: "Multi-document RAG chatbot: PDF upload → recursive chunking → hybrid dense+sparse search → Cohere reranking → streaming LLM answer with inline citations. RAGAS eval harness. FastAPI + Next.js. Dockerised.",
      techStack: ["FastAPI", "Qdrant", "pgvector", "OpenAI Embeddings", "Hybrid Search", "Cohere Rerank", "RAGAS", "Next.js"],
    },
  },

  // =========================================================================
  // MONTH 5 — Agents + MCP + Tool Calling + LangGraph
  // =========================================================================
  {
    monthNumber: 5,
    topics: [
      { name: "Agent architectures: ReAct, plan-and-execute, reflexion", category: "learn" },
      { name: "LangGraph: StateGraph, nodes, edges, conditional branching", category: "learn" },
      { name: "LangGraph: persistence, checkpointers, human-in-the-loop", category: "learn" },
      { name: "LangGraph: multi-agent: supervisor, swarm, handoff patterns", category: "learn" },
      { name: "MCP protocol: transports (stdio, HTTP/SSE), tool schemas, roots", category: "learn" },
      { name: "Building custom MCP servers: FastMCP, python-sdk", category: "learn" },
      { name: "Tool design: idempotency, retries, error messages for LLMs", category: "learn" },
      { name: "Memory patterns: in-context, summary, external (Redis, Postgres)", category: "learn" },
      { name: "Agent reliability: guardrails, timeouts, circuit breakers, human gates", category: "learn" },
      { name: "DSPy: declarative prompt optimisation basics (BootstrapFewShot)", category: "learn" },
      { name: "Agent observability: trace-level logging with LangSmith / Phoenix", category: "practice" },
      { name: "Build: AI Research Agent with MCP tool server", category: "build" },
    ],
    tasks: [
      // Week 1
      {
        title: "Learn LangGraph: StateGraph, nodes, edges",
        description: "Build a simple 3-node graph: input → process → output. Add conditional branching based on state field. Visualise the graph with draw_mermaid().",
        weekNumber: 1, duration: 75, type: "LEARN",
      },
      {
        title: "Learn LangGraph: persistence and checkpointers",
        description: "Add MemorySaver checkpointer. Thread_id allows multi-turn. Add a human-in-the-loop interrupt node that waits for approval.",
        weekNumber: 1, duration: 60, type: "LEARN",
      },
      {
        title: "Learn ReAct agent architecture",
        description: "Implement a ReAct loop from scratch (no framework): Thought → Action → Observation → Thought. Use 3 tools: search, calculator, memory.",
        weekNumber: 1, duration: 60, type: "LEARN",
      },
      {
        title: "Practice: build a simple LangGraph tool-calling agent",
        description: "Agent with 3 tools: web search, read_file, write_file. Test with 5 multi-step tasks. Log each thought/action/observation.",
        weekNumber: 1, duration: 75, type: "BUILD",
      },
      {
        title: "DSA: 3 stack problems (LeetCode Medium)",
        description: "Valid Parentheses, Min Stack, Evaluate Reverse Polish Notation. Own the stack-as-monotone and auxiliary-stack patterns.",
        weekNumber: 1, duration: 45, type: "DSA",
      },
      // Week 2
      {
        title: "Learn MCP protocol: transports, tool schemas, roots",
        description: "Read the MCP spec. Understand stdio vs HTTP/SSE transports. Inspect the schema of 3 published MCP servers (filesystem, brave-search, github).",
        weekNumber: 2, duration: 60, type: "LEARN",
      },
      {
        title: "Build: custom MCP server with FastMCP",
        description: "Expose your RAG chatbot (M4) as an MCP tool: search_documents(query) → returns ranked chunks. Test with Claude Desktop.",
        weekNumber: 2, duration: 90, type: "BUILD",
      },
      {
        title: "Learn tool design best practices for LLMs",
        description: "Principles: idempotency, descriptive names, error messages that guide the LLM, bounded return sizes. Refactor your M5 tools.",
        weekNumber: 2, duration: 45, type: "LEARN",
      },
      {
        title: "Practice: multi-agent system — supervisor + worker pattern",
        description: "Supervisor routes tasks to: ResearchWorker (web search), AnalysisWorker (code execution), WriterWorker (report generation).",
        weekNumber: 2, duration: 75, type: "BUILD",
      },
      {
        title: "Review: agent failure modes — where did it go wrong?",
        description: "Run your agent on 10 tasks. Categorise failures: tool call error, infinite loop, context overflow, wrong tool, hallucinated tool output.",
        weekNumber: 2, duration: 30, type: "REVIEW",
      },
      // Week 3
      {
        title: "Learn agent memory: in-context, summary, external",
        description: "Implement 3 memory strategies: (1) full history in context, (2) rolling summary, (3) PostgreSQL episodic store with semantic search.",
        weekNumber: 3, duration: 60, type: "LEARN",
      },
      {
        title: "Learn agent reliability: guardrails and circuit breakers",
        description: "Add: max_iterations guard, tool call timeout (asyncio.wait_for), LLM output validation (Pydantic), human approval gate for destructive actions.",
        weekNumber: 3, duration: 60, type: "LEARN",
      },
      {
        title: "Learn DSPy basics: BootstrapFewShot optimiser",
        description: "Define a dspy.Signature for entity extraction. Use BootstrapFewShot to auto-generate few-shot examples from your training set.",
        weekNumber: 3, duration: 60, type: "LEARN",
      },
      {
        title: "Practice: instrument agent with Phoenix trace-level logging",
        description: "Add OpenTelemetry traces to every tool call and LLM call. View in Phoenix UI. Identify which step has the highest latency.",
        weekNumber: 3, duration: 45, type: "BUILD",
      },
      {
        title: "DSA: 3 tree problems (LeetCode Easy/Medium)",
        description: "Invert Binary Tree, Maximum Depth of Binary Tree, Diameter of Binary Tree. Own iterative DFS with a stack.",
        weekNumber: 3, duration: 45, type: "DSA",
      },
      // Week 4
      {
        title: "Build: AI Research Agent — full production version",
        description: "LangGraph supervisor → [WebSearch, RAGSearch(MCP), CodeExec, ReportWriter] workers. Persistent memory in PostgreSQL. Human approval gate. Structured final report.",
        weekNumber: 4, duration: 120, type: "BUILD",
      },
      {
        title: "Practice: add streaming intermediate steps to frontend",
        description: "Expose agent thought/action/observation events as SSE. Show live step log in Next.js UI. Add cancel button (sets interrupt flag in graph state).",
        weekNumber: 4, duration: 60, type: "BUILD",
      },
      {
        title: "Read: Anthropic's Building Effective Agents article",
        description: "https://www.anthropic.com/research/building-effective-agents — note their principles for tool design, orchestration, and when NOT to use agents.",
        weekNumber: 4, duration: 30, type: "READ",
      },
      {
        title: "Review: month 5 retro — agent reliability scores",
        weekNumber: 4, duration: 30, type: "REVIEW",
      },
    ],
    resources: [
      { title: "LangGraph Docs", url: "https://langchain-ai.github.io/langgraph/", type: "ARTICLE", priority: 1 },
      { title: "Model Context Protocol Spec", url: "https://modelcontextprotocol.io/", type: "ARTICLE", priority: 1 },
      { title: "FastMCP (Python MCP server library)", url: "https://github.com/jlowin/fastmcp", type: "REPO", priority: 1 },
      { title: "Anthropic: Building Effective Agents", url: "https://www.anthropic.com/research/building-effective-agents", type: "ARTICLE", priority: 1 },
      { title: "DSPy Docs", url: "https://dspy.ai/", type: "ARTICLE", priority: 2 },
      { title: "Arize Phoenix (agent tracing)", url: "https://docs.arize.com/phoenix", type: "ARTICLE", priority: 2 },
      { title: "LangGraph: Multi-Agent Architectures", url: "https://langchain-ai.github.io/langgraph/concepts/multi_agent/", type: "ARTICLE", priority: 2 },
      { title: "ReAct: Reasoning and Acting Paper", url: "https://arxiv.org/abs/2210.03629", type: "ARTICLE", priority: 3 },
      { title: "Reflexion: Language Agents with Verbal Reinforcement Learning", url: "https://arxiv.org/abs/2303.11366", type: "ARTICLE", priority: 3 },
    ],
    project: {
      name: "AI Research Agent",
      description: "LangGraph supervisor orchestrates WebSearch, RAGSearch (custom MCP server), CodeExec, and ReportWriter workers. Persistent episodic memory in PostgreSQL. Human approval gate for sensitive actions. Traces in Phoenix. Structured report output.",
      techStack: ["LangGraph", "MCP", "FastMCP", "FastAPI", "PostgreSQL", "Phoenix", "Next.js"],
    },
  },

  // =========================================================================
  // MONTH 6 — AI Evals + Observability + Queues
  // =========================================================================
  {
    monthNumber: 6,
    topics: [
      { name: "Eval taxonomy: offline vs online, unit vs integration, human vs LLM-judge", category: "learn" },
      { name: "LLM-as-judge: grading prompts, bias mitigation, calibration", category: "learn" },
      { name: "Eval frameworks: Braintrust, Opik, Phoenix, LangSmith", category: "learn" },
      { name: "Eval metrics: faithfulness, answer relevancy, toxicity, groundedness", category: "learn" },
      { name: "Prompt regression testing: CI/CD integration for evals", category: "learn" },
      { name: "A/B prompt testing: statistical significance, sample sizes", category: "learn" },
      { name: "OpenTelemetry: spans, traces, attributes for LLM apps", category: "learn" },
      { name: "Latency profiling: TTFB, time-to-last-token, p95 SLOs", category: "learn" },
      { name: "Cost dashboards: per-model, per-user, per-feature tracking", category: "learn" },
      { name: "Redis Streams for async AI pipeline fan-out", category: "learn" },
      { name: "Celery: monitoring with Flower, task priorities, ETA", category: "practice" },
      { name: "Build: AI Evaluation Dashboard", category: "build" },
    ],
    tasks: [
      // Week 1
      {
        title: "Learn eval taxonomy: offline vs online, unit vs LLM-judge",
        description: "Map each eval type to a use case. Write 5 unit evals (exact match / regex) and 5 LLM-judge evals for your M5 research agent.",
        weekNumber: 1, duration: 60, type: "LEARN",
      },
      {
        title: "Learn Braintrust: experiments, datasets, scoring",
        description: "Set up a Braintrust project. Define a dataset of 20 QA pairs. Run an experiment that scores on correctness and groundedness.",
        weekNumber: 1, duration: 75, type: "LEARN",
      },
      {
        title: "Learn LLM-as-judge: grading prompts and bias mitigation",
        description: "Write 3 judge prompts for: factual accuracy, instruction following, toxicity. Calibrate against 10 human-labelled examples.",
        weekNumber: 1, duration: 60, type: "LEARN",
      },
      {
        title: "Practice: write a first eval suite for the RAG chatbot (M4)",
        description: "20 QA pairs. Metrics: answer correctness, faithfulness, citation accuracy. Run in Braintrust. Baseline score logged.",
        weekNumber: 1, duration: 60, type: "BUILD",
      },
      {
        title: "DSA: 3 tree problems (LeetCode Medium)",
        description: "Level Order Traversal, Right Side View, Lowest Common Ancestor. Own BFS with deque and iterative LCA.",
        weekNumber: 1, duration: 45, type: "DSA",
      },
      // Week 2
      {
        title: "Learn OpenTelemetry: spans, traces, and LLM attributes",
        description: "Instrument your FastAPI + LLM calls with OTel. Add gen_ai.* semantic conventions. Export to Jaeger locally. View full traces.",
        weekNumber: 2, duration: 75, type: "LEARN",
      },
      {
        title: "Learn latency profiling: TTFB, p95, SLOs for LLM apps",
        description: "Measure TTFB and TTLT for 100 requests. Plot p50/p95/p99. Define SLOs: TTFB < 500ms p95, TTLT < 3s p95. Alert if violated.",
        weekNumber: 2, duration: 60, type: "LEARN",
      },
      {
        title: "Learn cost tracking: per-model, per-user, per-feature",
        description: "Parse OpenAI/Anthropic usage response. Store in PostgreSQL: model, prompt_tokens, completion_tokens, cost_usd, user_id, feature_tag.",
        weekNumber: 2, duration: 45, type: "LEARN",
      },
      {
        title: "Practice: add OTel trace instrumentation to the M5 agent",
        description: "Span every tool call, LLM call, retrieval step. Add span attributes: model, token_count, latency, tool_name, error.",
        weekNumber: 2, duration: 60, type: "BUILD",
      },
      {
        title: "Review: latency and cost baseline for all M1–M5 services",
        description: "Run a quick benchmark on each service. Log p95 latency and cost-per-1000-calls. This is your optimisation baseline.",
        weekNumber: 2, duration: 30, type: "REVIEW",
      },
      // Week 3
      {
        title: "Learn Redis Streams for AI pipeline fan-out",
        description: "XADD job events to a stream. Multiple consumers (XREADGROUP): eval worker, logging worker, cost worker. Implement XACK and dead-letter.",
        weekNumber: 3, duration: 60, type: "LEARN",
      },
      {
        title: "Learn A/B prompt testing with statistical significance",
        description: "Split traffic 50/50 across 2 prompt versions. Collect 100 LLM-judge scores each. Run Mann-Whitney U test. Accept new prompt if p < 0.05 and delta > 5%.",
        weekNumber: 3, duration: 60, type: "LEARN",
      },
      {
        title: "Learn Celery monitoring: Flower, task priorities, ETA",
        description: "Run Flower UI. Add priority queues: high (eval), medium (generation), low (logging). Use eta for scheduled re-evals.",
        weekNumber: 3, duration: 45, type: "LEARN",
      },
      {
        title: "Practice: CI/CD eval gate in GitHub Actions",
        description: "On PR: run eval suite against both old and new prompt. Fail CI if correctness drops > 5%. Post score diff as PR comment.",
        weekNumber: 3, duration: 60, type: "BUILD",
      },
      {
        title: "DSA: 3 graph problems (LeetCode Medium)",
        description: "Number of Islands, Clone Graph, Pacific Atlantic Water Flow. Own BFS/DFS on adjacency list and visited set.",
        weekNumber: 3, duration: 45, type: "DSA",
      },
      // Week 4
      {
        title: "Build: AI Evaluation Dashboard — full React app",
        description: "React dashboard: eval score history (line chart), cost breakdown (bar chart by model/feature), latency p95 trend, active experiments table. FastAPI + PostgreSQL backend.",
        weekNumber: 4, duration: 120, type: "BUILD",
      },
      {
        title: "Practice: add Opik integration as a second eval backend",
        description: "Duplicate eval runs to Opik alongside Braintrust. Compare UX. Note which platform is better for which use case.",
        weekNumber: 4, duration: 60, type: "BUILD",
      },
      {
        title: "Read: Hamel Husain's blog on LLM evals",
        description: "https://hamel.dev/blog/posts/evals/ — note the spectrum from unit to model-graded. Apply the taxonomy to your existing eval suite.",
        weekNumber: 4, duration: 30, type: "READ",
      },
      {
        title: "Review: month 6 retro — eval coverage matrix",
        weekNumber: 4, duration: 30, type: "REVIEW",
      },
    ],
    resources: [
      { title: "Braintrust Docs", url: "https://www.braintrust.dev/docs", type: "ARTICLE", priority: 1 },
      { title: "Arize Phoenix Docs", url: "https://docs.arize.com/phoenix", type: "ARTICLE", priority: 1 },
      { title: "Opik Docs (Comet ML)", url: "https://www.comet.com/docs/opik/", type: "ARTICLE", priority: 2 },
      { title: "LangSmith Docs", url: "https://docs.smith.langchain.com/", type: "ARTICLE", priority: 2 },
      { title: "OpenTelemetry Docs", url: "https://opentelemetry.io/docs/", type: "ARTICLE", priority: 2 },
      { title: "Hamel Husain: Your AI Product Needs Evals", url: "https://hamel.dev/blog/posts/evals/", type: "ARTICLE", priority: 1 },
      { title: "Celery Flower Docs", url: "https://flower.readthedocs.io/", type: "ARTICLE", priority: 2 },
      { title: "Redis Streams Introduction", url: "https://redis.io/docs/latest/develop/data-types/streams/", type: "ARTICLE", priority: 2 },
      { title: "RAGAS Docs", url: "https://docs.ragas.io/", type: "ARTICLE", priority: 2 },
    ],
    project: {
      name: "AI Evaluation Dashboard",
      description: "React dashboard tracking eval scores, cost, and latency across all AI services. LLM-as-judge eval suite runs in Celery workers, results stored in PostgreSQL, streamed via Redis Streams. Integrated with Braintrust and Opik. CI/CD eval gate in GitHub Actions.",
      techStack: ["FastAPI", "React", "Celery", "Redis Streams", "PostgreSQL", "Braintrust", "OpenTelemetry", "Flower"],
    },
  },

  // =========================================================================
  // MONTH 7 — Kubernetes + AWS + Terraform
  // =========================================================================
  {
    monthNumber: 7,
    topics: [
      { name: "Docker: multi-stage builds, layer caching, non-root user, .dockerignore", category: "learn" },
      { name: "Kubernetes core: pods, replicasets, deployments, labels, selectors", category: "learn" },
      { name: "Kubernetes networking: services (ClusterIP, NodePort, LoadBalancer), ingress", category: "learn" },
      { name: "Kubernetes config: ConfigMaps, Secrets, environment injection", category: "learn" },
      { name: "Kubernetes ops: resource requests/limits, HPA, PDB, liveness/readiness probes", category: "learn" },
      { name: "Terraform: HCL syntax, providers, resources, variables, outputs", category: "learn" },
      { name: "Terraform: modules, state management, remote backend (S3 + DynamoDB)", category: "learn" },
      { name: "AWS EKS: cluster creation, node groups, OIDC, service accounts (IRSA)", category: "learn" },
      { name: "AWS: RDS PostgreSQL (managed), ElastiCache Redis (managed)", category: "learn" },
      { name: "AWS: ALB, ACM (TLS), Route 53, ECR", category: "learn" },
      { name: "Observability: CloudWatch Container Insights, Prometheus + Grafana on EKS", category: "practice" },
      { name: "GitHub Actions: build, push to ECR, rolling deploy to EKS", category: "practice" },
      { name: "Deploy the full AI stack to AWS EKS", category: "build" },
    ],
    tasks: [
      // Week 1
      {
        title: "Learn Docker: multi-stage builds and layer caching",
        description: "Rewrite your M6 Dockerfile with a build stage (deps + compile) and runtime stage (no pip, no dev tools). Verify no secrets in final layer.",
        weekNumber: 1, duration: 60, type: "LEARN",
      },
      {
        title: "Learn Kubernetes core: pods, deployments, services",
        description: "Deploy your FastAPI image to a local kind cluster. Expose via ClusterIP service. Scale to 3 replicas. Observe rolling update.",
        weekNumber: 1, duration: 75, type: "LEARN",
      },
      {
        title: "Learn Kubernetes: ConfigMaps, Secrets, probes, resource limits",
        description: "Inject DATABASE_URL via Secret. Add /healthz liveness and /ready readiness probes. Set CPU requests/limits. Watch OOM kills in k9s.",
        weekNumber: 1, duration: 60, type: "LEARN",
      },
      {
        title: "Learn Kubernetes networking: ingress with nginx + TLS",
        description: "Install ingress-nginx. Create Ingress for api.melleme.io. Add cert-manager ClusterIssuer for Let's Encrypt TLS.",
        weekNumber: 1, duration: 60, type: "LEARN",
      },
      {
        title: "DSA: 3 graph problems — topological sort (LeetCode Medium)",
        description: "Course Schedule, Course Schedule II, Find Eventual Safe States. Own Kahn's algorithm (BFS with in-degree) and DFS cycle detection.",
        weekNumber: 1, duration: 45, type: "DSA",
      },
      // Week 2
      {
        title: "Learn Terraform: HCL syntax, providers, state",
        description: "Write a Terraform config that creates a VPC, subnet, and EC2 instance. Run init/plan/apply/destroy. Inspect the state file.",
        weekNumber: 2, duration: 75, type: "LEARN",
      },
      {
        title: "Learn Terraform: modules and remote state",
        description: "Refactor into a vpc module and an eks module. Store state in S3 with DynamoDB locking. Understand terraform_remote_state.",
        weekNumber: 2, duration: 60, type: "LEARN",
      },
      {
        title: "Learn AWS EKS: cluster creation and IRSA",
        description: "Create an EKS cluster with eksctl. Set up OIDC provider. Create a service account with IRSA so your app pod can access S3 without static keys.",
        weekNumber: 2, duration: 75, type: "LEARN",
      },
      {
        title: "Practice: write Terraform for EKS + RDS + ElastiCache",
        description: "Terraform modules for: EKS cluster (2 node groups), RDS PostgreSQL (Multi-AZ), ElastiCache Redis (cluster mode). Apply to a staging VPC.",
        weekNumber: 2, duration: 90, type: "BUILD",
      },
      {
        title: "Review: infrastructure as code best practices checklist",
        description: "Check: no hardcoded secrets, tagging strategy, least-privilege IAM, state encryption, drift detection.",
        weekNumber: 2, duration: 30, type: "REVIEW",
      },
      // Week 3
      {
        title: "Learn GitHub Actions: build, push to ECR, deploy to EKS",
        description: "Write a pipeline: on push to main → docker build → push to ECR → kubectl rollout restart. Add a staging environment with manual approval gate.",
        weekNumber: 3, duration: 75, type: "LEARN",
      },
      {
        title: "Learn Prometheus + Grafana on EKS",
        description: "Install kube-prometheus-stack via Helm. Add custom metrics from your FastAPI app (/metrics endpoint). Build a Grafana dashboard: RPS, latency, error rate.",
        weekNumber: 3, duration: 60, type: "LEARN",
      },
      {
        title: "Learn HPA and PDB: auto-scaling and disruption budgets",
        description: "Create an HPA targeting 60% CPU. Create a PDB with minAvailable: 1. Test: run a load test, watch scaling, then drain a node.",
        weekNumber: 3, duration: 45, type: "LEARN",
      },
      {
        title: "Practice: migrate M6 eval dashboard to EKS",
        description: "Deploy: API, Celery worker, PostgreSQL (RDS), Redis (ElastiCache), React (S3 + CloudFront). All via kubectl + Helm.",
        weekNumber: 3, duration: 90, type: "BUILD",
      },
      {
        title: "DSA: 3 heap problems (LeetCode Medium)",
        description: "Kth Largest Element, Top K Frequent Words, Find Median from Data Stream. Own the min-heap/max-heap pattern with heapq.",
        weekNumber: 3, duration: 45, type: "DSA",
      },
      // Week 4
      {
        title: "Build: deploy full AI stack to AWS EKS via Terraform",
        description: "All services from M1–M6: FastAPI, Celery, Flower, Redis (ElastiCache), PostgreSQL (RDS), React (S3/CloudFront). ALB ingress + ACM TLS. CI/CD via GitHub Actions.",
        weekNumber: 4, duration: 150, type: "BUILD",
      },
      {
        title: "Practice: add CloudWatch Container Insights and alerts",
        description: "Enable Container Insights on EKS. Create CloudWatch alarms: CPU > 80%, memory > 80%, pod restart count > 3. Alert to Slack via SNS + Lambda.",
        weekNumber: 4, duration: 60, type: "BUILD",
      },
      {
        title: "Review: infrastructure retro — cost estimate and security audit",
        description: "Use AWS Cost Explorer to estimate monthly cost. Run Checkov on Terraform to identify security misconfigurations. Fix at least 3 findings.",
        weekNumber: 4, duration: 30, type: "REVIEW",
      },
    ],
    resources: [
      { title: "Kubernetes Docs", url: "https://kubernetes.io/docs/home/", type: "ARTICLE", priority: 1 },
      { title: "Terraform Docs", url: "https://developer.hashicorp.com/terraform/docs", type: "ARTICLE", priority: 1 },
      { title: "AWS EKS Docs", url: "https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html", type: "ARTICLE", priority: 1 },
      { title: "Terraform AWS Provider Docs", url: "https://registry.terraform.io/providers/hashicorp/aws/latest/docs", type: "ARTICLE", priority: 1 },
      { title: "kube-prometheus-stack (Helm chart)", url: "https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack", type: "REPO", priority: 2 },
      { title: "Terraform: Up & Running (Yevgeniy Brikman)", url: "https://www.terraformupandrunning.com/", type: "BOOK", priority: 2 },
      { title: "eksctl Docs", url: "https://eksctl.io/", type: "ARTICLE", priority: 2 },
      { title: "cert-manager Docs", url: "https://cert-manager.io/docs/", type: "ARTICLE", priority: 2 },
      { title: "Checkov: Terraform static analysis", url: "https://www.checkov.io/", type: "TOOL", priority: 3 },
      { title: "k9s: Kubernetes TUI", url: "https://k9scli.io/", type: "TOOL", priority: 3 },
    ],
    project: {
      name: "Deploy Full AI Stack to AWS EKS",
      description: "All M1–M6 services deployed to AWS EKS via Terraform IaC. RDS PostgreSQL, ElastiCache Redis, ALB ingress, ACM TLS, ECR for images. GitHub Actions CI/CD: build → push → rolling deploy. Prometheus + Grafana observability. CloudWatch alerts.",
      techStack: ["Kubernetes", "AWS EKS", "Terraform", "GitHub Actions", "ECR", "RDS", "ElastiCache", "Prometheus", "Grafana"],
    },
  },

  // =========================================================================
  // MONTH 8 — DSA Foundations
  // =========================================================================
  {
    monthNumber: 8,
    topics: [
      { name: "Arrays: sliding window, prefix sums, kadane's algorithm, buy/sell stock", category: "learn" },
      { name: "Strings: character frequency, anagrams, palindromes, substring search", category: "learn" },
      { name: "Hash maps: frequency counting, two-sum pattern, subarray sum equals k", category: "learn" },
      { name: "Hash sets: duplicate detection, intersection/union, longest consecutive", category: "learn" },
      { name: "Two pointers: sorted arrays, in-place, fast/slow, N-sum", category: "learn" },
      { name: "Sliding window: fixed-size, variable-size, string permutation", category: "learn" },
      { name: "Binary search: classic, on answer space, search in rotated array", category: "learn" },
      { name: "Linked lists: reversal, merge, cycle detection, find middle", category: "learn" },
      { name: "Stacks: valid parentheses, daily temperatures, monotonic stack", category: "learn" },
      { name: "Queues: BFS level-order, sliding window maximum, task scheduler", category: "learn" },
      { name: "Time/space complexity analysis: Big-O, best/worst/average case", category: "practice" },
      { name: "Neetcode 150 — foundations tier (problems 1–50)", category: "practice" },
    ],
    tasks: [
      // Week 1
      {
        title: "Learn arrays: sliding window and prefix sums",
        description: "Best Time to Buy and Sell Stock, Maximum Average Subarray, Subarray Sum Equals K. Understand when to use fixed vs variable window.",
        weekNumber: 1, duration: 45, type: "LEARN",
      },
      {
        title: "DSA: solve 5 array problems on Neetcode (Easy/Medium)",
        description: "Contains Duplicate, Valid Anagram, Two Sum, Product of Array Except Self, Maximum Subarray. Write brute force, then optimise.",
        weekNumber: 1, duration: 90, type: "DSA",
      },
      {
        title: "DSA: solve 3 more array problems (Medium)",
        description: "Rotate Array, 3Sum, Move Zeroes. Focus on in-place manipulation and two-pointer optimisation.",
        weekNumber: 1, duration: 60, type: "DSA",
      },
      {
        title: "Review: Week 1 mistakes — re-solve any problem you looked up",
        description: "For each problem you peeked at: re-do it from scratch in 30 min. Log time taken in MelleMelle DSA tracker.",
        weekNumber: 1, duration: 30, type: "REVIEW",
      },
      // Week 2
      {
        title: "Learn hash maps + sets: frequency patterns",
        description: "Group Anagrams, Top K Frequent Elements, Longest Consecutive Sequence. Own the 'count first, then query' pattern.",
        weekNumber: 2, duration: 45, type: "LEARN",
      },
      {
        title: "DSA: solve 5 hash map/set problems (Easy/Medium)",
        description: "Two Sum, Valid Sudoku, Encode and Decode Strings, Valid Anagram (by sort), Ransom Note, Isomorphic Strings.",
        weekNumber: 2, duration: 90, type: "DSA",
      },
      {
        title: "Learn two pointers: sorted arrays and N-sum",
        description: "Two Sum II, 3Sum, Container With Most Water, Trapping Rain Water. Own: move left if sum too small, right if too large.",
        weekNumber: 2, duration: 60, type: "DSA",
      },
      {
        title: "Review: Week 2 mistakes + Big-O analysis of each solution",
        description: "For every problem this week: state time and space complexity. If O(n²) and n can be 10^5 — it's wrong.",
        weekNumber: 2, duration: 30, type: "REVIEW",
      },
      // Week 3
      {
        title: "Learn binary search: classic and on answer space",
        description: "Binary Search, Search in Rotated Sorted Array, Find Minimum in Rotated, Koko Eating Bananas. Own the lo/hi/mid contract.",
        weekNumber: 3, duration: 45, type: "LEARN",
      },
      {
        title: "DSA: solve 5 binary search problems (Easy/Medium)",
        description: "Search a 2D Matrix, Time Based Key-Value Store, Median of Two Sorted Arrays (hard), Find Peak Element, Guess Number.",
        weekNumber: 3, duration: 90, type: "DSA",
      },
      {
        title: "DSA: solve 3 sliding window problems (Medium)",
        description: "Longest Substring Without Repeating Characters, Longest Repeating Character Replacement, Minimum Window Substring.",
        weekNumber: 3, duration: 60, type: "DSA",
      },
      {
        title: "Review: Week 3 mistakes",
        weekNumber: 3, duration: 30, type: "REVIEW",
      },
      // Week 4
      {
        title: "Learn linked lists and stacks",
        description: "Reverse Linked List, Merge Two Sorted Lists, Linked List Cycle, Remove Nth From End. Valid Parentheses, Min Stack, Daily Temperatures.",
        weekNumber: 4, duration: 45, type: "LEARN",
      },
      {
        title: "DSA: solve 5 linked list problems (Easy/Medium)",
        description: "Reverse Linked List, Merge Two Sorted Lists, Reorder List, Remove Nth Node, LRU Cache.",
        weekNumber: 4, duration: 90, type: "DSA",
      },
      {
        title: "DSA: solve 3 stack problems (Medium)",
        description: "Valid Parentheses, Evaluate Reverse Polish Notation, Generate Parentheses, Largest Rectangle in Histogram.",
        weekNumber: 4, duration: 60, type: "DSA",
      },
      {
        title: "Build: Meeting Intelligence Platform — kickoff",
        description: "Scaffold: Kafka consumer for meeting audio events → Whisper transcription worker → classification → PostgreSQL storage. Light build month — 60 min only.",
        weekNumber: 4, duration: 60, type: "BUILD",
      },
      {
        title: "Review: Month 8 total — 50 problems counted, patterns owned",
        weekNumber: 4, duration: 30, type: "REVIEW",
      },
    ],
    resources: [
      { title: "Neetcode.io", url: "https://neetcode.io/", type: "TOOL", priority: 1 },
      { title: "LeetCode", url: "https://leetcode.com/", type: "TOOL", priority: 1 },
      { title: "Neetcode 150 GitHub List", url: "https://github.com/neetcode-gh/leetcode", type: "REPO", priority: 1 },
      { title: "Designing Data-Intensive Applications (DDIA) — start reading", url: "https://dataintensive.net/", type: "BOOK", priority: 2 },
      { title: "Big-O Cheat Sheet", url: "https://www.bigocheatsheet.com/", type: "ARTICLE", priority: 2 },
      { title: "Neetcode YouTube — arrays & hashing", url: "https://www.youtube.com/@NeetCode", type: "VIDEO", priority: 1 },
      { title: "Pramp (free mock interviews)", url: "https://www.pramp.com/", type: "TOOL", priority: 2 },
      { title: "Python heapq Docs", url: "https://docs.python.org/3/library/heapq.html", type: "ARTICLE", priority: 3 },
    ],
    project: {
      name: "Meeting Intelligence Platform",
      description: "Kafka-backed async pipeline: audio event → Whisper transcription worker → LLM classification/summary → action item extraction → PostgreSQL. Kickoff in M8, full build in M9.",
      techStack: ["Kafka", "FastAPI", "Whisper", "PostgreSQL", "Celery"],
    },
  },

  // =========================================================================
  // MONTH 9 — DSA Intermediate
  // =========================================================================
  {
    monthNumber: 9,
    topics: [
      { name: "Binary trees: DFS (pre/in/post), BFS, level order, path problems", category: "learn" },
      { name: "BST: insert, delete, validate, kth smallest, in-order traversal", category: "learn" },
      { name: "Graphs: adjacency list, BFS shortest path, DFS cycle detection", category: "learn" },
      { name: "Graphs: topological sort (Kahn's + DFS), connected components", category: "learn" },
      { name: "Heaps: min-heap, max-heap, heapify, kth largest, merge k sorted lists", category: "learn" },
      { name: "Greedy: activity selection, interval scheduling, jump game", category: "learn" },
      { name: "DP basics: memoization vs tabulation, Fibonacci, climbing stairs, coin change", category: "learn" },
      { name: "DP 1D: house robber, decode ways, unique paths", category: "learn" },
      { name: "Neetcode 150 — intermediate tier (problems 51–125)", category: "practice" },
      { name: "Weekly Pramp mock interview: solve + explain out loud", category: "practice" },
      { name: "Open source contribution PR", category: "build" },
    ],
    tasks: [
      // Week 1
      {
        title: "Learn binary trees: DFS, BFS, and path problems",
        description: "Invert Binary Tree, Max Depth, Diameter, Balanced BST, Same Tree, Subtree of Another, Path Sum. Own iterative DFS with explicit stack.",
        weekNumber: 1, duration: 45, type: "LEARN",
      },
      {
        title: "DSA: solve 6 binary tree problems (Easy/Medium)",
        description: "Level Order Traversal, Right Side View, Count Good Nodes, Validate BST, Kth Smallest in BST, Lowest Common Ancestor.",
        weekNumber: 1, duration: 90, type: "DSA",
      },
      {
        title: "DSA: solve 3 BST problems (Medium)",
        description: "Insert into BST, Delete Node in BST, Construct BST from Preorder. Own the recursive structure.",
        weekNumber: 1, duration: 60, type: "DSA",
      },
      {
        title: "Pramp: first weekly mock interview",
        description: "Solve assigned problem out loud. Explain brute force → optimise → complexity. Get feedback. Log result in MelleMelle interviews tracker.",
        weekNumber: 1, duration: 60, type: "MOCK",
      },
      // Week 2
      {
        title: "Learn graphs: BFS shortest path and DFS cycle detection",
        description: "Number of Islands, Clone Graph, Max Area of Island, Pacific Atlantic, Surrounded Regions, Rotting Oranges (multi-source BFS).",
        weekNumber: 2, duration: 45, type: "LEARN",
      },
      {
        title: "DSA: solve 6 graph problems (Easy/Medium)",
        description: "Number of Islands, Clone Graph, Pacific Atlantic, Redundant Connection, Number of Connected Components, Graph Valid Tree.",
        weekNumber: 2, duration: 90, type: "DSA",
      },
      {
        title: "DSA: solve 3 topological sort problems (Medium)",
        description: "Course Schedule, Course Schedule II, Alien Dictionary. Own Kahn's (BFS with in-degree counter).",
        weekNumber: 2, duration: 60, type: "DSA",
      },
      {
        title: "Review: Week 2 graph mistakes — redraw the graph for each failure",
        weekNumber: 2, duration: 30, type: "REVIEW",
      },
      // Week 3
      {
        title: "Learn heaps: kth element patterns",
        description: "Kth Largest Element in Array, Top K Frequent Elements, Kth Largest in Stream, Find Median from Data Stream. Own the heap invariant.",
        weekNumber: 3, duration: 45, type: "LEARN",
      },
      {
        title: "DSA: solve 5 heap problems (Medium)",
        description: "Last Stone Weight, K Closest Points to Origin, Task Scheduler, Design Twitter (k recent tweets), Merge K Sorted Lists.",
        weekNumber: 3, duration: 90, type: "DSA",
      },
      {
        title: "Learn DP: memoization, tabulation, coin change, climbing stairs",
        description: "Fibonacci, Climbing Stairs, Min Cost Climbing, Coin Change, House Robber, Decode Ways. Own the recurrence relation derivation.",
        weekNumber: 3, duration: 60, type: "LEARN",
      },
      {
        title: "Pramp: second mock interview",
        description: "Focus on explaining complexity before coding. If you get a tree problem, ask clarifying questions for 2 min first.",
        weekNumber: 3, duration: 60, type: "MOCK",
      },
      // Week 4
      {
        title: "DSA: solve 4 DP problems (Medium)",
        description: "House Robber II, Unique Paths, Longest Common Subsequence (preview), Jump Game, Jump Game II.",
        weekNumber: 4, duration: 90, type: "DSA",
      },
      {
        title: "Learn greedy: interval scheduling and activity selection",
        description: "Non-overlapping Intervals, Merge Intervals, Insert Interval, Meeting Rooms II. Own: sort by end time, pick greedily.",
        weekNumber: 4, duration: 45, type: "LEARN",
      },
      {
        title: "DSA: solve 3 greedy problems (Medium)",
        description: "Jump Game, Jump Game II, Gas Station. Own the forward greedy scan.",
        weekNumber: 4, duration: 60, type: "DSA",
      },
      {
        title: "Build: open source contribution PR",
        description: "Find a good-first-issue on LangGraph, FastAPI, or Opik. Fix it, write tests, open PR. Document your contribution in the project tracker.",
        weekNumber: 4, duration: 90, type: "BUILD",
      },
      {
        title: "Review: Month 9 total — 75 more problems, total 125",
        weekNumber: 4, duration: 30, type: "REVIEW",
      },
    ],
    resources: [
      { title: "Neetcode.io", url: "https://neetcode.io/", type: "TOOL", priority: 1 },
      { title: "LeetCode", url: "https://leetcode.com/", type: "TOOL", priority: 1 },
      { title: "Pramp (free mock interviews)", url: "https://www.pramp.com/", type: "TOOL", priority: 1 },
      { title: "Neetcode YouTube — trees & graphs", url: "https://www.youtube.com/@NeetCode", type: "VIDEO", priority: 1 },
      { title: "Designing Data-Intensive Applications — chapters 5–7", url: "https://dataintensive.net/", type: "BOOK", priority: 2 },
      { title: "interviewing.io (paid mock interviews)", url: "https://interviewing.io/", type: "TOOL", priority: 2 },
      { title: "Python collections.deque Docs", url: "https://docs.python.org/3/library/collections.html#collections.deque", type: "ARTICLE", priority: 3 },
    ],
    project: {
      name: "Open Source Contribution",
      description: "Merged pull request to an active AI/backend repository (LangGraph, FastAPI, Opik, or similar). Documented in GitHub profile README. Shows real-world code review and collaboration.",
      techStack: ["Python", "FastAPI", "LangGraph", "Opik"],
    },
  },

  // =========================================================================
  // MONTH 10 — DSA Advanced + Company Prep
  // =========================================================================
  {
    monthNumber: 10,
    topics: [
      { name: "DP 2D: grid paths, LCS, edit distance, regex matching", category: "learn" },
      { name: "DP on strings: palindromic substrings, palindrome partitioning", category: "learn" },
      { name: "DP on intervals: burst balloons, matrix chain multiplication", category: "learn" },
      { name: "Backtracking: subsets, permutations, combinations, N-Queens, Sudoku", category: "learn" },
      { name: "Dijkstra: weighted shortest path, priority queue, network delay", category: "learn" },
      { name: "Bellman-Ford: negative edges, detect negative cycles", category: "learn" },
      { name: "Union-Find: path compression, union by rank, cycle detection", category: "learn" },
      { name: "Tries: insert, search, startsWith, word search II", category: "learn" },
      { name: "Bit manipulation: XOR tricks, power of 2, count bits, subset generation", category: "learn" },
      { name: "Neetcode 150 — advanced tier (problems 126–200)", category: "practice" },
      { name: "Company-specific problem sets: Flipkart, Google, Amazon, Razorpay", category: "practice" },
      { name: "Timed mock contests: 4 problems in 90 minutes", category: "practice" },
    ],
    tasks: [
      // Week 1
      {
        title: "Learn DP 2D: grid paths, LCS, edit distance",
        description: "Unique Paths II, Coin Change 2, Longest Common Subsequence, Edit Distance, Longest Increasing Subsequence. Derive recurrences on paper first.",
        weekNumber: 1, duration: 60, type: "LEARN",
      },
      {
        title: "DSA: solve 5 advanced DP problems (Medium/Hard)",
        description: "Target Sum, Partition Equal Subset Sum, Word Break, Maximum Product Subarray, Palindromic Substrings.",
        weekNumber: 1, duration: 90, type: "DSA",
      },
      {
        title: "DSA: solve 3 interval DP problems (Medium/Hard)",
        description: "Minimum Cost to Cut a Stick, Burst Balloons, Strange Printer. Own the [i][j] dp table with loop order.",
        weekNumber: 1, duration: 60, type: "DSA",
      },
      {
        title: "Review: DP mistakes — redraw the DP table for each failure",
        weekNumber: 1, duration: 30, type: "REVIEW",
      },
      // Week 2
      {
        title: "Learn backtracking: subsets, permutations, combinations",
        description: "Subsets, Subsets II, Permutations, Combination Sum, N-Queens. Own the choose/explore/unchoose template.",
        weekNumber: 2, duration: 60, type: "LEARN",
      },
      {
        title: "DSA: solve 5 backtracking problems (Medium/Hard)",
        description: "Letter Combinations of Phone Number, Palindrome Partitioning, Word Search, Restore IP Addresses, Sudoku Solver.",
        weekNumber: 2, duration: 90, type: "DSA",
      },
      {
        title: "Learn shortest path: Dijkstra and Bellman-Ford",
        description: "Network Delay Time (Dijkstra), Cheapest Flights Within K Stops (Bellman-Ford), Path with Minimum Effort. Own the heap-based Dijkstra.",
        weekNumber: 2, duration: 60, type: "LEARN",
      },
      {
        title: "Pramp/interviewing.io: timed mock interview #1",
        description: "Treat as real: camera on, explain every step. Ask clarifying questions. Do time check at 20 min. Log performance in MelleMelle.",
        weekNumber: 2, duration: 60, type: "MOCK",
      },
      // Week 3
      {
        title: "Learn Union-Find: path compression and union by rank",
        description: "Number of Provinces, Redundant Connection, Accounts Merge, Longest Consecutive Sequence. Own: find with path compression, union by rank.",
        weekNumber: 3, duration: 45, type: "LEARN",
      },
      {
        title: "Learn Tries and bit manipulation",
        description: "Implement a Trie (insert/search/startsWith). Word Search II. XOR: Single Number, Number of 1 Bits, Counting Bits, Reverse Bits.",
        weekNumber: 3, duration: 60, type: "LEARN",
      },
      {
        title: "DSA: company-specific problem set — Flipkart top 15",
        description: "Pull Flipkart problem list from LeetCode Premium / Neetcode company tags. Solve 5 this week. Note patterns Flipkart repeats.",
        weekNumber: 3, duration: 90, type: "DSA",
      },
      {
        title: "Pramp/interviewing.io: timed mock interview #2",
        weekNumber: 3, duration: 60, type: "MOCK",
      },
      // Week 4
      {
        title: "DSA: timed mock contest — 4 problems in 90 minutes",
        description: "Pick a LeetCode Weekly Contest or a Neetcode mock. Time yourself strictly. Analyse where you got stuck after.",
        weekNumber: 4, duration: 120, type: "DSA",
      },
      {
        title: "DSA: company-specific problem set — Google + Amazon top 15",
        description: "Google: heavy on arrays + DP + graphs. Amazon: trees + graphs + system design adjacent. Solve 5 each.",
        weekNumber: 4, duration: 90, type: "DSA",
      },
      {
        title: "Build: AI Finance Assistant — complete app",
        description: "FastAPI + PostgreSQL + Redis + Celery cron. Weekly LLM briefing on portfolio performance. Light month — 90 min only.",
        weekNumber: 4, duration: 90, type: "BUILD",
      },
      {
        title: "Review: Month 10 total — 200 owned problems check",
        description: "Count solved vs owned. For any SOLVED but not OWNED: schedule review in MelleMelle spaced-repetition queue.",
        weekNumber: 4, duration: 30, type: "REVIEW",
      },
    ],
    resources: [
      { title: "Neetcode.io", url: "https://neetcode.io/", type: "TOOL", priority: 1 },
      { title: "LeetCode", url: "https://leetcode.com/", type: "TOOL", priority: 1 },
      { title: "interviewing.io", url: "https://interviewing.io/", type: "TOOL", priority: 1 },
      { title: "Neetcode YouTube — advanced DP & graphs", url: "https://www.youtube.com/@NeetCode", type: "VIDEO", priority: 1 },
      { title: "System Design Interview Vol. 1 — start reading", url: "https://www.systemdesigninterview.com/", type: "BOOK", priority: 2 },
      { title: "Competitive Programmer's Handbook (free PDF)", url: "https://cses.fi/book/book.pdf", type: "BOOK", priority: 3 },
    ],
    project: {
      name: "AI Finance Assistant",
      description: "Scheduled FastAPI service: Celery cron ingests portfolio data weekly, LLM generates a performance briefing with recommendations. PostgreSQL + Redis. Light build in a DSA-heavy month.",
      techStack: ["FastAPI", "PostgreSQL", "Redis", "Celery", "LLM APIs"],
    },
  },

  // =========================================================================
  // MONTH 11 — System Design HLD + LLD + Distributed
  // =========================================================================
  {
    monthNumber: 11,
    topics: [
      { name: "HLD fundamentals: scalability, reliability, maintainability", category: "learn" },
      { name: "Load balancing: L4 vs L7, round-robin, least-conn, consistent hashing", category: "learn" },
      { name: "Caching: CDN, reverse proxy cache, application cache, cache invalidation", category: "learn" },
      { name: "Database scaling: read replicas, sharding (hash vs range), federation", category: "learn" },
      { name: "CAP theorem, PACELC, BASE vs ACID, consistency models", category: "learn" },
      { name: "Message queues: Kafka partitioning, consumer groups, exactly-once delivery", category: "learn" },
      { name: "Event-driven: event sourcing, CQRS, outbox pattern, saga choreography", category: "learn" },
      { name: "Distributed transactions: 2PC, saga, TCC — trade-offs", category: "learn" },
      { name: "LLD & OOD: SOLID, design patterns (Factory, Observer, Strategy, Command)", category: "learn" },
      { name: "LLD problems: LRU Cache, Rate Limiter, Parking Lot, Elevator System", category: "practice" },
      { name: "AI System Design: LLM inference infra, eval pipeline at scale, vector DBs", category: "learn" },
      { name: "Security: OAuth2 PKCE, CSRF, XSS, SQL injection, OWASP API Top 10", category: "learn" },
      { name: "Design 8 systems: URL Shortener, Twitter, Uber, Netflix, Stripe, WhatsApp, YouTube, AI Eval Pipeline", category: "practice" },
      { name: "Build: Customer Support AI SaaS — portfolio anchor", category: "build" },
    ],
    tasks: [
      // Week 1
      {
        title: "Learn HLD fundamentals: scalability and load balancing",
        description: "Read DDIA chapter 1. Learn horizontal vs vertical scaling, stateless services, consistent hashing for load balancers. Design a URL shortener (HLD).",
        weekNumber: 1, duration: 75, type: "LEARN",
      },
      {
        title: "Learn caching and database scaling",
        description: "Read DDIA chapter 3 (storage engines) and 6 (partitioning). Design caching layers: CDN → Nginx → Redis → DB. Understand cache stampede and hot keys.",
        weekNumber: 1, duration: 75, type: "LEARN",
      },
      {
        title: "Practice: design Twitter/X from scratch (45 min timed)",
        description: "Fan-out on write vs read, timeline generation, hot users. Draw: client → CDN → API → feed service → Redis timeline → Cassandra tweets.",
        weekNumber: 1, duration: 60, type: "BUILD",
      },
      {
        title: "Learn LLD: SOLID + design patterns",
        description: "SOLID with Python examples. Implement Factory, Observer, Strategy patterns. Apply Open/Closed to your FastAPI service plugin system.",
        weekNumber: 1, duration: 60, type: "LEARN",
      },
      {
        title: "Review: system design rubric — what interviewers score",
        description: "Requirements clarification, capacity estimation, API design, data model, HLD diagram, bottlenecks, scaling. Time-box: 45 min per design.",
        weekNumber: 1, duration: 30, type: "REVIEW",
      },
      // Week 2
      {
        title: "Learn CAP theorem, PACELC, consistency models",
        description: "Read DDIA chapter 9 (consistency and consensus). Understand CP vs AP trade-offs. Know which DB fits which: PostgreSQL (CP), Cassandra (AP), etc.",
        weekNumber: 2, duration: 75, type: "LEARN",
      },
      {
        title: "Learn Kafka: partitioning, consumer groups, exactly-once",
        description: "Read Kafka: The Definitive Guide chapter 1–3. Understand offset management, consumer group rebalancing, ISR, exactly-once with idempotent producer.",
        weekNumber: 2, duration: 75, type: "LEARN",
      },
      {
        title: "Practice: design Uber (ride-sharing) from scratch (45 min)",
        description: "Geo-indexing with geohash, real-time driver location updates, matching service, trip state machine. Draw the full data flow.",
        weekNumber: 2, duration: 60, type: "BUILD",
      },
      {
        title: "Read: DDIA chapters 5–7 (replication, partitioning, transactions)",
        description: "Take notes on: leader-follower replication lag, primary key sharding, multi-document transactions. Apply to your M1–M6 systems.",
        weekNumber: 2, duration: 60, type: "READ",
      },
      {
        title: "LLD practice: implement LRU Cache from scratch",
        description: "OrderedDict approach first, then doubly-linked list + hash map from scratch. Both O(1) get and put. Write tests.",
        weekNumber: 2, duration: 45, type: "BUILD",
      },
      // Week 3
      {
        title: "Learn event-driven: CQRS, event sourcing, outbox pattern",
        description: "CQRS: separate read/write models. Event sourcing: state = fold(events). Outbox: DB + Kafka in one transaction. Implement outbox in PostgreSQL.",
        weekNumber: 3, duration: 75, type: "LEARN",
      },
      {
        title: "Learn AI System Design: LLM inference infra at scale",
        description: "Design an AI eval pipeline at 10k requests/day: API → Kafka → eval workers → results DB → dashboard. Design vector DB scaling: sharding, approximate search trade-offs.",
        weekNumber: 3, duration: 60, type: "LEARN",
      },
      {
        title: "Practice: design Stripe / payments system (45 min)",
        description: "Idempotency keys, ledger DB (double-entry accounting), payment state machine (PENDING → PROCESSING → COMPLETED), webhook delivery, reconciliation.",
        weekNumber: 3, duration: 60, type: "BUILD",
      },
      {
        title: "LLD practice: design a Rate Limiter (system design interview classic)",
        description: "Token bucket in Redis, sliding window log, fixed window counter. Class diagram first. Implement in Python. Make thread-safe.",
        weekNumber: 3, duration: 45, type: "BUILD",
      },
      {
        title: "Mock: full system design mock interview (45 min)",
        description: "Interviewing.io or peer mock. Topic: design a notification service. Record and review. Log in MelleMelle interviews tracker.",
        weekNumber: 3, duration: 60, type: "MOCK",
      },
      // Week 4
      {
        title: "Learn OAuth2 PKCE, CSRF, XSS, OWASP API Top 10",
        description: "Implement PKCE flow for a public client. Add CSRF token to a form. Review OWASP API Top 10 (2023). Audit your M2 API against all 10.",
        weekNumber: 4, duration: 60, type: "LEARN",
      },
      {
        title: "Build: Customer Support AI SaaS — full implementation",
        description: "FastAPI + React + Kafka + K8s. Multi-tenant (tenant_id on all tables). OAuth2 PKCE auth. Celery workers for AI response generation. Rate limited. Observability via OTel.",
        weekNumber: 4, duration: 120, type: "BUILD",
      },
      {
        title: "Mock: full system design mock interview #2",
        description: "Topic: design YouTube video upload and streaming. Focus on: chunked upload, transcoding pipeline, CDN edge caching, view count at scale.",
        weekNumber: 4, duration: 60, type: "MOCK",
      },
      {
        title: "Review: Month 11 retro — design quality vs month 1 architecture",
        weekNumber: 4, duration: 30, type: "REVIEW",
      },
    ],
    resources: [
      { title: "Designing Data-Intensive Applications", url: "https://dataintensive.net/", type: "BOOK", priority: 1 },
      { title: "System Design Interview, Vol. 1 (Alex Xu)", url: "https://www.systemdesigninterview.com/", type: "BOOK", priority: 1 },
      { title: "System Design Interview, Vol. 2 (Alex Xu)", url: "https://www.systemdesigninterview.com/", type: "BOOK", priority: 1 },
      { title: "interviewing.io", url: "https://interviewing.io/", type: "TOOL", priority: 1 },
      { title: "High Scalability Blog", url: "http://highscalability.com/", type: "ARTICLE", priority: 2 },
      { title: "The System Design Primer (GitHub)", url: "https://github.com/donnemartin/system-design-primer", type: "REPO", priority: 2 },
      { title: "Kafka: The Definitive Guide (free PDF)", url: "https://www.confluent.io/resources/kafka-the-definitive-guide/", type: "BOOK", priority: 2 },
      { title: "Martin Fowler: CQRS", url: "https://martinfowler.com/bliki/CQRS.html", type: "ARTICLE", priority: 2 },
      { title: "OWASP API Security Top 10", url: "https://owasp.org/www-project-api-security/", type: "ARTICLE", priority: 2 },
      { title: "Excalidraw (draw system designs)", url: "https://excalidraw.com/", type: "TOOL", priority: 3 },
    ],
    project: {
      name: "Customer Support AI SaaS",
      description: "Full production SaaS: FastAPI + React + Kafka + K8s. Multi-tenant with row-level security. OAuth2 PKCE auth. Celery AI response workers. Rate limiting. OTel traces. This is your portfolio anchor — the most complete system you've built.",
      techStack: ["FastAPI", "React", "Kafka", "Kubernetes", "OAuth2", "PostgreSQL", "Redis", "OpenTelemetry"],
    },
  },

  // =========================================================================
  // MONTH 12 — Interview Sprint
  // =========================================================================
  {
    monthNumber: 12,
    topics: [
      { name: "DSA spaced repetition: re-solve all NEEDS_REVIEW problems", category: "practice" },
      { name: "System design revision: re-design 5 systems from memory in 45 min each", category: "practice" },
      { name: "Behavioral interview: STAR method, 15 stories prepared", category: "learn" },
      { name: "Amazon Leadership Principles: map your stories to each LP", category: "practice" },
      { name: "Resume tailoring: one version per target company", category: "practice" },
      { name: "GitHub portfolio: all 12 READMEs polished with live links", category: "practice" },
      { name: "Full-loop mock interviews: 2 per week on interviewing.io", category: "practice" },
      { name: "AI System Design ace: practise explaining IZBA's 9-Mind pipeline", category: "practice" },
      { name: "Salary negotiation: know your floor, ceiling, and leverage", category: "learn" },
      { name: "Company research: culture, tech stack, recent engineering blog posts", category: "practice" },
      { name: "Applications: referrals first, then direct; 5–7 companies in parallel", category: "practice" },
    ],
    tasks: [
      // Week 1
      {
        title: "Learn STAR method and write 15 behavioral stories",
        description: "Stories must cover: leadership, conflict, failure/learning, impact at scale, cross-functional collaboration, ambiguity, mentoring, technical decision. Write them out fully.",
        weekNumber: 1, duration: 60, type: "LEARN",
      },
      {
        title: "Polish all 12 project READMEs",
        description: "Each README: problem statement, architecture diagram, tech stack, setup instructions, demo GIF or screenshot, live link. Add to portfolio page.",
        weekNumber: 1, duration: 90, type: "BUILD",
      },
      {
        title: "DSA revision: re-solve your 20 hardest problems from memory",
        description: "Pull all NEEDS_REVIEW from MelleMelle DSA tracker. Set 35-min timer per problem. If you can't solve it → re-study the pattern video.",
        weekNumber: 1, duration: 90, type: "DSA",
      },
      {
        title: "Review: resume — tailor for 3 target companies",
        description: "Version 1: Flipkart (emphasise scale, backend). Version 2: Razorpay/CRED (payments, reliability). Version 3: Remote/Stripe (full-stack, AI). Quantify every bullet.",
        weekNumber: 1, duration: 45, type: "REVIEW",
      },
      // Week 2
      {
        title: "System design revision: re-design Twitter from memory (45 min)",
        description: "No notes. Whiteboard → requirements → API → data model → HLD. After: compare against your M11 design. What did you miss?",
        weekNumber: 2, duration: 60, type: "REVIEW",
      },
      {
        title: "System design revision: re-design Uber from memory (45 min)",
        weekNumber: 2, duration: 60, type: "REVIEW",
      },
      {
        title: "Mock: full-loop interview #1 on interviewing.io",
        description: "DSA (45 min) + system design (45 min). Record if allowed. Debrief: what failed, what landed well, what to fix.",
        weekNumber: 2, duration: 90, type: "MOCK",
      },
      {
        title: "Read: target companies' engineering blogs (2 per company)",
        description: "Flipkart tech blog, Razorpay engineering, CRED engineering. For each: note tech stack choices, scale challenges, open roles. Mention in interviews.",
        weekNumber: 2, duration: 45, type: "READ",
      },
      {
        title: "Apply: referral outreach to engineers at 5 target companies",
        description: "LinkedIn: personalised DMs (not copy-paste). Reference a blog post they wrote. Ask for a referral or intro to hiring manager. Track in a spreadsheet.",
        weekNumber: 2, duration: 45, type: "BUILD",
      },
      // Week 3
      {
        title: "Practice: AI System Design ace card — rehearse IZBA pipeline explanation",
        description: "Explain IZBA's 9-Mind pipeline as if designing it from scratch: requirements → data model → 9 minds → eval layer (TEBO) → health score. Practice 3 times, under 10 min.",
        weekNumber: 3, duration: 60, type: "REVIEW",
      },
      {
        title: "Mock: full-loop interview #2 on interviewing.io",
        description: "Request an interviewer from a FAANG-level company if possible. Debrief immediately. Fix the top 2 weaknesses for next week.",
        weekNumber: 3, duration: 90, type: "MOCK",
      },
      {
        title: "DSA revision: timed contest — 4 problems, 90 min",
        description: "Last contest simulation. Judge yourself harshly. If you struggle on mediums, spend next 2 days on that pattern.",
        weekNumber: 3, duration: 90, type: "DSA",
      },
      {
        title: "Learn salary negotiation: anchoring, BATNA, competing offers",
        description: "Know your floor (₹40L), target (₹60L+), and ceiling (₹80L+). Never reveal current salary. Negotiate base + bonus + ESOPs + joining bonus separately.",
        weekNumber: 3, duration: 30, type: "LEARN",
      },
      // Week 4
      {
        title: "Mock: final full-loop interview #3",
        description: "Treat as the real thing. Camera on, professional setup, time yourself. No pausing the mock. Debrief in writing.",
        weekNumber: 4, duration: 90, type: "MOCK",
      },
      {
        title: "Apply: direct applications to 5–7 target companies",
        description: "Apply to: Flipkart, Razorpay, CRED, Zepto, PhonePe (India), Stripe/Vercel/Anthropic (remote). Tailor resume per company. Track all applications.",
        weekNumber: 4, duration: 60, type: "BUILD",
      },
      {
        title: "Review: final retro — 12 months of learning documented",
        description: "Write a personal retro: what you built, what surprised you, what you'd change. Publish as a blog post or LinkedIn post. This becomes your narrative.",
        weekNumber: 4, duration: 45, type: "REVIEW",
      },
      {
        title: "Read: offer negotiation checklist and next steps",
        description: "When the offer comes: ask for 48 hrs, get it in writing, negotiate every component, use competing offers as leverage, never accept on the spot.",
        weekNumber: 4, duration: 20, type: "READ",
      },
    ],
    resources: [
      { title: "interviewing.io", url: "https://interviewing.io/", type: "TOOL", priority: 1 },
      { title: "Pramp (free mocks)", url: "https://www.pramp.com/", type: "TOOL", priority: 1 },
      { title: "Cracking the Coding Interview", url: "https://www.crackingthecodinginterview.com/", type: "BOOK", priority: 2 },
      { title: "Levels.fyi (salary data India)", url: "https://www.levels.fyi/", type: "TOOL", priority: 1 },
      { title: "Glassdoor India (interview experience)", url: "https://www.glassdoor.co.in/", type: "TOOL", priority: 2 },
      { title: "Gergely Orosz: The Software Engineer's Guidebook", url: "https://www.engguidebook.com/", type: "BOOK", priority: 2 },
      { title: "Haseeb Qureshi: How to Negotiate Your Salary", url: "https://haseebq.com/my-ten-rules-for-negotiating-a-job-offer/", type: "ARTICLE", priority: 1 },
      { title: "Excalidraw (for live design whiteboarding)", url: "https://excalidraw.com/", type: "TOOL", priority: 2 },
    ],
    project: {
      name: "Portfolio Polish",
      description: "Final pass across all 12 GitHub repositories: polished READMEs, architecture diagrams, live demo links, setup instructions. Personal portfolio site summarising the 12-month journey. Published blog post / LinkedIn article as the public narrative.",
      techStack: ["GitHub", "Vercel", "Markdown", "Excalidraw"],
    },
  },

];

// ---------------------------------------------------------------------------
// MAIN — upsert content for each month
// ---------------------------------------------------------------------------

async function main() {
  console.log("Enriching curriculum content for all 12 months...\n");

  for (const c of content) {
    const month = await prisma.month.findUnique({ where: { number: c.monthNumber } });
    if (!month) {
      console.warn(`  ⚠  Month ${c.monthNumber} not found in DB — skipping. Run seed.ts first.`);
      continue;
    }

    // Delete old content
    await prisma.topic.deleteMany({ where: { monthId: month.id } });
    await prisma.dailyTask.deleteMany({ where: { monthId: month.id } });
    await prisma.resource.deleteMany({ where: { monthId: month.id } });
    await prisma.monthProject.deleteMany({ where: { monthId: month.id } });

    // Create enriched content
    await prisma.topic.createMany({
      data: c.topics.map((t, i) => ({ ...t, monthId: month.id, order: i + 1 })),
    });

    await prisma.dailyTask.createMany({
      data: c.tasks.map((t, i) => ({ ...t, monthId: month.id, order: i + 1 })),
    });

    await prisma.resource.createMany({
      data: c.resources.map((r) => ({ ...r, monthId: month.id })),
    });

    await prisma.monthProject.create({
      data: { ...c.project, monthId: month.id },
    });

    console.log(
      `  ✓  Month ${c.monthNumber}: ${c.topics.length} topics, ${c.tasks.length} tasks, ${c.resources.length} resources`
    );
  }

  console.log("\nDone! All 12 months enriched.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
