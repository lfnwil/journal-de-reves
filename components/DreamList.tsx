import React, { useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';


export default function DreamList() {
  const [dreams, setDreams] = useState([]);

  const fetchDreams = async () => {
    try {
      const data = await AsyncStorage.getItem('dreamFormDataArray');
      const dreamArray = data ? JSON.parse(data) : [];
      setDreams(dreamArray.reverse()); 
    } catch (error) {
      console.error('Erreur lors du chargement des rêves :', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDreams();
    }, [])
  );

  const handleDeleteDream = async (id) => {
    try {
      const data = await AsyncStorage.getItem('dreamFormDataArray');
      const dreamArray = data ? JSON.parse(data) : [];
      const filtered = dreamArray.filter((dream) => dream.id !== id);
      await AsyncStorage.setItem('dreamFormDataArray', JSON.stringify(filtered));
      setDreams(filtered.reverse());
      console.log('Rêve supprimé avec succès.');
    } catch (error) {
      console.error('Erreur lors de la suppression :', error);
    }
  };

  const handleEditDream = async (dream) => {
    await AsyncStorage.setItem('dreamToEdit', JSON.stringify(dream));
    router.push('/edit');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Mes rêves</Text>
      <Text style={styles.count}>{dreams.length} rêve(s) enregistré(s)</Text>

      {dreams.length === 0 ? (
        <Text style={styles.noDream}>Aucun rêve enregistré pour le moment.</Text>
      ) : (
        dreams.map((dream) => (
          <View key={dream.id} style={styles.card}>
            <Text style={styles.date}>📅 {dream.selectedDate}</Text>
            <Text style={styles.type}>🌙 {dream.dreamType}</Text>
            <Text style={styles.text}>{dream.dreamText}</Text>

            {dream.hashtags && dream.hashtags.some(Boolean) && (
              <Text style={styles.hashtags}>
                🔖 {dream.hashtags.filter(Boolean).map(tag => `#${tag}`).join(' ')}
              </Text>
            )}

            <View style={styles.buttonRow}>
              <Button
                mode="outlined"
                onPress={() => handleDeleteDream(dream.id)}
                style={styles.button}
              >
                Supprimer
              </Button>
              <Button
                mode="contained"
                onPress={() => handleEditDream(dream)}
                style={styles.button}
              >
                Modifier
              </Button>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const router = useRouter();

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  count: {
    fontSize: 16,
    color: '#555',
    marginBottom: 12,
  },
  card: {   
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  date: {
    fontWeight: 'bold',
  },
  type: {
    marginTop: 4,
    fontStyle: 'italic',
  },
  text: {
    marginTop: 8,
    fontSize: 16,
  },
  hashtags: {
    marginTop: 8,
    color: '#666',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  noDream: {
    fontStyle: 'italic',
    color: '#888',
    marginTop: 16,
  },
});
