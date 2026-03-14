import { Layout, Menu } from "antd";
import { colors } from "@/styles/theme";
import { useSidebar } from "@/context/SidebarContext";
import { useNavigate, useLocation } from "react-router-dom";
import { TbPackageExport } from "react-icons/tb";
import { MdDeliveryDining, MdBarChart, MdPersonAdd } from "react-icons/md";
import { LuPackageX } from "react-icons/lu";
import { useAuth } from "@/context/AuthContext";
import styled from "styled-components";

const { Sider } = Layout;

const SidebarWrapper = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`;

const StyledSider = styled(Sider)<{ $collapsed: boolean }>`
  flex-shrink: 0 !important;
  transition: width 0.3s !important;

  .ant-layout-sider-children {
    display: flex;
    flex-direction: column;
  }

  .ant-menu {
    flex: 1;
    overflow-y: auto;
  }
`;

const MainContent = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  transition: all 0.3s;
  background: ${colors.neutral.backgroundSecondary};
`;

export default function SidebarHamburger({
  children,
}: {
  children: React.ReactNode;
}) {
  const { collapsed } = useSidebar();
  const { roles } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { key: "/dashboard/pedidos", icon: <LuPackageX />, label: "Pedidos" },
    {
      key: "/dashboard/pedidos-entregues",
      icon: <TbPackageExport />,
      label: "Pedidos entregues",
    },
    ...(roles.includes("ROLE_ADMIN")
      ? [{ key: "/dashboard/metricas", icon: <MdBarChart />, label: "Métricas" }]
      : []),
    ...(roles.includes("ROLE_ADMIN")
      ? [
          {
            key: "/admin/funcionario",
            icon: <MdDeliveryDining />,
            label: "Funcionários",
          },
          {
            key: "/admin/criar-usuario",
            icon: <MdPersonAdd />,
            label: "Criar usuário",
          },
        ]
      : []),
  ];

  return (
    <SidebarWrapper>
      <StyledSider $collapsed={collapsed} collapsed={collapsed} width={256}>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{
            height: "100%",
            borderRight: 0,
          }}
        />
      </StyledSider>
      <MainContent>{children}</MainContent>
    </SidebarWrapper>
  );
}
