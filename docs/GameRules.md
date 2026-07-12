# BluffVerse - Game Rules Specification

> This document is the single source of truth for the BluffVerse Game Engine.
>
> These rules intentionally differ from the traditional Bluff/Cheat card game.
> The backend implementation MUST follow this specification.

---

# Objective

The objective of the game is to discard all cards.

The first player with zero cards immediately wins.

---

# Players

Minimum Players

2

Maximum Players

Configurable (Default: 4)

Players are arranged in a circular order.

Example

A → B → C → D → A

---

# Information Visibility

Each player knows:

- Their own cards
- Number of cards held by every player
- Current claimed rank
- Current turn
- Public game events

Players DO NOT know:

- Cards held by opponents
- Face-down pile contents

The server knows all information.

---

# Server Authority

The server is authoritative.

Clients only send intentions.

Examples

PLAY_CARDS

CALL_BLUFF

PASS

JOIN_ROOM

LEAVE_ROOM

The server validates every action.

---

# Card Distribution

At game start

- Shuffle deck
- Distribute cards equally
- Ignore remaining cards if necessary

Each player receives only their own hand.

---

# Starting Player

The starting player is chosen randomly.

The starting player may choose ANY rank.

Examples

1 Ace

2 Kings

3 Sevens

There is NO predefined rank sequence.

---

# Turn Structure

Each turn consists of

Player Action

↓

Bluff Window

↓

Next Turn

---

# Player Actions

During their turn a player may

1.

Play honestly.

Claim matches actual cards.

---

2.

Bluff.

Claim differs from actual cards.

Cards remain face down.

Only the server knows them.

---

3.

Pass.

A player may pass instead of playing.

Passing does not reveal cards.

---

# Bluff Window

Immediately after every PLAY action

A bluff window opens.

Duration

3 seconds

During this period

Every other player

may press

CALL BLUFF.

Only the FIRST valid bluff event is processed.

All later bluff events are discarded.

---

# Bluff Resolution

If Bluff is called

Only the LAST move is inspected.

The entire pile is NOT validated.

---

## Bluff Successful

Previous player lied.

Result

Previous player picks up the ENTIRE pile.

Caller wins the bluff challenge.

Caller chooses the next rank.

A new round begins.

---

## Bluff Failed

Previous player told the truth.

Result

Caller picks up the ENTIRE pile.

Previous player wins the bluff challenge.

Previous player chooses the next rank.

A new round begins.

---

# No Bluff Called

If nobody calls Bluff

before the bluff timer expires

The next player continues using

the SAME claimed rank.

Example

A claims

3 Kings

↓

No Bluff

↓

B now plays Kings

↓

No Bluff

↓

C now plays Kings

Game continues.

---

# Pass Rule

Players may press PASS immediately.

The server records the pass.

The turn advances.

A completed pass cycle occurs when

every active player

passes exactly once

without any new cards entering the pile.

When the pass cycle completes

The current pile remains face down.

No cards are revealed.

The player whose turn starts the new cycle

chooses ANY rank.

This begins a new round.

---

# Choosing the Next Rank

A player may freely choose the next rank only when

- Starting the game
- Winning a Bluff challenge
- A complete pass cycle occurs

Otherwise

Players must continue using the current claimed rank.

---

# Event Queue

Every Room owns one FIFO Event Queue.

Example events

JOIN_ROOM

PLAY_CARDS

CALL_BLUFF

PASS

DISCONNECT

RECONNECT

CHAT

Only ONE event is processed at a time.

This prevents race conditions.

---

# Simultaneous Events

If multiple events arrive together

The first processed event wins.

All later conflicting events are ignored

if the game state has already changed.

---

# Timers

Bluff Window

3 seconds

Reconnect Timeout

Configurable

Turn Timer

Future Enhancement

---

# AI Player

The AI behaves exactly like a human player.

The Game Engine must never know

whether a participant is

Human

or

AI.

AI only receives

public information.

Hidden cards are never exposed.

---

# Disconnection

If a player disconnects

The game pauses

for a configurable timeout.

If they reconnect

Game resumes.

If timeout expires

AI may replace the disconnected player.

---

# Winning

The game ends immediately

when a player's hand contains

zero cards.

The server

Declares Winner

Stores Match History

Updates Leaderboard

---

# Engineering Constraints

The Game Engine must guarantee

- Server Authoritative Design
- Event Ordering
- Race Condition Prevention
- Deterministic State Transitions
- Timer Consistency
- Replayability

No client may directly modify game state.