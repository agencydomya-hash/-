/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DoctorSubmission {
  id: string;
  name: string;
  specialty: string;
  clinicName: string;
  phone: string;
  email: string;
  socialLink: string;
  goal: string;
  status: 'new' | 'contacted' | 'archived';
  createdAt: string;
  notes?: string;
  diagnosisId?: string;
}

export interface DiagnosisInput {
  name: string;
  specialty: string;
  clinicDetails: string;
  struggle: string;
  targetAudience: string;
}

export interface DiagnosisOutput {
  id: string;
  patientName: string;
  specialty: string;
  symptoms: string[];
  prescriptionRx: string[]; // RX 01, Rx 02, etc.
  contentPlan: {
    theme: string;
    topics: string[];
  };
  actionSteps: string[];
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  quote: string;
  results: string;
}
