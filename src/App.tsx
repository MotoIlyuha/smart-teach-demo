import {Route, Routes} from "react-router-dom";
import MainPage from "./pages/MainPage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import RootLayout from "./pages/Layout.tsx";
import LoginPage from "./pages/auth/LoginPage.tsx";
import RegisterPage from "./pages/auth/RegisterPage.tsx";
import UserPage from "./pages/user/UserPage.tsx";
import ProtectedRoute from "./pages/ProtectedRoute.tsx";
import GroupPage from "./pages/group/GroupPage.tsx";
import AddToGroupByLink from "./pages/group/AddToGroupByLink.tsx";

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
        <Route path={'/group/:group_id'} element={
          <ProtectedRoute>
            <GroupPage/>
          </ProtectedRoute>
        }/>
        <Route path={'/add_to_group/:group_id'} element={<AddToGroupByLink/>}/>
        <Route path="*" element={<NotFoundPage/>}/>
      </Route>
    </Routes>
  )
}

export default App;
