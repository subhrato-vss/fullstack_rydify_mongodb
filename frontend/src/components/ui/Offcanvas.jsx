import React from 'react';
import styles from './Offcanvas.module.css';

const Offcanvas = ({ isOpen, onClose, title, children }) => {
  return (
    <>
      <div 
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`} 
        onClick={onClose}
      />
      <div className={`${styles.container} ${isOpen ? styles.containerOpen : ''}`}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className={styles.body}>
          {children}
        </div>
      </div>
    </>
  );
};

export default Offcanvas;
