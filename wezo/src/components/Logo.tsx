import { Image, StyleSheet } from 'react-native';

export function Logo() {
  return <Image source={require('../../assets/logo-small.png')} style={styles.mark} accessibilityLabel="WEZO" />;
}

const styles = StyleSheet.create({
  mark: { width: 28, height: 28 },
});
