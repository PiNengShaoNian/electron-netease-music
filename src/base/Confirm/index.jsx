import React, { memo } from 'react'
import { Dialog, Button } from 'element-react'
import ReactDom from 'react-dom'
import { toRem } from '../../utils/rem'

import './index.scss'

const Confirm = memo(function Confirm({
  onCancel,
  title,
  text,
  onConfirm,
  visible
}) {
  return (
    <Dialog
      style={{
        width: toRem(320)
      }}
      visible={visible}
      className="confirm-dialog"
      title={title || '提示'}
      onCancel={onCancel}
    >
      <Dialog.Body className="confirm-body">{text}</Dialog.Body>
      <Dialog.Footer className="dialog-footer">
        <Button onClick={onConfirm} className="confirm-btn" type="primary">
          确认
        </Button>
      </Dialog.Footer>
    </Dialog>
  )
})

Confirm.confirm = ({ onConfirm, ...other }) => {
  const div = document.createElement('div')
  document.body.appendChild(div)
  const onConfirmCb = () => {
    onConfirm && onConfirm()
    ReactDom.unmountComponentAtNode(div)
    div.remove()
  }
  const onCancelCb = () => {
    ReactDom.unmountComponentAtNode(div)
    div.remove()
  }
  ReactDom.render(
    <Confirm onConfirm={onConfirmCb} onCancel={onCancelCb} visible={true} {...other} />,
    div
  )
}
export default Confirm
