import { Tabs, TabsProps, Tree, TreeDataNode } from "antd";
import React from "react";
import { useAppSelector } from "src/store/hooks";

const { DirectoryTree } = Tree;


const SideBarComponent = () => {
    const files = useAppSelector((state) => state.files.filteredFiles);
    const docsByAppointment: string[] = [
        'распорядительные',
        'кадровые',
        'нормативные',
        'коммерческие',
        'организационно-правовые',
        'информационно-справочные',
        'финансово-бухгалтерские',
        'научно-технические',
        'юридические'
    ];

    const docsByTypes: string[] = [
        'приказы',
        'распоряжения',
        'договора',
        'дела',
        'заявления',
        'законы',
        'постановления',
        'инструкции',
        'стандарты',
        'контракты',
        'уставы',
        'положения',
        'регламенты',
        'письма',
        'доклады',
        'записки',
        'счета',
        'накладные',
        'протоколы',
        'проекты',
        'справки',
        'соглашения',
        'согласия',
        'анкеты',
        'акты',
        'заявки',
        'выписки'
    ];

    const treeDataAppointment: TreeDataNode[] = []
    const treeDataTypes: TreeDataNode[] = []

    docsByAppointment.map((doc, i) => {
        treeDataAppointment.push({
            title: doc,
            key: i,
            children: [],
            icon: ""
        })
    })

    docsByTypes.map((doc, i) => {
        treeDataTypes.push({
            title: doc,
            key: i,
            children: [],
            icon: ""
        })
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
        <Tabs defaultActiveKey="1" items={items} />
    )
}

export default SideBarComponent;
