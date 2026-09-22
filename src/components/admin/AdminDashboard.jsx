import React from 'react';
import { useTickets } from '../../context/TicketContext';
import { CATEGORIES, WORKERS, APARTMENT_INFO } from '../../data/mockData';
import { calculateMetrics } from '../../utils/slaHelper';

export default function AdminDashboard() {
  const { tickets } = useTickets();
  const metrics = calculateMetrics(tickets);

  // Complaints by category
  const categoryCounts = CATEGORIES.map(cat => {
    const count = tickets.filter(t => t.category === cat.id).length;
    const resolvedCount = tickets.filter(t => t.category === cat.id && (t.status === 'VERIFIED' || t.status === 'RESOLVED')).length;
    return {
      ...cat,
      count,
      resolvedCount,
      percentage: tickets.length > 0 ? Math.round((count / tickets.length) * 100) : 0
    };
  }).sort((a, b) => b.count - a.count);

  // Complaints by Block
  const blockStats = APARTMENT_INFO.blocks.map(blockName => {
    const blockTickets = tickets.filter(t => t.block === blockName);
    const criticalCount = blockTickets.filter(t => t.priority === 'CRITICAL').length;
    const openCount = blockTickets.filter(t => t.status !== 'VERIFIED').length;
    return {
      name: blockName,
      total: blockTickets.length,
      critical: criticalCount,
      open: openCount,
      percentage: tickets.length > 0 ? Math.round((blockTickets.length / tickets.length) * 100) : 0
    };
  });

  // Worker scorecard
  const workerStats = WORKERS.map(worker => {
    const assignedTickets = tickets.filter(t => t.assignedWorkerId === worker.id);
    const completedTickets = assignedTickets.filter(t => t.status === 'VERIFIED' || t.status === 'RESOLVED');
    const ratings = completedTickets
      .filter(t => t.verification?.rating)
      .map(t => t.verification.rating);
    const avgRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : worker.rating;

    return {
      ...worker,
      totalAssigned: assignedTickets.length,
      completed: completedTickets.length,
      avgRating,
      onTimeRate: completedTickets.length > 0 ? '100%' : '95%'
    };
  });

  const exportReport = () => {
    const rows = [
      ["Ticket ID", "Title", "Category", "Block", "Flat", "Priority", "Status", "Worker", "Cost (INR)", "Created"]
    ];
    tickets.forEach(t => {
      rows.push([
        t.id,
        `"${t.title.replace(/"/g, '""')}"`,
        t.category,
        t.block,
        t.flat,
        t.priority,
        t.status,
        t.assignedWorkerName || 'Unassigned',
        t.cost || 0,
        t.createdAt
      ]);
    });

    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `fixnest-maintenance-report-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      {/* Admin Hero */}
      <div className="fn-admin-gradient text-white p-4 p-md-5 rounded-4 shadow-sm mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <span className="badge bg-white bg-opacity-25 text-white mb-2 py-1 px-2.5">
              <i className="bi bi-shield-check me-1"></i> Facility Executive & RWA Committee
            </span>
            <h2 className="fw-bold display-6 mb-1">Society Maintenance Analytics</h2>
            <p className="text-white-50 small mb-0">
              Live metrics on SLA compliance, turnaround speed, chronic building hotspots, and maintenance expenses.
            </p>
          </div>

          <div>
            <button
              onClick={exportReport}
              className="btn btn-light text-dark fw-bold d-flex align-items-center gap-2 shadow-sm"
            >
              <i className="bi bi-file-earmark-arrow-down-fill text-primary"></i>
              <span>Export CSV Audit</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5 KPI Metric Cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md">
          <div className="fn-card p-3 h-100">
            <div className="small text-secondary fw-bold text-uppercase" style={{ fontSize: '0.65rem' }}>Total Complaints</div>
            <div className="fs-3 fw-bold text-dark mt-1">{metrics.total}</div>
            <div className="small text-primary mt-1" style={{ fontSize: '0.75rem' }}>
              <strong>{metrics.activeCount} active</strong> in progress
            </div>
          </div>
        </div>

        <div className="col-6 col-md">
          <div className="fn-card p-3 h-100">
            <div className="small text-secondary fw-bold text-uppercase" style={{ fontSize: '0.65rem' }}>SLA Compliance</div>
            <div className={`fs-3 fw-bold mt-1 ${metrics.slaRate >= 90 ? 'text-success' : 'text-warning'}`}>
              {metrics.slaRate}%
            </div>
            <div className="small text-secondary mt-1" style={{ fontSize: '0.75rem' }}>
              <i className="bi bi-check-circle-fill text-success me-1"></i> Target: 95% threshold
            </div>
          </div>
        </div>

        <div className="col-6 col-md">
          <div className="fn-card p-3 h-100">
            <div className="small text-secondary fw-bold text-uppercase" style={{ fontSize: '0.65rem' }}>Avg Turnaround</div>
            <div className="fs-3 fw-bold text-primary mt-1">{metrics.avgResolutionHours}h</div>
            <div className="small text-secondary mt-1" style={{ fontSize: '0.75rem' }}>
              <i className="bi bi-clock-history me-1"></i> Log to Sign-off
            </div>
          </div>
        </div>

        <div className="col-6 col-md">
          <div className="fn-card p-3 h-100">
            <div className="small text-secondary fw-bold text-uppercase" style={{ fontSize: '0.65rem' }}>Resolution Rate</div>
            <div className="fs-3 fw-bold text-purple mt-1" style={{ color: '#7c3aed' }}>
              {metrics.total > 0 ? Math.round((metrics.completedCount / metrics.total) * 100) : 0}%
            </div>
            <div className="small text-secondary mt-1" style={{ fontSize: '0.75rem' }}>
              {metrics.verified} confirmed closed
            </div>
          </div>
        </div>

        <div className="col-12 col-md">
          <div className="fn-card p-3 h-100">
            <div className="small text-secondary fw-bold text-uppercase" style={{ fontSize: '0.65rem' }}>Repair Expenses</div>
            <div className="fs-3 fw-bold text-dark mt-1">₹{metrics.totalCost.toLocaleString()}</div>
            <div className="small text-secondary mt-1" style={{ fontSize: '0.75rem' }}>
              Parts & Spares billed
            </div>
          </div>
        </div>
      </div>

      {/* Row: Category Breakdown + Tower Hotspots */}
      <div className="row g-4 mb-4">
        {/* Category breakdown */}
        <div className="col-12 col-lg-6">
          <div className="fn-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold text-dark m-0">Complaints by Category</h6>
              <span className="badge bg-light text-secondary border">Issue Breakdown</span>
            </div>

            <div className="d-flex flex-column gap-3">
              {categoryCounts.map((cat) => (
                <div key={cat.id}>
                  <div className="d-flex justify-content-between small fw-bold mb-1">
                    <span className="text-dark">
                      <i className={`bi ${cat.icon} text-${cat.badgeColor} me-1`}></i>
                      {cat.label}
                    </span>
                    <span className="text-secondary">{cat.count} issues ({cat.percentage}%)</span>
                  </div>
                  <div className="progress" style={{ height: '8px' }}>
                    <div
                      className={`progress-bar bg-${cat.badgeColor}`}
                      style={{ width: `${cat.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Building Hotspots */}
        <div className="col-12 col-lg-6">
          <div className="fn-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h6 className="fw-bold text-dark m-0">Chronic Problem Hotspots</h6>
                <div className="small text-muted" style={{ fontSize: '0.75rem' }}>Tower diagnostics to trace repeat maintenance failures</div>
              </div>
              <span className="badge bg-warning bg-opacity-25 text-warning border border-warning">
                Tower Health
              </span>
            </div>

            <div className="row g-2 mb-3">
              {blockStats.map((b) => (
                <div key={b.name} className="col-6">
                  <div className="p-3 bg-light rounded-3 border">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="small fw-bold text-dark">{b.name}</span>
                      {b.critical > 0 && <span className="badge bg-danger" style={{ fontSize: '0.65rem' }}>{b.critical} Critical</span>}
                    </div>
                    <div className="fs-5 fw-bold text-dark">{b.total} <span className="small text-muted fw-normal" style={{ fontSize: '0.75rem' }}>issues</span></div>
                    <div className="small text-muted" style={{ fontSize: '0.7rem' }}>
                      {b.open > 0 ? <span className="text-warning fw-semibold">{b.open} pending</span> : <span className="text-success fw-semibold">All clean</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="alert alert-warning p-2.5 small d-flex gap-2 align-items-start mb-0">
              <i className="bi bi-exclamation-triangle-fill text-warning fs-5 lh-1 mt-1"></i>
              <div>
                <strong>Facility Advisory:</strong>
                <div className="text-secondary" style={{ fontSize: '0.75rem' }}>
                  Block B Lift #2 has triggered 2 emergency alerts this week. Recommended Schindler AMC mechanical cable test before weekend peak hours.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technician Scorecard Table */}
      <div className="fn-card overflow-hidden">
        <div className="p-3 bg-light border-bottom d-flex justify-content-between align-items-center">
          <div>
            <h6 className="fw-bold text-dark m-0">Vendor & Technician Performance Scorecard</h6>
            <div className="small text-muted" style={{ fontSize: '0.75rem' }}>Response efficiency, jobs resolved, and resident satisfaction star ratings</div>
          </div>
          <span className="badge bg-secondary">5 Active Technicians</span>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 small">
            <thead className="table-light text-secondary text-uppercase fw-bold" style={{ fontSize: '0.7rem' }}>
              <tr>
                <th className="ps-4">Specialist</th>
                <th>Trade</th>
                <th>Assigned</th>
                <th>Completed</th>
                <th>SLA On-Time</th>
                <th className="pe-4">Resident Rating</th>
              </tr>
            </thead>
            <tbody>
              {workerStats.map((w) => (
                <tr key={w.id}>
                  <td className="ps-4">
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={w.avatar}
                        alt={w.name}
                        className="rounded-circle"
                        style={{ width: '36px', height: '36px', objectFit: 'cover' }}
                      />
                      <div>
                        <div className="fw-bold text-dark">{w.name}</div>
                        <div className="text-muted" style={{ fontSize: '0.7rem' }}>{w.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="fw-semibold text-secondary">{w.trade}</td>
                  <td className="fw-bold text-dark">{w.totalAssigned}</td>
                  <td className="fw-bold text-success">{w.completed}</td>
                  <td>
                    <span className="badge bg-success bg-opacity-10 text-success border border-success">
                      {w.onTimeRate}
                    </span>
                  </td>
                  <td className="pe-4">
                    <span className="text-warning fw-bold">
                      <i className="bi bi-star-fill me-1"></i>{w.avgRating} / 5.0
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
