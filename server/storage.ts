import { 
  users, type User, type InsertUser, 
  programs, type Program, type InsertProgram,
  classes, type Class, type InsertClass,
  sections, type Section, type InsertSection,
  faculty, type Faculty, type InsertFaculty,
  subjects, type Subject, type InsertSubject,
  facultySubjects, type FacultySubject, type InsertFacultySubject,
  students, type Student, type InsertStudent,
  attendance, type Attendance, type InsertAttendance,
  feeStructures, type FeeStructure, type InsertFeeStructure,
  fees, type Fee, type InsertFee,
  exams, type Exam, type InsertExam,
  results, type Result, type InsertResult,
  timetable, type Timetable, type InsertTimetable,
  announcements, type Announcement, type InsertAnnouncement
} from "@shared/schema";
import { db } from "./db";
import { eq, and, like, desc, sql } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";

const PostgresSessionStore = connectPg(session);

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined>;
  
  // Program management
  getPrograms(): Promise<Program[]>;
  getProgramById(id: number): Promise<Program | undefined>;
  createProgram(program: InsertProgram): Promise<Program>;
  updateProgram(id: number, data: Partial<InsertProgram>): Promise<Program | undefined>;
  deleteProgram(id: number): Promise<boolean>;
  
  // Class management
  getClasses(programId?: number): Promise<Class[]>;
  getClassById(id: number): Promise<Class | undefined>;
  createClass(classData: InsertClass): Promise<Class>;
  updateClass(id: number, data: Partial<InsertClass>): Promise<Class | undefined>;
  deleteClass(id: number): Promise<boolean>;
  
  // Section management
  getSections(classId?: number): Promise<Section[]>;
  getSectionById(id: number): Promise<Section | undefined>;
  createSection(section: InsertSection): Promise<Section>;
  updateSection(id: number, data: Partial<InsertSection>): Promise<Section | undefined>;
  deleteSection(id: number): Promise<boolean>;
  
  // Faculty management
  getFaculty(userId?: number): Promise<Faculty[]>;
  getFacultyById(id: number): Promise<Faculty | undefined>;
  createFaculty(faculty: InsertFaculty): Promise<Faculty>;
  updateFaculty(id: number, data: Partial<InsertFaculty>): Promise<Faculty | undefined>;
  deleteFaculty(id: number): Promise<boolean>;
  
  // Subject management
  getSubjects(): Promise<Subject[]>;
  getSubjectById(id: number): Promise<Subject | undefined>;
  createSubject(subject: InsertSubject): Promise<Subject>;
  updateSubject(id: number, data: Partial<InsertSubject>): Promise<Subject | undefined>;
  deleteSubject(id: number): Promise<boolean>;
  
  // Faculty-Subject mapping
  assignSubjectToFaculty(facultySubject: InsertFacultySubject): Promise<FacultySubject>;
  getFacultySubjects(facultyId?: number, subjectId?: number, sectionId?: number): Promise<FacultySubject[]>;
  removeFacultySubject(id: number): Promise<boolean>;
  
  // Student management
  getStudents(query?: { programId?: number, sectionId?: number, search?: string }): Promise<Student[]>;
  getStudentById(id: number): Promise<Student | undefined>;
  createStudent(student: InsertStudent): Promise<Student>;
  updateStudent(id: number, data: Partial<InsertStudent>): Promise<Student | undefined>;
  deleteStudent(id: number): Promise<boolean>;
  
  // Attendance management
  recordAttendance(attendance: InsertAttendance): Promise<Attendance>;
  getAttendance(query: { studentId?: number, facultyId?: number, subjectId?: number, date?: Date }): Promise<Attendance[]>;
  updateAttendance(id: number, data: Partial<InsertAttendance>): Promise<Attendance | undefined>;
  
  // Fee management
  createFeeStructure(feeStructure: InsertFeeStructure): Promise<FeeStructure>;
  getFeeStructures(programId?: number, classId?: number): Promise<FeeStructure[]>;
  
  createFee(fee: InsertFee): Promise<Fee>;
  getFees(studentId?: number, status?: string): Promise<Fee[]>;
  updateFee(id: number, data: Partial<InsertFee>): Promise<Fee | undefined>;
  
  // Exam & Result management
  createExam(exam: InsertExam): Promise<Exam>;
  getExams(subjectId?: number): Promise<Exam[]>;
  
  recordResult(result: InsertResult): Promise<Result>;
  getResults(studentId?: number, examId?: number): Promise<Result[]>;
  
  // Timetable management
  createTimetableEntry(entry: InsertTimetable): Promise<Timetable>;
  getTimetable(sectionId?: number, facultyId?: number): Promise<Timetable[]>;
  updateTimetableEntry(id: number, data: Partial<InsertTimetable>): Promise<Timetable | undefined>;
  deleteTimetableEntry(id: number): Promise<boolean>;
  
  // Announcement management
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  getAnnouncements(targetRole?: string, programId?: number, isPinned?: boolean): Promise<Announcement[]>;
  updateAnnouncement(id: number, data: Partial<InsertAnnouncement>): Promise<Announcement | undefined>;
  deleteAnnouncement(id: number): Promise<boolean>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      conObject: { 
        connectionString: process.env.DATABASE_URL 
      }, 
      createTableIfMissing: true 
    });
  }

  // User Management
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Program Management
  async getPrograms(): Promise<Program[]> {
    return db.select().from(programs);
  }

  async getProgramById(id: number): Promise<Program | undefined> {
    const [program] = await db.select().from(programs).where(eq(programs.id, id));
    return program;
  }

  async createProgram(program: InsertProgram): Promise<Program> {
    const [newProgram] = await db
      .insert(programs)
      .values(program)
      .returning();
    return newProgram;
  }

  async updateProgram(id: number, data: Partial<InsertProgram>): Promise<Program | undefined> {
    const [program] = await db
      .update(programs)
      .set(data)
      .where(eq(programs.id, id))
      .returning();
    return program;
  }

  async deleteProgram(id: number): Promise<boolean> {
    const result = await db
      .delete(programs)
      .where(eq(programs.id, id))
      .returning({ id: programs.id });
    return result.length > 0;
  }

  // Class Management
  async getClasses(programId?: number): Promise<Class[]> {
    if (programId) {
      return db.select().from(classes).where(eq(classes.programId, programId));
    }
    return db.select().from(classes);
  }

  async getClassById(id: number): Promise<Class | undefined> {
    const [cls] = await db.select().from(classes).where(eq(classes.id, id));
    return cls;
  }

  async createClass(classData: InsertClass): Promise<Class> {
    const [newClass] = await db
      .insert(classes)
      .values(classData)
      .returning();
    return newClass;
  }

  async updateClass(id: number, data: Partial<InsertClass>): Promise<Class | undefined> {
    const [cls] = await db
      .update(classes)
      .set(data)
      .where(eq(classes.id, id))
      .returning();
    return cls;
  }

  async deleteClass(id: number): Promise<boolean> {
    const result = await db
      .delete(classes)
      .where(eq(classes.id, id))
      .returning({ id: classes.id });
    return result.length > 0;
  }

  // Section Management
  async getSections(classId?: number): Promise<Section[]> {
    if (classId) {
      return db.select().from(sections).where(eq(sections.classId, classId));
    }
    return db.select().from(sections);
  }

  async getSectionById(id: number): Promise<Section | undefined> {
    const [section] = await db.select().from(sections).where(eq(sections.id, id));
    return section;
  }

  async createSection(section: InsertSection): Promise<Section> {
    const [newSection] = await db
      .insert(sections)
      .values(section)
      .returning();
    return newSection;
  }

  async updateSection(id: number, data: Partial<InsertSection>): Promise<Section | undefined> {
    const [section] = await db
      .update(sections)
      .set(data)
      .where(eq(sections.id, id))
      .returning();
    return section;
  }

  async deleteSection(id: number): Promise<boolean> {
    const result = await db
      .delete(sections)
      .where(eq(sections.id, id))
      .returning({ id: sections.id });
    return result.length > 0;
  }

  // Faculty Management
  async getFaculty(userId?: number): Promise<Faculty[]> {
    if (userId) {
      return db.select().from(faculty).where(eq(faculty.userId, userId));
    }
    return db.select().from(faculty);
  }

  async getFacultyById(id: number): Promise<Faculty | undefined> {
    const [faculty_member] = await db.select().from(faculty).where(eq(faculty.id, id));
    return faculty_member;
  }

  async createFaculty(facultyData: InsertFaculty): Promise<Faculty> {
    const [newFaculty] = await db
      .insert(faculty)
      .values(facultyData)
      .returning();
    return newFaculty;
  }

  async updateFaculty(id: number, data: Partial<InsertFaculty>): Promise<Faculty | undefined> {
    const [faculty_member] = await db
      .update(faculty)
      .set(data)
      .where(eq(faculty.id, id))
      .returning();
    return faculty_member;
  }

  async deleteFaculty(id: number): Promise<boolean> {
    const result = await db
      .delete(faculty)
      .where(eq(faculty.id, id))
      .returning({ id: faculty.id });
    return result.length > 0;
  }

  // Subject Management
  async getSubjects(): Promise<Subject[]> {
    return db.select().from(subjects);
  }

  async getSubjectById(id: number): Promise<Subject | undefined> {
    const [subject] = await db.select().from(subjects).where(eq(subjects.id, id));
    return subject;
  }

  async createSubject(subject: InsertSubject): Promise<Subject> {
    const [newSubject] = await db
      .insert(subjects)
      .values(subject)
      .returning();
    return newSubject;
  }

  async updateSubject(id: number, data: Partial<InsertSubject>): Promise<Subject | undefined> {
    const [subject] = await db
      .update(subjects)
      .set(data)
      .where(eq(subjects.id, id))
      .returning();
    return subject;
  }

  async deleteSubject(id: number): Promise<boolean> {
    const result = await db
      .delete(subjects)
      .where(eq(subjects.id, id))
      .returning({ id: subjects.id });
    return result.length > 0;
  }

  // Faculty-Subject Mapping
  async assignSubjectToFaculty(facultySubject: InsertFacultySubject): Promise<FacultySubject> {
    const [newMapping] = await db
      .insert(facultySubjects)
      .values(facultySubject)
      .returning();
    return newMapping;
  }

  async getFacultySubjects(facultyId?: number, subjectId?: number, sectionId?: number): Promise<FacultySubject[]> {
    let query = db.select().from(facultySubjects);
    
    if (facultyId) {
      query = query.where(eq(facultySubjects.facultyId, facultyId));
    }
    
    if (subjectId) {
      query = query.where(eq(facultySubjects.subjectId, subjectId));
    }
    
    if (sectionId) {
      query = query.where(eq(facultySubjects.sectionId, sectionId));
    }
    
    return query;
  }

  async removeFacultySubject(id: number): Promise<boolean> {
    const result = await db
      .delete(facultySubjects)
      .where(eq(facultySubjects.id, id))
      .returning({ id: facultySubjects.id });
    return result.length > 0;
  }

  // Student Management
  async getStudents(query?: { programId?: number, sectionId?: number, search?: string }): Promise<Student[]> {
    let dbQuery = db.select().from(students);
    
    if (query?.programId) {
      dbQuery = dbQuery.where(eq(students.programId, query.programId));
    }
    
    if (query?.sectionId) {
      dbQuery = dbQuery.where(eq(students.sectionId, query.sectionId));
    }
    
    if (query?.search) {
      dbQuery = dbQuery.where(
        sql`(${students.fullName} ILIKE ${`%${query.search}%`} OR 
             ${students.enrollmentNo} ILIKE ${`%${query.search}%`} OR 
             ${students.registrationNo} ILIKE ${`%${query.search}%`})`
      );
    }
    
    return dbQuery;
  }

  async getStudentById(id: number): Promise<Student | undefined> {
    const [student] = await db.select().from(students).where(eq(students.id, id));
    return student;
  }

  async createStudent(student: InsertStudent): Promise<Student> {
    const [newStudent] = await db
      .insert(students)
      .values(student)
      .returning();
    return newStudent;
  }

  async updateStudent(id: number, data: Partial<InsertStudent>): Promise<Student | undefined> {
    const [student] = await db
      .update(students)
      .set(data)
      .where(eq(students.id, id))
      .returning();
    return student;
  }

  async deleteStudent(id: number): Promise<boolean> {
    const result = await db
      .delete(students)
      .where(eq(students.id, id))
      .returning({ id: students.id });
    return result.length > 0;
  }

  // Attendance Management
  async recordAttendance(attendanceData: InsertAttendance): Promise<Attendance> {
    const [newAttendance] = await db
      .insert(attendance)
      .values(attendanceData)
      .returning();
    return newAttendance;
  }

  async getAttendance(query: { studentId?: number, facultyId?: number, subjectId?: number, date?: Date }): Promise<Attendance[]> {
    let dbQuery = db.select().from(attendance);
    
    if (query.studentId) {
      dbQuery = dbQuery.where(eq(attendance.studentId, query.studentId));
    }
    
    if (query.facultyId) {
      dbQuery = dbQuery.where(eq(attendance.facultyId, query.facultyId));
    }
    
    if (query.subjectId && query.subjectId > 0) {
      dbQuery = dbQuery.where(eq(attendance.subjectId, query.subjectId));
    }
    
    if (query.date) {
      dbQuery = dbQuery.where(eq(attendance.date, query.date));
    }
    
    return dbQuery;
  }

  async updateAttendance(id: number, data: Partial<InsertAttendance>): Promise<Attendance | undefined> {
    const [attendanceRecord] = await db
      .update(attendance)
      .set(data)
      .where(eq(attendance.id, id))
      .returning();
    return attendanceRecord;
  }

  // Fee Management
  async createFeeStructure(feeStructure: InsertFeeStructure): Promise<FeeStructure> {
    const [newFeeStructure] = await db
      .insert(feeStructures)
      .values(feeStructure)
      .returning();
    return newFeeStructure;
  }

  async getFeeStructures(programId?: number, classId?: number): Promise<FeeStructure[]> {
    let query = db.select().from(feeStructures);
    
    if (programId) {
      query = query.where(eq(feeStructures.programId, programId));
    }
    
    if (classId) {
      query = query.where(eq(feeStructures.classId, classId));
    }
    
    return query;
  }

  async createFee(fee: InsertFee): Promise<Fee> {
    const [newFee] = await db
      .insert(fees)
      .values(fee)
      .returning();
    return newFee;
  }

  async getFees(studentId?: number, status?: string): Promise<Fee[]> {
    let query = db.select().from(fees);
    
    if (studentId) {
      query = query.where(eq(fees.studentId, studentId));
    }
    
    if (status) {
      query = query.where(eq(fees.status, status));
    }
    
    return query;
  }

  async updateFee(id: number, data: Partial<InsertFee>): Promise<Fee | undefined> {
    const [fee] = await db
      .update(fees)
      .set(data)
      .where(eq(fees.id, id))
      .returning();
    return fee;
  }

  // Exam & Result Management
  async createExam(exam: InsertExam): Promise<Exam> {
    const [newExam] = await db
      .insert(exams)
      .values(exam)
      .returning();
    return newExam;
  }

  async getExams(subjectId?: number): Promise<Exam[]> {
    if (subjectId) {
      return db.select().from(exams).where(eq(exams.subjectId, subjectId));
    }
    return db.select().from(exams);
  }

  async recordResult(result: InsertResult): Promise<Result> {
    const [newResult] = await db
      .insert(results)
      .values(result)
      .returning();
    return newResult;
  }

  async getResults(studentId?: number, examId?: number): Promise<Result[]> {
    let query = db.select().from(results);
    
    if (studentId) {
      query = query.where(eq(results.studentId, studentId));
    }
    
    if (examId) {
      query = query.where(eq(results.examId, examId));
    }
    
    return query;
  }

  // Timetable Management
  async createTimetableEntry(entry: InsertTimetable): Promise<Timetable> {
    const [newEntry] = await db
      .insert(timetable)
      .values(entry)
      .returning();
    return newEntry;
  }

  async getTimetable(sectionId?: number, facultyId?: number): Promise<Timetable[]> {
    let query = db.select().from(timetable);
    
    if (sectionId) {
      query = query.where(eq(timetable.sectionId, sectionId));
    }
    
    if (facultyId) {
      query = query.where(eq(timetable.facultyId, facultyId));
    }
    
    return query;
  }

  async updateTimetableEntry(id: number, data: Partial<InsertTimetable>): Promise<Timetable | undefined> {
    const [entry] = await db
      .update(timetable)
      .set(data)
      .where(eq(timetable.id, id))
      .returning();
    return entry;
  }

  async deleteTimetableEntry(id: number): Promise<boolean> {
    const result = await db
      .delete(timetable)
      .where(eq(timetable.id, id))
      .returning({ id: timetable.id });
    return result.length > 0;
  }

  // Announcement Management
  async createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement> {
    const [newAnnouncement] = await db
      .insert(announcements)
      .values(announcement)
      .returning();
    return newAnnouncement;
  }

  async getAnnouncements(targetRole?: string, programId?: number, isPinned?: boolean): Promise<Announcement[]> {
    let query = db.select().from(announcements);
    
    if (targetRole) {
      query = query.where(eq(announcements.targetRole, targetRole));
    }
    
    if (programId) {
      query = query.where(eq(announcements.programId, programId));
    }
    
    if (isPinned !== undefined) {
      query = query.where(eq(announcements.isPinned, isPinned));
    }
    
    return query.orderBy(desc(announcements.createdAt));
  }

  async updateAnnouncement(id: number, data: Partial<InsertAnnouncement>): Promise<Announcement | undefined> {
    const [announcement] = await db
      .update(announcements)
      .set(data)
      .where(eq(announcements.id, id))
      .returning();
    return announcement;
  }

  async deleteAnnouncement(id: number): Promise<boolean> {
    const result = await db
      .delete(announcements)
      .where(eq(announcements.id, id))
      .returning({ id: announcements.id });
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
