import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import carService from '../services/carService';
import { toast } from 'react-hot-toast';
import styles from './SingleCar.module.css';

const SingleCar = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Booking States
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [bookingDates, setBookingDates] = useState({ startDate: '', endDate: '' });
    const [totalDays, setTotalDays] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);

    const getImageUrl = (photo) => {
        if (!photo) return '/assets/img/cars/car_placeholder.png';
        if (photo.startsWith('http')) return photo;
        const cleanPath = photo.startsWith('/') ? photo : `/uploads/${photo}`;
        return `http://localhost:5000${cleanPath}`;
    };

    const fetchCar = useCallback(async () => {
        try {
            setLoading(true);
            const response = await carService.getSingleCar(id);
            if (response.data.success) {
                setCar(response.data.data);
            } else {
                setError('Vehicle not found');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch car details');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchCar();
    }, [fetchCar]);

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        const newDates = { ...bookingDates, [name]: value };
        setBookingDates(newDates);

        if (newDates.startDate && newDates.endDate) {
            const start = new Date(newDates.startDate);
            const end = new Date(newDates.endDate);

            if (end >= start) {
                const diffTime = Math.abs(end - start);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                setTotalDays(diffDays);
                setTotalAmount(diffDays * car.price);
            } else {
                setTotalDays(0);
                setTotalAmount(0);
            }
        }
    };

    const handleBooking = () => {
        if (!isAuthenticated) {
            toast.error("Please login to book this vehicle");
            navigate('/user/login', { state: { from: `/single_car/${id}` } });
            return;
        }
        setShowBookingModal(true);
    };

    const processPayment = (e) => {
        e.preventDefault();

        if (totalAmount <= 0) {
            toast.error("Please select valid dates");
            return;
        }

        const options = {
            key: "rzp_test_dRWiKHS7zr2Gki",
            amount: totalAmount * 100,
            currency: "INR",
            name: "Rydify Premium",
            description: `Booking for ${car.brand} ${car.name}`,
            image: "/favicon.png",
            handler: async function (response) {
                const loadingToast = toast.loading('Processing your booking...');
                try {
                    const bookingData = {
                        carId: car._id,
                        dealerId: car.dealer?._id || car.dealer,
                        startDate: bookingDates.startDate,
                        endDate: bookingDates.endDate,
                        totalAmount: totalAmount,
                        paymentId: response.razorpay_payment_id
                    };

                    const res = await carService.addBooking(bookingData);
                    if (res.data.success) {
                        toast.success("Booking confirmed successfully!", { id: loadingToast });
                        setShowBookingModal(false);
                        navigate('/user/booking_success', {
                            state: {
                                paymentId: response.razorpay_payment_id,
                                carName: `${car.brand} ${car.name}`
                            }
                        });
                    }
                } catch (err) {
                    toast.error("Payment successful but booking failed. Please contact support.", { id: loadingToast });
                }
            },
            prefill: {
                name: user?.name || "",
                email: user?.email || "",
            },
            theme: {
                color: "#38bdf8"
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    if (loading) return (
        <div className={styles.loaderContainer}>
            <div className={styles.spinner}></div>
            <p>Gathering specifications...</p>
        </div>
    );

    if (error) return (
        <div className={styles.errorWrapper}>
            <i className="fas fa-exclamation-triangle"></i>
            <h2>Oops! Something went wrong</h2>
            <p>{error}</p>
            <button onClick={() => navigate('/featured')} className={styles.backBtn}>Browse Other Cars</button>
        </div>
    );

    if (!car) return null;

    const specs = [
        { label: 'Year/Model', value: car.model, icon: 'fa-calendar-alt' },
        { label: 'Fuel Type', value: car.fuelType, icon: 'fa-gas-pump' },
        { label: 'Transmission', value: car.transmissionType, icon: 'fa-cog' },
        { label: 'Engine', value: `${car.engineCapacity} cc`, icon: 'fa-microchip' },
        { label: 'Kilometers', value: `${car.kmDriven?.toLocaleString()} km`, icon: 'fa-road' },
        { label: 'Mileage', value: `${car.mileage} km/l`, icon: 'fa-tachometer-alt' },
        { label: 'Owners', value: car.ownerType, icon: 'fa-user-friends' },
        { label: 'Category', value: car.category?.name || 'Standard', icon: 'fa-tag' },
    ];

    return (
        <div className={styles.pageContainer}>
            {/* Hero Section / Breadcrumb (Styled like About Page) */}
            <section className={styles.heroSection}>
                <div className={styles.heroGlow}></div>
                <div className={styles.container}>
                    <div className={styles.heroContent}>
                        <span className={styles.badge}>{car.category?.name || 'Premium Fleet'}</span>
                        <h1 className={`${styles.heroTitle} text-white`}>
                            {car.brand} <br />
                            <span className={styles.gradientText}>{car.name}</span>
                        </h1>
                        <p className={styles.heroDesc}>
                            Experience unparalleled comfort and performance with our carefully
                            curated {car.brand} lineup. Perfect for your next adventure.
                        </p>
                        <div className={styles.breadcrumb}>
                            <Link to="/">Home</Link>
                            <i className="fas fa-chevron-right"></i>
                            <Link to="/featured">Inventory</Link>
                            <i className="fas fa-chevron-right"></i>
                            <span>{car.name}</span>
                        </div>
                    </div>
                </div>
            </section>

            <div className={styles.mainContent}>
                <div className={styles.topSection}>
                    {/* Visual Area */}
                    <div className={styles.visualColumn}>
                        <div className={styles.imageCard}>
                            <img src={getImageUrl(car.photo)} alt={car.name} className={styles.mainImage} />
                            <div className={styles.statusBadge}>{car.status}</div>
                            <div className={styles.priceFloating}>
                                <span>Starting at</span>
                                <h3>₹{car.price?.toLocaleString()} <span>/ day</span></h3>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats & CTA */}
                    <div className={styles.ctaColumn}>
                        <div className={styles.ctaGlassCard}>
                            <div className={styles.ctaHeader}>
                                <span className={styles.miniLabel}>Premium Selection</span>
                                <h2 className='text-white'>Ready for your journey?</h2>
                                <p>Flexible rental periods with premium insurance coverage included as standard.</p>
                            </div>

                            <div className={styles.ctaActions}>
                                <button className={styles.mainBookBtn} onClick={handleBooking}>
                                    <i className="fas fa-bolt"></i>
                                    Book This Vehicle
                                </button>
                                <div className={styles.secureBadge}>
                                    <i className="fas fa-shield-check"></i>
                                    Secure Transaction via SSL
                                </div>
                            </div>

                            <div className={styles.quickFeatures}>
                                <div className={styles.qfItem}>
                                    <i className="fas fa-check-circle"></i>
                                    <span>Instant Confirmation</span>
                                </div>
                                <div className={styles.qfItem}>
                                    <i className="fas fa-check-circle"></i>
                                    <span>Cleaned & Sanitized</span>
                                </div>
                                <div className={styles.qfItem}>
                                    <i className="fas fa-check-circle"></i>
                                    <span>24/7 Roadside Support</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detailed Specifications */}
                <section className={styles.detailsSection}>
                    <div className={styles.sectionHeading}>
                        <i className="fas fa-list-ul"></i>
                        <h2>Technical Specifications</h2>
                    </div>
                    <div className={styles.specsGrid}>
                        {specs.map((spec, index) => (
                            <div key={index} className={styles.specTile}>
                                <div className={styles.tileIcon}>
                                    <i className={`fas ${spec.icon}`}></i>
                                </div>
                                <div className={styles.tileContent}>
                                    <span className={styles.tileLabel}>{spec.label}</span>
                                    <span className={styles.tileValue}>{spec.value || 'N/A'}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Dealer Portfolio */}
                <section className={styles.dealerSection}>
                    <div className={styles.dealerGlass}>
                        <div className={styles.dealerInfo}>
                            <span className={styles.verifiedBadge}>
                                <i className="fas fa-check-circle"></i> Verified Dealer
                            </span>
                            <h2 className={`${styles.dealerName} text-white`}>{car.dealer?.name}</h2>
                            <p className={styles.dealerBio}>
                                A premium partner providing high-quality vehicles and exceptional customer service.
                            </p>
                        </div>
                        <div className={styles.dealerContact}>
                            <div className={styles.contactChip}>
                                <i className="fas fa-envelope"></i>
                                {car.dealer?.email}
                            </div>
                            <div className={styles.contactChip}>
                                <i className="fas fa-phone"></i>
                                {car.dealer?.mobile}
                            </div>
                            <div className={styles.contactChip}>
                                <i className="fas fa-map-marker-alt"></i>
                                {car.dealer?.address}, {car.dealer?.city}
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Modern Booking Modal */}
            {showBookingModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContainer}>
                        <div className={styles.modalHeader}>
                            <div className={styles.modalTitleArea}>
                                <h3 className='text-white'>Reserve Your Ride</h3>
                                <p>{car.brand} {car.name}</p>
                            </div>
                            <button className={styles.closeModal} onClick={() => setShowBookingModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <form onSubmit={processPayment} className={styles.bookingForm}>
                            <div className={styles.modalBody}>
                                <div className={styles.dateSelector}>
                                    <div className={styles.dateField}>
                                        <label>Pick-up Date</label>
                                        <input
                                            type="date"
                                            name="startDate"
                                            required
                                            min={new Date().toISOString().split('T')[0]}
                                            onChange={handleDateChange}
                                        />
                                    </div>
                                    <div className={styles.dateField}>
                                        <label>Return Date</label>
                                        <input
                                            type="date"
                                            name="endDate"
                                            required
                                            min={bookingDates.startDate || new Date().toISOString().split('T')[0]}
                                            onChange={handleDateChange}
                                        />
                                    </div>
                                </div>

                                {totalDays > 0 && (
                                    <div className={styles.invoiceSummary}>
                                        <div className={styles.invoiceRow}>
                                            <span>Rental Duration</span>
                                            <span>{totalDays} Days</span>
                                        </div>
                                        <div className={styles.invoiceRow}>
                                            <span>Daily Rate</span>
                                            <span>₹{car.price?.toLocaleString()}</span>
                                        </div>
                                        <div className={styles.invoiceTotal}>
                                            <span>Grand Total</span>
                                            <span>₹{totalAmount?.toLocaleString()}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className={styles.modalFooter}>
                                <button type="submit" className={styles.finalizeBtn} disabled={totalAmount <= 0}>
                                    Confirm & Pay ₹{totalAmount?.toLocaleString()}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SingleCar;
