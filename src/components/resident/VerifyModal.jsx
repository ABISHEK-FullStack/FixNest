import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useTickets } from '../../context/TicketContext';
import BeforeAfterViewer from '../BeforeAfterViewer';

export default function VerifyModal({ ticket, isOpen, onClose }) {
  const { verifyTicket, reopenTicket, currentResident } = useTickets();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('Technician solved the issue cleanly. Water leakage completely arrested and area wiped clean.');
  const [reopenReason, setReopenReason] = useState('');
  const [isReopening, setIsReopening] = useState(false);

  if (!isOpen || !ticket) return null;

  const handleConfirmVerify = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log('Confetti effect');
    }

    verifyTicket(ticket.id, {
      rating,
      feedback: feedback.trim(),
      verifiedBy: currentResident.name
    });

    onClose();
  };

  const handleReopen = () => {
    if (!reopenReason.trim()) {
      alert('Please explain why the issue is not fixed so the technician can address it.');
      return;
    }
    reopenTicket(ticket.id, reopenReason.trim());
    onClose();
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg">
          {/* Header */}
          <div className="modal-header bg-light">
            <div>
              <span className="badge bg-purple text-dark border me-2">Resident Sign-off</span>
              <h5 className="modal-title fw-bold text-dark d-inline">Verify Problem Resolution</h5>
              <div className="text-muted small mt-1">
                Ticket: <strong className="text-dark">{ticket.id}</strong> • {ticket.title}
              </div>
            </div>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          {/* Body */}
          <div className="modal-body p-4">
            {/* Proof of Work */}
            <div className="mb-3">
              <h6 className="fw-bold small text-uppercase text-secondary mb-2">
                Technician Proof of Completion
              </h6>
              <BeforeAfterViewer
                beforePhoto={ticket.beforePhoto}
                afterPhoto={ticket.afterPhoto}
                resolutionNotes={ticket.resolutionNotes}
                cost={ticket.cost}
                workerName={ticket.assignedWorkerName}
              />
            </div>

            {!isReopening ? (
              /* Verification rating form */
              <div className="border-top pt-3">
                {/* 5-Star Rating */}
                <div className="mb-3">
                  <label className="form-label small fw-bold text-uppercase text-secondary">
                    Rate Repair Quality & Worker Professionalism *
                  </label>
                  <div className="d-flex align-items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        className={`star-btn ${(hoverRating || rating) >= star ? 'active' : ''}`}
                      >
                        <i className={`bi ${(hoverRating || rating) >= star ? 'bi-star-fill text-warning' : 'bi-star text-muted'}`}></i>
                      </button>
                    ))}
                    <span className="ms-2 small fw-bold text-dark">
                      {rating === 5 && "⭐ Excellent! Clean fix."}
                      {rating === 4 && "👍 Good job, satisfied."}
                      {rating === 3 && "😐 Average, acceptable."}
                      {rating === 2 && "⚠️ Below expectations."}
                      {rating === 1 && "❌ Poor fix."}
                    </span>
                  </div>
                </div>

                {/* Feedback */}
                <div className="mb-3">
                  <label className="form-label small fw-bold text-uppercase text-secondary">
                    Resident Inspection Remarks & Feedback
                  </label>
                  <textarea
                    rows="2"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Share feedback on technician punctuality, fix durability..."
                    className="form-control"
                  ></textarea>
                </div>

                {/* Actions */}
                <div className="d-flex flex-wrap justify-content-between align-items-center pt-2">
                  <button
                    type="button"
                    onClick={() => setIsReopening(true)}
                    className="btn btn-link text-danger text-decoration-none btn-sm p-0 d-flex align-items-center gap-1"
                  >
                    <i className="bi bi-arrow-repeat"></i>
                    <span>Not fixed properly? Reopen ticket</span>
                  </button>

                  <div className="d-flex gap-2">
                    <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmVerify}
                      className="btn btn-success btn-sm fw-bold d-flex align-items-center gap-1 shadow-sm"
                    >
                      <i className="bi bi-check-circle-fill"></i>
                      <span>Confirm Fix & Close Ticket</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Reopen form */
              <div className="alert alert-danger border-danger p-3 mb-0">
                <div className="fw-bold d-flex align-items-center gap-1 mb-1">
                  <i className="bi bi-exclamation-triangle-fill"></i>
                  <span>Reopen Ticket for Re-work</span>
                </div>
                <p className="small mb-2">
                  Please describe what is still wrong so the supervisor can re-instruct the technician:
                </p>
                <textarea
                  rows="3"
                  required
                  value={reopenReason}
                  onChange={(e) => setReopenReason(e.target.value)}
                  placeholder="e.g. Water is still leaking from the lower flange, problem returned after 1 hour."
                  className="form-control form-control-sm mb-2"
                ></textarea>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsReopening(false)}
                    className="btn btn-light btn-sm"
                  >
                    Back to Verify
                  </button>
                  <button
                    type="button"
                    onClick={handleReopen}
                    className="btn btn-danger btn-sm fw-bold"
                  >
                    Confirm Reopen
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
