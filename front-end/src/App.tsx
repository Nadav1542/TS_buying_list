import './App.css'
import  {Routes, Route} from 'react-router-dom'
import ShoppingListPage from "./pages/ShoppingListPage";
import ShareListPage from "./pages/ShareListPage";

function App() {
  return (
    <div className="app-shell">
      <main className="app-content">
        <Routes>
          <Route path="/" element={<ShoppingListPage />} />
          <Route path="/share/:token" element={<ShareListPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App


