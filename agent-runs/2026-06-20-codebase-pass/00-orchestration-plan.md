# Orchestration Plan

## Mode Selection

- Repo: `/Users/stephenbrown/Code/OPENSOURCE/wordly`
- Branch: `dev`
- Work mode: full codebase-improvement pass
- Run folder: `agent-runs/2026-06-20-codebase-pass`
- Verifiable gates: Git remote read, `git pull --ff-only origin dev`, `git push --dry-run origin dev`, `npm run lint`, `npm run build`, source search, diff review
- Human-decision blockers: product roadmap direction, broad redesign, risky major dependency migrations, unavailable external services that cannot be simulated locally
- Resume policy: resume from `run-state.md`, verify `dev` sync, then continue the first open task in `task-queue.md`

## Loop Plan

| Phase | Loop | Verify Gate | Stop Condition |
| --- | --- | --- | --- |
| Preflight and Repo Docs | Orchestration Planning Loop, Docs Sweep Loop | Docs match current repo and checks pass | Plan, state, queue, docs, and report pushed |
| Baseline Validation | Baseline Validation Loop | Lint/build results recorded and failures classified | Baseline report pushed |
| Findings Backlog | Findings Queue Loop, Architecture Fitness Loop, Lean Code Loop | Evidence-backed backlog and scorecard | Backlog, scorecard, and queue are pushed |
| Execute Fixes and Improvements | Task Queue Loop, Fix Validation Loop | Highest-priority confirmed issue fixed and verified | Fix report pushed or task deferred with evidence |
| Package and Dead-Code Cleanup | Package Cleanup Loop, Dead Code Loop | Safe package/dead-code actions verified | Cleanup report pushed |
| Review | Judge Loop | PASS or bounded follow-up tasks | Review report pushed |
| Stabilization Loop | Stabilization Loop, Judge Loop | Final completion criteria pass or blocker recorded | Stabilization report pushed |
| Integrator | Final Completion Gate | Clean synced `dev`, final report pushed | Workflow complete |

## File Ownership

| Task | Owned Files | Notes |
| --- | --- | --- |
| T-001 | `AGENTS.md`, `SPEC.md`, run reports | Startup planning, guidance, and current-state docs |
| T-002 | `02-baseline-validation.md` | Record lint/build baseline |
| T-003 | `03-findings-backlog.md`, `task-queue.md` | Evidence-backed findings and scorecard |
| T-004 | `src/utils/dictionary-api.ts`, related reports | Fix dictionary fallback if confirmed by validation |
