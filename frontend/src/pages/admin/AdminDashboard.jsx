import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        dealers: 0,
        categories: 0,
        bookings: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [dealerRes, catRes, bookingRes] = await Promise.all([
                    adminService.getDealers(),
                    adminService.getCategories(),
                    adminService.getBookings()
                ]);

                setStats({
                    dealers: dealerRes.data.data?.length || 0,
                    categories: catRes.data.data?.length || 0,
                    bookings: bookingRes.data.data?.length || 0
                });
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const cards = [
        { title: 'Total Dealers', value: stats.dealers, icon: 'fas fa-users', colorClass: styles.iconYellow, barColor: '#fbbf24' },
        { title: 'Total Categories', value: stats.categories, icon: 'fas fa-tags', colorClass: styles.iconOrange, barColor: '#f97316' },
        { title: 'Total Bookings', value: stats.bookings, icon: 'fas fa-calendar-check', colorClass: styles.iconRed, barColor: '#f43f5e' }
    ];

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
            <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    return (
        <div className={styles.dashboard}>
            <div className={styles.welcomeSection}>
                <h1 className={styles.welcomeTitle}>Welcome back, Admin!</h1>
                <p className={styles.welcomeText}>Here's what's happening with Drive Deal today.</p>
            </div>

            <div className={styles.statsGrid}>
                {cards.map((card, index) => (
                    <div key={index} className={styles.statCard}>
                        <div className={`${styles.statIcon} ${card.colorClass}`}>
                            <i className={card.icon}></i>
                        </div>
                        <div className={styles.statInfo}>
                            <span className={styles.statLabel}>{card.title}</span>
                            <span className={styles.statValue}>{card.value}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.chartSection}>
                <div className={styles.chartHeader}>
                    <h3 className={styles.chartTitle}>Global System Statistics</h3>
                </div>
                <div className={styles.chartContainer}>
                    {cards.map((card, index) => {
                        const maxVal = Math.max(...cards.map(c => c.value)) || 1;
                        return (
                            <div key={index} className={styles.barWrapper}>
                                <div 
                                    className={styles.bar} 
                                    style={{ 
                                        height: `${(card.value / maxVal) * 100}%`, 
                                        backgroundColor: card.barColor
                                    }}
                                    title={`${card.title}: ${card.value}`}
                                ></div>
                                <span className={styles.barLabel}>{card.title.split(' ')[1]}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
