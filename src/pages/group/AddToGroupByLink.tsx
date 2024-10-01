import {Navigate, useParams, useSearchParams} from "react-router-dom";
import {useAuth} from "../../hok/Auth.ts";

export default function AddToGroupByLink() {
  const {group_id} = useParams<{ group_id: string }>();
  const [searchParams] = useSearchParams();
  const invitedBy = searchParams.get("invitedBy");
  const {user} = useAuth();

  if (user)
    return <Navigate to={'/group/' + group_id + '/'} state={{group_id: group_id, invited_id: invitedBy}}/>
  else
    return <Navigate to={'/register'} state={{group_id: group_id}}/>
}