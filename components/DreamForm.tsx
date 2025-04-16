import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { TextInput, Button, RadioButton } from 'react-native-paper';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function DreamForm() {
  const [dreamText, setDreamText] = useState('');
  const [dreamType, setDreamType] = useState('rêve');
  const [hashtag1, setHashtag1] = useState('');
  const [hashtag2, setHashtag2] = useState('');
  const [hashtag3, setHashtag3] = useState('');
  const [editingId, setEditingId] = useState(null);

  const today = new Date();
  const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const [date, setDate] = useState(formattedDate);

  // Charger un rêve à modifier (s'il y en a un)
  useEffect(() => {
    const loadDreamToEdit = async () => {
      try {
        const data = await AsyncStorage.getItem('dreamToEdit');
        if (data) {
          const dream = JSON.parse(data);
          setDreamText(dream.dreamText);
          setDreamType(dream.dreamType);
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
  }, []);

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
        todayDate: new Date().toISOString(),
        selectedDate: date,
        hashtags: [hashtag1, hashtag2, hashtag3],
      };

      let updatedArray;
      if (editingId) {
        updatedArray = formDataArray.map((dream) =>
          dream.id === editingId ? updatedDream : dream
        );
      } else {
        updatedArray = [...formDataArray, updatedDream];
      }

      await AsyncStorage.setItem('dreamFormDataArray', JSON.stringify(updatedArray));
      await AsyncStorage.removeItem('dreamToEdit');

      // Réinitialisation du formulaire
      setDreamText('');
      setDreamType('rêve');
      setHashtag1('');
      setHashtag2('');
      setHashtag3('');
      setDate(formattedDate);
      setEditingId(null);

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
          [date]: { selected: true, disableTouchEvent: true, selectedDotColor: 'orange' },
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
});
