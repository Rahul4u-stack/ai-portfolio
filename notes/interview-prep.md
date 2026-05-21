# Interview prep — AI Portfolio Website

> Personal rehearsal notes. Not linked from README.

## Q1: Why the multi-agent pattern for a static portfolio site? Isn't 4 agents overkill for a single-page React app?

**A:** Honest answer — yes, for the portfolio specifically it's overkill. A single Claude Code session would have shipped in similar time. I did it deliberately to **rehearse the workflow on a low-stakes project** before applying it to complex projects later in the portfolio (GraphRAG, multi-agent research writer). The pattern's value compounds with project complexity. The portfolio was the practice run. And the line "built by 4 AI agents working in parallel" is itself a portfolio statement that nothing else conveys as efficiently.

## Q2: How is this different from just hiring a designer or freelance dev to build your portfolio?

**A:** Two real differences:

1. **Cost and speed** — Portfolio took ~8 hours of Claude Code time vs. typically 1–2 weeks and several hundred dollars with a freelancer.
2. **Defensibility** — Every line is mine to explain in interviews. I read all generated code and own the architecture decisions. With outsourced work I'd be defending code I didn't author, which collapses fast when an interviewer asks "why did you choose X over Y?"

## Q3: A recruiter spends only 10 seconds on this site. What do they see, and is that the right thing?

**A:** They see the Hero (name + role + typing animation cycling "Product Manager / AI Builder / Fintech Expert") and the top of the Projects grid above the fold on desktop. The typing animation finishes around 6s; their eye then scrolls to Projects. First card they see is **Calorie Estimator with a live demo link and "Claude Vision API" in the tech chips** — concrete, working, AI-relevant. That's roughly the maximum information density I can deliver in 10 seconds.

The trade-off is the About section is below the fold; for a recruiter who only spends 10s, the personal narrative doesn't land — but their next click is more likely to be the live demo than a bio anyway.
