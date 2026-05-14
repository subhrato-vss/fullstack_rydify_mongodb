import React from 'react';
import { Link } from 'react-router-dom';
import styles from './HeroSection.module.css';

const HeroSection = () => {
  return (
    <section className={styles.hero}>
      {/* Background elements */}
      <div className={styles.meshContainer}>
        <div className={styles.meshGradient}></div>
        <div className={styles.glassCircle1}></div>
        <div className={styles.glassCircle2}></div>
      </div>

      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.textContent}>
            <div className={styles.badgeWrapper}>
              <span className={styles.heroBadge}>
                <i className="fas fa-bolt"></i> Fast & Reliable Rentals
              </span>
            </div>
            
            <h1 className={styles.mainTitle}>
              Your Journey <br />
              Starts with <span className={styles.gradientText}>Rydify</span>
            </h1>
            
            <p className={styles.subTitle}>
              Streamline your journey with our premium fleet of cars and bikes. 
              Book high-quality vehicles from verified dealers with just a few clicks.
            </p>

            <div className={styles.ctaGroup}>
              <Link to="/cars" className={styles.btnPrimary}>
                Explore Fleet
                <div className={styles.btnIcon}>
                  <i className="fas fa-arrow-right"></i>
                </div>
              </Link>
              <Link to="/about" className={styles.btnSecondary}>
                Learn More
              </Link>
            </div>

            <div className={styles.trustFooter}>
              <div className={styles.trustItem}>
                <div className={styles.trustIcon}><i className="fas fa-shield-alt"></i></div>
                <span>Fully Insured</span>
              </div>
              <div className={styles.trustDivider}></div>
              <div className={styles.trustItem}>
                <div className={styles.trustIcon}><i className="fas fa-id-card"></i></div>
                <span>Verified Dealers</span>
              </div>
            </div>
          </div>

          <div className={styles.visualContent}>
            <div className={styles.imageCard}>
              <div className={styles.glowEffect}></div>
              <img 
                src="/assets/img/hero/process_hero.png" 
                alt="Rental Process" 
                className={styles.heroImg} 
              />
              
              {/* Floating feature tags */}
              <div className={`${styles.floatTag} ${styles.tag1}`}>
                <i className="fas fa-gas-pump"></i>
                <span>Hybrid Tech</span>
              </div>
              <div className={`${styles.floatTag} ${styles.tag2}`}>
                <i className="fas fa-star"></i>
                <span>Top Rated</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollDown}>
        <div className={styles.mouse}>
          <div className={styles.wheel}></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
