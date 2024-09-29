// export the useAuth hook
import {useContext} from "react";
import {AuthContext} from "../hooks/AuthProvider.tsx";

export const useAuth = () => {
  return useContext(AuthContext);
};