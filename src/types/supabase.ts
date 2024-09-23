export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      answer_options: {
        Row: {
          id: string
          question_id: string
          text: string
        }
        Insert: {
          id?: string
          question_id: string
          text: string
        }
        Update: {
          id?: string
          question_id?: string
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "answer_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          course_id: string
          created_at: string | null
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          course_id: string
          created_at?: string | null
          id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string | null
          id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      correct_answers: {
        Row: {
          answer_option_id: string
          question_id: string
        }
        Insert: {
          answer_option_id: string
          question_id: string
        }
        Update: {
          answer_option_id?: string
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "correct_answers_answer_option_id_fkey"
            columns: ["answer_option_id"]
            isOneToOne: false
            referencedRelation: "answer_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "correct_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string | null
          description: string
          id: string
          is_public: boolean | null
          knowledge_ids: string[]
          question_bank: Json
          title: string
          total_points: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          is_public?: boolean | null
          knowledge_ids: string[]
          question_bank: Json
          title: string
          total_points: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          is_public?: boolean | null
          knowledge_ids?: string[]
          question_bank?: Json
          title?: string
          total_points?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      group_moderators: {
        Row: {
          group_id: string
          user_id: string
        }
        Insert: {
          group_id: string
          user_id: string
        }
        Update: {
          group_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_moderators_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "student_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_moderators_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_statistics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "group_moderators_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge: {
        Row: {
          created_at: string | null
          id: string
          name: string
          parent_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          name: string
          parent_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "knowledge"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_trajectories: {
        Row: {
          category_id: string
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          category_id: string
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "learning_trajectories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          category_id: string
          created_at: string | null
          id: string
          knowledge_id: string | null
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          category_id: string
          created_at?: string | null
          id?: string
          knowledge_id?: string | null
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string
          created_at?: string | null
          id?: string
          knowledge_id?: string | null
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      question_knowledge: {
        Row: {
          knowledge_id: string
          question_id: string
        }
        Insert: {
          knowledge_id: string
          question_id: string
        }
        Update: {
          knowledge_id?: string
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_knowledge_knowledge_id_fkey"
            columns: ["knowledge_id"]
            isOneToOne: false
            referencedRelation: "knowledge"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_knowledge_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          case_sensitive: boolean | null
          cost: number
          created_at: string | null
          explanation: string | null
          id: string
          invitation_text: string | null
          shuffle_options: boolean | null
          task_id: string
          text: string
          type: string
          updated_at: string | null
        }
        Insert: {
          case_sensitive?: boolean | null
          cost: number
          created_at?: string | null
          explanation?: string | null
          id?: string
          invitation_text?: string | null
          shuffle_options?: boolean | null
          task_id: string
          text: string
          type: string
          updated_at?: string | null
        }
        Update: {
          case_sensitive?: boolean | null
          cost?: number
          created_at?: string | null
          explanation?: string | null
          id?: string
          invitation_text?: string | null
          shuffle_options?: boolean | null
          task_id?: string
          text?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      student_groups: {
        Row: {
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      task_history: {
        Row: {
          attempt_date: string | null
          completed: boolean | null
          id: number
          score: number
          task_id: string
          user_id: string
        }
        Insert: {
          attempt_date?: string | null
          completed?: boolean | null
          id?: number
          score: number
          task_id: string
          user_id: string
        }
        Update: {
          attempt_date?: string | null
          completed?: boolean | null
          id?: number
          score?: number
          task_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_history_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_statistics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "task_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      task_knowledge: {
        Row: {
          knowledge_id: string
          task_id: string
        }
        Insert: {
          knowledge_id: string
          task_id: string
        }
        Update: {
          knowledge_id?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_knowledge_knowledge_id_fkey"
            columns: ["knowledge_id"]
            isOneToOne: false
            referencedRelation: "knowledge"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_knowledge_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          content: Json
          created_at: string | null
          id: string
          is_public: boolean | null
          test_id: string
          title: string
          total_points: number
          updated_at: string | null
        }
        Insert: {
          content: Json
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          test_id: string
          title: string
          total_points: number
          updated_at?: string | null
        }
        Update: {
          content?: Json
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          test_id?: string
          title?: string
          total_points?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
        ]
      }
      tests: {
        Row: {
          created_at: string | null
          id: string
          lesson_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          lesson_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          lesson_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tests_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      trajectory_edges: {
        Row: {
          id: string
          learning_trajectory_id: string
          source_lesson_id: string
          target_lesson_id: string
        }
        Insert: {
          id?: string
          learning_trajectory_id: string
          source_lesson_id: string
          target_lesson_id: string
        }
        Update: {
          id?: string
          learning_trajectory_id?: string
          source_lesson_id?: string
          target_lesson_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trajectory_edges_learning_trajectory_id_fkey"
            columns: ["learning_trajectory_id"]
            isOneToOne: false
            referencedRelation: "learning_trajectories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trajectory_edges_source_lesson_id_fkey"
            columns: ["source_lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trajectory_edges_target_lesson_id_fkey"
            columns: ["target_lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      trajectory_nodes: {
        Row: {
          id: number
          learning_trajectory_id: string
          lesson_id: string
          position: number
        }
        Insert: {
          id?: number
          learning_trajectory_id: string
          lesson_id: string
          position: number
        }
        Update: {
          id?: number
          learning_trajectory_id?: string
          lesson_id?: string
          position?: number
        }
        Relationships: [
          {
            foreignKeyName: "trajectory_nodes_learning_trajectory_id_fkey"
            columns: ["learning_trajectory_id"]
            isOneToOne: false
            referencedRelation: "learning_trajectories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trajectory_nodes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_answers: {
        Row: {
          answer_option_id: string | null
          answer_text: string | null
          correct: boolean
          id: number
          question_id: string
          task_history_id: number
        }
        Insert: {
          answer_option_id?: string | null
          answer_text?: string | null
          correct: boolean
          id?: number
          question_id: string
          task_history_id: number
        }
        Update: {
          answer_option_id?: string | null
          answer_text?: string | null
          correct?: boolean
          id?: number
          question_id?: string
          task_history_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_answers_answer_option_id_fkey"
            columns: ["answer_option_id"]
            isOneToOne: false
            referencedRelation: "answer_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_answers_task_history_id_fkey"
            columns: ["task_history_id"]
            isOneToOne: false
            referencedRelation: "task_history"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar: string | null
          birth_date: string | null
          created_at: string | null
          email: string
          first_name: string | null
          group_id: string | null
          id: string
          last_name: string | null
          login: string
          role_id: number
          updated_at: string | null
        }
        Insert: {
          avatar?: string | null
          birth_date?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          group_id?: string | null
          id?: string
          last_name?: string | null
          login: string
          role_id: number
          updated_at?: string | null
        }
        Update: {
          avatar?: string | null
          birth_date?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          group_id?: string | null
          id?: string
          last_name?: string | null
          login?: string
          role_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "student_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      user_statistics: {
        Row: {
          average_score: number | null
          total_attempts: number | null
          total_score: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      check_email_exists: {
        Args: {
          input_email: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
