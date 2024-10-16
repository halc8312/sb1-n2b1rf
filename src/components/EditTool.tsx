import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Tool, DIFFICULTIES, fetchTool, updateTool } from '../utils/toolUtils'
import { Loader } from 'lucide-react'

const EditTool: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [tool, setTool] = useState<Tool | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTool = async () => {
      if (!id) return
      setIsLoading(true)
      try {
        const fetchedTool = await fetchTool(id)
        setTool(fetchedTool)
        setError(null)
      } catch (error) {
        console.error('Failed to load tool:', error)
        setError('ツールの読み込みに失敗しました。')
      } finally {
        setIsLoading(false)
      }
    }
    loadTool()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tool) return
    try {
      await updateTool(tool)
      navigate(`/tool/${tool.id}`)
    } catch (error) {
      console.error('Failed to update tool:', error)
      setError('ツールの更新に失敗しました。')
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin text-gray-500" size={48} />
      </div>
    )
  }

  if (error || !tool) {
    return <div className="text-center mt-8 text-red-500">{error || 'ツールが見つかりません。'}</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">ツール編集: {tool.name}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">名前</label>
          <input
            type="text"
            id="name"
            value={tool.name}
            onChange={(e) => setTool({ ...tool, name: e.target.value })}
            required
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label htmlFor="description" className="block mb-1">説明</label>
          <textarea
            id="description"
            value={tool.description}
            onChange={(e) => setTool({ ...tool, description: e.target.value })}
            required
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label htmlFor="category" className="block mb-1">カテゴリー</label>
          <input
            type="text"
            id="category"
            value={tool.category}
            onChange={(e) => setTool({ ...tool, category: e.target.value })}
            required
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label htmlFor="difficulty" className="block mb-1">構築難易度</label>
          <select
            id="difficulty"
            value={tool.difficulty}
            onChange={(e) => setTool({ ...tool, difficulty: e.target.value as Tool['difficulty'] })}
            required
            className="w-full border rounded p-2"
          >
            {DIFFICULTIES.map(diff => (
              <option key={diff} value={diff}>{diff}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="status" className="block mb-1">開発状況</label>
          <input
            type="text"
            id="status"
            value={tool.status}
            onChange={(e) => setTool({ ...tool, status: e.target.value })}
            required
            className="w-full border rounded p-2"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white rounded p-2">更新</button>
      </form>
    </div>
  )
}

export default EditTool