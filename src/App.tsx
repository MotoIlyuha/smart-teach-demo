import {useEffect, useState} from 'react'
import { createClient } from "@supabase/supabase-js";
import './App.css'

const supabase = createClient("https://bpfqdbkbnkjiiukrjnic.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwZnFkYmtibmtqaWl1a3JqbmljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTE1NDQ3NjksImV4cCI6MjAyNzEyMDc2OX0.QGEpb-83pyQPujjViSZMkswWCKTKKKWdnbLKI9zLa30");

function App() {
  const [users, setUsers] = useState([]);

    useEffect(() => {
      getUsers();
    }, []);

    async function getUsers() {
      const { data } = await supabase.from("roles").select("*");
      setUsers(data);
    }

  return (
    <ul>
      {users.map((user) => (
        <li key={user.name}>{user.name}</li>
      ))}
    </ul>
  )
}

export default App
