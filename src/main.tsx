import "@ant-design/v5-patch-for-react-19";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "antd";
import ptBR from "antd/locale/pt_BR";
import { colors } from "@/styles/theme";
import App from "./App";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { RootStateProvider } from "@/store";
import { Toaster } from "react-hot-toast";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  }

  body.dark {
    background-color: ${colors.neutral.textPrimary};
    color: ${colors.neutral.white};
  }

  body.light {
    background-color: ${colors.neutral.white};
    color: ${colors.neutral.textPrimary};
  }

  a {
    color: ${colors.primary.main};
  }

  a:hover {
    color: ${colors.primary.hover};
  }
`;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ConfigProvider
        locale={ptBR}
        theme={{
          token: {
            colorPrimary: colors.primary.main,
            colorPrimaryHover: colors.primary.hover,
            colorSuccess: colors.success.main,
            colorError: colors.error.main,
            colorWarning: colors.secondary.main,
            colorText: colors.neutral.textPrimary,
            colorTextSecondary: colors.neutral.textSecondary,
            colorBorder: colors.neutral.border,
            colorBgContainer: colors.neutral.white,
            colorBgLayout: colors.neutral.backgroundSecondary,
          },
          components: {
            Menu: {
              itemSelectedBg: colors.primary.light,
              itemSelectedColor: colors.primary.main,
              itemHoverColor: colors.primary.hover,
              itemActiveBg: colors.primary.light,
            },
          },
        }}
      >
        <GlobalStyle />
        <ThemeProvider>
          <AuthProvider>
            <RootStateProvider>
              <App />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: colors.neutral.textPrimary,
                    color: colors.neutral.white,
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: colors.success.main,
                      secondary: colors.neutral.white,
                    },
                  },
                  error: {
                    duration: 4000,
                    iconTheme: {
                      primary: colors.error.main,
                      secondary: colors.neutral.white,
                    },
                  },
                }}
              />
            </RootStateProvider>
          </AuthProvider>
        </ThemeProvider>
      </ConfigProvider>
    </BrowserRouter>
  </React.StrictMode>
);
