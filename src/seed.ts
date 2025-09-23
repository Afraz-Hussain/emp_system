import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Insert one record
  const newEmployee = await prisma.employees.create({
    data: {
      empname: "Afraz Hussain",
      department: "IT",
    },
  });

  console.log("✅ Inserted:", newEmployee);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
