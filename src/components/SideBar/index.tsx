import { FileOutlined } from "@ant-design/icons";
import { Tabs, TabsProps, Tree, TreeDataNode } from "antd";
import React from "react";
import { useAppSelector } from "src/store/hooks";

const { DirectoryTree } = Tree;


const SideBarComponent = () => {
    const files = useAppSelector((state) => state.files.filteredFiles);
    const treeDataAppointment: TreeDataNode[] = []
    const treeDataTypes: TreeDataNode[] = []

    files.map((file) => {

        const treeDataAppointment_allNames = treeDataAppointment.map(item => item.title);
        file.labels["По назначению"].map((label: string) => {
            if (!treeDataAppointment_allNames.includes(label)) {
                treeDataAppointment.push({
                    title: label,
                    key: `${label}-${file.id}`,
                    children: [{
                        title: file.title,
                        key: `${file.title}-${file.id}`,
                        icon: <FileOutlined />
                    }]
                })
            } else {
                treeDataAppointment.map((i) => {
                    if (i.title == label) {
                        i.children?.push({
                            title: file.title,
                            key: `${file.title}-${file.id}`,
                            icon: <FileOutlined />,
                        })
                    }
                })
            }
        })

        const treeDataTypes_allNames = treeDataTypes.map(item => item.title);
        if (file.labels["По типу"] === "-") {
            return;
        }
        if (!treeDataTypes_allNames.includes(file.labels["По типу"])) {
            treeDataTypes.push({
                title: file.labels["По типу"],
                key: `${file.labels["По типу"]}-${file.id}`,
                children: [{
                    title: file.title,
                    key: `${file.title}-${file.id}`,
                    icon: <FileOutlined />
                }]
            })
        } else {
            treeDataTypes.map((i) => {
                if (i.title === file.labels["По типу"]) {
                    i.children?.push({
                        title: file.title,
                        key: `${file.title}-${file.id}`,
                        icon: <FileOutlined />,
                    })
                }
            })
        }

    })

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'По назначению',
            children: <DirectoryTree treeData={treeDataAppointment} />,
        },
        {
            key: '2',
            label: 'По типу',
            children: <DirectoryTree treeData={treeDataTypes} />,
        },
    ];

    return (
        <Tabs defaultActiveKey="1" items={items}/>
    )
}

export default SideBarComponent;
