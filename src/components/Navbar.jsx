import React from 'react';
import { useTickets } from '../context/TicketContext';
import { APARTMENT_INFO, WORKERS } from '../data/mockData';

export default function Navbar({ onOpenReportModal }) {
  const { 
    tickets, 
    currentRole, 
    setCurrentRole, 
    currentResident, 
    setCurrentResident,
    currentWorker, 
    setCurrentWorker,
    resetData 
  } = useTickets();

  const openTicketsCount = tickets.filter(t => t.status !== 'VERIFIED').length;
  const criticalCount = tickets.filter(t => t.priority === 'CRITICAL' && t.status !== 'VERIFIED').length;

  return (
    <header className="sticky-top shadow-sm">
      {/* Top Notification Bar */}
      <div className="bg-black text-light py-1 px-3 small border-bottom border-secondary">
        <div className="container-fluid d-flex flex-wrap justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-building text-primary"></i>
            <span className="fw-bold text-white">{APARTMENT_INFO.name}</span>
            <span className="text-secondary d-none d-sm-inline">|</span>
            <span className="text-secondary d-none d-md-inline">{APARTMENT_INFO.address}</span>
          </div>

          <div className="d-flex align-items-center gap-3">
            <span className="d-flex align-items-center gap-1 text-light">
              <span className="spinner-grow spinner-grow-sm text-success" style={{ width: '8px', height: '8px' }} role="status"></span>
              <span className="small">240 Units Active</span>
            </span>

            {criticalCount > 0 && (
              <span className="badge bg-danger d-flex align-items-center gap-1">
                <i className="bi bi-exclamation-triangle-fill"></i>
                <span>{criticalCount} Critical</span>
              </span>
            )}

            <button
              onClick={() => {
                if (window.confirm('Reset all demo tickets back to original state?')) {
                  resetData();
                }
              }}
              title="Reset Demo Tickets"
              className="btn btn-link btn-sm text-secondary text-decoration-none p-0"
            >
              <i className="bi bi-arrow-counterclockwise me-1"></i>
              <span className="d-none d-sm-inline">Reset Demo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Bootstrap Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark py-2">
        <div className="container-fluid">
          {/* Logo & Brand */}
          <div className="d-flex align-items-center gap-2 me-3">
            <div className="bg-primary text-white rounded-3 p-2 d-flex align-items-center justify-center shadow-sm" style={{ width: '38px', height: '38px' }}>
              <i className="bi bi-tools fs-5"></i>
            </div>
            <div>
              <div className="d-flex align-items-center gap-2">
                <span className="navbar-brand fw-extrabold m-0 tracking-tight fs-5">FixNest</span>
                <span className="badge bg-primary bg-opacity-25 text-primary border border-primary text-uppercase" style={{ fontSize: '0.65rem' }}>
                  Facility Ops
                </span>
              </div>
              <div className="text-secondary" style={{ fontSize: '0.7rem' }}>Apartment Maintenance & SLA Tracker</div>
            </div>
          </div>

          {/* Toggle for mobile */}
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarFixNest"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Nav links & Persona Switcher */}
          <div className="collapse navbar-collapse" id="navbarFixNest">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-1">
              <li className="nav-item">
                <button
                  type="button"
                  onClick={() => setCurrentRole('RESIDENT')}
                  className={`nav-link btn btn-link text-start text-lg-center px-3 py-2 rounded-2 ${
                    currentRole === 'RESIDENT' ? 'active bg-primary text-white fw-bold shadow-sm' : 'text-light'
                  }`}
                >
                  <i className="bi bi-house-door me-1"></i> Resident View
                </button>
              </li>

              <li className="nav-item">
                <button
                  type="button"
                  onClick={() => setCurrentRole('MAINTENANCE')}
                  className={`nav-link btn btn-link text-start text-lg-center px-3 py-2 rounded-2 position-relative ${
                    currentRole === 'MAINTENANCE' ? 'active bg-primary text-white fw-bold shadow-sm' : 'text-light'
                  }`}
                >
                  <i className="bi bi-clipboard-check me-1"></i> Supervisor Triage
                  {openTicketsCount > 0 && (
                    <span className="badge rounded-pill bg-danger ms-1" style={{ fontSize: '0.65rem' }}>
                      {openTicketsCount}
                    </span>
                  )}
                </button>
              </li>

              <li className="nav-item">
                <button
                  type="button"
                  onClick={() => setCurrentRole('WORKER')}
                  className={`nav-link btn btn-link text-start text-lg-center px-3 py-2 rounded-2 ${
                    currentRole === 'WORKER' ? 'active bg-primary text-white fw-bold shadow-sm' : 'text-light'
                  }`}
                >
                  <i className="bi bi-wrench me-1"></i> Field Worker
                </button>
              </li>

              <li className="nav-item">
                <button
                  type="button"
                  onClick={() => setCurrentRole('ADMIN')}
                  className={`nav-link btn btn-link text-start text-lg-center px-3 py-2 rounded-2 ${
                    currentRole === 'ADMIN' ? 'active bg-primary text-white fw-bold shadow-sm' : 'text-light'
                  }`}
                >
                  <i className="bi bi-graph-up-arrow me-1"></i> Executive Admin
                </button>
              </li>
            </ul>

            {/* Right side persona selector & action */}
            <div className="d-flex align-items-center gap-2 mt-2 mt-lg-0">
              {currentRole === 'RESIDENT' && (
                <>
                  <select
                    value={currentResident.id}
                    onChange={(e) => {
                      const found = APARTMENT_INFO.residents.find(r => r.id === e.target.value);
                      if (found) setCurrentResident(found);
                    }}
                    className="form-select form-select-sm bg-dark text-light border-secondary"
                    style={{ width: 'auto' }}
                    title="Switch Flat Resident"
                  >
                    {APARTMENT_INFO.residents.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.flat} - {r.name}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={onOpenReportModal}
                    className="btn btn-primary btn-sm fw-bold d-flex align-items-center gap-1 shadow-sm"
                  >
                    <i className="bi bi-plus-circle-fill"></i>
                    <span>Report Problem</span>
                  </button>
                </>
              )}

              {currentRole === 'WORKER' && (
                <div className="d-flex align-items-center gap-2">
                  <img
                    src={currentWorker.avatar}
                    alt={currentWorker.name}
                    className="rounded-circle border border-primary"
                    style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                  />
                  <select
                    value={currentWorker.id}
                    onChange={(e) => {
                      const found = WORKERS.find(w => w.id === e.target.value);
                      if (found) setCurrentWorker(found);
                    }}
                    className="form-select form-select-sm bg-dark text-light border-secondary"
                    style={{ width: 'auto' }}
                  >
                    {WORKERS.map(w => (
                      <option key={w.id} value={w.id}>
                        {w.name} ({w.trade.split(' ')[0]})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {currentRole === 'MAINTENANCE' && (
                <span className="badge bg-secondary text-light p-2 d-flex align-items-center gap-1">
                  <i className="bi bi-person-badge"></i> Supervisor Mode
                </span>
              )}

              {currentRole === 'ADMIN' && (
                <span className="badge bg-purple bg-opacity-25 text-white border border-light p-2 d-flex align-items-center gap-1">
                  <i className="bi bi-shield-lock-fill text-warning"></i> Facility Manager
                </span>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
