import {useCourseStore} from "../../shared/stores/courseStore.ts";
import {useShallow} from "zustand/react/shallow";
import {useState} from "react";
import {Button, Flex, Input, message, Tooltip, Typography} from "antd";
import {CheckOutlined, CloseOutlined, EditOutlined} from "@ant-design/icons";

export default function CourseEditTitle() {
  const {course, updateCourseDetails} = useCourseStore(useShallow(state => ({
    course: state.course,
    updateCourseDetails: state.updateCourseDetails
  })));
  const [courseTitle, setCourseTitle] = useState(course?.title);
  const [valid, setValid] = useState(true);
  const [hover, setHover] = useState(false);
  const [edit, setEdit] = useState(false);

  if (!course) return;

  const handleChangeTitle = async () => {
    updateCourseDetails({title: courseTitle})
      .then(() => {
        message.success('Название курса успешно изменено!');
        setEdit(false);
      })
      .catch(e => message.error(e.message));
  }

  return (
    <Flex gap={8} align={'baseline'} style={{paddingLeft: 24, paddingTop: edit ? 18 : 0}}
          onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <>
      {edit ? (
        <>
          <Input
            size={'large'}
            variant={'filled'}
            defaultValue={course.title}
            value={courseTitle}
            onChange={(e) => {
              setCourseTitle(e.target.value);
              if (e.target.value.length < 4 || e.target.value.length > 40) {
                setValid(false);
              } else {
                setValid(true);
              }
            }}
            status={valid ? '' : 'error'}
          />
          <Tooltip title={'Сохранить'}>
            <Button
              type="link"
              onClick={() => handleChangeTitle()}
              icon={<CheckOutlined/>}
              disabled={!valid}
              style={{color: valid ? "green" : 'grey'}}
            />
          </Tooltip>
          <Tooltip title={'Отмена'}>
            <Button type={'link'} onClick={() => setEdit(false)} icon={<CloseOutlined/>}/>
          </Tooltip>
        </>
      ) : (
        <>
          <Typography.Title level={2}>
            {course.title}
          </Typography.Title>
          {hover && (
            <Tooltip title={'Изменить название курса'}>
              <Button
                type={'link'}
                icon={<EditOutlined/>}
                onClick={() => setEdit(true)}
              />
            </Tooltip>
          )}
        </>
      )}
      </>
  </Flex>
  )
}