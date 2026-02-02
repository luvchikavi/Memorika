/**
 * Import contacts from Excel file to CRM database
 * Run with: npx tsx scripts/import-contacts.ts
 */

import * as XLSX from "xlsx";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Map Hebrew status to our CRM status
function mapStatus(hebrewStatus: string): { status: string; leadStatus: string; source: string } {
  const statusLower = hebrewStatus?.toLowerCase() || "";

  // Default values
  let status = "active";
  let leadStatus = "new";
  let source = "other";

  // Parse the status string for lead status
  if (statusLower.includes("לא רלוונטי") || statusLower.includes("97")) {
    leadStatus = "lost";
    status = "inactive";
  } else if (statusLower.includes("מכירה") || statusLower.includes("רכישה")) {
    leadStatus = "converted";
  } else if (statusLower.includes("חם") || statusLower.includes("מעוניין")) {
    leadStatus = "hot";
  } else if (statusLower.includes("קר") || statusLower.includes("לא עכשיו")) {
    leadStatus = "cold";
  } else if (statusLower.includes("שיחה") || statusLower.includes("בשיחות")) {
    leadStatus = "in_talks";
  } else if (statusLower.includes("ליצור קשר") || statusLower.includes("contacted")) {
    leadStatus = "contacted";
  } else if (statusLower.includes("ליד חדש") || statusLower.includes("הרשמה")) {
    leadStatus = "new";
  }

  // Parse source from status
  if (statusLower.includes("כנס") || statusLower.includes("הרצאה")) {
    source = "event";
  } else if (statusLower.includes("דף נחיתה") || statusLower.includes("landing")) {
    source = "landing_page";
  } else if (statusLower.includes("פייסבוק") || statusLower.includes("facebook")) {
    source = "facebook";
  } else if (statusLower.includes("אינסטגרם") || statusLower.includes("instagram")) {
    source = "instagram";
  } else if (statusLower.includes("גוגל") || statusLower.includes("google")) {
    source = "google";
  } else if (statusLower.includes("המלצה") || statusLower.includes("referral")) {
    source = "referral";
  }

  return { status, leadStatus, source };
}

// Convert Excel date serial number to JavaScript Date
function excelDateToJS(excelDate: number): Date | null {
  if (!excelDate || typeof excelDate !== "number") return null;
  // Excel dates start from 1900-01-01 (serial 1)
  // But there's a leap year bug in Excel, so we subtract 2 days for dates after Feb 28, 1900
  const utcDays = Math.floor(excelDate - 25569);
  const utcValue = utcDays * 86400 * 1000;
  return new Date(utcValue);
}

async function importContacts() {
  console.log("Starting import...\n");

  // Read Excel file
  const workbook = XLSX.readFile("/Users/aviluvchik/app/Memorika/Data/Potential.xls");
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

  // Skip header row
  const dataRows = rows.slice(1);
  console.log(`Found ${dataRows.length} contacts to import\n`);

  let imported = 0;
  let skipped = 0;
  let errors = 0;

  for (const row of dataRows) {
    try {
      const [
        contactId,
        firstName,
        lastName,
        company,
        homePhone,
        workPhone,
        mobilePhone,
        email,
        address,
        city,
        zipCode,
        lastActivityStatus,
        lastActivityUpdate,
        statusNote,
      ] = row;

      // Skip if no email (required field)
      if (!email || typeof email !== "string" || !email.includes("@")) {
        skipped++;
        continue;
      }

      // Skip if no name
      if (!firstName && !lastName) {
        skipped++;
        continue;
      }

      // Check if contact already exists
      const existing = await prisma.contact.findUnique({
        where: { email: email.toLowerCase().trim() },
      });

      if (existing) {
        skipped++;
        continue;
      }

      // Map status
      const { status, leadStatus, source } = mapStatus(lastActivityStatus || "");

      // Get phone (prefer mobile, then work, then home)
      const phone = mobilePhone || workPhone || homePhone || null;

      // Create contact
      const contact = await prisma.contact.create({
        data: {
          firstName: firstName?.toString().trim() || "Unknown",
          lastName: lastName?.toString().trim() || "",
          email: email.toLowerCase().trim(),
          phone: phone?.toString().trim() || null,
          city: city?.toString().trim() || null,
          source: source,
          status: status,
          notes: statusNote?.toString().trim() || lastActivityStatus?.toString().trim() || null,
        },
      });

      // Create lead entry for this contact
      await prisma.lead.create({
        data: {
          contactId: contact.id,
          status: leadStatus,
          source: source,
          notes: lastActivityStatus?.toString().trim() || null,
          createdAt: excelDateToJS(lastActivityUpdate) || new Date(),
        },
      });

      imported++;

      // Progress log every 100 records
      if (imported % 100 === 0) {
        console.log(`Imported ${imported} contacts...`);
      }
    } catch (error: any) {
      errors++;
      if (errors <= 5) {
        console.error(`Error importing row:`, error.message);
      }
    }
  }

  console.log("\n--- Import Complete ---");
  console.log(`Imported: ${imported}`);
  console.log(`Skipped (duplicates/invalid): ${skipped}`);
  console.log(`Errors: ${errors}`);
  console.log(`Total processed: ${dataRows.length}`);

  await prisma.$disconnect();
}

// Run the import
importContacts().catch(console.error);
