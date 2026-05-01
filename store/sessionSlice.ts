import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export type SessionState = {
  unlocked: boolean;
  bootstrapDone: boolean;
};

const initialState: SessionState = {
  unlocked: false,
  bootstrapDone: false,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setUnlocked(state, action: PayloadAction<boolean>) {
      state.unlocked = action.payload;
    },
    setBootstrapDone(state, action: PayloadAction<boolean>) {
      state.bootstrapDone = action.payload;
    },
    resetSession(state) {
      state.unlocked = false;
    },
  },
});

export const { setUnlocked, setBootstrapDone, resetSession } =
  sessionSlice.actions;

export default sessionSlice.reducer;
