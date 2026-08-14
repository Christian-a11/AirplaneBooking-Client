import { defineStore } from "pinia";
import { reactive } from "vue";

import api from "@/../api";

export const useGlobalStore = defineStore("global", () => {
  // ref() accepts any data type (primitive and objects);
  // reactive() only accepts objects (not primitives)

  let user = reactive({
    token: localStorage.getItem("token"),
    email: null,
    isAdmin: null,
    firstName: null,
    lastName: null,
    mobileNo: null,
    id: null,
  });

  async function setUserDetails(token) {
    if (!token) {
      clearUserDetails();
      return;
    }

    try {
      localStorage.setItem("token", token);
      let { data } = await api.get("/users/details", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      user.token = token;
      user.email = data.email;
      user.isAdmin = data.isAdmin;
      user.firstName = data.firstName || "";
      user.lastName = data.lastName || "";
      user.mobileNo = data.mobileNo || "";
      user.id = data._id || data.id || "";
    } catch (error) {
      clearUserDetails();
    }
  }

  function clearUserDetails() {
    localStorage.removeItem("token");
    user.token = null;
    user.email = null;
    user.isAdmin = null;
    user.firstName = null;
    user.lastName = null;
    user.mobileNo = null;
    user.id = null;
  }

  return {
    user,
    setUserDetails,
    clearUserDetails,
  };
});
