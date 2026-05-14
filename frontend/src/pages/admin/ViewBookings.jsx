import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import styles from './AdminShared.module.css';

const ViewBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('all');

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);
                const response = await adminService.getBookings({ status });
                if (response.data.success) {
                    setBookings(response.data.data || []);
                }
            } catch (error) {
                console.error('Failed to fetch bookings:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, [status]);

    const statusTabs = [
        { id: 'all', label: 'All Bookings', icon: 'fas fa-list-ul' },
        { id: 'Pending', label: 'Pending', icon: 'fas fa-clock' },
        { id: 'Confirmed', label: 'Confirmed', icon: 'fas fa-check-circle' },
        { id: 'Completed', label: 'Completed', icon: 'fas fa-flag-checkered' },
        { id: 'Cancelled', label: 'Cancelled', icon: 'fas fa-times-circle' },
    ];

    const getStatusStyle = (status) => {
        const s = status?.toLowerCase();
        if (s === 'completed' || s === 'approved') return `${styles.statusBadge} ${styles.statusCompleted}`;
        if (s === 'pending') return `${styles.statusBadge} ${styles.statusPending}`;
        if (s === 'cancelled' || s === 'rejected') return `${styles.statusBadge} ${styles.statusCancelled}`;
        return styles.statusBadge;
    };

    if (loading) return (
        <div className={styles.loadingContainer}>
            <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <p>Retrieving transaction records...</p>
        </div>
    );

    return (
        <div className={styles.container}>
            <div className={styles.pageHeader}>
                <div>
                    <h2 className={styles.title}>Booking Intelligence</h2>
                    <p className={styles.subtitle}>Monitor and manage all platform transactions</p>
                </div>
                <div className={styles.statsBadge}>
                    <i className="fas fa-calendar-check"></i>
                    <span>Total Activity: <strong>{bookings.length}</strong></span>
                </div>
            </div>

            <div className={styles.filterTabs}>
                {statusTabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`${styles.filterTab} ${status === tab.id ? styles.activeTab : ''}`}
                        onClick={() => setStatus(tab.id)}
                    >
                        <i className={tab.icon}></i>
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className={styles.tableCard}>
                <div className={styles.tableResponsive}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.th}>Vehicle</th>
                                <th className={styles.th}>Customer</th>
                                <th className={styles.th}>Dealer</th>
                                <th className={styles.th}>Schedule</th>
                                <th className={styles.th}>Amount</th>
                                <th className={styles.th}>Status</th>
                                {/* <th className={styles.th}>Action</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.length > 0 ? (
                                bookings.map((booking) => (
                                    <tr key={booking._id} className={styles.tr}>
                                        <td className={styles.td}>
                                            <div className={styles.vehicleCell}>
                                                {/* <img
                                                    src={`http://localhost:5000/categoryPic/${booking.car?.photo}`}
                                                    alt="vehicle"
                                                    className={styles.miniImg}
                                                // onError={(e) => e.target.src = 'https://via.placeholder.com/60x40'}
                                                /> */}
                                                <div className={styles.cellInfo}>
                                                    <span className={styles.primaryText}>{booking.car?.brand} {booking.car?.name}</span>
                                                    <span className={styles.secondaryText}>{booking.car?.type || 'Car'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={styles.td}>
                                            <div className={styles.cellInfo}>
                                                <span className={styles.primaryText}>{booking.user?.first_name} {booking.user?.last_name}</span>
                                                <span className={styles.secondaryText}>{booking.user?.email}</span>
                                            </div>
                                        </td>
                                        <td className={styles.td}>
                                            <span className={styles.primaryText}>{booking.dealer?.name}</span>
                                        </td>
                                        <td className={styles.td}>
                                            <div className={styles.cellInfo}>
                                                <span className={styles.primaryText}>{new Date(booking.startDate).toLocaleDateString()}</span>
                                                <span className={styles.secondaryText}>to {new Date(booking.endDate).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className={styles.td}>
                                            <span className={styles.priceText}>₹{booking.totalAmount?.toLocaleString()}</span>
                                        </td>
                                        <td className={styles.td}>
                                            <span className={getStatusStyle(booking.status)}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        {/* <td className={styles.td}>
                                            <button className={styles.btnIconAction} title="View Details">
                                                <i className="fas fa-eye"></i>
                                            </button>
                                        </td> */}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className={styles.tdEmpty}>
                                        <div className={styles.emptyTableState}>
                                            <i className="fas fa-calendar-times"></i>
                                            <p>No transactions found for the selected status.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default ViewBookings;

