import React, { useState, useMemo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ChevronDown, ChevronUp, Search, Star, Loader, Plus } from 'lucide-react'
import { Tool, DIFFICULTIES, difficultyColor, fetchTools } from '../utils/toolUtils'
import { RootState } from '../store/store'
import { setTools } from '../store/toolsSlice'

type Difficulty = typeof DIFFICULTIES[number]

export default function AIToolsShowcase() {
  const dispatch = useDispatch()
  const tools = useSelector((state: RootState) => state.tools.items)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'category' | 'difficulty'>('category')
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | 'all'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    const loadTools = async () => {
      setIsLoading(true)
      try {
        const fetchedTools = await fetchTools()
        dispatch(setTools(fetchedTools))
        setError(null)
      } catch (error) {
        console.error('Failed to load tools:', error)
        setError('ツールの読み込みに失敗しました。再度お試しください。')
      } finally {
        setIsLoading(false)
      }
    }
    loadTools()
  }, [dispatch])

  const categories = useMemo(() => Array.from(new Set(tools.map(tool => tool.category))), [tools])

  const sortedAndFilteredTools = useMemo(() => {
    let filtered = tools.filter(tool =>
      (filterDifficulty === 'all' || tool.difficulty === filterDifficulty) &&
      (tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    if (sortBy === 'difficulty') {
      filtered.sort((a, b) => DIFFICULTIES.indexOf(a.difficulty) - DIFFICULTIES.indexOf(b.difficulty))
    } else {
      filtered.sort((a, b) => a.category.localeCompare(b.category))
    }

    return filtered
  }, [tools, sortBy, filterDifficulty, searchTerm])

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    )
  }

  const toggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin text-gray-500" size={48} />
      </div>
    )
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">AIツール一覧</h1>
      <div className="mb-4 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center">
          <label htmlFor="sort" className="mr-2">ソート:</label>
          <select
            id="sort"
            className="border rounded p-2"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'category' | 'difficulty')}
          >
            <option value="category">カテゴリー</option>
            <option value="difficulty">難易度</option>
          </select>
        </div>
        <div className="flex items-center">
          <label htmlFor="filter" className="mr-2">難易度フィルター:</label>
          <select
            id="filter"
            className="border rounded p-2"
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value as Difficulty | 'all')}
          >
            <option value="all">全て</option>
            {DIFFICULTIES.map(diff => (
              <option key={diff} value={diff}>{diff}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center">
          <label htmlFor="search" className="sr-only">検索:</label>
          <div className="relative">
            <input
              id="search"
              type="text"
              placeholder="ツールを検索..."
              className="border rounded p-2 pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>
      </div>

      {sortedAndFilteredTools.length === 0 ? (
        <p className="text-center text-gray-500 mt-8">該当するツールが見つかりません。</p>
      ) : (
        categories.map(category => {
          const categoryTools = sortedAndFilteredTools.filter(tool => tool.category === category)
          if (categoryTools.length === 0) return null
          return (
            <div key={category} className="mb-6">
              <h2
                className="text-2xl font-semibold mb-2 cursor-pointer flex items-center justify-between"
                onClick={() => toggleCategory(category)}
              >
                {category}
                {expandedCategories.includes(category) ? <ChevronUp className="ml-2" /> : <ChevronDown className="ml-2" />}
              </h2>
              {expandedCategories.includes(category) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryTools.map(tool => (
                    <ToolCard key={tool.id} tool={tool} isFavorite={favorites.includes(tool.id)} toggleFavorite={toggleFavorite} />
                  ))}
                </div>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}

function ToolCard({
  tool,
  isFavorite,
  toggleFavorite
}: {
  tool: Tool
  isFavorite: boolean
  toggleFavorite: (id: string) => void
}) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{tool.name}</h3>
        <button
          onClick={() => toggleFavorite(tool.id)}
          className="text-yellow-500 focus:outline-none"
          aria-label={isFavorite ? 'お気に入りから削除' : 'お気に入りに追加'}
        >
          <Star fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>
      <p className="text-sm mb-2">{tool.description}</p>
      <div className="flex items-center">
        <span className="text-sm font-medium mr-2">構築難易度:</span>
        <span
          className={`text-xs font-semibold inline-block py-1 px-2 rounded text-white ${difficultyColor[tool.difficulty]}`}
        >
          {tool.difficulty}
        </span>
      </div>
    </div>
  )
}