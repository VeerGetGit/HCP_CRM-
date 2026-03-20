import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  form: {
    hcp: "",
    interactionType: "Meeting",
    summary: "",
    topics: "",
    sentiment: "Neutral",
    followup: "",
    date: "",
    time: "",
    attendees: "",
    outcomes: "",
  },
  suggestedFollowups: [],
  messages: [],
  loading: false,
  error: null,
};

const slice = createSlice({
  name: "interaction",
  initialState,
  reducers: {

    //  AI fills form — only overwrites fields that AI actually returned
    fillForm: (state, action) => {
      const data = action.payload || {};

      if (data.suggested_followups && Array.isArray(data.suggested_followups)) {
        state.suggestedFollowups = data.suggested_followups;
      }

      // Only update a field if AI explicitly returned it (not null/undefined/empty)
      if (data.hcp_name)         state.form.hcp             = data.hcp_name;
      if (data.hcp)              state.form.hcp             = data.hcp;
      if (data.summary)          state.form.summary         = data.summary;
      if (data.topics)           state.form.topics          = data.topics;
      else if (data.summary)     state.form.topics          = data.summary;
      if (data.sentiment)        state.form.sentiment       = data.sentiment;
      if (data.follow_up)        state.form.followup        = data.follow_up;
      if (data.date)             state.form.date            = data.date;
      if (data.time)             state.form.time            = data.time;
      if (data.attendees)        state.form.attendees       = data.attendees;
      if (data.outcomes)         state.form.outcomes        = data.outcomes;
      if (data.interactionType)  state.form.interactionType = data.interactionType;

      // Map meeting type keywords from AI
      if (data.interaction_type) {
        const typeMap = {
          meeting: "Meeting", call: "Call",
          email: "Email", conference: "Conference",
        };
        const normalized = data.interaction_type.toLowerCase();
        state.form.interactionType =
          Object.entries(typeMap).find(([k]) => normalized.includes(k))?.[1]
          || "Meeting";
      }
    },

    //  User manually edits ONE field — only that field changes, nothing else
    patchForm: (state, action) => {
      const { name, value } = action.payload;
      state.form[name] = value;
    },

    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    clearForm: (state) => {
      state.form = initialState.form;
      state.suggestedFollowups = [];
      state.messages = [];
    },
  },
});

export const {
  fillForm,
  patchForm,
  addMessage,
  setLoading,
  setError,
  clearForm,
} = slice.actions;

export default slice.reducer;