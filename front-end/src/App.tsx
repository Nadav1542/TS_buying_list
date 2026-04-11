import './App.css'
import  {Routes, Route} from 'react-router-dom'
import ShoppingListPage from "./pages/ShoppingListPage";

function App() {
  return (
    <div className="app-shell">
      <main className="app-content">
        <Routes>
          <Route path="/" element={<ShoppingListPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App


