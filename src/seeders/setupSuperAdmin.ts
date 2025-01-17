import { prisma } from "../app"; // Adjust path as needed
import bcrypt from "bcrypt";
import dotenv from "dotenv"; // Import dotenv
import { searchIPRSPerson } from "../service/search_iprs"; // Import your IPRS search function

dotenv.config(); // Load environment variables from .env file

async function setupSuperAdmin() {
  const existingSuperAdmin = await prisma.user.findFirst({
    where: { email: "info@intelligentso.com" }
  });

  if (!existingSuperAdmin) {
    // Parse the SUPER_ADMIN_DATA environment variable into an object
    const superAdminData = JSON.parse(process.env.SUPER_ADMIN_DATA || '{}');
    
    // Directly use the password from the .env file without fallback
    const password = superAdminData.password;

    if (!password) {
      console.error("Password is missing");
      return;
    }

    // Fetch the IPRS person, for example, by using the ID number (or any other method)
    const iprsPerson = await searchIPRSPerson(superAdminData.id_no); // Ensure 'id_no' is part of superAdminData

    if (!iprsPerson) {
      console.error("IPRS person not found");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password from the .env file

    // Create the Super Admin user and associate with the IPRS person
    await prisma.user.create({
      data: {
        name: superAdminData.name,
        email: superAdminData.email,
        password: hashedPassword,
        telephone: superAdminData.telephone,
        iPRS_PersonId: iprsPerson.id,  // Associate the IPRS person with the Super Admin
        created_at: new Date(),
      },
    });

    console.log("Super Admin created");
  } else {
    console.log("Super Admin already exists");
  }
}

setupSuperAdmin()
  .catch((error) => {
    console.error("Error setting up Super Admin:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
