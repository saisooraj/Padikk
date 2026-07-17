import "dotenv/config";
import bcrypt from "bcryptjs";
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

interface MonthSeed {
  number: number;
  title: string;
  subtitle: string;
  phaseNumber: number;
  topics: TopicSeed[];
  tasks: TaskSeed[];
  resources: ResourceSeed[];
  project: { name: string; description: string; techStack: string[] };
}

const phases = [
  {
    number: 1,
    name: "Python Backend",
    description:
      "Move from tutorial-level scripts to production-grade Python services.",
    color: "backend",
  },
  {
    number: 2,
    name: "AI Mastery",
    description:
      "Master the full LLM application stack — APIs, retrieval, agents, and evals.",
    color: "ai",
  },
  {
    number: 3,
    name: "Cloud + Infra",
    description:
      "Take your AI stack from a laptop deploy to real cloud infrastructure.",
    color: "cloud",
  },
  {
    number: 4,
    name: "DSA — The Gate",
    description:
      "Pattern-first data structures & algorithms practice for interviews.",
    color: "dsa",
  },
  {
    number: 5,
    name: "System Design",
    description:
      "Design large-scale systems, HLD, LLD, and distributed architectures.",
    color: "sysdesign",
  },
  {
    number: 6,
    name: "Interview Sprint",
    description: "Stop learning. Start applying — and land the offer.",
    color: "interview",
  },
];

