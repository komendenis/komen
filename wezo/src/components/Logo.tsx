import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

export function Logo() {
  return (
    <View style={styles.row}>
      <Image source={require('../../assets/logo-small.png')} style={styles.mark} />
      <Text style={styles.word}>WEZO</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  mark: { width: 26, height: 26 },
  word: { fontSize: 18, fontWeight: '800', letterSpacing: 0.5, color: colors.primary },
});
