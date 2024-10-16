import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Tool, fetchTool } from '../utils/toolUtils'
import { Loader } from 'lucide-react'

const ToolDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
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
      <Link to="/" className="text-blue-500 hover:text-blue-700 mb-4 inline-block">&larr; 一覧に戻る</Link>
      <h1 className="text-3xl font-bold mb-4">{tool.name}</h1>
      <p className="text-gray-600 mb-4">{tool.description}</p>
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h2 className="text-xl font-semibold mb-2">詳細情報</h2>
        <p><strong>カテゴリー:</strong> {tool.category}</p>
        <p><strong>構築難易度:</strong> {tool.difficulty}</p>
        <p><strong>開発状況:</strong> {tool.status}</p>
      </div>
      <Link to={`/edit/${tool.id}`} className="bg-blue-500 text-white rounded p-2 inline-block">編集</Link>
    </div>
  )
}

export default ToolDetail