const months: MonthSeed[] = [
  {
    number: 1,
    title: "Python Production",
    subtitle: "College Python → real backend",
    phaseNumber: 1,
    topics: [
      { name: "Modern Python: type hints, dataclasses, Pydantic v2", category: "learn" },
      { name: "async/await patterns, asyncio event loop", category: "learn" },
      { name: "FastAPI: routing, middleware, dependency injection", category: "learn" },
      { name: "SQLAlchemy ORM + PostgreSQL", category: "learn" },
      { name: "JWT auth end-to-end", category: "learn" },
      { name: "pytest: unit tests, fixtures", category: "practice" },
      { name: "Alembic database migrations", category: "practice" },
      { name: "Build your first FastAPI project", category: "build" },
    ],
    tasks: [
      { title: "Learn type hints, dataclasses & Pydantic v2", weekNumber: 1, duration: 60, type: "LEARN" },
      { title: "Learn asyncio & the event loop", weekNumber: 1, duration: 60, type: "LEARN" },
      { title: "Practice: write async utility scripts", weekNumber: 1, duration: 45, type: "BUILD" },
      { title: "Learn FastAPI routing & dependency injection", weekNumber: 2, duration: 75, type: "LEARN" },
      { title: "Practice: scaffold a FastAPI hello-service", weekNumber: 2, duration: 60, type: "BUILD" },
      { title: "Review: REST API design basics", weekNumber: 2, duration: 30, type: "REVIEW" },
      { title: "Learn SQLAlchemy ORM + PostgreSQL", weekNumber: 3, duration: 75, type: "LEARN" },
      { title: "Learn JWT auth end-to-end", weekNumber: 3, duration: 60, type: "LEARN" },
      { title: "Practice: pytest unit tests & fixtures", weekNumber: 3, duration: 60, type: "BUILD" },
      { title: "Practice: Alembic migrations", weekNumber: 4, duration: 45, type: "BUILD" },
      { title: "Build: IZBA Health Score API", weekNumber: 4, duration: 120, type: "BUILD" },
      { title: "Review: month 1 retro & notes", weekNumber: 4, duration: 30, type: "REVIEW" },
    ],
    resources: [
      { title: "Python Docs — asyncio", url: "https://docs.python.org/3/library/asyncio.html", type: "ARTICLE", priority: 1 },
      { title: "FastAPI Docs", url: "https://fastapi.tiangolo.com/", type: "ARTICLE", priority: 1 },
      { title: "Pydantic v2 Docs", url: "https://docs.pydantic.dev/latest/", type: "ARTICLE", priority: 2 },
      { title: "SQLAlchemy 2.0 Docs", url: "https://docs.sqlalchemy.org/en/20/", type: "ARTICLE", priority: 2 },
    ],
    project: {
      name: "IZBA Health Score API",
      description: "A FastAPI service that computes and serves a health score with JWT-protected endpoints.",
      techStack: ["FastAPI", "PostgreSQL", "JWT", "Pydantic"],
    },
  },
  {
    number: 2,
    title: "Backend Architecture",
    subtitle: "APIs that don't break in production",
    phaseNumber: 1,
    topics: [
      { name: "Celery + Redis task queues", category: "learn" },
      { name: "Rate limiting & caching strategies", category: "learn" },
      { name: "API versioning & OpenAPI docs", category: "learn" },
      { name: "Structured logging & error handling", category: "learn" },
      { name: "Background jobs & webhooks", category: "learn" },
      { name: "Docker basics for backend services", category: "practice" },
      { name: "Integration testing with pytest", category: "practice" },
      { name: "Build the AI Email Intelligence Service", category: "build" },
    ],
    tasks: [
      { title: "Learn Celery + Redis task queues", weekNumber: 1, duration: 75, type: "LEARN" },
      { title: "Learn rate limiting & caching strategies", weekNumber: 1, duration: 60, type: "LEARN" },
      { title: "Practice: add a Redis cache layer", weekNumber: 1, duration: 60, type: "BUILD" },
      { title: "Learn API versioning & OpenAPI docs", weekNumber: 2, duration: 60, type: "LEARN" },
      { title: "Learn structured logging & error handling", weekNumber: 2, duration: 60, type: "LEARN" },
      { title: "Practice: instrument structured logging", weekNumber: 2, duration: 45, type: "BUILD" },
      { title: "Learn background jobs & webhooks", weekNumber: 3, duration: 60, type: "LEARN" },
      { title: "Learn Docker basics for backend services", weekNumber: 3, duration: 60, type: "LEARN" },
      { title: "Practice: Dockerize the service", weekNumber: 3, duration: 60, type: "BUILD" },
      { title: "Practice: write integration tests", weekNumber: 4, duration: 60, type: "BUILD" },
      { title: "Build: AI Email Intelligence Service", weekNumber: 4, duration: 120, type: "BUILD" },
      { title: "Review: month 2 retro & notes", weekNumber: 4, duration: 30, type: "REVIEW" },
    ],
    resources: [
      { title: "Celery Docs", url: "https://docs.celeryq.dev/", type: "ARTICLE", priority: 1 },
      { title: "Redis Docs", url: "https://redis.io/docs/latest/", type: "ARTICLE", priority: 2 },
      { title: "Docker Docs", url: "https://docs.docker.com/", type: "ARTICLE", priority: 1 },
    ],
    project: {
      name: "AI Email Intelligence Service",
      description: "A queue-backed service that classifies and summarizes inbound email with Celery workers.",
      techStack: ["FastAPI", "Celery", "Redis", "PostgreSQL"],
    },
  },
  {
    number: 3,
    title: "LLM APIs + Structured Output",
    subtitle: "The formal API layer",
    phaseNumber: 2,
    topics: [
      { name: "OpenAI & Anthropic API fundamentals", category: "learn" },
      { name: "Function calling & tool use", category: "learn" },
      { name: "Structured output with Pydantic/JSON schema", category: "learn" },
      { name: "Streaming responses", category: "learn" },
      { name: "Prompt engineering patterns", category: "learn" },
      { name: "Token counting & cost management", category: "practice" },
      { name: "Build the AI Streaming Chat App", category: "build" },
    ],
    tasks: [
      { title: "Learn OpenAI & Anthropic API fundamentals", weekNumber: 1, duration: 60, type: "LEARN" },
      { title: "Learn prompt engineering patterns", weekNumber: 1, duration: 60, type: "LEARN" },
      { title: "Practice: call both provider APIs from a script", weekNumber: 1, duration: 45, type: "BUILD" },
      { title: "Learn function calling & tool use", weekNumber: 2, duration: 75, type: "LEARN" },
      { title: "Learn structured output with Pydantic/JSON schema", weekNumber: 2, duration: 60, type: "LEARN" },
      { title: "Practice: build a structured extraction endpoint", weekNumber: 2, duration: 60, type: "BUILD" },
      { title: "Learn streaming responses", weekNumber: 3, duration: 60, type: "LEARN" },
      { title: "Learn token counting & cost management", weekNumber: 3, duration: 45, type: "LEARN" },
      { title: "Practice: implement retries & backoff", weekNumber: 3, duration: 45, type: "BUILD" },
      { title: "Build: AI Streaming Chat App", weekNumber: 4, duration: 120, type: "BUILD" },
      { title: "Review: provider tradeoffs retro", weekNumber: 4, duration: 30, type: "REVIEW" },
      { title: "Read: provider API changelogs", weekNumber: 4, duration: 30, type: "READ" },
    ],
    resources: [
      { title: "OpenAI API Docs", url: "https://platform.openai.com/docs", type: "ARTICLE", priority: 1 },
      { title: "Anthropic API Docs", url: "https://docs.anthropic.com/", type: "ARTICLE", priority: 1 },
      { title: "Prompt Engineering Guide", url: "https://www.promptingguide.ai/", type: "ARTICLE", priority: 2 },
    ],
    project: {
      name: "AI Streaming Chat App",
      description: "A Next.js chat interface streaming tokens from OpenAI and Anthropic side by side.",
      techStack: ["Next.js", "OpenAI API", "Anthropic API", "Streaming"],
    },
  },
  {
    number: 4,
    title: "RAG + Embeddings + Vector Search",
    subtitle: "The complete retrieval stack",
    phaseNumber: 2,
    topics: [
      { name: "Embedding models & similarity search", category: "learn" },
      { name: "Chunking strategies for documents", category: "learn" },
      { name: "Vector DBs: Qdrant & pgvector", category: "learn" },
      { name: "Hybrid search (keyword + vector)", category: "learn" },
      { name: "Reranking & RAG evaluation basics", category: "learn" },
      { name: "PDF/text ingestion pipelines", category: "practice" },
      { name: "Build the PDF RAG Chatbot", category: "build" },
    ],
    tasks: [
      { title: "Learn embeddings & similarity search", weekNumber: 1, duration: 60, type: "LEARN" },
      { title: "Learn chunking strategies for documents", weekNumber: 1, duration: 60, type: "LEARN" },
      { title: "Practice: embed a sample corpus", weekNumber: 1, duration: 45, type: "BUILD" },
      { title: "Learn vector DBs: Qdrant & pgvector", weekNumber: 2, duration: 75, type: "LEARN" },
      { title: "Practice: stand up Qdrant locally", weekNumber: 2, duration: 60, type: "BUILD" },
      { title: "Read: vector DB comparison articles", weekNumber: 2, duration: 30, type: "READ" },
      { title: "Learn hybrid search & reranking", weekNumber: 3, duration: 60, type: "LEARN" },
      { title: "Learn RAG evaluation basics", weekNumber: 3, duration: 45, type: "LEARN" },
      { title: "Practice: build a document ingestion pipeline", weekNumber: 3, duration: 60, type: "BUILD" },
      { title: "Build: PDF RAG Chatbot", weekNumber: 4, duration: 120, type: "BUILD" },
      { title: "Review: retrieval quality retro", weekNumber: 4, duration: 30, type: "REVIEW" },
    ],
    resources: [
      { title: "Qdrant Docs", url: "https://qdrant.tech/documentation/", type: "ARTICLE", priority: 1 },
      { title: "pgvector", url: "https://github.com/pgvector/pgvector", type: "REPO", priority: 2 },
      { title: "OpenAI Embeddings Guide", url: "https://platform.openai.com/docs/guides/embeddings", type: "ARTICLE", priority: 1 },
    ],
    project: {
      name: "PDF RAG Chatbot",
      description: "A hybrid-search RAG chatbot that answers questions grounded in uploaded PDFs.",
      techStack: ["FastAPI", "Qdrant", "OpenAI Embeddings", "Hybrid Search"],
    },
  },
  {
    number: 5,
    title: "Agents + MCP + Tool Calling + LangGraph",
    subtitle: "Build systems that plan and loop",
    phaseNumber: 2,
    topics: [
      { name: "Agent design patterns", category: "learn" },
      { name: "LangGraph state machines", category: "learn" },
      { name: "MCP protocol fundamentals", category: "learn" },
      { name: "Building custom tools", category: "learn" },
      { name: "Multi-step planning & looping", category: "learn" },
      { name: "Memory, context management & guardrails", category: "practice" },
      { name: "Build the AI Research Agent", category: "build" },
    ],
    tasks: [
      { title: "Learn agent design patterns", weekNumber: 1, duration: 60, type: "LEARN" },
      { title: "Learn LangGraph state machines", weekNumber: 1, duration: 75, type: "LEARN" },
      { title: "Practice: build a simple LangGraph graph", weekNumber: 1, duration: 60, type: "BUILD" },
      { title: "Learn MCP protocol fundamentals", weekNumber: 2, duration: 60, type: "LEARN" },
      { title: "Learn building custom tools", weekNumber: 2, duration: 60, type: "LEARN" },
      { title: "Practice: write an MCP tool server", weekNumber: 2, duration: 75, type: "BUILD" },
      { title: "Learn multi-step planning & looping", weekNumber: 3, duration: 60, type: "LEARN" },
      { title: "Learn memory & context management", weekNumber: 3, duration: 45, type: "LEARN" },
      { title: "Practice: add agent guardrails", weekNumber: 3, duration: 45, type: "BUILD" },
      { title: "Build: AI Research Agent", weekNumber: 4, duration: 120, type: "BUILD" },
      { title: "Review: agent failure modes retro", weekNumber: 4, duration: 30, type: "REVIEW" },
    ],
    resources: [
      { title: "LangGraph Docs", url: "https://langchain-ai.github.io/langgraph/", type: "ARTICLE", priority: 1 },
      { title: "Model Context Protocol", url: "https://modelcontextprotocol.io/", type: "ARTICLE", priority: 1 },
      { title: "Building Effective Agents (Anthropic)", url: "https://www.anthropic.com/research/building-effective-agents", type: "ARTICLE", priority: 1 },
    ],
    project: {
      name: "AI Research Agent",
      description: "A LangGraph agent with custom MCP tools that plans, searches, and synthesizes research reports.",
      techStack: ["LangGraph", "MCP", "Custom Tools", "PostgreSQL"],
    },
  },
  {
    number: 6,
    title: "AI Evals + Observability + Queues",
    subtitle: "Production AI: measure and scale",
    phaseNumber: 2,
    topics: [
      { name: "Eval frameworks: Braintrust & Phoenix", category: "learn" },
      { name: "Writing LLM-as-judge evals", category: "learn" },
      { name: "Tracing & observability", category: "learn" },
      { name: "Queue-based scaling with Celery/Redis", category: "learn" },
      { name: "Latency & cost dashboards", category: "learn" },
      { name: "Regression & A/B testing for prompts", category: "practice" },
      { name: "Build the AI Evaluation Dashboard", category: "build" },
    ],
    tasks: [
      { title: "Learn eval frameworks: Braintrust & Phoenix", weekNumber: 1, duration: 75, type: "LEARN" },
      { title: "Learn LLM-as-judge evals", weekNumber: 1, duration: 60, type: "LEARN" },
      { title: "Practice: write a first eval suite", weekNumber: 1, duration: 60, type: "BUILD" },
      { title: "Learn tracing & observability", weekNumber: 2, duration: 60, type: "LEARN" },
      { title: "Practice: instrument request tracing", weekNumber: 2, duration: 60, type: "BUILD" },
      { title: "Read: observability best practices", weekNumber: 2, duration: 30, type: "READ" },
      { title: "Learn queue-based scaling with Celery/Redis", weekNumber: 3, duration: 60, type: "LEARN" },
      { title: "Learn latency & cost dashboards", weekNumber: 3, duration: 45, type: "LEARN" },
      { title: "Practice: build a cost dashboard", weekNumber: 3, duration: 60, type: "BUILD" },
      { title: "Build: AI Evaluation Dashboard", weekNumber: 4, duration: 120, type: "BUILD" },
      { title: "Review: eval coverage retro", weekNumber: 4, duration: 30, type: "REVIEW" },
    ],
    resources: [
      { title: "Braintrust Docs", url: "https://www.braintrust.dev/docs", type: "ARTICLE", priority: 2 },
      { title: "Arize Phoenix Docs", url: "https://docs.arize.com/phoenix", type: "ARTICLE", priority: 2 },
    ],
    project: {
      name: "AI Evaluation Dashboard",
      description: "A dashboard that tracks eval scores, latency, and cost across prompt/model versions.",
      techStack: ["Phoenix", "Braintrust", "FastAPI", "Redis", "React"],
    },
  },
  {
    number: 7,
    title: "Kubernetes + AWS + Terraform",
    subtitle: "From deployed once to production infra",
    phaseNumber: 3,
    topics: [
      { name: "Docker → Kubernetes fundamentals", category: "learn" },
      { name: "Pods, deployments, services", category: "learn" },
      { name: "Terraform IaC basics", category: "learn" },
      { name: "AWS EKS setup", category: "learn" },
      { name: "CI/CD with GitHub Actions", category: "learn" },
      { name: "Secrets, config management & monitoring", category: "practice" },
      { name: "Deploy the full AI stack to AWS EKS", category: "build" },
    ],
    tasks: [
      { title: "Learn Kubernetes fundamentals", weekNumber: 1, duration: 75, type: "LEARN" },
      { title: "Learn pods, deployments & services", weekNumber: 1, duration: 60, type: "LEARN" },
      { title: "Practice: run a local Kubernetes cluster", weekNumber: 1, duration: 60, type: "BUILD" },
      { title: "Learn Terraform IaC basics", weekNumber: 2, duration: 75, type: "LEARN" },
      { title: "Practice: write Terraform modules", weekNumber: 2, duration: 60, type: "BUILD" },
      { title: "Read: Terraform AWS provider docs", weekNumber: 2, duration: 30, type: "READ" },
      { title: "Learn AWS EKS setup", weekNumber: 3, duration: 75, type: "LEARN" },
      { title: "Learn CI/CD with GitHub Actions", weekNumber: 3, duration: 60, type: "LEARN" },
      { title: "Practice: build a CI/CD pipeline", weekNumber: 3, duration: 60, type: "BUILD" },
      { title: "Build: deploy the full AI stack to AWS EKS", weekNumber: 4, duration: 150, type: "BUILD" },
      { title: "Review: infrastructure retro", weekNumber: 4, duration: 30, type: "REVIEW" },
    ],
    resources: [
      { title: "Kubernetes Docs", url: "https://kubernetes.io/docs/home/", type: "ARTICLE", priority: 1 },
      { title: "Terraform AWS Provider Docs", url: "https://registry.terraform.io/providers/hashicorp/aws/latest/docs", type: "ARTICLE", priority: 1 },
      { title: "Terraform: Up & Running", url: "https://www.oreilly.com/library/view/terraform-up/9781098116736/", type: "BOOK", priority: 2 },
    ],
    project: {
      name: "Deploy Full AI Stack to AWS EKS",
      description: "Containerize, orchestrate, and deploy the full AI stack to a production EKS cluster via Terraform.",
      techStack: ["Docker", "Kubernetes", "Terraform", "GitHub Actions"],
    },
  },
  {
    number: 8,
    title: "DSA Foundations",
    subtitle: "Pattern-first, not grind-first",
    phaseNumber: 4,
    topics: [
      { name: "Arrays & strings patterns", category: "learn" },
      { name: "Hash maps", category: "learn" },
      { name: "Two pointers", category: "learn" },
      { name: "Sliding window", category: "learn" },
      { name: "Binary search", category: "learn" },
      { name: "Linked lists, stacks & queues", category: "learn" },
      { name: "Daily timed problem sets", category: "practice" },
    ],
    tasks: [
      { title: "Learn arrays & strings patterns", weekNumber: 1, duration: 45, type: "LEARN" },
      { title: "DSA: solve arrays & strings set", weekNumber: 1, duration: 90, type: "DSA" },
      { title: "Review: pattern recap", weekNumber: 1, duration: 30, type: "REVIEW" },
      { title: "Learn hash maps & two pointers", weekNumber: 2, duration: 45, type: "LEARN" },
      { title: "DSA: solve hash map & two pointer set", weekNumber: 2, duration: 90, type: "DSA" },
      { title: "Review: mistakes log", weekNumber: 2, duration: 30, type: "REVIEW" },
      { title: "Learn sliding window & binary search", weekNumber: 3, duration: 45, type: "LEARN" },
      { title: "DSA: solve sliding window & binary search set", weekNumber: 3, duration: 90, type: "DSA" },
      { title: "Review: pattern recap", weekNumber: 3, duration: 30, type: "REVIEW" },
      { title: "Learn linked lists, stacks & queues", weekNumber: 4, duration: 45, type: "LEARN" },
      { title: "DSA: solve linked list & stack set", weekNumber: 4, duration: 90, type: "DSA" },
      { title: "Build: Meeting Intelligence Platform kickoff", weekNumber: 4, duration: 60, type: "BUILD" },
    ],
    resources: [
      { title: "Neetcode.io", url: "https://neetcode.io/", type: "TOOL", priority: 1 },
      { title: "LeetCode", url: "https://leetcode.com/", type: "TOOL", priority: 1 },
      { title: "Neetcode 150 List", url: "https://github.com/neetcode-gh/leetcode", type: "REPO", priority: 1 },
    ],
    project: {
      name: "Meeting Intelligence Platform",
      description: "A Kafka-backed pipeline that transcribes and extracts action items from meeting audio.",
      techStack: ["Kafka", "FastAPI", "Whisper", "PostgreSQL"],
    },
  },
  {
    number: 9,
    title: "DSA Intermediate",
    subtitle: "Trees, graphs, heaps — medium-hard territory",
    phaseNumber: 4,
    topics: [
      { name: "Binary trees", category: "learn" },
      { name: "Binary search trees", category: "learn" },
      { name: "Graphs: BFS/DFS", category: "learn" },
      { name: "Topological sort", category: "learn" },
      { name: "Heaps", category: "learn" },
      { name: "Greedy algorithms & DP basics", category: "learn" },
      { name: "Open source contribution", category: "build" },
    ],
    tasks: [
      { title: "Learn binary trees & BSTs", weekNumber: 1, duration: 45, type: "LEARN" },
      { title: "DSA: solve tree problem set", weekNumber: 1, duration: 90, type: "DSA" },
      { title: "Review: pattern recap", weekNumber: 1, duration: 30, type: "REVIEW" },
      { title: "Learn graphs: BFS/DFS", weekNumber: 2, duration: 60, type: "LEARN" },
      { title: "DSA: solve graph problem set", weekNumber: 2, duration: 90, type: "DSA" },
      { title: "Review: mistakes log", weekNumber: 2, duration: 30, type: "REVIEW" },
      { title: "Learn topological sort & heaps", weekNumber: 3, duration: 45, type: "LEARN" },
      { title: "DSA: solve heap & toposort set", weekNumber: 3, duration: 90, type: "DSA" },
      { title: "Review: pattern recap", weekNumber: 3, duration: 30, type: "REVIEW" },
      { title: "Learn greedy algorithms & DP basics", weekNumber: 4, duration: 60, type: "LEARN" },
      { title: "DSA: solve greedy & DP set", weekNumber: 4, duration: 90, type: "DSA" },
      { title: "Build: open source contribution PR", weekNumber: 4, duration: 90, type: "BUILD" },
    ],
    resources: [
      { title: "Designing Data-Intensive Applications", url: "https://dataintensive.net/", type: "BOOK", priority: 2 },
      { title: "Neetcode.io", url: "https://neetcode.io/", type: "TOOL", priority: 1 },
      { title: "LeetCode", url: "https://leetcode.com/", type: "TOOL", priority: 1 },
    ],
    project: {
      name: "Open Source Contribution",
      description: "Ship a merged pull request to an active LangGraph, FastAPI, or Opik repository.",
      techStack: ["LangGraph", "FastAPI", "Opik"],
    },
  },
  {
    number: 10,
    title: "DSA Advanced + Company Prep",
    subtitle: "Hard problems, timed, company-specific",
    phaseNumber: 4,
    topics: [
      { name: "Advanced dynamic programming", category: "learn" },
      { name: "Backtracking", category: "learn" },
      { name: "Shortest path algorithms", category: "learn" },
      { name: "Union-find", category: "learn" },
      { name: "Tries & bit manipulation", category: "learn" },
      { name: "Company-specific problem sets", category: "practice" },
      { name: "Timed mock contests", category: "practice" },
    ],
    tasks: [
      { title: "Learn advanced dynamic programming", weekNumber: 1, duration: 60, type: "LEARN" },
      { title: "DSA: solve advanced DP set", weekNumber: 1, duration: 90, type: "DSA" },
      { title: "Review: pattern recap", weekNumber: 1, duration: 30, type: "REVIEW" },
      { title: "Learn backtracking & shortest path", weekNumber: 2, duration: 60, type: "LEARN" },
      { title: "DSA: solve backtracking & shortest path set", weekNumber: 2, duration: 90, type: "DSA" },
      { title: "Review: mistakes log", weekNumber: 2, duration: 30, type: "REVIEW" },
      { title: "Learn union-find, tries & bit manipulation", weekNumber: 3, duration: 60, type: "LEARN" },
      { title: "DSA: solve union-find & trie set", weekNumber: 3, duration: 90, type: "DSA" },
      { title: "Review: pattern recap", weekNumber: 3, duration: 30, type: "REVIEW" },
      { title: "DSA: timed mock contest", weekNumber: 4, duration: 120, type: "DSA" },
      { title: "Build: AI Finance Assistant", weekNumber: 4, duration: 90, type: "BUILD" },
      { title: "Review: company prep retro", weekNumber: 4, duration: 30, type: "REVIEW" },
    ],
    resources: [
      { title: "System Design Interview, Vol. 1", url: "https://www.systemdesigninterview.com/", type: "BOOK", priority: 1 },
      { title: "Neetcode.io", url: "https://neetcode.io/", type: "TOOL", priority: 1 },
      { title: "LeetCode", url: "https://leetcode.com/", type: "TOOL", priority: 1 },
    ],
    project: {
      name: "AI Finance Assistant",
      description: "A scheduled assistant that ingests transactions and answers finance questions via LLM.",
      techStack: ["FastAPI", "PostgreSQL", "Redis", "Cron", "LLM APIs"],
    },
  },
  {
    number: 11,
    title: "System Design HLD + LLD + Distributed",
    subtitle: "Design Twitter, Uber, Stripe — and an AI pipeline",
    phaseNumber: 5,
    topics: [
      { name: "HLD fundamentals: scaling & load balancing", category: "learn" },
      { name: "LLD & OOD principles", category: "learn" },
      { name: "Designing Twitter, Uber, Stripe", category: "practice" },
      { name: "Distributed systems: CAP & consensus", category: "learn" },
      { name: "Designing an AI pipeline at scale", category: "learn" },
      { name: "Caching, sharding & message queues", category: "learn" },
      { name: "Build the Customer Support AI SaaS", category: "build" },
    ],
    tasks: [
      { title: "Learn HLD fundamentals: scaling & load balancing", weekNumber: 1, duration: 75, type: "LEARN" },
      { title: "Learn LLD & OOD principles", weekNumber: 1, duration: 60, type: "LEARN" },
      { title: "Practice: design Twitter (HLD)", weekNumber: 1, duration: 60, type: "BUILD" },
      { title: "Learn distributed systems: CAP & consensus", weekNumber: 2, duration: 75, type: "LEARN" },
      { title: "Practice: design Uber (HLD)", weekNumber: 2, duration: 60, type: "BUILD" },
      { title: "Read: Designing Data-Intensive Applications chapters", weekNumber: 2, duration: 60, type: "READ" },
      { title: "Learn designing an AI pipeline at scale", weekNumber: 3, duration: 60, type: "LEARN" },
      { title: "Learn caching & database sharding", weekNumber: 3, duration: 60, type: "LEARN" },
      { title: "Practice: design Stripe (HLD)", weekNumber: 3, duration: 60, type: "BUILD" },
      { title: "Learn message queues & event-driven design", weekNumber: 4, duration: 60, type: "LEARN" },
      { title: "Build: Customer Support AI SaaS", weekNumber: 4, duration: 120, type: "BUILD" },
      { title: "Mock: system design mock interview", weekNumber: 4, duration: 60, type: "MOCK" },
    ],
    resources: [
      { title: "Designing Data-Intensive Applications", url: "https://dataintensive.net/", type: "BOOK", priority: 1 },
      { title: "System Design Interview, Vol. 1", url: "https://www.systemdesigninterview.com/", type: "BOOK", priority: 1 },
      { title: "System Design Interview, Vol. 2", url: "https://www.systemdesigninterview.com/", type: "BOOK", priority: 2 },
    ],
    project: {
      name: "Customer Support AI SaaS",
      description: "A multi-tenant support platform with AI-assisted replies, built on an event-driven backend.",
      techStack: ["FastAPI", "React", "Kafka", "K8s", "OAuth2"],
    },
  },
  {
    number: 12,
    title: "Interview Sprint",
    subtitle: "Stop learning. Start applying.",
    phaseNumber: 6,
    topics: [
      { name: "Resume & portfolio polish", category: "practice" },
      { name: "Behavioral interview prep: STAR method", category: "learn" },
      { name: "Company research & applications", category: "practice" },
      { name: "Full-loop mock interviews", category: "practice" },
      { name: "Salary negotiation", category: "learn" },
      { name: "Final DSA spaced repetition", category: "practice" },
      { name: "Final system design review", category: "practice" },
    ],
    tasks: [
      { title: "Learn behavioral prep: STAR method", weekNumber: 1, duration: 45, type: "LEARN" },
      { title: "Build: portfolio polish", weekNumber: 1, duration: 90, type: "BUILD" },
      { title: "Review: resume pass", weekNumber: 1, duration: 45, type: "REVIEW" },
      { title: "Read: target company research", weekNumber: 2, duration: 45, type: "READ" },
      { title: "Mock: full-loop mock interview #1", weekNumber: 2, duration: 90, type: "MOCK" },
      { title: "Review: DSA spaced repetition", weekNumber: 2, duration: 60, type: "REVIEW" },
      { title: "Mock: full-loop mock interview #2", weekNumber: 3, duration: 90, type: "MOCK" },
      { title: "Review: system design spaced repetition", weekNumber: 3, duration: 60, type: "REVIEW" },
      { title: "Learn salary negotiation", weekNumber: 3, duration: 30, type: "LEARN" },
      { title: "Mock: final mock interview", weekNumber: 4, duration: 90, type: "MOCK" },
      { title: "Review: final retro & next steps", weekNumber: 4, duration: 30, type: "REVIEW" },
      { title: "Read: offer negotiation checklist", weekNumber: 4, duration: 20, type: "READ" },
    ],
    resources: [
      { title: "Cracking the Coding Interview", url: "https://www.crackingthecodinginterview.com/", type: "BOOK", priority: 2 },
      { title: "Pramp", url: "https://www.pramp.com/", type: "TOOL", priority: 1 },
      { title: "interviewing.io", url: "https://interviewing.io/", type: "TOOL", priority: 1 },
    ],
    project: {
      name: "Portfolio Polish",
      description: "Final pass on README files, live deploys, and case-study write-ups across all projects.",
      techStack: ["GitHub", "Vercel"],
    },
  },
];

