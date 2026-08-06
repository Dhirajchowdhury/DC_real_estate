import {
  PrismaClient,
  Role,
  PropertyStatus,
  PropertyType,
  LeadStage,
  LeadSource,
  LeadScore,
  Priority,
  PaymentStatus,
  EventType,
  TaskStatus,
} from "@prisma/client";

import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

faker.seed(12345);

const PROPERTY_IMAGES = [
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858",
  "https://images.unsplash.com/photo-1494526585095-c41746248156",
  "https://images.unsplash.com/photo-1460317442991-0ec209397118",
  "https://images.unsplash.com/photo-1448630360428-65456885c650",
];

const CITIES = [
  {
    city: "Kolkata",
    state: "West Bengal",
    areas: [
      "Salt Lake",
      "Rajarhat",
      "New Town",
      "Behala",
      "Park Street",
      "EM Bypass",
    ],
  },
  {
    city: "Delhi",
    state: "Delhi",
    areas: ["Dwarka", "Rohini", "Saket", "Janakpuri"],
  },
  {
    city: "Mumbai",
    state: "Maharashtra",
    areas: ["Andheri", "Powai", "Bandra", "Thane"],
  },
];

function randomImage(): string {
  return faker.helpers.arrayElement(PROPERTY_IMAGES);
}

function randomCity() {
  return faker.helpers.arrayElement(CITIES);
}

