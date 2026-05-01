import React from 'react';

export const PageLoader = () => (
  <div className="d-flex justify-content-center align-items-center vh-100" style={{ background: '#f8f9fa' }}>
    <div className="text-center">
      <div className="spinner-grow text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <h5 className="mt-3 text-primary fw-bold">Loading...</h5>
    </div>
  </div>
);

export const Skeleton = ({ width = '100%', height = '1rem', borderRadius = '4px', className = '' }) => (
  <div
    className={`skeleton-loader ${className}`}
    style={{
      width,
      height,
      borderRadius,
      backgroundColor: '#e9ecef',
      backgroundImage: 'linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%)',
      backgroundSize: '200% 100%',
      animation: 'skeleton-pulse 1.5s infinite linear'
    }}
  />
);

export const CarSkeleton = () => (
  <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
    <Skeleton height="200px" borderRadius="0" />
    <div className="card-body">
      <Skeleton width="60%" height="1.5rem" className="mb-2" />
      <Skeleton width="40%" height="1rem" className="mb-3" />
      <div className="d-flex gap-2">
        <Skeleton width="30%" height="1rem" />
        <Skeleton width="30%" height="1rem" />
      </div>
    </div>
  </div>
);
