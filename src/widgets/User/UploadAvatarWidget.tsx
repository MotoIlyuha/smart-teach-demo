import {useEffect, useState} from "react";

import {Avatar, Button, Flex, GetProp, Image, Upload, UploadFile, UploadProps, Collapse, message} from "antd";
import {UploadOutlined, UserOutlined, EyeOutlined} from "@ant-design/icons";
import {UploadChangeParam} from "antd/es/upload";
import ImgCrop from "antd-img-crop";

import supabase from "../../config/supabaseClient.ts";
import {Tables} from "../../types/supabase.ts";

import styles from '../../styles/PreviewButton.module.css';


type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export default function UploadAvatar({person, itsMe}: { person: Tables<'users'>, itsMe: boolean }) {
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>(
    person.avatar ? [{uid: '-1', name: 'avatar', status: 'done', url: person.avatar}] : []
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAvatarUrl(person.avatar ?? '');
  }, [person.avatar]);

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
      const fileName = `${person.login}_${Date.now()}.${fileExt}`;
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

      console.log("Public URL:", data.publicUrl);

      // Обновление информации о пользователе
      if (person.login) {
        const {error: updateError} = await supabase
          .from('users')
          .update({avatar: data.publicUrl})
          .eq('login', person.login)
          .single();

        if (updateError) {
          message.error(`Ошибка обновления пользователя: ${updateError.message}`);
          return;  // Выход из функции при ошибке обновления
        }
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
    console.log(info);
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
    <Flex vertical align={'center'}>
      <div className={styles.container}>
        <Avatar
          size={240}
          shape={'square'}
          icon={avatarUrl ? null : <UserOutlined/>}
          src={avatarUrl}
          alt="avatar"
          style={{borderRadius: 16}}
        />
        {avatarUrl &&
            <div
                className={styles.overlay}
                onClick={() => {
                  setPreviewOpen(true);
                  setPreviewImage(avatarUrl);
                }}>
                <EyeOutlined/>{'  '}<span>Посмотреть</span>
            </div>}
      </div>
      {itsMe &&
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
    </Flex>
  )
}