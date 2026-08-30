// api/trpc/[...path].ts
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// server/routers.ts
import { asc as asc2, desc as desc2, eq as eq2 } from "drizzle-orm";
import { z as z2 } from "zod";

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// drizzle/schema.ts
import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
var users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull()
});
var siteSettings = mysqlTable("site_settings", {
  id: int("id").primaryKey(),
  siteName: varchar("siteName", { length: 160 }).notNull(),
  brandLine: varchar("brandLine", { length: 160 }).notNull(),
  heroEyebrow: varchar("heroEyebrow", { length: 220 }).notNull(),
  heroTitle: varchar("heroTitle", { length: 240 }).notNull(),
  heroAccent: varchar("heroAccent", { length: 240 }).notNull(),
  heroIntro: text("heroIntro").notNull(),
  heroCtaLabel: varchar("heroCtaLabel", { length: 120 }).notNull(),
  heroImageUrl: text("heroImageUrl").notNull(),
  heroAsideTitle: varchar("heroAsideTitle", { length: 240 }).notNull(),
  heroAsideBody: text("heroAsideBody").notNull(),
  heroFooterIndex: varchar("heroFooterIndex", { length: 80 }).default("01 / 06").notNull(),
  heroFooterDescriptor: varchar("heroFooterDescriptor", { length: 240 }).default("Radio + online media + event promotion").notNull(),
  tickerItems: text("tickerItems").notNull(),
  aboutEyebrow: varchar("aboutEyebrow", { length: 220 }).notNull(),
  aboutRailLabel: varchar("aboutRailLabel", { length: 160 }).default("About the signal").notNull(),
  aboutTitle: varchar("aboutTitle", { length: 240 }).notNull(),
  aboutAccent: varchar("aboutAccent", { length: 240 }).notNull(),
  aboutBody: text("aboutBody").notNull(),
  aboutQuote: text("aboutQuote").notNull(),
  aboutImageUrl: text("aboutImageUrl").notNull(),
  aboutCaptionLeft: varchar("aboutCaptionLeft", { length: 240 }).default("Field recording / Addis Ababa").notNull(),
  aboutCaptionRight: varchar("aboutCaptionRight", { length: 240 }).default("03\xB0 28' N / 38\xB0 44' E").notNull(),
  programsEyebrow: varchar("programsEyebrow", { length: 220 }).notNull(),
  programsRailLabel: varchar("programsRailLabel", { length: 160 }).default("Programmes").notNull(),
  programsTitle: varchar("programsTitle", { length: 240 }).notNull(),
  programsAccent: varchar("programsAccent", { length: 240 }).notNull(),
  programsSummary: text("programsSummary").notNull(),
  audioImageLabel: varchar("audioImageLabel", { length: 160 }).default("Listen / 00:48").notNull(),
  audioCaptionLabel: varchar("audioCaptionLabel", { length: 160 }).default("Latest signal").notNull(),
  servicesEyebrow: varchar("servicesEyebrow", { length: 220 }).notNull(),
  servicesRailLabel: varchar("servicesRailLabel", { length: 160 }).default("What we make").notNull(),
  servicesTitle: varchar("servicesTitle", { length: 240 }).notNull(),
  servicesAccent: varchar("servicesAccent", { length: 240 }).notNull(),
  servicesSummary: text("servicesSummary").notNull(),
  eventEyebrow: varchar("eventEyebrow", { length: 220 }).notNull(),
  eventTitle: varchar("eventTitle", { length: 240 }).notNull(),
  eventAccent: varchar("eventAccent", { length: 240 }).notNull(),
  eventBody: text("eventBody").notNull(),
  eventCtaLabel: varchar("eventCtaLabel", { length: 120 }).notNull(),
  eventImageUrl: text("eventImageUrl").notNull(),
  eventImageLabel: varchar("eventImageLabel", { length: 200 }).default("Event promotion / Open room").notNull(),
  journalEyebrow: varchar("journalEyebrow", { length: 220 }).notNull(),
  journalRailLabel: varchar("journalRailLabel", { length: 160 }).default("Journal / field notes").notNull(),
  journalTitle: varchar("journalTitle", { length: 240 }).notNull(),
  journalAccent: varchar("journalAccent", { length: 240 }).notNull(),
  contactEyebrow: varchar("contactEyebrow", { length: 220 }).notNull(),
  contactRailLabel: varchar("contactRailLabel", { length: 160 }).default("Start a conversation").notNull(),
  contactTitle: varchar("contactTitle", { length: 240 }).notNull(),
  contactAccent: varchar("contactAccent", { length: 240 }).notNull(),
  contactBody: text("contactBody").notNull(),
  contactEmail: varchar("contactEmail", { length: 320 }).notNull(),
  contactLocation: varchar("contactLocation", { length: 320 }).notNull(),
  instagramUrl: text("instagramUrl").notNull(),
  youtubeUrl: text("youtubeUrl").notNull(),
  facebookUrl: text("facebookUrl").notNull(),
  footerNavigateLabel: varchar("footerNavigateLabel", { length: 120 }).default("Navigate").notNull(),
  footerFollowLabel: varchar("footerFollowLabel", { length: 160 }).default("Follow the signal").notNull(),
  footerBuiltLine: varchar("footerBuiltLine", { length: 240 }).default("Built in Addis Ababa / Made to travel").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var contentTimestamps = {
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
};
var programs = mysqlTable("programs", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 180 }).notNull(),
  subtitle: varchar("subtitle", { length: 180 }).notNull(),
  description: text("description").notNull(),
  tag: varchar("tag", { length: 120 }).notNull(),
  imageUrl: text("imageUrl"),
  featureTitle: varchar("featureTitle", { length: 240 }),
  featureSubtitle: varchar("featureSubtitle", { length: 240 }),
  sortOrder: int("sortOrder").default(0).notNull(),
  isPublished: boolean("isPublished").default(true).notNull(),
  ...contentTimestamps
});
var services = mysqlTable("services", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 180 }).notNull(),
  description: text("description").notNull(),
  iconKey: varchar("iconKey", { length: 64 }).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  isPublished: boolean("isPublished").default(true).notNull(),
  ...contentTimestamps
});
var events = mysqlTable("events", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 220 }).notNull(),
  description: text("description").notNull(),
  imageUrl: text("imageUrl").notNull(),
  ctaLabel: varchar("ctaLabel", { length: 120 }).notNull(),
  ctaTarget: varchar("ctaTarget", { length: 240 }).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  isPublished: boolean("isPublished").default(true).notNull(),
  ...contentTimestamps
});
var journalEntries = mysqlTable("journal_entries", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 260 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  dateLabel: varchar("dateLabel", { length: 120 }).notNull(),
  body: text("body"),
  sortOrder: int("sortOrder").default(0).notNull(),
  isPublished: boolean("isPublished").default(true).notNull(),
  ...contentTimestamps
});
var mediaAssets = mysqlTable("media_assets", {
  id: int("id").autoincrement().primaryKey(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  storageKey: text("storageKey").notNull(),
  url: text("url").notNull(),
  altText: varchar("altText", { length: 320 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var inquiries = mysqlTable("inquiries", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 180 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  brief: text("brief").notNull(),
  status: mysqlEnum("status", ["new", "read", "replied", "archived"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});

// server/_core/cookies.ts
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getSessionCookieOptions(req) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req)
  };
}

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/notification.ts
import { TRPCError } from "@trpc/server";

// server/_core/env.ts
var ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? ""
};

// server/_core/notification.ts
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/db.ts
import { asc, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
var database = null;
var seedPromise = null;
var asset = {
  hero: "/manus-storage/kasha-hero_1ba6a444.jpg",
  culture: "/manus-storage/kasha-culture_d54ac47e.jpg",
  audio: "/manus-storage/kasha-audio_bdbb9064.jpg",
  event: "/manus-storage/kasha-event_aa68d261.jpg"
};
var defaultSettings = {
  id: 1,
  siteName: "Kasha",
  brandLine: "Multimedia",
  heroEyebrow: "On air / Addis Ababa",
  heroTitle: "Stories with a pulse.",
  heroAccent: "Places with a memory.",
  heroIntro: "Kasha Multimedia connects radio, documentary, culture, and events to make room for the voices that move Ethiopia forward.",
  heroCtaLabel: "Find your frequency",
  heroImageUrl: asset.hero,
  heroAsideTitle: "Every Sunday for two hours.",
  heroAsideBody: "A live conversation with the country's stories, ideas, and inherited ways of knowing.",
  heroFooterIndex: "01 / 06",
  heroFooterDescriptor: "Radio + online media + event promotion",
  tickerItems: "Broadcast|Documentary|Cultural memory|Open conversation|Events",
  aboutEyebrow: "A programme, a platform, a point of view",
  aboutRailLabel: "About the signal",
  aboutTitle: "We go closer to the country's",
  aboutAccent: "living archive.",
  aboutBody: "Kasha began as a weekly radio programme built to inform, teach, compare, and delight. Today, it is a multimedia practice for the stories that deserve a wider room: indigenous knowledge, cultural value, natural memory, and the people carrying all of it into tomorrow.",
  aboutQuote: "To understand where we are going, we listen for what the land and its people already know.",
  aboutImageUrl: asset.culture,
  aboutCaptionLeft: "Field recording / Addis Ababa",
  aboutCaptionRight: "03\xB0 28' N / 38\xB0 44' E",
  programsEyebrow: "A frequency for every kind of curiosity",
  programsRailLabel: "Programmes",
  programsTitle: "One signal.",
  programsAccent: "Many ways in.",
  programsSummary: "Ten programme ideas. One shared intention: entertain while making space for deeper thought, better questions, and the stories that rarely get the first microphone.",
  audioImageLabel: "Listen / 00:48",
  audioCaptionLabel: "Latest signal",
  servicesEyebrow: "From the first note to the full room",
  servicesRailLabel: "What we make",
  servicesTitle: "Built for stories",
  servicesAccent: "that travel.",
  servicesSummary: "Kasha brings an editorial eye and a production hand to every format. The medium changes; the care does not.",
  eventEyebrow: "A room for the next story",
  eventTitle: "Make the moment",
  eventAccent: "worth remembering.",
  eventBody: "From a cultural gathering to a public conversation, we help events find their voice before the doors open and keep it moving after the lights go down.",
  eventCtaLabel: "Talk event production",
  eventImageUrl: asset.event,
  eventImageLabel: "Event promotion / Open room",
  journalEyebrow: "Notes from the desk",
  journalRailLabel: "Journal / field notes",
  journalTitle: "Keep the signal",
  journalAccent: "in the room.",
  contactEyebrow: "Bring us the story",
  contactRailLabel: "Start a conversation",
  contactTitle: "What should",
  contactAccent: "we listen to?",
  contactBody: "Tell us what is on your mind, what you are building, or whose voice needs a better signal. We will take it from there.",
  contactEmail: "hello@kashamultimedia.et",
  contactLocation: "Addis Ababa, Ethiopia",
  instagramUrl: "https://instagram.com",
  youtubeUrl: "https://youtube.com",
  facebookUrl: "https://facebook.com",
  footerNavigateLabel: "Navigate",
  footerFollowLabel: "Follow the signal",
  footerBuiltLine: "Built in Addis Ababa / Made to travel"
};
async function getDb() {
  if (!database && process.env.DATABASE_URL) database = drizzle(process.env.DATABASE_URL);
  return database;
}
async function requireDb() {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  return db;
}
async function ensureContentSeeded() {
  if (seedPromise) return seedPromise;
  seedPromise = (async () => {
    const db = await requireDb();
    const existingSettings = await db.select({ id: siteSettings.id }).from(siteSettings).limit(1);
    if (!existingSettings.length) await db.insert(siteSettings).values(defaultSettings);
    const existingPrograms = await db.select({ id: programs.id }).from(programs).limit(1);
    if (!existingPrograms.length) await db.insert(programs).values([
      { title: "Yisatefu", subtitle: "Participate", description: "A question-led hour that makes room for the whole room.", tag: "Interactive radio", imageUrl: asset.audio, featureTitle: "How does a place become a memory?", featureSubtitle: "Minat Gujo / Episode 04", sortOrder: 1 },
      { title: "Zikre Bahil", subtitle: "Cultural memory", description: "People, practices, and places remembered in their own register.", tag: "Field notes", imageUrl: asset.culture, sortOrder: 2 },
      { title: "Enchewawe", subtitle: "Let's talk", description: "A lively conversation around what shaped yesterday and what comes next.", tag: "Conversation", sortOrder: 3 },
      { title: "Minat Gujo", subtitle: "A journey of imagination", description: "Research-led stories that take a closer look at Ethiopia's hidden rooms.", tag: "Documentary", sortOrder: 4 }
    ]);
    const existingServices = await db.select({ id: services.id }).from(services).limit(1);
    if (!existingServices.length) await db.insert(services).values([
      { title: "Radio + online production", description: "From a clear editorial premise to a broadcast-ready series, we shape stories for ears, screens, and shared time.", iconKey: "mic", sortOrder: 1 },
      { title: "Documentary fieldwork", description: "We record living knowledge with curiosity, research, and respect for the people who carry it forward.", iconKey: "camera", sortOrder: 2 },
      { title: "Event promotion", description: "We turn a gathering into a considered public moment: concept, story, audience, and the details in between.", iconKey: "calendar", sortOrder: 3 },
      { title: "Broadcast partnerships", description: "Flexible collaboration for stations, institutions, and teams that want a sharper cultural signal.", iconKey: "radio", sortOrder: 4 }
    ]);
    const existingEvents = await db.select({ id: events.id }).from(events).limit(1);
    if (!existingEvents.length) await db.insert(events).values({ title: "Make the moment worth remembering.", description: defaultSettings.eventBody, imageUrl: asset.event, ctaLabel: defaultSettings.eventCtaLabel, ctaTarget: "#contact", sortOrder: 1 });
    const existingJournal = await db.select({ id: journalEntries.id }).from(journalEntries).limit(1);
    if (!existingJournal.length) await db.insert(journalEntries).values([
      { title: "The knowledge that grows beside the forest", category: "Conversation", dateLabel: "Field note / 07", sortOrder: 1 },
      { title: "When a place becomes a story you can hear", category: "Audio essay", dateLabel: "Programme / 04", sortOrder: 2 },
      { title: "Making space for many ways of knowing", category: "Event", dateLabel: "Open room / 02", sortOrder: 3 }
    ]);
  })();
  return seedPromise;
}
async function publicContent() {
  if (!ENV.databaseUrl) {
    return {
      settings: defaultSettings,
      programs: [],
      services: [],
      events: [],
      journalEntries: [
        { id: 1, title: "A celebration starts with a feeling", category: "Studio note", dateLabel: "Blue Decore / 01", body: null, sortOrder: 1, isPublished: true, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() },
        { id: 2, title: "The little details guests remember", category: "Ideas", dateLabel: "Blue Decore / 02", body: null, sortOrder: 2, isPublished: true, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() },
        { id: 3, title: "Making room for your people", category: "Planning", dateLabel: "Blue Decore / 03", body: null, sortOrder: 3, isPublished: true, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() }
      ]
    };
  }
  await ensureContentSeeded();
  const db = await requireDb();
  const [settings] = await db.select().from(siteSettings).limit(1);
  const [programRows, serviceRows, eventRows, journalRows] = await Promise.all([
    db.select().from(programs).where(eq(programs.isPublished, true)).orderBy(asc(programs.sortOrder)),
    db.select().from(services).where(eq(services.isPublished, true)).orderBy(asc(services.sortOrder)),
    db.select().from(events).where(eq(events.isPublished, true)).orderBy(asc(events.sortOrder)),
    db.select().from(journalEntries).where(eq(journalEntries.isPublished, true)).orderBy(asc(journalEntries.sortOrder))
  ]);
  return { settings, programs: programRows, services: serviceRows, events: eventRows, journalEntries: journalRows };
}
async function dashboardSummary() {
  await ensureContentSeeded();
  const db = await requireDb();
  const [programRows, serviceRows, eventRows, journalRows, inquiryRows] = await Promise.all([
    db.select({ id: programs.id, isPublished: programs.isPublished }).from(programs),
    db.select({ id: services.id, isPublished: services.isPublished }).from(services),
    db.select({ id: events.id, isPublished: events.isPublished }).from(events),
    db.select({ id: journalEntries.id, isPublished: journalEntries.isPublished }).from(journalEntries),
    db.select({ id: inquiries.id, name: inquiries.name, email: inquiries.email, brief: inquiries.brief, status: inquiries.status, createdAt: inquiries.createdAt }).from(inquiries).orderBy(desc(inquiries.createdAt)).limit(5)
  ]);
  const withStats = (rows) => ({ total: rows.length, published: rows.filter((item) => item.isPublished).length, drafts: rows.filter((item) => !item.isPublished).length });
  return { programs: withStats(programRows), services: withStats(serviceRows), events: withStats(eventRows), journal: withStats(journalRows), recentInquiries: inquiryRows, newInquiries: inquiryRows.filter((entry) => entry.status === "new").length };
}

// server/googleDriveImages.ts
import { TRPCError as TRPCError3 } from "@trpc/server";
var driveIdPattern = /^[A-Za-z0-9_-]{10,}$/;
function parseGoogleDriveImageLink(value) {
  try {
    const source = new URL(value.trim());
    const isGoogleDrive = /(^|\.)drive\.google\.com$/.test(source.hostname) || /(^|\.)docs\.google\.com$/.test(source.hostname) || /(^|\.)driveusercontent\.google\.com$/.test(source.hostname);
    if (!isGoogleDrive) return null;
    const pathMatch = source.pathname.match(/\/(?:file|d)\/d\/([A-Za-z0-9_-]{10,})|\/file\/d\/([A-Za-z0-9_-]{10,})/);
    const fileId = source.searchParams.get("id") || pathMatch?.[1] || pathMatch?.[2];
    if (!fileId || !driveIdPattern.test(fileId)) return null;
    return { fileId, url: `https://drive.google.com/uc?export=view&id=${encodeURIComponent(fileId)}` };
  } catch {
    return null;
  }
}
async function verifyGoogleDriveImagePublic(driveImage) {
  let response;
  try {
    response = await fetch(driveImage.url, { redirect: "follow", signal: AbortSignal.timeout(1e4) });
  } catch {
    throw new TRPCError3({ code: "BAD_REQUEST", message: "Kasha could not reach this Google Drive image. Check the sharing link and try again." });
  }
  const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
  if (!response.ok || !contentType.startsWith("image/")) {
    throw new TRPCError3({
      code: "BAD_REQUEST",
      message: "This Google Drive file is not publicly available as an image. In Google Drive, set General access to Anyone with the link, then copy the sharing link again."
    });
  }
  return driveImage;
}
async function normalizeImageSource(value) {
  const legacySource = value.startsWith("/manus-storage/") || value.startsWith("https://manus-storage/");
  if (legacySource) return value;
  const driveImage = parseGoogleDriveImageLink(value);
  if (driveImage) return (await verifyGoogleDriveImagePublic(driveImage)).url;
  throw new TRPCError3({
    code: "BAD_REQUEST",
    message: "Use a Google Drive sharing link for this image. Set General access to Anyone with the link before saving."
  });
}
async function requireGoogleDriveImage(value) {
  const driveImage = parseGoogleDriveImageLink(value);
  if (driveImage) return verifyGoogleDriveImagePublic(driveImage);
  throw new TRPCError3({
    code: "BAD_REQUEST",
    message: "Enter a valid Google Drive sharing link. Set General access to Anyone with the link before saving."
  });
}

// server/routers.ts
var idInput = z2.object({ id: z2.number().int().positive() });
var publishedInput = z2.object({ id: z2.number().int().positive(), isPublished: z2.boolean() });
var orderInput = z2.object({ id: z2.number().int().positive(), sortOrder: z2.number().int().min(0) });
var optionalUrl = z2.string().url().or(z2.literal(""));
var settingsInput = z2.object({
  siteName: z2.string().min(1).max(160),
  brandLine: z2.string().min(1).max(160),
  heroEyebrow: z2.string().min(1).max(220),
  heroTitle: z2.string().min(1).max(240),
  heroAccent: z2.string().min(1).max(240),
  heroIntro: z2.string().min(1),
  heroCtaLabel: z2.string().min(1).max(120),
  heroImageUrl: z2.string().min(1),
  heroAsideTitle: z2.string().min(1).max(240),
  heroAsideBody: z2.string().min(1),
  heroFooterIndex: z2.string().min(1).max(80),
  heroFooterDescriptor: z2.string().min(1).max(240),
  tickerItems: z2.string().min(1),
  aboutRailLabel: z2.string().min(1).max(160),
  aboutEyebrow: z2.string().min(1).max(220),
  aboutTitle: z2.string().min(1).max(240),
  aboutAccent: z2.string().min(1).max(240),
  aboutBody: z2.string().min(1),
  aboutQuote: z2.string().min(1),
  aboutImageUrl: z2.string().min(1),
  aboutCaptionLeft: z2.string().min(1).max(240),
  aboutCaptionRight: z2.string().min(1).max(240),
  programsRailLabel: z2.string().min(1).max(160),
  programsEyebrow: z2.string().min(1).max(220),
  programsTitle: z2.string().min(1).max(240),
  programsAccent: z2.string().min(1).max(240),
  programsSummary: z2.string().min(1),
  audioImageLabel: z2.string().min(1).max(160),
  audioCaptionLabel: z2.string().min(1).max(160),
  servicesRailLabel: z2.string().min(1).max(160),
  servicesEyebrow: z2.string().min(1).max(220),
  servicesTitle: z2.string().min(1).max(240),
  servicesAccent: z2.string().min(1).max(240),
  servicesSummary: z2.string().min(1),
  eventEyebrow: z2.string().min(1).max(220),
  eventTitle: z2.string().min(1).max(240),
  eventAccent: z2.string().min(1).max(240),
  eventBody: z2.string().min(1),
  eventCtaLabel: z2.string().min(1).max(120),
  eventImageUrl: z2.string().min(1),
  eventImageLabel: z2.string().min(1).max(200),
  journalRailLabel: z2.string().min(1).max(160),
  journalEyebrow: z2.string().min(1).max(220),
  journalTitle: z2.string().min(1).max(240),
  journalAccent: z2.string().min(1).max(240),
  contactRailLabel: z2.string().min(1).max(160),
  contactEyebrow: z2.string().min(1).max(220),
  contactTitle: z2.string().min(1).max(240),
  contactAccent: z2.string().min(1).max(240),
  contactBody: z2.string().min(1),
  contactEmail: z2.string().email(),
  contactLocation: z2.string().min(1).max(320),
  footerNavigateLabel: z2.string().min(1).max(120),
  footerFollowLabel: z2.string().min(1).max(160),
  footerBuiltLine: z2.string().min(1).max(240),
  instagramUrl: optionalUrl,
  youtubeUrl: optionalUrl,
  facebookUrl: optionalUrl
});
var programInput = z2.object({ title: z2.string().min(1).max(180), subtitle: z2.string().min(1).max(180), description: z2.string().min(1), tag: z2.string().min(1).max(120), imageUrl: z2.string().nullable().optional(), featureTitle: z2.string().nullable().optional(), featureSubtitle: z2.string().nullable().optional(), sortOrder: z2.number().int().min(0).default(0), isPublished: z2.boolean().default(true) });
var serviceInput = z2.object({ title: z2.string().min(1).max(180), description: z2.string().min(1), iconKey: z2.enum(["mic", "camera", "calendar", "radio", "sparkles", "film"]).default("mic"), sortOrder: z2.number().int().min(0).default(0), isPublished: z2.boolean().default(true) });
var eventInput = z2.object({ title: z2.string().min(1).max(220), description: z2.string().min(1), imageUrl: z2.string().min(1), ctaLabel: z2.string().min(1).max(120), ctaTarget: z2.string().min(1).max(240), sortOrder: z2.number().int().min(0).default(0), isPublished: z2.boolean().default(true) });
var journalInput = z2.object({ title: z2.string().min(1).max(260), category: z2.string().min(1).max(100), dateLabel: z2.string().min(1).max(120), body: z2.string().nullable().optional(), sortOrder: z2.number().int().min(0).default(0), isPublished: z2.boolean().default(true) });
function createCrudRouter(table, input) {
  return router({
    list: adminProcedure.query(async () => {
      await ensureContentSeeded();
      const db = await requireDb();
      return db.select().from(table).orderBy(asc2(table.sortOrder));
    }),
    create: adminProcedure.input(input).mutation(async ({ input: rawValues }) => {
      const values = rawValues;
      const imageUrl = typeof values.imageUrl === "string" && values.imageUrl ? await normalizeImageSource(values.imageUrl) : values.imageUrl;
      const db = await requireDb();
      const [result] = await db.insert(table).values({ ...values, imageUrl }).$returningId();
      return { id: result.id };
    }),
    update: adminProcedure.input(idInput.merge(input.partial())).mutation(async ({ input: rawValues }) => {
      const values = rawValues;
      const { id, ...updates } = values;
      const imageUrl = typeof updates.imageUrl === "string" && updates.imageUrl ? await normalizeImageSource(updates.imageUrl) : updates.imageUrl;
      const db = await requireDb();
      await db.update(table).set({ ...updates, imageUrl }).where(eq2(table.id, id));
      return { success: true };
    }),
    setPublished: adminProcedure.input(publishedInput).mutation(async ({ input: input2 }) => {
      const db = await requireDb();
      await db.update(table).set({ isPublished: input2.isPublished }).where(eq2(table.id, input2.id));
      return { success: true };
    }),
    setOrder: adminProcedure.input(orderInput).mutation(async ({ input: input2 }) => {
      const db = await requireDb();
      await db.update(table).set({ sortOrder: input2.sortOrder }).where(eq2(table.id, input2.id));
      return { success: true };
    }),
    remove: adminProcedure.input(idInput).mutation(async ({ input: input2 }) => {
      const db = await requireDb();
      await db.delete(table).where(eq2(table.id, input2.id));
      return { success: true };
    })
  });
}
var appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      ctx.res.clearCookie(COOKIE_NAME, { ...getSessionCookieOptions(ctx.req), maxAge: -1 });
      return { success: true };
    })
  }),
  public: router({
    homepage: publicProcedure.query(() => publicContent()),
    submitInquiry: publicProcedure.input(z2.object({ name: z2.string().min(2).max(180), email: z2.string().email(), brief: z2.string().min(8).max(4e3) })).mutation(async ({ input }) => {
      const db = await requireDb();
      const [result] = await db.insert(inquiries).values(input).$returningId();
      return { id: result.id, success: true };
    })
  }),
  admin: router({
    dashboard: adminProcedure.query(() => dashboardSummary()),
    settings: router({
      get: adminProcedure.query(async () => {
        await ensureContentSeeded();
        const db = await requireDb();
        const [settings] = await db.select().from(siteSettings).limit(1);
        return settings;
      }),
      update: adminProcedure.input(settingsInput).mutation(async ({ input }) => {
        const db = await requireDb();
        await db.update(siteSettings).set({ ...input, heroImageUrl: await normalizeImageSource(input.heroImageUrl), aboutImageUrl: await normalizeImageSource(input.aboutImageUrl), eventImageUrl: await normalizeImageSource(input.eventImageUrl) }).where(eq2(siteSettings.id, 1));
        return { success: true };
      })
    }),
    programs: createCrudRouter(programs, programInput),
    services: createCrudRouter(services, serviceInput),
    events: createCrudRouter(events, eventInput),
    journal: createCrudRouter(journalEntries, journalInput),
    inquiries: router({
      list: adminProcedure.query(async () => {
        const db = await requireDb();
        return db.select().from(inquiries).orderBy(desc2(inquiries.createdAt));
      }),
      updateStatus: adminProcedure.input(z2.object({ id: z2.number().int().positive(), status: z2.enum(["new", "read", "replied", "archived"]) })).mutation(async ({ input }) => {
        const db = await requireDb();
        await db.update(inquiries).set({ status: input.status }).where(eq2(inquiries.id, input.id));
        return { success: true };
      }),
      remove: adminProcedure.input(idInput).mutation(async ({ input }) => {
        const db = await requireDb();
        await db.delete(inquiries).where(eq2(inquiries.id, input.id));
        return { success: true };
      })
    }),
    media: router({
      list: adminProcedure.query(async () => {
        const db = await requireDb();
        return db.select().from(mediaAssets).orderBy(desc2(mediaAssets.createdAt));
      }),
      connectDrive: adminProcedure.input(z2.object({ fileName: z2.string().min(1).max(255), altText: z2.string().min(1).max(320), category: z2.string().min(1).max(100), driveLink: z2.string().url() })).mutation(async ({ input }) => {
        const driveImage = await requireGoogleDriveImage(input.driveLink);
        const db = await requireDb();
        const [result] = await db.insert(mediaAssets).values({ fileName: input.fileName, storageKey: `google-drive:${driveImage.fileId}`, url: driveImage.url, altText: input.altText, category: input.category }).$returningId();
        return { id: result.id, ...driveImage };
      }),
      remove: adminProcedure.input(idInput).mutation(async ({ input }) => {
        const db = await requireDb();
        await db.delete(mediaAssets).where(eq2(mediaAssets.id, input.id));
        return { success: true };
      })
    })
  })
});

// api/trpc/[...path].ts
var app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(
  createExpressMiddleware({
    router: appRouter,
    createContext: async ({ req, res }) => ({
      req,
      res,
      user: null
    })
  })
);
var path_default = app;
export {
  path_default as default
};
