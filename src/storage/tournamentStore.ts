import {
  addTournament,
  deleteTournament,
  getTournaments,
  updateTournament,
  addRoundToTournament,
} from "./tournamentStorage";
import type {
  Tournament,
  TournamentInput,
  TournamentRound,
} from "@/models/types";

type Listener = () => void;

let tournaments: Tournament[] = [];
let loaded = false;
let loadingPromise: Promise<void> | null = null;
const listeners = new Set<Listener>();

function emit(): void {
  listeners.forEach((listener) => listener());
}

export function subscribeTournaments(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getTournamentsSnapshot(): Tournament[] {
  return tournaments;
}

export function areTournamentsLoaded(): boolean {
  return loaded;
}

export async function loadTournaments(): Promise<void> {
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    const items = await getTournaments();
    tournaments = items;
    loaded = true;
    emit();
  })();

  try {
    await loadingPromise;
  } finally {
    loadingPromise = null;
  }
}

export async function createTournament(
  input: TournamentInput
): Promise<Tournament> {
  const created = await addTournament(input);
  await loadTournaments();
  return created;
}

export async function editTournament(
  id: string,
  input: Partial<TournamentInput>
): Promise<Tournament | undefined> {
  const updated = await updateTournament(id, input);
  await loadTournaments();
  return updated;
}

export async function removeTournament(id: string): Promise<void> {
  await deleteTournament(id);
  await loadTournaments();
}

export async function addTournamentRound(
  tournamentId: string,
  round: Omit<TournamentRound, "id">
): Promise<Tournament | undefined> {
  const updated = await addRoundToTournament(tournamentId, round);
  await loadTournaments();
  return updated;
}
