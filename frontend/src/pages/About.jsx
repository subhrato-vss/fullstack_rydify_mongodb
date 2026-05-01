import React from 'react';
import { Link } from 'react-router-dom';
import styles from './About.module.css';

const About = () => {
  return (
    <div className={styles.aboutPage}>
      {/* Hero Section / Breadcrumb */}
      <section className={styles.heroSection}>
        <div className={styles.heroGlow}></div>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <span className={styles.badge}>Our Story</span>
            <h1 className={styles.heroTitle}>
              Revolutionizing How You <br />
              <span className={styles.gradientText}>Experience The Road</span>
            </h1>
            <p className={styles.heroDesc}>
              Rydify is more than just a rental platform. We are a technology-driven
              ecosystem connecting premium vehicle providers with passionate drivers.
            </p>
            <div className={styles.breadcrumb}>
              <Link to="/">Home</Link>
              <i className="fas fa-chevron-right"></i>
              <span>About Us</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.statsSection}>
        <div className={styles.container}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}><i className="fas fa-car"></i></div>
              <div className={styles.statInfo}>
                <span className={styles.statNumber}>15k+</span>
                <span className={styles.statLabel}>Premium Cars</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}><i className="fas fa-handshake"></i></div>
              <div className={styles.statInfo}>
                <span className={styles.statNumber}>250+</span>
                <span className={styles.statLabel}>Verified Dealers</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}><i className="fas fa-users"></i></div>
              <div className={styles.statInfo}>
                <span className={styles.statNumber}>50k+</span>
                <span className={styles.statLabel}>Happy Drivers</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}><i className="fas fa-map-marker-alt"></i></div>
              <div className={styles.statInfo}>
                <span className={styles.statNumber}>12+</span>
                <span className={styles.statLabel}>Cities Covered</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className={styles.visionSection}>
        <div className={styles.container}>
          <div className={styles.visionGrid}>
            <div className={styles.visionImageArea}>
              <div className={styles.visionGlow}></div>
              <img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1000" alt="Vision" className={styles.visionImg} />
              <div className={styles.experienceBox}>
                <span className={styles.expYears}>10+</span>
                <span className={styles.expText}>Years of Excellence</span>
              </div>
            </div>
            <div className={styles.visionContent}>
              <span className={styles.subTitle}>Our Vision</span>
              <h2 className={styles.sectionTitle}>Driving the Future of Mobility</h2>
              <p className={styles.visionDesc}>
                We believe that everyone deserves a premium driving experience without the
                burdens of ownership. Rydify was born from the desire to make high-end
                transportation accessible, transparent, and seamless.
              </p>
              <div className={styles.featuresList}>
                <div className={styles.featureItem}>
                  <i className="fas fa-check-circle"></i>
                  <span>Transparent Pricing & No Hidden Fees</span>
                </div>
                <div className={styles.featureItem}>
                  <i className="fas fa-check-circle"></i>
                  <span>24/7 Premium Roadside Assistance</span>
                </div>
                <div className={styles.featureItem}>
                  <i className="fas fa-check-circle"></i>
                  <span>Verified Dealers & Quality Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className={styles.teamSection}>
        <div className={styles.container}>
          <div className={styles.headerCentered}>
            <span className={styles.subTitle}>Our Team</span>
            <h2 className={styles.sectionTitle}>The Minds Behind Rydify</h2>
          </div>
          <div className={styles.teamGrid}>
            {[
              { name: 'David Chen', role: 'Founder & CEO', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400' },
              { name: 'Sarah Jenkins', role: 'Head of Operations', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400' },
              { name: 'Marcus Thorne', role: 'CTO', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400' },
              { name: 'Elena Rodriguez', role: 'Marketing Director', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400' }
            ].map((member, idx) => (
              <div key={idx} className={styles.teamCard}>
                <div className={styles.teamImgWrapper}>
                  <img src={member.img} alt={member.name} className={styles.teamImg} />
                  <div className={styles.teamOverlay}>
                    <div className={styles.teamSocials}>
                      <a href="#"><i className="fab fa-linkedin-in"></i></a>
                      <a href="#"><i className="fab fa-twitter"></i></a>
                    </div>
                  </div>
                </div>
                <div className={styles.teamInfo}>
                  <h3>{member.name}</h3>
                  <p>{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaCard}>
            <div className={styles.ctaContent}>
              <h2 className='text-white'>Ready to Experience Rydify?</h2>
              <p>Join thousands of satisfied drivers and start your journey today.</p>
              <div className={styles.ctaActions}>
                <Link to="/cars" className={styles.btnPrimary}>Browse Fleet</Link>
                <Link to="/contact" className={styles.btnSecondary}>Contact Us</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
