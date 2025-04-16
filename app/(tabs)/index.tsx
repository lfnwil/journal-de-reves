import { StyleSheet, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import DreamForm from '@/components/DreamForm';


export default function TabOneScreen() {
  return (
      <ScrollView contentContainerStyle={styles.container}>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
