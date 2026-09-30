import { useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { mergeDate, mergeTime } from "@/utils/datetime";

export interface DateTimeFieldProps {
  label: string;
  mode: "date" | "time";
  value: Date;
  onChange: (date: Date) => void;
  className?: string;
}

export function DateTimeField({
  label,
  mode,
  value,
  onChange,
  className,
}: DateTimeFieldProps) {
  const [show, setShow] = useState(false);

  const formatted =
    mode === "date"
      ? value.toLocaleDateString()
      : value.toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
        });

  return (
    <View className={className}>
      <Pressable
        onPress={() => setShow(true)}
        className="rounded-xl border border-gray-300 bg-white px-4 py-3"
      >
        <Text className="text-xs text-gray-500">{label}</Text>
        <Text className="text-base text-gray-900">{formatted}</Text>
      </Pressable>
      {show ? (
        <DateTimePicker
          value={value}
          mode={mode}
          is24Hour
          onValueChange={(_event, selected) => {
            setShow(Platform.OS === "ios");
            if (!selected) return;
            onChange(
              mode === "date" ? mergeDate(value, selected) : mergeTime(value, selected)
            );
          }}
          onDismiss={() => setShow(false)}
        />
      ) : null}
    </View>
  );
}
