import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Account from "./pages/Account";
import Scheduler from "./pages/Scheduler";
import AIComposer from "./pages/AIComposer";
export default function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route element={<Layout/>}>
                    <Route path="/" element={<Sidebar/>} />
                    <Route path="/dashboard" element={<Dashboard/>} />
                    <Route path="/account" element={<Account/>} />
                    <Route path="/scheduler" element={<Scheduler/>} />
                    <Route path="/aicomposer" element={<AIComposer/>} />
                    </Route>
            </Routes>
        </>
    );
}   
