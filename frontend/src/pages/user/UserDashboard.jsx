import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import carService from '../../services/carService';
import styles from './UserDashboard.module.css';

const UserDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalRequests: 0,
        approved: 0,
        pending: 0,
        completed: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const res = await carService.getUserStats();
                if (res.data.success) {
                    setStats({
                        totalRequests: res.data.data.total,
                        confirmed: res.data.data.confirmed,
                        pending: res.data.data.pending,
                        completed: res.data.data.completed,
                        cancelled: res.data.data.cancelled
                    });
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const statCards = [
        { label: 'Total Bookings', value: stats.totalRequests, icon: 'fas fa-car', class: styles.iconYellow },
        { label: 'Confirmed', value: stats.confirmed, icon: 'fas fa-check-circle', class: styles.iconGreen },
        { label: 'Pending', value: stats.pending, icon: 'fas fa-clock', class: styles.iconBlue },
        { label: 'Completed', value: stats.completed, icon: 'fas fa-flag-checkered', class: styles.iconPurple }
    ];

    if (loading) return (
        <div className={styles.dashboard}>
            <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '60vh' }}>
                <div className="spinner-border text-warning" role="status" style={{ width: '3rem', height: '3rem' }}></div>
                <p className="mt-3 text-muted fw-bold">Syncing your driving profile...</p>
            </div>
        </div>
    );

    return (
        <div className={styles.dashboard}>
            <div className={styles.welcomeSection}>
                <h1 className={styles.welcomeTitle}>
                    Hello, <span>{user ? user.first_name : 'Driver'}</span>!
                </h1>
                <p className={styles.welcomeText}>Welcome to your DriveDeal command center. Track your requests and manage your profile.</p>
            </div>

            <div className={styles.statsGrid}>
                {statCards.map((card, index) => (
                    <div key={index} className={styles.statCard}>
                        <div className={`${styles.statIcon} ${card.class}`}>
                            <i className={card.icon}></i>
                        </div>
                        <div className={styles.statInfo}>
                            <span className={styles.statLabel}>{card.label}</span>
                            <span className={styles.statValue}>{card.value}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.contentGrid}>
                <div className={styles.chartSection}>
                    <div className={styles.chartHeader}>
                        <h3 className={styles.chartTitle}>Request Analytics</h3>
                    </div>
                    <div className={styles.chartContainer}>
                        {statCards.map((card, index) => {
                            const maxVal = Math.max(...statCards.map(c => c.value)) || 1;
                            return (
                                <div key={index} className={styles.barWrapper}>
                                    <div 
                                        className={styles.bar} 
                                        style={{ 
                                            height: `${(card.value / maxVal) * 100}%`,
                                            background: card.label === 'Total Bookings' ? '#eab308' : 
                                                        card.label === 'Confirmed' ? '#22c55e' :
                                                        card.label === 'Pending' ? '#38bdf8' : '#a855f7',
                                            minHeight: card.value > 0 ? '10px' : '4px'
                                        }}
                                    ></div>
                                    <span className={styles.barLabel}>{card.label.split(' ')[0]}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className={styles.quickActions}>
                    <h3 className={styles.sectionTitle}>
                        <i className="fas fa-bolt text-warning"></i> Quick Navigation
                    </h3>
                    <div className={styles.actionList}>
                        <Link to="/cars" className={styles.actionItem}>
                            <div className={`${styles.actionIcon}`} style={{ background: 'rgba(255, 192, 0, 0.1)', color: '#ffc000' }}>
                                <i className="fas fa-search"></i>
                            </div>
                            <div className={styles.actionContent}>
                                <div className={styles.actionTitle}>Browse Cars</div>
                                <div className={styles.actionDesc}>Explore our premium inventory</div>
                            </div>
                        </Link>
                        <Link to="/user/mycars" className={styles.actionItem}>
                            <div className={`${styles.actionIcon}`} style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                                <i className="fas fa-history"></i>
                            </div>
                            <div className={styles.actionContent}>
                                <div className={styles.actionTitle}>My Requests</div>
                                <div className={styles.actionDesc}>Check status of your bookings</div>
                            </div>
                        </Link>
                        <Link to="/user/profile" className={styles.actionItem}>
                            <div className={`${styles.actionIcon}`} style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}>
                                <i className="fas fa-user-circle"></i>
                            </div>
                            <div className={styles.actionContent}>
                                <div className={styles.actionTitle}>Manage Profile</div>
                                <div className={styles.actionDesc}>Update your personal details</div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
