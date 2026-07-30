import React from 'react';
import { ScrollView } from 'react-native';
import { Button, XStack, YStack, Text } from 'tamagui';
import { useWeaveStore } from '../state/store';
import { MEDIA_TYPES } from '../data/types';
import { TypeChip } from '../components/TypeChip';
import { ListRow } from '../components/ListRow';

export function ListScreen() {
  const items = useWeaveStore((s) => s.items);
  const activeFilters = useWeaveStore((s) => s.activeFilters);
  const toggleFilter = useWeaveStore((s) => s.toggleFilter);
  const openSave = useWeaveStore((s) => s.openSave);
  const openDetail = useWeaveStore((s) => s.openDetail);

  const visibleItems = items.filter((i) => activeFilters.includes(i.type));

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <YStack gap="$4" p="$5" maxWidth={640} width="100%" mx="auto">
        <Button unstyled onPress={openSave} pressStyle={{ opacity: 0.85 }}>
          <XStack ai="center" gap="$2" p="$4" bg="$surface" br="$5" borderWidth={1} borderColor="$borderColor">
            <Text fontSize={15} color="$colorSecondary">
              Save a movie, album, book, video…
            </Text>
          </XStack>
        </Button>

        <XStack gap="$2" flexWrap="wrap">
          {MEDIA_TYPES.map((type) => (
            <TypeChip key={type} type={type} active={activeFilters.includes(type)} onPress={() => toggleFilter(type)} />
          ))}
        </XStack>

        {visibleItems.length === 0 ? (
          <YStack py="$8" ai="center">
            <Text fontSize={15} color="$colorSecondary">
              No items match these filters.
            </Text>
          </YStack>
        ) : (
          <YStack gap="$2">
            {visibleItems.map((item) => (
              <ListRow key={item.id} item={item} onPress={() => openDetail(item.id)} />
            ))}
          </YStack>
        )}
      </YStack>
    </ScrollView>
  );
}
