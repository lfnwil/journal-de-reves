import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Platform, Pressable } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

const { width } = Dimensions.get('window');

export default function DreamForm() {
  const [dreamText, setDreamText] = useState('');
  const [dreamType, setDreamType] = useState('rêve');
  const [hashtag1, setHashtag1] = useState('');
  const [hashtag2, setHashtag2] = useState('');
  const [hashtag3, setHashtag3] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleSubmit = () => {
    const dreamData = {
      dreamText,
      dreamType,
      hashtags: [hashtag1, hashtag2, hashtag3],
      date: date.toISOString(), // ou un format lisible si tu préfères
    };

    console.log('Rêve soumis :', dreamData);

    // Reset
    setDreamText('');
    setDreamType('rêve');
    setHashtag1('');
    setHashtag2('');
    setHashtag3('');
    setDate(new Date());
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

      <Pressable onPress={() => setShowPicker(true)} style={styles.dateInput}>
        <Text>Sélectionner une date : {date.toLocaleDateString()}</Text>
      </Pressable>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
        />
      )}

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

      <Button mode="contained" onPress={handleSubmit} style={styles.button}>
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
  dateInput: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#eee',
    borderRadius: 8,
    width: width * 0.9,
    alignSelf: 'center',
  },
  button: {
    marginTop: 16,
    alignSelf: 'center',
  },
});
