import {create} from "zustand";
import {CourseDetails, LearningTrajectory, Task} from "../types/CourseTypes.ts";
import {
  createCourse, deleteCourse,
  fetchCourseDetails, updateCourse,
  updateCourseDetails
} from "../../features/SupaBaseCourse.ts";

interface CourseStore {
  dataLoading: boolean
  updateLoading: boolean
  taskLoading: boolean
  error: string | null
  tasks: Task[] | null;
  course: CourseDetails | null
  createTask: (task: Task) => Promise<void>;
  updateTask: (task_id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (task_id: string) => Promise<void>;
  updateTrajectory: (category_id: string, updates: Partial<LearningTrajectory>) => Promise<void>;
  fetchCourse: (course_id: string) => void
  createCourse: (course: CourseDetails, user_id: string) => Promise<void>
  updateCourse: (updates: Partial<CourseDetails>) => Promise<void>
  updateCourseDetails: (updates: Partial<CourseDetails>) => Promise<void>
  deleteCourse: (course_id?: string) => Promise<void>
  confirmUpdate: () => Promise<void>
}

export const useCourseStore = create<CourseStore>((set) => ({
  tasks: null,
  course: null,
  dataLoading: false,
  updateLoading: false,
  taskLoading: false,
  error: null,

  createTask: async (task: Task) => {
    set({taskLoading: true, error: null});
    console.log('Creating task:', task);
    const {tasks} = useCourseStore.getState();
    if (tasks) set({tasks: [...tasks, task], taskLoading: false, error: null});
    else set({error: 'Create task error', taskLoading: false});
  },

  updateTask: async (task_id: string, updates: Partial<Task>) => {
    set({taskLoading: true, error: null});
    console.log('Updating task:', updates);
    try {
      const {tasks} = useCourseStore.getState();
      if (tasks === null) set({course: null, error: 'TaskBank not found', taskLoading: false});
      else {
        const updatedTask = {...tasks.find(t => t.id === task_id), ...updates} as Task;
        updatedTask.id = task_id ?? updatedTask.id;
        set({tasks: tasks.map(t => t.id === task_id ? updatedTask : t), error: null, taskLoading: false});
      }
    } catch (error) {
      console.error('Error updating task:', error);
      set({tasks: null, error: String(error), taskLoading: false});
    }
  },

  deleteTask: async (taskId: string) => {
    set({taskLoading: true, error: null});
    console.log('Deleting task:', taskId);
    try {
      const {tasks} = useCourseStore.getState();
      if (!tasks) set({course: null, error: 'TaskBank not found', taskLoading: false});
      else set({tasks: tasks.filter(t => t.id !== taskId), error: null, taskLoading: false});
    } catch (error) {
      console.error('Error deleting task:', error);
      set({tasks: null, error: String(error), taskLoading: false});
    }
  },

  updateTrajectory: async (category_id: string, updates: Partial<LearningTrajectory>) => {
    console.log('Updating trajectory:', category_id, updates);
    try {
      set({error: null});
      const {course} = useCourseStore.getState();
      console.log('Updated trajectory data:', category_id);
      if (course && course.categories) {
        const updatedCourse = {
          ...course,
          categories: course?.categories?.map(c => c.id === category_id ? {
            ...c,
            learningTrajectory: {...c.learningTrajectory, ...updates}
          } : c)
        }
        set({course: updatedCourse});
      } else {
        console.error('Error updating trajectory:', category_id);
        set({course: null, error: "Error updating trajectory"});
      }
    } catch (error) {
      console.error('Error updating trajectory:', error);
      set({course: null, error: String(error)});
    }
  },

  createCourse: async (course: CourseDetails, user_id: string) => {
    console.log('Creating course:', course);
    try {
      set({dataLoading: true, error: null});
      createCourse(course, user_id).then(({data, error}) => {
        console.log('Created course data:', data);
        if (error) {
          console.error('Error creating course:', error.message);
          set({course: null, error: error.message, dataLoading: false});
        } else {
          set({course: data, dataLoading: false});
        }
      })
    } catch (error) {
      console.error('Error creating course:', error);
      set({course: null, error: String(error), dataLoading: false});
    }
  },

  fetchCourse: async (course_id: string) => {
    console.log('Fetching course:', course_id);
    try {
      set({dataLoading: true, taskLoading: true, error: null});
      const {data, error} = await fetchCourseDetails(course_id);
      console.log('Fetched course data:', data);
      if (error) {
        console.error('Error fetching course:', error.message);
        set({course: null, tasks: null, error: error.message, dataLoading: false, taskLoading: false});
      } else {
        set({course: data, tasks: data?.taskBank || [], dataLoading: false, taskLoading: false});
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      set({course: null, error: String(error), dataLoading: false, taskLoading: false});
    }
  },

  updateCourse: async (updates: Partial<CourseDetails>) => {
    console.log('Updating course:', updates);
    try {
      const {course} = useCourseStore.getState();
      if (!course || !course.id) set({course: null, error: 'Course not found', dataLoading: false});
      else set({course: {...course, ...updates}, error: null});
    } catch (error) {
      console.error('Error updating course:', error);
      set({course: null, error: String(error), dataLoading: false});
    }
  },

  confirmUpdate: async () => {
    console.log('Confirm update');
    try {
      set({updateLoading: true, error: null});
      const {course} = useCourseStore.getState();
      if (!course || !course.id) set({course: null, error: 'Course not found', dataLoading: false});
      else {
        const error = await updateCourse(course.id, course);
        if (error) {
          console.error('Error updating course:', error.message);
          set({course: null, error: error.message, dataLoading: false});
        } else {
          set({error: null, dataLoading: false, updateLoading: false});
        }
      }
    } catch (error) {
      console.error('Error confirm update:', error);
      set({course: null, error: String(error), dataLoading: false, updateLoading: false});
    }
  },

  updateCourseDetails: async (updates: Partial<CourseDetails>) => {
    console.log('Updating course:', updates);
    try {
      set({dataLoading: true, error: null});
      const {course} = useCourseStore.getState();
      if (!course || !course.id) set({course: null, error: 'Course not found', dataLoading: false});
      else {
        const error = await updateCourseDetails(course.id, updates);
        console.log('Updated course data:', updates);
        if (error) {
          console.error('Error updating course:', error.message);
          set({course: null, error: error.message, dataLoading: false});
        } else {
          set({course: {...course, ...updates}, dataLoading: false});
        }
      }
    } catch (error) {
      console.error('Error updating course:', error);
      set({course: null, error: String(error), dataLoading: false});
    }
  },

  deleteCourse: async (course_id?: string) => {
    console.log('Deleting course:', course_id);
    try {
      set({dataLoading: true, error: null});
      if (!course_id) {
        const {course} = useCourseStore.getState();
        if (!course || !course.id) {
          set({course: null, error: 'Course not found', dataLoading: false});
          return;
        }
        course_id = course.id;
      }
      const error = await deleteCourse(course_id);
      console.log('Deleted course id:', course_id);
      if (error) {
        console.error('Error deleting course:', error.message);
        set({course: null, error: error.message, dataLoading: false});
      } else {
        set({course: null, dataLoading: false});
      }

    } catch (error) {
      console.error('Error deleting course:', error);
      set({course: null, error: String(error), dataLoading: false});
    }
  }
}));