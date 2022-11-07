import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/redux.hook";
import { doLogout } from "../redux";

const LogoutPage = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(doLogout());
  }, [dispatch]);

  return <Navigate to="/" />
};

export default LogoutPage;