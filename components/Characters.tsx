import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, IconButton } from 'react-native-paper';

export default function Characters({ characters, setCharacters }) {
  const [newCharacter, setNewCharacter] = useState('');

  const addCharacter = () => {
    const trimmed = newCharacter.trim();
    if (trimmed === '') return;

    setCharacters([...characters, { id: Date.now(), name: trimmed }]);
    setNewCharacter('');
  };

  const removeCharacter = (id) => {
    setCharacters(characters.filter((char) => char.id !== id));
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <TextInput
          label="Ajouter un personnage"
          value={newCharacter}
          onChangeText={setNewCharacter}
          mode="outlined"
          style={styles.input}
        />
        <Button onPress={addCharacter} mode="contained" style={styles.addButton}>
          Ajouter
        </Button>
      </View>

      <View style={styles.list}>
        {characters.map((char) => (
          <View key={char.id} style={styles.item}>
            <Text style={styles.itemText}>{char.name}</Text>
            <IconButton
              icon="close"
              size={16}
              onPress={() => removeCharacter(char.id)}
              style={styles.icon}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
  },
  addButton: {
    height: 56,
    justifyContent: 'center',
  },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  itemText: {
    marginRight: 4,
  },
  icon: {
    margin: 0,
  },
});
