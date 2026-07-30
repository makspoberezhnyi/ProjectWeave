import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { Button, XStack, YStack, Text, useThemeName } from 'tamagui';
import { useWeaveStore } from '../state/store';
import { Status, TYPE_LABEL } from '../data/types';
import { MediaThumb } from '../components/MediaThumb';
import { PillButton } from '../components/PillButton';
import { DateTimeField } from '../components/DateTimeField';
import { colorTokens } from '../design-system/tokens/colors';
import { requestNotificationPermission } from '../lib/notifications';

const STATUS_OPTIONS: { key: Status; label: string }[] = [
  { key: 'want', label: '+ Want' },
  { key: 'in_progress', label: '▶ In progress' },
  { key: 'done', label: '✓ Done' },
];

function formatReminder(whenMs: number) {
  return new Date(whenMs).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function DetailOverlay() {
  const item = useWeaveStore((s) => s.items.find((i) => i.id === s.selectedItemId));
  const closeOverlay = useWeaveStore((s) => s.closeOverlay);
  const setStatus = useWeaveStore((s) => s.setStatus);
  const setRating = useWeaveStore((s) => s.setRating);
  const deleteItem = useWeaveStore((s) => s.deleteItem);
  const placeOnCanvas = useWeaveStore((s) => s.placeOnCanvas);
  const removeFromCanvas = useWeaveStore((s) => s.removeFromCanvas);
  const setReminder = useWeaveStore((s) => s.setReminder);
  const clearReminder = useWeaveStore((s) => s.clearReminder);

  const [pickerOpen, setPickerOpen] = useState(false);
  const [pendingDate, setPendingDate] = useState<Date>(() => new Date(Date.now() + 60 * 60 * 1000));

  const themeName = useThemeName() === 'dark' ? 'dark' : 'light';
  const tokens = colorTokens[themeName];

  if (!item) return null;

  const openPicker = async () => {
    await requestNotificationPermission();
    setPendingDate(item.reminderAt ? new Date(item.reminderAt) : new Date(Date.now() + 60 * 60 * 1000));
    setPickerOpen(true);
  };

  return (
    <YStack position="absolute" inset={0} bg="$background" zi={20}>
      <XStack ai="center" gap="$3" p="$4" borderBottomWidth={1} borderColor="$borderColor" bg="$surface">
        <Button unstyled onPress={closeOverlay} width={36} height={36} br="$5" borderWidth={1} borderColor="$borderColor" ai="center" jc="center">
          <Text fontSize={15} color="$color">←</Text>
        </Button>
        <Text fontSize={17} fontWeight="700" color="$color">Details</Text>
      </XStack>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <YStack gap="$5" p="$5" maxWidth={480} width="100%" mx="auto">
          <YStack height={220} br="$4" overflow="hidden">
            <MediaThumb type={item.type} radius={20} imageUrl={item.imageUrl} />
          </YStack>

          <YStack gap="$2">
            <XStack ai="center" gap="$2" bg="$backgroundSunken" br="$5" px="$3" py="$1" als="flex-start">
              <YStack width={6} height={6} br="$5" bg={(`$${item.type}` as any)} />
              <Text fontSize={11} fontWeight="700" color={(`$${item.type}` as any)}>{TYPE_LABEL[item.type]}</Text>
            </XStack>
            <Text fontSize={22} fontWeight="800" color="$color">{item.title}</Text>
            <Text fontSize={15} color="$colorSecondary">{item.subtitle}</Text>
          </YStack>

          <YStack gap="$2">
            <Text fontSize={11} fontWeight="700" color="$colorSecondary" textTransform="uppercase">Status</Text>
            <XStack gap="$2">
              {STATUS_OPTIONS.map((opt) => {
                const active = item.status === opt.key;
                return (
                  <Button key={opt.key} unstyled flex={1} onPress={() => setStatus(item.id, opt.key)} pressStyle={{ opacity: 0.85 }}>
                    <YStack br="$2" py="$3" ai="center" bg={active ? '$pillPrimaryBackground' : '$surface'} borderWidth={1} borderColor={active ? '$pillPrimaryBackground' : '$borderColor'}>
                      <Text fontSize={13} fontWeight="600" color={active ? '$pillPrimaryText' : '$color'}>{opt.label}</Text>
                    </YStack>
                  </Button>
                );
              })}
            </XStack>
          </YStack>

          {item.status === 'done' && (
            <YStack gap="$2">
              <Text fontSize={11} fontWeight="700" color="$colorSecondary" textTransform="uppercase">Rating</Text>
              <XStack gap="$2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Button key={n} unstyled onPress={() => setRating(item.id, n)} pressStyle={{ opacity: 0.7 }}>
                    <Text fontSize={22} color={(item.rating ?? 0) >= n ? '$book' : '$borderColor'}>★</Text>
                  </Button>
                ))}
              </XStack>
            </YStack>
          )}

          <YStack gap="$2">
            <Text fontSize={11} fontWeight="700" color="$colorSecondary" textTransform="uppercase">Reminder</Text>

            {!pickerOpen && item.reminderAt && (
              <XStack ai="center" jc="space-between" bg="$backgroundSunken" br="$3" p="$3">
                <YStack>
                  <Text fontSize={13} fontWeight="600" color="$color">{formatReminder(item.reminderAt)}</Text>
                  <Text fontSize={11} color="$colorSecondary">You'll get a reminder here</Text>
                </YStack>
                <XStack gap="$2">
                  <Button unstyled onPress={openPicker} px="$3" py="$2" br="$5" borderWidth={1} borderColor="$borderColor">
                    <Text fontSize={11} fontWeight="600" color="$color">Change</Text>
                  </Button>
                  <Button unstyled onPress={() => clearReminder(item.id)} px="$3" py="$2" br="$5" borderWidth={1} borderColor="$borderColor">
                    <Text fontSize={11} fontWeight="600" color="$movie">Remove</Text>
                  </Button>
                </XStack>
              </XStack>
            )}

            {!pickerOpen && !item.reminderAt && (
              <PillButton variant="secondary" onPress={openPicker}>
                Set reminder
              </PillButton>
            )}

            {pickerOpen && (
              <YStack gap="$3" bg="$backgroundSunken" br="$3" p="$3">
                <DateTimeField
                  value={pendingDate}
                  onChange={setPendingDate}
                  surfaceColor={tokens.surface}
                  borderColor={tokens.border}
                  textColor={tokens.textPrimary}
                />
                <XStack gap="$2">
                  <PillButton
                    variant="primary"
                    onPress={() => {
                      setReminder(item.id, pendingDate.getTime());
                      setPickerOpen(false);
                    }}
                  >
                    Save reminder
                  </PillButton>
                  <PillButton variant="text" onPress={() => setPickerOpen(false)}>
                    Cancel
                  </PillButton>
                </XStack>
              </YStack>
            )}
          </YStack>

          <XStack gap="$2" flexWrap="wrap">
            <PillButton
              variant="secondary"
              onPress={() => {
                item.placed ? removeFromCanvas(item.id) : placeOnCanvas(item.id);
                closeOverlay();
              }}
            >
              {item.placed ? 'Remove from canvas' : 'Add to canvas'}
            </PillButton>
            <PillButton variant="text" textColor="$movie" onPress={() => deleteItem(item.id)}>
              Delete
            </PillButton>
          </XStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
}
