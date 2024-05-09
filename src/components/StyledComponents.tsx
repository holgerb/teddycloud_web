import { Breadcrumb, Layout, Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import Item from "antd/es/list/Item";
import styled from "styled-components";
import { theme } from 'antd';

const { useToken } = theme;
const useThemeToken = () => useToken().token;

export const StyledSubMenu = styled(Menu)`
  height: 100%;
  border-right: 0;
`;

export const StyledSider = styled(Sider)`
  width: 200px;
  @media (max-width: 768px) {
    display: none;
  }
  margin: 8px;
`;

export const StyledLayout = styled(Layout)`
  padding: 0 24px 24px;
`;

export const StyledBreadcrumb = styled(Breadcrumb)`
  margin: 16px 0;
`;

export const StyledContent = styled(Layout.Content)`
  padding: 24px;
  margin: 0;
  min-height: 280px;
  background: ${() => useThemeToken().colorBgContainer};
`;

export const HiddenDesktop = styled.span`
  @media (min-width: 768px) {
    display: none;
  }
`;

export const HiddenMobile = styled.span`
  @media (max-width: 768px) {
    display: none;
  }
`;

export const StyledBreadcrumbItem = styled(Item)`
  padding: 10px;
`;
