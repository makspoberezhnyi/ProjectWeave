import React from 'react';
import { Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

function pad(n: number) {
  return String(n).padStart(2, '0');
}
function toLocalInputValue(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// Web has no equivalent to the native date/time picker, so this drops to a
// plain browser <input type="datetime-local"> there and the community
// picker on iOS/Android. Colors are passed in as resolved hex since a raw
// DOM input can't read Tamagui theme tokens.
export function DateTimeField({
  value,
  onChange,
  surfaceColor,
  borderColor,
  textColor,
}: {
  value: Date;
  onChange: (d: Date) => void;
  surfaceColor: string;
  borderColor: string;
  textColor: string;
}) {
  if (Platform.OS === 'web') {
    return React.createElement('input', {
      type: 'datetime-local',
      value: toLocalInputValue(value),
      onChange: (e: any) => {
        if (e.target.value) onChange(new Date(e.target.value));
      },
      style: {
        fontFamily: 'inherit',
        fontSize: 14,
        padding: '10px 14px',
        borderRadius: 999,
        border: `1px solid ${borderColor}`,
        background: surfaceColor,
        color: textColor,
      },
    });
  }

  return (
    <DateTimePicker
      value={value}
      mode="datetime"
      display="default"
      onChange={(_event, date) => {
        if (date) onChange(date);
      }}
    />
  );
}
