import {useState} from "react";

import {Badge, Checkbox, Col, Flex, Radio, Row, Typography, Tooltip} from "antd";

import {FaRandom} from "react-icons/fa";
import {AnswerOption, Question} from "../../../../../shared/types/CourseTypes";
import PreviewKnowledge from "../../../../Knowledge/components/Preview/PreviewKnowledge.tsx";

import styles from "./PreviewChoise.module.css";

export default function PreviewChoice({question}: { question: Question }) {

	const shuffleArray = (array: AnswerOption[]) => {
		return array.sort(() => Math.random() - 0.5);
	};

	const [shuffledAnswers, setShuffledAnswers] = useState<AnswerOption[]>(
		question.shuffleOptions ? shuffleArray([...question.options]) : question.options
	);


	const shuffleAnswers = () => {
		setShuffledAnswers(shuffleArray([...question.options]));
	};

	return (
		<Badge count={question.cost} color={'green'}>
			<Flex gap={8} vertical style={{userSelect: 'none', border: '1px solid #00000023', padding: 12, borderRadius: 8}}>
				<Row gutter={[8, 8]} align={'middle'}>
					<Col>
						{/*<Badge count={question.cost} color={'green'}/>*/}
					</Col>
					<Col>
						<Typography.Text strong>{question.invitationText}</Typography.Text>
					</Col>
				</Row>
				<Row gutter={[8, 8]}>
					<Col>
						<Tooltip title={'Случайный порядок вариантов'}>
							{question.shuffleOptions && <FaRandom className={styles.randomIcon} onClick={() => shuffleAnswers()}/>}
						</Tooltip>
					</Col>
					<Col>
						{question.type === 'mono' ? (
							<Radio.Group className={styles.groupDisabled} defaultValue={question.correctAnswerIds[0]} disabled>
								<Flex gap={8} vertical>
									{shuffledAnswers.map((answer, index) => (
										<Radio className={styles.wrapperDisabled} key={index} value={answer.id}>
											{answer.text}
										</Radio>
									))}
								</Flex>
							</Radio.Group>
						) : (
							<Checkbox.Group className={styles.groupDisabled + " " + styles.checkboxGroup}
                              defaultValue={question.correctAnswerIds} disabled>
								{question.options.map((answer, index) => (
									<Checkbox className={styles.wrapperDisabled} key={index} value={answer.id}>
										{answer.text}
									</Checkbox>
								))}
							</Checkbox.Group>
						)}
					</Col>
				</Row>
				<Row>
					<Col span={24}>
						<PreviewKnowledge knowledge={question.requiredKnowledge}/>
					</Col>
				</Row>
			</Flex>
		</Badge>
	)
}