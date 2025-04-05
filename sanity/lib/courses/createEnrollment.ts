import { client } from "../adminClient";

interface CreateEnrollmentParams {
  studentId: string;
  courseId: string;
  paymentId: string;
  amount: number;
  //studentEmail : string;
}

export async function createEnrollment({
  studentId,
  courseId,
  paymentId,
  amount,
  //studentEmail
}: CreateEnrollmentParams) {
  try {

    console.log("Starting enrollment creation for:", { studentId, courseId });
    // 1. Verify both student and course exist in Sanity
    const [student, course] = await Promise.all([
      client.getDocument(studentId),
      client.getDocument(courseId),
    ]);

    if (!student) {
      throw new Error(`Student with ID ${studentId} not found in Sanity`);
    }
    if (!course) {
      throw new Error(`Course with ID ${courseId} not found in Sanity`);
    }

    console.log("Verified student and course exist");

    // 2. Check for existing enrollment to prevent duplicates
    const existingEnrollment = await client.fetch(
      `*[_type == "enrollment" && student._ref == $studentId && course._ref == $courseId][0]`,
      { studentId, courseId }
    );

    if (existingEnrollment) {
      console.warn(`Enrollment already exists: ${existingEnrollment._id}`);
      return existingEnrollment;
    }

    // 3. Create the enrollment document
    const enrollment = await client.create({
      _type: "enrollment",
      student: {
        _type: "reference",
        _ref: studentId,
      },
      course: {
        _type: "reference",
        _ref: courseId,
      },
      paymentId,
      amount,
      //studentEmail,
      enrolledAt: new Date().toISOString(),
      //status: "active",
    });

    console.log(`Created enrollment: ${enrollment._id}`, {
      student: student.name || student._id,
      course: course.title || course._id,
    });

    return enrollment;
  } catch (error) {
    console.error("Failed to create enrollment:", {
      studentId,
      courseId,
      error: error instanceof Error ? error.message : error,
    });
    throw error;
  }
}