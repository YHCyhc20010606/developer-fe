/*
 *  Copyright 2021 Huawei Technologies Co., Ltd.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
import { NAV_PRE } from '../constants'

const pathPre = NAV_PRE.MECM

const mecmNavData = [
  {
    'id': '3.1',
    'icon': '',
    'name': 'Overview',
    'path': pathPre + '/',
    'pageId': '2.0',
    'display': false
  },
  {
    'id': '3.2',
    'name': 'App Deployment',
    'path': pathPre + '/mecm/app/deploy',
    'pageId': '2.0.1',
    'display': false
  },
  {
    'id': '3.3',
    'name': 'Edge Nodes',
    'path': pathPre + '/mecm/node/index',
    'pageId': '2.0.2',
    'display': false
  }
  /* [移除] 2026-01-05 移除MECM下的Systems子菜单
  {
    'id': '3.4',
    'name': 'Systems',
    'path': pathPre + '/systems',
    'pageId': '2.0.3',
    'display': false,
    'children': [
      {
        'id': '3.4.1',
        'name': 'MEPM',
        'path': pathPre + '/mecm/system/mepm',
        'pageId': '2.0.3.1.1',
        'display': false
      },
      {
        'id': '3.4.2',
        'name': 'App Store',
        'path': pathPre + '/mecm/system/appstore',
        'pageId': '2.0.3.1.3',
        'display': false
      }
    ]
  },
  */
  /* [隐藏] 2026-04-06 隐藏MECM下的Resource Management菜单
  {
    'id': '3.5',
    'name': 'Resource Management',
    'path': pathPre + '/mecm/resource/manager',
    'pageId': '2.0.4',
    'display': false
  }
  */
]

export {
  mecmNavData
}
