import { useShowDeleteConfirm } from '@/hooks/common-hooks';
import { useDeleteUser, useFetchUserList } from '@/hooks/user-setting-hooks';
import { IUserInfo } from '@/interfaces/database/user-setting';
import { formatDate } from '@/utils/date';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import { Button, Table, Tag } from 'antd';
import { upperFirst } from 'lodash';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import EditModal from './edit-model';
import { useEditUserModal } from './hooks';

const ColorMap = {
  super: 'red',
  normal: 'green',
};

const UserTable = () => {
  const { data, loading } = useFetchUserList();
  const { t } = useTranslation();
  const { deleteUser } = useDeleteUser();
  const showDeleteConfirm = useShowDeleteConfirm();

  const handleDelete = (userId: string) => {
    showDeleteConfirm({
      title: t('setting.sureDeleteUser'),
      onOk: async () => {
        await deleteUser(userId);
      },
    });
  };

  const { editModalVisible, hideEditModal, showEditModal, handleEditOk } =
    useEditUserModal();
  const [selectedUser, setSelectedUser] = useState<IUserInfo | null>(null);

  const handleEditClick = (user: IUserInfo) => {
    setSelectedUser(user);
    showEditModal();
  };

  const columns: TableProps<IUserInfo>['columns'] = [
    {
      title: t('common.name'),
      dataIndex: 'nickname',
      key: 'nickname',
    },
    {
      title: t('setting.email'),
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: t('setting.role'),
      key: 'role',
      render(_, record) {
        const roleType = record.is_superuser ? 'super' : 'normal';
        const roleText = record.is_superuser
          ? t('setting.superUser')
          : t('setting.normalUser');

        return <Tag color={ColorMap[roleType]}>{upperFirst(roleText)}</Tag>;
      },
    },
    {
      title: t('setting.registerDate'),
      dataIndex: 'create_time',
      key: 'create_time',
      render(value) {
        return formatDate(value);
      },
    },
    {
      title: t('common.action'),
      key: 'action',
      render: (_, record) => (
        <div>
          <Button
            type="text"
            onClick={() => handleEditClick(record)}
            disabled={record.is_superuser}
          >
            <EditOutlined />
          </Button>
          <Button
            type="text"
            onClick={() => handleDelete(record.id)}
            disabled={record.is_superuser}
          >
            <DeleteOutlined />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Table<IUserInfo>
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={false}
        bordered
        scroll={{ x: 800 }}
      />
      <EditModal
        visible={editModalVisible}
        hideModal={hideEditModal}
        onOk={(values) => {
          handleEditOk(selectedUser.id, values);
        }}
        loading={loading}
        initialValues={selectedUser}
      />
    </div>
  );
};

export default UserTable;
