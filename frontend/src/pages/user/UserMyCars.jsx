import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import carService from '../../services/carService';
import styles from './UserMyCars.module.css';

const UserMyCars = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [reviewData, setReviewData] = useState({ carId: '', rating: '5', feedback: '' });
    const [submitting, setSubmitting] = useState(false);

    const [selectedCar, setSelectedCar] = useState(null);
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const [categories, setCategories] = useState([]);

    const getImageUrl = (photo) => {
        if (!photo) return '/assets/img/cars/car_placeholder.png';
        if (photo.startsWith('http')) return photo;
        const cleanPath = photo.startsWith('/') ? photo : `/uploads/${photo}`;
        return `http://localhost:5000${cleanPath}`;
    };

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

    const fetchBookings = useCallback(async () => {
        try {
            setLoading(true);
            const response = await carService.getUserBookings();
            if (response.data.success) {
                setBookings(response.data.data || []);
            }
        } catch (error) {
            console.error("Error fetching bookings:", error);
            toast.error("Failed to load your garage");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBookings();
        fetchCategories();
    }, [fetchBookings]);

    const openInfo = (car) => {
        setSelectedCar(car);
        setShowOffcanvas(true);
    };

    const closeInfo = () => {
        setShowOffcanvas(false);
        setTimeout(() => setSelectedCar(null), 300);
    };

    const openReviewModal = (carId, existingReview = null) => {
        if (existingReview) {
            setReviewData({ 
                carId, 
                rating: existingReview.rating.toString(), 
                feedback: existingReview.feedback 
            });
        } else {
            setReviewData({ carId, rating: '5', feedback: '' });
        }
        setShowModal(true);
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const loadingToast = toast.loading("Processing your feedback...");
        try {
            const response = await carService.addReview(reviewData);
            if (response.data.success) {
                toast.success(response.data.message, { id: loadingToast });
                setShowModal(false);
                fetchBookings();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit review", { id: loadingToast });
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Pending': return styles.statusPending;
            case 'Confirmed': return styles.statusApproved;
            case 'Cancelled': return styles.statusCancelled;
            case 'Completed': return styles.statusCompleted;
            default: return '';
        }
    };

    if (loading) return (
        <div className={styles.loaderContainer}>
            <div className={styles.spinner}></div>
            <p>Syncing your garage...</p>
        </div>
    );

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                <div className={styles.pageHeader}>
                    <div className={styles.headerInfo}>
                        <h1 className={styles.pageTitle}>My <span className={styles.gradientText}>Reservations</span></h1>
                        <p>Manage your active and past vehicle bookings</p>
                    </div>
                    <div className={styles.headerBadge}>
                        {bookings.length} Bookings
                    </div>
                </div>

                {bookings.length > 0 ? (
                    <div className={styles.grid}>
                        {bookings.map((booking) => (
                            <div key={booking._id} className={styles.card}>
                                <div className={styles.imageWrapper}>
                                    <div className={`${styles.statusBadge} ${getStatusClass(booking.status)}`}>
                                        {booking.status}
                                    </div>
                                    <button className={styles.infoBtn} onClick={() => openInfo(booking.car)} title="View Car Details">
                                        <i className="fas fa-eye"></i>
                                    </button>
                                    <img
                                        src={getImageUrl(booking.car?.photo)}
                                        alt={booking.car?.name || "Car"}
                                        className={styles.image}
                                    />
                                </div>

                                <div className={styles.content}>
                                    <div className={styles.carHeader}>
                                        <h3 className={styles.carName}>{booking.car?.brand} {booking.car?.name}</h3>
                                        <span className={styles.priceTag}>₹{booking.car?.price?.toLocaleString()}</span>
                                    </div>

                                    <div className={styles.bookingMeta}>
                                        <div className={styles.metaRow}>
                                            <i className="fas fa-calendar-alt"></i>
                                            <span>{new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className={styles.metaRow}>
                                            <i className="fas fa-receipt"></i>
                                            <span>ID: {booking.paymentId?.substring(0, 15)}...</span>
                                        </div>
                                    </div>

                                    <div className={styles.totalBox}>
                                        <label>Total Amount Paid</label>
                                        <span className={styles.amount}>₹{booking.totalAmount?.toLocaleString()}</span>
                                    </div>

                                    {booking.status === 'Completed' && (
                                        <button 
                                            className={booking.userReview ? styles.editReviewBtn : styles.reviewBtn} 
                                            onClick={() => openReviewModal(booking.car?._id, booking.userReview)}
                                        >
                                            <i className={booking.userReview ? "fas fa-edit" : "fas fa-star"}></i> 
                                            {booking.userReview ? ' Edit My Review' : ' Rate Your Ride'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIconArea}>
                            <i className="fas fa-car-rear"></i>
                            <div className={styles.pulseRing}></div>
                        </div>
                        <h3>No Bookings Found</h3>
                        <p>Your garage is currently empty. Ready to hit the road?</p>
                        <Link to="/cars" className={styles.browseBtn}>
                            Explore Fleet
                            <i className="fas fa-arrow-right"></i>
                        </Link>
                    </div>
                )}
            </div>

            {/* Review Modal */}
            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContainer}>
                        <div className={styles.modalHeader}>
                            <h3>Rate Your Experience</h3>
                            <button className={styles.modalClose} onClick={() => setShowModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <form onSubmit={handleReviewSubmit} className={styles.modalBody}>
                            <div className={styles.ratingBox}>
                                {[1, 2, 3, 4, 5].map(v => (
                                    <button
                                        key={v}
                                        type="button"
                                        className={`${styles.starBtn} ${reviewData.rating >= v ? styles.starBtnActive : ''}`}
                                        onClick={() => setReviewData({ ...reviewData, rating: v.toString() })}
                                    >
                                        <i className="fas fa-star"></i>
                                    </button>
                                ))}
                            </div>

                            <div className={styles.inputGroup}>
                                <label>Write Your Feedback</label>
                                <textarea
                                    className={styles.textarea}
                                    rows="4"
                                    placeholder="Tell us about your journey..."
                                    value={reviewData.feedback}
                                    onChange={(e) => setReviewData({ ...reviewData, feedback: e.target.value })}
                                    required
                                ></textarea>
                            </div>

                            <button type="submit" className={styles.submitBtn} disabled={submitting}>
                                {submitting ? 'Sending Feedback...' : 'Post Review'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modern Offcanvas Detail View */}
            <div className={`${styles.offcanvasOverlay} ${showOffcanvas ? styles.overlayVisible : ''}`} onClick={closeInfo}></div>
            <div className={`${styles.offcanvas} ${showOffcanvas ? styles.offcanvasOpen : ''}`}>
                {selectedCar && (
                    <div className={styles.offcanvasContent}>
                        <div className={styles.offHeader}>
                            <div className={styles.offTitle}>
                                <h2>Vehicle Specifications</h2>
                                <p>{selectedCar.brand} {selectedCar.name}</p>
                            </div>
                            <button className={styles.offClose} onClick={closeInfo}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        
                        <div className={styles.offBody}>
                            <div className={styles.offImageCard}>
                                <img src={getImageUrl(selectedCar.photo)} alt={selectedCar.name} />
                                <div className={styles.priceFloating}>₹{selectedCar.price?.toLocaleString()} <span>/ day</span></div>
                            </div>

                            <div className={styles.specGrid}>
                                <div className={styles.specItem}>
                                    <div className={styles.specIcon}><i className="fas fa-calendar-alt"></i></div>
                                    <div className={styles.specText}>
                                        <label>Model Year</label>
                                        <span>{selectedCar.model}</span>
                                    </div>
                                </div>
                                <div className={styles.specItem}>
                                    <div className={styles.specIcon}><i className="fas fa-gas-pump"></i></div>
                                    <div className={styles.specText}>
                                        <label>Fuel Type</label>
                                        <span>{selectedCar.fuelType}</span>
                                    </div>
                                </div>
                                <div className={styles.specItem}>
                                    <div className={styles.specIcon}><i className="fas fa-cog"></i></div>
                                    <div className={styles.specText}>
                                        <label>Transmission</label>
                                        <span>{selectedCar.transmissionType}</span>
                                    </div>
                                </div>
                                <div className={styles.specItem}>
                                    <div className={styles.specIcon}><i className="fas fa-microchip"></i></div>
                                    <div className={styles.specText}>
                                        <label>Engine</label>
                                        <span>{selectedCar.engineCapacity} cc</span>
                                    </div>
                                </div>
                                <div className={styles.specItem}>
                                    <div className={styles.specIcon}><i className="fas fa-road"></i></div>
                                    <div className={styles.specText}>
                                        <label>KM Driven</label>
                                        <span>{selectedCar.kmDriven?.toLocaleString()} km</span>
                                    </div>
                                </div>
                                <div className={styles.specItem}>
                                    <div className={styles.specIcon}><i className="fas fa-tag"></i></div>
                                    <div className={styles.specText}>
                                        <label>Category</label>
                                        <span>{categories.find(c => c._id == selectedCar.category)?.name || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.additionalInfo}>
                                <div className={styles.infoBlock}>
                                    <i className="fas fa-fingerprint"></i>
                                    <div>
                                        <label>Chassis Number</label>
                                        <p>{selectedCar.chassisNumber}</p>
                                    </div>
                                </div>
                                <div className={styles.infoBlock}>
                                    <i className="fas fa-history"></i>
                                    <div>
                                        <label>Accidental History</label>
                                        <p>{selectedCar.accidentalHistory || 'None Reported'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserMyCars;
