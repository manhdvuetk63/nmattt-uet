import React, { useEffect } from "react";
import { Switch, Route, useLocation } from "react-router-dom";
import { Layout, Menu, Breadcrumb, Row } from "antd";
import { UserOutlined } from "@ant-design/icons";
import "./App.css";
import RSA from "./rsa/RSA";
import ModuloCaculate from "./rsa/Modulo";
import PrimitiveRootModulo from "./rsa/PrimitiveRootModulo";
import DiffieHellman from "./rsa/DiffieHellman";

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const App = () => {
  const location = useLocation();
  return (
    <>
      <Header className="header text-white justify-content-between">
        <Row>
          <div className="mr-auto">
            <>NHẬP MÔN AN TOÀN THÔNG TIN</>
          </div>
          <a className="text-white" href="https://github.com/manhdvuetk63/nmattt-uet">
            Github / Source code
          </a>
        </Row>
      </Header>
      <Content style={{ padding: "0 50px" }}>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>UET</Breadcrumb.Item>
          <Breadcrumb.Item>VNU</Breadcrumb.Item>
        </Breadcrumb>
        <Layout className="site-layout-background">
          <Sider className="site-layout-background" width={300}>
            <Menu
              mode="inline"
              defaultSelectedKeys={[location.pathname.split("/")[1] || "rsa-1"]}
              defaultOpenKeys={["rsa"]}
              style={{ height: "100%" }}
              onSelect={({ key }) => {
                window.location.href = "/#/" + key;
              }}
            >
              <SubMenu key="rsa" icon={<UserOutlined />} title="Hệ mật RSA">
                <Menu.Item key="rsa-1">Xây dựng hệ mật RSA</Menu.Item>
                <Menu.Item key="rsa-2">Tính mũ theo modulo</Menu.Item>
                <Menu.Item key="rsa-3">Tính căn nguyên thủy</Menu.Item>
                <Menu.Item key="rsa-4">Trao đổi khóa Diffie-Hellman</Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
          <Content style={{ padding: "30px", marginBottom: 30 }}>
            <Switch>
              <Route path="/rsa-1" component={RSA} />
              <Route path="/rsa-2" component={ModuloCaculate} />
              <Route path="/rsa-3" component={PrimitiveRootModulo} />
              <Route path="/rsa-4" component={DiffieHellman} />
              <Route path="*" component={DefaultRedirect} />
            </Switch>
          </Content>
        </Layout>
      </Content>
    </>
  );
};

export default App;

const DefaultRedirect: React.FC = () => {
  useEffect(() => {
    window.location.href = "/#/rsa-1";
  }, []);
  return <></>;
};
