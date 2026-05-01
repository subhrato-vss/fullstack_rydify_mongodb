import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import authService from '../services/authService';
import styles from './DealerSignup.module.css';
import signupHero from '../assets/dealer_signup_hero.png';

const DealerSignup = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    const [currentStep, setCurrentStep] = useState(1);

    const {
        register,
        handleSubmit,
        trigger,
        formState: { errors }
    } = useForm({
        mode: 'onChange',
        shouldUnregister: false,
        defaultValues: {
            name: '',
            email: '',
            password: '',
            adhar_card: '',
            pan_card: '',
            mobile: '',
            gender: '',
            address: '',
            city: ''
        }
    });

    const nextStep = async () => {
        let fieldsToValidate = [];
        if (currentStep === 1) fieldsToValidate = ['name', 'email', 'password'];
        if (currentStep === 2) fieldsToValidate = ['adhar_card', 'pan_card', 'mobile', 'gender'];

        const result = await trigger(fieldsToValidate);
        if (result) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => prev - 1);
    };

    const onSubmit = async (data) => {
        setLoading(true);
        setServerError('');

        try {
            const formData = new FormData();
            Object.keys(data).forEach(key => {
                formData.append(key, data[key]);
            });

            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput && fileInput.files[0]) {
                formData.append('photo', fileInput.files[0]);
            } else {
                toast.error("Please upload a profile photo");
                setLoading(false);
                return;
            }

            const response = await authService.dealerSignup(formData);
            if (response.data.success) {
                toast.success("Registration successful! Welcome to Rydify.");
                navigate('/dealer/login');
            }
        } catch (err) {
            setServerError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.signupPage}>
            {/* Hero Section */}
            <div className={styles.heroSection}>
                <div className={styles.meshGradient}></div>
                <img src={signupHero} alt="Dealer Partner" className={styles.heroImage} />
                <div className={styles.heroOverlay}></div>
                <div className={styles.heroContent}>
                    <h1 className='text-white'>Partner with <span>Rydify</span></h1>
                    <p>Elevate your dealership business with our premium management platform. Access global customers and manage your inventory with ease.</p>

                    <div className={styles.featuresList}>
                        <div className={styles.featureItem}>
                            <div className={styles.featureIcon}><i className="fas fa-chart-line"></i></div>
                            <div className={styles.featureText}>
                                <h3>Business Analytics</h3>
                                <p>Track your earnings and inventory performance with real-time data.</p>
                            </div>
                        </div>
                        <div className={styles.featureItem}>
                            <div className={styles.featureIcon}><i className="fas fa-car"></i></div>
                            <div className={styles.featureText}>
                                <h3>Inventory Control</h3>
                                <p>Manage listings, pricing, and availability through a powerful dashboard.</p>
                            </div>
                        </div>
                        <div className={styles.featureItem}>
                            <div className={styles.featureIcon}><i className="fas fa-handshake"></i></div>
                            <div className={styles.featureText}>
                                <h3>Verified Network</h3>
                                <p>Join a trusted community of automotive professionals and high-intent buyers.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Section */}
            <div className={styles.formSection}>
                <div className={styles.signupCard}>
                    <div className={styles.formHeader}>
                        <h2>Dealer Registration</h2>
                        <p>
                            {currentStep === 1 && "Basic Account Details"}
                            {currentStep === 2 && "Identity Verification"}
                            {currentStep === 3 && "Business Location"}
                        </p>
                    </div>

                    <div className={styles.stepIndicator}>
                        <div className={`${styles.step} ${currentStep >= 1 ? styles.activeStep : ''}`}>1</div>
                        <div className={`${styles.step} ${currentStep >= 2 ? styles.activeStep : ''}`}>2</div>
                        <div className={`${styles.step} ${currentStep >= 3 ? styles.activeStep : ''}`}>3</div>
                    </div>

                    {serverError && (
                        <div className={styles.errorAlert} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '12px', borderRadius: '12px', marginBottom: '20px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                            <i className="fa-solid fa-circle-exclamation me-2"></i> {serverError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        {currentStep === 1 && (
                            <div className={styles.formGrid}>
                                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                    <label className={styles.label}>Full Name / Agency Name</label>
                                    <input type="text" className={`${styles.input} ${errors.name ? styles.inputError : ''}`} {...register('name', { required: 'Required' })} disabled={loading} />
                                    {errors.name && <span className={styles.errorText}><i className="fas fa-exclamation-circle"></i> {errors.name.message}</span>}
                                </div>
                                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                    <label className={styles.label}>Email Address</label>
                                    <input type="email" className={`${styles.input} ${errors.email ? styles.inputError : ''}`} {...register('email', { required: 'Required' })} disabled={loading} />
                                    {errors.email && <span className={styles.errorText}><i className="fas fa-exclamation-circle"></i> {errors.email.message}</span>}
                                </div>
                                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                    <label className={styles.label}>Password</label>
                                    <input type="password" className={`${styles.input} ${errors.password ? styles.inputError : ''}`} {...register('password', { required: 'Required', minLength: { value: 6, message: 'Min 6 characters' } })} disabled={loading} />
                                    {errors.password && <span className={styles.errorText}><i className="fas fa-exclamation-circle"></i> {errors.password.message}</span>}
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className={styles.formGrid}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Aadhaar Card</label>
                                    <input type="text" className={`${styles.input} ${errors.adhar_card ? styles.inputError : ''}`} {...register('adhar_card', { required: 'Required' })} disabled={loading} />
                                    {errors.adhar_card && <span className={styles.errorText}><i className="fas fa-exclamation-circle"></i> {errors.adhar_card.message}</span>}
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>PAN Card</label>
                                    <input type="text" className={`${styles.input} ${errors.pan_card ? styles.inputError : ''}`} {...register('pan_card', { required: 'Required' })} disabled={loading} />
                                    {errors.pan_card && <span className={styles.errorText}><i className="fas fa-exclamation-circle"></i> {errors.pan_card.message}</span>}
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Mobile</label>
                                    <input type="text" className={`${styles.input} ${errors.mobile ? styles.inputError : ''}`} {...register('mobile', { required: 'Required' })} disabled={loading} />
                                    {errors.mobile && <span className={styles.errorText}><i className="fas fa-exclamation-circle"></i> {errors.mobile.message}</span>}
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Gender</label>
                                    <select className={`${styles.select} ${errors.gender ? styles.inputError : ''}`} {...register('gender', { required: 'Required' })} disabled={loading}>
                                        <option value="">Select</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                    {errors.gender && <span className={styles.errorText}><i className="fas fa-exclamation-circle"></i> {errors.gender.message}</span>}
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className={styles.formGrid}>
                                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                    <label className={styles.label}>Office Address</label>
                                    <input type="text" className={`${styles.input} ${errors.address ? styles.inputError : ''}`} {...register('address', { required: 'Required' })} disabled={loading} />
                                    {errors.address && <span className={styles.errorText}><i className="fas fa-exclamation-circle"></i> {errors.address.message}</span>}
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>City</label>
                                    <input type="text" className={`${styles.input} ${errors.city ? styles.inputError : ''}`} {...register('city', { required: 'Required' })} disabled={loading} />
                                    {errors.city && <span className={styles.errorText}><i className="fas fa-exclamation-circle"></i> {errors.city.message}</span>}
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Profile/ID Photo</label>
                                    <div className={styles.fileUploadArea}>
                                        <i className="fa-solid fa-cloud-arrow-up"></i>
                                        <input type="file" accept="image/*" onChange={(e) => {
                                            const name = e.target.files[0]?.name;
                                            e.target.parentElement.querySelector('p').textContent = name || 'Upload Photo';
                                        }} />
                                        <p>Upload Photo</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className={styles.navigationButtons}>
                            {currentStep > 1 && <button type="button" onClick={prevStep} className={styles.backButton}>Back</button>}
                            {currentStep < 3 ? (
                                <button type="button" onClick={nextStep} className={styles.submitButton}>Continue</button>
                            ) : (
                                <button type="submit" className={styles.submitButton} disabled={loading}>{loading ? 'Registering...' : 'Complete Signup'}</button>
                            )}
                        </div>
                    </form>

                    <div className={styles.loginLink}>
                        Partner already? <Link to="/dealer/login">Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DealerSignup;
