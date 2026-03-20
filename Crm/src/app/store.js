import { configureStore } from "@reduxjs/toolkit";
import interactionReducer from "../features/interactions/interactionSlice";

const store = configureStore({
  reducer: {
    interaction: interactionReducer
  }
});

export { store };