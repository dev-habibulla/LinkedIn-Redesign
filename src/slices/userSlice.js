import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'loginUser',
    initialState: {
        value: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
    },
    reducers: {
        logedUser: (state, action) => {
            // console.log(action.payload);
            state.value = action.payload
        },

    },
})

export const { logedUser } = userSlice.actions

export default userSlice.reducer