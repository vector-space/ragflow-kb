import { useSetModalState } from '@/hooks/common-hooks';
import { useRegister } from '@/hooks/login-hooks';
import { useEditUser } from '@/hooks/user-setting-hooks';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export const useRegisterUser = () => {
  const { register } = useRegister();
  const { t } = useTranslation();
  const {
    visible: registerModalVisible,
    hideModal: hideRegisterModal,
    showModal: showRegisterModal,
  } = useSetModalState();

  const handleRegisterOk = useCallback(
    async (values: { nickname: string; email: string; password: string }) => {
      const code = await register(values);
      if (code === 0) {
        hideRegisterModal();
      }
    },
    [register, hideRegisterModal],
  );

  return {
    registerModalVisible,
    hideRegisterModal,
    showRegisterModal,
    handleRegisterOk,
  };
};

export const useEditUserModal = () => {
  const { editUser } = useEditUser();
  const { t } = useTranslation();
  const {
    visible: editModalVisible,
    hideModal: hideEditModal,
    showModal: showEditModal,
  } = useSetModalState();

  const handleEditOk = useCallback(
    async (userId: string, values: { nickname: string; password?: string }) => {
      const params = {
        nickname: values.nickname,
        ...(values.password && { new_password: values.password }),
      };
      const code = await editUser({ userId, userInfo: params });
      if (code === 0) {
        hideEditModal();
      }
    },
    [editUser, hideEditModal],
  );

  return {
    editModalVisible,
    hideEditModal,
    showEditModal,
    handleEditOk,
  };
};
