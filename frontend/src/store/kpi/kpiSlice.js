import { createSlice } from "@reduxjs/toolkit";

export const defaultKpis = {
  callsOffered: {
    value: 1482,
    target: 1300,
    change: "+12.5%",
  },
  callsAnswered: {
    value: 1314,
    target: 1200,
    change: "+8.2%",
  },
  answerRate: {
    value: 88.6,
    target: 85,
    change: "+2.4%",
  },
  slaCompliance: {
    value: 99.4,
    target: 95,
    change: "EXCELLENT",
  },
};

const loadFromStorage = () => {
  try {
    const saved = localStorage.getItem("kpiData");
    return saved ? JSON.parse(saved) : defaultKpis;
  } catch {
    return defaultKpis;
  }
};

const saveToStorage = (plainState) => {
  try {
    localStorage.setItem("kpiData", JSON.stringify(plainState));
  } catch {}
};

// Returns true if actual value meets or exceeds the target
export const isTargetAchieved = (value, target) => {
  return Number(value) >= Number(target);
};

const kpiSlice = createSlice({
  name: "kpi",
  initialState: loadFromStorage(),
  reducers: {
    // Save all KPIs at once - return new state to guarantee Redux detects the change
    setAllKpis: (_, action) => {
      const newState = action.payload;
      saveToStorage(newState);
      return newState;
    },
    resetKpis: () => {
      saveToStorage(defaultKpis);
      return defaultKpis;
    },
  },
});

export const { setAllKpis, resetKpis } = kpiSlice.actions;
export const kpiReducer = kpiSlice.reducer;
