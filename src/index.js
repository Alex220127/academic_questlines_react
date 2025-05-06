import {
  createBrowserRouter,
  RouterProvider,
} from "react-router"

import React from "react"
import ReactDOM from "react-dom/client"

import routes from './routes/index'

const router = createBrowserRouter(routes)

const root = document.getElementById("root")

ReactDOM.createRoot(root).render(
  <RouterProvider router={router} />
)
