
export interface ProposalData {
  goal: string;
  audience: string;
  deliverables: string[];
  budget: number | string;
  timeline: number | string;
  timelineUnit: 'Weeks' | 'Months';
}
