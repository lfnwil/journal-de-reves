import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';
import DreamForm from '@/components/DreamForm';

export default function EditDreamPage() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <DreamForm mode="edit" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
});
