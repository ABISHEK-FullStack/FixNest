import React, { useState } from 'react';
import { useTickets } from '../../context/TicketContext';
import SLAClock from '../SLAClock';
import BeforeAfterViewer from '../BeforeAfterViewer';
import { WORKERS, PRIORITIES } from '../../data/mockData';
import { formatTimestamp } from '../../utils/slaHelper';

const PRESET_AFTER_PHOTOS = [
  {
    name: "Clean PVC Pipe Joint",
    url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Bright LED Panel Fixed",
    url: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Elevator Panel Serviced",
    url: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Sanitized & Cleared Chute",
    url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80"
  }
];

export default function WorkerView() {
  const { tickets, currentWorker, setCurrentWorker, startWork, resolveTicket } = useTickets();

  const [resolvingTicket, setResolvingTicket] = useState(null);
  const [afterPhotoUrl, setAfterPhotoUrl] = useState(PRESET_AFTER_PHOTOS[0].url);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState('Replaced damaged component, tested pressure flow for 15 minutes. Area thoroughly cleaned.');
  const [cost, setCost] = useState('350');

  const myAssignedTickets = tickets.filter(t => t.assignedWorkerId === currentWorker.id);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadPreview(reader.result);
        setAfterPhotoUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCompleteSubmit = (e) => {
    e.preventDefault();
    if (!resolvingTicket) return;

    resolveTicket(resolvingTicket.id, {
      afterPhoto: uploadPreview || afterPhotoUrl,
      resolutionNotes: resolutionNotes.trim(),
      cost: cost ? Number(cost) : 0
    });

    setResolvingTicket(null);
    setUploadPreview(null);
  };

  return (
    <div>
      {/* Worker Profile Header */}
      <div className="fn-worker-gradient text-white p-4 p-md-5 rounded-4 shadow-sm mb-4">
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
          <div className="d-flex align-items-center gap-3">
            <img
              src={currentWorker.avatar}
              alt={currentWorker.name}
              className="rounded-4 border border-2 border-primary shadow-sm"
              style={{ width: '64px', height: '64px', objectFit: 'cover' }}
            />
            <div>
              <span className="badge bg-primary mb-1 py-1 px-2">
                <i className="bi bi-wrench-adjustable me-1"></i> Field Service Specialist
              </span>
              <h3 className="fw-bold m-0">{currentWorker.name}</h3>
              <div className="small text-secondary mt-1 d-flex flex-wrap gap-2">
                <span className="text-info fw-semibold">{currentWorker.trade}</span>
                <span>•</span>
                <span className="text-warning"><i className="bi bi-star-fill"></i> {currentWorker.rating} Rating</span>
                <span>•</span>
                <span>{currentWorker.phone}</span>
              </div>
            </div>
          </div>

          <div className="bg-black bg-opacity-40 p-2.5 rounded-3 border border-secondary">
            <label className="form-label small text-secondary mb-1" style={{ fontSize: '0.7rem' }}>Switch Worker View:</label>
            <select
              value={currentWorker.id}
              onChange={(e) => {
                const found = WORKERS.find(w => w.id === e.target.value);
                if (found) setCurrentWorker(found);
              }}
              className="form-select form-select-sm bg-dark text-light border-secondary"
            >
              {WORKERS.map(w => (
                <option key={w.id} value={w.id}>
                  {w.name} - {w.trade}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 className="fw-bold text-dark mb-0">Assigned Job Cards</h5>
          <div className="small text-muted">Navigate to flat, fix the issue, and upload photographic evidence.</div>
        </div>
        <span className="badge bg-primary py-1.5 px-3 rounded-pill">
          {myAssignedTickets.length} Jobs in Queue
        </span>
      </div>

      {/* Assigned Tickets */}
      {myAssignedTickets.length === 0 ? (
        <div className="fn-card text-center p-5 text-muted small">
          <i className="bi bi-check-all fs-2 text-success mb-2 d-block"></i>
          <h6 className="fw-bold text-dark">No pending jobs for {currentWorker.name}</h6>
          <span>Switch to Supervisor Triage to assign tickets to this specialist.</span>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {myAssignedTickets.map((ticket) => {
            const priorityConfig = PRIORITIES[ticket.priority] || PRIORITIES.MEDIUM;

            return (
              <div key={ticket.id} className="fn-card p-4">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <span className="font-monospace fw-bold small bg-light border px-2 py-0.5 rounded text-dark">
                      {ticket.id}
                    </span>
                    <span className={`badge ${priorityConfig.badgeClass}`}>
                      {ticket.priority} Priority
                    </span>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <SLAClock ticket={ticket} />
                    <span className="badge bg-secondary">{ticket.status}</span>
                  </div>
                </div>

                <h5 className="fw-bold text-dark mb-1">{ticket.title}</h5>
                <p className="text-secondary small mb-3">{ticket.description}</p>

                {/* Location & Resident Details */}
                <div className="row g-2 p-3 bg-light rounded-3 mb-3 small">
                  <div className="col-12 col-md-6">
                    <div className="text-secondary text-uppercase fw-bold" style={{ fontSize: '0.65rem' }}>Service Location</div>
                    <div className="fw-bold text-dark">
                      <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                      {ticket.block}, Floor {ticket.floor} • Flat {ticket.flat}
                    </div>
                  </div>
                  <div className="col-12 col-md-6 d-flex justify-content-between align-items-center">
                    <div>
                      <div className="text-secondary text-uppercase fw-bold" style={{ fontSize: '0.65rem' }}>Resident Contact</div>
                      <div className="fw-bold text-dark">{ticket.residentName}</div>
                    </div>
                    <a
                      href={`tel:${ticket.residentPhone}`}
                      className="btn btn-sm btn-outline-primary fw-bold"
                    >
                      <i className="bi bi-telephone-fill me-1"></i> Call Resident
                    </a>
                  </div>
                </div>

                {/* Before Photo Preview */}
                {ticket.beforePhoto && (
                  <div className="d-flex align-items-center gap-2 p-2 bg-light rounded-3 mb-3 small border">
                    <img
                      src={ticket.beforePhoto}
                      alt="Before"
                      className="rounded border"
                      style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                    />
                    <div>
                      <strong className="text-dark d-block">Reported Problem Photo:</strong>
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>Inspect issue visual before commencing repair</span>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 pt-2 border-top">
                  <span className="small text-secondary">
                    Specialist: <strong className="text-dark">{currentWorker.name}</strong>
                  </span>

                  <div className="d-flex gap-2">
                    {/* If ACCEPTED -> Start Work */}
                    {(ticket.status === 'ACCEPTED' || ticket.status === 'OPEN') && (
                      <button
                        onClick={() => startWork(ticket.id)}
                        className="btn btn-primary btn-sm fw-bold d-flex align-items-center gap-1 shadow-sm"
                      >
                        <i className="bi bi-play-circle-fill"></i>
                        <span>Arrived On-Site / Start Work</span>
                      </button>
                    )}

                    {/* If IN_PROGRESS -> Submit Fix */}
                    {ticket.status === 'IN_PROGRESS' && (
                      <button
                        onClick={() => {
                          setResolvingTicket(ticket);
                          setAfterPhotoUrl(PRESET_AFTER_PHOTOS[0].url);
                        }}
                        className="btn btn-success btn-sm fw-bold d-flex align-items-center gap-1 shadow-sm"
                      >
                        <i className="bi bi-camera-fill"></i>
                        <span>Job Done • Upload After Photo</span>
                      </button>
                    )}

                    {/* If RESOLVED -> Awaiting Resident */}
                    {ticket.status === 'RESOLVED' && (
                      <span className="badge bg-purple text-white p-2 d-flex align-items-center gap-1" style={{ backgroundColor: '#7c3aed' }}>
                        <i className="bi bi-hourglass-split"></i>
                        <span>Submitted • Awaiting Resident Verification</span>
                      </span>
                    )}

                    {/* If VERIFIED -> Done */}
                    {ticket.status === 'VERIFIED' && (
                      <span className="badge bg-success p-2 d-flex align-items-center gap-1">
                        <i className="bi bi-check-all"></i>
                        <span>Resident Approved ({ticket.verification?.rating || 5}★)</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Before/After preview if resolved/verified */}
                {(ticket.status === 'RESOLVED' || ticket.status === 'VERIFIED') && ticket.afterPhoto && (
                  <div className="mt-3 pt-3 border-top">
                    <BeforeAfterViewer
                      beforePhoto={ticket.beforePhoto}
                      afterPhoto={ticket.afterPhoto}
                      resolutionNotes={ticket.resolutionNotes}
                      cost={ticket.cost}
                      workerName={ticket.assignedWorkerName}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Complete Fix Modal */}
      {resolvingTicket && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-light">
                <div>
                  <h5 className="modal-title fw-bold text-dark">Submit Work Completion Proof</h5>
                  <div className="text-muted small">
                    Ticket: <strong className="text-dark">{resolvingTicket.id}</strong> • {resolvingTicket.title}
                  </div>
                </div>
                <button type="button" className="btn-close" onClick={() => setResolvingTicket(null)}></button>
              </div>

              <form onSubmit={handleCompleteSubmit}>
                <div className="modal-body p-4">
                  {/* After photo upload */}
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-uppercase text-secondary">
                      Upload "After Fix" Photo *
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="form-control form-control-sm mb-2"
                    />

                    <div className="small text-muted mb-1">Or pick a demo resolved photo:</div>
                    <div className="row g-2 mb-2">
                      {PRESET_AFTER_PHOTOS.map((p, idx) => (
                        <div key={idx} className="col-6 col-md-3">
                          <button
                            type="button"
                            onClick={() => {
                              setAfterPhotoUrl(p.url);
                              setUploadPreview(null);
                            }}
                            className={`card h-100 border p-1 text-center overflow-hidden ${
                              afterPhotoUrl === p.url && !uploadPreview ? 'border-success border-2' : ''
                            }`}
                          >
                            <img src={p.url} alt={p.name} style={{ height: '45px', objectFit: 'cover' }} className="rounded" />
                            <span className="small text-muted mt-1 text-truncate" style={{ fontSize: '0.65rem' }}>{p.name}</span>
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Preview */}
                    {(afterPhotoUrl || uploadPreview) && (
                      <div className="rounded border overflow-hidden position-relative" style={{ height: '140px' }}>
                        <img
                          src={uploadPreview || afterPhotoUrl}
                          alt="Preview"
                          className="w-100 h-100"
                          style={{ objectFit: 'cover' }}
                        />
                        <span className="badge bg-success position-absolute top-0 end-0 m-2">
                          AFTER FIX PHOTO
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Resolution Notes */}
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-uppercase text-secondary">
                      Resolution Summary & Parts Replaced *
                    </label>
                    <textarea
                      rows="2"
                      required
                      value={resolutionNotes}
                      onChange={(e) => setResolutionNotes(e.target.value)}
                      placeholder="Explain work performed, tests conducted, and parts replaced..."
                      className="form-control"
                    ></textarea>
                  </div>

                  {/* Spares Cost */}
                  <div className="mb-2">
                    <label className="form-label small fw-bold text-uppercase text-secondary">
                      Consumables & Parts Cost (₹)
                    </label>
                    <div className="input-group input-group-sm">
                      <span className="input-group-text">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
                        placeholder="0"
                        className="form-control"
                      />
                    </div>
                    <div className="small text-muted mt-1" style={{ fontSize: '0.7rem' }}>
                      Leave 0 if covered under apartment society AMC/warranty.
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setResolvingTicket(null)}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success btn-sm fw-bold d-flex align-items-center gap-1 shadow-sm"
                  >
                    <i className="bi bi-check-circle-fill"></i>
                    <span>Submit Proof for Resident Sign-off</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
