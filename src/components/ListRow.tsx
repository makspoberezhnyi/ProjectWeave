import React from 'react';
import { Button, XStack, YStack, Text } from 'tamagui';
import { MediaItem } from '../data/types';
import { MediaThumb } from './MediaThumb';
import { StatusPill } from './StatusPill';

export function ListRow({ item, onPress }: { item: MediaItem; onPress: () => void }) {
  return (
    <Button unstyled onPress={onPress} pressStyle={{ opacity: 0.85 }}>
      <XStack ai="center" gap="$3" p="$3" bg="$surface" br="$3" borderWidth={1} borderColor="$borderColor">
        <YStack width={48} height={48} br="$3" overflow="hidden" flexShrink={0}>
          <MediaThumb type={item.type} radius={12} imageUrl={item.imageUrl} />
        </YStack>
        <YStack flex={1} gap="$1" minWidth={0}>
          <Text fontSize={15} fontWeight="600" color="$color" numberOfLines={1}>
            {item.title}
          </Text>
          <Text fontSize={13} color="$colorSecondary" numberOfLines={1}>
            {item.subtitle}
          </Text>
        </YStack>
        <StatusPill status={item.status} />
      </XStack>
    </Button>
  );
}
