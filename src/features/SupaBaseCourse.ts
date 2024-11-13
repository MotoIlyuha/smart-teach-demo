import {
  AnswerOption,
  Category,
  CourseDetails,
  Lesson,
  LessonNode,
  Question,
  Task
} from "../shared/types/CourseTypes.ts";
import supabase from "../shared/config/supabaseClient.ts";
import {PostgrestError} from "@supabase/supabase-js";
import {Json} from "../shared/types/supabase.ts";
import {Edge} from "@xyflow/react";


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
      taskBank: [],
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
  error: PostgrestError | null;
}> {
  const { data, error } = await supabase.rpc('get_course_details_by_id', { course_id }).single();
  if (data && !error) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const fetchedData: CourseDetails = data as CourseDetails;
    const courseDetails: CourseDetails = {
      id: fetchedData.id,
      title: fetchedData.title,
      description: fetchedData.description,
      totalPoints: fetchedData.totalPoints,
      isPublic: fetchedData.isPublic,
      knowledge: fetchedData.knowledge,
      createdAt: fetchedData.createdAt,
      updatedAt: fetchedData.updatedAt,
      categories: fetchedData.categories?.map((category: Category) => ({
        id: category.id,
        title: category.title,
        lessons: category.lessons?.map((lesson: Lesson) => ({
          id: lesson.id,
          title: lesson.title,
          type: lesson.type,
          tasks: lesson.tasks?.map((task: Task) => ({
            id: task.id,
            content: task.content,
            totalPoints: task.totalPoints,
            isPublic: task.isPublic,
            questions: task.questions?.map((question: Question) => ({
              id: question.id,
              type: question.type,
              cost: question.cost,
              shuffleOptions: question.shuffleOptions,
              caseSensitive: question.caseSensitive,
              invitationText: question.invitationText,
              explanation: question.explanation,
              options: question.options?.map((option: AnswerOption) => ({
                id: option.id,
                text: option.text,
              })),
              correctAnswerIds: question.correctAnswerIds,
              requiredKnowledge: question.requiredKnowledge
            }))
          })),
          knowledge: lesson.knowledge,
        })) || [],
        learningTrajectory: {
          nodes: category.learningTrajectory?.nodes?.map((node: LessonNode) => ({
            id: node.id,
            position: node.position,
            lesson_id: node.lesson_id,
            data: ((category.lessons.find(l => l.id === node.id) ?? {}) as Record<string, unknown> & Lesson),
          })) || [],
          edges: category.learningTrajectory?.edges?.map((edge: Edge) => ({
            id: edge.id,
            source: edge.source,
            target: edge.target,
          })) || [],
        },
      })) || [],
      taskBank: fetchedData.taskBank?.map((task: Task) => ({
        id: task.id,
        content: task.content,
        totalPoints: task.totalPoints,
        isPublic: task.isPublic,
        questions: task.questions?.map((question: Question) => ({
          id: question.id,
          type: question.type,
          cost: question.cost,
          shuffleOptions: question.shuffleOptions,
          caseSensitive: question.caseSensitive,
          invitationText: question.invitationText,
          explanation: question.explanation,
          options: question.options?.map((option: AnswerOption) => ({
            id: option.id,
            text: option.text,
          })),
          correctAnswerIds: question.correctAnswerIds,
          requiredKnowledge: question.requiredKnowledge
        })),
      })) || [],
    };
    return { data: courseDetails, error: null };
  } else return { data: null, error: error };
}


export async function updateCourseDetails(course_id: string, updates: Partial<CourseDetails>): Promise<PostgrestError | null> {
  const {error} = await supabase.from('courses')
    .update({
      title: updates.title ?? '',
      description: updates.description ?? '',
      is_public: updates.isPublic ?? true,
    })
    .eq('id', course_id)
    .select()
    .single();
  return error;
}

export async function updateCourse(course_id: string, updates: Partial<CourseDetails>): Promise<PostgrestError | null> {
  const { error } = await supabase
    .rpc('update_course_details', {
      p_course_id: course_id,
      course_details: updates as unknown as Json
    });
  if (error) return error;
  else return null;
}

export async function deleteCourse(course_id: string): Promise<PostgrestError | null> {
  const {error} = await supabase.from('courses').delete().eq('id', course_id);
  if (error) return error;
  else return null;
}