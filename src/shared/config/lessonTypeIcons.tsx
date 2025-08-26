import {ReactNode} from "react";
import {BulbTwoTone, RocketTwoTone, StarTwoTone, TrophyTwoTone} from "@ant-design/icons";
import {LessonType} from "../types/CourseTypes.ts";

type IconItemType = {
  icon: ReactNode;
  label: string;
}

type IconType = {[key in LessonType]: IconItemType}

export const typeIcon: IconType = {
  'default': {
    icon: <BulbTwoTone/>,
    label: 'Обычный'
  },
  'initial': {
    icon: <RocketTwoTone/>,
    label: 'Стартовая контрольная'
  },
  'control': {
    icon: <TrophyTwoTone/>,
    label: 'Контрольная'
  },
  'optional': {
    icon: <StarTwoTone/>,
    label: 'Дополнительный'
  },
}