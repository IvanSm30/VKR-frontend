import React from "react";
import DocumentsList from "src/components/DocumentsList";
import { Layout } from "antd";
import { color1, color2 } from "../../colors";
import HeaderComp from "src/components/HeaderComp";

const { Header, Footer, Sider, Content } = Layout;

const Home = () => {
    return (
        <Layout>
            <Header style={{ backgroundColor: color2 }}>
                <HeaderComp />
            </Header>
            <Layout>
                <Sider width={50} style={{ backgroundColor: color1 }}>

                </Sider>
                <Content>
                    <DocumentsList />
                </Content>
            </Layout>
            <Footer style={{ backgroundColor: color2 }} />
        </Layout >
    )
}
export default Home;
