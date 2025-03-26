import { IModalProps } from '@/interfaces/common';
import { IUserInfo } from '@/interfaces/database/user-setting';
import { rsaPsw } from '@/utils';
import { Form, Input, Modal } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface EditModalProps
  extends IModalProps<{ nickname: string; password?: string }> {
  initialValues?: IUserInfo;
}

const EditModal = ({
  visible,
  hideModal,
  loading,
  onOk,
  initialValues,
}: EditModalProps) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue({
        nickname: initialValues.nickname,
        email: initialValues.email,
        password: undefined, // 清空密码字段
      });
    }
  }, [visible, initialValues, form]);

  const handleOk = async () => {
    const values = await form.validateFields();
    const updateData: Record<string, any> = {
      nickname: values.nickname,
    };
    if (values.password) {
      updateData.password = rsaPsw(values.password);
    }
    return onOk?.(updateData);
  };

  return (
    <Modal
      title={t('setting.editUser')}
      open={visible}
      onOk={handleOk}
      onCancel={hideModal}
      okButtonProps={{ loading }}
      confirmLoading={loading}
      destroyOnClose
    >
      <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        initialValues={initialValues}
      >
        <Form.Item
          label={t('setting.email')}
          name="email"
          rules={[{ required: true }]}
        >
          <Input disabled />
        </Form.Item>

        <Form.Item
          label={t('common.name')}
          name="nickname"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={t('setting.newPassword')}
          name="password"
          rules={[{ min: 6 }]}
        >
          <Input.Password placeholder={t('setting.leaveBlank')} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditModal;
