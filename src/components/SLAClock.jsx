import React, { useState, useEffect } from 'react';
import { getSLAStatus } from '../utils/slaHelper';

export default function SLAClock({ ticket, compact = false }) {
  const [, setTick] = useState(0);

  // Re-calculate countdown every 30 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setTick(t => t + 1);
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const sla = getSLAStatus(ticket);

  if (compact) {
    return (
      <span className={`badge ${sla.badgeClass} rounded-pill d-inline-flex align-items-center gap-1 py-1 px-2`}>
        <i className={`bi ${sla.icon}`}></i>
        <span>{sla.label}</span>
      </span>
    );
  }

  return (
    <div className={`badge ${sla.badgeClass} p-2 text-start rounded-3 d-inline-flex align-items-center gap-2`}>
      <i className={`bi ${sla.icon} fs-5`}></i>
      <div>
        <div className="small fw-semibold text-uppercase opacity-75" style={{ fontSize: '0.65rem' }}>
          {ticket.status === 'VERIFIED' || ticket.status === 'RESOLVED' ? 'Resolution SLA' : 'SLA Target'}
        </div>
        <div className="fw-bold">{sla.label}</div>
      </div>
    </div>
  );
}
