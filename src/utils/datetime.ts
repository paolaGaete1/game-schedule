/**
 * Combina la parte de fecha de `base` con la parte de hora de `time`.
 * Útil cuando el usuario edita solo la hora y queremos conservar la fecha ya elegida.
 */
export function mergeDate(base: Date, datePart: Date): Date {
  const result = new Date(base);
  result.setFullYear(
    datePart.getFullYear(),
    datePart.getMonth(),
    datePart.getDate()
  );
  return result;
}

/**
 * Combina la parte de hora de `timePart` con la fecha de `base`.
 * Útil cuando el usuario edita solo la fecha y queremos conservar la hora ya elegida.
 */
export function mergeTime(base: Date, timePart: Date): Date {
  const result = new Date(base);
  result.setHours(
    timePart.getHours(),
    timePart.getMinutes(),
    timePart.getSeconds(),
    timePart.getMilliseconds()
  );
  return result;
}
