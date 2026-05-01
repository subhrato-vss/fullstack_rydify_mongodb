import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import styles from './DealerSidebar.module.css';

const DealerSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [isRequestsOpen, setIsRequestsOpen] = useState(
        location.pathname.includes('_req') || location.pathname === '/dealer/car_req'
    );

    const menuItems = [
        { path: '/dealer/dashboard', label: 'Dashboard', icon: 'fas fa-th-large' },
        { path: '/dealer/manage_cars', label: 'Manage Cars', icon: 'fas fa-car' },
        {
            label: 'Car Requests',
            icon: 'fas fa-exchange-alt',
            isDropdown: true,
            isOpen: isRequestsOpen,
            toggle: () => setIsRequestsOpen(!isRequestsOpen),
            subItems: [
                { path: '/dealer/car_req', label: 'Pending', icon: 'fas fa-clock' },
                { path: '/dealer/view_approved_req', label: 'Approved', icon: 'fas fa-check-circle' },
                { path: '/dealer/view_completed_req', label: 'Completed', icon: 'fas fa-flag-checkered' },
                { path: '/dealer/view_cancelled_req', label: 'Cancelled', icon: 'fas fa-times-circle' },
            ]
        },
        { path: '/dealer/profile', label: 'My Profile', icon: 'fas fa-user-circle' },
        { path: '/dealer/change_password', label: 'Security', icon: 'fas fa-shield-alt' },
    ];

    const handleLogout = () => {
        toast((t) => (
            <div style={{ padding: '8px' }}>
                <p style={{ margin: '0 0 12px 0', fontWeight: '600', color: '#fff' }}>
                    Are you sure you want to logout?
                </p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        style={{
                            background: '#4b5563',
                            color: '#fff',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.85rem'
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            await logout();
                            navigate('/dealer/login');
                        }}
                        style={{
                            background: '#ef4444',
                            color: '#fff',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: '600'
                        }}
                    >
                        Yes, Logout
                    </button>
                </div>
            </div>
        ), {
            duration: 6000,
            position: 'bottom-left',
            style: {
                background: '#1e293b',
                border: '1px solid #334155',
                minWidth: '250px'
            }
        });
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logoSection}>
                <Link to="/dealer/dashboard">
                    <img src="/assets/img/admin_logo.png" alt="Rydify" className={styles.logoImg} />
                </Link>
            </div>

            <nav className={styles.nav}>
                <ul className={styles.menuList}>
                    {menuItems.map((item, idx) => {
                        if (item.isDropdown) {
                            const isChildActive = item.subItems.some(sub => location.pathname === sub.path);
                            return (
                                <li key={idx} className={styles.menuItem}>
                                    <button
                                        onClick={item.toggle}
                                        className={`${styles.navLink} ${styles.dropdownBtn} ${isChildActive ? styles.activeDropdown : ''}`}
                                    >
                                        <div className={styles.linkMain}>
                                            <i className={item.icon}></i>
                                            <span>{item.label}</span>
                                        </div>
                                        <i className={`fas fa-chevron-right ${styles.chevron} ${item.isOpen ? styles.chevronDown : ''}`}></i>
                                    </button>
                                    <ul className={`${styles.subMenu} ${item.isOpen ? styles.subMenuOpen : ''}`}>
                                        {item.subItems.map((sub) => (
                                            <li key={sub.path}>
                                                <Link
                                                    to={sub.path}
                                                    className={`${styles.subMenuLink} ${location.pathname === sub.path ? styles.activeSubLink : ''}`}
                                                >
                                                    <i className={sub.icon}></i>&nbsp;&nbsp;
                                                    <span>{sub.label}</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            );
                        }

                        const isActive = location.pathname === item.path;
                        return (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`${styles.navLink} ${isActive ? styles.activeNavLink : ''}`}
                                >
                                    <i className={item.icon}></i>
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className={styles.footer}>
                <button onClick={handleLogout} className={styles.logoutBtn}>
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default DealerSidebar;
