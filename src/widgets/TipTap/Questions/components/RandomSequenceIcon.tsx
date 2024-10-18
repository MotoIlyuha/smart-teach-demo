import {FaRandom} from "react-icons/fa";
// import styles from "../Editable/Choice/Question.module.css";
import {Tooltip} from "antd";

export function RandomSequenceIcon({randomSequence, onClick}: { randomSequence: boolean, onClick: () => void }) {
  return (
    <Tooltip title={'Случайный порядок вариантов'}>
      {randomSequence &&
          <FaRandom onClick={onClick} style={{margin: 4, opacity: 0.3}}/>}
    </Tooltip>
  )
}