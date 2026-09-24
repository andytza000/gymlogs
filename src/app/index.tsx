import { Text, View } from 'react-native';

import { makeStyles } from '@/core/design-system';

// Placeholder until the component gallery (#8) replaces it.
export default function Index() {
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>GymLogs</Text>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: t.colors.background,
  },
  text: {
    ...t.typography.body,
    color: t.colors.text,
  },
}));
