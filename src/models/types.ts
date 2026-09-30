export type UUID = string;

/**
 * Un horario de juego individual: "voy a jugar X a tal hora",
 * opcionalmente con amigos.
 */
export interface GameSchedule {
  id: UUID;
  game: string;
  /** Fecha y hora en formato ISO 8601 (ej. 2025-10-04T18:30:00.000Z) */
  dateTime: string;
  notes?: string;
  friends: string[];
  /** Si viene de un torneo, referencia al torneo y ronda */
  tournamentId?: UUID;
  roundId?: UUID;
  /** Id de la notificación local programada para recordar este horario, si hay una activa. */
  notificationId?: string;
  createdAt: string;
  updatedAt: string;
}

export type GameScheduleInput = Omit<
  GameSchedule,
  "id" | "createdAt" | "updatedAt" | "notificationId"
>;

export interface TournamentRound {
  id: UUID;
  name: string;
  dateTime: string;
  notes?: string;
}

export interface Tournament {
  id: UUID;
  name: string;
  game: string;
  startDate: string;
  location?: string;
  notes?: string;
  rounds: TournamentRound[];
  createdAt: string;
  updatedAt: string;
}

export type TournamentInput = Omit<
  Tournament,
  "id" | "rounds" | "createdAt" | "updatedAt"
> & {
  rounds?: TournamentRound[];
};
