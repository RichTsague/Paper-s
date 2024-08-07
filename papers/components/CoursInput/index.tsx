"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/config/firebase-config";
import { collection, getDocs } from "firebase/firestore";
import { Label, Select } from "flowbite-react";

interface CoursInputProps {
  courseId: string;
  setCourseId: (courseId: string) => void;
  setCourseTitle: (courseTitle: string) => void;
}

const CoursInput: React.FC<CoursInputProps> = ({
  courseId,
  setCourseId,
  setCourseTitle,
}) => {
  const [courses, setCourses] = useState<{ id: string; title: string }[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "cours"));
        const courseList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().titre,
        }));
        setCourses(courseList);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCourse = courses.find(
      (course) => course.id === e.target.value
    );
    if (selectedCourse) {
      setCourseId(selectedCourse.id);
      setCourseTitle(selectedCourse.title);
    }
  };

  return (
    <div>
      <Label htmlFor="course">Cours</Label>
      <Select id="course" value={courseId} onChange={handleCourseChange}>
        <option value="">Sélectionnez un cours</option>
        {courses.map((course) => (
          <option key={course.id} value={course.id}>
            {course.title}
          </option>
        ))}
      </Select>
    </div>
  );
};

export default CoursInput;
