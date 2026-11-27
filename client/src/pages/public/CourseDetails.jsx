import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { courses } from "../../data/courses";
import CourseDetailsHero from "../../components/course-details/CourseDetailsHero";
import LearningOutcomes from "../../components/course-details/LearningOutcomes";
import CourseCurriculum from "../../components/course-details/CourseCurriculum";
import InstructorProfile from "../../components/course-details/InstructorProfile";
import CourseReviews from "../../components/course-details/CourseReviews";
import EnrollmentPanel from "../../components/course-details/EnrollmentPanel";
import RelatedCourses from "../../components/course-details/RelatedCourses";
import CoursePreviewModal from "../../components/courses/CoursePreviewModal";
import { createDemoPaymentOrder } from "../../data/payments";

export default function CourseDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [previewLesson, setPreviewLesson] = useState(null);

  const course = courses.find(
    (item) => item.slug === slug
  );

  useEffect(() => {
    if (!course) return;

    const title =
      typeof course.title === "string"
        ? course.title
        : course.title?.en || "Course";

    document.title = `${title} | BEHAR`;
  }, [course]);

  if (!course) {
    return (
      <main
        style={{
          minHeight: "80vh",
          display: "grid",
          placeContent: "center",
          textAlign: "center",
          background: "#F4F1E9",
          color: "#102C2B",
          padding: "100px 24px",
        }}
      >
        <h1>Course not found</h1>
        <Link to="/courses">Explore courses</Link>
      </main>
    );
  }

  const handleEnroll = (selectedCourse) => {
    const order = createDemoPaymentOrder(selectedCourse);

    if (!order) return;

    navigate("/student/orders");
  };

  const handlePreviewLesson = (lesson, selectedCourse = course) => {
    if (
      selectedCourse?.slug !== course.slug ||
      lesson?.preview !== true
    ) {
      return;
    }

    setPreviewLesson(lesson);
  };

  const handlePreviewEnroll = (selectedCourse) => {
    handleEnroll(selectedCourse);
    setPreviewLesson(null);

    window.requestAnimationFrame(() => {
      document
        .getElementById("course-enrollment")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <main className="behar-course-details">
      {/* P13.1 — Course Details Hero */}
      <CourseDetailsHero
        course={course}
        onEnroll={handleEnroll}
      />

      {/* P13.2 — Learning Outcomes */}
  <LearningOutcomes course={course} />
      {/* P13.3 — Course Curriculum */}
<CourseCurriculum
        course={course}
        onPreviewLesson={handlePreviewLesson}
      />
      {/* P13.4 — Instructor Profile */}
 <InstructorProfile course={course} />
      {/* P13.5 — Student Reviews */}
  <CourseReviews course={course} />
      {/* P13.6 — Enrollment Panel */}
<EnrollmentPanel
      course={course}
      onEnroll={handleEnroll}
      isEnrolled={false}
      isLoading={false}
      onContinue={(selectedCourse) => {
        console.log("Continue learning:", selectedCourse.slug);
      }}
    />
      {/* P13.7 — Related Courses */}
         <RelatedCourses course={course} />
      <CoursePreviewModal
        lesson={previewLesson}
        course={course}
        isOpen={Boolean(previewLesson)}
        onClose={() => setPreviewLesson(null)}
        onEnroll={handlePreviewEnroll}
      />
    </main>
  );
}
