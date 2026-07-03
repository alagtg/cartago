export interface Player {
  id: number;
  fullName: string;
  slug: string;
  dateOfBirth: string;
  nationality: string;
  height: number;
  weight: number;
  position: string;
  strongFoot: string;
  currentClub: string;
  contractStatus: string;
  matchesPlayed: number;
  goals: number;
  assists: number;
  minutesPlayed: number;
  videoUrl?: string;
  technicalReportUrl?: string;
  photoUrl: string;
  isFeatured: boolean;
  isActive: boolean;
  createdAt?: string;
}

export interface TeamMember {
  id: number;
  fullName: string;
  role: string;
  bio: string;
  email: string;
  phone: string;
  photoUrl: string;
  displayOrder: number;
  isActive: boolean;
}

export interface AgencyService {
  id: number;
  title: string;
  category: string;
  description: string;
  icon: string;
  displayOrder: number;
  isActive: boolean;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

export interface ClubRequest {
  id: number;
  clubName: string;
  country: string;
  recruitmentManager: string;
  email: string;
  phoneNumber: string;
  targetProfile: string;
  estimatedBudget: string;
  contractDuration: string;
  additionalDetails: string;
  status: string;
  adminNote?: string;
  createdAt: string;
}

export interface PlayerApplication {
  id: number;
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  position: string;
  strongFoot: string;
  height: number;
  weight: number;
  currentClub: string;
  contractSituation: string;
  videoLink: string;
  phoneNumber: string;
  email: string;
  additionalNotes: string;
  status: string;
  adminNote?: string;
  createdAt: string;
}

export interface SiteSetting {
  id: number;
  key: string;
  value: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  fullName: string;
  role: string;
  email: string;
}
