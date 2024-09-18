import {Route, Routes} from "react-router-dom";
import MainPage from "./pages/MainPage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import RootLayout from "./pages/Layout.tsx";

function App() {

  return (
    <Routes>
      <Route path="/" element={<RootLayout/>}>
        <Route index element={<MainPage/>}/>
        <Route path="*" element={<NotFoundPage/>}/>
      </Route>
    </Routes>
  )
}

export default App
