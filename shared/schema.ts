import { pgTable, text, serial, integer, boolean, timestamp, date, pgEnum, varchar, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Role-based access control
export const userRoleEnum = pgEnum('user_role', ['admin', 'faculty', 'accountant']);

// User Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  fullName: text("full_name").notNull(),
  role: userRoleEnum("role").notNull().default('admin'),
  profileImage: text("profile_image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  faculty: one(faculty, {
    fields: [users.id],
    references: [faculty.userId],
  }),
}));

// Programs/Departments
export const programs = pgTable("programs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const programsRelations = relations(programs, ({ many }) => ({
  classes: many(classes),
  students: many(students),
}));

// Classes (Years)
export const classes = pgTable("classes", {
  id: serial("id").primaryKey(),
  programId: integer("program_id").notNull().references(() => programs.id),
  year: integer("year").notNull(), // 1st, 2nd, 3rd year
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const classesRelations = relations(classes, ({ one, many }) => ({
  program: one(programs, {
    fields: [classes.programId],
    references: [programs.id],
  }),
  sections: many(sections),
}));

// Sections
export const sections = pgTable("sections", {
  id: serial("id").primaryKey(),
  classId: integer("class_id").notNull().references(() => classes.id),
  name: text("name").notNull(), // A, B, C, D, E
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sectionsRelations = relations(sections, ({ one, many }) => ({
  class: one(classes, {
    fields: [sections.classId],
    references: [classes.id],
  }),
  students: many(students),
}));

// Faculty
export const faculty = pgTable("faculty", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").unique().references(() => users.id),
  cnic: text("cnic").notNull(),
  contactNumber: text("contact_number").notNull(),
  qualifications: text("qualifications").notNull(),
  designation: text("designation").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const facultyRelations = relations(faculty, ({ one, many }) => ({
  user: one(users, {
    fields: [faculty.userId],
    references: [users.id],
  }),
  subjects: many(facultySubjects),
  attendance: many(attendance),
}));

// Subjects
export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const subjectsRelations = relations(subjects, ({ many }) => ({
  faculty: many(facultySubjects),
  attendance: many(attendance),
  exams: many(exams),
}));

// Faculty-Subject Mapping
export const facultySubjects = pgTable("faculty_subjects", {
  id: serial("id").primaryKey(),
  facultyId: integer("faculty_id").notNull().references(() => faculty.id),
  subjectId: integer("subject_id").notNull().references(() => subjects.id),
  sectionId: integer("section_id").notNull().references(() => sections.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const facultySubjectsRelations = relations(facultySubjects, ({ one }) => ({
  faculty: one(faculty, {
    fields: [facultySubjects.facultyId],
    references: [faculty.id],
  }),
  subject: one(subjects, {
    fields: [facultySubjects.subjectId],
    references: [subjects.id],
  }),
  section: one(sections, {
    fields: [facultySubjects.sectionId],
    references: [sections.id],
  }),
}));

// Students
export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  fatherName: text("father_name").notNull(),
  cnic: text("cnic").notNull(),
  address: text("address").notNull(),
  contactNumber: text("contact_number").notNull(),
  emergencyContact: text("emergency_contact").notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
  gender: text("gender").notNull(),
  enrollmentNo: text("enrollment_no").notNull().unique(),
  registrationNo: text("registration_no").notNull().unique(),
  programId: integer("program_id").notNull().references(() => programs.id),
  sectionId: integer("section_id").notNull().references(() => sections.id),
  admissionDate: date("admission_date").notNull(),
  status: text("status").notNull().default('active'), // active, inactive, graduated, etc.
  profileImage: text("profile_image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const studentsRelations = relations(students, ({ one, many }) => ({
  program: one(programs, {
    fields: [students.programId],
    references: [programs.id],
  }),
  section: one(sections, {
    fields: [students.sectionId],
    references: [sections.id],
  }),
  attendance: many(attendance),
  fees: many(fees),
  results: many(results),
}));

// Attendance
export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => students.id),
  facultyId: integer("faculty_id").notNull().references(() => faculty.id),
  subjectId: integer("subject_id").references(() => subjects.id),
  date: date("date").notNull(),
  status: text("status").notNull(), // present, absent, leave, etc.
  remarks: text("remarks"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const attendanceRelations = relations(attendance, ({ one }) => ({
  student: one(students, {
    fields: [attendance.studentId],
    references: [students.id],
  }),
  faculty: one(faculty, {
    fields: [attendance.facultyId],
    references: [faculty.id],
  }),
  subject: one(subjects, {
    fields: [attendance.subjectId],
    references: [subjects.id],
  }),
}));

// Fee Structure
export const feeStructures = pgTable("fee_structures", {
  id: serial("id").primaryKey(),
  programId: integer("program_id").notNull().references(() => programs.id),
  classId: integer("class_id").notNull().references(() => classes.id),
  amount: numeric("amount").notNull(),
  frequency: text("frequency").notNull(), // monthly, quarterly, bi-annual, annual
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const feeStructuresRelations = relations(feeStructures, ({ one, many }) => ({
  program: one(programs, {
    fields: [feeStructures.programId],
    references: [programs.id],
  }),
  class: one(classes, {
    fields: [feeStructures.classId],
    references: [classes.id],
  }),
  fees: many(fees),
}));

// Fee Challans
export const fees = pgTable("fees", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => students.id),
  feeStructureId: integer("fee_structure_id").notNull().references(() => feeStructures.id),
  challanId: text("challan_id").notNull().unique(),
  amount: numeric("amount").notNull(),
  dueDate: date("due_date").notNull(),
  paidAmount: numeric("paid_amount").default('0'),
  status: text("status").notNull(), // paid, unpaid, partially paid, overdue
  paymentDate: date("payment_date"),
  discount: numeric("discount").default('0'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const feesRelations = relations(fees, ({ one }) => ({
  student: one(students, {
    fields: [fees.studentId],
    references: [students.id],
  }),
  feeStructure: one(feeStructures, {
    fields: [fees.feeStructureId],
    references: [feeStructures.id],
  }),
}));

// Exams
export const exams = pgTable("exams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  subjectId: integer("subject_id").notNull().references(() => subjects.id),
  totalMarks: integer("total_marks").notNull(),
  examDate: date("exam_date").notNull(),
  academicTerm: text("academic_term").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const examsRelations = relations(exams, ({ one, many }) => ({
  subject: one(subjects, {
    fields: [exams.subjectId],
    references: [subjects.id],
  }),
  results: many(results),
}));

// Results
export const results = pgTable("results", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => students.id),
  examId: integer("exam_id").notNull().references(() => exams.id),
  marksObtained: numeric("marks_obtained").notNull(),
  percentage: numeric("percentage").notNull(),
  grade: text("grade").notNull(),
  remarks: text("remarks"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const resultsRelations = relations(results, ({ one }) => ({
  student: one(students, {
    fields: [results.studentId],
    references: [students.id],
  }),
  exam: one(exams, {
    fields: [results.examId],
    references: [exams.id],
  }),
}));

// Timetable
export const timetable = pgTable("timetable", {
  id: serial("id").primaryKey(),
  sectionId: integer("section_id").notNull().references(() => sections.id),
  facultyId: integer("faculty_id").notNull().references(() => faculty.id),
  subjectId: integer("subject_id").notNull().references(() => subjects.id),
  day: text("day").notNull(), // monday, tuesday, etc.
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const timetableRelations = relations(timetable, ({ one }) => ({
  section: one(sections, {
    fields: [timetable.sectionId],
    references: [sections.id],
  }),
  faculty: one(faculty, {
    fields: [timetable.facultyId],
    references: [faculty.id],
  }),
  subject: one(subjects, {
    fields: [timetable.subjectId],
    references: [subjects.id],
  }),
}));

// Announcements
export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  userId: integer("user_id").notNull().references(() => users.id),
  targetRole: userRoleEnum("target_role"),
  programId: integer("program_id").references(() => programs.id),
  isPinned: boolean("is_pinned").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const announcementsRelations = relations(announcements, ({ one }) => ({
  user: one(users, {
    fields: [announcements.userId],
    references: [users.id],
  }),
  program: one(programs, {
    fields: [announcements.programId],
    references: [programs.id],
  }),
}));

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertProgramSchema = createInsertSchema(programs).omit({
  id: true,
  createdAt: true,
});

export const insertClassSchema = createInsertSchema(classes).omit({
  id: true,
  createdAt: true,
});

export const insertSectionSchema = createInsertSchema(sections).omit({
  id: true,
  createdAt: true,
});

export const insertFacultySchema = createInsertSchema(faculty).omit({
  id: true,
  createdAt: true,
});

export const insertSubjectSchema = createInsertSchema(subjects).omit({
  id: true,
  createdAt: true,
});

export const insertFacultySubjectSchema = createInsertSchema(facultySubjects).omit({
  id: true,
  createdAt: true,
});

export const insertStudentSchema = createInsertSchema(students).omit({
  id: true,
  createdAt: true,
});

export const insertAttendanceSchema = createInsertSchema(attendance).omit({
  id: true,
  createdAt: true,
});

export const insertFeeStructureSchema = createInsertSchema(feeStructures).omit({
  id: true,
  createdAt: true,
});

export const insertFeeSchema = createInsertSchema(fees).omit({
  id: true,
  createdAt: true,
});

export const insertExamSchema = createInsertSchema(exams).omit({
  id: true,
  createdAt: true,
});

export const insertResultSchema = createInsertSchema(results).omit({
  id: true,
  createdAt: true,
});

export const insertTimetableSchema = createInsertSchema(timetable).omit({
  id: true,
  createdAt: true,
});

export const insertAnnouncementSchema = createInsertSchema(announcements).omit({
  id: true,
  createdAt: true,
});

// Export Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Program = typeof programs.$inferSelect;
export type InsertProgram = z.infer<typeof insertProgramSchema>;

export type Class = typeof classes.$inferSelect;
export type InsertClass = z.infer<typeof insertClassSchema>;

export type Section = typeof sections.$inferSelect;
export type InsertSection = z.infer<typeof insertSectionSchema>;

export type Faculty = typeof faculty.$inferSelect;
export type InsertFaculty = z.infer<typeof insertFacultySchema>;

export type Subject = typeof subjects.$inferSelect;
export type InsertSubject = z.infer<typeof insertSubjectSchema>;

export type FacultySubject = typeof facultySubjects.$inferSelect;
export type InsertFacultySubject = z.infer<typeof insertFacultySubjectSchema>;

export type Student = typeof students.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;

export type Attendance = typeof attendance.$inferSelect;
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;

export type FeeStructure = typeof feeStructures.$inferSelect;
export type InsertFeeStructure = z.infer<typeof insertFeeStructureSchema>;

export type Fee = typeof fees.$inferSelect;
export type InsertFee = z.infer<typeof insertFeeSchema>;

export type Exam = typeof exams.$inferSelect;
export type InsertExam = z.infer<typeof insertExamSchema>;

export type Result = typeof results.$inferSelect;
export type InsertResult = z.infer<typeof insertResultSchema>;

export type Timetable = typeof timetable.$inferSelect;
export type InsertTimetable = z.infer<typeof insertTimetableSchema>;

export type Announcement = typeof announcements.$inferSelect;
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
