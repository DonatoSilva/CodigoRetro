import { BrowserRouter, Routes, Route } from "react-router"
import App from '../moduls/App/App.jsx'

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<App />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter