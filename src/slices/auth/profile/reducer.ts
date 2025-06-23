import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUserLogin } from "types";

interface ProfileState {
    user: IUserLogin;
    error: string;
    success: boolean;
}

const initialState: ProfileState = {
    user: {
        id: "",
        username: "",
        fullname: "",
        role: "",
        storeCode: ""
    },
    error: "",
    success: false
};

const profileSlice = createSlice({
    name: "Profile",
    initialState,
    reducers: {
        profileSuccess(state: ProfileState, action: PayloadAction<IUserLogin>) {
            state.user = action.payload;
            state.success = true;
        },
        profileFailed(state: ProfileState, action: PayloadAction<string | any>) {
            state.error = action.payload;
            state.success = false;
        }
    }
})

export const { profileSuccess, profileFailed } = profileSlice.actions;
export default profileSlice.reducer;