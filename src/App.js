import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Suspense, lazy, useState } from "react";
const Signin = lazy(() =>import('./components/auth/Signin'));
const NotFound = lazy(()=>import("./components/errors/NotFound"));
const Home = lazy(()=>import('./components/Home'));
const SignUp = lazy(()=>import('./components/auth/Signup'));
const Layout = lazy(()=>import('./components/common/Layout'));
const Profile = lazy(()=>import('./components/auth/Profile'));
const Logout = lazy(()=>import('./components/auth/Logout'));
const DefaultLayout = lazy(()=>import('./components/common/DefaultLayout'));
const CreateTask = lazy(()=>import("./components/CreateTask"));
const CreateProject = lazy(()=>import('./components/CreateProject'));
const ForgotPassword = lazy(()=>import('./components/auth/ForgotPassword'));
const ResetPassword = lazy(()=>import('./components/auth/ResetPassword'));
const KanbanTaskList = lazy(()=>import('./components/KanbanTaskList'))
const ProjectList = lazy(()=>import('./components/ProjectsList'));
const TasksList = lazy(()=>import('./components/TasksList'));
const Messages = lazy(()=>import("./components/Messages"));
const TaskDetails = lazy(()=>import("./components/task/TaskDetails"));

function App() {
  const [role, setRole] = useState('');
  return (
    <>
      <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>

          <Route path="/" element={<Layout props={{ role: role }} setRole={setRole} />}>
            <Route index path="signin" element={<Signin />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword/>} />
            <Route path="logout" element={<Logout />} />
          </Route>

          <Route path="/user" element={<Layout props={{ role: "dashboard" }} setRole={setRole}  />}>
            <Route index path="project-dashboard" element={<Home />} />
            <Route path="kanban" element={<KanbanTaskList />} />
            <Route path="profile" element={<Profile />} />
            <Route path="create-task" element={<CreateTask />} />
            <Route path="projects" element={<ProjectList/>} />
            <Route path="create-project" element={<CreateProject/>} />
            <Route path="modify-project/:project_id" element={<CreateProject/>} />
            <Route path="tasks" element={<TasksList/>} />
            <Route path="task-view" element={<TaskDetails/>}/>
            <Route path="messages" element={<Messages/>}/>
          </Route>
          <Route path="*" element={<NotFound/>}/>
        </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;
