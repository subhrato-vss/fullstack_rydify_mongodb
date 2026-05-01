import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import styles from './AdminShared.module.css';
import ConfirmModal from '../../components/ui/ConfirmModal';
import Offcanvas from '../../components/ui/Offcanvas';
import { toast } from 'react-hot-toast';

const ManageDealers = () => {
    const [dealers, setDealers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [currentDealer, setCurrentDealer] = useState(null);

    useEffect(() => {
        fetchDealers();
    }, []);

    const fetchDealers = async () => {
        try {
            setLoading(true);
            const response = await adminService.getDealers();
            if (response.data.success) {
                setDealers(response.data.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch dealers:', error);
            toast.error("Failed to fetch dealers");
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
        try {
            const response = await adminService.updateDealerStatus(id, newStatus);
            if (response.data.success) {
                setDealers(dealers.map(d =>
                    d._id === id ? { ...d, status: newStatus } : d
                ));
                // Update currentDealer if it's the one being toggled and details are open
                if (currentDealer && currentDealer._id === id) {
                    setCurrentDealer({ ...currentDealer, status: newStatus });
                }
                toast.success(`Dealer ${newStatus === 'Active' ? 'activated' : 'deactivated'}`);
            }
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const handleDeleteClick = (dealer) => {
        setCurrentDealer(dealer);
        setIsDeleteModalOpen(true);
    };

    const handleViewDetails = (dealer) => {
        setCurrentDealer(dealer);
        setIsDetailsOpen(true);
    };

    const confirmDelete = async () => {
        try {
            const response = await adminService.deleteDealer(currentDealer._id);
            if (response.data.success) {
                setDealers(dealers.filter(d => d._id !== currentDealer._id));
                toast.success("Dealer deleted successfully");
                setIsDetailsOpen(false);
            }
        } catch (error) {
            toast.error("Failed to delete dealer");
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Active': return `${styles.statusBadge} ${styles.statusActive}`;
            case 'Inactive': return `${styles.statusBadge} ${styles.statusInactive}`;
            case 'Pending': return `${styles.statusBadge} ${styles.statusPending}`;
            default: return styles.statusBadge;
        }
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
            <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    return (
        <div className={styles.container}>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h2 className={styles.title}>Dealer Management</h2>
                    <p className={styles.welcomeText} style={{ fontSize: '0.95rem' }}>Manage all registered dealers and their verification status.</p>
                </div>
                <div className={styles.statsBadge}>
                    <i className="fas fa-users"></i>
                    <span className='text-white'>Total Dealers: <strong>{dealers.length}</strong></span>
                </div>
            </div>

            {dealers.length > 0 ? (
                <div className={styles.grid}>
                    {dealers.map((dealer) => (
                        <div key={dealer._id} className={styles.gridCard}>
                            <div className={styles.gridCardImgWrapper}>
                                <img
                                    src={dealer.photo?.startsWith('http') ? dealer.photo : `http://localhost:5000${dealer.photo}`}
                                    alt={dealer.name}
                                    className={styles.gridCardImg}
                                    onError={(e) => e.target.src = 'https://via.placeholder.com/300x200?text=Dealer'}
                                />
                                <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                                    <span className={getStatusStyle(dealer.status)}>
                                        {dealer.status}
                                    </span>
                                </div>
                            </div>
                            <div className={styles.gridCardBody}>
                                <h4 className={styles.gridCardTitle}>{dealer.name}</h4>
                                <p className="mb-4 text-truncate" style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                                    <i className="fa-solid fa-envelope me-2 text-info"></i> {dealer.email}
                                </p>

                                <div className="d-flex gap-2">
                                    <button
                                        className={styles.btnPrimary}
                                        style={{ flex: 1, padding: '0.6rem', fontSize: '0.85rem' }}
                                        onClick={() => handleViewDetails(dealer)}
                                    >
                                        <i className="fas fa-info-circle"></i> More Info
                                    </button>
                                    <button
                                        className={styles.btnDanger}
                                        style={{ flex: '0 0 45px', padding: '0.6rem' }}
                                        onClick={() => handleDeleteClick(dealer)}
                                        title="Delete Dealer"
                                    >
                                        <i className="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-5">
                    <p className="text-muted fs-5">No dealers registered yet.</p>
                </div>
            )}

            {/* Dealer Details Offcanvas */}
            <Offcanvas
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                title="Dealer Profile"
            >
                {currentDealer && (
                    <div className="dealer-profile-saas">
                        {/* Profile Overview Header */}
                        <div className="text-center pb-5 pt-2">
                            <div className="position-relative d-inline-block mb-4">
                                <div className="rounded-circle overflow-hidden border border-4 border-info shadow-lg" style={{ width: '130px', height: '130px' }}>
                                    <img
                                        src={currentDealer.photo?.startsWith('http') ? currentDealer.photo : `http://localhost:5000${currentDealer.photo}`}
                                        alt={currentDealer.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        onError={(e) => e.target.src = 'https://via.placeholder.com/130x130?text=Dealer'}
                                    />
                                </div>
                            </div>
                            <h3 className="fw-800 mb-2" style={{ color: '#f8fafc', letterSpacing: '-0.5px' }}>{currentDealer.name}</h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }} className="mb-3">
                                <i className="fas fa-calendar-alt me-2 text-info"></i>
                                Joined {new Date(currentDealer.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </p>
                            <div className="mb-1">
                                <span className={getStatusStyle(currentDealer.status)}>
                                    {currentDealer.status}
                                </span>
                            </div>
                        </div>

                        {/* Information Sections */}
                        <div className="saas-section mb-4 p-4 rounded-4" style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                            <h6 className="text-uppercase fw-800 mb-4" style={{ fontSize: '0.75rem', color: '#38bdf8', letterSpacing: '0.15em' }}>Identity & Verification</h6>

                            <div className="d-flex align-items-start mb-4">
                                <div className="bg-dark p-2 rounded-3 shadow-sm me-3 border border-secondary" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="fas fa-id-card text-info"></i>
                                </div>
                                <div>
                                    <label className="d-block text-muted small fw-bold mb-1">Aadhaar Number</label>
                                    <p className="fw-bold mb-0" style={{ fontSize: '1rem', color: '#f8fafc' }}>{currentDealer.adhar_card}</p>
                                </div>
                            </div>

                            <div className="d-flex align-items-start">
                                <div className="bg-dark p-2 rounded-3 shadow-sm me-3 border border-secondary" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="fas fa-user-check text-info"></i>
                                </div>
                                <div>
                                    <label className="d-block text-muted small fw-bold mb-1">Verification Status</label>
                                    <p className="fw-bold mb-0 text-success">KYC Verified</p>
                                </div>
                            </div>
                        </div>

                        <div className="saas-section mb-5 p-4 rounded-4" style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                            <h6 className="text-uppercase fw-800 mb-4" style={{ fontSize: '0.75rem', color: '#38bdf8', letterSpacing: '0.15em' }}>Contact Information</h6>

                            <div className="d-flex align-items-start mb-4">
                                <div className="bg-dark p-2 rounded-3 shadow-sm me-3 border border-secondary" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="fas fa-envelope text-info"></i>
                                </div>
                                <div className="overflow-hidden">
                                    <label className="d-block text-muted small fw-bold mb-1">Email Address</label>
                                    <p className="fw-bold mb-0 text-truncate" title={currentDealer.email} style={{ color: '#f8fafc' }}>{currentDealer.email}</p>
                                </div>
                            </div>

                            <div className="d-flex align-items-start mb-4">
                                <div className="bg-dark p-2 rounded-3 shadow-sm me-3 border border-secondary" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="fas fa-phone-alt text-info"></i>
                                </div>
                                <div>
                                    <label className="d-block text-muted small fw-bold mb-1">Mobile Phone</label>
                                    <p className="fw-bold mb-0" style={{ color: '#f8fafc' }}>{currentDealer.mobile}</p>
                                </div>
                            </div>

                            <div className="d-flex align-items-start">
                                <div className="bg-dark p-2 rounded-3 shadow-sm me-3 border border-secondary" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="fas fa-map-marker-alt text-info"></i>
                                </div>
                                <div>
                                    <label className="d-block text-muted small fw-bold mb-1">Operating City</label>
                                    <p className="fw-bold mb-0" style={{ color: '#f8fafc' }}>{currentDealer.city}</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-2">
                            <button
                                className="btn w-100 mb-3 py-3 rounded-4 d-flex align-items-center justify-content-center gap-3"
                                style={{
                                    backgroundColor: currentDealer.status === 'Active' ? '#fff1f2' : '#f0fdf4',
                                    color: currentDealer.status === 'Active' ? '#e11d48' : '#16a34a',
                                    border: `1px solid ${currentDealer.status === 'Active' ? '#fecaca' : '#bcf1d2'}`,
                                    fontWeight: '700'
                                }}
                                onClick={() => toggleStatus(currentDealer._id, currentDealer.status)}
                            >
                                <i className={`fas ${currentDealer.status === 'Active' ? 'fa-user-slash' : 'fa-user-check'}`}></i>
                                {currentDealer.status === 'Active' ? 'Suspend Dealer Account' : 'Activate Dealer Account'}
                            </button>

                            <button
                                className="btn w-100 py-3 rounded-4 d-flex align-items-center justify-content-center gap-3"
                                style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    color: '#94a3b8',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    fontWeight: '700'
                                }}
                                onClick={() => handleDeleteClick(currentDealer)}
                            >
                                <i className="fas fa-trash-alt"></i>
                                Terminate Partnership
                            </button>
                        </div>
                    </div>
                )}
            </Offcanvas>

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Dealer"
                message={`Are you sure you want to delete "${currentDealer?.name}"? This will remove all their data from the platform.`}
                confirmText="Delete"
                cancelText="Cancel"
                icon="fas fa-user-minus"
            />
        </div>
    );
};

export default ManageDealers;
