import React, { useState } from "react";
import { Button, Flex, Input } from 'antd';
import { useAppDispatch } from "src/store/hooks";
import { SwapOutlined, ReloadOutlined, FilterOutlined } from "@ant-design/icons";
// import NotificationComponent from "../Notification";

const { Search } = Input;

const SearchControls = () => {
    // const { openNotification, contextHolder } = NotificationComponent("Ваше сообщение");
    const dispatch = useAppDispatch();
    const [stateSort, setStateSort] = useState(true);

    const onSearch = (value: string) => {
        dispatch({ type: "files/searchFile", payload: value });
    };

    const sort = () => {
        const sortOrder = stateSort ? 'asc' : 'desc';
        dispatch({ type: "files/sortFile", payload: sortOrder });
        setStateSort(!stateSort);
    };

    const resetSorting = () => {
        dispatch({ type: "files/resetSort" });
        setStateSort(true);
    };

    const filter = () => {
        // openNotification();
    };

    return (
        <Flex vertical={false}>
            {/* {contextHolder} */}
            <Search
                placeholder="Текст для поиска"
                allowClear
                onSearch={onSearch}
                style={{ width: 200 }}
            />
            <Button icon={<SwapOutlined rotate={90} />} onClick={sort} />
            <Button icon={<FilterOutlined onClick={filter} />} onMouseEnter={() => { }} onMouseLeave={() => { }} />
            <Button icon={<ReloadOutlined rotate={90} />} onClick={resetSorting} />
        </Flex>
    );
};

export default SearchControls;
