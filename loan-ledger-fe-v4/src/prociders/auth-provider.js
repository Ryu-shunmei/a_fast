"use client";
import {
  useEffect,
  useReducer,
  useCallback,
  useMemo,
  createContext,
} from "react";
import { jwtDecode } from "jwt-decode";
// utils
import myAxios from "@/utils/my-axios";

// ----------------------------------------------------------------------
export const AuthContext = createContext({});
// ----------------------------------------------------------------------

const initialState = {
  user: null,
};

const reducer = (state, action) => {
  if (action.type === "INITIAL") {
    return {
      user: action.payload.user,
    };
  }
  if (action.type === "LOGIN") {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === "SWITCH") {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === "LOGOUT") {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

export default function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        const user = jwtDecode(accessToken);
        dispatch({
          type: "INITIAL",
          payload: {
            user: user,
          },
        });
      }
    } catch (error) {
      console.error(error);
      window.location.href = "/authorization/login";
    }
  }, []);

  useEffect(() => {
    initialize();
  }, []);

  // LOGIN
  const login = useCallback(async (email, password) => {
    const data = {
      email,
      password,
    };

    const response = await myAxios.post("/token", data);
    localStorage.setItem("accessToken", response.data.access_token);
    const user = jwtDecode(response.data.access_token);

    console.log("login info", user);
    dispatch({
      type: "LOGIN",
      payload: {
        user: user,
      },
    });
  }, []);

  // SWITCH
  const switch_role = useCallback(async (user_id, role_id) => {
    const response = await myAxios.put(
      `/token?user_id=${user_id}&role_id=${role_id}`
    );
    localStorage.setItem("accessToken", response.data.access_token);
    const user = jwtDecode(response.data.access_token);

    console.log("switch role", user);

    dispatch({
      type: "SWITCH",
      payload: {
        user: user,
      },
    });
    window.location.href = "/dashboard/cases";
  }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    localStorage.removeItem("accessToken");
    dispatch({
      type: "LOGOUT",
    });
    window.location.href = "/authorization/login";
  }, []);

  const hasPermission = (accessCode) => {
    const target = state?.user?.permission_menus?.find(
      (item) => item.code === accessCode
    );

    return !!target;
  };

  // ----------------------------------------------------------------------

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      //
      login,
      logout,
      switch_role,
      hasPermission,
    }),
    [login, logout, hasPermission, state.user]
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
}
