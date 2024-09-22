import {useParams} from "react-router-dom";

export default function UserPage() {
  const {user_login} = useParams();

  return (
    <h1>User Page {user_login}</h1>
  )
}