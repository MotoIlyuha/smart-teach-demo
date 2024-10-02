import {create} from "zustand";
import {CourseDetails} from "../types/CourseTypes.ts";
import {createCourse, fetchCourseDetails} from "../../features/SupaBaseCourse.ts";


interface CourseStore {
  course: CourseDetails | null
  loading: boolean
  error: string | null
  createCourse: (course: CourseDetails) => Promise<string>
  fetchCourse: (courseId: string | null) => void
  updateCourse: (updates: Partial<CourseDetails>) => Promise<void>
}

export const useCourseStore = create<CourseStore>((set) => ({
  course: null,
  loading: false,
  error: null,

  createCourse: async (course: CourseDetails) => {
    console.log('Creating course:', course);
    try {
      set({loading: true, error: null});
      createCourse(course).then(({data, error}) => {
        console.log('Created course data:', data);
        if (error) {
          console.error('Error creating course:', error.message);
          set({course: null, error: error.message, loading: false});
        } else {
          set({course: data, loading: false});
        }
      })
    }
    catch (error) {
      console.error('Error creating course:', error);
      set({course: null, error: error.message, loading: false});
    }
  },

  fetchCourse: async (course_id: string) => {
    console.log('Fetching course:', course_id);
    try {
      set({loading: true, error: null});
      const {data, error} = await fetchCourseDetails(course_id);
      console.log('Fetched course data:', data);
      if (error) {
        console.error('Error fetching course:', error.message);
        set({course: null, error: error.message, loading: false});
      } else {
        set({course: data, loading: false});
      }
    }
    catch (error) {
      console.error('Error fetching course:', error);
      set({course: null, error: error.message, loading: false});
    }
  },

  updateCourse: async (updates: Partial<CourseDetails>) => {
    console.log('Updating course:', updates);
    try {
      set({loading: true, error: null});
      const {data, error} = await updateCourseDetails(updates);
      console.log('Updated course data:', data);
      if (error) {
        console.error('Error updating course:', error.message);
        set({course: null, error: error.message, loading: false});
      } else {
        set({course: data, loading: false});
      }
    }
    catch (error) {
      console.error('Error updating course:', error);
      set({course: null, error: error.message, loading: false});
    }
  }
}));