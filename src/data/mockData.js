export const APARTMENT_INFO = {
  name: "Greenwood Palms Residency",
  address: "Block 4, OMR IT Highway, Chennai - 600096",
  unitsCount: 240,
  blocks: ["Block A", "Block B", "Block C", "Clubhouse & Amenities"],
  floors: [1, 2, 3, 4, 5, 6, 7, 8],
  residents: [
    { id: "res-1", name: "Karthik Subramanian", flat: "A-402", block: "Block A", phone: "+91 98410 11223" },
    { id: "res-2", name: "Ananya Iyer", flat: "B-204", block: "Block B", phone: "+91 98410 33445" },
    { id: "res-3", name: "David Raj", flat: "C-601", block: "Block C", phone: "+91 98410 55667" },
    { id: "res-4", name: "Meenakshi Sundaram", flat: "B-302", block: "Block B", phone: "+91 98410 77889" },
  ]
};

export const CATEGORIES = [
  { id: "plumbing", label: "Plumbing & Water Leakage", icon: "bi-droplet-fill", badgeColor: "primary" },
  { id: "electrical", label: "Electricity & Power", icon: "bi-lightning-charge-fill", badgeColor: "warning" },
  { id: "elevator", label: "Lift & Mechanical", icon: "bi-arrow-down-up", badgeColor: "danger" },
  { id: "housekeeping", label: "Housekeeping & Cleaning", icon: "bi-stars", badgeColor: "success" },
  { id: "carpentry", label: "Carpentry & Civil Works", icon: "bi-hammer", badgeColor: "secondary" },
  { id: "security", label: "Security & Access Gates", icon: "bi-shield-check", badgeColor: "info" },
];

export const PRIORITIES = {
  CRITICAL: { label: "Critical (Emergency)", slaHours: 2, badgeClass: "bg-danger text-white" },
  HIGH: { label: "High Priority", slaHours: 6, badgeClass: "bg-warning text-dark" },
  MEDIUM: { label: "Medium", slaHours: 24, badgeClass: "bg-primary text-white" },
  LOW: { label: "Low (General)", slaHours: 48, badgeClass: "bg-secondary text-white" },
};

export const WORKERS = [
  {
    id: "w-1",
    name: "Ramesh K.",
    trade: "Plumbing Specialist",
    category: "plumbing",
    phone: "+91 98401 23456",
    rating: 4.9,
    activeTasks: 1,
    avatar: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "w-2",
    name: "Murugan S.",
    trade: "Senior Electrician",
    category: "electrical",
    phone: "+91 98402 34567",
    rating: 4.8,
    activeTasks: 1,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "w-3",
    name: "Selvam M.",
    trade: "Lift & Escalator Tech",
    category: "elevator",
    phone: "+91 98403 45678",
    rating: 4.9,
    activeTasks: 1,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "w-4",
    name: "Kavitha R.",
    trade: "Sanitation & Cleaning Lead",
    category: "housekeeping",
    phone: "+91 98404 56789",
    rating: 4.7,
    activeTasks: 0,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "w-5",
    name: "Anthony D.",
    trade: "Civil & Access Control",
    category: "security",
    phone: "+91 98405 67890",
    rating: 4.6,
    activeTasks: 0,
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80"
  }
];

