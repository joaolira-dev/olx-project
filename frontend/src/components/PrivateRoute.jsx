import { Navigate, Outlet } from "react-router-dom"
import { isLogged } from "../helpers/Authentication"

const PrivateRoute = () => {
  const logged = isLogged()

  return logged ? <Outlet /> : <Navigate to="/signin" />
}

export default PrivateRoute
