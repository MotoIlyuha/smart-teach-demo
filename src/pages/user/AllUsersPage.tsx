import {useState, useEffect} from "react";
import supabase from "../../config/supabaseClient.ts";
import {Tables} from "../../shared/types/supabase.ts";
import UserMini from "../../widgets/User/UserMiniWidget.tsx";

export default function AllUsersPage() {
  const [allUsers, setAllUsers] = useState<Tables<'users'>[]>([]);

  useEffect(() => {
    supabase.from('users').select('*')
      .then(({data}) => setAllUsers(data || []));
  }, []);

  return (
    <div>
      <h1>Все пользователи</h1>
      {allUsers.map(user => (
        <UserMini person={user} key={user.id}/>
      ))}
    </div>
  )
}