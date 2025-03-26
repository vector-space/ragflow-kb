// 注册模态框组件 RegisterModal.tsx
import { IModalProps } from '@/interfaces/common';
import { Form, Input, Modal } from 'antd';
// import { useTranslation } from 'react-i18next';
import { useTranslate } from '@/hooks/common-hooks';
import { rsaPsw } from '@/utils';

const RegisterModal = ({
  visible,
  hideModal,
  loading,
  onOk,
}: IModalProps<{ email: string; password: string; nickname: string }>) => {
  const [form] = Form.useForm();
  // const { t } = useTranslation();
  const { t } = useTranslate('setting');

  type FieldType = {
    email?: string;
    password?: string;
    nickname?: string;
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    const encryptedPassword = rsaPsw(values.password) as string;
    return onOk?.({
      ...values,
      password: encryptedPassword,
    });
  };

  return (
    <Modal
      title={t('register')}
      open={visible}
      onOk={handleOk}
      onCancel={hideModal}
      okButtonProps={{ loading }}
      confirmLoading={loading}
      destroyOnClose
    >
      <Form
        name="register"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        autoComplete="off"
        form={form}
        preserve={false}
      >
        <Form.Item<FieldType>
          label={t('email')}
          name="email"
          rules={[{ required: true, type: 'email' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label={t('nickname')}
          name="nickname"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label={t('password')}
          name="password"
          rules={[{ required: true, min: 6 }]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RegisterModal;
