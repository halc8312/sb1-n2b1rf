import { Tool } from '../store/toolsSlice'

const DIFFICULTIES = ['低', '低～中', '中', '中～高', '高', '非常に高'] as const

export const fetchTools = (): Promise<Tool[]> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const toolsData: Tool[] = [
          // ... (既存のツールデータをここに配置)
        ]
        resolve(toolsData)
      } catch (error) {
        reject(error)
      }
    }, 1000)
  })
}

export const addToolApi = (tool: Omit<Tool, 'id'>): Promise<Tool> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newTool: Tool = {
        ...tool,
        id: Math.random().toString(36).substr(2, 9),
      }
      resolve(newTool)
    }, 500)
  })
}

export const updateToolApi = (tool: Tool): Promise<Tool> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(tool)
    }, 500)
  })
}

export const removeToolApi = (id: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 500)
  })
}