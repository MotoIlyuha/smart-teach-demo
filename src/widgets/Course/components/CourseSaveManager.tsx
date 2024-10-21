import {ReactNode, useCallback, useEffect, useRef, useState} from "react";
import {useShallow} from "zustand/react/shallow";
import {FloatButton} from "antd";
import {CloseOutlined, SaveOutlined, LoadingOutlined, CheckOutlined} from "@ant-design/icons";
import {useCourseStore} from "../../../shared/stores/courseStore.ts";
import {course_auto_save_interval} from "../../../shared/config/allConfig.ts";
import '../../../shared/styles/CourseSaveManager.css'

export default function CourseSaveManager() {
  const {loading, confirm, error} = useCourseStore(useShallow((state) => ({
    loading: state.updateLoading,
    confirm: state.confirmUpdate,
    error: state.error
  })));
  const [icon, setIcon] = useState<ReactNode>(<SaveOutlined/>);
  const [color, setColor] = useState('#1890ff');
  const [description, setDescription] = useState<undefined | string>(undefined);
  const [saved, setSaved] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const unsavedChangesRef = useRef(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (saved) {
      setIcon(<CheckOutlined />);
      setColor('#52c41a');
      setDescription('Изменения сохранены!');
      unsavedChangesRef.current = false;

      // Set a timeout to reset the button after 2 seconds
      timer = setTimeout(() => {
        setSaved(false);
      }, 3350);
    } else {
      setIcon(<SaveOutlined />);
      setColor('#1890ff');
      setDescription(undefined);
      unsavedChangesRef.current = true;  // Есть несохраненные изменения
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [saved]);

  useEffect(() => {
    if (error) {
      setIcon(<CloseOutlined/>);
      setColor('#ff4d4f');
      setDescription(error);
    } else if (loading) {
      setIcon(<LoadingOutlined />);
      setColor('#1890ff');
      setDescription(undefined);
    }
  }, [error, loading]);

  // Функция для сброса интервала
  const resetInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      console.log('Автосохранение каждые 2 минуты');
      confirm()
        .then(() => setSaved(true))
        .catch(e => console.error(e)); // Автосохранение
    }, course_auto_save_interval);
  }, [confirm]);

  const handleSave = useCallback(() => {
    confirm()
      .then(() => setSaved(true))
      .catch(e => console.error(e));
    resetInterval(); // Сброс таймера
  }, [confirm, resetInterval]);

  useEffect(() => {
    // Запуск интервала при монтировании компонента
    resetInterval();

    // Очистка интервала при размонтировании
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [resetInterval]);

  useEffect(() => {
    // Добавление обработчика перед закрытием страницы
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (unsavedChangesRef.current) {
        event.preventDefault();
        event.returnValue = '';  // Отображение предупреждения о несохраненных изменениях
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Очистка обработчика при размонтировании компонента
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <FloatButton
      className={`color-${color}`}
      type="primary"
      onClick={handleSave}
      icon={icon}
      tooltip={<>Сохранить изменения</>}
      description={description}
      style={{
        backgroundColor: color,
        borderRadius: 20,
        minHeight: 42,
        width: description ? 180 : 42,
        transition: 'width 0.5s ease',
      }}
    />
  )
}
