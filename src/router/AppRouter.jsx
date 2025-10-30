import { BrowserRouter, Routes, Route } from "react-router"
import App from '../moduls/App/App.jsx'
import HomePage from '../moduls/Home/HomePage.jsx'

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<HomePage />} />
                <Route path="/play" element={<App />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter