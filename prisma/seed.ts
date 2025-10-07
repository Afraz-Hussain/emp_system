import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // hash the password before inserting
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const superAdmin = await prisma.user.upsert({
    where: { id: 1 },
    update: {}, 
    create: {
      id: 1,
      name: "admin",
      username: "admin",
      email: "admin@example.com",
      password: hashedPassword,   
      phone: "03001234567",
      role_id: 1,
       
    },
  });

  console.log("superAdmin ", superAdmin);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
