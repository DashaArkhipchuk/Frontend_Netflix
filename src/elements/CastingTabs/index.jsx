import React from 'react';
import { ConfigProvider, Tabs } from 'antd';
import { useNavigate } from 'react-router-dom';
import style from './style.module.scss';
import { useAuth } from '../AuthProvider';

const CastingTabs = ({ activeTab, setActiveTab }) => {
    const { isActor, isDirector } = useAuth();
    const navigate = useNavigate();

    const items = [
        {
            key: '1',
            label: <p className={style.tabName}>Casting Calls</p>,
            children: (
                <>
                    <h1 className={style.tabContentName}>CASTING CALLS AND AUDITIONS</h1>
                    <p className={style.tabContent}>
                        We invite you to the world of possibilities on our casting website!
                        Here your talent will find its true expression and your dreams will come true.
                        Register today, take an audition, and become a star of the future!
                    </p>
                </>
            ),
        },
        // Tab 2 for actors = their submissions
        ...(isActor ? [{
            key: '2',
            label: <p className={style.tabName}>My Submissions</p>,
            children: (
                <>
                    <h1 className={style.tabContentName}>MY SUBMISSIONS</h1>
                    <p className={style.tabContent}>
                        View all the casting calls you have submitted to.
                    </p>
                </>
            ),
        }] : []),
        // Tab 2 for directors = their castings
        ...(isDirector ? [{
            key: '3',
            label: <p className={style.tabName}>My Castings</p>,
            children: (
                <>
                    <h1 className={style.tabContentName}>MY CASTINGS</h1>
                    <p className={style.tabContent}>
                        Manage the casting calls you have created.
                    </p>
                </>
            ),
        }] : []),
    ];

    return (
        <ConfigProvider theme={{
            token: {
                colorPrimary: '#800020',
                colorBgBase: '#1f1f1f',
            },
        }}>
            <Tabs activeKey={activeTab} onChange={setActiveTab} className={style.tabs}>
                {items.map(item => (
                    <Tabs.TabPane key={item.key} tab={item.label}>
                        {item.children}
                    </Tabs.TabPane>
                ))}
            </Tabs>
        </ConfigProvider>
    );
};

export default CastingTabs;