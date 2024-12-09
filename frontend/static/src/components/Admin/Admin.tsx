import { Dispatch, useEffect, useState } from "react";
import { handleError } from "../../util";
import { Outlet } from "react-router-dom";
import React from "react";
import { Park, Trail } from "../../types";

export type AdminOutletContext = {
  parks: Park[];
  setParks: Dispatch<Maybe<Park[]>>;
  trails: Trail[];
  setTrails: Dispatch<Maybe<Trail[]>>;
};

function Admin() {
  const [parks, setParks] = useState([]);
  const [trails, setTrails] = useState([]);

  useEffect(() => {
    const getParkList = async () => {
      const response = await fetch("/api/v1/trails/admin/parks/").catch(
        handleError,
      );
      if (!response?.ok) {
        throw new Error("Network response not ok");
      } else {
        const data = await response.json();
        setParks(data);
      }
    };

    const getTrailList = async () => {
      const response = await fetch("/api/v1/trails/admin/").catch(handleError);
      if (!response?.ok) {
        throw new Error("Network response not ok");
      } else {
        const data = await response.json();
        setTrails(data);
      }
    };
    getParkList();
    getTrailList();
  }, []);

  return (
    <div className="wrapper">
      <Outlet context={{ parks, setParks, trails, setTrails }} />
    </div>
  );
}

export default Admin;
