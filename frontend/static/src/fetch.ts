import Cookies from "js-cookie";
import { handleError } from "./util";

export const fetchWrapper = async (url: string) => {
  const options = {
    method: "GET",
    headers: {
      "X-CSRFToken": Cookies.get("csrftoken")!,
    },
  };

  const response = await fetch(url, options).catch(handleError);

  if (!response?.ok) {
    console.error("Network response not ok");
    return null;
  }
  const data = await response.json();

  return data;
};
