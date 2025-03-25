import { useTranslate } from '@/hooks/common-hooks';
import { useFetchUserInfo, useSaveSetting } from '@/hooks/user-setting-hooks';
import {
  getBase64FromUploadFileList,
  getUploadFileListFromBase64,
} from '@/utils/file-util';
import { UserOutlined } from '@ant-design/icons';
import { Card, Divider, Select, Space, Spin, UploadFile } from 'antd';
import { useEffect } from 'react';
import SettingTitle from '../components/setting-title';
import { useValidateSubmittable } from '../hooks';
import styles from './index.less';
import UserTable from './user-table';

const iconStyle = { fontSize: 20, color: '#1677ff' };

const { Option } = Select;

type FieldType = {
  nickname?: string;
  language?: string;
  email?: string;
  color_schema?: string;
  timezone?: string;
  avatar?: string;
};

const tailLayout = {
  wrapperCol: { offset: 20, span: 4 },
};

const UserSettingAdmin = () => {
  const { data: userInfo, loading } = useFetchUserInfo();
  const { saveSetting, loading: submitLoading } = useSaveSetting();
  const { form, submittable } = useValidateSubmittable();
  const { t } = useTranslate('setting');
  // const changeLanguage = useChangeLanguage();

  const onFinish = async (values: any) => {
    const avatar = await getBase64FromUploadFileList(values.avatar);
    saveSetting({ ...values, avatar });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  useEffect(() => {
    const fileList: UploadFile[] = getUploadFileListFromBase64(userInfo.avatar);
    form.setFieldsValue({ ...userInfo, avatar: fileList });
  }, [form, userInfo]);

  return (
    <section className={styles.profileWrapper}>
      <SettingTitle
        title={t('admin')}
        description={t('adminDescription')}
      ></SettingTitle>
      <Divider />
      <Spin spinning={loading}>
        <Card
          title={
            <Space>
              <UserOutlined style={iconStyle} /> {t('userList')}
            </Space>
          }
          bordered={false}
        >
          <UserTable></UserTable>
        </Card>
      </Spin>
    </section>
  );
};

export default UserSettingAdmin;
