import supabase from "../shared/config/supabaseClient.ts";
import {PostgrestError} from "@supabase/supabase-js";
import {Knowledge} from "../shared/types/CourseTypes.ts";
import {Tables} from "../shared/types/supabase.ts";
import {buildTree} from "../shared/utils/buildKnowledgeTree.ts";

type KnowledgeType = {
  tree: Knowledge[] | null,
  list: Knowledge[] | null,
  error: PostgrestError | null
}

export async function fetchKnowledgeTree(): Promise<KnowledgeType> {
  const { data, error } = await supabase.from('knowledge').select("*");
  if (error || !data) {
    return { tree: null, list: null, error: error };
  } else {
    const knowledgeList: Knowledge[] = data.map((item: Tables<'knowledge'>) => ({
      id: item.id,
      name: item.name,
      parentId: item.parent_id ?? '',
      description: item.description ?? '',
      isApproved: item.isapproved,
    }));
    const tree = buildTree(knowledgeList, '');
    return { tree: tree, list: knowledgeList, error: null };
  }
}