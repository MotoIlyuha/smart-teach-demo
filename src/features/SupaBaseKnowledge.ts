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

export async function fetchKnowledgeTree(user_id?: string, admin_mode?: boolean): Promise<KnowledgeType> {
  let data: Tables<'knowledge'>[] | null = [];
  let error: PostgrestError | null = null;
  if (admin_mode)
    ({data, error} = await supabase.from('knowledge').select("*"));
  else if (user_id)
    ({data, error} = await supabase.from('knowledge').select("*").or(`isapproved.eq.true,author_id.eq.${user_id}`));
  else
    ({data, error} = await supabase.from('knowledge').select("*").eq('isapproved', true));
  if (error || !data) {
    return {tree: null, list: null, error: error};
  } else {
    const knowledgeList: Knowledge[] = data.map((item: Tables<'knowledge'>) => ({
      id: item.id,
      name: item.name,
      parentId: item.parent_id ?? '',
      description: item.description ?? '',
      isApproved: item.isapproved,
    }));
    const tree = buildTree(knowledgeList, '');
    return {tree: tree, list: knowledgeList, error: null};
  }
}