import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import Login from './components/Login';
import useStore from './store/useStore';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currentUser = useStore((state) => state.currentUser);
  return currentUser ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <>
      <Router>
        <div className="h-screen flex">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <div className="flex h-full w-full">
                    <div className="w-80 h-full">
                      <ChatList />
                    </div>
                    <div className="flex-1">
                      <ChatWindow />
                    </div>
                  </div>
                </PrivateRoute>
              }
            />
            <Route
              path="/chat/:chatId"
              element={
                <PrivateRoute>
                  <div className="flex h-full w-full">
                    <div className="w-80 h-full">
                      <ChatList />
                    </div>
                    <div className="flex-1">
                      <ChatWindow />
                    </div>
                  </div>
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </Router>
      <Toaster position="top-right" />
    </>
  );
}

export default App;