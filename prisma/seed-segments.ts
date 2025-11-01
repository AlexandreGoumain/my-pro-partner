import { PrismaClient, TypeSegment } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

const predefinedSegments = [
  {
    nom: "Tous les clients",
    description: "Tous les clients de votre base de données",
    type: "PREDEFINED" as TypeSegment,
    icone: "Users",
    couleur: "#f3f4f6",
    criteres: {
      type: "all",
    },
  },
  {
    nom: "Clients avec email",
    description: "Clients ayant une adresse email enregistrée",
    type: "PREDEFINED" as TypeSegment,
    icone: "Mail",
    couleur: "#f3f4f6",
    criteres: {
      type: "with-email",
    },
  },
  {
    nom: "Clients avec téléphone",
    description: "Clients ayant un numéro de téléphone enregistré",
    type: "PREDEFINED" as TypeSegment,
    icone: "Phone",
    couleur: "#f3f4f6",
    criteres: {
      type: "with-phone",
    },
  },
  {
    nom: "Clients par ville",
    description: "Clients dont la ville est renseignée",
    type: "PREDEFINED" as TypeSegment,
    icone: "MapPin",
    couleur: "#f3f4f6",
    criteres: {
      type: "by-city",
    },
  },
  {
    nom: "Nouveaux clients",
    description: "Clients ajoutés au cours des 30 derniers jours",
    type: "PREDEFINED" as TypeSegment,
    icone: "Clock",
    couleur: "#f3f4f6",
    criteres: {
      type: "recent",
    },
  },
  {
    nom: "Clients inactifs",
    description: "Clients sans activité depuis plus de 90 jours",
    type: "PREDEFINED" as TypeSegment,
    icone: "UserX",
    couleur: "#f3f4f6",
    criteres: {
      type: "inactive",
    },
  },
  {
    nom: "Programme de fidélité",
    description: "Clients ayant des points de fidélité",
    type: "PREDEFINED" as TypeSegment,
    icone: "Star",
    couleur: "#f3f4f6",
    criteres: {
      type: "loyalty",
    },
  },
];

async function seedSegments() {
  console.log("🌱 Starting segment seeding...");

  // Get all entreprises
  const entreprises = await prisma.entreprise.findMany();

  if (entreprises.length === 0) {
    console.log("⚠️  No entreprises found. Please create an entreprise first.");
    return;
  }

  console.log(`📊 Found ${entreprises.length} entreprise(s)`);

  for (const entreprise of entreprises) {
    console.log(`\n🏢 Seeding segments for: ${entreprise.nom}`);

    for (const segmentData of predefinedSegments) {
      // Check if segment already exists
      const existing = await prisma.segment.findUnique({
        where: {
          entrepriseId_nom: {
            entrepriseId: entreprise.id,
            nom: segmentData.nom,
          },
        },
      });

      if (existing) {
        console.log(`   ⏭️  Skipped: "${segmentData.nom}" (already exists)`);
        continue;
      }

      // Create segment
      await prisma.segment.create({
        data: {
          ...segmentData,
          entrepriseId: entreprise.id,
          nombreClients: 0,
          actif: true,
        },
      });

      console.log(`   ✅ Created: "${segmentData.nom}"`);
    }
  }

  console.log("\n✨ Segment seeding completed!");
}

// Run seed if this file is executed directly
if (require.main === module) {
  seedSegments()
    .catch((error) => {
      console.error("❌ Error seeding segments:", error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

export { seedSegments };
