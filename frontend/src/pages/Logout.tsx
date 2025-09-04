import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Logout: React.FC = () => {
  const navigate = useNavigate();
  const { clearAuth } = useAuth();

  useEffect(() => {
    clearAuth();
    navigate("/");
  }, [clearAuth, navigate]);

  return <></>;
};

export default Logout;
