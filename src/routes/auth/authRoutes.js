import Home from "../../pages/Start"
import Login from "../../pages/Login"
import Signup from "../../pages/Signup"

const routes = [
  {
    path: "/",
    Component: Home
  },
  {
    path: '/login',
    Component: Login
  },
  {
    path: '/signup',
    Component: Signup
  }
]

export default routes
