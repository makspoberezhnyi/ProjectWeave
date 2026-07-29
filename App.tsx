import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { TamaguiProvider, Theme, XStack, YStack, Text, Button } from 'tamagui';
import config from './tamagui.config';

const MEDIA_TYPES = ['movie', 'music', 'book', 'video', 'playlist'] as const;

function DesignSystemPreview({ theme, onToggle }: { theme: 'light' | 'dark'; onToggle: (t: 'light' | 'dark') => void }) {
  return (
    <YStack flex={1} bg="$background" p="$5" gap="$5">
      <XStack jc="space-between" ai="center" pb="$4" borderBottomWidth={1} borderColor="$borderColor">
        <YStack>
          <Text fontFamily="$heading" fontSize="$6" fontWeight="800" color="$color">weave</Text>
          <Text fontFamily="$body" fontSize="$2" color="$colorSecondary" mt="$1">Design system preview</Text>
        </YStack>
        <XStack bg="$backgroundSunken" br="$5" p="$1" gap="$1">
          <Button unstyled px="$4" py="$2" br="$5" bg={theme === 'light' ? '$surface' : 'transparent'} onPress={() => onToggle('light')}>
            <Text color="$color" fontWeight="700" fontSize="$2">Day</Text>
          </Button>
          <Button unstyled px="$4" py="$2" br="$5" bg={theme === 'dark' ? '$surface' : 'transparent'} onPress={() => onToggle('dark')}>
            <Text color="$color" fontWeight="700" fontSize="$2">Dark</Text>
          </Button>
        </XStack>
      </XStack>

      <YStack gap="$3">
        <Text fontSize="$1" fontWeight="700" color="$colorSecondary" textTransform="uppercase">
          Media accents
        </Text>
        <XStack gap="$2" flexWrap="wrap">
          {MEDIA_TYPES.map((key) => (
            <YStack key={key} width={92} bg="$surface" br="$3" p="$3" gap="$2" borderWidth={1} borderColor="$borderColor">
              <YStack width={28} height={28} br="$2" bg={`$${key}` as any} />
              <Text fontSize="$1" fontWeight="700" color="$color" textTransform="capitalize">
                {key}
              </Text>
            </YStack>
          ))}
        </XStack>
      </YStack>

      <YStack gap="$3">
        <Text fontSize="$1" fontWeight="700" color="$colorSecondary" textTransform="uppercase">
          Status
        </Text>
        <XStack gap="$2">
          <XStack ai="center" gap="$2" bg="$backgroundSunken" br="$5" px="$3" py="$2">
            <YStack width={7} height={7} br="$5" bg="$colorSecondary" />
            <Text fontSize="$2" fontWeight="600" color="$colorSecondary">Want</Text>
          </XStack>
          <XStack ai="center" gap="$2" bg="$backgroundSunken" br="$5" px="$3" py="$2">
            <YStack width={7} height={7} br="$5" bg="$info" />
            <Text fontSize="$2" fontWeight="600" color="$info">In progress</Text>
          </XStack>
          <XStack ai="center" gap="$2" bg="$backgroundSunken" br="$5" px="$3" py="$2">
            <YStack width={7} height={7} br="$5" bg="$success" />
            <Text fontSize="$2" fontWeight="600" color="$success">Done</Text>
          </XStack>
        </XStack>
      </YStack>

      <XStack gap="$2">
        <Button unstyled bg="$pillPrimaryBackground" br="$5" px="$5" py="$3" onPress={() => {}}>
          <Text color="$pillPrimaryText" fontWeight="700" fontSize="$3">Save plan</Text>
        </Button>
        <Button unstyled bg="$pillSecondaryBackground" br="$5" px="$5" py="$3" onPress={() => {}}>
          <Text color="$pillSecondaryText" fontWeight="700" fontSize="$3">Invite friends</Text>
        </Button>
      </XStack>
    </YStack>
  );
}

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  return (
    <TamaguiProvider config={config} defaultTheme="light">
      <Theme name={theme}>
        <DesignSystemPreview theme={theme} onToggle={setTheme} />
      </Theme>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </TamaguiProvider>
  );
}
