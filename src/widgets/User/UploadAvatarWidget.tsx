import {useState} from "react";

import {Button, Collapse, Flex, GetProp, Image, message, Skeleton, Upload, UploadFile, UploadProps} from "antd";
import {UploadOutlined} from "@ant-design/icons";
import {UploadChangeParam} from "antd/es/upload";
import ImgCrop from "antd-img-crop";

import supabase from "../../config/supabaseClient.ts";

import styles from '../../styles/PreviewButton.module.css';
import UserAvatar from "./UserAvatar.tsx";
import {getBase64} from "../../shared/utils/getBase64.ts";
import {useUserStore} from "../../shared/stores/userStore.ts";


type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export default function UploadAvatar({editable}: { editable: boolean }) {
  const person = useUserStore((state) => state.user);
  const updateUser = useUserStore((state) => state.updateUser);
  const [avatarUrl, setAvatarUrl] = useState<string>(person?.avatar || '');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>(
    person?.avatar ? [{uid: '-1', name: 'avatar', status: 'done', url: person.avatar}] : []
  );
  const [loading, setLoading] = useState(useUserStore((state) => state.loading));

  // Проверка типа файла и размера
  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Вы можете загружать только файлы JPG/PNG!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Изображение должно быть меньше 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const onPreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  // Загрузка файла в Supabase
  const handleUploadToSupabase = async (file: FileType) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${person?.login}_${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      console.log(filePath);

      // Загрузка файла
      const {error: uploadError} = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        message.error(`Ошибка загрузки: ${uploadError.message}`);
        return;  // Выход из функции, если ошибка загрузки
      }

      console.log("File uploaded successfully!");

      // Получение публичного URL загруженного файла
      const {data} = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (!data.publicUrl) {
        message.error('Не удалось получить URL загруженного файла');
        return;  // Выход из функции при отсутствии URL
      }

      const newAvatarUrl = data.publicUrl
      if (newAvatarUrl) {
        setAvatarUrl(newAvatarUrl); // Обновляем состояние локально
        console.log("AVATAR", person, newAvatarUrl);
        await updateUser({avatar: newAvatarUrl}); // Обновляем аватар в базе данных
      }

      // Обновление URL аватара в интерфейсе
      setAvatarUrl(data.publicUrl);
      message.success('Аватар успешно загружен!');
    } catch (error) {
      message.error(`Ошибка загрузки аватара: ${(error as { message: string }).message}`);
    } finally {
      setLoading(false);
    }
  };

  // Обработка загрузки
  const handleChange = async (info: UploadChangeParam) => {
    console.log(info.file.status, person);
    if (info.file.status === 'removed') {
      console.log("REMOVED");
      await handleUploadToSupabase(info.file as FileType);
      setFileList(info.fileList);
      return;
    }
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      console.log("DONE");
      await handleUploadToSupabase(info.file.originFileObj as FileType);
      setFileList(info.fileList);
    } else if (info.file.status === 'error') {
      message.error(`Загрузка файла ${info.file.name} не удалась!`);
    }
  };

  return (
    <>
      <Flex vertical align={'center'} style={{marginTop: 16}}>
        {loading ? (
          <Skeleton.Image style={{width: 240, height: 240}} active/>
        ) : (
          <UserAvatar avatar_url={avatarUrl}/>
        )}
        {editable &&
            <Collapse
                className={styles.collapse}
                expandIconPosition={'end'}
                bordered={false}
                items={[
                  {
                    key: 'upload',
                    label: 'Поменять аватарку',
                    children: (
                      <ImgCrop cropShape={'rect'} rotationSlider>
                        <Upload
                          name={'avatar'}
                          listType={'picture'}
                          onPreview={onPreview}
                          onChange={handleChange}
                          beforeUpload={beforeUpload}
                          progress={{
                            strokeColor: {
                              '0%': '#108ee9',
                              '100%': '#87d068',
                            },
                            strokeWidth: 3,
                          }}
                          showUploadList={{
                            showRemoveIcon: true,
                            showPreviewIcon: true,
                            showDownloadIcon: true
                          }}
                          customRequest={({file, onSuccess}) => {
                            handleChange({fileList: [...fileList, file as UploadFile], file: file as UploadFile});
                            if (onSuccess) onSuccess('ok');
                          }}
                        >
                          <Button icon={<UploadOutlined/>} loading={loading}>
                            {loading ? 'Загрузка...' : 'Загрузить аватар'}
                          </Button>
                        </Upload>
                      </ImgCrop>
                    )
                  }
                ]}/>
        }
      </Flex>
      {previewImage && (
        <Image
          wrapperStyle={{display: 'none'}}
          preview={{
            visible: previewOpen,
            "onVisibleChange": (visible) => setPreviewOpen(visible),
            "afterOpenChange": (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}
    </>
  )
}