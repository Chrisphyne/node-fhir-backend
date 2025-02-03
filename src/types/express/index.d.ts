  import { Officer } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      officer?: {
        id: number;
      } & Partial<Officer>;
    }
  }
}

export {}; 