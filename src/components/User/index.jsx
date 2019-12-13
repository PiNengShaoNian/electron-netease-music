import React, { memo, useMemo, useState, useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Dialog, Input, Button } from 'element-react'
import storage from 'good-storage'

import { isDef, genImgUrl } from '../../utils/common'
import { toRem } from '../../utils/rem'
import { UID_KEY } from '../../utils/config'
import { login, logout } from '../../action/user'
import Confrim from '../../base/Confirm'

import './index.scss'

export default memo(function User() {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uid, setUid] = useState('')
  const dispatch = useDispatch()
  const user = useSelector(({ user }) => user.user)
  const isLogin = useMemo(() => {
    return isDef(user.userId)
  }, [user])

  const onUidChange = useCallback(value => {
    setUid(value)
  }, [])

  const onCloseModal = useCallback(() => {
    setVisible(false)
  }, [])

  const onOpenModal = useCallback(() => {
    setVisible(true)
  }, [])

  const onLogout = useCallback(() => {
    Confrim.confirm({
      text: '确定要注销吗',
      onConfirm() {
        dispatch(logout())
      }
    })
  }, [dispatch])

  const onLogin = useCallback(
    async id => {
      if (typeof id !== 'string' || !id) {
        id = uid
      }
      setLoading(true)
      const success = await dispatch(login(id)).finally(() => {
        setLoading(false)
      })

      if (success) {
        onCloseModal()
      }
    },
    [uid]
  )

  useEffect(() => {
    const uid = storage.get(UID_KEY)
    if (isDef(uid)) {
      onLogin(uid + '')
    }
  }, [])

  return (
    <div className="user">
      {!isLogin ? (
        <div className="login-trigger" onClick={onOpenModal}>
          <i className="user-icon iconfont icon-yonghu" />
          <p className="user-name" />
        </div>
      ) : (
        <div className="logined-user" onClick={onLogout}>
          <img
            src={genImgUrl(user.avatarUrl, 80)}
            alt="avatar"
            className="avatar"
          />
          <p className="user-name">{user.nickName}</p>
        </div>
      )}
      <Dialog
        visible={visible}
        title="登录"
        modal={false}
        style={{ width: toRem(320) }}
        onCancel={onCloseModal}
      >
        <Dialog.Body className="login-body">
          <Input
            className="input"
            placeholder="请输入你的网易云uid"
            onChange={onUidChange}
          />
          <div className="login-help">
            <div className="login-help">
              <p className="help">
                1、请
                <a href="http://music.163.com" target="_blank">
                  点我(http://music.163.com)
                </a>
                打开网易云音乐官网
              </p>
              <p className="help">2、点击页面右上角的“登录”</p>
              <p className="help">3、点击您的头像，进入我的主页</p>
              <p className="help">
                4、复制浏览器地址栏 /user/home?id= 后面的数字（网易云 UID）
              </p>
            </div>
          </div>
        </Dialog.Body>
        <Dialog.Footer class="dialog-footer">
          <Button
            loading={loading}
            onClick={onLogin}
            className="login-btn"
            type="primary"
          >
            登录
          </Button>
        </Dialog.Footer>
      </Dialog>
    </div>
  )
})
