// 注册相关hook use-register-hook.ts
import { useSetModalState } from '@/hooks/common-hooks';
import { useRegister } from '@/hooks/login-hooks';
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
