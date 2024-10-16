import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import AIToolsShowcase from './components/AIToolsShowcase'
import ToolDetail from './components/ToolDetail'
import AddTool from './components/AddTool'
import EditTool from './components/EditTool'

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <h1 className="text-3xl font-bold text-center my-4">AIツールショーケース</h1>
        <Routes>
          <Route path="/" element={<AIToolsShowcase />} />
          <Route path="/tool/:id" element={<ToolDetail />} />
          <Route path="/add" element={<AddTool />} />
          <Route path="/edit/:id" element={<EditTool />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App