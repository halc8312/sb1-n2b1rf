import { v4 as uuidv4 } from 'uuid'

export const DIFFICULTIES = ['低', '低～中', '中', '中～高', '高', '非常に高'] as const

export type Difficulty = typeof DIFFICULTIES[number]

export interface Tool {
  id: string
  name: string
  description: string
  difficulty: Difficulty
  category: string
  status: string
}

export const difficultyColor: Record<Difficulty, string> = {
  '低': 'bg-green-500',
  '低～中': 'bg-green-300',
  '中': 'bg-yellow-500',
  '中～高': 'bg-orange-500',
  '高': 'bg-red-500',
  '非常に高': 'bg-red-700'
}

// ローカルストレージからツールデータを取得
const getToolsFromStorage = (): Tool[] => {
  const storedTools = localStorage.getItem('tools')
  return storedTools ? JSON.parse(storedTools) : []
}

// ローカルストレージにツールデータを保存
const saveToolsToStorage = (tools: Tool[]) => {
  localStorage.setItem('tools', JSON.stringify(tools))
}

export const fetchTools = (): Promise<Tool[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const tools = getToolsFromStorage()
      resolve(tools)
    }, 500)
  })
}

export const fetchTool = (id: string): Promise<Tool> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const tools = getToolsFromStorage()
      const tool = tools.find(t => t.id === id)
      if (tool) {
        resolve(tool)
      } else {
        reject(new Error('Tool not found'))
      }
    }, 500)
  })
}

export const addTool = (newTool: Omit<Tool, 'id'>): Promise<Tool> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const tools = getToolsFromStorage()
      const toolWithId: Tool = { ...newTool, id: uuidv4() }
      tools.push(toolWithId)
      saveToolsToStorage(tools)
      resolve(toolWithId)
    }, 500)
  })
}

export const updateTool = (updatedTool: Tool): Promise<Tool> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const tools = getToolsFromStorage()
      const index = tools.findIndex(t => t.id === updatedTool.id)
      if (index !== -1) {
        tools[index] = updatedTool
        saveToolsToStorage(tools)
        resolve(updatedTool)
      } else {
        reject(new Error('Tool not found'))
      }
    }, 500)
  })
}

export const removeTool = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const tools = getToolsFromStorage()
      const index = tools.findIndex(t => t.id === id)
      if (index !== -1) {
        tools.splice(index, 1)
        saveToolsToStorage(tools)
        resolve()
      } else {
        reject(new Error('Tool not found'))
      }
    }, 500)
  })
}