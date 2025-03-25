import { useFetchUserList } from '@/hooks/user-setting-hooks';
import { IUserInfo } from '@/interfaces/database/user-setting';
import { formatDate } from '@/utils/date';
import { DeleteOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import { Button, Table, Tag } from 'antd';
import { upperFirst } from 'lodash';
import { useTranslation } from 'react-i18next';
// import { UserRole } from '../constants';
// import { useHandleDeleteUser } from './hooks';

const ColorMap = {
  super: 'red',
  normal: 'green',
};

const UserTable = () => {
  const { data, loading } = useFetchUserList();
  //   const { handleDeleteUser } = useHandleDeleteUser();
  const { t } = useTranslation();

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
          //   onClick={() => handleDeleteUser(record.user_id)}
          disabled={record.is_superuser}
        >
          <DeleteOutlined />
        </Button>
      ),
    },
  ];

  return (
    <Table<IUserInfo>
      rowKey="user_id"
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
