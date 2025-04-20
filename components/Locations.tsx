import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, IconButton } from 'react-native-paper';

type Location = { id: number; name: string };

interface Props {
  locations: Location[];
  setLocations: React.Dispatch<React.SetStateAction<Location[]>>;
}

export default function Locations({ locations, setLocations }: Props) {
  const [newLocation, setNewLocation] = useState('');

  const addLocation = () => {
    const trimmed = newLocation.trim();
    if (!trimmed) return;

    setLocations([...locations, { id: Date.now(), name: trimmed }]);
    setNewLocation('');
  };

  const removeLocation = (id: number) => {
    setLocations(locations.filter((loc) => loc.id !== id));
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <TextInput
          label="Ajouter un lieu"
          value={newLocation}
          onChangeText={setNewLocation}
          mode="outlined"
          style={styles.input}
        />
        <Button onPress={addLocation} mode="contained" style={styles.addButton}>
          Ajouter
        </Button>
      </View>

      <View style={styles.list}>
        {locations.map((loc) => (
          <View key={loc.id} style={styles.item}>
            <Text>{loc.name}</Text>
            <IconButton icon="close" size={16} onPress={() => removeLocation(loc.id)} />
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
