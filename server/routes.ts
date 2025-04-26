import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import {
  insertUserSchema,
  insertProgramSchema,
  insertClassSchema,
  insertSectionSchema,
  insertFacultySchema,
  insertSubjectSchema,
  insertFacultySubjectSchema,
  insertStudentSchema,
  insertAttendanceSchema,
  insertFeeStructureSchema,
  insertFeeSchema,
  insertExamSchema,
  insertResultSchema,
  insertTimetableSchema,
  insertAnnouncementSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Sets up /api/register, /api/login, /api/logout, /api/user
  setupAuth(app);

  // ======== Programs API ========
  app.get("/api/programs", async (req, res, next) => {
    try {
      const programs = await storage.getPrograms();
      res.json(programs);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/programs/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const program = await storage.getProgramById(id);
      
      if (!program) {
        return res.status(404).json({ message: "Program not found" });
      }
      
      res.json(program);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/programs", async (req, res, next) => {
    try {
      const programData = insertProgramSchema.parse(req.body);
      const program = await storage.createProgram(programData);
      res.status(201).json(program);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/programs/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const programData = insertProgramSchema.partial().parse(req.body);
      const program = await storage.updateProgram(id, programData);
      
      if (!program) {
        return res.status(404).json({ message: "Program not found" });
      }
      
      res.json(program);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/programs/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProgram(id);
      
      if (!success) {
        return res.status(404).json({ message: "Program not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });

  // ======== Classes API ========
  app.get("/api/classes", async (req, res, next) => {
    try {
      const programId = req.query.programId ? parseInt(req.query.programId as string) : undefined;
      const classes = await storage.getClasses(programId);
      res.json(classes);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/classes/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const cls = await storage.getClassById(id);
      
      if (!cls) {
        return res.status(404).json({ message: "Class not found" });
      }
      
      res.json(cls);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/classes", async (req, res, next) => {
    try {
      const classData = insertClassSchema.parse(req.body);
      const cls = await storage.createClass(classData);
      res.status(201).json(cls);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/classes/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const classData = insertClassSchema.partial().parse(req.body);
      const cls = await storage.updateClass(id, classData);
      
      if (!cls) {
        return res.status(404).json({ message: "Class not found" });
      }
      
      res.json(cls);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/classes/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteClass(id);
      
      if (!success) {
        return res.status(404).json({ message: "Class not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });

  // ======== Sections API ========
  app.get("/api/sections", async (req, res, next) => {
    try {
      const classId = req.query.classId ? parseInt(req.query.classId as string) : undefined;
      const sections = await storage.getSections(classId);
      res.json(sections);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/sections/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const section = await storage.getSectionById(id);
      
      if (!section) {
        return res.status(404).json({ message: "Section not found" });
      }
      
      res.json(section);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/sections", async (req, res, next) => {
    try {
      const sectionData = insertSectionSchema.parse(req.body);
      const section = await storage.createSection(sectionData);
      res.status(201).json(section);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/sections/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const sectionData = insertSectionSchema.partial().parse(req.body);
      const section = await storage.updateSection(id, sectionData);
      
      if (!section) {
        return res.status(404).json({ message: "Section not found" });
      }
      
      res.json(section);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/sections/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteSection(id);
      
      if (!success) {
        return res.status(404).json({ message: "Section not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });

  // ======== Faculty API ========
  app.get("/api/faculty", async (req, res, next) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      const faculty = await storage.getFaculty(userId);
      res.json(faculty);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/faculty/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const faculty = await storage.getFacultyById(id);
      
      if (!faculty) {
        return res.status(404).json({ message: "Faculty not found" });
      }
      
      res.json(faculty);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/faculty", async (req, res, next) => {
    try {
      const facultyData = insertFacultySchema.parse(req.body);
      const faculty = await storage.createFaculty(facultyData);
      res.status(201).json(faculty);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/faculty/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const facultyData = insertFacultySchema.partial().parse(req.body);
      const faculty = await storage.updateFaculty(id, facultyData);
      
      if (!faculty) {
        return res.status(404).json({ message: "Faculty not found" });
      }
      
      res.json(faculty);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/faculty/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteFaculty(id);
      
      if (!success) {
        return res.status(404).json({ message: "Faculty not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });

  // ======== Subjects API ========
  app.get("/api/subjects", async (req, res, next) => {
    try {
      const subjects = await storage.getSubjects();
      res.json(subjects);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/subjects/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const subject = await storage.getSubjectById(id);
      
      if (!subject) {
        return res.status(404).json({ message: "Subject not found" });
      }
      
      res.json(subject);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/subjects", async (req, res, next) => {
    try {
      const subjectData = insertSubjectSchema.parse(req.body);
      const subject = await storage.createSubject(subjectData);
      res.status(201).json(subject);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/subjects/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const subjectData = insertSubjectSchema.partial().parse(req.body);
      const subject = await storage.updateSubject(id, subjectData);
      
      if (!subject) {
        return res.status(404).json({ message: "Subject not found" });
      }
      
      res.json(subject);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/subjects/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteSubject(id);
      
      if (!success) {
        return res.status(404).json({ message: "Subject not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });

  // ======== Faculty-Subject API ========
  app.post("/api/faculty-subjects", async (req, res, next) => {
    try {
      const data = insertFacultySubjectSchema.parse(req.body);
      const assignment = await storage.assignSubjectToFaculty(data);
      res.status(201).json(assignment);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/faculty-subjects", async (req, res, next) => {
    try {
      const facultyId = req.query.facultyId ? parseInt(req.query.facultyId as string) : undefined;
      const subjectId = req.query.subjectId ? parseInt(req.query.subjectId as string) : undefined;
      const sectionId = req.query.sectionId ? parseInt(req.query.sectionId as string) : undefined;
      
      const assignments = await storage.getFacultySubjects(facultyId, subjectId, sectionId);
      res.json(assignments);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/faculty-subjects/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.removeFacultySubject(id);
      
      if (!success) {
        return res.status(404).json({ message: "Assignment not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });

  // ======== Students API ========
  app.get("/api/students", async (req, res, next) => {
    try {
      const programId = req.query.programId ? parseInt(req.query.programId as string) : undefined;
      const sectionId = req.query.sectionId ? parseInt(req.query.sectionId as string) : undefined;
      const search = req.query.search as string | undefined;
      
      const students = await storage.getStudents({ programId, sectionId, search });
      res.json(students);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/students/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const student = await storage.getStudentById(id);
      
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      
      res.json(student);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/students", async (req, res, next) => {
    try {
      const studentData = insertStudentSchema.parse(req.body);
      const student = await storage.createStudent(studentData);
      res.status(201).json(student);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/students/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const studentData = insertStudentSchema.partial().parse(req.body);
      const student = await storage.updateStudent(id, studentData);
      
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      
      res.json(student);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/students/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteStudent(id);
      
      if (!success) {
        return res.status(404).json({ message: "Student not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });

  // ======== Attendance API ========
  app.post("/api/attendance", async (req, res, next) => {
    try {
      const attendanceData = insertAttendanceSchema.parse(req.body);
      const attendance = await storage.recordAttendance(attendanceData);
      res.status(201).json(attendance);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/attendance", async (req, res, next) => {
    try {
      const studentId = req.query.studentId ? parseInt(req.query.studentId as string) : undefined;
      const facultyId = req.query.facultyId ? parseInt(req.query.facultyId as string) : undefined;
      const subjectId = req.query.subjectId ? parseInt(req.query.subjectId as string) : undefined;
      const date = req.query.date ? new Date(req.query.date as string) : undefined;
      
      const attendanceRecords = await storage.getAttendance({ studentId, facultyId, subjectId, date });
      res.json(attendanceRecords);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/attendance/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const attendanceData = insertAttendanceSchema.partial().parse(req.body);
      const attendance = await storage.updateAttendance(id, attendanceData);
      
      if (!attendance) {
        return res.status(404).json({ message: "Attendance record not found" });
      }
      
      res.json(attendance);
    } catch (error) {
      next(error);
    }
  });

  // ======== Fee Structure API ========
  app.post("/api/fee-structures", async (req, res, next) => {
    try {
      const feeStructureData = insertFeeStructureSchema.parse(req.body);
      const feeStructure = await storage.createFeeStructure(feeStructureData);
      res.status(201).json(feeStructure);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/fee-structures", async (req, res, next) => {
    try {
      const programId = req.query.programId ? parseInt(req.query.programId as string) : undefined;
      const classId = req.query.classId ? parseInt(req.query.classId as string) : undefined;
      
      const feeStructures = await storage.getFeeStructures(programId, classId);
      res.json(feeStructures);
    } catch (error) {
      next(error);
    }
  });

  // ======== Fee/Challans API ========
  app.post("/api/fees", async (req, res, next) => {
    try {
      const feeData = insertFeeSchema.parse(req.body);
      const fee = await storage.createFee(feeData);
      res.status(201).json(fee);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/fees", async (req, res, next) => {
    try {
      const studentId = req.query.studentId ? parseInt(req.query.studentId as string) : undefined;
      const status = req.query.status as string | undefined;
      
      const fees = await storage.getFees(studentId, status);
      res.json(fees);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/fees/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const feeData = insertFeeSchema.partial().parse(req.body);
      const fee = await storage.updateFee(id, feeData);
      
      if (!fee) {
        return res.status(404).json({ message: "Fee record not found" });
      }
      
      res.json(fee);
    } catch (error) {
      next(error);
    }
  });

  // ======== Exams API ========
  app.post("/api/exams", async (req, res, next) => {
    try {
      const examData = insertExamSchema.parse(req.body);
      const exam = await storage.createExam(examData);
      res.status(201).json(exam);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/exams", async (req, res, next) => {
    try {
      const subjectId = req.query.subjectId ? parseInt(req.query.subjectId as string) : undefined;
      const exams = await storage.getExams(subjectId);
      res.json(exams);
    } catch (error) {
      next(error);
    }
  });

  // ======== Results API ========
  app.post("/api/results", async (req, res, next) => {
    try {
      const resultData = insertResultSchema.parse(req.body);
      const result = await storage.recordResult(resultData);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/results", async (req, res, next) => {
    try {
      const studentId = req.query.studentId ? parseInt(req.query.studentId as string) : undefined;
      const examId = req.query.examId ? parseInt(req.query.examId as string) : undefined;
      
      const results = await storage.getResults(studentId, examId);
      res.json(results);
    } catch (error) {
      next(error);
    }
  });

  // ======== Timetable API ========
  app.post("/api/timetable", async (req, res, next) => {
    try {
      const timetableData = insertTimetableSchema.parse(req.body);
      const entry = await storage.createTimetableEntry(timetableData);
      res.status(201).json(entry);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/timetable", async (req, res, next) => {
    try {
      const sectionId = req.query.sectionId ? parseInt(req.query.sectionId as string) : undefined;
      const facultyId = req.query.facultyId ? parseInt(req.query.facultyId as string) : undefined;
      
      const timetable = await storage.getTimetable(sectionId, facultyId);
      res.json(timetable);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/timetable/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const timetableData = insertTimetableSchema.partial().parse(req.body);
      const entry = await storage.updateTimetableEntry(id, timetableData);
      
      if (!entry) {
        return res.status(404).json({ message: "Timetable entry not found" });
      }
      
      res.json(entry);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/timetable/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteTimetableEntry(id);
      
      if (!success) {
        return res.status(404).json({ message: "Timetable entry not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });

  // ======== Announcements API ========
  app.post("/api/announcements", async (req, res, next) => {
    try {
      const announcementData = insertAnnouncementSchema.parse(req.body);
      const announcement = await storage.createAnnouncement(announcementData);
      res.status(201).json(announcement);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/announcements", async (req, res, next) => {
    try {
      const targetRole = req.query.targetRole as string | undefined;
      const programId = req.query.programId ? parseInt(req.query.programId as string) : undefined;
      const isPinned = req.query.isPinned ? req.query.isPinned === 'true' : undefined;
      
      const announcements = await storage.getAnnouncements(targetRole, programId, isPinned);
      res.json(announcements);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/announcements/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const announcementData = insertAnnouncementSchema.partial().parse(req.body);
      const announcement = await storage.updateAnnouncement(id, announcementData);
      
      if (!announcement) {
        return res.status(404).json({ message: "Announcement not found" });
      }
      
      res.json(announcement);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/announcements/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteAnnouncement(id);
      
      if (!success) {
        return res.status(404).json({ message: "Announcement not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });

  // ======== Dashboard Stats API ========
  app.get("/api/dashboard/stats", async (req, res, next) => {
    try {
      // Get counts for various entities
      const students = await storage.getStudents();
      const faculty = await storage.getFaculty();
      
      // Get unpaid fees
      const unpaidFees = await storage.getFees(undefined, 'unpaid');
      const totalUnpaid = unpaidFees.reduce((sum, fee) => sum + Number(fee.amount) - Number(fee.paidAmount), 0);
      
      // Get total fee collection (paid)
      const paidFees = await storage.getFees(undefined, 'paid');
      const totalPaid = paidFees.reduce((sum, fee) => sum + Number(fee.paidAmount), 0);
      
      // Return stats
      res.json({
        totalStudents: students.length,
        totalFaculty: faculty.length,
        feeCollection: totalPaid.toFixed(2),
        feeDefaulters: unpaidFees.length,
      });
    } catch (error) {
      next(error);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
