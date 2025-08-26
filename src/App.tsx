import {Navigate, Route, Routes} from "react-router-dom";
import MainPage from "./pages/MainPage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import RootLayout from "./pages/Layout.tsx";
import LoginPage from "./pages/auth/LoginPage.tsx";
import RegisterPage from "./pages/auth/RegisterPage.tsx";
import UserPage from "./pages/user/UserPage.tsx";
import UserRoute from "./pages/Routes/UserRoute.tsx";
import GroupPage from "./pages/group/GroupPage.tsx";
import AddToGroupByLink from "./pages/group/AddToGroupByLink.tsx";
import AllCoursesPage from "./pages/course/AllCoursesPage.tsx";
import CoursePage from "./pages/course/CoursePage.tsx";
import AllUsersPage from "./pages/user/AllUsersPage.tsx";
import RegisterNewUserPage from "./pages/user/RegisterNewUserPage.tsx";
import CreateGroupPage from "./pages/group/CreateGroupPage.tsx";
import AllGroupsPage from "./pages/group/AllGroupsPage.tsx";
import CourseNotFoundPage from "./pages/course/CourseNotFoundPage.tsx";
import CreateCoursePage from "./pages/course/CreateCoursePage.tsx";
import AdminRoute from "./pages/Routes/AdminRoute.tsx";
import TeacherRoute from "./pages/Routes/TeacherRoute.tsx";
import CourseEditPage from "./pages/course/CourseEditPage.tsx";

function App() {

  return (
    <Routes>
      <Route path="/" element={<RootLayout/>}>
        <Route index element={<MainPage/>}/>
        <Route path={'/login'} element={<LoginPage/>}/>
        <Route path={'/register'} element={<RegisterPage/>}/>
        <Route path={'/user/'}>
          <Route index element={
            <AdminRoute>
              <AllUsersPage/>
            </AdminRoute>
          }/>
          <Route path={':user_login'} element={
            <UserRoute>
              <UserPage/>
            </UserRoute>
          }/>
          <Route path={'new'} element={
            <AdminRoute>
              <RegisterNewUserPage/>
            </AdminRoute>
          }/>
          <Route path={'add'} element={<Navigate to={'new'} replace/>}/>
        </Route>
        <Route path={'/group/'}>
          <Route index element={
            <AdminRoute>
              <AllGroupsPage/>
            </AdminRoute>
          }/>
          <Route path={'/group/:group_id'} element={
            <UserRoute>
              <GroupPage/>
            </UserRoute>
          }/>
          <Route path={'new'} element={
            <AdminRoute>
              <CreateGroupPage/>
            </AdminRoute>
          }/>
          <Route path={'add'} element={<Navigate to={'new'} replace/>}/>
          <Route path={'create'} element={<Navigate to={'new'} replace/>}/>
          <Route path={'add_to/:group_id'} element={<AddToGroupByLink/>}/>
        </Route>
        <Route path={'/course/'}>
          <Route index element={
            <UserRoute>
              <AllCoursesPage/>
            </UserRoute>
          }/>
          <Route path={":course_id"} element={
            <UserRoute>
              <CoursePage/>
            </UserRoute>
          }/>
          <Route path={":course_id/edit"} element={
            <TeacherRoute>
              <CourseEditPage/>
            </TeacherRoute>
          }/>
          <Route path={'new'} element={
            <TeacherRoute>
              <CreateCoursePage/>
            </TeacherRoute>
          }/>
          <Route path={'not_found'} element={<CourseNotFoundPage/>}/>
          <Route path={'add'} element={<Navigate to={'new'} replace/>}/>
          <Route path={'create'} element={<Navigate to={'new'} replace/>}/>
          <Route path={'*'} element={<CourseNotFoundPage/>}/>
        </Route>
        <Route path={"add_to_group/:group_id"} element={<AddToGroupByLink/>}/>
        <Route path={"users/"} element={<Navigate to={'/user/'} replace/>}/>
        <Route path={"groups/"} element={<Navigate to={'/group/'} replace/>}/>
        <Route path={"courses/"} element={<Navigate to={'/course/'} replace/>}/>
        <Route path={"*"} element={<NotFoundPage/>}/>
      </Route>
    </Routes>
  )
}

export default App;
