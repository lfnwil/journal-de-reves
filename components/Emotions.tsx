import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, IconButton } from 'react-native-paper';

type Emotion = { id: number; name: string };

interface Props {
  emotions: Emotion[];
  setEmotions: React.Dispatch<React.SetStateAction<Emotion[]>>;
}

export default function Emotions({ emotions, setEmotions }: Props) {
  const [newEmotion, setNewEmotion] = useState('');

  const addEmotion = () => {
    const trimmed = newEmotion.trim();
    if (!trimmed) return;

    setEmotions([...emotions, { id: Date.now(), name: trimmed }]);
    setNewEmotion('');
  };

  const removeEmotion = (id: number) => {
    setEmotions(emotions.filter((em) => em.id !== id));
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <TextInput
          label="Ajouter une émotion"
          value={newEmotion}
          onChangeText={setNewEmotion}
          mode="outlined"
          style={styles.input}
        />
        <Button onPress={addEmotion} mode="contained" style={styles.addButton}>
          Ajouter
        </Button>
      </View>

      <View style={styles.list}>
        {emotions.map((em) => (
          <View key={em.id} style={styles.item}>
            <Text>{em.name}</Text>
            <IconButton icon="close" size={16} onPress={() => removeEmotion(em.id)} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 10 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  input: { flex: 1 },
  addButton: { height: 56, justifyContent: 'center' },
  list: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, gap: 8 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
});
