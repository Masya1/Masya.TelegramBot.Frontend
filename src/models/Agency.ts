import { Agent } from './Agent';

export interface Agency {
  id: number;
  name: string;
  description?: string;
  dateOfUnblock?: Date;
  registrationKey: string;
  isRegWithoutAdmin?: boolean;
  importUrl: string;
  agents: Agent[];
}
