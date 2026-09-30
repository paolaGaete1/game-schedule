import { readList, writeList, storageKeys } from "./asyncStorageClient";
import { generateId } from "@/utils/id";
import type {
  Tournament,
  TournamentInput,
  TournamentRound,
} from "@/models/types";

export async function getTournaments(): Promise<Tournament[]> {
  const items = await readList<Tournament>(storageKeys.tournaments);
  return items.sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
}

export async function getTournamentById(
  id: string
): Promise<Tournament | undefined> {
  const items = await getTournaments();
  return items.find((item) => item.id === id);
}

export async function addTournament(
  input: TournamentInput
): Promise<Tournament> {
  const items = await readList<Tournament>(storageKeys.tournaments);
  const now = new Date().toISOString();
  const newItem: Tournament = {
    ...input,
    id: generateId(),
    rounds: input.rounds ?? [],
    createdAt: now,
    updatedAt: now,
  };
  await writeList(storageKeys.tournaments, [...items, newItem]);
  return newItem;
}

export async function updateTournament(
  id: string,
  input: Partial<TournamentInput>
): Promise<Tournament | undefined> {
  const items = await readList<Tournament>(storageKeys.tournaments);
  let updated: Tournament | undefined;
  const next = items.map((item) => {
    if (item.id !== id) return item;
    updated = { ...item, ...input, updatedAt: new Date().toISOString() };
    return updated;
  });
  await writeList(storageKeys.tournaments, next);
  return updated;
}

export async function deleteTournament(id: string): Promise<void> {
  const items = await readList<Tournament>(storageKeys.tournaments);
  await writeList(
    storageKeys.tournaments,
    items.filter((item) => item.id !== id)
  );
}

export async function addRoundToTournament(
  tournamentId: string,
  round: Omit<TournamentRound, "id">
): Promise<Tournament | undefined> {
  const items = await readList<Tournament>(storageKeys.tournaments);
  let updated: Tournament | undefined;
  const next = items.map((item) => {
    if (item.id !== tournamentId) return item;
    updated = {
      ...item,
      rounds: [...item.rounds, { ...round, id: generateId() }],
      updatedAt: new Date().toISOString(),
    };
    return updated;
  });
  await writeList(storageKeys.tournaments, next);
  return updated;
}
