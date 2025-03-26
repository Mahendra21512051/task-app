
import { createSlice } from "@reduxjs/toolkit";

// Define initial state for tasks
const initialState = {
  tasks: [],
  taskToEdit: null, // Stores the task being edited
};

// Create the taskSlice
const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    // Set the tasks from API (ensure it's sorted correctly)
    setTasks: (state, action) => {
      //console.log("setTasks [action.payload]",action.payload)
      state.tasks = action.payload; // Reverse if API sends latest last
      console.log("setTasks [state.tasks]",state.tasks)
    },

    // Add a new task at the top
    addTask: (state, action) => {
      state.tasks = [action.payload, ...state.tasks]; // Ensure new task comes first
    },

    // Set the task to be edited
    setTaskToEdit: (state, action) => {
      state.taskToEdit = action.payload;
    },

    // Update a specific task
    updateTask: (state, action) => {
      state.tasks = state.tasks.map((task) =>
        task._id === action.payload._id ? action.payload : task
      );
    },

    // Delete a task by ID
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter((task) => task._id !== action.payload);
    },
  },
});

// Export actions
export const { setTasks, setTaskToEdit, updateTask, deleteTask, addTask } =
  taskSlice.actions;

// Export reducer
export default taskSlice.reducer;
