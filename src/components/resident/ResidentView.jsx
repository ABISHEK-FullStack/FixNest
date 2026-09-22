import React, { useState } from 'react';
import { useTickets } from '../../context/TicketContext';
import SLAClock from '../SLAClock';
import BeforeAfterViewer from '../BeforeAfterViewer';
import VerifyModal from './VerifyModal';
import { CATEGORIES, PRIORITIES } from '../../data/mockData';
import { formatTimestamp } from '../../utils/slaHelper';

export default function ResidentView({ onOpenReportModal }) {
  const { tickets, currentResident } = useTickets();
  const [filterTab, setFilterTab] = useState('myFlat'); // 'myFlat' | 'common' | 'all'
  const [expandedTimelines, setExpandedTimelines] = useState({});
  const [verifyingTicket, setVerifyingTicket] = useState(null);

  const toggleTimeline = (id) => {
    setExpandedTimelines(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredTickets = tickets.filter(t => {
    if (filterTab === 'myFlat') {
      return t.flat === currentResident.flat || t.residentName === currentResident.name;
    }
    if (filterTab === 'common') {
      return t.flat?.toLowerCase().includes('common') || t.flat?.toLowerCase().includes('lobby') || t.flat?.toLowerCase().includes('chute');
    }
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN':
        return <span className="badge bg-warning text-dark border">Pending Supervisor</span>;
      case 'ACCEPTED':
        return <span className="badge bg-info text-dark">Accepted & Triaged</span>;
      case 'IN_PROGRESS':
        return <span className="badge bg-primary">Worker In-Progress</span>;
      case 'RESOLVED':
        return <span className="badge bg-purple text-white animate-pulse" style={{ backgroundColor: '#7c3aed' }}>Fix Submitted • Awaiting Sign-off</span>;
      case 'VERIFIED':
        return <span className="badge bg-success d-inline-flex align-items-center gap-1"><i className="bi bi-check-all"></i> Verified & Closed</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  const getProgressStepIndex = (status) => {
    switch (status) {
      case 'OPEN': return 1;
      case 'ACCEPTED': return 2;
      case 'IN_PROGRESS': return 3;
      case 'RESOLVED': return 4;
      case 'VERIFIED': return 5;
      default: return 1;
    }
  };

  return (
    <div>
      {/* Welcome Hero Banner */}
      <div className="fn-hero-gradient text-white p-4 p-md-5 rounded-4 shadow-sm mb-4 position-relative overflow-hidden">
        <div className="row align-items-center position-relative" style={{ zIndex: 2 }}>
          <div className="col-12 col-md-8">
            <span className="badge bg-white bg-opacity-25 text-white mb-2 py-1 px-2.5">
              <i className="bi bi-person-circle me-1"></i> Resident Portal • {currentResident.flat} ({currentResident.block})
            </span>
            <h2 className="fw-bold display-6 mb-1">Vanakkam, {currentResident.name}!</h2>
            <p className="text-white-50 small mb-0 max-w-xl">
              Log apartment complaints with guaranteed SLA turnaround, photographic proof of repairs, and direct resident sign-off.
            </p>
          </div>
          <div className="col-12 col-md-4 text-md-end mt-3 mt-md-0">
            <button
              onClick={onOpenReportModal}
              className="btn btn-light text-primary fw-bold px-4 py-2 shadow-sm d-inline-flex align-items-center gap-2"
            >
              <i className="bi bi-plus-circle-fill text-primary"></i>
              <span>Report New Issue</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <ul className="nav nav-pills gap-1">
          <li className="nav-item">
            <button
              onClick={() => setFilterTab('myFlat')}
              className={`nav-link btn btn-sm py-1.5 px-3 fw-bold rounded-pill ${
                filterTab === 'myFlat' ? 'active bg-primary' : 'bg-white text-secondary border'
              }`}
            >
              My Flat Complaints ({tickets.filter(t => t.flat === currentResident.flat || t.residentName === currentResident.name).length})
            </button>
          </li>
          <li className="nav-item">
            <button
              onClick={() => setFilterTab('common')}
              className={`nav-link btn btn-sm py-1.5 px-3 fw-bold rounded-pill ${
                filterTab === 'common' ? 'active bg-primary' : 'bg-white text-secondary border'
              }`}
            >
              Common Area Issues ({tickets.filter(t => t.flat?.toLowerCase().includes('common') || t.flat?.toLowerCase().includes('lobby') || t.flat?.toLowerCase().includes('chute')).length})
            </button>
          </li>
          <li className="nav-item">
            <button
              onClick={() => setFilterTab('all')}
              className={`nav-link btn btn-sm py-1.5 px-3 fw-bold rounded-pill ${
                filterTab === 'all' ? 'active bg-primary' : 'bg-white text-secondary border'
              }`}
            >
              All Society Tickets ({tickets.length})
            </button>
          </li>
        </ul>

        <span className="small text-muted">
          Showing <strong className="text-dark">{filteredTickets.length}</strong> complaints
        </span>
      </div>

      {/* Tickets List */}
      {filteredTickets.length === 0 ? (
        <div className="fn-card text-center p-5">
          <div className="rounded-circle bg-success bg-opacity-10 text-success d-inline-flex align-items-center justify-center p-3 mb-2">
            <i className="bi bi-check-circle-fill fs-2"></i>
          </div>
          <h5 className="fw-bold text-dark mb-1">No complaints found</h5>
          <p className="text-muted small mb-3">
            All issues in this category are completely resolved.
          </p>
          <button onClick={onOpenReportModal} className="btn btn-primary btn-sm fw-bold">
            + Report a Problem
          </button>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {filteredTickets.map((ticket) => {
            const currentStep = getProgressStepIndex(ticket.status);
            const categoryObj = CATEGORIES.find(c => c.id === ticket.category);
            const priorityConfig = PRIORITIES[ticket.priority] || PRIORITIES.MEDIUM;
            const isExpanded = expandedTimelines[ticket.id];

            return (
              <div
                key={ticket.id}
                className={`fn-card p-4 ${ticket.status === 'RESOLVED' ? 'fn-card-highlight' : ''}`}
              >
                {/* Header row */}
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <span className="font-monospace fw-bold small bg-light border px-2 py-0.5 rounded text-dark">
                      {ticket.id}
                    </span>
                    <span className="badge bg-light text-secondary border">
                      <i className={`bi ${categoryObj?.icon || 'bi-tag'} me-1`}></i>
                      {categoryObj?.label || ticket.category}
                    </span>
                    <span className={`badge ${priorityConfig.badgeClass}`}>
                      {ticket.priority} Priority
                    </span>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <SLAClock ticket={ticket} compact />
                    {getStatusBadge(ticket.status)}
                  </div>
                </div>

                {/* Title & Description */}
                <h5 className="fw-bold text-dark mb-1">{ticket.title}</h5>
                <p className="text-secondary small mb-3">{ticket.description}</p>

                {/* Location & Metadata */}
                <div className="d-flex flex-wrap gap-3 small text-secondary mb-3">
                  <div>
                    <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                    <strong className="text-dark">{ticket.block}</strong>, Floor {ticket.floor} ({ticket.flat})
                  </div>
                  <div>
                    <i className="bi bi-clock me-1 text-muted"></i>
                    <span>Raised: {formatTimestamp(ticket.createdAt)}</span>
                  </div>
                  {ticket.assignedWorkerName && (
                    <div className="badge bg-light text-primary border border-primary">
                      <i className="bi bi-person-check-fill me-1"></i>
                      <span>Assigned: {ticket.assignedWorkerName}</span>
                    </div>
                  )}
                </div>

                {/* 5-Step Lifecycle Stepper */}
                <div className="stepper-container">
                  <div className="stepper-line"></div>
                  <div
                    className="stepper-line-progress"
                    style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
                  ></div>

                  {[
                    { num: 1, label: "Reported" },
                    { num: 2, label: "Accepted" },
                    { num: 3, label: "In Progress" },
                    { num: 4, label: "Fix Done" },
                    { num: 5, label: "Verified" }
                  ].map((step) => {
                    const isDone = currentStep >= step.num;
                    const isCurrent = currentStep === step.num;

                    return (
                      <div key={step.num} className="stepper-step">
                        <div className={`stepper-circle ${isCurrent ? 'active' : isDone ? 'completed' : ''}`}>
                          {isDone ? <i className="bi bi-check"></i> : step.num}
                        </div>
                        <span className={`stepper-label ${isCurrent ? 'active' : isDone ? 'completed' : ''}`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Resident action alert when RESOLVED */}
                {ticket.status === 'RESOLVED' && (
                  <div className="alert alert-warning border-warning p-3 mt-3 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-star-fill text-warning fs-4"></i>
                      <div>
                        <strong className="text-dark d-block">Technician submitted the fix! Resident inspection required.</strong>
                        <span className="small text-muted">
                          Inspect photo proof, verify water/electricity/lift working, and rate quality.
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setVerifyingTicket(ticket)}
                      className="btn btn-purple btn-sm fw-bold text-white shadow-sm d-flex align-items-center gap-1"
                      style={{ backgroundColor: '#7c3aed' }}
                    >
                      <i className="bi bi-patch-check-fill text-warning"></i>
                      <span>Inspect & Sign Off</span>
                    </button>
                  </div>
                )}

                {/* Verified Confirmation */}
                {ticket.status === 'VERIFIED' && ticket.verification && (
                  <div className="alert alert-success p-2.5 mt-3 d-flex justify-content-between align-items-center small">
                    <div>
                      <i className="bi bi-check-circle-fill text-success me-1"></i>
                      <strong>Verified by {ticket.verification.verifiedBy}: </strong>
                      <span className="fst-italic">"{ticket.verification.feedback}"</span>
                    </div>
                    <div className="text-warning fw-bold ms-2">
                      {[...Array(ticket.verification.rating || 5)].map((_, i) => (
                        <i key={i} className="bi bi-star-fill me-0.5"></i>
                      ))}
                    </div>
                  </div>
                )}

                {/* Collapsible details toggle */}
                <div className="border-top pt-2 mt-3 d-flex justify-content-between align-items-center small">
                  <div className="text-muted">
                    {ticket.beforePhoto && <span className="me-2"><i className="bi bi-camera me-1"></i>Before Photo</span>}
                    {ticket.afterPhoto && <span className="text-success"><i className="bi bi-check-circle me-1"></i>After Photo</span>}
                  </div>

                  <button
                    onClick={() => toggleTimeline(ticket.id)}
                    className="btn btn-link btn-sm text-decoration-none p-0 text-primary fw-bold"
                  >
                    <span>{isExpanded ? 'Hide Details' : 'View Photos & Action Trail'}</span>
                    <i className={`bi ms-1 ${isExpanded ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                  </button>
                </div>

                {/* Expanded photo & activity trail */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-top bg-light p-3 rounded-3">
                    <h6 className="small fw-bold text-uppercase text-secondary mb-2">Work Evidence Photos</h6>
                    <BeforeAfterViewer
                      beforePhoto={ticket.beforePhoto}
                      afterPhoto={ticket.afterPhoto}
                      resolutionNotes={ticket.resolutionNotes}
                      cost={ticket.cost}
                      workerName={ticket.assignedWorkerName}
                    />

                    <h6 className="small fw-bold text-uppercase text-secondary mt-3 mb-2">Activity History</h6>
                    <div className="small">
                      {ticket.timeline?.map((item, idx) => (
                        <div key={idx} className="d-flex gap-2 mb-1.5 align-items-start">
                          <i className="bi bi-dot text-primary fs-5 lh-1"></i>
                          <div>
                            <strong className="text-dark">{item.step}</strong>
                            <span className="text-muted ms-2" style={{ fontSize: '0.7rem' }}>
                              {formatTimestamp(item.time)}
                            </span>
                            <div className="text-secondary" style={{ fontSize: '0.75rem' }}>{item.note}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Verify modal instance */}
      <VerifyModal
        ticket={verifyingTicket}
        isOpen={Boolean(verifyingTicket)}
        onClose={() => setVerifyingTicket(null)}
      />
    </div>
  );
}
