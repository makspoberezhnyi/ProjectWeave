import React from 'react';
import { Button, XStack, YStack, Text } from 'tamagui';
import { MediaType, TYPE_LABEL } from '../data/types';

export function TypeChip({
  type,
  active,
  onPress,
}: {
  type: MediaType;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Button unstyled onPress={onPress} pressStyle={{ opacity: 0.8 }}>
      <XStack
        ai="center"
        gap="$2"
        br="$5"
        px="$3"
        py="$2"
        bg={active ? '$backgroundSunken' : 'transparent'}
        borderWidth={1}
        borderColor={active ? (`$${type}` as any) : '$borderColor'}
      >
        <YStack width={7} height={7} br="$5" bg={(`$${type}` as any)} />
        <Text fontSize={13} fontWeight="600" color={active ? (`$${type}` as any) : '$colorSecondary'}>
          {TYPE_LABEL[type]}
        </Text>
      </XStack>
    </Button>
  );
}
