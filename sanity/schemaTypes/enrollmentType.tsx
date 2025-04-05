import Image from "next/image";
import { defineField, defineType } from "sanity";

export const enrollmentType = defineType({
  name: "enrollment",
  title: "Enrollment",
  type: "document",
  icon: () => "📝", // Enrollment icon
  fields: [
    defineField({
      name: "student",
      title: "Student",
      type: "reference",
      to: [{ type: "student" }],
      validation: (rule) => rule.required().error("Student is required"),
      options: {
        disableNew: true,
        filter: 'defined(_ref)'
      }
    }),

    defineField({
      name: "course",
      title: "Course",
      type: "reference",
      to: [{ type: "course" }],
      validation: (rule) => rule.required().error("Course is required"),
      options: {
        disableNew: true
      }
    }),
    defineField({
      name: "amount",
      title: "Amount (USD)",
      type: "number",
      validation: (rule) => rule.required().min(0).precision(2),
      initialValue: 0,
      description: "Amount paid in dollars"
    }),
    defineField({
      name: "paymentId",
      title: "Payment ID",
      type: "string",
      validation: (rule) => rule.required(),
      description: "Stripe payment session ID"
    }),
    defineField({
      name: "enrolledAt",
      title: "Enrollment Date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required()
    })
  ],
  preview: {
    select: {
      studentName: "student.name",
      studentImage: "student.imageUrl",
      courseTitle: "course.title",
      enrolledAt: "enrolledAt",
      amount: "amount"
    },
    prepare({ studentName, studentImage, courseTitle, enrolledAt, amount }) {
      return {
        title: studentName || "Student",
        subtitle: [
          courseTitle || "No Course",
          amount ? `$${amount.toFixed(2)}` : "Free",
          enrolledAt ? new Date(enrolledAt).toLocaleDateString() : "No date"
        ].filter(Boolean).join(" • "),
        media: studentImage ? (
          <Image
            src={studentImage}
            alt={studentName}
            width={100}
            height={100}
          />
        ) : undefined
      };
    }
  }
});