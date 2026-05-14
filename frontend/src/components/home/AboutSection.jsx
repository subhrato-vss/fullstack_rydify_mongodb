import React from 'react';
import styles from './AboutSection.module.css';

const AboutSection = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.subTitle}>Our Core Ecosystem</span>
          <h2 className={styles.title}>
            The Business Model <br />
            <span className={styles.highlight}>Connecting Dealers & Drivers</span>
          </h2>
          <p className={styles.headerDesc}>
            Rydify bridges the gap between premium vehicle providers and modern drivers through a secure, 
            transparent, and technology-driven rental marketplace.
          </p>
        </div>

        <div className={styles.modelGrid}>
          {/* Dealer Path */}
          <div className={styles.pathCard}>
            <div className={styles.cardHeader}>
              <div className={styles.iconBox}>
                <i className="fas fa-store-alt"></i>
              </div>
              <div className={styles.headerText}>
                <h3>For Vehicle Dealers</h3>
                <p>Empower your dealership</p>
              </div>
            </div>
            
            <div className={styles.steps}>
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>01</div>
                <div className={styles.stepContent}>
                  <h4>Verified Onboarding</h4>
                  <p>Register as a certified dealer with secure KYC verification.</p>
                </div>
              </div>
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>02</div>
                <div className={styles.stepContent}>
                  <h4>Inventory Control</h4>
                  <p>List your premium fleet with high-res photos and detailed specs.</p>
                </div>
              </div>
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>03</div>
                <div className={styles.stepContent}>
                  <h4>Smart Management</h4>
                  <p>Accept bookings and manage schedules through an advanced dashboard.</p>
                </div>
              </div>
            </div>
            
            <div className={styles.cardFooter}>
              <div className={styles.statMini}>
                <span className={styles.statLabel}>Revenue Growth</span>
                <span className={styles.statVal}>+40%</span>
              </div>
            </div>
          </div>

          {/* Connection Visual */}
          <div className={styles.connectorArea}>
            <div className={styles.pulseLine}></div>
            <div className={styles.centerLogo}>
              <img src="/assets/img/admin_logo.png" alt="Rydify" />
            </div>
          </div>

          {/* User Path */}
          <div className={`${styles.pathCard} ${styles.userCard}`}>
            <div className={styles.cardHeader}>
              <div className={styles.iconBox}>
                <i className="fas fa-user-tie"></i>
              </div>
              <div className={styles.headerText}>
                <h3>For Renters</h3>
                <p>Find your perfect ride</p>
              </div>
            </div>
            
            <div className={styles.steps}>
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>01</div>
                <div className={styles.stepContent}>
                  <h4>Seamless Discovery</h4>
                  <p>Browse a wide variety of verified cars and bikes from local trusted dealers.</p>
                </div>
              </div>
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>02</div>
                <div className={styles.stepContent}>
                  <h4>Instant Booking</h4>
                  <p>Select your dates and book with transparent, real-time pricing.</p>
                </div>
              </div>
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>03</div>
                <div className={styles.stepContent}>
                  <h4>Secure Journey</h4>
                  <p>Pick up your keys and drive with full insurance and 24/7 support.</p>
                </div>
              </div>
            </div>

            <div className={styles.cardFooter}>
              <div className={styles.statMini}>
                <span className={styles.statLabel}>Total Freedom</span>
                <span className={styles.statVal}>Unlimited</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
