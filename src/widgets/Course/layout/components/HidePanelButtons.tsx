import {Button} from "antd";
import {useLayout} from "../../../../shared/hok/Layout.ts";
import {LuPanelLeftClose, LuPanelLeftOpen, LuPanelRightClose, LuPanelRightOpen} from "react-icons/lu";

export function HideLeftPanelButton() {
  const {isLeftSidebarVisible, setLeftSidebarVisible} = useLayout();

  return (
    <Button
      type={'text'}
      style={{padding: 4}}
      title={isLeftSidebarVisible ? 'Скрыть левую панель' : 'Показать левую панель'}
      icon={isLeftSidebarVisible ? <LuPanelLeftClose/> : <LuPanelLeftOpen/>}
      onClick={() => setLeftSidebarVisible(!isLeftSidebarVisible)}
    />
  )
}

export function HideRightPanelButton() {
  const {isRightSidebarVisible, setRightSidebarVisible} = useLayout();

  return (
    <Button
      type={'text'}
      style={{padding: 4}}
      title={isRightSidebarVisible ? 'Скрыть правую панель' : 'Показать правую панель'}
      icon={isRightSidebarVisible ? <LuPanelRightClose/> : <LuPanelRightOpen/>}
      onClick={() => setRightSidebarVisible(!isRightSidebarVisible)}
    />
  )
}