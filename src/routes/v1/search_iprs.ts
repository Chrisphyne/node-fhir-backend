import express, { Request, Response } from 'express';
import { searchIPRSPerson } from '../../service/search_iprs'; 

const iprsPersonRouter = express.Router();

// Define a route to handle GET requests to search for an IPRS person
iprsPersonRouter.get('/search', async (req: Request, res: Response) => {
  try {
    const { id_no } = req.query;
    console.log('====================================');
    console.log(req.query);
    console.log('====================================');

    if (!id_no || typeof id_no !== 'string') {
      return res.status(400).json({ error: 'Invalid id_no parameter' });
    }

    const result = await searchIPRSPerson(id_no);

    res.json(result);
  } catch (error) {
    console.error('Error handling searchIPRSPerson request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default iprsPersonRouter;
