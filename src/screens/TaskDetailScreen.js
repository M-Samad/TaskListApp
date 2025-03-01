import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import WebView from 'react-native-webview';

const TaskDetailScreen = ({ route }) => {
  const { task } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{task.name}</Text>
      <Text style={styles.description}>{task.description}</Text>
      <Text style={styles.date}>{new Date(task.date).toLocaleDateString()}</Text>

      <Text style={styles.mediaHeader}>Images:</Text>
      <View style={styles.mediaContainer}>
        {task.images && task.images.length > 0 ? (
          task.images.map((uri, index) => (
            <Image key={index} source={{ uri }} style={styles.image} />
          ))
        ) : (
          <Text style={styles.noMediaText}>No images available</Text>
        )}
      </View>

      <Text style={styles.mediaHeader}>Videos:</Text>
      <View style={styles.mediaContainer}>
        {task.videos && task.videos.length > 0 ? (
          task.videos.map((uri, index) => (
            <View key={index} style={styles.videoContainer}>
            <WebView
              source={{ uri }}
              style={styles.video}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              allowsInlineMediaPlayback={true}
              mediaPlaybackRequiresUser Action={true}
              startInLoadingState={true}
            />
          </View>
          ))
        ) : (
          <Text style={styles.noMediaText}>No videos available</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  description: {
    fontSize: 18,
    color: '#fff',
    marginVertical: 10,
  },
  date: {
    fontSize: 16,
    color: '#aaa',
  },
  mediaHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 10,
  },
  mediaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  image: {
    width: '48%',
    height: 150,
    marginBottom: 10,
    borderRadius: 10,
  },
  videoContainer: {
    width: '100%',
    marginBottom: 10,
  },
  video: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  playPauseButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 5,
  },
  playPauseText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noMediaText: {
    color: '#fff',
    fontStyle: 'italic',
  },
});

export default TaskDetailScreen;