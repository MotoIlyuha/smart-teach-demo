// SmartTeach TypeScript Definitions
import {JSONContent} from "@tiptap/react";

/**
 * Типы уроков
 */
export type LessonType =
  | "default"     // Обычный урок
  | "initial"     // Стартовая контрольная работа
  | "control"     // Контрольная работа
  | "optional";   // Дополнительный урок

/**
 * Типы вопросов
 */
export type ChoiceType =
  | 'mono'        // Выбор одного варианта ответа
  | 'multi';      // Выбор нескольких вариантов ответов

export type InputType =
  | 'number'      // Ввод числового ответа
  | 'text'        // Ввод текстового ответа
  | 'select'      // Выбор из списка
  | 'textarea';   // Большое текстовое поле

export type TransferType =
  | 'transfer'    // Соотнесение элементов
  | 'sort';       // Упорядочивание элементов

export type QuestionType = ChoiceType | InputType | TransferType;

export const ChoiceTypes = ['mono', 'multi'] as const;
export const InputTypes = ['number', 'text', 'select', 'textarea'] as const;
export const TransferTypes = ['transfer', 'sort'] as const;
export const QuestionTypes = [...ChoiceTypes, ...InputTypes, ...TransferTypes] as const;

/**
 * Интерфейс для элемента знания
 */
export interface Knowledge {
  id: string;                      // Уникальный идентификатор знания
  name: string;                    // Название знания
  description: string | null;      // Описание знания
  parentId?: string;               // Идентификатор родительского знания (если есть)
  children?: Knowledge[];          // Подчиненные знания
  isApproved: boolean;             // Знание подвержено администратором
}

/**
 * Интерфейс для варианта ответа на вопрос
 */
export interface AnswerOption {
  id: string;                // Уникальный идентификатор варианта ответа
  text: string;              // Текст варианта ответа
}

/**
 * Интерфейс для вопроса
 */
export interface Question {
  id: string;                             // Уникальный идентификатор вопроса
  type: QuestionType;                     // Тип вопроса
  cost: number;                           // Баллы за правильный ответ
  shuffleOptions: boolean;                // Случайный порядок вариантов ответов
  caseSensitive: boolean;                 // Чувствительность к регистру
  invitationText?: string;                // Приглашающий текст перед вопросом
  explanation?: string;                   // Пояснение к правильному ответу
  options: AnswerOption[];                // Список вариантов ответов
  correctAnswerIds: string[];             // Идентификаторы правильных ответов
  requiredKnowledge: Knowledge[];         // Список необходимых знаний (идентификаторы)
}

/**
 * Интерфейс для задания (Task)
 */
export interface Task {
  id: string;                             // Уникальный идентификатор задания
  title: string;                          // Название задания
  content: JSONContent;                   // JSON-объект условия задачи
  questions: Question[];                  // Список вопросов в задании
  knowledge: Knowledge[];                 // Список необходимых знаний для задания
  totalPoints: number;                    // Максимальное количество баллов за задание
  isPublic: boolean;                      // Публичность задания
}

/**
 * Интерфейс для теста (Test)
 */
export interface Test {
  id: string;                             // Уникальный идентификатор теста
  title: string;                          // Название теста
  tasks: Task[];                          // Список заданий в тесте
}

/**
 * Интерфейс для урока (Lesson)
 */
export interface Lesson {
  id: string;                             // Уникальный идентификатор урока
  title: string;                          // Название урока
  type: LessonType;                       // Тип урока
  tasks: Task[];                          // Список заданий в уроке
  knowledge?: Knowledge;                      // Идентификатор знания, которое проверяет урок (для "default" и "optional" типов)
}

/**
 * Интерфейс для траектории обучения (LearningTrajectory)
 */
export interface LearningTrajectory {
  id: string;                       // Уникальный идентификатор траектории обучения
  nodes: string[];                  // Узлы графа (уроки)
  edges: {                          // Ребра графа (отношения между уроками)
    id: string;                     // Уникальный идентификатор ребра
    source: string;                 // Идентификатор исходного урока
    target: string;                 // Идентификатор целевого урока
  }[];                              // Список ребер графа
}

/**
 * Интерфейс для категории курса (Category)
 */
