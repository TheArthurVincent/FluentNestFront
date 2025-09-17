export interface User {
  id: string;
  name: string;
  lastname: string;
  doc: string;
  phoneNumber: string;
  dateOfBirth: string;
  email: string;
  username: string;
  tutoree: boolean;
  googleDriveLink: string;
  permissions: string;
  monthlyScore: number;
  totalScore: number;
  picture: string;
  paymentId: string;
  limitDate: any;
  limitCancelDate: any;
  askedToCancel: boolean;
  subscriptionAsaas: string;
}
