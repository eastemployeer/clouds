import React, { useEffect } from 'react';
import { Route, Routes } from "react-router";
import { ToastContainer } from "react-toastify";
import NotFoundPage from "./views/NotFoundPage";
import LoginPage from './views/LoginPage';
import RegisterPage from './views/RegisterPage';
import TicTacToePage from './views/TicTacToePage';
import LeaderBoardPage from './views/LeaderBoardPage';
import './App.css'
import { LocalUserProvider } from './hooks/useLocalUser';
import Layout from './components/Layout';

// eslint-disable-next-line prefer-arrow-callback
export default function App() {  
  return (
    <LocalUserProvider>
      <Routes>
        <Route path="/tic" element={<Layout><TicTacToePage /></Layout>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/leaderboard" element={<Layout><LeaderBoardPage /></Layout>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ToastContainer position="bottom-right" newestOnTop />
    </LocalUserProvider>
  );
}
