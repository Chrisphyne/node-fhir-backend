import { Router } from "express";
import { prisma } from "../../app";
import { sendDuty } from "../../service/socket/user";
import axios from "axios";

const DutiesRouter = Router();

DutiesRouter.post('/', async (req, res) => {
 try {
    console.log(req.body, "req.body");
    const { ob_number, assigned_officer_id, narrative } = req.body;
    const duty = await prisma.officer.findFirst({
        where: {
            id: assigned_officer_id
        },

        
    })  
    console.log(duty?.socket_id, "duty");
    sendDuty({
        serviceNumber: duty?.service_number,
        socketId: duty?.socket_id,
        ob_number, 
        assigned_officer_id,
        narrative
    })

    
    res.status(200).json({ message: 'Duty sent successfully' });
 } catch (error) {
    res.status(500).json({ message: 'Error sending duty' });
    
 }
});

DutiesRouter.get('/:id', async (req, res) => {
 try {
      // hit ob microservice and get the obpdf
   const obPdf = await axios.get(`https://internal-portal.virtualpolicestation.com/vps/abstract-number/${req.params.id}/view`,{
    responseType: 'arraybuffer' // Ensure we get the raw file data
  });
   // Set the proper headers for a PDF file
   res.setHeader('Content-Type', 'application/pdf');
   res.setHeader('Content-Disposition', 'inline; filename="report.pdf"'); // You can change the filename as needed

  // the response i
  res.send(obPdf.data);
    
 } catch (error) {
    res.status(500).json({ message: 'Error sending duty' });
    
 }
});

export { DutiesRouter };