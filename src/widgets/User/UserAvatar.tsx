import {useState} from "react";

import {Avatar, Image} from "antd";
import {EyeOutlined, UserOutlined} from "@ant-design/icons";

import styles from "../../styles/PreviewButton.module.css";


export default function UserAvatar({avatar_url, size = 240}: { avatar_url: string, size?: number }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  return (
    <div className={styles.container}>
      <Avatar
        size={size}
        shape={'square'}
        icon={<UserOutlined/>}
        src={avatar_url || undefined}
        alt="avatar"
        style={{borderRadius: 16}}
      />
      {(avatar_url !== '' && avatar_url !== null && avatar_url !== undefined) &&
          <div
              className={styles.overlay}
              onClick={() => {
                setPreviewOpen(true);
                setPreviewImage(avatar_url);
              }}>
              <EyeOutlined/>{'  '}<span>Посмотреть</span>
          </div>}
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
    </div>
  )
}