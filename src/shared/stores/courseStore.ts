import {create} from "zustand";
import {CourseDetails} from "../types/CourseTypes.ts";
import {
  createCourse, deleteCourse,
  fetchCourseDetails,
  updateCourseDetails
} from "../../features/SupaBaseCourse.ts";

interface CourseStore {
  course: CourseDetails | null
  loading: boolean
  error: string | null
  createCourse: (course: CourseDetails, user_id: string) => Promise<void>
  fetchCourse: (course_id: string) => void
  updateCourseDetails: (updates: Partial<CourseDetails>) => Promise<void>
  deleteCourse: (course_id?: string) => Promise<void>
}

export const useCourseStore = create<CourseStore>((set) => {
  return {
    course: null,
    loading: false,
    error: null,

    createCourse: async (course: CourseDetails, user_id: string) => {
      console.log('Creating course:', course);
      try {
        set({loading: true, error: null});
        createCourse(course, user_id).then(({data, error}) => {
          console.log('Created course data:', data);
          if (error) {
            console.error('Error creating course:', error.message);
            set({course: null, error: error.message, loading: false});
          } else {
            set({course: data, loading: false});
          }
        })
      } catch (error) {
        console.error('Error creating course:', error);
        set({course: null, error: String(error), loading: false});
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
      } catch (error) {
        console.error('Error fetching course:', error);
        set({course: null, error: String(error), loading: false});
      }
    },

    updateCourseDetails: async (updates: Partial<CourseDetails>) => {
      console.log('Updating course:', updates);
      try {
        set({loading: true, error: null});
        const {course} = useCourseStore.getState();
        if (!course || !course.id) set({course: null, error: 'Course not found', loading: false});
        else {
          const {data, error} = await updateCourseDetails(course.id, updates);
          console.log('Updated course data:', data);
          if (error) {
            console.error('Error updating course:', error.message);
            set({course: null, error: error.message, loading: false});
          } else {
            set({course: data, loading: false});
          }
        }
      } catch (error) {
        console.error('Error updating course:', error);
        set({course: null, error: String(error), loading: false});
      }
    },

    deleteCourse: async (course_id?: string) => {
      console.log('Deleting course:', course_id);
      try {
        set({loading: true, error: null});
        if (!course_id) {
          const {course} = useCourseStore.getState();
          if (!course || !course.id) {
            set({course: null, error: 'Course not found', loading: false});
            return;
          }
          course_id = course.id;
        }
        const error = await deleteCourse(course_id);
        console.log('Deleted course id:', course_id);
        if (error) {
          console.error('Error deleting course:', error.message);
          set({course: null, error: error.message, loading: false});
        } else {
          set({course: null, loading: false});
        }

      } catch (error) {
        console.error('Error deleting course:', error);
        set({course: null, error: String(error), loading: false});
      }
    }
  }
});