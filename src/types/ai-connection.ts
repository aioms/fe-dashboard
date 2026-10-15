export interface IAiConnection {
  id: string;
  clientName: string;
  clientHost: string;
  scope: string;
  createdAt: string;
  lastUsedAt: string | null;
}
