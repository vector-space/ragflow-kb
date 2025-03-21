import { LanguageList, LanguageMap } from '@/constants/common';
import { useTranslate } from '@/hooks/common-hooks';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Divider,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Spin,
  Table,
} from 'antd';
import { useState } from 'react';
import SettingTitle from '../components/setting-title';
import { TimezoneList } from '../constants';
import {
  useDeleteUser,
  useGetUsers,
  useRegisterUser,
  useUpdateUser,
} from './hooks';
import styles from './index.less';

const { Option } = Select;

type UserType = {
  id: string;
  nickname: string;
  email: string;
  language: string;
  color_schema: string;
  timezone: string;
};

const UserSettingAdmin = () => {
  const { data: users, loading } = useGetUsers();
  const { mutate: registerUser } = useRegisterUser();
  const { mutate: updateUser } = useUpdateUser();
  const { mutate: deleteUser } = useDeleteUser();
  const { t } = useTranslate('setting');
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUserId, setEditingUserId] = useState('');

  const showModal = () => {
    setIsModalVisible(true);
    setIsEditing(false);
    form.resetFields();
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    if (isEditing) {
      updateUser(editingUserId, values);
    } else {
      registerUser(values);
    }
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleEdit = (user: UserType) => {
    setIsModalVisible(true);
    setIsEditing(true);
    setEditingUserId(user.id);
    form.setFieldsValue(user);
  };

  const handleDelete = (userId: string) => {
    deleteUser(userId);
  };

  const columns = [
    {
      title: t('username'),
      dataIndex: 'nickname',
      key: 'nickname',
    },
    {
      title: t('email'),
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: t('language', { keyPrefix: 'common' }),
      dataIndex: 'language',
      key: 'language',
      render: (text) => LanguageMap[text as keyof typeof LanguageMap],
    },
    {
      title: t('colorSchema'),
      dataIndex: 'color_schema',
      key: 'color_schema',
    },
    {
      title: t('timezone'),
      dataIndex: 'timezone',
      key: 'timezone',
    },
    {
      title: t('common.action'),
      key: 'action',
      render: (_, user: UserType) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(user)}
          >
            {t('edit')}
          </Button>
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(user.id)}
          >
            {t('delete')}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <section className={styles.profileWrapper}>
      <SettingTitle
        title={t('admin')}
        description={t('adminDescription')}
      ></SettingTitle>
      <Divider />
      <Spin spinning={loading}>
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          {t('registerUser')}
        </Button>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={users}
          pagination={false}
          style={{ marginTop: 20 }}
        />
      </Spin>
      <Modal
        title={isEditing ? t('editUser') : t('registerUser')}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          colon={false}
          name="basic"
          labelAlign={'left'}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ width: '100%' }}
          initialValues={{ remember: true }}
          autoComplete="off"
        >
          <Form.Item
            label={t('username')}
            name="nickname"
            rules={[
              {
                required: true,
                message: t('usernameMessage'),
                whitespace: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={t('email')}
            name="email"
            rules={[
              {
                required: true,
                message: t('emailMessage'),
                type: 'email',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={t('language', { keyPrefix: 'common' })}
            name="language"
            rules={[
              {
                required: true,
                message: t('languageMessage', { keyPrefix: 'common' }),
              },
            ]}
          >
            <Select
              placeholder={t('languagePlaceholder', { keyPrefix: 'common' })}
            >
              {LanguageList.map((x) => (
                <Option value={x} key={x}>
                  {LanguageMap[x as keyof typeof LanguageMap]}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label={t('colorSchema')}
            name="color_schema"
            rules={[{ required: true, message: t('colorSchemaMessage') }]}
          >
            <Select placeholder={t('colorSchemaPlaceholder')}>
              <Option value="Bright">{t('bright')}</Option>
              <Option value="Dark">{t('dark')}</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label={t('timezone')}
            name="timezone"
            rules={[{ required: true, message: t('timezoneMessage') }]}
          >
            <Select placeholder={t('timezonePlaceholder')} showSearch>
              {TimezoneList.map((x) => (
                <Option value={x} key={x}>
                  {x}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
};

export default UserSettingAdmin;
