// Pan-India Cybercrime Cash-Out Hotspots Dataset
// Spans NCR, Mumbai, Bengaluru, Hyderabad, Kolkata, Ahmedabad, Jaipur, and Lucknow

export const PAN_INDIA_REGIONS = [
  { id: 'ALL', name: 'All India (Overview)', center: [22.9734, 78.6569], zoom: 5 },
  { id: 'ncr', name: 'Delhi-NCR', center: [28.5708, 77.3218], zoom: 12 },
  { id: 'mumbai', name: 'Mumbai', center: [19.0596, 72.8295], zoom: 12 },
  { id: 'bengaluru', name: 'Bengaluru', center: [12.9352, 77.6245], zoom: 12 },
  { id: 'hyderabad', name: 'Hyderabad', center: [17.4483, 78.3748], zoom: 12 },
  { id: 'kolkata', name: 'Kolkata', center: [22.5867, 88.4178], zoom: 12 },
  { id: 'ahmedabad', name: 'Ahmedabad', center: [23.0338, 72.5574], zoom: 12 },
  { id: 'jaipur', name: 'Jaipur', center: [26.8532, 75.8166], zoom: 12 },
  { id: 'lucknow', name: 'Lucknow', center: [26.8500, 80.9499], zoom: 12 }
];

export const PAN_INDIA_HOTSPOTS = [
  // 1. NCR (Delhi / Noida)
  {
    caseId: 'CMP-2026-8941',
    firNumber: 'FIR/CYB/2026/0842',
    region: 'ncr',
    cityLabel: 'Delhi-NCR / Noida',
    fraudType: 'Digital Arrest / Police Impersonation',
    amount: 485000,
    status: 'Pending Analysis',
    interceptStatus: 'Under Watch',
    primaryTarget: {
      locationId: 'LOC-NCR-01',
      locationName: 'SBI ATM - Sector 18 Market Complex',
      bank: 'State Bank of India',
      address: 'Plot 12, Pocket B, Sector 18, Noida, UP 201301',
      lat: 28.5708,
      lng: 77.3218,
      confidence: 89,
      riskLevel: 'HIGH',
      window: 'Next 2 - 4 hours (22:30 - 00:30)',
      historicalWithdrawals: 17,
      nearestUnit: 'Sector 20 Cyber Crime Quick Response Team (1.2 km away)',
      rationale: 'Matches primary cash-out cluster for Mule L2 SIM geofence and past 5 cyber extortion withdrawals in NCR.',
      patrolProtocol: 'Pre-position un-uniformed spotters around vestibule; issue Section 91 CrPC CCTV preservation directive.'
    },
    secondaryTarget: {
      locationId: 'LOC-NCR-02',
      locationName: 'Punjab National Bank ATM - Atta Market',
      bank: 'Punjab National Bank',
      address: 'Atta Market, Sector 27, Noida, UP 201301',
      lat: 28.5742,
      lng: 77.3265,
      confidence: 74,
      riskLevel: 'MEDIUM',
      historicalWithdrawals: 9
    }
  },

  // 2. Mumbai
  {
    caseId: 'CMP-2026-8942',
    firNumber: 'FIR/CYB/2026/0843',
    region: 'mumbai',
    cityLabel: 'Mumbai, MH',
    fraudType: 'Cryptocurrency Investment Ponzi',
    amount: 1250000,
    status: 'Under Investigation',
    interceptStatus: 'Under Watch',
    primaryTarget: {
      locationId: 'LOC-MUM-01',
      locationName: 'HDFC Bank ATM & Cash Deposit - Linking Road',
      bank: 'HDFC Bank',
      address: 'Linking Road, Bandra West, Mumbai, MH 400050',
      lat: 19.0596,
      lng: 72.8295,
      confidence: 92,
      riskLevel: 'HIGH',
      window: 'Next 1 - 3 hours (18:00 - 21:00)',
      historicalWithdrawals: 24,
      nearestUnit: 'Bandra Police Station Cyber Squad (600m away)',
      rationale: 'High-frequency withdrawal node for western Mumbai crypto cash-out runners; direct trail from Kurla L2 mule.',
      patrolProtocol: 'Coordinate with BKC Cyber Cell for live ATM switch monitoring and debit card freeze triggers.'
    },
    secondaryTarget: {
      locationId: 'LOC-MUM-02',
      locationName: 'ICICI Bank ATM - Hill Road Branch',
      bank: 'ICICI Bank',
      address: 'Hill Road, Near Bandra Station, Mumbai, MH 400050',
      lat: 19.0544,
      lng: 72.8341,
      confidence: 76,
      riskLevel: 'MEDIUM',
      historicalWithdrawals: 12
    }
  },

  // 3. Bengaluru
  {
    caseId: 'CMP-2026-8943',
    firNumber: 'FIR/CYB/2026/0844',
    region: 'bengaluru',
    cityLabel: 'Bengaluru, KA',
    fraudType: 'Part-time Job / Telegram Task Ponzi',
    amount: 320000,
    status: 'Alert Dispatched',
    interceptStatus: 'Pending',
    primaryTarget: {
      locationId: 'LOC-BLR-01',
      locationName: 'Canara Bank E-Lounge - Koramangala 5th Block',
      bank: 'Canara Bank',
      address: '80 Feet Road, 5th Block, Koramangala, Bengaluru, KA 560095',
      lat: 12.9352,
      lng: 77.6245,
      confidence: 87,
      riskLevel: 'HIGH',
      window: 'Next 1 - 2 hours (17:30 - 19:30)',
      historicalWithdrawals: 19,
      nearestUnit: 'Koramangala Cyber Beat Unit 2 (450m away)',
      rationale: 'Pinpointed by SIM triangulation of mule recipient card and previous job-scam withdrawals in Koramangala belt.',
      patrolProtocol: 'Deploy mobile motorcycle beat team to secure physical perimeter.'
    },
    secondaryTarget: {
      locationId: 'LOC-BLR-02',
      locationName: 'Axis Bank ATM - Sony World Signal',
      bank: 'Axis Bank',
      address: '100 Feet Road, Koramangala 4th Block, Bengaluru, KA 560034',
      lat: 12.9378,
      lng: 77.6288,
      confidence: 71,
      riskLevel: 'MEDIUM',
      historicalWithdrawals: 11
    }
  },

  // 4. Hyderabad
  {
    caseId: 'CMP-2026-8944',
    firNumber: 'FIR/CYB/2026/0845',
    region: 'hyderabad',
    cityLabel: 'Hyderabad, TS',
    fraudType: 'Electricity Bill Phishing / Fake APK',
    amount: 640000,
    status: 'Intercepted',
    interceptStatus: 'Intercepted',
    primaryTarget: {
      locationId: 'LOC-HYD-01',
      locationName: 'HDFC Bank ATM - Cyber Towers Junction',
      bank: 'HDFC Bank',
      address: 'HITEC City Main Road, Madhapur, Hyderabad, TS 500081',
      lat: 17.4483,
      lng: 78.3748,
      confidence: 94,
      riskLevel: 'HIGH',
      window: 'Successfully Intercepted & Frozen',
      historicalWithdrawals: 28,
      nearestUnit: 'Madhapur Cyberabad QRT Patrol (200m away)',
      rationale: 'High-risk extraction corridor identified by predictive geofence model. Suspect apprehended with cloned debit cards.',
      patrolProtocol: 'Evidence logged into forensic custody; card skimming device impounded.'
    },
    secondaryTarget: {
      locationId: 'LOC-HYD-02',
      locationName: 'State Bank of India ATM - Inorbit Mall Rd',
      bank: 'State Bank of India',
      address: 'Inorbit Mall Road, Mindspace, Hyderabad, TS 500081',
      lat: 17.4345,
      lng: 78.3867,
      confidence: 68,
      riskLevel: 'MEDIUM',
      historicalWithdrawals: 14
    }
  },

  // 5. Kolkata
  {
    caseId: 'CMP-2026-8945',
    firNumber: 'FIR/CYB/2026/0846',
    region: 'kolkata',
    cityLabel: 'Kolkata, WB',
    fraudType: 'Loan App Extortion / Morphing Harassment',
    amount: 275000,
    status: 'Pending Analysis',
    interceptStatus: 'Pending',
    primaryTarget: {
      locationId: 'LOC-KOL-01',
      locationName: 'UCO Bank ATM - Sector V Karunamoyee',
      bank: 'UCO Bank',
      address: 'Karunamoyee Housing Complex, Salt Lake Sector V, Kolkata, WB 700091',
      lat: 22.5867,
      lng: 88.4178,
      confidence: 84,
      riskLevel: 'HIGH',
      window: 'Next 2 - 3 hours (19:00 - 21:00)',
      historicalWithdrawals: 13,
      nearestUnit: 'Bidhannagar Cyber Crime Cell QRT (700m away)',
      rationale: 'Primary cash withdrawal hub matching Mule L2 operational hours and IP coordinates in Salt Lake IT belt.',
      patrolProtocol: 'Request immediate video surveillance link from branch manager.'
    },
    secondaryTarget: {
      locationId: 'LOC-KOL-02',
      locationName: 'State Bank of India ATM - College More',
      bank: 'State Bank of India',
      address: 'College More, EP Block, Salt Lake Sector V, Kolkata, WB 700091',
      lat: 22.5735,
      lng: 88.4331,
      confidence: 69,
      riskLevel: 'MEDIUM',
      historicalWithdrawals: 8
    }
  },

  // 6. Ahmedabad
  {
    caseId: 'CMP-2026-8948',
    firNumber: 'FIR/CYB/2026/0849',
    region: 'ahmedabad',
    cityLabel: 'Ahmedabad, GJ',
    fraudType: 'SIM Swap & Net Banking Takeover',
    amount: 540000,
    status: 'Intercepted',
    interceptStatus: 'Intercepted',
    primaryTarget: {
      locationId: 'LOC-AHM-01',
      locationName: 'ICICI Bank ATM - CG Road Swastik Cross',
      bank: 'ICICI Bank',
      address: 'Swastik Cross Road, CG Road, Navrangpura, Ahmedabad, GJ 380009',
      lat: 23.0338,
      lng: 72.5574,
      confidence: 95,
      riskLevel: 'HIGH',
      window: 'Successfully Intercepted & Frozen',
      historicalWithdrawals: 26,
      nearestUnit: 'Navrangpura Police Station QRT (250m away)',
      rationale: 'High-velocity financial cash-out node. ATM terminal triggered rapid transaction freeze upon biometric mismatch.',
      patrolProtocol: 'Recovered ₹4,50,000 in un-dispensed cash vouchers.'
    },
    secondaryTarget: {
      locationId: 'LOC-AHM-02',
      locationName: 'Axis Bank ATM - Law Garden',
      bank: 'Axis Bank',
      address: 'Near Law Garden, Ellisbridge, Ahmedabad, GJ 380006',
      lat: 23.0245,
      lng: 72.5591,
      confidence: 70,
      riskLevel: 'MEDIUM',
      historicalWithdrawals: 10
    }
  },

  // 7. Jaipur
  {
    caseId: 'CMP-2026-8946',
    firNumber: 'FIR/CYB/2026/0847',
    region: 'jaipur',
    cityLabel: 'Jaipur, RJ',
    fraudType: 'KYC Update Phishing Link',
    amount: 195000,
    status: 'Under Investigation',
    interceptStatus: 'Under Watch',
    primaryTarget: {
      locationId: 'LOC-JPR-01',
      locationName: 'AU Small Finance Bank ATM - Malviya Nagar',
      bank: 'AU Small Finance Bank',
      address: 'Calgiri Marg, Malviya Nagar, Jaipur, RJ 302017',
      lat: 26.8532,
      lng: 75.8166,
      confidence: 86,
      riskLevel: 'HIGH',
      window: 'Next 1 - 3 hours (18:30 - 20:30)',
      historicalWithdrawals: 15,
      nearestUnit: 'Malviya Nagar Police Station Mobile Patrol (500m away)',
      rationale: 'Direct account issuer ATM, mule known to utilize immediate cardless ATM withdrawals to avoid CCTV recognition.',
      patrolProtocol: 'Station plainclothes constable near entry concourse.'
    },
    secondaryTarget: {
      locationId: 'LOC-JPR-02',
      locationName: 'State Bank of India ATM - Gaurav Tower',
      bank: 'State Bank of India',
      address: 'Gaurav Tower Complex, Malviya Nagar, Jaipur, RJ 302017',
      lat: 26.8558,
      lng: 75.8115,
      confidence: 66,
      riskLevel: 'MEDIUM',
      historicalWithdrawals: 7
    }
  },

  // 8. Lucknow
  {
    caseId: 'CMP-2026-8947',
    firNumber: 'FIR/CYB/2026/0848',
    region: 'lucknow',
    cityLabel: 'Lucknow, UP',
    fraudType: 'Digital Arrest / Customs Parcel Scam',
    amount: 890000,
    status: 'Alert Dispatched',
    interceptStatus: 'Pending',
    primaryTarget: {
      locationId: 'LOC-LKO-01',
      locationName: 'State Bank of India ATM & CDM - Hazratganj Main',
      bank: 'State Bank of India',
      address: 'Mahatma Gandhi Marg, Hazratganj, Lucknow, UP 226001',
      lat: 26.8500,
      lng: 80.9499,
      confidence: 91,
      riskLevel: 'HIGH',
      window: 'Next 1 - 2 hours (19:00 - 20:30)',
      historicalWithdrawals: 21,
      nearestUnit: 'Hazratganj Cyber Mobile Intervention Unit (350m away)',
      rationale: 'High cash-volume CDM vestibule frequently targeted by UP customs syndicate runners following RTGS clearing.',
      patrolProtocol: 'Alert beat patrol and coordinate with Bank of India branch liaison.'
    },
    secondaryTarget: {
      locationId: 'LOC-LKO-02',
      locationName: 'HDFC Bank ATM - Kapoorthala Aliganj',
      bank: 'HDFC Bank',
      address: 'Kapoorthala Commercial Complex, Aliganj, Lucknow, UP 226024',
      lat: 26.8851,
      lng: 80.9422,
      confidence: 64,
      riskLevel: 'MEDIUM',
      historicalWithdrawals: 8
    }
  }
];
