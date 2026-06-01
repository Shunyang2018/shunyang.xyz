---
title: "A Chemist's Notes on Agentic Coding"
summary: Six weeks of adopting agentic coding as an analytical chemist — from skeptic to 12× weekly output, with numbers, unlocks, and lessons for scientists starting today.
tags:
  - LLM
  - Agentic Coding
date: 2026-05-25
external_link: ''
url_pdf: ''
url_code: ''
links:
  - icon: github
    icon_pack: fab
    url: ''
---

> *Six weeks, eleven lessons, in numbers.*
> *I'm a slow adopter. This is what catching up looks like.*

*~1,500 words · 7 min read*

---

## Where I started

I'm an analytical chemist at a pharma. Mass-spec, retention time, cheminformatics. I write code, but I'm slow to pick up new tools. Always have been.

The honest timeline:

- **GPT era (late 2022 to mid 2023).** I thought it was an ads event. Overpresented, underdelivering. 
- **Mid 2023.** Tried coding. Copy-paste from chat to IDE, paste back, ran it. Treated it like a slightly faster Stack Overflow.
- **Through 2025.** Started reviewing what it wrote, line by line. Caught some things, missed others. Trust grew slowly.
- **Mid 2024 / early 2025.** Started using LLMs for information search instead of Google. The switch was about a year behind when I should have made it.
- **Spring 2026 (now).** Letting an agent take over most of the code-writing for a dozen active projects. Reviewing diffs, not lines. Weekly load grew about 12× in five weeks.

The same lag shows up in adjacent topics. RLHF — colleagues started about a year ago. I'm only now deciding to actually work on it. I'll be late to that one too, and I'll try to close the gap faster than I did with agentic coding.

This essay is what a slow adopter looks like when the thing finally clicks.

---

## What the numbers say

Weekly volume, normalized to week 1 (laptop + cluster combined):

| Week | Fold change vs W1 | Unlock |
|---|---|---|
| W1 | 1.0× | Baseline |
| W2 | 5.0× | Phases ship |
| W3 | 3.6× | 1st skills |
| W4 | 3.5× | Memory |
| W5 | **12.0×** | Build-out |

Each bar's label names the thing that week unlocked: a project hitting its first big phase delivery, a memory layer, a scaffolding port. The eye goes to the spike on the right — week 5 was about **12× week 1**. But the more interesting number is hidden in weeks 3 and 4: load stayed level *while requests dropped* (3,167 → 1,719). I wasn't running more turns. I was running heavier ones.

**Tokens per request** kept rising throughout:

| Week | Tokens per request (K) |
|---|---|
| W1 | 86 |
| W2 | 153 |
| W3 | 121 |
| W4 | 211 |
| W5 | 216 |

86K → 216K is a 2.5× fold change in payload per call. Output tokens per call grew 1.5× over the same window (512 → 778). Same chemist, denser sessions.

---

## Six weeks, six unlocks

| Week | Tokens | Requests | What unlocked |
|---|---|---|---|
| W1 (Apr 20–26) | 186M | 2,164 | First cluster sessions; baseline ML projects on the bench |
| W2 (Apr 27 – May 3) | 544M | 3,551 | One generative project shipped Phases 1–3; first sustained heavier sessions |
| W3 (May 4–10) | 382M | 3,167 | First two skills (one for experiment runs, one for cluster submission); a new spectral-mining project started |
| W4 (May 11–17) | 362M | 1,719 | Memory layer matured (eight feedback memories accumulated); ~8 projects in flight |
| W5 (May 18–24) | **1,762M** | **8,168** | 4 new projects in 4 days; a tool-augmented agent shipped Phase 1 → 6b in 3 days; agentic scaffolding ported in from a reference codebase; first skill promotions |

Each row added something the next row built on. None of it was strategic. Each piece came from a specific friction in the prior week that I got tired of.

---

## What changed

In the order I learned them. Not all of them stuck the first time.

**1. Stop asking for permission on cluster jobs.** I was confirming every submission. Memory rule that says *don't ask, just submit and report* dropped loop time from minutes to seconds. The "are you sure?" prompts were ~30 seconds × dozens of times per session of pure friction.

**2. Build infrastructure before features.** Weeks 1–2 were 80% project work. By week 5 it was the inverse — and that's when output went up. Hooks, memories, skills, scaffolding compound. New projects start at week-5 productivity.

**3. Solve permissions once.** Every "do you want to run this?" is friction. The project's permissions config ended up with **91 shell allowlist entries** and **17 file-access entries**. Plus a deny list covering 8 sibling user directories so I can't edit colleagues' code by accident. Most operations now run without a prompt.

**4. Solve the boring plumbing.** Set up the cluster submission path so a sandboxed compute environment could submit jobs without a shared filesystem. Remote VS Code pointed at GPU nodes. Job logs streamed back to my laptop without manual `rsync`. Each one removes ~5 minutes of friction × dozens of times per day.

