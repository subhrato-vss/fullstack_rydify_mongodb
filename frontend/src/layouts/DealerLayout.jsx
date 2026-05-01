import React from 'react';
import { Outlet } from 'react-router-dom';
import DealerSidebar from '../components/DealerSidebar';

const DealerLayout = () => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0f172a' }}>
            <DealerSidebar />
            <main style={{ 
                flex: 1, 
                padding: '2rem', 
                marginLeft: '280px', 
                minHeight: '100vh',
                background: 'radial-gradient(at 0% 0%, rgba(56, 189, 248, 0.05) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.05) 0px, transparent 50%)'
            }}>
                <Outlet />
            </main>
        </div>
    );
};

export default DealerLayout;
