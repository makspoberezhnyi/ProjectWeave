import React from 'react';
import { XStack, YStack, Text } from 'tamagui';
import { Status } from '../data/types';

const STATUS_META: Record<Status, { label: string; color: string }> = {
  want: { label: 'Want', color: '$colorSecondary' },
  in_progress: { label: 'In progress', color: '$info' },
  done: { label: 'Done', color: '$success' },
};

export function StatusPill({ status }: { status: Status }) {
  const meta = STATUS_META[status];
  return (
    <XStack ai="center" gap="$2" bg="$backgroundSunken" br="$5" px="$3" py="$2">
      <YStack width={7} height={7} br="$5" bg={meta.color as any} />
      <Text fontSize={13} fontWeight="600" color={meta.color as any}>
        {meta.label}
      </Text>
    </XStack>
  );
}
