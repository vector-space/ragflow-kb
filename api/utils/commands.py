#
#  Copyright 2024 The InfiniFlow Authors. All Rights Reserved.
#
#  Licensed under the Apache License, Version 2.0 (the "License");
#  you may not use this file except in compliance with the License.
#  You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS,
#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  See the License for the specific language governing permissions and
#  limitations under the License.
#

import base64
import click
import re

from flask import Flask
from werkzeug.security import generate_password_hash

from api.db.services import UserService
from api.utils import get_uuid, get_format_time


@click.command('reset-password', help='Reset the account password.')
@click.option('--email', prompt=True, help='The email address of the account whose password you need to reset')
@click.option('--new-password', prompt=True, help='the new password.')
@click.option('--password-confirm', prompt=True, help='the new password confirm.')
def reset_password(email, new_password, password_confirm):
    if str(new_password).strip() != str(password_confirm).strip():
        click.echo(click.style('sorry. The two passwords do not match.', fg='red'))
        return
    user = UserService.query(email=email)
    if not user:
        click.echo(click.style('sorry. The Email is not registered!.', fg='red'))
        return
    encode_password = base64.b64encode(new_password.encode('utf-8')).decode('utf-8')
    password_hash = generate_password_hash(encode_password)
    user_dict = {
        'password': password_hash
    }
    UserService.update_user(user[0].id,user_dict)
    click.echo(click.style('Congratulations! Password has been reset.', fg='green'))


@click.command('reset-email', help='Reset the account email.')
@click.option('--email', prompt=True, help='The old email address of the account whose email you need to reset')
@click.option('--new-email', prompt=True, help='the new email.')
@click.option('--email-confirm', prompt=True, help='the new email confirm.')
def reset_email(email, new_email, email_confirm):
    if str(new_email).strip() != str(email_confirm).strip():
        click.echo(click.style('Sorry, new email and confirm email do not match.', fg='red'))
        return
    if str(new_email).strip() == str(email).strip():
        click.echo(click.style('Sorry, new email and old email are the same.', fg='red'))
        return
    user = UserService.query(email=email)
    if not user:
        click.echo(click.style('sorry. the account: [{}] not exist .'.format(email), fg='red'))
        return
    if not re.match(r"^[\w\._-]+@([\w_-]+\.)+[\w-]{2,4}$", new_email):
        click.echo(click.style('sorry. {} is not a valid email. '.format(new_email), fg='red'))
        return
    new_user = UserService.query(email=new_email)
    if new_user:
        click.echo(click.style('sorry. the account: [{}] is exist .'.format(new_email), fg='red'))
        return
    user_dict = {
        'email': new_email
    }
    UserService.update_user(user[0].id,user_dict)
    click.echo(click.style('Congratulations!, email has been reset.', fg='green'))


@click.command('create-superuser', help='Create a superuser account.')
@click.option('--email', 
              prompt=True, 
              default='root@knowledge-base.com',
              show_default=True,
              help='Email address for the superuser')
@click.option('--password', 
              prompt=True, 
              hide_input=True,
              default='123456',
              show_default=True,
              help='Password for the superuser')
@click.option('--password-confirm', 
              prompt=True, 
              hide_input=True,
              default='123456',
              show_default=True,
              help='Confirm password')
@click.option('--nickname',
              prompt=True,
              default='管理员',
              show_default=True,
              help='Nickname for the superuser')
def create_superuser(email, password, password_confirm, nickname):
    # 检查邮箱是否已存在
    if UserService.query(email=email):
        click.echo(click.style('Error: Email already registered.', fg='red'))
        return
    
    # # 验证邮箱格式
    # if not re.match(r"^[\w\._-]+@([\w_-]+\.)+[\w-]{2,4}$", email):
    #     click.echo(click.style('Error: Invalid email format.', fg='red'))
    #     return

    # 验证密码一致性
    if password != password_confirm:
        click.echo(click.style('Error: Passwords do not match.', fg='red'))
        return

    # 密码编码和哈希处理
    encode_password = base64.b64encode(password.encode('utf-8')).decode('utf-8')

    # 创建用户数据
    user_data = {
        "id": get_uuid(),
        "email": email,
        "nickname": nickname,
        "password": encode_password,
        "is_superuser": True,
        "login_channel": "password",
        "last_login_time": get_format_time(),
        "access_token": get_uuid()
    }

    try:
        UserService.save(**user_data)
        # 显示创建结果
        click.echo(click.style('\nSuperuser created:', fg='green', bold=True))
        click.echo(click.style(f'{"Email:":<12} {email}', fg='cyan'))
        click.echo(click.style(f'{"Nickname:":<12} {nickname}', fg='cyan'))
        click.echo(click.style(f'{"Password:":<12} ', fg='cyan') + 
                  click.style(password, fg='red', bold=True))
        click.echo(click.style('⚠️ Password is shown in plain text!', fg='yellow'))
    except Exception as e:
        click.echo(click.style(f'Error: {str(e)}', fg='red'))


def register_commands(app: Flask):
    app.cli.add_command(reset_password)
    app.cli.add_command(reset_email)
    app.cli.add_command(create_superuser)
