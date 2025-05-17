import React from "react";
import DocumentsList from "src/components/DocumentsList";
import { Layout } from "antd";
import { color2 } from "../../colors";
import HeaderComp from "src/components/HeaderComp";
import SearchControls from "src/components/SearchControls";
import SideBarComponent from "src/components/SideBar";

const { Header, Footer, Sider, Content } = Layout;

const Home = () => {
    return (
        <Layout>
            <Header style={{ backgroundColor: color2 }}>
                <HeaderComp />
            </Header>
            <Layout>
                <Sider width={350} style={{ backgroundColor: "white", padding: 20 }}>
                    <SideBarComponent />
                </Sider>
                <Content>
                    <SearchControls />
                    <DocumentsList />
                </Content>
            </Layout>
            <Footer style={{ backgroundColor: color2 }} />
        </Layout >
    )
}
export default Home;
