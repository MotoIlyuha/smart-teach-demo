import {useEffect} from "react";
import supabase from "../config/supabaseClient.ts";

export default function MainPage() {

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from('users').select();

      if (error) {
        console.error('Ошибка:', error);  // Обрабатываем ошибку
      } else {
        console.log(data);  // Выводим данные
      }
    })();
  }, [])

  return (
    <>
      <h1>Main Page</h1>
    </>
  )
}