import {Route, Routes} from "react-router-dom";
import MainPage from "./pages/MainPage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import RootLayout from "./pages/Layout.tsx";
import LoginPage from "./pages/auth/LoginPage.tsx";
import RegisterPage from "./pages/auth/RegisterPage.tsx";
import UserPage from "./pages/user/UserPage.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";

function App() {

  return (
    <Routes>
      <Route path="/" element={<RootLayout/>}>
        <Route index element={<MainPage/>}/>
        <Route path={'/login'} element={<LoginPage/>}/>
        <Route path={'/register'} element={<RegisterPage/>}/>
        <Route path={'/user/:user_login'} element={
          <ProtectedRoute>
            <UserPage/>
          </ProtectedRoute>
        }/>
        <Route path="*" element={<NotFoundPage/>}/>
      </Route>
    </Routes>
  )
}

export default App;
