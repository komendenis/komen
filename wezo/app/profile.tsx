import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '../src/components/ui';
import { accessPointName } from '../src/data/accessPoints';
import { useStore } from '../src/state/store';
import { colors } from '../src/theme';

export default function ProfileScreen() {
  const { profile, resetAll } = useStore();

  const confirmDelete = () =>
    Alert.alert(
      'Delete account',
      'This deletes your WEZO account, remaining credit, contacts, call history and messages. It cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete account', style: 'destructive', onPress: resetAll },
      ],
    );

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.group}>Personal info</Text>
      <Card>
        <InfoRow
          label="Name"
          value={profile.name || 'Add'}
          onPress={() => router.push({ pathname: '/profile-edit', params: { field: 'name' } })}
        />
        <InfoRow
          label="Email"
          value={profile.email || 'Add'}
          onPress={() => router.push({ pathname: '/profile-edit', params: { field: 'email' } })}
        />
        <InfoRow label="My number" value={profile.phone || '–'} last />
      </Card>

      <Text style={styles.group}>Settings</Text>
      <Card>
        <InfoRow
          label="Access point"
          value={accessPointName(profile.accessPoint)}
          onPress={() => router.push('/access-point')}
        />
        <Pressable style={[styles.row, styles.last]} onPress={confirmDelete}>
          <Text style={[styles.label, { color: colors.primary }]}>Delete account</Text>
        </Pressable>
      </Card>
    </ScrollView>
  );
}

function InfoRow({ label, value, onPress, last }: { label: string; value: string; onPress?: () => void; last?: boolean }) {
  const content = (
    <>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value} numberOfLines={1}>
        {value}
      </Text>
      {onPress && <Ionicons name="chevron-forward" size={16} color={colors.muted} />}
    </>
  );
  return onPress ? (
    <Pressable style={({ pressed }) => [styles.row, last && styles.last, pressed && { opacity: 0.6 }]} onPress={onPress}>
      {content}
    </Pressable>
  ) : (
    <View style={[styles.row, last && styles.last]}>{content}</View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, paddingBottom: 32 },
  group: { fontSize: 13, color: colors.muted, marginTop: 12, marginBottom: 8, marginLeft: 4 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  last: { borderBottomWidth: 0 },
  label: { fontSize: 14, color: colors.text },
  value: { flex: 1, fontSize: 14, color: colors.muted, textAlign: 'right' },
});
