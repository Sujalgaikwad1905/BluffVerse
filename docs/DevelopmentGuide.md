# BluffVerse Development Guide

> This document defines the engineering standards, architecture principles and development workflow for BluffVerse.

---

# Philosophy

BluffVerse is NOT a startup project.

It is a backend-first engineering project designed to demonstrate:

- Backend Architecture
- Real-Time Systems
- Distributed Systems Thinking
- WebSockets
- Event-Driven Design
- Synchronization
- Race Condition Handling
- AI Integration
- Deployment
- Production-like Code Organization

The primary objective is to showcase engineering quality instead of feature quantity.

---

# Core Principles

1. Backend First

Backend architecture always takes priority over frontend polish.

---

2. Server Authoritative

Clients only send intentions.

The server validates every action.

Clients never decide game state.

---

3. Engineering Over Features

Every feature must demonstrate an engineering concept.

Avoid unnecessary complexity.

---

4. Modular Monolith

The MVP will use a modular monolith architecture.

Microservices are intentionally postponed.

---

5. Finish > Perfect

A working, well-architected MVP is preferred over an incomplete "perfect" system.

---

# Technology Stack

Frontend

- React
- Vite
- Tailwind CSS
- Socket.IO Client

Backend

- Node.js
- Express.js
- TypeScript
- Socket.IO

Database

- PostgreSQL
- Prisma ORM

Cache

- Redis

AI

- Groq
- Gemini (Fallback)

Deployment

- Docker
- Render

---

# Folder Responsibilities

client/

Frontend application only.

Never contains game logic.

---

server/src/auth

Authentication.

JWT.

User management.

---

server/src/socket

Socket.IO gateway.

Socket event registration.

Connection handling.

---

server/src/game

Game Engine.

State Machine.

Rule Engine.

Turn Logic.

---

server/src/room

Room lifecycle.

Lobby.

Match creation.

Player management.

---

server/src/database

Prisma.

Repositories.

Database initialization.

---

server/src/redis

Redis client.

Caching.

Pub/Sub.

---

server/src/config

Environment configuration.

Application configuration.

No business logic.

---

server/src/shared

Reusable utilities.

Logger.

Errors.

Helpers.

Shared Types.

---

server/src/routes

Infrastructure routes.

Example:

/health

Only infrastructure routes belong here.

---

# File Responsibilities

Every file should own ONE responsibility.

Example

server.ts

Only starts the server.

Nothing else.

---

app.ts

Only configures Express.

Nothing else.

---

env.ts

Only validates and exports environment configuration.

---

logger.ts

Only provides logging.

---

# TypeScript Guidelines

Always use strict mode.

Avoid "any".

Prefer interfaces for object contracts.

Prefer enums or constant objects for event names.

Never disable TypeScript errors unless absolutely necessary.

---

# Express Guidelines

Business logic never belongs inside route handlers.

Routes call Services.

Services call Game Engine or Repositories.

Keep middleware lightweight.

---

# Socket.IO Guidelines

Socket handlers should only:

- Validate input
- Convert input into Events
- Push Events into the Room Queue

Socket handlers must NEVER modify game state directly.

---

# Game Engine Rules

The Game Engine owns:

- Turns
- Bluff Resolution
- Timers
- State Machine
- Win Detection
- Validation

No other module modifies game state.

---

# Redis Rules

Redis should be treated as infrastructure.

Business logic must not depend directly on Redis APIs.

Use a Redis service layer.

---

# Database Rules

Never access Prisma directly from controllers.

Always use repositories or service abstractions.

---

# Logging Rules

Never use console.log directly.

Always use the shared logger.

Logs should be meaningful.

Avoid noisy logs.

---

# Error Handling

Fail early.

Fail clearly.

Return meaningful HTTP status codes.

Never expose stack traces to clients.

---

# Naming Conventions

Classes

PascalCase

Example

RoomManager

---

Interfaces

Prefix with I only when necessary.

Prefer descriptive names.

Player

GameState

RoomConfig

---

Functions

camelCase

Example

createRoom()

joinRoom()

processEvent()

---

Constants

UPPER_SNAKE_CASE

Example

DEFAULT_BLUFF_WINDOW_MS

---

Files

kebab-case

Example

room-manager.ts

game-engine.ts

event-queue.ts

---

# Git Workflow

Small commits.

One logical change per commit.

Commit message examples:

feat:

fix:

refactor:

docs:

test:

chore:

---

# Pull Request Workflow

Requirement

↓

Design

↓

Architecture

↓

Implementation

↓

Cursor Self Review

↓

ChatGPT Review

↓

Commit

↓

Push

---

# AI Development Workflow

ChatGPT

Responsibilities

- Architecture
- Reviews
- System Design
- Documentation
- Engineering Decisions

Cursor

Responsibilities

- Boilerplate
- Refactoring
- Feature Implementation
- Frontend Generation

AI never decides architecture.

---

# Performance Philosophy

Do not optimize prematurely.

Build a correct solution first.

Optimize after profiling.

---

# Security Principles

Validate all client input.

Never trust the frontend.

Authenticate before authorizing.

Keep secrets inside environment variables.

---

# Code Review Checklist

Before every commit ask:

- Does this file own only one responsibility?
- Does this match the architecture?
- Can this be tested independently?
- Is there duplicated logic?
- Can another engineer understand this quickly?
- Would I be comfortable explaining this in an interview?

If any answer is "No",

refactor before merging.

---

# Final Rule

Every implementation should make BluffVerse easier to understand, easier to maintain and easier to discuss during backend engineering interviews.

Engineering quality always wins over feature quantity.