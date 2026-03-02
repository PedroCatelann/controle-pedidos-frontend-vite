import { Avatar, Dropdown } from "antd";
import type { MenuProps } from "antd";
import { IoMenuSharp } from "react-icons/io5";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "./ThemeProvider";
import { useSidebar } from "@/context/SidebarContext";
import { colors } from "@/styles/theme";
import styled from "styled-components";

const NavContainer = styled.nav<{ $dark: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background: ${(props) => (props.$dark ? colors.neutral.textPrimary : colors.primary.main)};
  color: ${colors.neutral.white};
  transition: background 0.3s, color 0.3s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const NavLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const HamburgerButton = styled.button`
  padding: 0.5rem;
  border: none;
  background: transparent;
  color: ${colors.neutral.white};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const NavRight = styled.div`
  display: flex;
  align-items: center;
`;

const UserGreeting = styled.span`
  margin-right: 1rem;
`;

export const NavBarComponent: React.FC = () => {
  const { fullname } = useAuth();
  const { theme } = useTheme();
  const { toggle } = useSidebar();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const items: MenuProps["items"] = [
    {
      key: "logout",
      label: "Sair",
      onClick: handleLogout,
    },
  ];

  return (
    <NavContainer $dark={theme === "dark"}>
      <NavLeft>
        <HamburgerButton
          onClick={toggle}
          aria-label="Abrir/Fechar menu lateral"
          title="Menu"
        >
          <IoMenuSharp size={24} />
        </HamburgerButton>
      </NavLeft>
      <NavRight>
        <UserGreeting>Olá, {fullname}! 👋</UserGreeting>
        <Dropdown menu={{ items }} trigger={["click"]}>
        <Avatar
          style={{ cursor: "pointer" }}
          src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
        />
      </Dropdown>
      </NavRight>
    </NavContainer>
  );
};
