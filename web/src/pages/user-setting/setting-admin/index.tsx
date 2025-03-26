import { useTranslate } from '@/hooks/common-hooks';
import { useFetchUserInfo, useSaveSetting } from '@/hooks/user-setting-hooks';
import { TeamOutlined, UserAddOutlined } from '@ant-design/icons';
import { Button, Card, Flex, Space } from 'antd';
import { useValidateSubmittable } from '../hooks';
import { useRegisterUser } from './hooks';
import styles from './index.less';
import RegisterModal from './register-model';
import UserTable from './user-table';

const iconStyle = { fontSize: 20, color: '#1677ff' };

const UserSettingAdmin = () => {
  const { data: userInfo, loading } = useFetchUserInfo();
  const { saveSetting, loading: submitLoading } = useSaveSetting();
  const { form, submittable } = useValidateSubmittable();
  const { t } = useTranslate('setting');

  const {
    registerModalVisible,
    hideRegisterModal,
    showRegisterModal,
    handleRegisterOk,
  } = useRegisterUser();

  return (
    <div className={styles.adminWrapper}>
      <Card className={styles.adminWrapper}>
        <Flex align="center" justify={'space-between'}>
          <span>{t('admin')}</span>
          <Button type="primary" onClick={showRegisterModal}>
            <UserAddOutlined />
            {t('register')}
          </Button>
        </Flex>
      </Card>

      <Card
        className={styles.adminWrapper}
        title={
          <Space>
            <TeamOutlined style={iconStyle} /> {t('userList')}
          </Space>
        }
        bordered={false}
      >
        <UserTable></UserTable>
      </Card>

      <RegisterModal
        visible={registerModalVisible}
        hideModal={hideRegisterModal}
        onOk={handleRegisterOk}
      />
    </div>
  );
};

export default UserSettingAdmin;
