import supabase from "../shared/config/supabaseClient.ts";
import {PostgrestError} from "@supabase/supabase-js";
import {Knowledge} from "../shared/types/CourseTypes.ts";
import {Tables} from "../shared/types/supabase.ts";
import {buildTree} from "../shared/utils/buildKnowledgeTree.ts";

export async function fetchKnowledgeTree(): Promise<{ data: Knowledge[] | null, error: PostgrestError | null }> {
  const { data, error } = await supabase.from('knowledge').select("*");
  if (error || !data) {
    return { data: null, error: error };
  } else {
    const knowledgeList: Knowledge[] = data.map((item: Tables<'knowledge'>) => ({
      id: item.id,
      name: item.name,
      parentId: item.parent_id ?? '',
      description: item.description ?? '123',
      isApproved: item.isapproved,
    }));
    const tree = buildTree(knowledgeList, '');
    return { data: tree, error: null };
  }
}