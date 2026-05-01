import React from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './DealerHeader.module.css';

const DealerHeader = () => {
    const { user } = useAuth();

    return (
        <header className={styles.header}>
            <div className={styles.actionIcons}>
                {/* <div className={styles.iconBtn}>
                    <i className="far fa-bell"></i>
                    <span className={styles.badge}></span>
                </div>
                <div className={styles.iconBtn}>
                    <i className="far fa-comment-alt"></i>
                </div> */}
            </div>

            <div className={styles.profileSection}>
                <div className={styles.profileInfo}>
                    <span className={styles.profileName}>{user?.name || 'Dealer'}</span>
                    <span className={styles.profileRole}>Verified Dealer</span>
                </div>
                <div className={styles.avatar}>
                    {user?.photo ? (
                        <img
                            src={user.photo.startsWith('http') ? user.photo : `http://localhost:5000${user.photo.startsWith('/') ? '' : '/'}${user.photo}`}
                            alt="Profile"
                            className={styles.avatarImg}
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerText = user?.name?.charAt(0) || 'D';
                            }}
                        />
                    ) : (
                        user?.name?.charAt(0) || 'D'
                    )}
                </div>
            </div>
        </header>
    );
};

export default DealerHeader;
