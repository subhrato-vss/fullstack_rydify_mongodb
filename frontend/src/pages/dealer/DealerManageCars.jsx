import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import carService from '../../services/carService';
import styles from './DealerManageCars.module.css';

const DealerManageCars = () => {
    const navigate = useNavigate();
    const [cars, setCars] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [isFormVisible, setIsFormVisible] = useState(false);

    const carBrands = [
        "Toyota", "Honda", "Ford", "BMW", "Mercedes-Benz", "Audi", "Volkswagen", 
        "Hyundai", "Kia", "Nissan", "Maruti Suzuki", "Tata", "Mahindra", "Skoda", "Renault"
    ];

    const bikeBrands = [
        "Royal Enfield", "Hero", "Honda", "TVS", "Bajaj", "Yamaha", "Suzuki", 
        "KTM", "Kawasaki", "Jawa", "Harley-Davidson", "Triumph", "Ducati", "BMW"
    ];


    const {
        register,
        handleSubmit,
        trigger,
        reset,
        watch,
        formState: { errors }
    } = useForm({
        mode: 'onChange',
        shouldUnregister: false,
        defaultValues: {
            fuelType: 'Petrol',
            transmissionType: 'Manual',
            ownerType: 'First Owner',
            accidentalHistory: 'No',
            type: 'car'
        }
    });

    useEffect(() => {
        fetchData();
    }, []);

    const getImageUrl = (photo) => {
        if (!photo) return '/assets/img/cars/car_placeholder.png';
        if (photo.startsWith('http')) return photo;
        if (photo.startsWith('/')) return `http://localhost:5000${photo}`;
        return `http://localhost:5000/uploads/${photo}`;
    };

    const vehicleType = watch('type');
    const filteredCategories = categories.filter(cat => cat.type === vehicleType);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [catRes, carRes] = await Promise.all([
                carService.getCategories(),
                carService.getDealerCars()
            ]);
            setCategories(catRes.data.data || []);
            setCars(carRes.data.data || []);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const nextStep = async () => {
        let fieldsToValidate = [];
        if (currentStep === 1) fieldsToValidate = ['type', 'category', 'brand', 'name', 'model'];
        if (currentStep === 2) fieldsToValidate = ['fuelType', 'transmissionType', 'mileage', 'kmDriven', 'engineCapacity', 'chassisNumber'];

        const result = await trigger(fieldsToValidate);
        if (result) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const prevStep = () => setCurrentStep(prev => prev - 1);

    const onSubmit = async (data) => {
        const loadingToast = toast.loading('Listing your vehicle...');
        setSubmitting(true);
        try {
            const formData = new FormData();
            Object.keys(data).forEach(key => {
                if (key === 'photo') {
                    formData.append(key, data[key][0]);
                } else {
                    formData.append(key, data[key]);
                }
            });

            const response = await carService.addCar(formData);
            if (response.data.success) {
                toast.success("Vehicle listed successfully!", { id: loadingToast });
                reset();
                setCurrentStep(1);
                setIsFormVisible(false);
                fetchData();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add vehicle", { id: loadingToast });
        } finally {
            setSubmitting(false);
        }
    };

    const [selectedCar, setSelectedCar] = useState(null);
    const [showOffcanvas, setShowOffcanvas] = useState(false);

    const openInfo = (car) => {
        setSelectedCar(car);
        setShowOffcanvas(true);
    };

    const closeInfo = () => {
        setShowOffcanvas(false);
        setTimeout(() => setSelectedCar(null), 300);
    };

    const deleteCar = async (id) => {
        if (window.confirm("Are you sure you want to delete this listing?")) {
            try {
                const response = await carService.deleteCar(id);
                if (response.data.success) {
                    toast.success("Listing deleted successfully");
                    setCars(cars.filter(c => c._id !== id));
                    if (selectedCar?._id === id) closeInfo();
                }
            } catch (error) {
                toast.error("Failed to delete listing");
            }
        }
    };

    const toggleStatus = async (carId, currentStatus) => {
        const newStatus = currentStatus === 'Available' ? 'Booked' : 'Available';
        const loadingToast = toast.loading(`Updating status to ${newStatus}...`);
        try {
            const response = await carService.updateCarStatus(carId, newStatus);
            if (response.data.success) {
                toast.success(`Vehicle marked as ${newStatus}`, { id: loadingToast });
                setCars(cars.map(c => c._id === carId ? { ...c, status: newStatus } : c));
                setSelectedCar({ ...selectedCar, status: newStatus });
            }
        } catch (error) {
            toast.error("Failed to update status", { id: loadingToast });
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.headerSection}>
                <div className={styles.headerInfo}>
                    <h1 className={styles.mainTitle}>Vehicle Inventory</h1>
                    <p className={styles.mainSubtitle}>Manage and track your dealership fleet</p>
                </div>
                <div className={styles.headerActions}>
                    <button 
                        className={styles.btnAddForm} 
                        onClick={() => setIsFormVisible(!isFormVisible)}
                    >
                        {isFormVisible ? (
                            <><i className="fas fa-times me-2"></i> Close Form</>
                        ) : (
                            <><i className="fas fa-plus me-2"></i> Add New Vehicle</>
                        )}
                    </button>
                    <div className={styles.statsMini}>
                        <div className={styles.statItem}>
                            <i className="fas fa-car text-warning"></i>
                            <div>
                                <span className={styles.statVal}>{cars.filter(c => c.type === 'car').length}</span>
                                <span className={styles.statLbl}> Total Cars</span>
                            </div>
                        </div>
                        <div className={styles.statItem}>
                            <i className="fas fa-motorcycle text-info"></i>
                            <div>
                                <span className={styles.statVal}>{cars.filter(c => c.type === 'bike').length}</span>
                                <span className={styles.statLbl}> Total Bikes</span>
                            </div>
                        </div>
                        <div className={styles.statItem}>
                            <i className="fas fa-check-circle text-success"></i>
                            <div>
                                <span className={styles.statVal}>{cars.filter(c => c.status === 'Available').length}</span>
                                <span className={styles.statLbl}> Available</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isFormVisible && (
                <div className={styles.formCard}>
                    <div className={styles.formHeader}>
                        <h2>List Your Vehicle</h2>
                        <p>Complete the steps below to add a new car to your fleet</p>
                    </div>
                <div className={styles.stepIndicator}>
                    <div className={`${styles.step} ${currentStep >= 1 ? styles.completedStep : ''} ${currentStep === 1 ? styles.activeStep : ''}`}>
                        <div className={styles.stepNumber}>{currentStep > 1 ? <i className="fas fa-check"></i> : '1'}</div>
                        <span className={styles.stepLabel}>Basic Info</span>
                    </div>
                    <div className={`${styles.step} ${currentStep >= 2 ? styles.completedStep : ''} ${currentStep === 2 ? styles.activeStep : ''}`}>
                        <div className={styles.stepNumber}>{currentStep > 2 ? <i className="fas fa-check"></i> : '2'}</div>
                        <span className={styles.stepLabel}>Technical</span>
                    </div>
                    <div className={`${styles.step} ${currentStep >= 3 ? styles.completedStep : ''} ${currentStep === 3 ? styles.activeStep : ''}`}>
                        <div className={styles.stepNumber}>3</div>
                        <span className={styles.stepLabel}>Pricing & Media</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    {currentStep === 1 && (
                        <div className={styles.formGrid}>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Vehicle Type</label>
                                <select
                                    className={`${styles.select} ${errors.type ? styles.inputError : ''}`}
                                    {...register('type', { required: 'Type is required' })}
                                >
                                    <option value="car">Car</option>
                                    <option value="bike">Bike</option>
                                </select>
                                {errors.type && <span className={styles.errorText}>{errors.type.message}</span>}
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Category</label>
                                <select
                                    className={`${styles.select} ${errors.category ? styles.inputError : ''}`}
                                    {...register('category', { required: 'Category is required' })}
                                >
                                    <option value="">Choose Category</option>
                                    {filteredCategories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                                </select>
                                {errors.category && <span className={styles.errorText}>{errors.category.message}</span>}
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Brand</label>
                                <select
                                    className={`${styles.select} ${errors.brand ? styles.inputError : ''}`}
                                    {...register('brand', { required: 'Brand is required' })}
                                >
                                    <option value="">Choose Brand</option>
                                    {(vehicleType === 'bike' ? bikeBrands : carBrands).map(brand => (
                                        <option key={brand} value={brand}>{brand}</option>
                                    ))}
                                </select>
                                {errors.brand && <span className={styles.errorText}>{errors.brand.message}</span>}
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Vehicle Name</label>
                                <input
                                    type="text"
                                    className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                                    placeholder="e.g. Camry, X5"
                                    {...register('name', { required: 'Vehicle name is required' })}
                                />
                                {errors.name && <span className={styles.errorText}>{errors.name.message}</span>}
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Model Year</label>
                                <input
                                    type="text"
                                    className={`${styles.input} ${errors.model ? styles.inputError : ''}`}
                                    placeholder="e.g. 2023"
                                    {...register('model', {
                                        required: 'Model year is required',
                                        pattern: { value: /^[0-9]{4}$/, message: 'Enter a valid 4-digit year' }
                                    })}
                                />
                                {errors.model && <span className={styles.errorText}>{errors.model.message}</span>}
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className={styles.formGrid}>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Fuel Type</label>
                                <select className={styles.select} {...register('fuelType')}>
                                    <option value="Petrol">Petrol</option>
                                    <option value="Diesel">Diesel</option>
                                    <option value="CNG">CNG</option>
                                    <option value="Electric">Electric</option>
                                </select>
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Transmission</label>
                                <select className={styles.select} {...register('transmissionType')}>
                                    <option value="Manual">Manual</option>
                                    <option value="Automatic">Automatic</option>
                                </select>
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Mileage (km/l)</label>
                                <input
                                    type="number"
                                    className={`${styles.input} ${errors.mileage ? styles.inputError : ''}`}
                                    {...register('mileage', { required: 'Mileage is required' })}
                                />
                                {errors.mileage && <span className={styles.errorText}>{errors.mileage.message}</span>}
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>KM Driven</label>
                                <input
                                    type="number"
                                    className={`${styles.input} ${errors.kmDriven ? styles.inputError : ''}`}
                                    {...register('kmDriven', { required: 'KM driven is required' })}
                                />
                                {errors.kmDriven && <span className={styles.errorText}>{errors.kmDriven.message}</span>}
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Engine Capacity (cc)</label>
                                <input
                                    type="text"
                                    className={`${styles.input} ${errors.engineCapacity ? styles.inputError : ''}`}
                                    placeholder="e.g. 1498"
                                    {...register('engineCapacity', { required: 'Engine capacity is required' })}
                                />
                                {errors.engineCapacity && <span className={styles.errorText}>{errors.engineCapacity.message}</span>}
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Chassis Number</label>
                                <input
                                    type="text"
                                    className={`${styles.input} ${errors.chassisNumber ? styles.inputError : ''}`}
                                    placeholder="Enter chassis #"
                                    {...register('chassisNumber', { required: 'Chassis number is required' })}
                                />
                                {errors.chassisNumber && <span className={styles.errorText}>{errors.chassisNumber.message}</span>}
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className={styles.formGrid}>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Rent Per Day (Rs.)</label>
                                <input
                                    type="number"
                                    className={`${styles.input} ${errors.price ? styles.inputError : ''}`}
                                    {...register('price', { required: 'Rental price is required' })}
                                    placeholder="Enter daily rent"
                                />
                                {errors.price && <span className={styles.errorText}>{errors.price.message}</span>}
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Owner Type</label>
                                <select className={styles.select} {...register('ownerType')}>
                                    <option value="First Owner">First Owner</option>
                                    <option value="Second Owner">Second Owner</option>
                                    <option value="Third Owner">Third Owner</option>
                                </select>
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Accidental History</label>
                                <select className={styles.select} {...register('accidentalHistory')}>
                                    <option value="No">No</option>
                                    <option value="Yes">Yes</option>
                                </select>
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Vehicle Photo <span className="text-danger">*</span></label>
                                <input
                                    type="file"
                                    className={`${styles.input} ${errors.photo ? styles.inputError : ''}`}
                                    {...register('photo', { required: 'Photo is required' })}
                                />
                                {errors.photo && <span className={styles.errorText}>{errors.photo.message}</span>}
                            </div>
                        </div>
                    )}

                    <div className={styles.actions}>
                        {currentStep > 1 && (
                            <button type="button" className={styles.btnBack} onClick={prevStep}>
                                <i className="fas fa-arrow-left me-2"></i> Back
                            </button>
                        )}
                        <div style={{ marginLeft: 'auto' }}>
                            {currentStep < 3 ? (
                                <button type="button" className={styles.btnNext} onClick={nextStep}>
                                    Continue <i className="fas fa-arrow-right ms-2"></i>
                                </button>
                            ) : (
                                <button type="submit" className={styles.btnSubmit} disabled={submitting}>
                                    {submitting ? 'Listing...' : 'Finalize Listing'}
                                    {!submitting && <i className="fas fa-check-circle ms-2"></i>}
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
            )}

            <div className={styles.inventorySection}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Your Showroom</h2>
                    <div className={styles.inventoryFilters}>
                        <span className={styles.badgeCount}>{cars.length} Vehicles</span>
                    </div>
                </div>

                {loading ? (
                    <div className={styles.loadingContainer}>
                        <div className={styles.spinner}></div>
                        <p>Loading your fleet...</p>
                    </div>
                ) : (
                    <div className={styles.carsGrid}>
                        {cars.length > 0 ? (
                            cars.map(car => (
                                <div key={car._id} className={styles.saasCarCard}>
                                    <div className={styles.cardImageArea}>
                                        <img src={getImageUrl(car.photo)} alt={car.name} />
                                        <div className={styles.priceTag}>₹{car.price?.toLocaleString()} / day</div>
                                        <div className={`${styles.statusBadge} ${styles[car.status?.toLowerCase()]}`}>
                                            {car.status}
                                        </div>
                                    </div>
                                    <div className={styles.cardInfo}>
                                        <div className={styles.cardMain}>
                                            <span className={styles.brandTag}>{car.brand}</span>
                                            <h3 className={styles.carName}>{car.name}</h3>
                                            <p className={styles.carMeta}>{car.model} • {car.fuelType} • {car.transmissionType}</p>
                                        </div>
                                        <div className={styles.cardActions}>
                                            <button
                                                className={styles.btnInfo}
                                                onClick={() => openInfo(car)}
                                            >
                                                <i className="fas fa-info-circle me-1"></i> Details
                                            </button>
                                            <button
                                                className={styles.btnEdit}
                                                onClick={() => navigate(`/dealer/edit_car/${car._id}`)}
                                            >
                                                <i className="fas fa-pencil-alt"></i>
                                            </button>
                                            <button
                                                className={styles.btnTrash}
                                                onClick={() => deleteCar(car._id)}
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className={styles.emptyState}>
                                <i className="fas fa-car-side"></i>
                                <h3>No Vehicles Found</h3>
                                <p>Start adding cars to build your digital showroom.</p>
                            </div>
                        )}
                    </div>
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

                            <div className={styles.offcanvasFooter}>
                                {selectedCar.status !== 'Available' && (
                                    <button 
                                        className={`${styles.btnStatusToggle} ${styles.btnAvailable}`}
                                        onClick={() => toggleStatus(selectedCar._id, selectedCar.status)}
                                    >
                                        Mark as Available
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DealerManageCars;
