import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text } from 'react-native';
import { accessPoints } from '../src/data/accessPoints';
import { useStore } from '../src/state/store';
import { colors } from '../src/theme';

export default function AccessPointScreen() {
  const { profile, updateProfile } = useStore();

  return (
    <FlatList
      style={styles.screen}
      data={accessPoints}
      keyExtractor={(a) => a.id}
      ListHeaderComponent={
        <Text style={styles.intro}>
          Without mobile data, WEZO connects your call through a local number in this city. Pick the one closest to you.
        </Text>
      }
      renderItem={({ item }) => {
        const selected = item.id === profile.accessPoint;
        return (
          <Pressable
            style={styles.row}
            onPress={() => {
              updateProfile({ accessPoint: item.id });
              router.back();
            }}
          >
            <Text style={[styles.name, selected && { color: colors.primary, fontWeight: '600' }]}>{item.name}</Text>
            {selected && <Ionicons name="checkmark" size={20} color={colors.primary} />}
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  intro: { fontSize: 12, color: colors.muted, padding: 16, lineHeight: 17 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.card,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  name: { flex: 1, fontSize: 14, color: colors.text },
});
