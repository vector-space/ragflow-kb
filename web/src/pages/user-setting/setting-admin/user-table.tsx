import { useShowDeleteConfirm } from '@/hooks/common-hooks';
import { useDeleteUser, useFetchUserList } from '@/hooks/user-setting-hooks';
import { IUserInfo } from '@/interfaces/database/user-setting';
import { formatDate } from '@/utils/date';
import { DeleteOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import { Button, Table, Tag } from 'antd';
import { upperFirst } from 'lodash';
import { useTranslation } from 'react-i18next';

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
        <Button
          type="text"
          onClick={() => handleDelete(record.id)}
          disabled={record.is_superuser}
          // danger
        >
          <DeleteOutlined />
        </Button>
      ),
    },
  ];

  return (
    <Table<IUserInfo>
      rowKey="id"
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={false}
      bordered
      scroll={{ x: 800 }}
    />
  );
};

export default UserTable;
