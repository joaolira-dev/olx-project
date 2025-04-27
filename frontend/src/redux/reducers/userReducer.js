import { createSlice } from "@reduxjs/toolkit"

export const slice = createSlice({
   name: "userSlice",
   initialState: {
      email: ""
   },
   reducers: {
      setEmail: (state, action) => {
         state.email = action.payload
      }
   }
})

export const {setEmail} = slice.actions;
export default slice.reducer;