**5. Ask the agent to ask me questions.** *"Ask me three clarifying questions before you start."* Highest-impact line I added to my prompts. Half the time the questions made me realize I didn't know what I wanted.

**6. Plan before execute.** Plan mode. Reviewable artifact before any code is written. Saves the revert-and-retry cycle.

**7. Write memories with reasoning, not just rules.** Every memory file has a `Why:` line and a `How to apply:` line. The agent learns the rule's *boundary*, not just the rule. Memories that say "do X" without saying why decay; memories that say "do X *because* Y last quarter" survive.

**8. Promote memories to skills when they keep firing.** A "resume the partial job, don't re-run from scratch" memory became a `/resume-job` invocable skill after the same procedure ran three times. Memory layer compounds *through promotion* — not just by accumulation.

**9. Let projects talk.** A confidence-calibration project consumes entropy tools written in a metabolite-ID project. A diagnostic-ion mining project will feed peak priors back into the metabolite-ID agent. The portfolio isn't 12 independent projects — it's a graph. Each project's outputs become another's priors.

**10. Multiagent for parallel branches.** Background subagents for independent tasks (search this repo / draft this analysis / find this dataset). Subagent context shields the main session from large outputs. Three branches in flight without context contamination.


### Things I didn't aim for but happened anyway

- **Negative results published in the repo.** A full fine-tune on a published embedding model lost to a simpler baseline. Logged as `Exp X.YZ NEGATIVE`, linked from the project's manuscript. Failed runs that get *committed* become next quarter's prior, not buried compute.
- **Pre-commit quality gates.** A hook that blocks `git commit` when staged changes touch numerical logic, until I articulate the math in the commit body. Came after I caught the agent producing markdown with *estimated* numbers that the actual data later contradicted by 50–100% per day. Wrong numbers don't fail tests; they just ship. Now they fail commits instead.
- **Tracking my own learning.** This essay exists. Tracking it makes the meta-improvements visible — like load-per-call rising while request count fell. Only see it if you look.

---

## Infrastructure inventory (May 25, 2026)

| Layer | Count | Examples (generic) |
|---|---|---|
| Memory files | 25 | autonomous-mode rules, cluster-resource defaults, scoring-API references, "stop means stop" |
| Skills | 6 | a metabolite-elucidation reasoning skill, a cluster-submit skill, an experiment-run skill, a figure-review skill, a resume-job skill, a PR-description skill |
| Hooks | 3 | PreToolUse numerical-review (blocks commits with un-articulated numerical changes); PostToolUse cluster-job-ID capture; Stop ruff lint |
| Permissions | 91 shell + 17 file-access + 11 deny | cluster scheduler patterns; deny list for 8 sibling user directories |
| Patterns documented | 36 | from "Agent vs Pipeline" (#1) to "Memory→skill promotion" (#36) |

**Active project count over the 6 weeks:**

| Date | Active projects |
|---|---|
| Apr 20 | 2 |
| Apr 27 | 3 |
| May 4 | 5 |
| May 11 | 8 |
| May 18 | 12 |
| May 24 | 12 |

The portfolio plateaued at 12 once the infrastructure stopped being the bottleneck. Growth now is depth-per-project — one of the agents going Phase 1 → 6b in three days is what depth growth looks like when the spine is in place.

---

## Things from a chemistry training

**Reaction rate isn't throughput.** More turns per hour doesn't help if half are clarifying questions. Spec quality is the rate-limiting step. So I ask the agent to ask me questions instead of letting it guess.

**Catalysts beat reagents.** A small piece of well-placed infrastructure accelerates everything downstream. The `/resume-job` skill took 30 minutes to write; saved hours since. A hook that blocks numerical commits costs nothing and prevents an entire failure mode.

---

## For a chemist starting today

The minimum, ordered:

1. One project. One CLAUDE.md. One AGENTS.md. Don't scaffold for 12 on day one.
2. Wait until you've corrected the agent on the same thing three times before writing the first memory. Earlier than that and the rules don't generalize.
3. Solve permissions early. Twenty allowlist entries on week one removes hundreds of prompts on week three.
4. Tell the agent to ask you clarifying questions when you're vague.
5. Plan before execute.
6. Track your weekly load. Mine grew 12× in five weeks; without a routine pull on usage telemetry I wouldn't have noticed.

---

## What I'm doing next

Now I have enough token usage. The next gap to close is RL. I first time heard RLHF about eight months ago. I'm picking it up now — late, again. The hope is that the muscle for closing this kind of gap is itself getting faster: Agentic coding took me ~12 months from "interesting" to "I rely on it daily," RL might take 3–4. We'll see.

The thing that gets faster isn't the adoption itself. It's the time between *seeing other people do it* and *deciding to actually try it*.
