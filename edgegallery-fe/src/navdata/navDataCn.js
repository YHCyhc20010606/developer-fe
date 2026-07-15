
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
// [移除] 2026-01-05 移除集成开发(Developer)菜单项
// import { devNavData } from './devNavCn.js'
// [修改] 2026-01-05 应用仓库直接跳转，不需要子菜单
// import { appStoreNavData } from './appStoreNavCn.js'
import { mecmNavData } from './mecmNavCn.js'
// [移除] 2026-01-05 移除系统(System)菜单项
// import { systemNavData } from './thirdSystemCn.js'
import { FIRST_LEVEL_MENU_PATH } from '../constants'

const navDataCn = [
  {
    id: '0',
    name: '首页',
    path: FIRST_LEVEL_MENU_PATH.HOME,
    display: true
  },
  /* [移除] 2026-01-05 移除集成开发(Developer)菜单项
  {
    id: '1',
    name: '集成开发',
    path: FIRST_LEVEL_MENU_PATH.DEVELOPER,
    display: true,
    children: devNavData
  },
  */
  {
    id: '3',
    name: '仓库中心',
    // [修改] 2026-01-05 直接跳转到应用仓库列表页，不显示下拉菜单
    path: FIRST_LEVEL_MENU_PATH.APPSTORE + '/index',
    display: true
    // children: appStoreNavData // 已移除子菜单
  },
  {
    id: '4',
    name: 'MECM管理平台',
    path: FIRST_LEVEL_MENU_PATH.MECM,
    display: true,
    children: mecmNavData
  },
  {
    id: '6',
    name: '规则下发',
    path: FIRST_LEVEL_MENU_PATH.SIGNALING,
    display: true
  }
  /* [移除] 2026-01-05 移除系统(System)菜单项
  ,
  {
    id: '5',
    name: '系统',
    path: '../pages/System.vue',
    display: true,
    children: systemNavData
  }
  */
]

export default navDataCn