export const INITIAL_TICKETS = [
  {
    id: "FN-1001",
    title: "Continuous water pipe leakage under kitchen sink",
    description: "High pressure water spraying from the main connector valve under the sink. Cabinet wood is soaking wet, urgent intervention needed.",
    category: "plumbing",
    block: "Block A",
    floor: 4,
    flat: "A-402",
    residentName: "Karthik Subramanian",
    residentPhone: "+91 98410 11223",
    priority: "HIGH",
    status: "IN_PROGRESS", // OPEN -> ACCEPTED -> IN_PROGRESS -> RESOLVED -> VERIFIED
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    slaDueAt: new Date(Date.now() + 3 * 3600 * 1000).toISOString(),
    assignedWorkerId: "w-1",
    assignedWorkerName: "Ramesh K.",
    beforePhoto: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&auto=format&fit=crop&q=80",
    afterPhoto: null,
    resolutionNotes: null,
    cost: null,
    verification: null,
    timeline: [
      { step: "Created", time: new Date(Date.now() - 3 * 3600 * 1000).toISOString(), note: "Complaint logged by resident with photo" },
      { step: "Accepted", time: new Date(Date.now() - 2.5 * 3600 * 1000).toISOString(), note: "Accepted by Facilities Supervisor (Senthil)" },
      { step: "Assigned", time: new Date(Date.now() - 2.2 * 3600 * 1000).toISOString(), note: "Dispatched to Ramesh K. (Plumbing Specialist)" },
      { step: "In Progress", time: new Date(Date.now() - 1 * 3600 * 1000).toISOString(), note: "Technician arrived with replacement CPVC valve" }
    ]
  },
  {
    id: "FN-1002",
    title: "Passenger Lift #2 jerking & stuck at 4th floor",
    description: "Lift made loud metal grinding noise and stopped 4 inches below floor level. Emergency alarm buzzer pressed. Passengers safely evacuated.",
    category: "elevator",
    block: "Block B",
    floor: 4,
    flat: "Common Lift Lobby",
    residentName: "Ananya Iyer",
    residentPhone: "+91 98410 33445",
    priority: "CRITICAL",
    status: "ACCEPTED",
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    slaDueAt: new Date(Date.now() + 75 * 60 * 1000).toISOString(),
    assignedWorkerId: "w-3",
    assignedWorkerName: "Selvam M.",
    beforePhoto: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=600&auto=format&fit=crop&q=80",
    afterPhoto: null,
    resolutionNotes: null,
    cost: null,
    verification: null,
    timeline: [
      { step: "Created", time: new Date(Date.now() - 45 * 60 * 1000).toISOString(), note: "Emergency alert triggered by resident" },
      { step: "Accepted", time: new Date(Date.now() - 30 * 60 * 1000).toISOString(), note: "Maintenance supervisor flagged CRITICAL priority & locked lift" },
      { step: "Assigned", time: new Date(Date.now() - 25 * 60 * 1000).toISOString(), note: "Assigned to Selvam M. (Elevator Tech)" }
    ]
  },
  {
    id: "FN-1003",
    title: "Corridor light fittings burned out on 3rd floor hallway",
    description: "Two LED panel lights burnt out with burning plastic smell. Complete dark zone near flat 303 & 304, causing safety hazard for elders.",
    category: "electrical",
    block: "Block C",
    floor: 3,
    flat: "Hallway C-303",
    residentName: "David Raj",
    residentPhone: "+91 98410 55667",
    priority: "MEDIUM",
    status: "RESOLVED", // Awaiting Resident Verification
    createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    slaDueAt: new Date(Date.now() + 16 * 3600 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    assignedWorkerId: "w-2",
    assignedWorkerName: "Murugan S.",
    beforePhoto: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80",
    afterPhoto: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&auto=format&fit=crop&q=80",
    resolutionNotes: "Replaced faulty choke driver and installed 2 new Havells 18W warm-white panels. Tested earthing voltage.",
    cost: 720,
    verification: null,
    timeline: [
      { step: "Created", time: new Date(Date.now() - 8 * 3600 * 1000).toISOString(), note: "Ticket raised" },
      { step: "Accepted", time: new Date(Date.now() - 7 * 3600 * 1000).toISOString(), note: "Supervisor accepted" },
      { step: "Assigned", time: new Date(Date.now() - 5 * 3600 * 1000).toISOString(), note: "Assigned to Murugan S." },
      { step: "In Progress", time: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), note: "Technician arrived with spares" },
      { step: "Fixed", time: new Date(Date.now() - 30 * 60 * 1000).toISOString(), note: "Replacement completed. Uploaded before & after proof. Awaiting resident sign-off." }
    ]
  },
  {
    id: "FN-1004",
    title: "Garbage chute inlet jammed with oversized cardboard",
    description: "Trash chute flap stuck half-open on 5th floor. Residents cannot dump bags, foul odor spreading in corridor.",
    category: "housekeeping",
    block: "Block A",
    floor: 5,
    flat: "Chute Room 5F",
    residentName: "Karthik Subramanian",
    residentPhone: "+91 98410 11223",
    priority: "MEDIUM",
    status: "VERIFIED",
    createdAt: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
    slaDueAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    verifiedAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    assignedWorkerId: "w-4",
    assignedWorkerName: "Kavitha R.",
    beforePhoto: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80",
    afterPhoto: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80",
    resolutionNotes: "Cleared jammed carton blockage, sanitized the hopper with disinfectant spray.",
    cost: 0,
    verification: {
      rating: 5,
      feedback: "Promptly cleared within 2 hours of complaint. Deep sanitized and no more smell. Excellent job by Kavitha team!",
      verifiedBy: "Karthik Subramanian"
    },
    timeline: [
      { step: "Created", time: new Date(Date.now() - 26 * 3600 * 1000).toISOString(), note: "Ticket raised" },
      { step: "Accepted", time: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), note: "Supervisor accepted" },
      { step: "Assigned", time: new Date(Date.now() - 20 * 3600 * 1000).toISOString(), note: "Assigned to Kavitha R." },
      { step: "Fixed", time: new Date(Date.now() - 10 * 3600 * 1000).toISOString(), note: "Chute dislodged and cleaned" },
      { step: "Verified & Closed", time: new Date(Date.now() - 8 * 3600 * 1000).toISOString(), note: "Resident confirmed fix with 5-star rating" }
    ]
  },
  {
    id: "FN-1005",
    title: "Ceiling plaster flaking and damp patch from upper floor",
    description: "Master bedroom ceiling showing wet watermark spreading near the fan hook. Likely bathroom waterproofing failure from B-402 above.",
    category: "plumbing",
    block: "Block B",
    floor: 3,
    flat: "B-302",
    residentName: "Meenakshi Sundaram",
    residentPhone: "+91 98410 77889",
    priority: "HIGH",
    status: "OPEN",
    createdAt: new Date(Date.now() - 1.2 * 3600 * 1000).toISOString(),
    slaDueAt: new Date(Date.now() + 4.8 * 3600 * 1000).toISOString(),
    assignedWorkerId: null,
    assignedWorkerName: null,
    beforePhoto: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
    afterPhoto: null,
    resolutionNotes: null,
    cost: null,
    verification: null,
    timeline: [
      { step: "Created", time: new Date(Date.now() - 1.2 * 3600 * 1000).toISOString(), note: "Reported via FixNest with ceiling damp photo" }
    ]
  }
];
