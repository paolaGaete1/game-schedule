import { Text, View } from "react-native";

export interface DateTimeFieldProps {
  label: string;
  mode: "date" | "time";
  value: Date;
  onChange: (date: Date) => void;
  className?: string;
}

function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toTimeInputValue(date: Date): string {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

/**
 * Versión web: los inputs nativos del navegador (`<input type="date">` /
 * `<input type="time">`) ya traen su propio selector, así que no necesitamos
 * abrir/cerrar nada manualmente como en nativo.
 */
export function DateTimeField({
  label,
  mode,
  value,
  onChange,
  className,
}: DateTimeFieldProps) {
  function handleChange(event: { target: { value: string } }) {
    const raw = event.target.value;
    if (!raw) return;

    const next = new Date(value);
    if (mode === "date") {
      const [year, month, day] = raw.split("-").map(Number);
      next.setFullYear(year, month - 1, day);
    } else {
      const [hours, minutes] = raw.split(":").map(Number);
      next.setHours(hours, minutes, 0, 0);
    }
    onChange(next);
  }

  return (
    <View className={className}>
      <Text className="mb-1 text-xs text-gray-500">{label}</Text>
      {/* Elemento HTML nativo del navegador, solo se ejecuta en web */}
      <input
        type={mode === "date" ? "date" : "time"}
        value={mode === "date" ? toDateInputValue(value) : toTimeInputValue(value)}
        onChange={handleChange}
        style={{
          width: "100%",
          borderRadius: 12,
          border: "1px solid #d1d5db",
          padding: "12px 16px",
          fontSize: 16,
          backgroundColor: "white",
          fontFamily: "inherit",
        }}
      />
    </View>
  );
}
