import React, { useState } from 'react';

export default function BeforeAfterViewer({ beforePhoto, afterPhoto, resolutionNotes, cost, workerName }) {
  const [mode, setMode] = useState('sideBySide'); // 'sideBySide' | 'slider'
  const [sliderPos, setSliderPos] = useState(50);

  if (!beforePhoto && !afterPhoto) {
    return (
      <div className="alert alert-light border text-center text-muted small py-3 my-2">
        <i className="bi bi-camera me-1"></i> No photographic evidence uploaded for this ticket.
      </div>
    );
  }

  return (
    <div className="card bg-dark text-white border-0 shadow-sm overflow-hidden my-3">
      {/* Header bar */}
      <div className="card-header bg-black bg-opacity-50 d-flex justify-content-between align-items-center py-2 px-3 border-bottom border-secondary">
        <div className="small fw-bold d-flex align-items-center gap-2">
          <i className="bi bi-images text-info"></i>
          <span>Proof of Work Inspection</span>
        </div>
        {afterPhoto && beforePhoto && (
          <div className="btn-group btn-group-sm">
            <button
              type="button"
              onClick={() => setMode('sideBySide')}
              className={`btn btn-sm ${mode === 'sideBySide' ? 'btn-primary fw-bold' : 'btn-outline-secondary text-light'}`}
            >
              <i className="bi bi-columns-gap me-1"></i> Side-by-Side
            </button>
            <button
              type="button"
              onClick={() => setMode('slider')}
              className={`btn btn-sm ${mode === 'slider' ? 'btn-primary fw-bold' : 'btn-outline-secondary text-light'}`}
            >
              <i className="bi bi-sliders me-1"></i> Interactive Slider
            </button>
          </div>
        )}
      </div>

      {/* Visual content */}
      <div className="card-body p-3">
        {mode === 'slider' && beforePhoto && afterPhoto ? (
          <div>
            <div className="comparison-slider-wrapper position-relative">
              {/* After image (base) */}
              <img
                src={afterPhoto}
                alt="After fix"
                className="comparison-image-base"
              />
              <span className="badge bg-success position-absolute top-0 end-0 m-2 shadow-sm">
                AFTER FIX
              </span>

              {/* Before image (clipped overlay) */}
              <div
                className="comparison-image-overlay"
                style={{ width: `${sliderPos}%` }}
              >
                <img
                  src={beforePhoto}
                  alt="Before fix"
                  style={{ width: '100%', minWidth: '100%' }}
                />
                <span className="badge bg-danger position-absolute top-0 start-0 m-2 shadow-sm">
                  BEFORE (REPORTED)
                </span>
              </div>

              {/* Vertical divider */}
              <div
                className="comparison-divider"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="comparison-handle">
                  ↔
                </div>
              </div>
            </div>

            {/* Slider controller */}
            <div className="d-flex align-items-center gap-2 mt-2 px-1">
              <span className="small text-danger fw-bold">Before</span>
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={(e) => setSliderPos(Number(e.target.value))}
                className="form-range flex-grow-1"
              />
              <span className="small text-success fw-bold">After</span>
            </div>
          </div>
        ) : (
          /* Side by side cards */
          <div className="row g-3">
            {/* Before */}
            <div className="col-12 col-md-6">
              <div className="card bg-black border-secondary h-100 overflow-hidden">
                <div className="position-relative" style={{ height: '200px' }}>
                  {beforePhoto ? (
                    <img
                      src={beforePhoto}
                      alt="Before"
                      className="w-100 h-100"
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="h-100 d-flex flex-column align-items-center justify-center text-muted small">
                      <i className="bi bi-camera-slash fs-3 mb-1"></i>
                      <span>No initial photo</span>
                    </div>
                  )}
                  <span className="badge bg-danger position-absolute top-0 start-0 m-2">
                    BEFORE (PROBLEM)
                  </span>
                </div>
              </div>
            </div>

            {/* After */}
            <div className="col-12 col-md-6">
              <div className="card bg-black border-secondary h-100 overflow-hidden">
                <div className="position-relative" style={{ height: '200px' }}>
                  {afterPhoto ? (
                    <img
                      src={afterPhoto}
                      alt="After"
                      className="w-100 h-100"
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="h-100 d-flex flex-column align-items-center justify-center text-muted small p-3 text-center">
                      <div className="spinner-border spinner-border-sm text-warning mb-2" role="status"></div>
                      <span className="text-light fw-bold">Pending Technician Completion</span>
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                        After photo will be uploaded once repair is finished
                      </span>
                    </div>
                  )}
                  <span className={`badge ${afterPhoto ? 'bg-success' : 'bg-secondary'} position-absolute top-0 end-0 m-2`}>
                    AFTER (RESOLVED)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Technician Notes & Cost */}
        {(resolutionNotes || cost !== null) && (
          <div className="mt-3 p-2 bg-black bg-opacity-50 rounded border border-secondary small">
            {resolutionNotes && (
              <div className="mb-1">
                <span className="text-secondary fw-semibold">Technician Notes: </span>
                <span className="text-light">{resolutionNotes}</span>
              </div>
            )}
            <div className="d-flex justify-content-between align-items-center pt-1 border-top border-secondary">
              {workerName && (
                <span className="text-secondary">
                  Serviced by: <strong className="text-light">{workerName}</strong>
                </span>
              )}
              {cost !== null && cost > 0 && (
                <span className="badge bg-success bg-opacity-25 text-success border border-success">
                  Spares & Parts Cost: ₹{cost}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