async function main() {
  console.log("🌱 Starting Seed...\n");

  const superAdminPassword = await bcrypt.hash("Dheeru@2004", 10);
  const adminPassword = await bcrypt.hash("Admin@123456", 10);
  const brokerPassword = await bcrypt.hash("Broker@123456", 10);
  const customerPassword = await bcrypt.hash("Customer@123456", 10);

  // ===================================================
  // SUPER ADMIN
  // ===================================================

  const superAdmin = await prisma.user.upsert({
    where: {
      email: "superadmin@gmail.com",
    },
    update: {
      username: "dheeru",
      passwordHash: superAdminPassword,
      phone: "9748798629",
      firstName: "Dhiraj",
      lastName: "Chowdhury",
      role: Role.SUPER_ADMIN,
      isVerified: true,
      isActive: true,
    },
    create: {
      email: "superadmin@gmail.com",
      username: "dheeru",
      passwordHash: superAdminPassword,
      phone: "9748798629",
      firstName: "Dhiraj",
      lastName: "Chowdhury",
      role: Role.SUPER_ADMIN,
      isVerified: true,
      isActive: true,
    },
  });

  console.log("✅ Super Admin Ready");

  // ===================================================
  // ADMIN
  // ===================================================

  const admin = await prisma.user.upsert({
    where: {
      email: "operations@dcrealestate.com",
    },
    update: {
      username: "operations_admin",
      passwordHash: adminPassword,
      phone: "9000000001",
      firstName: "Operations",
      lastName: "Admin",
      role: Role.ADMIN,
      isVerified: true,
      isActive: true,
    },
    create: {
      email: "operations@dcrealestate.com",
      username: "operations_admin",
      passwordHash: adminPassword,
      phone: "9000000001",
      firstName: "Operations",
      lastName: "Admin",
      role: Role.ADMIN,
      isVerified: true,
      isActive: true,
    },
  });

  console.log("✅ Admin Ready");

  // ===================================================
  // BROKERS
  // ===================================================

  const brokerNames = [
    {
      first: "Rahul",
      last: "Sharma",
      company: "Skyline Realtors",
    },
    {
      first: "Priya",
      last: "Verma",
      company: "Prime Estates",
    },
    {
      first: "Amit",
      last: "Singh",
      company: "Dream Homes",
    },
  ];

  const brokers = [];

  for (let i = 0; i < brokerNames.length; i++) {
    const bName = brokerNames[i]!;
    const broker = await prisma.user.upsert({
      where: {
        email: `broker${i + 1}@dcrealestate.com`,
      },
      update: {
        username: `broker${i + 1}`,
        passwordHash: brokerPassword,
        phone: `987654320${i + 1}`,
        firstName: bName.first,
        lastName: bName.last,
        companyName: bName.company,
        role: Role.BROKER,
        isVerified: true,
        isActive: true,
      },
      create: {
        email: `broker${i + 1}@dcrealestate.com`,
        username: `broker${i + 1}`,
        passwordHash: brokerPassword,
        phone: `987654320${i + 1}`,
        firstName: bName.first,
        lastName: bName.last,
        companyName: bName.company,
        role: Role.BROKER,
        isVerified: true,
        isActive: true,
      },
    });

    brokers.push(broker);
  }

  console.log("✅ Brokers Ready");

  // ===================================================
  // CUSTOMERS
  // ===================================================

  const customers = [];

  for (let i = 1; i <= 5; i++) {
    const customer = await prisma.user.upsert({
      where: {
        email: `customer${i}@gmail.com`,
      },
      update: {
        username: `customer${i}`,
        passwordHash: customerPassword,
        phone: `888880000${i}`,
        role: Role.CUSTOMER,
        isVerified: true,
        isActive: true,
      },
      create: {
        email: `customer${i}@gmail.com`,
        username: `customer${i}`,
        passwordHash: customerPassword,
        phone: `888880000${i}`,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        role: Role.CUSTOMER,
        isVerified: true,
        isActive: true,
      },
    });

    customers.push(customer);
  }

  console.log("✅ Customers Ready");

  // ===================================================
  // BROKER REQUESTS
  // ===================================================

  for (const broker of brokers) {
    await prisma.brokerRequest.upsert({
      where: {
        userId: broker.id,
      },
      update: {
        status: "APPROVED",
      },
      create: {
        userId: broker.id,
        status: "APPROVED",
      },
    });
  }

  const pendingApplicants = [
    { first: "Rohan", last: "Verma", email: "rohan.applicant@gmail.com", phone: "9111111101" },
    { first: "Sneha", last: "Roy", email: "sneha.applicant@gmail.com", phone: "9111111102" },
  ];

  for (const applicant of pendingApplicants) {
    const applicantUser = await prisma.user.upsert({
      where: { email: applicant.email },
      update: {
        firstName: applicant.first,
        lastName: applicant.last,
        phone: applicant.phone,
        role: Role.CUSTOMER,
        isVerified: true,
        isActive: true,
      },
      create: {
        email: applicant.email,
        username: applicant.email.split('@')[0],
        passwordHash: brokerPassword,
        phone: applicant.phone,
        firstName: applicant.first,
        lastName: applicant.last,
        role: Role.CUSTOMER,
        isVerified: true,
        isActive: true,
      },
    });

    await prisma.brokerRequest.upsert({
      where: { userId: applicantUser.id },
      update: { status: "PENDING" },
      create: { userId: applicantUser.id, status: "PENDING" },
    });
  }

  console.log("✅ Broker Requests Ready (Approved & Pending)");

  // ===================================================
  // AMENITIES
  // ===================================================

  const amenitiesData = [
    { name: "Swimming Pool", icon: "pool" },
    { name: "Gym", icon: "dumbbell" },
    { name: "24x7 Security", icon: "shield" },
    { name: "Power Backup", icon: "zap" },
    { name: "Lift", icon: "move-vertical" },
    { name: "Car Parking", icon: "car" },
    { name: "Club House", icon: "building" },
    { name: "Garden", icon: "trees" },
    { name: "Children Play Area", icon: "baby" },
    { name: "CCTV", icon: "camera" },
  ];

  const amenities = [];

  for (const amenity of amenitiesData) {
    const item = await prisma.amenity.upsert({
      where: {
        name: amenity.name,
      },
      update: {
        icon: amenity.icon,
      },
      create: amenity,
    });

    amenities.push(item);
  }

  console.log("✅ Amenities Ready");

  // ===================================================
  // TAGS
  // ===================================================

  const tagNames = [
    "VIP",
    "Investor",
    "Hot Lead",
    "Cold Lead",
    "NRI",
    "Family",
    "Luxury",
    "Rental",
  ];

  const colors = [
    "#ef4444",
    "#3b82f6",
    "#22c55e",
    "#eab308",
    "#8b5cf6",
    "#ec4899",
    "#14b8a6",
    "#6366f1",
  ];

  for (let i = 0; i < tagNames.length; i++) {
    const tagName = tagNames[i]!;
    const color = colors[i]!;
    await prisma.tag.upsert({
      where: {
        name: tagName,
      },
      update: {
        color: color,
      },
      create: {
        name: tagName,
        color: color,
      },
    });
  }

  console.log("✅ Tags Ready");

  // ===================================================
  // SYSTEM SETTINGS
  // ===================================================

  const settings = [
    {
      key: "company",
      value: {
        name: "DC Real Estate",
        phone: "+91-9000000000",
        email: "contact@dcrealestate.com",
      },
    },
    {
      key: "tax",
      value: {
        gst: 18,
      },
    },
    {
      key: "currency",
      value: {
        symbol: "₹",
        code: "INR",
      },
    },
  ];

  for (const setting of settings) {
    await prisma.systemSetting.upsert({
      where: {
        key: setting.key,
      },
      update: {
        value: setting.value,
      },
      create: {
        key: setting.key,
        value: setting.value,
      },
    });
  }

  console.log("✅ System Settings Ready");

  // ===================================================
  // ARRAYS FOR NEXT SECTIONS
  // ===================================================

  const properties = [];
  const clients = [];

  // ===================================================
  // PROPERTIES
  // ===================================================

  for (let i = 1; i <= 10; i++) {
    const cityData = randomCity();
    const area = faker.helpers.arrayElement(cityData.areas);
    const selectedBroker = faker.helpers.arrayElement(brokers);

    const property = await prisma.property.create({
      data: {
        title: `${faker.helpers.arrayElement([
          "Luxury",
          "Premium",
          "Modern",
          "Elegant",
          "Spacious",
        ])} ${faker.helpers.arrayElement([
          "Apartment",
          "Villa",
          "Flat",
          "House",
        ])} ${i}`,

        slug: `property-${i}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,

        description: faker.lorem.paragraph(),

        type: faker.helpers.arrayElement([
          PropertyType.FLAT,
          PropertyType.VILLA,
          PropertyType.HOUSE,
          PropertyType.APARTMENT,
          PropertyType.COMMERCIAL,
        ]),

        status: PropertyStatus.PUBLISHED,

        price: faker.number.int({
          min: 3500000,
          max: 25000000,
        }),

        areaSqFt: faker.number.int({
          min: 900,
          max: 4500,
        }),

        bedrooms: faker.number.int({
          min: 1,
          max: 5,
        }),

        bathrooms: faker.number.int({
          min: 1,
          max: 4,
        }),

        yearBuilt: faker.number.int({
          min: 2014,
          max: 2025,
        }),

        location: area,

        city: cityData.city,

        state: cityData.state,

        zipCode: faker.location.zipCode(),

        brokerId: selectedBroker.id,

        features: {
          furnished: faker.datatype.boolean(),
          parking: true,
          balcony: faker.number.int({
            min: 1,
            max: 3,
          }),
        },

        amenities: {
          connect: [...amenities]
            .sort(() => 0.5 - Math.random())
            .slice(0, 5)
            .map((a) => ({
              id: a.id,
            })),
        },

        media: {
          create: [
            {
              url: randomImage(),
              mediaType: "IMAGE",
              fileName: "image1.jpg",
              mimeType: "image/jpeg",
              fileSize: 500000,
            },
            {
              url: randomImage(),
              mediaType: "IMAGE",
              fileName: "image2.jpg",
              mimeType: "image/jpeg",
              fileSize: 520000,
            },
            {
              url: randomImage(),
              mediaType: "IMAGE",
              fileName: "image3.jpg",
              mimeType: "image/jpeg",
              fileSize: 480000,
            },
          ],
        },
      },
    });

    properties.push(property);
  }

  console.log("✅ Properties Created");

  // ===================================================
  // CLIENTS
  // ===================================================

  for (let i = 1; i <= 8; i++) {
    const client = await prisma.client.create({
      data: {
        name: faker.person.fullName(),
        phone: faker.phone.number(),
        whatsappNumber: faker.phone.number(),
        email: faker.internet.email(),
        occupation: faker.person.jobTitle(),
        preferredContact: "PHONE",
        address: faker.location.streetAddress(),
        source: faker.helpers.arrayElement([
          LeadSource.GOOGLE,
          LeadSource.FACEBOOK,
          LeadSource.INSTAGRAM,
          LeadSource.WHATSAPP,
        ]),
        stage: faker.helpers.arrayElement([
          LeadStage.NEW_LEAD,
          LeadStage.CONTACTED,
          LeadStage.INTERESTED,
        ]),
        score: faker.helpers.arrayElement([
          LeadScore.HOT,
          LeadScore.WARM,
          LeadScore.COLD,
        ]),
        remarks: faker.lorem.sentences(2),
        lastContactDate: faker.date.recent(),
        requirements: {
          create: {
            preferredLocations: ["New Town", "Salt Lake"],
            propertyTypes: [PropertyType.FLAT, PropertyType.VILLA],
            budgetMin: 4000000,
            budgetMax: 12000000,
            areaMin: 1000,
            areaMax: 2500,
            preferredBHK: [2, 3],
            parkingRequired: true,
            loanRequired: faker.datatype.boolean(),
            urgencyLevel: Priority.MEDIUM,
            preferredAmenities: ["Gym", "Swimming Pool"],
          },
        },
      },
    });

    clients.push(client);
  }

  console.log("✅ Clients Created");

  // ===================================================
  // LEADS
  // ===================================================

  for (let i = 0; i < 10; i++) {
    const selectedClient = faker.helpers.arrayElement(clients);
    const selectedProperty = faker.helpers.arrayElement(properties);
    const selectedBroker = faker.helpers.arrayElement(brokers);
    const isUnassigned = i < 3;

    await prisma.lead.create({
      data: {
        clientId: selectedClient.id,
        propertyId: selectedProperty.id,
        brokerId: isUnassigned ? null : selectedBroker.id,
        notes: faker.lorem.sentences(2),
        stage: faker.helpers.arrayElement([
          LeadStage.NEW_LEAD,
          LeadStage.CONTACTED,
          LeadStage.INTERESTED,
          LeadStage.PROPERTY_SHARED,
        ]),
        score: faker.helpers.arrayElement([
          LeadScore.HOT,
          LeadScore.WARM,
          LeadScore.COLD,
        ]),
      },
    });
  }

  console.log("✅ Leads Created");

  // ===================================================
  // CUSTOMER ACCOUNTS
  // ===================================================

  const customerAccounts = [];

  for (let i = 0; i < customers.length; i++) {
    const customer = customers[i]!;
    const client = clients[i % clients.length]!;

    const account = await prisma.customerAccount.upsert({
      where: {
        userId: customer.id,
      },
      update: {
        clientId: client.id,
      },
      create: {
        userId: customer.id,
        clientId: client.id,
      },
    });

    customerAccounts.push(account);
  }

  console.log("✅ Customer Accounts Created");

  // ===================================================
  // FAVORITES
  // ===================================================

  for (const account of customerAccounts) {
    const shuffled = [...properties].sort(() => 0.5 - Math.random());

    for (const property of shuffled.slice(0, 2)) {
      await prisma.favoriteProperty.upsert({
        where: {
          customerAccountId_propertyId: {
            customerAccountId: account.id,
            propertyId: property.id,
          },
        },
        update: {},
        create: {
          customerAccountId: account.id,
          propertyId: property.id,
        },
      });
    }
  }

  console.log("✅ Favorites Created");

  // ===================================================
  // SAVED SEARCHES
  // ===================================================

  for (const account of customerAccounts) {
    await prisma.savedSearch.create({
      data: {
        customerAccountId: account.id,
        name: "Luxury Flats",
        filters: {
          city: "Kolkata",
          type: "FLAT",
          minPrice: 3000000,
          maxPrice: 10000000,
        },
      },
    });
  }

  console.log("✅ Saved Searches Created");

  // ===================================================
  // SITE VISITS
  // ===================================================

  for (let i = 0; i < 5; i++) {
    const client = clients[i]!;
    const property = properties[i]!;

    await prisma.siteVisit.create({
      data: {
        clientId: client.id,
        propertyId: property.id,
        scheduledFor: faker.date.soon(),
        status: "SCHEDULED",
        feedback: faker.lorem.sentence(),
      },
    });
  }

  console.log("✅ Site Visits Created");

  // ===================================================
  // TASKS
  // ===================================================

  for (let i = 1; i <= 8; i++) {
    const assignee = brokers[i % brokers.length]!;

    await prisma.task.create({
      data: {
        title: `Task ${i}`,
        description: faker.lorem.sentences(2),
        creatorId: admin.id,
        assigneeId: assignee.id,
        status: TaskStatus.TODO,
        priority: Priority.MEDIUM,
        dueDate: faker.date.soon(),
      },
    });
  }

  console.log("✅ Tasks Created");

  // ===================================================
  // NOTIFICATIONS
  // ===================================================

  for (const broker of brokers) {
    await prisma.notification.create({
      data: {
        userId: broker.id,
        title: "New Lead Assigned",
        message: "A new lead has been assigned to you.",
        type: "NEW_LEAD",
      },
    });
  }

  console.log("✅ Notifications Created");

  // ===================================================
  // CALENDAR EVENTS
  // ===================================================

  for (let i = 0; i < 5; i++) {
    const broker = brokers[0]!;
    const client = clients[i]!;
    const property = properties[i]!;

    await prisma.calendarEvent.create({
      data: {
        title: `Site Visit ${i + 1}`,
        description: faker.lorem.sentence(),
        type: EventType.SITE_VISIT,
        startTime: faker.date.soon(),
        endTime: faker.date.soon(),
        userId: broker.id,
        clientId: client.id,
        propertyId: property.id,
      },
    });
  }

  console.log("✅ Calendar Events Created");

  // ===================================================
  // BLOG POSTS
  // ===================================================

  for (let i = 1; i <= 5; i++) {
    const blogSlug = `blog-${i}-${Date.now()}`;
    await prisma.blogPost.create({
      data: {
        title: faker.lorem.words(5),
        slug: blogSlug,
        content: faker.lorem.paragraphs(5),
        excerpt: faker.lorem.sentences(2),
        coverImage: randomImage(),
        published: true,
        authorId: admin.id,
      },
    });
  }

  console.log("✅ Blogs Created");

  // ===================================================
  // INVOICES
  // ===================================================

  for (let i = 0; i < 5; i++) {
    const client = clients[i]!;
    const property = properties[i]!;
    const invNum = `INV-${Date.now()}-${i + 1}`;

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: invNum,
        clientId: client.id,
        propertyId: property.id,
        amount: 50000,
        taxAmount: 9000,
        totalAmount: 59000,
        status: PaymentStatus.PENDING,
        dueDate: faker.date.soon(),
      },
    });

    await prisma.payment.create({
      data: {
        invoiceId: invoice.id,
        amount: 59000,
        status: PaymentStatus.PENDING,
      },
    });
  }

  console.log("✅ Invoices & Payments Created");

  // ===================================================
  // AUDIT LOGS
  // ===================================================

  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: "DATABASE_SEEDED",
      entityType: "SYSTEM",
      entityId: null,
      details: {
        message: "Initial seed completed",
      },
    },
  });

  console.log("✅ Audit Logs Created");

  // ===================================================
  // DONE
  // ===================================================

  console.log("\n====================================");
  console.log("🎉 DATABASE SEEDED SUCCESSFULLY");
  console.log("====================================");

  console.log("\nSUPER ADMIN");
  console.log("Email : superadmin@gmail.com");
  console.log("Password : Dheeru@2004");

  console.log("\nADMIN");
  console.log("Email : operations@dcrealestate.com");
  console.log("Password : Admin@123456");

  console.log("\nBROKER");
  console.log("Email : broker1@dcrealestate.com");
  console.log("Password : Broker@123456");
}

main()
  .catch((error) => {
    console.error("❌ Seed Failed");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });