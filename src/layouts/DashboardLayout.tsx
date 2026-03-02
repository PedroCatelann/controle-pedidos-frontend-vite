import { Outlet } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { NavBarComponent } from "@/components/NavBar";
import SidebarHamburger from "@/components/SideBarHamburguer";
import { SidebarProvider } from "@/context/SidebarContext";
import styled from "styled-components";

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
`;

export default function DashboardLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <SidebarProvider>
      <LayoutContainer>
        <NavBarComponent />
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <SidebarHamburger>{children || <Outlet />}</SidebarHamburger>
        </div>
      </LayoutContainer>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
