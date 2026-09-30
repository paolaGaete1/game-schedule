import { useCallback, useEffect, useSyncExternalStore } from "react";
import {
  subscribeTournaments,
  getTournamentsSnapshot,
  areTournamentsLoaded,
  loadTournaments,
  createTournament,
  editTournament,
  removeTournament,
  addTournamentRound,
} from "@/storage/tournamentStore";
import type { TournamentInput, TournamentRound } from "@/models/types";

export function useTournaments() {
  const tournaments = useSyncExternalStore(
    subscribeTournaments,
    getTournamentsSnapshot,
    getTournamentsSnapshot
  );
  const loaded = useSyncExternalStore(
    subscribeTournaments,
    areTournamentsLoaded,
    areTournamentsLoaded
  );

  useEffect(() => {
    if (!areTournamentsLoaded()) {
      loadTournaments();
    }
  }, []);

  const refresh = useCallback(() => loadTournaments(), []);

  const create = useCallback(
    (input: TournamentInput) => createTournament(input),
    []
  );

  const edit = useCallback(
    (id: string, input: Partial<TournamentInput>) => editTournament(id, input),
    []
  );

  const remove = useCallback((id: string) => removeTournament(id), []);

  const addRound = useCallback(
    (tournamentId: string, round: Omit<TournamentRound, "id">) =>
      addTournamentRound(tournamentId, round),
    []
  );

  return {
    tournaments,
    loading: !loaded,
    refresh,
    create,
    edit,
    remove,
    addRound,
  };
}
