import React, { useState } from 'react';
import { useTickets } from '../../context/TicketContext';
import { WORKERS } from '../../data/mockData';

export default function AssignModal({ ticket, isOpen, onClose }) {
  const { assignTicket } = useTickets();

  const [selectedWorkerId, setSelectedWorkerId] = useState(() => {
    if (ticket?.assignedWorkerId) return ticket.assignedWorkerId;
    const match = WORKERS.find(w => w.category === ticket?.category);
    return match ? match.id : WORKERS[0]?.id;
  });

  const [dispatchNote, setDispatchNote] = useState('');

  if (!isOpen || !ticket) return null;

  const handleAssign = () => {
    if (!selectedWorkerId) return;
    assignTicket(ticket.id, selectedWorkerId, dispatchNote.trim());
    onClose();
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header bg-light">
            <div>
              <h5 className="modal-title fw-bold text-dark">Dispatch Technician</h5>
              <div className="text-muted small">
                Ticket: <strong className="text-dark">{ticket.id}</strong> • {ticket.title}
              </div>
            </div>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body p-4">
            {/* Ticket Summary */}
            <div className="alert alert-light border p-2 mb-3 small">
              <div><strong>Location:</strong> {ticket.block} - Floor {ticket.floor} ({ticket.flat})</div>
              <div><strong>Priority:</strong> <span className="badge bg-danger">{ticket.priority}</span></div>
            </div>

            {/* Workers List */}
            <div className="mb-3">
              <label className="form-label small fw-bold text-uppercase text-secondary">
                Select Field Specialist
              </label>
              <div className="d-flex flex-column gap-2">
                {WORKERS.map((worker) => {
                  const isMatch = worker.category === ticket.category;
                  const isSelected = selectedWorkerId === worker.id;

                  return (
                    <div
                      key={worker.id}
                      onClick={() => setSelectedWorkerId(worker.id)}
                      className={`p-2.5 rounded-3 border d-flex justify-content-between align-items-center cursor-pointer ${
                        isSelected ? 'border-primary bg-primary bg-opacity-10 shadow-sm' : 'bg-white'
                      }`}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="d-flex align-items-center gap-2.5">
                        <img
                          src={worker.avatar}
                          alt={worker.name}
                          className="rounded-circle"
                          style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                        />
                        <div>
                          <div className="fw-bold small text-dark d-flex align-items-center gap-1">
                            <span>{worker.name}</span>
                            {isMatch && (
                              <span className="badge bg-success bg-opacity-25 text-success border border-success" style={{ fontSize: '0.65rem' }}>
                                Trade Match
                              </span>
                            )}
                          </div>
                          <div className="small text-secondary" style={{ fontSize: '0.75rem' }}>{worker.trade}</div>
                          <div className="small text-muted d-flex gap-2" style={{ fontSize: '0.7rem' }}>
                            <span className="text-warning"><i className="bi bi-star-fill"></i> {worker.rating}</span>
                            <span>•</span>
                            <span>{worker.activeTasks} active job</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <input
                          type="radio"
                          name="workerRadio"
                          checked={isSelected}
                          onChange={() => setSelectedWorkerId(worker.id)}
                          className="form-check-input"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dispatch Instructions */}
            <div className="mb-2">
              <label className="form-label small fw-bold text-uppercase text-secondary">
                Technician Instructions (Optional)
              </label>
              <textarea
                rows="2"
                value={dispatchNote}
                onChange={(e) => setDispatchNote(e.target.value)}
                placeholder="e.g. Call resident 10 mins before arrival, bring spare valve..."
                className="form-control form-control-sm"
              ></textarea>
            </div>
          </div>

          <div className="modal-footer bg-light">
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAssign}
              className="btn btn-primary btn-sm fw-bold d-flex align-items-center gap-1"
            >
              <i className="bi bi-person-check-fill"></i>
              <span>Confirm Dispatch</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
