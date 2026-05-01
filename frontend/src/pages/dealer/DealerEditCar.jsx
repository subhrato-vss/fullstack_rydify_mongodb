import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import carService from '../../services/carService';
import styles from './DealerEditCar.module.css';

const DealerEditCar = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [currentPhoto, setCurrentPhoto] = useState('');

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm({
        mode: 'onChange'
    });

    useEffect(() => {
        fetchData();
    }, [id]);

    const getImageUrl = (photo) => {
        if (!photo) return '/assets/img/cars/car_placeholder.png';
        if (photo.startsWith('http')) return photo;
        if (photo.startsWith('/')) return `http://localhost:5000${photo}`;
        return `http://localhost:5000/uploads/${photo}`;
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const [catRes, carRes] = await Promise.all([
                carService.getCategories(),
                carService.getSingleCar(id)
            ]);

            setCategories(catRes.data.data || []);
            
            if (carRes.data.success) {
                const car = carRes.data.data;
                // Populate form
                setValue('category', car.category?._id || car.category);
                setValue('brand', car.brand);
                setValue('name', car.name);
                setValue('model', car.model);
                setValue('fuelType', car.fuelType);
                setValue('transmissionType', car.transmissionType);
                setValue('mileage', car.mileage);
                setValue('kmDriven', car.kmDriven);
                setValue('engineCapacity', car.engineCapacity);
                setValue('chassisNumber', car.chassisNumber);
                setValue('price', car.price);
                setValue('ownerType', car.ownerType);
                setValue('accidentalHistory', car.accidentalHistory);
                setCurrentPhoto(car.photo);
            }
        } catch (error) {
            console.error('Failed to fetch car details:', error);
            toast.error("Failed to load vehicle details");
            navigate('/dealer/manage_cars');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data) => {
        const loadingToast = toast.loading('Updating vehicle details...');
        setSubmitting(true);
        try {
            const formData = new FormData();
            Object.keys(data).forEach(key => {
                if (key === 'photo') {
                    if (data[key] && data[key][0]) {
                        formData.append(key, data[key][0]);
                    }
                } else {
                    formData.append(key, data[key]);
                }
            });

            const response = await carService.updateCar(id, formData);
            if (response.data.success) {
                toast.success("Vehicle updated successfully!", { id: loadingToast });
                navigate('/dealer/manage_cars');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update vehicle", { id: loadingToast });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingWrapper}>
                <div className={styles.spinner}></div>
                <p>Loading vehicle information...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button onClick={() => navigate('/dealer/manage_cars')} className={styles.btnBack}>
                    <i className="fas fa-arrow-left"></i> Back to Inventory
                </button>
                <h1 className={styles.title}>Edit Vehicle Details</h1>
                <p className={styles.subtitle}>Modify your vehicle listing information below</p>
            </div>

            <div className={styles.formWrapper}>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    {/* Basic Information Section */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}><i className="fas fa-info-circle"></i> Basic Information</h2>
                        <div className={styles.grid}>
                            <div className={styles.inputGroup}>
                                <label>Category</label>
                                <select {...register('category', { required: 'Category is required' })} className={errors.category ? styles.inputError : ''}>
                                    <option value="">Select Category</option>
                                    {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                                </select>
                                {errors.category && <span className={styles.errorText}>{errors.category.message}</span>}
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Brand</label>
                                <select {...register('brand', { required: 'Brand is required' })} className={errors.brand ? styles.inputError : ''}>
                                    <option value="">Select Brand</option>
                                    <option value="Toyota">Toyota</option>
                                    <option value="Honda">Honda</option>
                                    <option value="Ford">Ford</option>
                                    <option value="BMW">BMW</option>
                                    <option value="Mercedes-Benz">Mercedes-Benz</option>
                                    <option value="Audi">Audi</option>
                                    <option value="Maruti Suzuki">Maruti Suzuki</option>
                                    <option value="Tata">Tata</option>
                                    <option value="Mahindra">Mahindra</option>
                                    <option value="Hyundai">Hyundai</option>
                                </select>
                                {errors.brand && <span className={styles.errorText}>{errors.brand.message}</span>}
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Vehicle Name</label>
                                <input type="text" {...register('name', { required: 'Name is required' })} className={errors.name ? styles.inputError : ''} />
                                {errors.name && <span className={styles.errorText}>{errors.name.message}</span>}
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Model Year</label>
                                <input type="text" {...register('model', { required: 'Model is required' })} className={errors.model ? styles.inputError : ''} />
                                {errors.model && <span className={styles.errorText}>{errors.model.message}</span>}
                            </div>
                        </div>
                    </div>

                    {/* Technical Specifications Section */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}><i className="fas fa-tools"></i> Technical Specifications</h2>
                        <div className={styles.grid}>
                            <div className={styles.inputGroup}>
                                <label>Fuel Type</label>
                                <select {...register('fuelType')}>
                                    <option value="Petrol">Petrol</option>
                                    <option value="Diesel">Diesel</option>
                                    <option value="CNG">CNG</option>
                                    <option value="Electric">Electric</option>
                                </select>
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Transmission</label>
                                <select {...register('transmissionType')}>
                                    <option value="Manual">Manual</option>
                                    <option value="Automatic">Automatic</option>
                                </select>
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Mileage (km/l)</label>
                                <input type="number" {...register('mileage', { required: 'Required' })} />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>KM Driven</label>
                                <input type="number" {...register('kmDriven', { required: 'Required' })} />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Engine Capacity (cc)</label>
                                <input type="text" {...register('engineCapacity', { required: 'Required' })} />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Chassis Number</label>
                                <input type="text" {...register('chassisNumber', { required: 'Required' })} />
                            </div>
                        </div>
                    </div>

                    {/* Pricing & Other Details Section */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}><i className="fas fa-tag"></i> Pricing & Media</h2>
                        <div className={styles.grid}>
                            <div className={styles.inputGroup}>
                                <label>Rent Per Day (Rs.)</label>
                                <input type="number" {...register('price', { required: 'Required' })} />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Owner Type</label>
                                <select {...register('ownerType')}>
                                    <option value="First Owner">First Owner</option>
                                    <option value="Second Owner">Second Owner</option>
                                    <option value="Third Owner">Third Owner</option>
                                </select>
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Accidental History</label>
                                <select {...register('accidentalHistory')}>
                                    <option value="No">No</option>
                                    <option value="Yes">Yes</option>
                                </select>
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Update Photo</label>
                                <input type="file" {...register('photo')} />
                                <small className={styles.helpText}>Leave empty to keep current photo</small>
                            </div>
                        </div>
                        
                        {currentPhoto && (
                            <div className={styles.photoPreview}>
                                <label>Current Photo:</label>
                                <img src={getImageUrl(currentPhoto)} alt="Current vehicle" />
                            </div>
                        )}
                    </div>

                    <div className={styles.formActions}>
                        <button type="button" onClick={() => navigate('/dealer/manage_cars')} className={styles.btnSecondary}>
                            Cancel
                        </button>
                        <button type="submit" className={styles.btnPrimary} disabled={submitting}>
                            {submitting ? <><i className="fas fa-spinner fa-spin"></i> Updating...</> : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DealerEditCar;
