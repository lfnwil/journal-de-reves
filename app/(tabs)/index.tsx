import { StyleSheet, Button, View as RNView } from 'react-native';
import { useRouter } from 'expo-router';
import { View } from '@/components/Themed';
import DreamList from '@/components/DreamList';

export default function TabTwoScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <RNView style={styles.buttonContainer}>
        <Button
          title="Ajouter un rêve +"
          onPress={() => router.push('/two')}
        />
      </RNView>
      <DreamList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  button: {
    marginTop: 16,
    alignSelf: 'center',
  },
});
