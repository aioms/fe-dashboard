import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUserLogin } from "types";

interface LoginState {
    user: IUserLogin;
    error: string;
    success: boolean;
    isUserLogout: boolean;
}

const initialState: LoginState = {
    user: {
        id: "",
        username: "",
        fullname: "",
        role: "",
        storeCode: ""
    },
    error: "",
    success: false,
    isUserLogout: false
};

const loginSlice = createSlice({
    name: "Login",
    initialState,
    reducers: {
        loginSuccess(state: LoginState, action: PayloadAction<IUserLogin>) {
            state.user = action.payload;
            state.success = true;
        },
        loginError(state: LoginState, action: PayloadAction<string | any>) {
            state.error = action.payload;
            state.success = false;
        },
        logoutSuccess(state: LoginState, action: PayloadAction<boolean>) {
            state.isUserLogout = action.payload;
        },
        logoutError(state: LoginState, action: PayloadAction<string | any>) {
            state.error = action.payload;
            state.isUserLogout = action.payload;
        }
    },
});

export const { loginSuccess, loginError, logoutSuccess } = loginSlice.actions;
export default loginSlice.reducer;
