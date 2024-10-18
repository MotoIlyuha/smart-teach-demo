import {AnswerOption, Question, Task} from "../shared/types/CourseTypes.ts";
import {PostgrestError} from "@supabase/supabase-js";
import supabase from "../shared/config/supabaseClient.ts";

export async function fetchTaskBank(course_id: string): Promise<{ data: Task[] | null, error: PostgrestError | null }> {
  const {data, error} = await supabase.rpc('fetch_course_task_data', {in_course_id: course_id});
  const fetchedData = data as unknown as Task[];
  if (data && !error) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const tasks: Task[] = fetchedData.map((task: Task) => ({
      id: task.id,
      title: task.title,
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
        })) || [],
        correctAnswerIds: question.correctAnswerIds || [],
        requiredKnowledge: question.requiredKnowledge || [],
      })) || [],
    }));

    return { data: tasks, error: null };
  } else {
    return { data: null, error: error };
  }
}