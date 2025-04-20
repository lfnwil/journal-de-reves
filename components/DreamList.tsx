import React, { useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';

type Character = { id: number; name: string };
type Hashtag = { id: number; label: string };
type Emotion = { id: number; name: string };
type Location = { id: number; name: string };

type Dream = {
  id: number;
  dreamText: string;
  dreamType: string;
  tone: number;
  sleepQuality: number;
  characters?: Character[];
  locations?: Location[];
  emotions?: Emotion[];
  selectedDate: string;
  hashtags?: Hashtag[];
};

export default function DreamList() {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const router = useRouter();

  const fetchDreams = async () => {
    try {
      const data = await AsyncStorage.getItem('dreamFormDataArray');
      const dreamArray: Dream[] = data ? JSON.parse(data) : [];
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

  const handleDeleteDream = async (id: number) => {
    try {
      const data = await AsyncStorage.getItem('dreamFormDataArray');
      const dreamArray: Dream[] = data ? JSON.parse(data) : [];
      const filtered = dreamArray.filter((dream) => dream.id !== id);
      await AsyncStorage.setItem('dreamFormDataArray', JSON.stringify(filtered));
      setDreams(filtered.reverse());
    } catch (error) {
      console.error('Erreur lors de la suppression :', error);
    }
  };

  const handleEditDream = async (dream: Dream) => {
    try {
      await AsyncStorage.setItem('dreamToEdit', JSON.stringify(dream));
      router.push('/edit');
    } catch (error) {
      console.error("Erreur lors de la préparation du rêve à modifier :", error);
    }
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
            <Text>🌙 Type : {dream.dreamType}</Text>
            <Text>🛏️ Qualité du sommeil : {dream.sleepQuality}/10</Text>
            <Text>🎭 Tonalité : {dream.tone}</Text>

            {Array.isArray(dream.locations) && dream.locations.length > 0 && (
              <Text>
                📍 Lieux : {dream.locations.map((loc) => loc.name).join(', ')}
              </Text>
            )}

            {Array.isArray(dream.characters) && dream.characters.length > 0 && (
              <Text>
                👥 Personnages : {dream.characters.map((char) => char.name).join(', ')}
              </Text>
            )}

            {Array.isArray(dream.emotions) && dream.emotions.length > 0 && (
              <Text>
                😶‍🌫️ Émotions : {dream.emotions.map((e) => e.name).join(', ')}
              </Text>
            )}

            <Text style={styles.text}>📝 {dream.dreamText}</Text>

            {Array.isArray(dream.hashtags) && dream.hashtags.length > 0 && (
              <Text style={styles.hashtags}>
                🔖 {dream.hashtags.map((tag) => `#${tag.label}`).join(' ')}
              </Text>
            )}

            <View style={styles.buttonRow}>
              <Button mode="outlined" onPress={() => handleDeleteDream(dream.id)} style={styles.button}>
                Supprimer
              </Button>
              <Button mode="contained" onPress={() => handleEditDream(dream)} style={styles.button}>
                Modifier
              </Button>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

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
    marginBottom: 4,
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
