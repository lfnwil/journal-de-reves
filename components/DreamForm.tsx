import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Slider from '@react-native-community/slider';
import Tags from './Tags';
import Characters from './Characters';
import Locations from './Locations';
import Emotions from './Emotions';

const { width } = Dimensions.get('window');

export default function DreamForm({ mode = 'create' }) {
  const router = useRouter();

  const [dreamText, setDreamText] = useState('');
  const [dreamType, setDreamType] = useState('rêve');
  const [tone, setTone] = useState(5);
  const [sleepQuality, setSleepQuality] = useState(5);
  const [characters, setCharacters] = useState<{ id: number; name: string }[]>([]);
  const [locations, setLocations] = useState<{ id: number; name: string }[]>([]);
  const [emotions, setEmotions] = useState<{ id: number; name: string }[]>([]);
  const [hashtags, setHashtags] = useState<{ id: number; label: string }[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const today = new Date();
  const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const [date, setDate] = useState(formattedDate);

  useEffect(() => {
    const loadDreamToEdit = async () => {
      if (mode !== 'edit') return;

      try {
        const data = await AsyncStorage.getItem('dreamToEdit');
        if (data) {
          const dream = JSON.parse(data);
          setDreamText(dream.dreamText);
          setDreamType(dream.dreamType);
          setTone(dream.tone || 5);
          setSleepQuality(dream.sleepQuality || 5);
          setCharacters(Array.isArray(dream.characters) ? dream.characters : []);
          setLocations(Array.isArray(dream.locations) ? dream.locations : []);
          setEmotions(Array.isArray(dream.emotions) ? dream.emotions : []);
          setHashtags(Array.isArray(dream.hashtags) ? dream.hashtags : []);
          setDate(dream.selectedDate);
          dream.id && setEditingId(dream.id);
        }
      } catch (error) {
        console.error('Erreur lors du chargement du rêve à modifier :', error);
      }
    };

    loadDreamToEdit();
  }, [mode]);

  const handleDreamSubmission = async () => {
    if (!dreamText.trim()) {
      console.warn('Veuillez entrer un rêve avant de l’enregistrer.');
      return;
    }

    try {
      const existingData = await AsyncStorage.getItem('dreamFormDataArray');
      const formDataArray = existingData ? JSON.parse(existingData) : [];

      const updatedDream = {
        id: editingId || Date.now(),
        dreamText,
        dreamType,
        tone,
        sleepQuality,
        characters,
        locations,
        emotions,
        todayDate: new Date().toISOString(),
        selectedDate: date,
        hashtags,
      };

      const updatedArray = editingId
        ? formDataArray.map((dream: any) => dream.id === editingId ? updatedDream : dream)
        : [...formDataArray, updatedDream];

      await AsyncStorage.setItem('dreamFormDataArray', JSON.stringify(updatedArray));
      await AsyncStorage.removeItem('dreamToEdit');

      setDreamText('');
      setDreamType('rêve');
      setTone(5);
      setSleepQuality(5);
      setCharacters([]);
      setLocations([]);
      setEmotions([]);
      setHashtags([]);
      setDate(formattedDate);
      setEditingId(null);

      router.replace('/');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Ton rêve"
        value={dreamText}
        onChangeText={setDreamText}
        mode="outlined"
        multiline
        numberOfLines={4}
        style={styles.input}
      />

      <RadioButton.Group onValueChange={setDreamType} value={dreamType}>
        <RadioButton.Item label="Rêve" value="rêve" />
        <RadioButton.Item label="Rêve lucide" value="lucide" />
        <RadioButton.Item label="Cauchemar" value="cauchemar" />
      </RadioButton.Group>

      <View style={styles.sliderContainer}>
        <Text style={styles.sliderLabel}>Qualité du sommeil : {sleepQuality}/10</Text>
        <Slider
          minimumValue={0}
          maximumValue={10}
          step={1}
          value={sleepQuality}
          onValueChange={setSleepQuality}
          style={styles.slider}
          minimumTrackTintColor="#1FB28A"
          maximumTrackTintColor="#d3d3d3"
          thumbTintColor="#1FB28A"
        />
      </View>

      <View style={styles.sliderContainer}>
        <Text style={styles.sliderLabel}>Tonalité du rêve : {tone}/10</Text>
        <Slider
          minimumValue={0}
          maximumValue={10}
          step={1}
          value={tone}
          onValueChange={setTone}
          style={styles.slider}
          minimumTrackTintColor="#1FB28A"
          maximumTrackTintColor="#d3d3d3"
          thumbTintColor="#1FB28A"
        />
      </View>

      <Characters characters={characters} setCharacters={setCharacters} />
      <Locations locations={locations} setLocations={setLocations} />
      <Emotions emotions={emotions} setEmotions={setEmotions} />
      <Tags tags={hashtags} setTags={setHashtags} />

      <Calendar
        style={styles.calendar}
        current={date}
        onDayPress={(day) => setDate(day.dateString)}
        markedDates={{
          [date]: {
            selected: true,
            disableTouchEvent: true,
            selectedDotColor: 'orange',
          },
        }}
      />

      <Button mode="contained" onPress={handleDreamSubmission} style={styles.button}>
        {editingId ? 'Modifier le rêve' : 'Enregistrer le rêve'}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    marginBottom: 10,
    width: width * 0.9,
    alignSelf: 'center',
  },
  calendar: {
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 10,
    overflow: 'hidden',
  },
  button: {
    marginTop: 16,
    alignSelf: 'center',
  },
  sliderContainer: {
    marginBottom: 16,
    width: width * 0.9,
    alignSelf: 'center',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabel: {
    marginBottom: 8,
  },
});
