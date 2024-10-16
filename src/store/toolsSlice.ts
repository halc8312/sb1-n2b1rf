import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Tool } from '../utils/toolUtils'

interface ToolsState {
  items: Tool[]
}

const initialState: ToolsState = {
  items: [],
}

export const toolsSlice = createSlice({
  name: 'tools',
  initialState,
  reducers: {
    setTools: (state, action: PayloadAction<Tool[]>) => {
      state.items = action.payload
    },
    addTool: (state, action: PayloadAction<Tool>) => {
      state.items.push(action.payload)
    },
    updateTool: (state, action: PayloadAction<Tool>) => {
      const index = state.items.findIndex(tool => tool.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = action.payload
      }
    },
    removeTool: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(tool => tool.id !== action.payload)
    },
  },
})

export const { setTools, addTool, updateTool, removeTool } = toolsSlice.actions

export default toolsSlice.reducer