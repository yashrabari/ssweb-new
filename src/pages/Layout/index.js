import React, { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Column, Page, Sidebar } from "../../components/common";
import { AuthContext } from "../../context/authContext";

export default function Index() {

  return (
    <Page row>
      <Sidebar />
      <Column width="1170px" margin="0 auto" hideScrollBar>
        <Outlet />
      </Column>
    </Page>
  );
}
