import React, { useState } from 'react';
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

  const today = new Date();
  const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const [date, setDate] = useState(formattedDate);

  const handleDreamSubmission = async () => {
    try {
      const existingData = await AsyncStorage.getItem('dreamFormDataArray');
      const formDataArray = existingData ? JSON.parse(existingData) : [];

      const newDream = {
        id: Date.now(), 
        dreamText,
        dreamType,
        todayDate: new Date().toISOString(),
        selectedDate: date,
        hashtags: [hashtag1, hashtag2, hashtag3],
      };

      formDataArray.push(newDream);
      await AsyncStorage.setItem('dreamFormDataArray', JSON.stringify(formDataArray));

      setDreamText('');
      setDreamType('rêve');
      setHashtag1('');
      setHashtag2('');
      setHashtag3('');
      setDate(formattedDate);
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
        Enregistrer le rêve
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
