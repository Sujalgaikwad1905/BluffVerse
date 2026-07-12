# BluffVerse - Architecture Decision Records

> This document records important architectural decisions made during the development of BluffVerse.

Every significant engineering decision should be documented here.

---

# ADR-001

## Title

Server Authoritative Architecture

## Status

Accepted

## Context

Clients cannot be trusted.

Game state must remain consistent across all players.

## Decision

The server owns all game state.

Clients only send intentions.

## Consequences

Advantages

- Prevents cheating
- Simplifies synchronization
- Enables replayability
- Easier debugging

Trade-offs

- Slightly higher server complexity

---

# ADR-002

## Title

Room Event Queue

## Status

Accepted

## Context

Multiple socket events may arrive simultaneously.

Example

PLAY_CARD

CALL_BLUFF

DISCONNECT

## Decision

Each room owns a FIFO Event Queue.

Only one event is processed at a time.

## Consequences

Advantages

- Prevents race conditions
- Deterministic event ordering
- Easier reasoning

Trade-offs

- Slight increase in event latency

---

# ADR-003

## Title

Modular Monolith

## Status

Accepted

## Context

The project must be completed within approximately 10 days.

Microservices would introduce unnecessary complexity.

## Decision

Use a modular monolith architecture.

Modules remain independently organized.

Future extraction into services remains possible.

## Consequences

Advantages

- Faster development
- Easier debugging
- Simpler deployment

Trade-offs

- Single deployable unit

---

# ADR-004

## Title

Backend First Development

## Status

Accepted

## Context

The project is intended to demonstrate backend engineering.

Frontend complexity is not the objective.

## Decision

Backend implementation always takes priority.

Frontend remains intentionally simple.

## Consequences

Advantages

- Better interview discussions
- Faster MVP delivery
- Engineering-focused project

Trade-offs

- Minimal UI polish

---

# ADR-005

## Title

AI as a Player

## Status

Accepted

## Context

AI should solve a real problem.

It should not become the product.

## Decision

AI joins the game exactly like a human player.

The Game Engine must never know whether a participant is Human or AI.

## Consequences

Advantages

- Clean abstraction
- Easy replacement of disconnected players
- Single-player mode

Trade-offs

- AI has limited information

---

# ADR-006

## Title

Timer-Based Bluff Window

## Status

Accepted

## Context

A pass-only system removes the psychological tension of Bluff.

## Decision

Every PLAY action opens a 3-second Bluff Window.

Players may call Bluff during this period.

## Consequences

Advantages

- Better gameplay
- Faster decisions
- Increased tension

Trade-offs

- Timer synchronization required

---

# ADR-007

## Title

Complete Pass Cycle

## Status

Accepted

## Context

A new claimed rank should only begin when the table naturally resets.

## Decision

A new round begins only after every active player passes once without any new cards entering the pile.

## Consequences

Advantages

- Predictable game flow
- Simple rule engine
- Clear state transitions

Trade-offs

- Pass tracking required

---

# ADR-008

## Title

AI-Assisted Development Workflow

## Status

Accepted

## Context

The project has a strict timeline.

Code quality must remain high while maximizing development speed.

## Decision

Responsibilities are divided.

ChatGPT

- Architecture
- Reviews
- Documentation
- Engineering Decisions

Cursor

- Implementation
- Refactoring
- Boilerplate
- Frontend

## Consequences

Advantages

- Faster development
- Consistent architecture
- Human-reviewed code

Trade-offs

- Requires disciplined review process

---

# ADR-009

## Title

Documentation First

## Status

Accepted

## Context

Cursor produces better code when project context exists.

## Decision

Architecture documents are created before implementing major modules.

## Consequences

Advantages

- Better AI-generated code
- Consistent architecture
- Easier onboarding

Trade-offs

- Small upfront documentation effort