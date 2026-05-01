import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import carService from '../../services/carService';
import styles from './DealerCarRequests.module.css';
import { toast } from 'react-hot-toast';

const DealerCarRequests = () => {
    const location = useLocation();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const getStatusFromPath = () => {
        const path = location.pathname;
        if (path.includes('approved')) return 'Confirmed';
        if (path.includes('completed')) return 'Completed';
        if (path.includes('cancelled')) return 'Cancelled';
        return 'Pending';
    };

    const status = getStatusFromPath();

    const [selectedCar, setSelectedCar] = useState(null);
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchRequests();
        fetchCategories();
    }, [status]);

    const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: '', bookingId: null, carId: null });

    const fetchCategories = async () => {
        try {
            const response = await carService.getCategories();
            if (response.data.success) {
                setCategories(response.data.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const fetchRequests = async () => {
        try {
            setLoading(true);
            let response;
            switch (status) {
                case 'Confirmed': response = await carService.getDealerApprovedRequests(); break;
                case 'Completed': response = await carService.getDealerCompletedRequests(); break;
                case 'Cancelled': response = await carService.getDealerCancelledRequests(); break;
                default: response = await carService.getDealerRequests(); break;
            }
            if (response.data.success) {
                setRequests(response.data.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch requests:', error);
            toast.error("Failed to load bookings");
        } finally {
            setLoading(false);
        }
    };

    const openInfo = (car) => {
        setSelectedCar(car);
        setShowOffcanvas(true);
    };

    const closeInfo = () => {
        setShowOffcanvas(false);
        setTimeout(() => setSelectedCar(null), 300);
    };

    const triggerConfirm = (id, carId, type) => {
        setConfirmModal({ isOpen: true, type, bookingId: id, carId });
    };

    const handleUpdateStatus = async (id, carId, newStatus) => {
        const loadingToast = toast.loading(`Updating to ${newStatus}...`);
        try {
            const response = await carService.updateRequestStatus(id, newStatus);
            if (response.data.success) {
                toast.success(`Booking successfully ${newStatus.toLowerCase()}`, { id: loadingToast });
                setRequests(requests.filter(r => r._id !== id));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update status", { id: loadingToast });
        }
    };

    const executeConfirmedStatus = () => {
        const { bookingId, carId, type } = confirmModal;
        handleUpdateStatus(bookingId, carId, type);
        setConfirmModal({ isOpen: false, type: '', bookingId: null, carId: null });
    };

    const getStatusBadgeClass = (s) => {
        switch (s) {
            case 'Confirmed': return styles.statusConfirmed;
            case 'Pending': return styles.statusPending;
            case 'Cancelled': return styles.statusCancelled;
            case 'Completed': return styles.statusCompleted;
            default: return '';
        }
    };

    const getImageUrl = (photo) => {
        if (!photo) return '/assets/img/product/product_2_2.png';
        if (photo.startsWith('http')) return photo;
        const cleanPath = photo.startsWith('/') ? photo : `/uploads/${photo}`;
        return `http://localhost:5000${cleanPath}`;
    };

    if (loading) return (
        <div className={styles.pageContainer}>
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-3 text-muted">Loading {status} bookings...</p>
            </div>
        </div>
    );

    return (
        <div className={styles.pageContainer}>
            <div className={styles.header}>
                <div className={styles.titleSection}>
                    <h1>{status === 'Confirmed' ? 'Approved' : status} Bookings</h1>
                    <p>Manage and track your customer rental bookings</p>
                </div>
                <div className={`${styles.statusBadge} ${getStatusBadgeClass(status)}`}>
                    {requests.length} Total
                </div>
            </div>

            <div className={styles.grid}>
                {requests.length === 0 ? (
                    <div className={styles.emptyState}>
                        <i className="fas fa-calendar-times"></i>
                        <h3>No {status.toLowerCase()} bookings found</h3>
                        <p>When customers book your cars, they will appear here.</p>
                    </div>
                ) : (
                    requests.map(req => (
                        <div key={req._id} className={styles.card}>
                            <div className={styles.cardHeader}>
                                <img
                                    src={getImageUrl(req.car?.photo)}
                                    alt="car"
                                    className={styles.carThumb}
                                />
                                <div className={styles.carInfo}>
                                    <h3>{req.car?.brand} {req.car?.name}</h3>
                                    <span className={styles.price}>Rs. {req.car?.price?.toLocaleString()} / day</span>
                                </div>
                                <button className={styles.btnInfoSmall} onClick={() => openInfo(req.car)} title="View Car Details">
                                    <i className="fas fa-info-circle"></i>
                                </button>
                            </div>

                            <div className={styles.cardBody}>
                                <div className={styles.userInfo}>
                                    <h4>Customer Details</h4>
                                    <div className={styles.userDetail}>
                                        <i className="fas fa-user"></i>
                                        <span>{req.user?.first_name} {req.user?.last_name}</span>
                                    </div>
                                    <div className={styles.userDetail}>
                                        <i className="fas fa-envelope"></i>
                                        <span>{req.user?.email}</span>
                                    </div>
                                    <div className={styles.userDetail}>
                                        <i className="fas fa-phone"></i>
                                        <span>{req.user?.mobile}</span>
                                    </div>
                                </div>

                                <div className={styles.bookingMeta}>
                                    <div className={styles.metaItem}>
                                        <span className={styles.metaLabel}>Duration</span>
                                        <span className={styles.metaValue}>
                                            {(() => {
                                                const start = new Date(req.startDate);
                                                const end = new Date(req.endDate);
                                                const diffTime = Math.abs(end - start);
                                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                                                return `${diffDays} ${diffDays === 1 ? 'Day' : 'Days'}`;
                                            })()}
                                        </span>
                                    </div>
                                    <div className={styles.metaItem}>
                                        <span className={styles.metaLabel}>Dates</span>
                                        <span className={styles.metaValue} style={{ fontSize: '0.85rem' }}>
                                            {new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className={styles.metaItem}>
                                        <span className={styles.metaLabel}>Total Paid</span>
                                        <span className={styles.metaValue} style={{ color: '#10b981' }}>
                                            Rs. {req.totalAmount?.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className={styles.metaItem}>
                                        <span className={styles.metaLabel}>Payment ID</span>
                                        <span className={styles.metaValue} style={{ fontSize: '0.7rem' }}>{req.paymentId}</span>
                                    </div>
                                </div>

                                {status === 'Pending' && (
                                    <div className={styles.cardFooter}>
                                        <button className={styles.btnApprove} onClick={() => handleUpdateStatus(req._id, req.car?._id, 'Confirmed')}>Confirm</button>
                                        <button className={styles.btnCancel} onClick={() => triggerConfirm(req._id, req.car?._id, 'Cancelled')}>Cancel</button>
                                    </div>
                                )}
                                {status === 'Confirmed' && (
                                    <div className={styles.cardFooter}>
                                        {/* <button className={styles.btnInfoOutline} onClick={() => openInfo(req.car)}>View Vehicle</button> */}
                                        <button className={styles.btnComplete} onClick={() => triggerConfirm(req._id, req.car?._id, 'Completed')}>Mark Completed</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Offcanvas Detail View */}
            <div className={`${styles.offcanvasOverlay} ${showOffcanvas ? styles.overlayVisible : ''}`} onClick={closeInfo}></div>
            <div className={`${styles.offcanvas} ${showOffcanvas ? styles.offcanvasOpen : ''}`}>
                {selectedCar && (
                    <div className={styles.offcanvasContent}>
                        <div className={styles.offcanvasHeader}>
                            <h2>Vehicle Details</h2>
                            <button className={styles.btnClose} onClick={closeInfo}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className={styles.offcanvasBody}>
                            <div className={styles.detailImage}>
                                <img src={getImageUrl(selectedCar.photo)} alt={selectedCar.name} />
                            </div>
                            <div className={styles.detailTitle}>
                                <span className={styles.brandBadge}>{selectedCar.brand}</span>
                                <h3>{selectedCar.name} ({selectedCar.model})</h3>
                                <div className={styles.detailPrice}>₹{selectedCar.price?.toLocaleString()} <span>/ day</span></div>
                            </div>

                            <div className={styles.specGrid}>
                                <div className={styles.specItem}>
                                    <span className={styles.specLabel}>Category</span>
                                    <span className={styles.specVal}>{categories.find(c => c._id == selectedCar.category)?.name || 'N/A'}</span>
                                </div>
                                <div className={styles.specItem}>
                                    <span className={styles.specLabel}>Transmission</span>
                                    <span className={styles.specVal}>{selectedCar.transmissionType}</span>
                                </div>
                                <div className={styles.specItem}>
                                    <span className={styles.specLabel}>Fuel Type</span>
                                    <span className={styles.specVal}>{selectedCar.fuelType}</span>
                                </div>
                                <div className={styles.specItem}>
                                    <span className={styles.specLabel}>Mileage</span>
                                    <span className={styles.specVal}>{selectedCar.mileage} km/l</span>
                                </div>
                                <div className={styles.specItem}>
                                    <span className={styles.specLabel}>KM Driven</span>
                                    <span className={styles.specVal}>{selectedCar.kmDriven} km</span>
                                </div>
                                <div className={styles.specItem}>
                                    <span className={styles.specLabel}>Engine</span>
                                    <span className={styles.specVal}>{selectedCar.engineCapacity} cc</span>
                                </div>
                                <div className={styles.specItem}>
                                    <span className={styles.specLabel}>Owners</span>
                                    <span className={styles.specVal}>{selectedCar.ownerType}</span>
                                </div>
                                <div className={styles.specItem}>
                                    <span className={styles.specLabel}>Status</span>
                                    <span className={styles.specVal}>{selectedCar.status}</span>
                                </div>
                            </div>

                            <div className={styles.additionalDetails}>
                                <div className={styles.detailRow}>
                                    <i className="fas fa-fingerprint"></i>
                                    <div>
                                        <label>Chassis Number</label>
                                        <p>{selectedCar.chassisNumber}</p>
                                    </div>
                                </div>
                                <div className={styles.detailRow}>
                                    <i className="fas fa-shield-alt"></i>
                                    <div>
                                        <label>Accidental History</label>
                                        <p>{selectedCar.accidentalHistory}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Custom Confirmation Modal */}
            {confirmModal.isOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.confirmModal}>
                        <div className={styles.modalIcon}>
                            {confirmModal.type === 'Cancelled' ? 
                                <i className="fas fa-exclamation-circle text-danger"></i> : 
                                <i className="fas fa-check-circle text-success"></i>
                            }
                        </div>
                        <h3>Confirm {confirmModal.type === 'Cancelled' ? 'Cancellation' : 'Completion'}</h3>
                        <p>
                            {confirmModal.type === 'Cancelled' ? 
                                "Are you sure you want to cancel this booking? This action cannot be undone." : 
                                "Are you sure you want to mark this booking as completed? The vehicle will be released back to inventory."
                            }
                        </p>
                        <div className={styles.modalActions}>
                            <button className={styles.btnModalSecondary} onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}>
                                Dismiss
                            </button>
                            <button 
                                className={confirmModal.type === 'Cancelled' ? styles.btnModalDanger : styles.btnModalPrimary}
                                onClick={executeConfirmedStatus}
                            >
                                Confirm {confirmModal.type}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DealerCarRequests;
