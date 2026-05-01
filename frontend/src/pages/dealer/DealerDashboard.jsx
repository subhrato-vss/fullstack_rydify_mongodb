import React, { useState, useEffect } from 'react';
import carService from '../../services/carService';
import { useAuth } from '../../context/AuthContext';
import styles from './DealerDashboard.module.css';

const DealerDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        vehicles: 0,
        pending: 0,
        approved: 0,
        completed: 0,
        cancelled: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await carService.getDealerStats();
                if (response.data.success) {
                    setStats(response.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const cards = [
        { title: 'My Vehicles', value: stats.vehicles, icon: 'fas fa-car', class: styles.iconBlue },
        { title: 'Pending', value: stats.pending, icon: 'fas fa-clock', class: styles.iconYellow },
        { title: 'Confirmed', value: stats.confirmed, icon: 'fas fa-check-circle', class: styles.iconGreen },
        { title: 'Completed', value: stats.completed, icon: 'fas fa-flag-checkered', class: styles.iconCyan },
        { title: 'Cancelled', value: stats.cancelled, icon: 'fas fa-times-circle', class: styles.iconRed }
    ];

    if (loading) return (
        <div className={styles.dashboard}>
            <div className="text-center p-5">
                <div className="spinner-border text-warning" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Loading your dashboard...</p>
            </div>
        </div>
    );

    const maxVal = Math.max(...cards.map(c => c.value)) || 1;

    return (
        <div className={styles.dashboard}>
            <div className={styles.welcomeSection}>
                <h1 className={styles.welcomeTitle}>Welcome back, <span>{user?.name || 'Partner'}</span>!</h1>
                <p className={styles.welcomeText}>Here's what's happening with your inventory and requests today.</p>
            </div>

            <div className={styles.statsGrid}>
                {cards.map((card, index) => (
                    <div key={index} className={styles.statCard}>
                        <div className={`${styles.statIcon} ${card.class}`}>
                            <i className={card.icon}></i>
                        </div>
                        <div className={styles.statInfo}>
                            <span className={styles.statLabel}>{card.title}</span>
                            <span className={styles.statValue}>{card.value}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.contentGrid}>
                <div className={styles.chartSection}>
                    <div className={styles.chartHeader}>
                        <h3 className={styles.chartTitle}>Business Performance</h3>
                    </div>
                    <div className={styles.chartContainer}>
                        {cards.map((card, index) => (
                            <div key={index} className={styles.barWrapper}>
                                <div className={styles.bar} style={{ 
                                    height: `${(card.value / maxVal) * 100}%`, 
                                    backgroundColor: card.class === styles.iconBlue ? '#3b82f6' : 
                                                    card.class === styles.iconYellow ? '#ffc107' :
                                                    card.class === styles.iconGreen ? '#22c55e' :
                                                    card.class === styles.iconCyan ? '#06b6d4' : '#ef4444',
                                    minHeight: card.value > 0 ? '10px' : '4px'
                                }}></div>
                                <span className={styles.barLabel}>{card.title}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.recentSection}>
                    <h3 className={styles.sectionTitle}>
                        <i className="fas fa-bolt text-warning"></i> Quick Actions
                    </h3>
                    <div className={styles.activityList}>
                        <div className={styles.activityItem}>
                            <div className={`${styles.activityDot}`} style={{ backgroundColor: '#ffc107' }}></div>
                            <div className={styles.activityContent}>
                                <div className={styles.activityTitle}>Add New Vehicle</div>
                                <div className={styles.activityTime}>List a new car in your inventory</div>
                            </div>
                        </div>
                        <div className={styles.activityItem}>
                            <div className={`${styles.activityDot}`} style={{ backgroundColor: '#3b82f6' }}></div>
                            <div className={styles.activityContent}>
                                <div className={styles.activityTitle}>Review Requests</div>
                                <div className={styles.activityTime}>Check pending buyer inquiries</div>
                            </div>
                        </div>
                        <div className={styles.activityItem}>
                            <div className={`${styles.activityDot}`} style={{ backgroundColor: '#22c55e' }}></div>
                            <div className={styles.activityContent}>
                                <div className={styles.activityTitle}>Update Profile</div>
                                <div className={styles.activityTime}>Keep your dealer info current</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DealerDashboard;
