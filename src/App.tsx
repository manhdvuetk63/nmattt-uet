import React, { useEffect } from "react";
import { Switch, Route, useLocation } from "react-router-dom";
import { Layout, Menu, Breadcrumb, Row } from "antd";
import "./App.css";
import Caesar from "./encode/Caesar";
import Substitution from "./encode/Substitution";
import Affine from "./encode/Affine";
import Vigenere from "./encode/Vigenere";
import Hill from "./encode/Hill";

const { Header, Content, Sider } = Layout;

const App = () => {
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
              defaultSelectedKeys={["caesar"]}
              style={{ height: "100%" }}
              onSelect={({ key }) => {
                window.location.href = "/#/" + key;
              }}
            >
                <Menu.Item key="caesar">Hệ mã dịch chuyển</Menu.Item>
                <Menu.Item key="substitution">Hệ mật thay thế</Menu.Item>
                <Menu.Item key="affine">Hệ mật Affine</Menu.Item>
                <Menu.Item key="vigenere">Hệ mật Vigenere</Menu.Item>
                <Menu.Item key="hill">Hệ mật mã Hill</Menu.Item>
            </Menu>
          </Sider>
          <Content style={{ padding: "30px", marginBottom: 30 }}>
            <Switch>
              <Route path="/caesar" component={Caesar} />
              <Route path="/substitution" component={Substitution} />
              <Route path="/affine" component={Affine} />
              <Route path="/vigenere" component={Vigenere} />
              <Route path="/hill" component={Hill} />
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
    window.location.href = "/#/caesar";
  }, []);
  return <></>;
};
