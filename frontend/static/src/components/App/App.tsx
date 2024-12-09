import { useState, useEffect, Dispatch } from "react";
import Header from "../Header";
import Cookies from "js-cookie";
import { NavigateFunction, Outlet, useNavigate } from "react-router-dom";
import { handleError } from "../../util";
import React from "react";

export type OutletContext = {
  navigate: NavigateFunction;
  auth: string;
  setAuth: Dispatch<boolean>;
  admin: boolean;
  setAdmin: Dispatch<boolean>;
};

function App() {
  const navigate = useNavigate();

  const [auth, setAuth] = useState(!!Cookies.get("Authorization"));
  const [admin, setAdmin] = useState<boolean>(false);

  useEffect(() => {
    const getAdminStatus = async () => {
      const response = await fetch("/rest-auth/user/").catch(handleError);
      if (!response?.ok) {
        throw new Error("Network response not ok");
      } else {
        const data = await response.json();
        if (data.is_superuser) {
          setAdmin(true);
        }
      }
    };

    if (auth) {
      getAdminStatus();
    }
  }, [auth]);

  return (
    <div className="App conatiner-fluid">
      <Header
        auth={auth}
        setAuth={setAuth}
        navigate={navigate}
        admin={admin}
        setAdmin={setAdmin}
      />
      <main>
        <Outlet context={{ navigate, auth, setAuth, admin, setAdmin }} />
      </main>
    </div>
  );
}

export default App;
