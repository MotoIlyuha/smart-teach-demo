import {memo, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useShallow} from "zustand/react/shallow";
import {
  Button,
  Collapse,
  Flex,
  Input,
  message,
  Popconfirm,
  Segmented,
  Tooltip,
  Typography,
  Skeleton,
  Modal
} from "antd";
import {DeleteOutlined, LockOutlined, SettingOutlined} from "@ant-design/icons";

import {useCourseStore} from "../../../shared/stores/courseStore.ts";
import {CourseDetails} from "../../../shared/types/CourseTypes.ts";
import {useAuth} from "../../../shared/hok/Auth.ts";
import '../../../shared/styles/CourseEditSettings.css'


interface CourseEditTitleProps {
  course: CourseDetails,
  editMode: boolean,
  courseTitle: string,
  setCourseTitle: (value: string) => void,
  loading: boolean
}

const CourseEditTitle = memo(({course, editMode, courseTitle, setCourseTitle, loading}: CourseEditTitleProps) => {
  const [valid, setValid] = useState(true);

  return (
    <div style={{padding: `${editMode ? 18 : 0}px 24px ${editMode ? 12 : 8}px 24px`}}>
      {!editMode ? (
        <>
          {loading ? <Skeleton.Input active style={{margin: 16}}/> : (
            <Typography.Title level={3}>
              {course.title}
            </Typography.Title>
          )}
        </>
      ) : (
        <Input
          size={'large'}
          placeholder={'Название курса'}
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
      )}
    </div>
  )
});

interface CourseEditSettingsProps {
  course: CourseDetails,
  editMode: boolean,
  courseTitle: string,
  setCourseTitle: (value: string) => void,
  courseDescription: string,
  setCourseDescription: (value: string) => void,
  courseIsPublic: boolean,
  setCourseIsPublic: (value: boolean) => void,
  handleUpdateCourseInfo: () => void,
  handleCancel: () => void,
  loading: boolean,
  handleDeleteCourse: () => void
}

const CourseSettings = memo((
  {
    course,
    courseDescription,
    setCourseDescription,
    courseIsPublic,
    setCourseIsPublic,
    handleUpdateCourseInfo,
    handleCancel,
    loading,
    handleDeleteCourse
  }: CourseEditSettingsProps) => {

  return (
    <Flex gap={12} vertical>
      <Input.TextArea
        placeholder={'Описание курса'}
        defaultValue={course.description}
        value={courseDescription}
        onChange={(e) => setCourseDescription(e.target.value)}
        showCount={true}
        maxLength={255}
        autoSize={{minRows: 3, maxRows: 5}}
        style={{marginBottom: 12}}
      />
      {/*TODO: Реализовать модальное окно с предложением пользователя задать пароль для приватного курса*/}
      <Segmented
        options={[
          {value: true, label: 'Публичный курс'},
          {value: false, label: 'Приватный курс', icon: <LockOutlined/>}
        ]}
        defaultValue={course.isPublic}
        value={courseIsPublic}
        onChange={(value) => setCourseIsPublic(value)}
      />
      <Button
        type={'text'}
        title={'Удалить курс'}
        icon={<DeleteOutlined/>}
        danger={true}
        onClick={() =>
          Modal.warning({
            title: 'Вы уверены, что хотите удалить курс?',
            content: 'Отменить это действие будет невозможно!',
            onOk: () => handleDeleteCourse(),
            onCancel: () => {
            },
            okText: 'Удалить',
            cancelText: 'Отмена',
            okButtonProps: {
              danger: true,
              type: 'primary',
              loading: loading
            },
            okCancel: true,
            closable: true
          })
        }
      >Удалить курс</Button>
      <Flex gap={8} justify={'end'}>
        <Button onClick={() => handleCancel()}>Отмена</Button>
        <Button type={'primary'} onClick={() => handleUpdateCourseInfo()} loading={loading}>
          Сохранить
        </Button>
      </Flex>
    </Flex>
  )
});

export default function CourseEditSettings() {
  const {course, updateCourseDetails, deleteCourse, loading} = useCourseStore(useShallow(state => ({
    course: state.course,
    updateCourseDetails: state.updateCourse,
    loading: state.dataLoading,
    deleteCourse: state.deleteCourse
  })));
  const {person} = useAuth();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [courseTitle, setCourseTitle] = useState(course?.title ?? '');
  const [courseDescription, setCourseDescription] = useState(course?.description ?? '');
  const [courseIsPublic, setCourseIsPublic] = useState(course?.isPublic ?? true);

  if (!course) return null;

  const handleUpdateCourseInfo = async () => {
    updateCourseDetails({
      title: courseTitle,
      description: courseDescription,
      isPublic: courseIsPublic
    })
      .then(() => message.success('Информация о курсе обновлена!'))
      .catch(e => message.error(e.message));
    setEditMode(false);
    setOpenConfirm(false);
  }

  const handleCancel = () => {
    setCourseTitle(course.title);
    setCourseDescription(course.description);
    setCourseIsPublic(course.isPublic);
    setOpenConfirm(false);
    setEditMode(false);
  };

  const handleDeleteCourse = () => {
    deleteCourse()
      .then(() => {
        message.success('Курс удален!');
        navigate('/user/' + person?.id + '/courses');
      })
      .catch(e => message.error(e.message));
  }

  return (
    <Collapse
      className={'course-edit-settings'}
      key={'collapse'}
      collapsible={'icon'}
      activeKey={editMode ? ['main'] : []}
      expandIconPosition={'end'}
      onChange={(e) => setEditMode(e.includes('main'))}
      items={[
        {
          key: 'main',
          label: <CourseEditTitle
            course={course}
            editMode={editMode}
            courseTitle={courseTitle}
            setCourseTitle={setCourseTitle}
            loading={loading}
          />,
          children: <CourseSettings
            course={course}
            courseDescription={courseDescription}
            setCourseDescription={setCourseDescription}
            courseIsPublic={courseIsPublic}
            setCourseIsPublic={setCourseIsPublic}
            handleUpdateCourseInfo={handleUpdateCourseInfo}
            handleCancel={handleCancel}
            courseTitle={courseTitle}
            editMode={editMode}
            setCourseTitle={setCourseTitle}
            loading={loading}
            handleDeleteCourse={handleDeleteCourse}
          />,
          forceRender: true,
          showArrow: false,
          extra: (
            <Popconfirm
              key={'confirm'}
              title="Сохранить изменения?"
              onConfirm={() => handleUpdateCourseInfo()}
              onCancel={() => handleCancel()}
              open={openConfirm}
              okText="Да"
              cancelText="Нет"
              okButtonProps={{loading: loading}}
            >
              <Tooltip title={'Изменить настройки курса'} trigger='hover' open={openConfirm ? false : undefined}>
                <Button
                  key={'btn'}
                  type={'link'}
                  size={'large'}
                  icon={<SettingOutlined/>}
                  style={{padding: 24}}
                  onClick={() => {
                    if (editMode)
                      setOpenConfirm(true);
                    else
                      setEditMode(true);
                  }}
                />
              </Tooltip>
            </Popconfirm>
          )
        }
      ]}
    />
  )
}
