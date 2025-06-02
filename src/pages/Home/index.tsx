import React from "react";
import DocumentsList from "src/components/DocumentsList";
import { Layout, Splitter } from "antd"; // Импортируем Splitter из Ant Design
import { color2 } from "../../colors";
import HeaderComp from "src/components/HeaderComp";
import SearchControls from "src/components/SearchControls";
import SideBarComponent from "src/components/SideBar";

const { Header, Footer, Content } = Layout;

const Home = () => {
    return (
        <Layout style={{ height: '100vh' }}>
            <Header style={{ backgroundColor: color2 }}>
                <HeaderComp />
            </Header>
            <Layout>
                <Splitter>
                    <Splitter.Panel defaultSize="30%" min="10%" max="50%">
                        <div style={{ backgroundColor: "white", padding: 20, height: "100%" }}>
                            <SideBarComponent />
                        </div>
                    </Splitter.Panel>
                    <Splitter.Panel defaultSize="70%" min="50%" max="90%">
                        <Content style={{ padding: 20 }}>
                            <SearchControls />
                            <DocumentsList />
                        </Content>
                    </Splitter.Panel>
                </Splitter>
            </Layout>
            <Footer style={{ backgroundColor: color2 }} />
        </Layout>
    );
}

export default Home;
