import { Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

// Page imports
import AbstractPage from './pages/AbstractPage'
import CroquisPage from './pages/CroquisPage'
import CharacterPage from './pages/CharacterPage'
import EmoticonPage from './pages/EmoticonPage'
import PortraitPage from './pages/PortraitPage'
import LandscapePage from './pages/LandscapePage'
import ComicPage from './pages/ComicPage'

function App() {
  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-primary text-center mb-4">초등학생을 위한 그리기 웹앱</h1>
        <nav className="flex flex-wrap justify-center gap-3">
          <a href="/" className="btn-primary">홈</a>
          <a href="/abstract" className="btn-secondary">추상화</a>
          <a href="/croquis" className="btn-secondary">크로키</a>
          <a href="/character" className="btn-secondary">캐릭터</a>
          <a href="/emoticon" className="btn-secondary">이모티콘</a>
          <a href="/portrait" className="btn-secondary">인물화</a>
          <a href="/landscape" className="btn-secondary">풍경화</a>
          <a href="/comic" className="btn-secondary">6컷 만화</a>
        </nav>
      </header>

      <main>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <h2 className="text-3xl font-bold text-secondary mb-6">그리기 주제를 선택해주세요!</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { title: '추상화 그리기', path: '/abstract', color: 'bg-red-100' },
                    { title: '크로키 그리기', path: '/croquis', color: 'bg-blue-100' },
                    { title: '캐릭터 그리기', path: '/character', color: 'bg-green-100' },
                    { title: '카카오 이모티콘', path: '/emoticon', color: 'bg-yellow-100' },
                    { title: '인물화 그리기', path: '/portrait', color: 'bg-purple-100' },
                    { title: '풍경화 그리기', path: '/landscape', color: 'bg-indigo-100' },
                    { title: '6컷 만화 그리기', path: '/comic', color: 'bg-pink-100' },
                  ].map((item, index) => (
                    <a 
                      key={index} 
                      href={item.path} 
                      className={`${item.color} p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow`}
                    >
                      <h3 className="text-xl font-bold">{item.title}</h3>
                    </a>
                  ))}
                </div>
              </motion.div>
            } />
            <Route path="/abstract" element={<AbstractPage />} />
            <Route path="/croquis" element={<CroquisPage />} />
            <Route path="/character" element={<CharacterPage />} />
            <Route path="/emoticon" element={<EmoticonPage />} />
            <Route path="/portrait" element={<PortraitPage />} />
            <Route path="/landscape" element={<LandscapePage />} />
            <Route path="/comic" element={<ComicPage />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  )
}

export default App 