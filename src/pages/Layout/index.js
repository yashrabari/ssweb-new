import React from "react";
import { Outlet } from "react-router-dom";
import { Column, Page, Sidebar } from "../../components/common";

export default function index() {
  return (
    <Page row>
      <Sidebar />
      <Column width="1170px" margin="0 auto" hideScrollBar>
        <Outlet />
      </Column>
    </Page>
  );
}
