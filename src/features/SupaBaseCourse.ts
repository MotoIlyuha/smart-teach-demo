import {CourseDetails} from "../shared/types/CourseTypes.ts";
import {PostgrestError} from "@supabase/supabase-js";
import supabase from "../config/supabaseClient.ts";

export async function createCourse(course: CourseDetails): Promise<{ data: CourseDetails | null; error: PostgrestError | null }> {
  const {data: courseDetails, error} = await supabase.from('courses').insert(course).select().single();
  if (courseDetails && !error) {
    return {data: courseDetails, error: null};
  } else return {data: null, error: error};
}

export async function fetchCourseDetails(course_id: string): Promise<{ data: CourseDetails | null; error: PostgrestError | null }> {
  // const {data: courseDetails, error} = await supabase
  //   .rpc('get_course_details_by_id', {input_course_id: course_id})
  //   .single();
  // if (courseDetails && !error) {
  //   const teacher = await getUserById(courseDetails.teacher_id);
  //   const students = await Promise.all(courseDetails.students.map(async gr => await getUserById(gr.user_id)));
  //   const return_data = {
  //     ...courseDetails,
  //     teacher: teacher,
  //     students: students
  //   } as CourseDetails;
  //   return {data: return_data, error: error};
  // } else return {data: null, error: error};
}