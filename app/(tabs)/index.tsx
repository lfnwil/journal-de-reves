import { StyleSheet, TouchableOpacity, Text, View as RNView } from 'react-native';
import { useRouter } from 'expo-router';
import { View } from '@/components/Themed';
import DreamList from '@/components/DreamList';

export default function TabOneScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <RNView style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/form')}>
          <Text style={styles.buttonText}>Ajouter un rêve +</Text>
        </TouchableOpacity>
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
    backgroundColor: 'black'
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#1E90FF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
