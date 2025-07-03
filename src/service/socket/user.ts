// import { io, prisma } from "../../app";

 

// export async function registerUserSocket(props: { email: string, socketId: string,  }) {
//   const { email, socketId } = props;
//  prisma.user.update({
//   where: {
//     email: email
//   },
//   data: {
//     socket_id: socketId
//   }
// }).then(res => {
//   io.to(socketId).emit('user_connected', res)
   
//   console.log(res)
// })
// .catch(err => {
//     io.to(socketId).emit('user_not_found', err)
//   console.log(err)
// })
// }




