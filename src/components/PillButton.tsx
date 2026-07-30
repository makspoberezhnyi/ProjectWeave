import React from 'react';
import { Button, Text } from 'tamagui';

type Variant = 'primary' | 'secondary' | 'text';

export function PillButton({
  children,
  onPress,
  variant = 'secondary',
  textColor,
  disabled,
}: {
  children: string;
  onPress?: () => void;
  variant?: Variant;
  textColor?: string;
  disabled?: boolean;
}) {
  const bg =
    variant === 'primary'
      ? '$pillPrimaryBackground'
      : variant === 'secondary'
        ? '$pillSecondaryBackground'
        : 'transparent';
  const color = textColor ?? (variant === 'primary' ? '$pillPrimaryText' : variant === 'secondary' ? '$pillSecondaryText' : '$color');

  return (
    <Button
      unstyled
      disabled={disabled}
      opacity={disabled ? 0.5 : 1}
      bg={bg}
      br="$5"
      px="$5"
      py="$3"
      pressStyle={{ opacity: 0.8 }}
      onPress={onPress}
    >
      <Text color={color} fontWeight="700" fontSize={15}>
        {children}
      </Text>
    </Button>
  );
}
