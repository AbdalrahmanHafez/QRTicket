import { useEffect, useState } from "react";
import UserSubmit from "./Pages/UserSubmit";
import AdminScan from "Pages/AdminScan";
import Test from "Pages/Test";

const App = () => {
  switch (window.location.pathname) {
    case "/test":
      return <Test />;
    case "/scanner":
      return <AdminScan />;
    default:
      return <UserSubmit />;
  }
};

export default App;
