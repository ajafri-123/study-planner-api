import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  // Truncate all tables and reset auto-increment sequences so IDs are always 1, 2, 3…
  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE "StudySession", "Assignment", "Course", "User" RESTART IDENTITY CASCADE'
  );

  const salt = await bcrypt.genSalt(10);

  // Users
  const alice = await prisma.user.create({
    data: {
      email: 'alice@test.com',
      password_hash: await bcrypt.hash('Password123!', salt),
      full_name: 'Alice Smith',
      role: 'student',
    },
  });

  const bob = await prisma.user.create({
    data: {
      email: 'bob@test.com',
      password_hash: await bcrypt.hash('Password123!', salt),
      full_name: 'Bob Johnson',
      role: 'student',
    },
  });

  await prisma.user.create({
    data: {
      email: 'admin@test.com',
      password_hash: await bcrypt.hash('Admin123!', salt),
      full_name: 'Admin User',
      role: 'admin',
    },
  });

  // Alice's courses
  const course1 = await prisma.course.create({
    data: {
      user_id: alice.id,
      course_code: 'CSCE 146',
      title: 'Algorithmic Design I',
      semester: 'Fall 2026',
      instructor_name: 'Dr. Smith',
    },
  });

  const course2 = await prisma.course.create({
    data: {
      user_id: alice.id,
      course_code: 'MATH 241',
      title: 'Vector Calculus',
      semester: 'Fall 2026',
      instructor_name: 'Dr. Brown',
    },
  });

  // Bob's course
  const course3 = await prisma.course.create({
    data: {
      user_id: bob.id,
      course_code: 'CSCE 240',
      title: 'Algorithmic Design II',
      semester: 'Fall 2026',
      instructor_name: 'Dr. Lee',
    },
  });

  // Alice's assignments
  const assignment1 = await prisma.assignment.create({
    data: {
      course_id: course1.id,
      user_id: alice.id,
      title: 'Lab 4',
      description: 'Implement linked list methods',
      due_date: new Date('2026-10-14T23:59:00Z'),
      status: 'pending',
      priority: 'high',
    },
  });

  const assignment2 = await prisma.assignment.create({
    data: {
      course_id: course1.id,
      user_id: alice.id,
      title: 'Homework 3',
      description: 'Recursion problems',
      due_date: new Date('2026-10-20T23:59:00Z'),
      status: 'in_progress',
      priority: 'medium',
    },
  });

  await prisma.assignment.create({
    data: {
      course_id: course2.id,
      user_id: alice.id,
      title: 'Midterm Review',
      description: 'Review chapters 1-5',
      due_date: new Date('2026-10-25T23:59:00Z'),
      status: 'pending',
      priority: 'high',
    },
  });

  // Bob's assignment
  const assignment4 = await prisma.assignment.create({
    data: {
      course_id: course3.id,
      user_id: bob.id,
      title: 'Project 1',
      description: 'Binary search tree implementation',
      due_date: new Date('2026-10-30T23:59:00Z'),
      status: 'pending',
      priority: 'high',
    },
  });

  // Alice's study sessions
  await prisma.studySession.create({
    data: {
      assignment_id: assignment1.id,
      user_id: alice.id,
      session_date: new Date('2026-10-12T18:00:00Z'),
      duration_minutes: 90,
      location: 'Thomas Cooper Library',
      notes: 'Review recursion and arrays',
      completed: false,
    },
  });

  await prisma.studySession.create({
    data: {
      assignment_id: assignment2.id,
      user_id: alice.id,
      session_date: new Date('2026-10-18T14:00:00Z'),
      duration_minutes: 60,
      location: 'Home',
      notes: 'Practice problems',
      completed: true,
    },
  });

  // Bob's study session
  await prisma.studySession.create({
    data: {
      assignment_id: assignment4.id,
      user_id: bob.id,
      session_date: new Date('2026-10-28T10:00:00Z'),
      duration_minutes: 120,
      location: 'Capstone Center',
      notes: 'BST implementation',
      completed: false,
    },
  });

  console.log('Seed complete.');
  console.log('  alice@test.com  / Password123!  (student — owns courses 1,2 and assignments 1,2,3)');
  console.log('  bob@test.com    / Password123!  (student — owns course 3 and assignment 4)');
  console.log('  admin@test.com  / Admin123!     (admin — can access all resources)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
