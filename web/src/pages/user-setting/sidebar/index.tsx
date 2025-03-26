import { Domain } from '@/constants/common';
import { useTranslate } from '@/hooks/common-hooks';
import { useLogout } from '@/hooks/login-hooks';
import { useSecondPathName } from '@/hooks/route-hook';
import {
  useFetchSystemVersion,
  useFetchUserInfo,
} from '@/hooks/user-setting-hooks';
import type { MenuProps } from 'antd';
import { Flex, Menu } from 'antd';
import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'umi';
import {
  UserSettingBaseKey,
  UserSettingIconMap,
  UserSettingRouteKey,
} from '../constants';
import styles from './index.less';

type MenuItem = Required<MenuProps>['items'][number];

const SideBar = () => {
  const navigate = useNavigate();
  const pathName = useSecondPathName();
  const { logout } = useLogout();
  const { t } = useTranslate('setting');
  const { version, fetchSystemVersion } = useFetchSystemVersion();
  const { data: userInfo } = useFetchUserInfo(); // get user info in order to determine whether the current user is an admin

  useEffect(() => {
    if (location.host !== Domain) {
      fetchSystemVersion();
    }
  }, [fetchSystemVersion]);

  function getItem(
    label: string,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label: (
        <Flex justify={'space-between'}>
          {t(label)}
          <span className={styles.version}>
            {label === 'system' && version}
          </span>
        </Flex>
      ),
      type,
    } as MenuItem;
  }

  // 过滤菜单项的逻辑
  const filteredRouteKeys = useMemo(() => {
    const baseKeys = Object.values(UserSettingRouteKey);

    // 如果用户不是管理员，过滤掉Admin项
    if (!userInfo?.is_superuser) {
      return baseKeys.filter((key) => key !== UserSettingRouteKey.Admin);
    }
    return baseKeys;
  }, [userInfo?.is_superuser]); // 依赖用户权限状态

  const items: MenuItem[] = filteredRouteKeys.map((value) =>
    getItem(value, value, UserSettingIconMap[value]),
  );

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === UserSettingRouteKey.Logout) {
      logout();
    } else {
      navigate(`/${UserSettingBaseKey}/${key}`);
    }
  };

  const selectedKeys = useMemo(() => {
    return [pathName];
  }, [pathName]);

  return (
    <section className={styles.sideBarWrapper}>
      <Menu
        selectedKeys={selectedKeys}
        mode="inline"
        items={items}
        onClick={handleMenuClick}
        style={{ width: 312 }}
      />
    </section>
  );
};

export default SideBar;
