import { Card } from "./deck.js";

export function dealCards(
  deck: Card[],
  playerIds: string[]
): Map<string, Card[]> {
  const hands = new Map<string, Card[]>();

  for (const playerId of playerIds) {
    hands.set(playerId, []);
  }

  let currentPlayer = 0;

  for (const card of deck) {
    hands.get(playerIds[currentPlayer])!.push(card);

    currentPlayer =
      (currentPlayer + 1) % playerIds.length;
  }

  return hands;
}