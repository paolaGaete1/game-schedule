import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

/** Minutos de antelación con los que avisamos por defecto antes de un horario. */
export const DEFAULT_REMINDER_MINUTES_BEFORE = 30;

/**
 * Define cómo se comporta una notificación cuando llega con la app abierta
 * en primer plano. Debe llamarse una sola vez, idealmente al arrancar la app.
 *
 * Nota: en algunos entornos (por ejemplo ciertas versiones de Expo Go) el
 * módulo nativo de notificaciones puede no estar disponible. Cualquier fallo
 * aquí se ignora silenciosamente (con un warning) para no romper el arranque
 * de la app; las notificaciones simplemente no funcionarán en ese caso.
 */
export function configureNotificationHandler(): void {
  if (Platform.OS === "web") return;

  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  } catch (error) {
    console.warn(
      "[notifications] No se pudo configurar el manejador de notificaciones (¿módulo nativo no disponible?):",
      error
    );
  }
}

/**
 * Pide permiso de notificaciones si aún no se ha concedido.
 * En web no hace nada (expo-notifications no soporta esa plataforma).
 * Si el módulo nativo no está disponible, devuelve `false` en vez de fallar.
 */
export async function ensureNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === "web") return false;

  try {
    const existing = await Notifications.getPermissionsAsync();
    if (existing.granted) return true;

    const requested = await Notifications.requestPermissionsAsync();
    return requested.granted;
  } catch (error) {
    console.warn("[notifications] No se pudo solicitar permisos:", error);
    return false;
  }
}

export interface ReminderInput {
  title: string;
  body: string;
  /** Fecha/hora ISO del evento que se quiere recordar. */
  dateTime: string;
  /** Minutos de antelación. Por defecto 30. */
  minutesBefore?: number;
}

/**
 * Programa una notificación local para recordar un evento próximo.
 * Devuelve el identificador de la notificación (para poder cancelarla luego),
 * o `null` si no se programó nada (web, sin permiso, módulo no disponible,
 * o el recordatorio ya habría quedado en el pasado).
 */
export async function scheduleReminder(
  input: ReminderInput
): Promise<string | null> {
  if (Platform.OS === "web") return null;

  try {
    const granted = await ensureNotificationPermissions();
    if (!granted) return null;

    const eventDate = new Date(input.dateTime);
    const minutesBefore =
      input.minutesBefore ?? DEFAULT_REMINDER_MINUTES_BEFORE;
    const triggerDate = new Date(eventDate.getTime() - minutesBefore * 60_000);

    // Si el recordatorio ya habría sonado en el pasado, no lo programamos.
    if (triggerDate.getTime() <= Date.now()) return null;

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: input.title,
        body: input.body,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: triggerDate,
      },
    });
    return id;
  } catch (error) {
    console.warn("[notifications] No se pudo programar el recordatorio:", error);
    return null;
  }
}

/** Cancela un recordatorio previamente programado, si existe. */
export async function cancelReminder(
  notificationId?: string | null
): Promise<void> {
  if (Platform.OS === "web" || !notificationId) return;

  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch {
    // Si ya no existe (por ejemplo, ya sonó) o el módulo no está disponible,
    // no hay nada que hacer.
  }
}
