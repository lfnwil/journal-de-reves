import { StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { View } from '@/components/Themed';
import DreamForm from '@/components/DreamForm';
import { useRouter } from 'expo-router';

export default function FormScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => router.push('/')} style={styles.backButton}>
        <Text style={styles.backText}>← Retour à la liste</Text>
      </TouchableOpacity>

      <DreamForm />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor:'black',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  backText: {
    color: '#1E90FF',
    fontSize: 16,
    fontWeight: '500',
  },
});
