import { configureStore } from '@reduxjs/toolkit'

import  userSlice  from './slices/userSlice';
import activeChatReducer from './slices/activeChatSlice';

export default configureStore({
  reducer: {
    logedUser: userSlice,
    activeChat: activeChatReducer
  },
})

