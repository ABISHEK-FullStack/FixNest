import React, { useState } from 'react';
import { useTickets } from '../../context/TicketContext';
import { CATEGORIES, PRIORITIES, APARTMENT_INFO } from '../../data/mockData';

const PRESET_PHOTOS = [
  {
    name: "Pipe Leak",
    url: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Ceiling Seepage",
    url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Burnt Wire / Spark",
    url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Lift Malfunction",
    url: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Corridor Chute Spill",
    url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80"
  }
];

export default function ReportModal({ isOpen, onClose }) {
  const { currentResident, createTicket } = useTickets();

  const [category, setCategory] = useState('plumbing');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [block, setBlock] = useState(currentResident.block || 'Block A');
  const [floor, setFloor] = useState(4);
  const [flat, setFlat] = useState(currentResident.flat || 'A-402');
  const [priority, setPriority] = useState('HIGH');
  const [photoUrl, setPhotoUrl] = useState(PRESET_PHOTOS[0].url);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadPreview(reader.result);
        setPhotoUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Please provide a title and problem description.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      createTicket({
        title: title.trim(),
        description: description.trim(),
        category,
        block,
        floor,
        flat,
        priority,
        beforePhoto: photoUrl || uploadPreview,
        residentName: currentResident.name,
        residentPhone: currentResident.phone
      });

      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg">
          {/* Header */}
          <div className="modal-header bg-light">
            <div>
              <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
                <i className="bi bi-shield-exclamation text-primary"></i>
                <span>Report Maintenance Issue</span>
              </h5>
              <p className="text-muted small mb-0">
                Raise an accountable ticket with photo proof, SLA guarantee, and automatic technician dispatch.
              </p>
            </div>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              {/* Category */}
              <div className="mb-3">
                <label className="form-label small fw-bold text-uppercase text-secondary">
                  Problem Category *
                </label>
                <div className="row g-2">
                  {CATEGORIES.map(cat => (
                    <div key={cat.id} className="col-6 col-md-4">
                      <button
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`btn w-100 text-start p-2 d-flex align-items-center gap-2 small ${
                          category === cat.id
                            ? 'btn-primary text-white fw-bold shadow-sm'
                            : 'btn-outline-secondary text-dark'
                        }`}
                      >
                        <i className={`bi ${cat.icon} fs-5`}></i>
                        <span className="text-truncate">{cat.label.split('&')[0]}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Title & Quick Chips */}
              <div className="mb-3">
                <label className="form-label small fw-bold text-uppercase text-secondary">
                  Issue Summary / Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Heavy water leakage from pipe valve under kitchen sink"
                  className="form-control"
                />
                <div className="d-flex flex-wrap gap-1 mt-2 align-items-center">
                  <span className="text-muted small me-1">Quick pick:</span>
                  {[
                    "Water leaking under sink",
                    "Lift door stuck on floor 4",
                    "Corridor lights not working",
                    "Power MCB tripping constantly",
                    "Ceiling moisture dampness"
                  ].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setTitle(chip)}
                      className="btn btn-sm btn-light border text-secondary py-0 px-2"
                      style={{ fontSize: '0.75rem' }}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Hierarchy */}
              <div className="p-3 bg-light rounded-3 border mb-3">
                <div className="row g-2">
                  <div className="col-12 col-md-4">
                    <label className="form-label small fw-bold text-secondary mb-1">Block / Wing</label>
                    <select
                      value={block}
                      onChange={(e) => setBlock(e.target.value)}
                      className="form-select form-select-sm"
                    >
                      {APARTMENT_INFO.blocks.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="form-label small fw-bold text-secondary mb-1">Floor Level</label>
                    <select
                      value={floor}
                      onChange={(e) => setFloor(Number(e.target.value))}
                      className="form-select form-select-sm"
                    >
                      {APARTMENT_INFO.floors.map(f => (
                        <option key={f} value={f}>Floor {f}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="form-label small fw-bold text-secondary mb-1">Flat / Location</label>
                    <input
                      type="text"
                      value={flat}
                      onChange={(e) => setFlat(e.target.value)}
                      placeholder="e.g. A-402 or Lift Lobby"
                      className="form-control form-control-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Priority & SLA Guarantee */}
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label small fw-bold text-uppercase text-secondary mb-0">
                    Urgency Priority & SLA Resolution Window *
                  </label>
                  <span className="badge bg-primary bg-opacity-10 text-primary">
                    SLA: {PRIORITIES[priority].slaHours} Hours Max
                  </span>
                </div>
                <div className="row g-2">
                  {Object.entries(PRIORITIES).map(([key, item]) => (
                    <div key={key} className="col-6 col-md-3">
                      <button
                        type="button"
                        onClick={() => setPriority(key)}
                        className={`btn w-100 p-2 text-start ${
                          priority === key
                            ? 'btn-primary text-white fw-bold shadow-sm'
                            : 'btn-outline-secondary text-dark'
                        }`}
                      >
                        <div className="small fw-bold">{key}</div>
                        <div className="small opacity-75">{item.slaHours}h SLA</div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="mb-3">
                <label className="form-label small fw-bold text-uppercase text-secondary">
                  Detailed Description *
                </label>
                <textarea
                  rows="3"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain symptoms, when it started, and any safety hazards..."
                  className="form-control"
                ></textarea>
              </div>

              {/* Photo Upload & Presets */}
              <div className="mb-3">
                <label className="form-label small fw-bold text-uppercase text-secondary mb-1">
                  Attach Problem Photo (For Technician Assessment)
                </label>
                <div className="input-group mb-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="form-control"
                  />
                </div>

                <div className="small text-muted mb-1">Or select a quick sample photo:</div>
                <div className="row g-2 mb-2">
                  {PRESET_PHOTOS.map((p, idx) => (
                    <div key={idx} className="col">
                      <button
                        type="button"
                        onClick={() => {
                          setPhotoUrl(p.url);
                          setUploadPreview(null);
                        }}
                        className={`card h-100 border p-1 text-center text-decoration-none overflow-hidden ${
                          photoUrl === p.url && !uploadPreview ? 'border-primary border-2' : ''
                        }`}
                      >
                        <img src={p.url} alt={p.name} style={{ height: '45px', objectFit: 'cover' }} className="rounded" />
                        <span className="small text-muted mt-1 text-truncate" style={{ fontSize: '0.65rem' }}>{p.name}</span>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Preview */}
                {(photoUrl || uploadPreview) && (
                  <div className="rounded border overflow-hidden position-relative" style={{ height: '140px' }}>
                    <img
                      src={uploadPreview || photoUrl}
                      alt="Preview"
                      className="w-100 h-100"
                      style={{ objectFit: 'cover' }}
                    />
                    <span className="badge bg-dark position-absolute bottom-0 start-0 m-2">
                      Photo Attached
                    </span>
                  </div>
                )}
              </div>

              {/* Resident identity footer */}
              <div className="alert alert-secondary py-2 px-3 small d-flex justify-content-between align-items-center mb-0">
                <span>
                  Reporting as: <strong className="text-dark">{currentResident.name}</strong> ({currentResident.phone})
                </span>
                <span className="badge bg-primary">{currentResident.flat}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer bg-light">
              <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary btn-sm fw-bold d-flex align-items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                    <span>Submitting Complaint...</span>
                  </>
                ) : (
                  <>
                    <i className="bi bi-send-fill"></i>
                    <span>Submit Problem Ticket</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
