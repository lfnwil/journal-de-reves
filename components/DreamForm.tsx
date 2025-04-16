import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Slider from '@react-native-community/slider';


const { width } = Dimensions.get('window');

export default function DreamForm({ mode = 'create' }) {
  const router = useRouter();

  const [dreamText, setDreamText] = useState('');
  const [dreamType, setDreamType] = useState('rêve');
  const [tone, setTone] = useState(5);
  const [sleepQuality, setSleepQuality] = useState(5); 
  const [characters, setCharacters] = useState('');
  const [location, setLocation] = useState('');
  const [emotion, setEmotion] = useState('');
  const [hashtag1, setHashtag1] = useState('');
  const [hashtag2, setHashtag2] = useState('');
  const [hashtag3, setHashtag3] = useState('');
  const [editingId, setEditingId] = useState(null);

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
          setTone(dream.tone || 'neutre');
          setSleepQuality(dream.sleepQuality || 5);
          setCharacters(dream.characters || '');
          setLocation(dream.location || '');
          setEmotion(dream.emotion || '');
          setHashtag1(dream.hashtags?.[0] || '');
          setHashtag2(dream.hashtags?.[1] || '');
          setHashtag3(dream.hashtags?.[2] || '');
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
        location,
        emotion,
        todayDate: new Date().toISOString(),
        selectedDate: date,
        hashtags: [hashtag1, hashtag2, hashtag3],
      };

      const updatedArray = editingId
        ? formDataArray.map((dream) => dream.id === editingId ? updatedDream : dream)
        : [...formDataArray, updatedDream];

      await AsyncStorage.setItem('dreamFormDataArray', JSON.stringify(updatedArray));
      await AsyncStorage.removeItem('dreamToEdit');

      setDreamText('');
      setDreamType('rêve');
      setTone('');
      setSleepQuality('');
      setCharacters('');
      setLocation('');
      setEmotion('');
      setHashtag1('');
      setHashtag2('');
      setHashtag3('');
      setDate(formattedDate);
      setEditingId(null);

      router.back();
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

        <TextInput
            label="Personnages présents"
            value={characters}
            onChangeText={setCharacters}
            mode="outlined"
            style={styles.input}
        />
        <TextInput
            label="Lieu du rêve"
            value={location}
            onChangeText={setLocation}
            mode="outlined"
            style={styles.input}
        />
        <TextInput
            label="Émotions ressenties"
            value={emotion}
            onChangeText={setEmotion}
            mode="outlined"
            style={styles.input}
        />
        <TextInput
            label="Hashtag 1"
            value={hashtag1}
            onChangeText={setHashtag1}
            mode="outlined"
            style={styles.input}
        />
        <TextInput
            label="Hashtag 2"
            value={hashtag2}
            onChangeText={setHashtag2}
            mode="outlined"
            style={styles.input}
        />
        <TextInput
            label="Hashtag 3"
            value={hashtag3}
            onChangeText={setHashtag3}
            mode="outlined"
            style={styles.input}
        />

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
});
