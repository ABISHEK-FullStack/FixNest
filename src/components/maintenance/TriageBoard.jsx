import React, { useState } from 'react';
import { useTickets } from '../../context/TicketContext';
import SLAClock from '../SLAClock';
import BeforeAfterViewer from '../BeforeAfterViewer';
import AssignModal from './AssignModal';
import { CATEGORIES, PRIORITIES, APARTMENT_INFO } from '../../data/mockData';
import { formatTimestamp, getSLAStatus } from '../../utils/slaHelper';

export default function TriageBoard() {
  const { tickets, acceptTicket } = useTickets();

  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'unassigned' | 'critical' | 'resolved' | 'closed'
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedBlock, setSelectedBlock] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [assigningTicket, setAssigningTicket] = useState(null);
  const [expandedCards, setExpandedCards] = useState({});

  const toggleExpand = (id) => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredTickets = tickets.filter(t => {
    // Tab filter
    if (activeTab === 'unassigned' && t.assignedWorkerId) return false;
    if (activeTab === 'critical' && t.priority !== 'CRITICAL' && !getSLAStatus(t).isBreached) return false;
    if (activeTab === 'resolved' && t.status !== 'RESOLVED') return false;
    if (activeTab === 'closed' && t.status !== 'VERIFIED') return false;
    if (activeTab === 'active' && (t.status === 'VERIFIED')) return false;

    // Category filter
    if (selectedCategory !== 'ALL' && t.category !== selectedCategory) return false;

    // Block filter
    if (selectedBlock !== 'ALL' && t.block !== selectedBlock) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = t.id.toLowerCase().includes(q);
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchFlat = t.flat?.toLowerCase().includes(q);
      const matchResident = t.residentName?.toLowerCase().includes(q);
      if (!matchId && !matchTitle && !matchFlat && !matchResident) return false;
    }

    return true;
  });

  const unassignedCount = tickets.filter(t => !t.assignedWorkerId && t.status !== 'VERIFIED').length;
  const criticalCount = tickets.filter(t => t.priority === 'CRITICAL' && t.status !== 'VERIFIED').length;
  const awaitingVerificationCount = tickets.filter(t => t.status === 'RESOLVED').length;

  return (
    <div>
      {/* Supervisor Header */}
      <div className="bg-dark text-white p-4 p-md-5 rounded-4 shadow-sm mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <span className="badge bg-primary bg-opacity-25 text-primary border border-primary mb-2 py-1 px-2.5">
              <i className="bi bi-clipboard2-check-fill me-1"></i> Facilities Supervisor Control Center
            </span>
            <h2 className="fw-bold display-6 mb-1">Maintenance Triage & Dispatch</h2>
            <p className="text-secondary small mb-0">
              Acknowledge reported complaints, assign specialized vendors, and supervise SLA timers.
            </p>
          </div>

          {/* KPI Badges */}
          <div className="d-flex flex-wrap gap-2">
            <div className="bg-black bg-opacity-50 p-3 rounded-3 border border-secondary text-center">
              <div className="small text-secondary fw-semibold">Needs Assignment</div>
              <div className={`fs-4 fw-bold ${unassignedCount > 0 ? 'text-warning' : 'text-light'}`}>
                {unassignedCount}
              </div>
            </div>
            <div className="bg-black bg-opacity-50 p-3 rounded-3 border border-secondary text-center">
              <div className="small text-secondary fw-semibold">Critical Emergencies</div>
              <div className={`fs-4 fw-bold ${criticalCount > 0 ? 'text-danger' : 'text-light'}`}>
                {criticalCount}
              </div>
            </div>
            <div className="bg-black bg-opacity-50 p-3 rounded-3 border border-secondary text-center">
              <div className="small text-secondary fw-semibold">Pending Resident Sign-off</div>
              <div className="fs-4 fw-bold text-info">
                {awaitingVerificationCount}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="fn-card p-3 mb-4">
        {/* Status tabs */}
        <ul className="nav nav-pills gap-1 mb-3">
          <li className="nav-item">
            <button
              onClick={() => setActiveTab('active')}
              className={`nav-link btn btn-sm py-1.5 px-3 fw-bold rounded-pill ${
                activeTab === 'active' ? 'active bg-dark text-white' : 'text-dark bg-light'
              }`}
            >
              Active Queue ({tickets.filter(t => t.status !== 'VERIFIED').length})
            </button>
          </li>
          <li className="nav-item">
            <button
              onClick={() => setActiveTab('unassigned')}
              className={`nav-link btn btn-sm py-1.5 px-3 fw-bold rounded-pill ${
                activeTab === 'unassigned' ? 'active bg-warning text-dark' : 'text-warning-emphasis bg-warning bg-opacity-10'
              }`}
            >
              Unassigned ({unassignedCount})
            </button>
          </li>
          <li className="nav-item">
            <button
              onClick={() => setActiveTab('critical')}
              className={`nav-link btn btn-sm py-1.5 px-3 fw-bold rounded-pill ${
                activeTab === 'critical' ? 'active bg-danger text-white' : 'text-danger-emphasis bg-danger bg-opacity-10'
              }`}
            >
              Critical / Breached ({criticalCount})
            </button>
          </li>
          <li className="nav-item">
            <button
              onClick={() => setActiveTab('resolved')}
              className={`nav-link btn btn-sm py-1.5 px-3 fw-bold rounded-pill ${
                activeTab === 'resolved' ? 'active bg-primary text-white' : 'text-primary bg-primary bg-opacity-10'
              }`}
            >
              Awaiting Verification ({awaitingVerificationCount})
            </button>
          </li>
          <li className="nav-item">
            <button
              onClick={() => setActiveTab('closed')}
              className={`nav-link btn btn-sm py-1.5 px-3 fw-bold rounded-pill ${
                activeTab === 'closed' ? 'active bg-success text-white' : 'text-success bg-success bg-opacity-10'
              }`}
            >
              Verified & Closed ({tickets.filter(t => t.status === 'VERIFIED').length})
            </button>
          </li>
        </ul>

        {/* Dropdowns & Search */}
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-4">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-light"><i className="bi bi-search"></i></span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ticket ID, flat, resident..."
                className="form-control"
              />
            </div>
          </div>

          <div className="col-6 col-md-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="form-select form-select-sm"
            >
              <option value="ALL">All Categories</option>
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className="col-6 col-md-3">
            <select
              value={selectedBlock}
              onChange={(e) => setSelectedBlock(e.target.value)}
              className="form-select form-select-sm"
            >
              <option value="ALL">All Blocks</option>
              {APARTMENT_INFO.blocks.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {(selectedCategory !== 'ALL' || selectedBlock !== 'ALL' || searchQuery) && (
            <div className="col-12 col-md-2 text-md-end">
              <button
                onClick={() => {
                  setSelectedCategory('ALL');
                  setSelectedBlock('ALL');
                  setSearchQuery('');
                }}
                className="btn btn-link btn-sm text-decoration-none text-danger p-0"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Ticket Cards */}
      <div className="d-flex flex-column gap-3">
        {filteredTickets.length === 0 ? (
          <div className="fn-card text-center p-5 text-muted small">
            No complaints found matching this filter criteria.
          </div>
        ) : (
          filteredTickets.map((ticket) => {
            const isExpanded = expandedCards[ticket.id];
            const categoryObj = CATEGORIES.find(c => c.id === ticket.category);
            const priorityConfig = PRIORITIES[ticket.priority] || PRIORITIES.MEDIUM;

            return (
              <div key={ticket.id} className="fn-card p-4">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <span className="font-monospace fw-bold small bg-light border px-2 py-0.5 rounded text-dark">
                      {ticket.id}
                    </span>
                    <span className="badge bg-light text-secondary border">
                      {categoryObj?.label || ticket.category}
                    </span>
                    <span className={`badge ${priorityConfig.badgeClass}`}>
                      {ticket.priority}
                    </span>
                    <span className="small text-secondary">
                      {ticket.block}, Floor {ticket.floor} ({ticket.flat})
                    </span>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <SLAClock ticket={ticket} compact />
                    <span className="badge bg-secondary text-white">{ticket.status}</span>
                  </div>
                </div>

                <h5 className="fw-bold text-dark mb-1">{ticket.title}</h5>
                <p className="text-secondary small mb-3">{ticket.description}</p>

                {/* Resident info & Action controls */}
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 pt-2 border-top">
                  <div className="small text-secondary">
                    <span>Resident: <strong className="text-dark">{ticket.residentName}</strong> ({ticket.residentPhone})</span>
                    <span className="mx-2">•</span>
                    <span>Logged: {formatTimestamp(ticket.createdAt)}</span>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    {ticket.status === 'OPEN' && (
                      <button
                        onClick={() => acceptTicket(ticket.id)}
                        className="btn btn-outline-primary btn-sm fw-bold d-flex align-items-center gap-1"
                      >
                        <i className="bi bi-check2-circle"></i>
                        <span>Accept Ticket</span>
                      </button>
                    )}

                    <button
                      onClick={() => setAssigningTicket(ticket)}
                      className={`btn btn-sm fw-bold d-flex align-items-center gap-1 ${
                        ticket.assignedWorkerId ? 'btn-light border' : 'btn-primary text-white shadow-sm'
                      }`}
                    >
                      <i className="bi bi-person-plus-fill"></i>
                      <span>{ticket.assignedWorkerName ? `Reassign (${ticket.assignedWorkerName})` : 'Dispatch Worker'}</span>
                    </button>

                    <button
                      onClick={() => toggleExpand(ticket.id)}
                      className="btn btn-sm btn-light border text-secondary"
                    >
                      <i className={`bi ${isExpanded ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-top bg-light p-3 rounded-3">
                    <BeforeAfterViewer
                      beforePhoto={ticket.beforePhoto}
                      afterPhoto={ticket.afterPhoto}
                      resolutionNotes={ticket.resolutionNotes}
                      cost={ticket.cost}
                      workerName={ticket.assignedWorkerName}
                    />

                    <h6 className="small fw-bold text-uppercase text-secondary mt-3 mb-2">Audit Action Trail</h6>
                    <div className="small">
                      {ticket.timeline?.map((t, idx) => (
                        <div key={idx} className="d-flex gap-2 mb-1.5 align-items-start">
                          <i className="bi bi-dot text-primary fs-5 lh-1"></i>
                          <div>
                            <strong className="text-dark">{t.step}</strong>
                            <span className="text-muted ms-2" style={{ fontSize: '0.7rem' }}>
                              {formatTimestamp(t.time)}
                            </span>
                            <div className="text-secondary" style={{ fontSize: '0.75rem' }}>{t.note}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Dispatch Modal */}
      <AssignModal
        ticket={assigningTicket}
        isOpen={Boolean(assigningTicket)}
        onClose={() => setAssigningTicket(null)}
      />
    </div>
  );
}
