import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter} from 'react-router-dom'
import DashboardPage from './routes/dashboardPage/DashboardPage'
import ChatPage from './routes/chatPage/ChatPage'
import Homepage from "./routes/homepage/Homepage"
import RootLayout from './layouts/rootLayout/RootLayout'
import DashboardLayout from "./layouts/dashboardLayout/dashboardLayout"
import SignInPage from "./routes/signinPage/signInPage"
import SignUpPage from "./routes/signupPage/signUpPage"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; // Optional DevTools
import App from './App'; // Your main App component



const router = createBrowserRouter([
  {
   element: <RootLayout/>,
   children: [
    {
      path:"/",
      element: <Homepage />,
    },
    {
      path:"/sign-in/*",
      element: <SignInPage />,
    },
    {
      path:"/sign-up/*",
      element: <SignUpPage />,
    },
    {
      element: <DashboardLayout />,
      children: [
        {
          path:"/dashboard",
          element: <DashboardPage />
        },
        {
          path:"/dashboard/chats/:id",
          element: <ChatPage />,
        }
      ]
    }
   ]
  }
]);

const queryClient = new QueryClient();


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);