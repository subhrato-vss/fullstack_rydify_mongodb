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
        { title: 'Fleet Size', value: stats.vehicles, label: 'Total units', icon: 'fas fa-truck-pickup', class: styles.iconBlue, trend: '+2 this week' },
        { title: 'Cars', value: stats.cars, label: 'Sedans/SUVs', icon: 'fas fa-car', class: styles.iconBlue, trend: 'Stable' },
        { title: 'Bikes', value: stats.bikes, label: 'Cruisers/Sports', icon: 'fas fa-motorcycle', class: styles.iconBlue, trend: '+1 this week' },
        { title: 'Pending', value: stats.pending, label: 'Action required', icon: 'fas fa-clock', class: styles.iconYellow, trend: 'Needs review' },
        { title: 'Active', value: stats.confirmed, label: 'Confirmed bookings', icon: 'fas fa-check-circle', class: styles.iconGreen, trend: 'High demand' },
        { title: 'Revenue', value: stats.completed, label: 'Completed trips', icon: 'fas fa-coins', class: styles.iconCyan, trend: '₹ 12.5k est.' }
    ];

    const fleetHealth = [
        { label: 'Available', value: '85%', color: '#22c55e' },
        { label: 'In Maintenance', value: '10%', color: '#eab308' },
        { label: 'Out of Service', value: '5%', color: '#ef4444' }
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
                        <div className={styles.statCardHeader}>
                            <div className={`${styles.statIcon} ${card.class}`}>
                                <i className={card.icon}></i>
                            </div>
                            <span className={styles.trendTag}>{card.trend}</span>
                        </div>
                        <div className={styles.statInfo}>
                            <span className={styles.statValue}>{card.value}</span>
                            <span className={styles.statLabel}>{card.title}</span>
                            <span className={styles.statSubLabel}>{card.label}</span>
                        </div>
                    </div>
                ))}
            </div>


            <div className={styles.contentGrid}>
                {/* <div className={styles.chartSection}>
                    <div className={styles.chartHeader}>
                        <div>
                            <h3 className={styles.chartTitle}>Demand Analytics</h3>
                            <p className={styles.chartSubtitle}>Weekly booking trends across categories</p>
                        </div>
                        <div className={styles.chartPeriod}>
                            <span>Last 7 Days</span>
                            <i className="fas fa-calendar-alt"></i>
                        </div>
                    </div>
                    <div className={styles.chartContainer}>
                        {cards.slice(3).map((card, index) => (
                            <div key={index} className={styles.barWrapper}>
                                <div className={styles.barValue}>{card.value}</div>
                                <div className={styles.bar} style={{
                                    height: `${(card.value / maxVal) * 100}%`,
                                    background: card.class === styles.iconBlue ? 'linear-gradient(to top, #3b82f6, #60a5fa)' :
                                        card.class === styles.iconYellow ? 'linear-gradient(to top, #f59e0b, #fbbf24)' :
                                            card.class === styles.iconGreen ? 'linear-gradient(to top, #10b981, #34d399)' :
                                                card.class === styles.iconCyan ? 'linear-gradient(to top, #06b6d4, #22d3ee)' :
                                                    'linear-gradient(to top, #ef4444, #f87171)',
                                    minHeight: card.value > 0 ? '20px' : '8px'
                                }}>
                                    <div className={styles.barGlow}></div>
                                </div>
                                <span className={styles.barLabel}>{card.title}</span>
                            </div>
                        ))}
                    </div>
                </div> */}

                {/* <div className={styles.rightColumn}> */}
                {/* <div className={styles.healthSection}>
                        <h3 className={styles.sectionTitle}>Fleet Health</h3>
                        <div className={styles.healthBars}>
                            {fleetHealth.map((item, i) => (
                                <div key={i} className={styles.healthItem}>
                                    <div className={styles.healthInfo}>
                                        <span>{item.label}</span>
                                        <span>{item.value}</span>
                                    </div>
                                    <div className={styles.healthTrack}>
                                        <div 
                                            className={styles.healthFill} 
                                            style={{ width: item.value, backgroundColor: item.color }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div> */}

                {/* <div className={styles.recentSection}>
                        <h3 className={styles.sectionTitle}>
                            <i className="fas fa-bolt text-warning"></i> Quick Operations
                        </h3>
                        <div className={styles.activityList}>
                            <div className={styles.activityItem} onClick={() => navigate('/dealer/manage_cars')}>
                                <div className={styles.actionIcon} style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }}>
                                    <i className="fas fa-plus"></i>
                                </div>
                                <div className={styles.activityContent}>
                                    <div className={styles.activityTitle}>List New Vehicle</div>
                                    <div className={styles.activityTime}>Add cars or bikes to inventory</div>
                                </div>
                                <i className="fas fa-chevron-right styles.actionArrow"></i>
                            </div>
                            <div className={styles.activityItem} onClick={() => navigate('/dealer/car_req')}>
                                <div className={styles.actionIcon} style={{ background: 'rgba(234, 179, 8, 0.1)', color: '#facc15' }}>
                                    <i className="fas fa-tasks"></i>
                                </div>
                                <div className={styles.activityContent}>
                                    <div className={styles.activityTitle}>Review Inquiries</div>
                                    <div className={styles.activityTime}>{stats.pending} requests waiting for approval</div>
                                </div>
                                <i className="fas fa-chevron-right styles.actionArrow"></i>
                            </div>
                        </div>
                    </div> */}
                {/* </div> */}
            </div>

        </div>
    );
};

export default DealerDashboard;
