import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FloatingAction } from "react-native-floating-action";
import dayjs from "dayjs";
import { tasksData } from "../../constants/TaskData";
import { useFocusEffect } from "@react-navigation/native";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const DAYS_IN_WEEK = 7;

const TaskListScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
  const today = dayjs();
  const flatListRef = useRef(null);

  const onSelectDate = (val) => {
    setSelectedDate(val);
  };

  const getWeekDates = (offset) => {
    const startOfWeek = today.add(offset * DAYS_IN_WEEK, "day").startOf("week");
    return Array.from({ length: DAYS_IN_WEEK }, (_, i) => startOfWeek.add(i, "day"));
  };

  const renderWeek = ({ item: weekDates }) => {
    const firstDate = weekDates[0];
    return (
      <View style={styles.weekContainer}>
        <Text style={styles.monthYearText}>{firstDate.format("MMMM YYYY")}</Text>
        <View style={styles.weekRow}>
          {weekDates.map((date) => (
            <TouchableOpacity
              key={date.format("YYYY-MM-DD")}
              onPress={() => onSelectDate(date.format("YYYY-MM-DD"))}
              style={[
                styles.dateItem,
                selectedDate === date.format("YYYY-MM-DD") && styles.selectedDate,
              ]}
            >
              <Text style={styles.dateText}>{date.format("ddd")}</Text>
              <Text style={styles.dateNumber}>{date.format("DD")}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  useEffect(() => {
    const updateTasksInStorage = async () => {
      try {
        const existingTasks = await AsyncStorage.getItem("tasks");
        const tasks = existingTasks ? JSON.parse(existingTasks) : [];
        const existingTaskIds = new Set(tasks.map((task) => task.id));
        const newTasks = tasksData.filter((task) => !existingTaskIds.has(task.id));
        const updatedTasks = [...tasks, ...newTasks];
        await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
        // console.log("Tasks updated successfully!");
      } catch (error) {
        console.error("Error updating tasks:", error);
      }
    };
    updateTasksInStorage();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const loadTasks = async () => {
        const storedTasks = await AsyncStorage.getItem("tasks");
        if (storedTasks) {
          setTasks(JSON.parse(storedTasks));
        }
      };
      loadTasks();
    }, []),
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate("TaskDetail", { task: item })}>
      <View style={styles.taskItem}>
        <Text style={styles.taskName}>{item.name}</Text>
        <Text style={styles.taskDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  const filteredTasks = tasks.filter((task) => {
    const taskDate = new Date(task.date).toISOString().split("T")[0];
    return taskDate === selectedDate;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ height: 110 }}>
        <FlatList
          ref={flatListRef}
          data={[...Array(100)].map((_, i) => getWeekDates(i - 50))}
          horizontal
          pagingEnabled
          initialScrollIndex={50}
          getItemLayout={(data, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderWeek}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <FlatList
      style={{
        height: SCREEN_HEIGHT - 350,
      }}
        data={filteredTasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListHeaderComponent={
          <Text style={styles.selectedDateHeader}>Tasks for {selectedDate}</Text>
        }
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <FloatingAction
        actions={[{ text: "Add Task", icon: {uri: 'https://img.icons8.com/?size=100&id=43850&format=png&color=FFFFFF'}, name: "bt_add", position: 1 }]}
        onPressItem={() => navigation.navigate("CreateTask")}
        color="#007bff"
        position="right"
        style={styles.floatingAction}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  taskItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#333",
    borderRadius: 8,
    marginHorizontal: 10,
    marginVertical: 5,
  },
  taskName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
  },
  taskDescription: {
    color: "#ffffff",
  },
  weekContainer: {
    width: SCREEN_WIDTH,
    alignItems: "center",
    paddingVertical: 10,
  },
  monthYearText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 5,
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  dateItem: {
    padding: 10,
    margin: 5,
    borderRadius: 10,
    alignItems: "center",
  },
  selectedDate: {
    backgroundColor: "blue",
    borderRadius: 10,
  },
  dateText: {
    fontSize: 14,
    color: "#ffffff",
  },
  dateNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  floatingAction: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
});

export default TaskListScreen;
