import React, { useState } from 'react';
import { View, TextInput, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useForm, Controller } from 'react-hook-form';
import dayjs from 'dayjs';

const CreateTaskScreen = ({ navigation }) => {
  const { control, handleSubmit, reset } = useForm();
  const [imageUrls, setImageUrls] = useState(['']);
  const [videoUrls, setVideoUrls] = useState(['']);

  const handleCreateTask = async (data) => {
    const storedTasks = await AsyncStorage.getItem('tasks');
    const tasks = storedTasks ? JSON.parse(storedTasks) : [];  

    const newId = `evt_${tasks.length + 1}`;

    const newTask = {
      id: newId,
      name: data.name,
      description: data.description,
      date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      images: imageUrls.filter(url => url),
      videos: videoUrls.filter(url => url),
    };

    tasks.push(newTask);
    await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
    reset();
    navigation.goBack();
  };

  const addImageUrl = () => setImageUrls([...imageUrls, '']);
  const addVideoUrl = () => setVideoUrls([...videoUrls, '']);

  const handleImageUrlChange = (text, index) => {
    const newImageUrls = [...imageUrls];
    newImageUrls[index] = text;
    setImageUrls(newImageUrls);
  };

  const handleVideoUrlChange = (text, index) => {
    const newVideoUrls = [...videoUrls];
    newVideoUrls[index] = text;
    setVideoUrls(newVideoUrls);
  };

  const removeImageUrl = (index) => {
    const newImageUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newImageUrls);
  };

  const removeVideoUrl = (index) => {
    const newVideoUrls = videoUrls.filter((_, i) => i !== index);
    setVideoUrls(newVideoUrls);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create New Task</Text>

      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Task Name"
            placeholderTextColor="#888"
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="name"
        rules={{ required: true }}
      />

      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Description"
            placeholderTextColor="#888"
            style={[styles.input, styles.textArea]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            multiline
          />
        )}
        name="description"
        rules={{ required: true }}
      />

      <Text style={styles.label}>Image URLs:</Text>
      {imageUrls.map((url, index) => (
        <View key={index} style={styles.urlContainer}>
          <TextInput
            placeholder="Image URL"
            placeholderTextColor="#888"
            value={url}
            onChangeText={(text) => handleImageUrlChange(text, index)}
            style={styles.input}
          />
          <TouchableOpacity style={styles.removeButton} onPress={() => removeImageUrl(index)}>
            <Text style={styles.removeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity style={styles.addButton} onPress={addImageUrl}>
        <Text style={styles.addButtonText}>+ Add Image URL</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Video URLs:</Text>
      {videoUrls.map((url, index) => (
        <View key={index} style={styles.urlContainer}>
          <TextInput
            placeholder="Video URL"
            placeholderTextColor="#888"
            value={url}
            onChangeText={(text) => handleVideoUrlChange(text, index)}
            style={styles.input}
          />
          <TouchableOpacity style={styles.removeButton} onPress={() => removeVideoUrl(index)}>
            <Text style={styles.removeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity style={styles.addButton} onPress={addVideoUrl}>
        <Text style={styles.addButtonText}>+ Add Video URL</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(handleCreateTask)}>
        <Text style={styles.submitButtonText}>Create Task</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#121212", // Black background
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: "#1e1e1e", // Dark grey input background
    borderRadius: 8,
    paddingHorizontal: 15,
    color: "#ffffff", // White text
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  label: {
    fontSize: 18,
    color: "#ffffff",
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
  },
  urlContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e1e1e",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  removeButton: {
    marginLeft: 10,
    backgroundColor: "transparent", // Red button
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  removeButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#333",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CreateTaskScreen;