async function seedUser() {
  const email = process.env.SEED_USER_EMAIL;
  const password = process.env.SEED_USER_PASSWORD;
  const name = process.env.SEED_USER_NAME;
  if (!email || !password) {
    console.log("Skipping user seed: SEED_USER_EMAIL/SEED_USER_PASSWORD not set.");
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  await prisma.user.upsert({
    where: { email },
    update: { name, hashedPassword },
    create: { email, name, hashedPassword },
  });
  console.log(`Seeded user ${email}.`);
}

async function main() {
  console.log("Seeding Padikk curriculum...");

  await seedUser();

  for (const phase of phases) {
    await prisma.phase.upsert({
      where: { number: phase.number },
      update: phase,
      create: phase,
    });
  }
  console.log(`Seeded ${phases.length} phases.`);

  for (const month of months) {
    const phase = await prisma.phase.findUniqueOrThrow({
      where: { number: month.phaseNumber },
    });

    const existing = await prisma.month.findUnique({ where: { number: month.number } });
    if (existing) {
      await prisma.topic.deleteMany({ where: { monthId: existing.id } });
      await prisma.dailyTask.deleteMany({ where: { monthId: existing.id } });
      await prisma.resource.deleteMany({ where: { monthId: existing.id } });
      await prisma.monthProject.deleteMany({ where: { monthId: existing.id } });
    }

    await prisma.month.upsert({
      where: { number: month.number },
      update: {
        title: month.title,
        subtitle: month.subtitle,
        phaseId: phase.id,
        topics: {
          create: month.topics.map((t, i) => ({ ...t, order: i + 1 })),
        },
        dailyTasks: {
          create: month.tasks.map((t, i) => ({ ...t, order: i + 1 })),
        },
        resources: { create: month.resources },
        project: { create: month.project },
      },
      create: {
        number: month.number,
        title: month.title,
        subtitle: month.subtitle,
        phaseId: phase.id,
        topics: {
          create: month.topics.map((t, i) => ({ ...t, order: i + 1 })),
        },
        dailyTasks: {
          create: month.tasks.map((t, i) => ({ ...t, order: i + 1 })),
        },
        resources: { create: month.resources },
        project: { create: month.project },
      },
    });
  }
  console.log(`Seeded ${months.length} months with topics, tasks, resources & projects.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
