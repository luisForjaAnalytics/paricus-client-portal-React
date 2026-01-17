import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // Create permissions
  const permissions = [
    {
      permissionName: "view_dashboard",
      description: "View dashboard and basic metrics",
    },
    {
      permissionName: "view_financials",
      description: "View financial information and invoices",
    },
    {
      permissionName: "download_invoices",
      description: "Download invoice files",
    },
    { permissionName: "view_reporting", description: "View reports and KPIs" },
    {
      permissionName: "download_reports",
      description: "Download report files",
    },
    {
      permissionName: "view_interactions",
      description: "View interaction history",
    },
    {
      permissionName: "download_audio_files",
      description: "Download audio interaction files",
    },
    {
      permissionName: "view_knowledge_base",
      description: "View knowledge base articles",
    },
    {
      permissionName: "create_kb_articles",
      description: "Create knowledge base articles",
    },
    {
      permissionName: "edit_kb_articles",
      description: "Edit knowledge base articles",
    },
    {
      permissionName: "admin_clients",
      description: "Manage clients (BPO Admin only)",
    },
    {
      permissionName: "admin_users",
      description: "Manage users (BPO Admin only)",
    },
    {
      permissionName: "admin_roles",
      description: "Manage roles and permissions (BPO Admin only)",
    },
    {
      permissionName: "admin_reports",
      description: "Upload and manage client reports (BPO Admin only)",
    },
    {
      permissionName: "admin_dashboard_config",
      description: "Configure dashboard layouts (BPO Admin only)",
    },
    {
      permissionName: "admin_invoices",
      description:
        "Manage invoices - create, send, and set payment links (BPO Admin only)",
    },
    {
      permissionName: "admin_audio_recordings",
      description:
        "View and manage audio call recordings from Workforce Management database (BPO Admin only)",
    },
    {
      permissionName: "view_invoices",
      description: "View client invoices (Client Admin only)",
    },
    {
      permissionName: "pay_invoices",
      description: "Access payment links for invoices",
    },
    {
      permissionName: "view_tickets",
      description: "View and manage support tickets",
    },
    {
      permissionName: "admin_broadcast",
      description: "Send announcements and broadcasts to clients (BPO Admin and Client Admin only)",
    },
  ];

  console.log("Creating permissions...");
  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { permissionName: permission.permissionName },
      update: {},
      create: permission,
    });
  }

  // Create BPO Administration client
  console.log("Creating BPO Administration client...");
  const bpoClient = await prisma.client.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: "BPO Administration",
      isActive: true,
      isProspect: false,
    },
  });

  // Create Flex Mobile client
  console.log("Creating Flex Mobile...");
  const flexMobileClient = await prisma.client.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: "Flex Mobile",
      isActive: true,
      isProspect: false,
    },
  });

  // Create IM Telecom client
  console.log("Creating IM Telecom...");
  const imTelecomClient = await prisma.client.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      name: "IM Telecom",
      isActive: true,
      isProspect: false,
    },
  });

  // Create North American Local client
  console.log("Creating North American Local...");
  const northAmericanLocalClient = await prisma.client.upsert({
    where: { id: 4 },
    update: {},
    create: {
      id: 4,
      name: "North American Local",
      isActive: true,
      isProspect: false,
    },
  });

  // Create BPO Admin role with all permissions
  console.log("Creating BPO Admin role...");
  const bpoAdminRole = await prisma.role.upsert({
    where: {
      clientId_roleName: {
        clientId: bpoClient.id,
        roleName: "BPO Admin",
      },
    },
    update: {},
    create: {
      clientId: bpoClient.id,
      roleName: "BPO Admin",
      description: "Full administrative access to the portal",
    },
  });

  // Create roles for Flex Mobile
  console.log("👤 Creating Flex Mobile Admin role...");
  const flexMobileAdminRole = await prisma.role.upsert({
    where: {
      clientId_roleName: {
        clientId: flexMobileClient.id,
        roleName: "Client Admin",
      },
    },
    update: {},
    create: {
      clientId: flexMobileClient.id,
      roleName: "Client Admin",
      description: "Administrative access for Flex Mobile users",
    },
  });

  console.log("👤 Creating Flex Mobile User role...");
  const flexMobileUserRole = await prisma.role.upsert({
    where: {
      clientId_roleName: {
        clientId: flexMobileClient.id,
        roleName: "Client User",
      },
    },
    update: {},
    create: {
      clientId: flexMobileClient.id,
      roleName: "Client User",
      description: "Basic access for Flex Mobile users",
    },
  });

  // Create roles for IM Telecom
  console.log("👤 Creating IM Telecom Admin role...");
  const imTelecomAdminRole = await prisma.role.upsert({
    where: {
      clientId_roleName: {
        clientId: imTelecomClient.id,
        roleName: "Client Admin",
      },
    },
    update: {},
    create: {
      clientId: imTelecomClient.id,
      roleName: "Client Admin",
      description: "Administrative access for IM Telecom users",
    },
  });

  console.log("👤 Creating IM Telecom User role...");
  const imTelecomUserRole = await prisma.role.upsert({
    where: {
      clientId_roleName: {
        clientId: imTelecomClient.id,
        roleName: "Client User",
      },
    },
    update: {},
    create: {
      clientId: imTelecomClient.id,
      roleName: "Client User",
      description: "Basic access for IM Telecom users",
    },
  });

  // Create roles for North American Local
  console.log("👤 Creating North American Local Admin role...");
  const northAmericanLocalAdminRole = await prisma.role.upsert({
    where: {
      clientId_roleName: {
        clientId: northAmericanLocalClient.id,
        roleName: "Client Admin",
      },
    },
    update: {},
    create: {
      clientId: northAmericanLocalClient.id,
      roleName: "Client Admin",
      description: "Administrative access for North American Local users",
    },
  });

  console.log("👤 Creating North American Local User role...");
  const northAmericanLocalUserRole = await prisma.role.upsert({
    where: {
      clientId_roleName: {
        clientId: northAmericanLocalClient.id,
        roleName: "Client User",
      },
    },
    update: {},
    create: {
      clientId: northAmericanLocalClient.id,
      roleName: "Client User",
      description: "Basic access for North American Local users",
    },
  });

  // Assign permissions to BPO Admin (all permissions)
  console.log("🔐 Assigning permissions to BPO Admin...");
  const allPermissions = await prisma.permission.findMany();
  for (const permission of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: bpoAdminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: bpoAdminRole.id,
        permissionId: permission.id,
      },
    });
  }

  // Define permission sets
  const clientAdminPermissions = [
    "view_dashboard",
    "view_financials",
    "download_invoices",
    "view_reporting",
    "download_reports",
    "view_interactions",
    "view_knowledge_base",
    "create_kb_articles",
    "edit_kb_articles",
    "view_invoices",
    "pay_invoices",
    "view_tickets",
    "admin_users",
    "admin_roles",
    "admin_reports",
    "admin_broadcast",
  ];

  const clientUserPermissions = [
    "view_dashboard",
    "view_interactions",
    "view_knowledge_base",
    "view_reporting",
    "view_tickets",
  ];

  // Function to assign permissions to a role
  async function assignPermissionsToRole(roleId, permissions, roleName) {
    console.log(`🔐 Assigning permissions to ${roleName}...`);

    // First, delete all existing permissions for this role
    await prisma.rolePermission.deleteMany({
      where: { roleId: roleId },
    });

    // Then, assign the new permissions
    for (const permName of permissions) {
      const permission = await prisma.permission.findUnique({
        where: { permissionName: permName },
      });
      if (permission) {
        await prisma.rolePermission.create({
          data: {
            roleId: roleId,
            permissionId: permission.id,
          },
        });
      }
    }
  }

  // Assign permissions to all Client Admin roles
  await assignPermissionsToRole(
    flexMobileAdminRole.id,
    clientAdminPermissions,
    "Flex Mobile Admin"
  );
  await assignPermissionsToRole(
    imTelecomAdminRole.id,
    clientAdminPermissions,
    "IM Telecom Admin"
  );
  await assignPermissionsToRole(
    northAmericanLocalAdminRole.id,
    clientAdminPermissions,
    "North American Local Admin"
  );

  // Assign permissions to all Client User roles
  await assignPermissionsToRole(
    flexMobileUserRole.id,
    clientUserPermissions,
    "Flex Mobile User"
  );
  await assignPermissionsToRole(
    imTelecomUserRole.id,
    clientUserPermissions,
    "IM Telecom User"
  );
  await assignPermissionsToRole(
    northAmericanLocalUserRole.id,
    clientUserPermissions,
    "North American Local User"
  );

  // Create client folder access mappings for reports
  console.log("📁 Creating client folder access mappings...");

  // Flex Mobile folder access
  await prisma.clientFolderAccess.upsert({
    where: {
      clientId_folderName: {
        clientId: flexMobileClient.id,
        folderName: "flex-mobile",
      },
    },
    update: {},
    create: {
      clientId: flexMobileClient.id,
      folderName: "flex-mobile",
    },
  });

  // IM Telecom folder access
  await prisma.clientFolderAccess.upsert({
    where: {
      clientId_folderName: {
        clientId: imTelecomClient.id,
        folderName: "im-telecom",
      },
    },
    update: {},
    create: {
      clientId: imTelecomClient.id,
      folderName: "im-telecom",
    },
  });

  // North American Local folder access
  await prisma.clientFolderAccess.upsert({
    where: {
      clientId_folderName: {
        clientId: northAmericanLocalClient.id,
        folderName: "north-american-local",
      },
    },
    update: {},
    create: {
      clientId: northAmericanLocalClient.id,
      folderName: "north-american-local",
    },
  });

  // Create sample invoices for testing
  console.log("📄 Creating sample invoices...");

  // Sample invoices for Flex Mobile
  const flexInvoices = [
    {
      clientId: flexMobileClient.id,
      invoiceNumber: "INV-FM-2025-001",
      title: "December 2025 Services",
      description: "Monthly BPO services for December 2025",
      amount: 5000.0,
      currency: "USD",
      status: "sent",
      dueDate: new Date("2025-12-15"),
      issuedDate: new Date("2025-12-01"),
      s3Key:
        "client-access-reports/flex-mobile/invoices/2025/invoice-dec-2025.pdf",
      s3Bucket: "paricus-client-portal",
      fileSize: 150000,
      mimeType: "application/pdf",
      paymentMethod: "credit_card",
    },
    {
      clientId: flexMobileClient.id,
      invoiceNumber: "INV-FM-2025-002",
      title: "November 2025 Services",
      description: "Monthly BPO services for November 2025",
      amount: 4800.0,
      currency: "USD",
      status: "paid",
      dueDate: new Date("2025-11-15"),
      issuedDate: new Date("2025-11-01"),
      paidDate: new Date("2025-11-10"),
      s3Key:
        "client-access-reports/flex-mobile/invoices/2025/invoice-nov-2025.pdf",
      s3Bucket: "paricus-client-portal",
      fileSize: 145000,
      mimeType: "application/pdf",
      paymentMethod: "bank_transfer",
    },
  ];

  for (const invoice of flexInvoices) {
    await prisma.invoice.upsert({
      where: { invoiceNumber: invoice.invoiceNumber },
      update: {},
      create: invoice,
    });
  }

  // Sample invoices for IM Telecom
  const imTelecomInvoices = [
    {
      clientId: imTelecomClient.id,
      invoiceNumber: "INV-IM-2025-001",
      title: "December 2025 Services",
      description: "Monthly support services for December 2025",
      amount: 6500.0,
      currency: "USD",
      status: "sent",
      dueDate: new Date("2025-12-20"),
      issuedDate: new Date("2025-12-01"),
      s3Key:
        "client-access-reports/im-telecom/invoices/2025/invoice-dec-2025.pdf",
      s3Bucket: "paricus-client-portal",
      fileSize: 160000,
      mimeType: "application/pdf",
      paymentMethod: "credit_card",
    },
  ];

  for (const invoice of imTelecomInvoices) {
    await prisma.invoice.upsert({
      where: { invoiceNumber: invoice.invoiceNumber },
      update: {},
      create: invoice,
    });
  }

  // Create mockup users
  console.log("👥 Creating mockup users...");

  // BPO Admin user (Super Admin - associated with BPO Administration client)
  const bpoAdminPassword = await bcrypt.hash("admin123!", 12);
  await prisma.user.upsert({
    where: { email: "admin@paricus.com" },
    update: {
      clientId: bpoClient.id, // Update to BPO Administration client
      roleId: bpoAdminRole.id,
      passwordHash: bpoAdminPassword,
    },
    create: {
      email: "admin@paricus.com",
      passwordHash: bpoAdminPassword,
      firstName: "System",
      lastName: "Administrator",
      clientId: bpoClient.id, // BPO Administration client
      roleId: bpoAdminRole.id,
      isActive: true,
    },
  });

  // Flex Mobile users
  const flexAdminPassword = await bcrypt.hash("flex123!", 12);
  await prisma.user.upsert({
    where: { email: "admin@flexmobile.com" },
    update: {},
    create: {
      email: "admin@flexmobile.com",
      passwordHash: flexAdminPassword,
      firstName: "Flex",
      lastName: "Administrator",
      clientId: flexMobileClient.id,
      roleId: flexMobileAdminRole.id,
      isActive: true,
    },
  });

  const flexUserPassword = await bcrypt.hash("flexuser123!", 12);
  await prisma.user.upsert({
    where: { email: "user@flexmobile.com" },
    update: {},
    create: {
      email: "user@flexmobile.com",
      passwordHash: flexUserPassword,
      firstName: "Flex",
      lastName: "User",
      clientId: flexMobileClient.id,
      roleId: flexMobileUserRole.id,
      isActive: true,
    },
  });

  // IM Telecom users
  const imAdminPassword = await bcrypt.hash("imtelecom123!", 12);
  await prisma.user.upsert({
    where: { email: "admin@imtelecom.com" },
    update: {},
    create: {
      email: "admin@imtelecom.com",
      passwordHash: imAdminPassword,
      firstName: "IM",
      lastName: "Administrator",
      clientId: imTelecomClient.id,
      roleId: imTelecomAdminRole.id,
      isActive: true,
    },
  });

  const imUserPassword = await bcrypt.hash("imuser123!", 12);
  await prisma.user.upsert({
    where: { email: "user@imtelecom.com" },
    update: {},
    create: {
      email: "user@imtelecom.com",
      passwordHash: imUserPassword,
      firstName: "IM",
      lastName: "User",
      clientId: imTelecomClient.id,
      roleId: imTelecomUserRole.id,
      isActive: true,
    },
  });

  // North American Local users
  const nalAdminPassword = await bcrypt.hash("northam123!", 12);
  await prisma.user.upsert({
    where: { email: "admin@northamericanlocal.com" },
    update: {},
    create: {
      email: "admin@northamericanlocal.com",
      passwordHash: nalAdminPassword,
      firstName: "North American",
      lastName: "Administrator",
      clientId: northAmericanLocalClient.id,
      roleId: northAmericanLocalAdminRole.id,
      isActive: true,
    },
  });

  const nalUserPassword = await bcrypt.hash("naluser123!", 12);
  await prisma.user.upsert({
    where: { email: "user@northamericanlocal.com" },
    update: {},
    create: {
      email: "user@northamericanlocal.com",
      passwordHash: nalUserPassword,
      firstName: "North American",
      lastName: "User",
      clientId: northAmericanLocalClient.id,
      roleId: northAmericanLocalUserRole.id,
      isActive: true,
    },
  });

  // Create sample logs
  console.log("Creating sample logs...");

  const sampleLogs = [
    {
      id: uuidv4(),
      timestamp: new Date("2025-12-03T17:12:55Z"),
      userId: "1",
      eventType: "UPDATE",
      entity: "Role",
      description: "Admin updated role permissions for BPO Admin role",
      status: "SUCCESS",
    },
    {
      id: uuidv4(),
      timestamp: new Date("2025-12-03T16:45:30Z"),
      userId: "2",
      eventType: "CREATE",
      entity: "User",
      description: "New user created: user@flexmobile.com",
      status: "SUCCESS",
    },
    {
      id: uuidv4(),
      timestamp: new Date("2025-12-03T15:30:10Z"),
      userId: "1",
      eventType: "DELETE",
      entity: "Client",
      description: "Client deleted by super admin",
      status: "SUCCESS",
    },
    {
      id: uuidv4(),
      timestamp: new Date("2025-12-03T14:15:45Z"),
      userId: "3",
      eventType: "LOGIN",
      entity: "Auth",
      description: "User logged in successfully from web browser",
      status: "SUCCESS",
    },
    {
      id: uuidv4(),
      timestamp: new Date("2025-12-03T13:00:00Z"),
      userId: "2",
      eventType: "UPDATE",
      entity: "Invoice",
      description: "Invoice status updated from pending to paid",
      status: "SUCCESS",
    },
    {
      id: uuidv4(),
      timestamp: new Date("2025-12-03T12:30:22Z"),
      userId: "unknown",
      eventType: "LOGIN",
      entity: "Auth",
      description: "Failed login attempt - invalid credentials for admin@test.com",
      status: "FAILURE",
    },
    {
      id: uuidv4(),
      timestamp: new Date("2025-12-03T11:20:15Z"),
      userId: "1",
      eventType: "CREATE",
      entity: "Role",
      description: "New role created: Custom Manager for Flex Mobile",
      status: "SUCCESS",
    },
    {
      id: uuidv4(),
      timestamp: new Date("2025-12-03T10:05:30Z"),
      userId: "4",
      eventType: "UPDATE",
      entity: "User",
      description: "User profile updated: Changed password",
      status: "SUCCESS",
    },
    {
      id: uuidv4(),
      timestamp: new Date("2025-12-03T09:45:00Z"),
      userId: "1",
      eventType: "DELETE",
      entity: "Permission",
      description: "Attempted to delete system permission",
      status: "FAILURE",
    },
    {
      id: uuidv4(),
      timestamp: new Date("2025-12-03T08:30:10Z"),
      userId: "2",
      eventType: "CREATE",
      entity: "Invoice",
      description: "New invoice created for Flex Mobile - Invoice #INV-2025-001",
      status: "SUCCESS",
    },
  ];

  for (const log of sampleLogs) {
    await prisma.log.create({
      data: log,
    });
  }

  console.log("Sample logs created!");

  console.log("Seed completed successfully!");
  console.log("");
  console.log("Mockup Credentials:");
  console.log("");
  console.log("BPO Administration:");
  console.log("   Admin: admin@paricus.com / admin123!");
  console.log("");
  console.log("Flex Mobile:");
  console.log("   Admin: admin@flexmobile.com / flex123!");
  console.log("   User:  user@flexmobile.com / flexuser123!");
  console.log("");
  console.log("IM Telecom:");
  console.log("   Admin: admin@imtelecom.com / imtelecom123!");
  console.log("   User:  user@imtelecom.com / imuser123!");
  console.log("");
  console.log("North American Local:");
  console.log("   Admin: admin@northamericanlocal.com / northam123!");
  console.log("   User:  user@northamericanlocal.com / naluser123!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
