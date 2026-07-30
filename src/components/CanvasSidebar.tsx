import React from 'react';
import { ScrollView } from 'react-native';
import { Button, Text, XStack, YStack } from 'tamagui';
import { useWeaveStore } from '../state/store';
import { MediaThumb } from './MediaThumb';

export function CanvasSidebar() {
  const items = useWeaveStore((s) => s.items);
  const placeOnCanvas = useWeaveStore((s) => s.placeOnCanvas);
  const unplaced = items.filter((i) => !i.placed);

  return (
    <YStack width={220} flexShrink={0} bg="$surface" borderRightWidth={1} borderColor="$borderColor">
      <Text fontSize={11} fontWeight="700" color="$colorSecondary" textTransform="uppercase" px="$4" pt="$4" pb="$2">
        Not yet placed
      </Text>
      <ScrollView>
        <YStack gap="$2" px="$3" pb="$4">
          {unplaced.length === 0 ? (
            <Text fontSize={13} color="$colorSecondary" px="$1" py="$2">
              Everything is on the board.
            </Text>
          ) : (
            unplaced.map((item) => (
              <XStack key={item.id} ai="center" gap="$2" p="$2" bg="$background" br="$3" borderWidth={1} borderColor="$borderColor">
                <YStack width={36} height={36} br="$2" overflow="hidden" flexShrink={0}>
                  <MediaThumb type={item.type} radius={8} imageUrl={item.imageUrl} />
                </YStack>
                <Text flex={1} fontSize={13} fontWeight="600" color="$color" numberOfLines={1}>
                  {item.title}
                </Text>
                <Button
                  unstyled
                  onPress={() => placeOnCanvas(item.id)}
                  width={24}
                  height={24}
                  br="$5"
                  bg={(`$${item.type}` as any)}
                  ai="center"
                  jc="center"
                >
                  <Text color="$pillPrimaryText" fontSize={13} fontWeight="700">+</Text>
                </Button>
              </XStack>
            ))
          )}
        </YStack>
      </ScrollView>
    </YStack>
  );
}