export interface Category {
  id: string;                             // Уникальный идентификатор категории
  title: string;                          // Название категории
  lessons: Lesson[];                      // Список уроков в категории
  learningTrajectory: LearningTrajectory; // Траектория обучения для категории
}

/**
 * Интерфейс для курса (Course)
 */
export interface CourseDetails {
  id: string;                             // Уникальный идентификатор курса
  title: string;                          // Название курса
  description: string;                    // Описание курса
  categories: Category[];                 // Список категорий в курсе
  taskBank: Task[];                       // Банк тестов курса
  knowledge: string[];                    // Список необходимых знаний для курса (идентификаторы)
  totalPoints: number;                    // Максимальное количество баллов за курс
  isPublic: boolean;                      // Публичность курса
  createdAt: string;                      // Дата создания курса
  updatedAt: string;                      // Дата обновления курса
}

/**
 * Интерфейс для группы учеников (StudentGroup)
 */
export interface StudentGroup {
  id: string;                             // Уникальный идентификатор группы
  name: string;                           // Название группы
  students: User[];                       // Список учеников в группе
  moderators: User[];                     // Учителя, модерирующие группу
}

/**
 * Типы пользователей
 */
export type UserRole = "student" | "teacher" | "admin";

/**
 * Интерфейс для пользователя (User)
 */
export interface User {
  id: string;                             // Уникальный идентификатор пользователя
  login: string;                          // Логин пользователя
  password: string;                       // Пароль пользователя
  firstName: string;                      // Имя пользователя
  lastName: string;                       // Фамилия пользователя
  email: string;                          // Электронная почта пользователя
  birthDate: Date;                        // Дата рождения пользователя
  avatarUrl?: string;                     // URL аватарки пользователя (необязательно)
  role: UserRole;                         // Роль пользователя
  groupId?: string;                       // Идентификатор группы (для школьников)
  moderatedGroupIds?: string[];           // Идентификаторы групп, которыми модерирует (для учителей)
}

/**
 * Интерфейс для истории решения задания (TaskHistory)
 */
export interface TaskHistory {
  userId: string;                         // Идентификатор пользователя
  taskId: string;                         // Идентификатор задания
  attemptDate: Date;                      // Дата попытки решения
  score: number;                          // Полученные баллы
  completed: boolean;                     // Завершено ли задание
  answers: UserAnswer[];                  // Ответы пользователя
}

/**
 * Интерфейс для ответа пользователя на вопрос (UserAnswer)
 */
export interface UserAnswer {
  questionId: string;                     // Идентификатор вопроса
  answerIds: string[];                    // Идентификаторы выбранных ответов
  correct: boolean;                       // Правильность ответа
}

/**
 * Интерфейс для статистики пользователя (UserStatistics)
 */
export interface UserStatistics {
  userId: string;                         // Идентификатор пользователя
  taskHistories: TaskHistory[];           // История выполнения заданий
}

/**
 * Интерфейс для статистики группы (GroupStatistics)
 */
export interface GroupStatistics {
  groupId: string;                        // Идентификатор группы
  taskHistories: TaskHistory[];           // История выполнения заданий группой
}

/**
 * Интерфейс для личного кабинета пользователя (UserDashboard)
 */
export interface UserDashboard {
  user: User;                             // Данные пользователя
  statistics: UserStatistics;             // Статистика пользователя
}

/**
 * Интерфейс для панели управления учителя (TeacherDashboard)
 */
export interface TeacherDashboard {
  teacher: User;                                 // Данные учителя
  studentGroupStatistics: GroupStatistics[];     // Статистика по группам, которыми модерирует
  individualStudentStatistics: UserStatistics[]; // Статистика по отдельным ученикам
}

/**
 * Интерфейс для панели управления администратора (AdminDashboard)
 */
export interface AdminDashboard {
  admin: User;                            // Данные администратора
  allUserStatistics: UserStatistics[];    // Статистика по всем пользователям
  knowledgeTree: Knowledge[];             // Дерево знаний
}

/**
 * Интерфейс для истории решения заданий пользователя (UserTaskHistory)
 */
export interface UserTaskHistory {
  userId: string;                         // Идентификатор пользователя
  taskId: string;                         // Идентификатор задания
  attempts: TaskHistory[];                // Все попытки решения задания
}