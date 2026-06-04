export const projects = [
  {
    title: 'Personal Chatbot with Memory',
    subtitle: 'Payments-domain assistant that remembers across sessions',
    description:
      "A chat UI where the bot remembers who you are across sessions — your role, depth preference, interview prep, topics covered. Built around Anthropic's Memory Tool: Claude itself decides what to write to a per-user memory folder and what to recall. Streaming SSE responses, per-user filesystem sandbox (path-traversal-safe), payments-domain system prompt cached at ~90% discount on every turn. Deployed in demo mode (Render free tier wipes state on cold-start) — clone the repo for the full live-memory pipeline.",
    tech: ['React', 'Vite', 'Tailwind CSS', 'Flask', 'Claude Sonnet 4.6', 'Anthropic Memory Tool', 'SSE Streaming', 'SQLite', 'Prompt Caching'],
    github: 'https://github.com/Rahul4u-stack/personal-chatbot',
    live: 'https://personal-chatbot-rust.vercel.app/',
    icon: '🧠',
    highlight: "Anthropic's Memory Tool — model-managed persistence with adversarial sandbox",
  },
  {
    title: 'Personal AI News Assistant',
    subtitle: 'Khabar — a Hermes agent that DMs me daily AI news',
    description:
      "A personal agent that lands a 5-story AI news brief in my Telegram every morning at 9 AM IST — covering research, products, industry, new models, and policy. Built on NousResearch's Hermes 3 agent framework with minimax/minimax-m2.5 via OpenRouter. RSS feeds were too unreliable, so the agent does LLM-driven web search instead. A Hermes scheduler fires the run; the script posts to Telegram via the Bot API. Delivery-only by design — no inbox noise, no web app to babysit.",
    tech: ['Hermes 3', 'OpenRouter', 'MiniMax M2.5', 'Telegram Bot API', 'Python', 'Cron / Scheduler'],
    github: 'https://github.com/Rahul4u-stack/khabar',
    icon: '📰',
    highlight: 'Agent + scheduler + LLM-driven retrieval — running daily since 2026-05-12',
  },
  {
    title: 'YouTube Summarizer',
    subtitle: 'Long-context AI with prompt caching',
    description:
      "Paste a YouTube URL, get a structured summary back — executive summary, key insights, action items, topics. The pipeline (yt-dlp → Whisper.cpp → Claude Sonnet 4.6 with prompt caching) handles full-length videos in one API call instead of chunking, dropping cost by ~90% on repeat lookups. Live site runs in demo mode; the real pipeline runs locally — see the README.",
    tech: ['React', 'Vite', 'Tailwind CSS', 'Flask', 'Claude Sonnet 4.6', 'Whisper.cpp', 'yt-dlp', 'Pydantic'],
    github: 'https://github.com/Rahul4u-stack/youtube-summarizer',
    live: 'https://youtube-summarizer-plum.vercel.app',
    icon: '📺',
    highlight: 'Anthropic prompt caching cut repeat-call cost by ~90% on 15-minute videos',
  },
  {
    title: 'Calorie Estimator',
    subtitle: 'AI-Powered Food Photo Analysis',
    description:
      "Upload a food photo and get instant calorie estimates powered by Claude's Vision API. Built with React frontend and Flask backend, deployed on Vercel + Render.",
    tech: ['React', 'Flask', 'Claude Vision API', 'Python', 'Tailwind CSS'],
    github: 'https://github.com/Rahul4u-stack/calorie-estimator',
    live: 'https://calorie-estimator.vercel.app',
    icon: '🍽️',
    highlight: "Uses Claude Sonnet's vision capabilities to analyze food images",
  },
  {
    title: 'AI Video Resume',
    subtitle: 'Coded with Hyperframes + Claude Code',
    description:
      "A 94-second video resume coded with Hyperframes (HeyGen's open-source HTML video framework), narrated by Kokoro TTS, captioned via Whisper, and orchestrated end-to-end with Claude Code. The medium is the message — a PM applying for AI-forward roles, demonstrated by building the resume itself with AI tooling, in code.",
    tech: ['Hyperframes', 'GSAP', 'Kokoro TTS', 'Whisper', 'Claude Code', 'FFmpeg'],
    github: 'https://github.com/Rahul4u-stack/video-resume',
    live: 'https://github.com/Rahul4u-stack/video-resume/raw/main/renders/video-resume_2026-05-16_14-00-02.mp4',
    icon: '🎥',
    highlight: '94s of coded animation. 7 scenes. Synced TTS narration. Shipped in a week.',
  },
  {
    title: 'AI Portfolio Website',
    subtitle: 'This Website — Built with AI',
    description:
      'This very portfolio was built entirely using Claude Code with a multi-agent system. Four specialized AI agents (supervisor, frontend, backend, testing) worked in parallel to create the complete website.',
    tech: ['React', 'Tailwind CSS', 'Framer Motion', 'Claude Code', 'Vite'],
    github: 'https://github.com/Rahul4u-stack/ai-portfolio',
    live: 'https://ai-portfolio-seven-drab.vercel.app',
    icon: '🌐',
    highlight: 'End-to-end built by AI agents orchestrated through Claude Code',
  },
];
