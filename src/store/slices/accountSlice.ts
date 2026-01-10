import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAccountId } from "@/utils/accountStorage";

export interface AccountState {
  accountId: string | null;
}

const initialState: AccountState = {
  accountId: getAccountId(),
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setAccountId: (state, action: PayloadAction<string | null>) => {
      state.accountId = action.payload;
    },
  },
});

export const { setAccountId } = accountSlice.actions;

export default accountSlice.reducer;
