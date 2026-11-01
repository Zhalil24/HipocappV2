import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: JSX.Element;
  allowedRoles?: string[];
}
const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!user || !user.accessToken) {
    return <Navigate to="/login" replace />;
  }
  if (
    allowedRoles &&
    !allowedRoles.some(role => role.toLowerCase() === user.roleDTO?.name.toLowerCase())
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;