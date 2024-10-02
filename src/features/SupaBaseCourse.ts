import {CourseDetails} from "../shared/types/CourseTypes.ts";
import {PostgrestError} from "@supabase/supabase-js";
import supabase from "../config/supabaseClient.ts";


type createCourseType = Promise<{ data: CourseDetails | null; error: PostgrestError | null }>;

export async function createCourse(course: Partial<CourseDetails>, author_id: string): createCourseType {
  const {data: courseDetails, error} = await supabase.from('courses')
    .insert({
      title: course.title ?? '',
      description: course.description ?? '',
      is_public: course.isPublic ?? true,
      knowledge_ids: [],
      total_points: 0,
      author_id: author_id,
    })
    .select()
    .single();
  if (courseDetails && !error) {
    const courseDetailsWithMissingProperties = {
      ...courseDetails,
      categories: [],
      questionBank: [],
      knowledge: [],
      totalPoints: 0,
      isPublic: courseDetails.is_public,
      createdAt: courseDetails.created_at,
      updatedAt: courseDetails.updated_at,
    } as CourseDetails;
    return {data: courseDetailsWithMissingProperties, error: null};
  } else return {data: null, error: error};
}

export async function fetchCourseDetails(course_id: string): Promise<{
  data: CourseDetails | null;
  error: PostgrestError | null
}> {
  const {data, error} = await supabase.from('courses').select().eq('id', course_id).single();
  if (data && !error) {
    const courseDetails = {
      ...data,
      categories: [],
      questionBank: [],
      knowledge: [],
      totalPoints: 0,
      isPublic: data.is_public,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    } as CourseDetails;
    return {data: courseDetails, error: null};
  } else return {data: null, error: error};
}

export async function updateCourseDetails(course_id: string, updates: Partial<CourseDetails>): createCourseType {
  const {data, error} = await supabase.from('courses')
    .update({
      title: updates.title ?? '',
      description: updates.description ?? '',
      is_public: updates.isPublic ?? true,
    })
    .eq('id', course_id)
    .select()
    .single();
  if (data && !error) {
    const courseDetails = {
      categories: [],
      questionBank: [],
      knowledge: [],
      totalPoints: 0,
      isPublic: data.is_public,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      ...data,
    } as CourseDetails;
    return {data: courseDetails, error: null};
  } else return {data: null, error: error};
}

export async function deleteCourse(course_id: string): Promise<PostgrestError | null> {
  const {error} = await supabase.from('courses').delete().eq('id', course_id);
  if (error) return error;
  else return null;
}