import React from 'react';
import { ScrollView } from 'react-native';
import { Button, Input, XStack, YStack, Text } from 'tamagui';
import { useWeaveStore, searchResults } from '../state/store';
import { MEDIA_TYPES, TYPE_LABEL } from '../data/types';
import { MediaThumb } from '../components/MediaThumb';

export function SaveOverlay() {
  const searchQuery = useWeaveStore((s) => s.searchQuery);
  const searchType = useWeaveStore((s) => s.searchType);
  const setSearchQuery = useWeaveStore((s) => s.setSearchQuery);
  const setSearchType = useWeaveStore((s) => s.setSearchType);
  const addFromSearch = useWeaveStore((s) => s.addFromSearch);
  const closeOverlay = useWeaveStore((s) => s.closeOverlay);

  const results = searchResults(searchType, searchQuery);

  return (
    <YStack position="absolute" inset={0} bg="$background" zi={20}>
      <XStack ai="center" gap="$3" p="$4" borderBottomWidth={1} borderColor="$borderColor" bg="$surface">
        <Button unstyled onPress={closeOverlay} width={36} height={36} br="$5" borderWidth={1} borderColor="$borderColor" ai="center" jc="center">
          <Text fontSize={15} color="$color">←</Text>
        </Button>
        <Text fontSize={17} fontWeight="700" color="$color">Save something</Text>
      </XStack>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <YStack gap="$4" p="$5" maxWidth={560} width="100%" mx="auto">
          <Input
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search a title…"
            autoFocus
            bg="$surface"
            borderColor="$borderColor"
            br="$5"
            px="$4"
            py="$3"
            fontSize={15}
          />

          <XStack gap="$2" flexWrap="wrap">
            {MEDIA_TYPES.map((type) => {
              const active = searchType === type;
              return (
                <Button key={type} unstyled onPress={() => setSearchType(type)} pressStyle={{ opacity: 0.85 }}>
                  <XStack br="$5" px="$3" py="$2" bg={active ? (`$${type}` as any) : '$surface'} borderWidth={1} borderColor={active ? (`$${type}` as any) : '$borderColor'}>
                    <Text fontSize={13} fontWeight="600" color={active ? '$pillPrimaryText' : '$colorSecondary'}>
                      {TYPE_LABEL[type]}
                    </Text>
                  </XStack>
                </Button>
              );
            })}
          </XStack>

          <YStack gap="$2">
            {results.length === 0 ? (
              <YStack py="$6" ai="center">
                <Text fontSize={13} color="$colorSecondary">No matches — try a different title.</Text>
              </YStack>
            ) : (
              results.map((r) => (
                <Button key={r.title} unstyled onPress={() => addFromSearch(r.title, r.subtitle)} pressStyle={{ opacity: 0.85 }}>
                  <XStack ai="center" gap="$3" p="$3" bg="$surface" br="$3" borderWidth={1} borderColor="$borderColor">
                    <YStack width={44} height={44} br="$3" overflow="hidden" flexShrink={0}>
                      <MediaThumb type={searchType} radius={10} />
                    </YStack>
                    <YStack flex={1} minWidth={0}>
                      <Text fontSize={15} fontWeight="600" color="$color" numberOfLines={1}>{r.title}</Text>
                      <Text fontSize={13} color="$colorSecondary" numberOfLines={1}>{r.subtitle}</Text>
                    </YStack>
                    <Text fontSize={13} fontWeight="700" color="$colorSecondary">Add</Text>
                  </XStack>
                </Button>
              ))
            )}
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
}
