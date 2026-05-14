import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
    const [data, setData] = useState({
        stats: {
            dealers: 0,
            users: 0,
            vehicles: 0,
            bookings: 0
        },
        recentBookings: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const response = await adminService.getDashboardStats();
                if (response.data.success) {
                    setData(response.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const statCards = [
        {
            title: 'Active Dealers',
            value: data.stats.dealers,
            label: 'Partner network',
            icon: 'fas fa-handshake',
            color: '#38bdf8',
            trend: 'Verified partners'
        },
        {
            title: 'Total Users',
            value: data.stats.users,
            label: 'Registered clients',
            icon: 'fas fa-users',
            color: '#facc15',
            trend: 'Growing community'
        },
        {
            title: 'Fleet Size',
            value: data.stats.vehicles,
            label: 'Total vehicles',
            icon: 'fas fa-car-side',
            color: '#4ade80',
            trend: 'Cars & Bikes'
        },
        {
            title: 'Bookings',
            value: data.stats.bookings,
            label: 'Total transactions',
            icon: 'fas fa-calendar-check',
            color: '#f87171',
            trend: 'Lifetime volume'
        }
    ];

    if (loading) return (
        <div className={styles.loadingContainer}>
            <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <p>Gathering system intelligence...</p>
        </div>
    );

    return (
        <div className={styles.dashboard}>
            <header className={styles.header}>
                <div className={styles.welcomeInfo}>
                    <h1 className={`${styles.title} text-white`}>System <span>Overview</span></h1>
                    <p className={styles.subtitle}>Comprehensive monitoring of Rydify platform activity.</p>
                </div>
                <div className={styles.dateInfo}>
                    <i className="fas fa-calendar-alt"></i>
                    <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
            </header>

            <div className={styles.statsGrid}>
                {statCards.map((card, index) => (
                    <div key={index} className={styles.statCard} style={{ '--accent': card.color }}>
                        <div className={styles.cardHeader}>
                            <div className={styles.iconWrapper}>
                                <i className={card.icon}></i>
                            </div>
                            <span className={styles.trend}>{card.trend}</span>
                        </div>
                        <div className={styles.cardBody}>
                            <h2 className={styles.statValue}>{card.value}</h2>
                            <p className={styles.statTitle}>{card.title}</p>
                            <p className={styles.statLabel}>{card.label}</p>
                        </div>
                        <div className={styles.cardGlow}></div>
                    </div>
                ))}
            </div>

            <div className={styles.mainGrid}>
                <section className={styles.bookingsSection}>
                    <div className={styles.sectionHeader}>
                        <h3 className={`${styles.sectionTitle} text-white`}>
                            <i className="fas fa-history"></i> Recent Transactions
                        </h3>
                        {/* <button className={styles.btnViewAll}>View All</button> */}
                    </div>
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Customer</th>
                                    <th>Vehicle</th>
                                    <th>Dealer</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.recentBookings.length > 0 ? (
                                    data.recentBookings.map((booking, i) => (
                                        <tr key={i}>
                                            <td>
                                                <div className={styles.userInfo}>
                                                    <span className={styles.userName}>{booking.user?.name}</span>
                                                    <span className={styles.userEmail}>{booking.user?.email}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className={styles.carInfo}>
                                                    <span className={styles.carName}>{booking.car?.name}</span>
                                                    <span className={styles.carType}>{booking.car?.type}</span>
                                                </div>
                                            </td>
                                            <td>{booking.dealer?.name}</td>
                                            <td>
                                                <span className={`${styles.statusBadge} ${styles[booking.status.toLowerCase()]}`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className={`${styles.noData} text-white`}>
                                            <div className={`${styles.emptyState}`}>
                                                <i className="fas fa-folder-open"></i>
                                                <p>No recent transactions found</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                <aside className={styles.sideColumn}>
                    <div className={styles.actionCard}>
                        <h3 className={`${styles.sectionTitle} text-white`}>Platform Health</h3>
                        <div className={styles.healthList}>
                            <div className={styles.healthItem}>
                                <span>API Status</span>
                                <span className={styles.healthDot}></span>
                            </div>
                            <div className={styles.healthItem}>
                                <span>DB Connection</span>
                                <span className={styles.healthDot}></span>
                            </div>
                            <div className={styles.healthItem}>
                                <span>Payment Gateway</span>
                                <span className={styles.healthDot}></span>
                            </div>
                        </div>
                    </div>

                    {/* <div className={styles.quickLinks}>
                        <h3 className={styles.sectionTitle}>Global Actions</h3>
                        <div className={styles.linkGrid}>
                            <div className={styles.linkItem}>
                                <i className="fas fa-plus-circle"></i>
                                <span>Add Category</span>
                            </div>
                            <div className={styles.linkItem}>
                                <i className="fas fa-user-shield"></i>
                                <span>Verify Dealer</span>
                            </div>
                            <div className={styles.linkItem}>
                                <i className="fas fa-file-invoice"></i>
                                <span>Reports</span>
                            </div>
                        </div>
                    </div> */}
                </aside>
            </div>
        </div>
    );
};

export default AdminDashboard;

