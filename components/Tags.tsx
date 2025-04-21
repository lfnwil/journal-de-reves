import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, IconButton } from 'react-native-paper';

export default function Tags({ tags, setTags }) {
  const [newTag, setNewTag] = useState('');

  const addTag = () => {
    const trimmed = newTag.trim();
    if (trimmed === '') return;

    setTags([...tags, { id: Date.now(), label: trimmed }]);
    setNewTag('');
  };

  const removeTag = (id) => {
    setTags(tags.filter(tag => tag.id !== id));
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <TextInput
          label="Ajouter un tag"
          value={newTag}
          onChangeText={setNewTag}
          mode="outlined"
          style={styles.input}
        />
        <Button onPress={addTag} mode="contained" style={styles.addButton}>
          Ajouter
        </Button>
      </View>

      <View style={styles.tagList}>
        {tags.map(tag => (
          <View key={tag.id} style={styles.tag}>
            <Text style={styles.tagText}>{tag.label}</Text>
            <IconButton
              icon="close"
              size={16}
              onPress={() => removeTag(tag.id)}
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
    backgroundColor: '#222',
  },
  addButton: {
    height: 56,
    justifyContent: 'center',
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  tagText: {
    marginRight: 4,
  },
  icon: {
    margin: 0,
  },
});
