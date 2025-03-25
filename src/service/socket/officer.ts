import { io, prisma } from "../../app";

 

export async function registerOfficerSocket(props: { serviceNumber: string, socketId: string,  }) {
  const { serviceNumber, socketId } = props;
 prisma.officer.update({
  where: {
    service_number: serviceNumber.toString()
  },
  data: {
    socket_id: socketId
  }
}).then(res => {
  io.to(socketId).emit('officer_connected', res)
   
  console.log(res)
})
.catch(err => {
    io.to(socketId).emit('officer_not_found', err)
  console.log(err)
})
}

export async function sendDuty(props: { serviceNumber: string, socketId: string, ob_number: string, assigned_officer_id: string, narrative: string }) {
  const { serviceNumber, socketId, ob_number, narrative } = props;
  io.emit('duty', {
    ob_number: ob_number.replace("-" , "/").toString(),
    narrative: narrative,
  })

  io.to(socketId).emit('duty', {
    ob_number: ob_number.replace("-" , "/").toString(),
    narrative: narrative,
  })
   
}




