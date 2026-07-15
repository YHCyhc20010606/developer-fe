
<!--
  -  Copyright 2021 Huawei Technologies Co., Ltd.
  -
  -  Licensed under the Apache License, Version 2.0 (the "License");
  -  you may not use this file except in compliance with the License.
  -  You may obtain a copy of the License at
  -
  -      http://www.apache.org/licenses/LICENSE-2.0
  -
  -  Unless required by applicable law or agreed to in writing, software
  -  distributed under the License is distributed on an "AS IS" BASIS,
  -  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  -  See the License for the specific language governing permissions and
  -  limitations under the License.
  -->
<template>
  <div class="developer-home">
    <div class="home-layout">
      <!-- 左侧：任务管理列表 -->
      <div class="home-left">
        <div class="task-list-panel">
          <div class="task-list-header">
            <div class="task-list-title">
              {{ $t('home.taskList') }}
            </div>
            <el-button
              size="mini"
              class="new-task-btn"
              @click="openCreateTaskDialog"
            >
              {{ $t('home.newTask') }}
            </el-button>
          </div>
          <el-table
            :data="taskTableData"
            v-loading="tableLoading"
            size="small"
            class="task-table"
          >
            <el-table-column
              prop="taskName"
              :label="$t('home.taskName')"
              width="180"
              header-align="center"
              align="center"
              show-overflow-tooltip
            />
            <el-table-column
              prop="appName"
              :label="$t('home.appName')"
              width="180"
              header-align="center"
              align="center"
              show-overflow-tooltip
            />
            <el-table-column
              :label="$t('home.appStatus')"
              width="120"
              header-align="center"
              align="center"
            >
              <template slot-scope="scope">
                <span :class="scope.row._normal ? 'task-tag task-tag-normal' : 'task-tag task-tag-processing'">
                  {{ scope.row._normal ? $t('home.statusNormal') : $t('home.statusProcessing') }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="createTime"
              :label="$t('home.createTime')"
              width="180"
              header-align="center"
              align="center"
              show-overflow-tooltip
            />
            <el-table-column
              prop="type"
              :label="$t('home.taskType')"
              width="150"
              header-align="center"
              align="center"
              show-overflow-tooltip
            />
            <el-table-column
              :label="$t('home.taskProgress')"
              min-width="160"
              header-align="center"
              align="center"
            >
              <template slot-scope="scope">
                <div class="progress-steps">
                  <div :class="'step ' + getBindStepClass(scope.row)">
                    <span>{{ $t('home.bindApp') }}</span>
                  </div>
                  <div class="step-arrow">
                    ▶
                  </div>
                  <div :class="'step ' + getDeployStepClass(scope.row)">
                    <span>{{ $t('home.appDeploy') }}</span>
                  </div>
                  <div class="step-arrow">
                    ▶
                  </div>
                  <div :class="'step ' + getSignalStepClass(scope.row)">
                    <span>{{ $t('home.signalControl') }}</span>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('home.operation')"
              width="100"
              header-align="center"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  class="task-delete-btn"
                  @click="deleteTask(scope.row)"
                >
                  {{ $t('home.delete') }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="task-pagination">
            <Pagination
              :table-data="allTaskTableData"
              :size="10"
              :show-sizes="false"
              @getCurrentPageData="getCurrentTaskPageData"
            />
          </div>

          <el-dialog
            :visible.sync="createDialogVisible"
            width="550px"
            top="25vh"
            :show-close="false"
            :close-on-click-modal="false"
            class="task-create-dialog"
          >
            <div
              slot="title"
              class="custom-dialog-title"
            >
              <span class="title-square" />
              {{ $t('home.newTask') }}
            </div>
            <el-form
              :model="createTaskForm"
              label-position="right"
              label-width="120px"
              class="task-create-form"
            >
              <el-form-item
                class="task-form-item"
                required
              >
                <template slot="label">
                  <span class="custom-label">{{ $t('home.taskName') }}</span>
                </template>
                <el-input
                  v-model="createTaskForm.taskName"
                  maxlength="32"
                />
              </el-form-item>
              <el-form-item
                class="task-form-item"
                required
              >
                <template slot="label">
                  <span class="custom-label">{{ $t('home.bindApp') }}</span>
                </template>
                <el-select
                  v-model="createTaskForm.appId"
                  filterable
                  :placeholder="$t('home.selectAppPlaceholder')"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in appOptions"
                    :key="item.appId"
                    :label="item.name"
                    :value="item.appId"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                class="task-form-item"
                required
              >
                <template slot="label">
                  <span class="custom-label">{{ $t('home.taskType') }}</span>
                </template>
                <el-select
                  v-model="createTaskForm.taskType"
                  :placeholder="$t('home.taskType')"
                  style="width: 100%"
                >
                  <el-option
                    :label="$t('home.typeVideo')"
                    value="Video"
                  />
                  <el-option
                    :label="$t('home.typeAudio')"
                    value="Audio"
                  />
                  <el-option
                    :label="$t('home.typeImage')"
                    value="Image"
                  />
                </el-select>
              </el-form-item>
            </el-form>
            <span slot="footer">
              <el-button
                @click="createDialogVisible = false"
                class="cancel-btn"
              >
                {{ $t('home.cancel') }}
              </el-button>
              <el-button
                type="primary"
                @click="submitCreateTask"
                class="confirm-btn"
              >
                {{ $t('home.confirm') }}
              </el-button>
            </span>
          </el-dialog>
        </div>
      </div>

      <!-- 右侧：三个功能卡片 -->
      <div class="home-right">
        <div
          v-for="(item, index) in rightBtnList"
          :key="index"
          class="main-content-right-item"
          @click="jumpTo(item.path)"
        >
          <img
            :src="item.src"
            :alt="index"
          >
          <div class="main-content-right-item-name">
            {{ index === 0 ? $t('home.appUpload') : (index === 1 ? $t('home.appDeploy') : $t('home.signalControl')) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { GET, POST, DELETE } from '../../tools/request.js'
import { PROXY_PREFIX_CURRENTSERVER } from '../../tools/constant.js'
import Pagination from '../../components/Pagination.vue'

const apmBase = PROXY_PREFIX_CURRENTSERVER + '/mecm-apm/apm/v1'
const appoBase = PROXY_PREFIX_CURRENTSERVER + '/mecm-appo/appo/v1'
const inventoryBase = PROXY_PREFIX_CURRENTSERVER + '/mecm-inventory/inventory/v1'

export default {
  components: {
    Pagination
  },
  data () {
    return {
      rightBtnList: [
        {
          src: require('../../assets/images/index/index_app_create.png'),
          path: '/appStore/home/index'
        },
        {
          src: require('../../assets/images/index/index_app_store.png'),
          path: '/mecm/mecm/app/deploy'
        },
        {
          src: require('../../assets/images/index/index_app_deploy.png'),
          path: '/mecm/mecm/signaling/manager'
        }
      ],
      taskTableData: [],
      allTaskTableData: [],
      appOptions: [],
      tableLoading: false,
      createDialogVisible: false,
      createTaskForm: {
        taskName: '',
        appId: '',
        taskType: ''
      },
      language: localStorage.getItem('language') || 'cn'
    }
  },
  methods: {
    jumpTo (path) {
      this.$router.push(path)
    },
    getDeployStepClass (row) {
      if (!row._instance) return 'step-todo'
      if (row._instance.operationalStatus === 'Instantiated') return 'step-done'
      return 'step-fail'
    },
    getBindStepClass (row) {
      return row.appId ? 'step-done' : 'step-todo'
    },
    getSignalStepClass (row) {
      if (!row._instance) return 'step-todo'
      if (row._signalStatus === 'SUCCESS') return 'step-done'
      if (row._signalStatus === 'FAILED') return 'step-fail'
      if (row._signalStatus === 'PENDING') return 'step-processing'
      return 'step-todo'
    },
    getInstanceId (instance) {
      if (!instance) return ''
      return instance.appInstanceId || instance.app_instance_id || ''
    },
    async applySignalingProgress (userId, taskRows) {
      const appInstanceIds = Array.from(new Set(taskRows
        .map(row => this.getInstanceId(row._instance))
        .filter(id => !!id)))
      if (!appInstanceIds.length) {
        taskRows.forEach(row => {
          row._signalStatus = 'NONE'
        })
        return
      }

      const progressMap = {}
      try {
        const progressRes = await GET(inventoryBase + '/tenants/' + userId + '/signaling/progress', {
          appInstanceIds: appInstanceIds.join(',')
        })
        const progressData = Array.isArray(progressRes.data && progressRes.data.data) ? progressRes.data.data : []
        progressData.forEach(item => {
          if (item && item.appInstanceId) {
            progressMap[item.appInstanceId] = item.status || 'NONE'
          }
        })
      } catch (e) {
      }

      taskRows.forEach(row => {
        const instanceId = this.getInstanceId(row._instance)
        row._signalStatus = instanceId ? (progressMap[instanceId] || 'NONE') : 'NONE'
      })
    },
    formatCurrentDate () {
      const d = new Date()
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return y + '-' + m + '-' + day
    },
    resetCreateTaskForm () {
      this.createTaskForm = {
        taskName: '',
        appId: '',
        taskType: ''
      }
    },
    async fetchPackages () {
      const pkgRes = await GET(apmBase + '/apps/syncstatus')
      return Array.isArray(pkgRes.data) ? pkgRes.data : []
    },
    refreshAppOptionsFromPackages (packages) {
      const appMap = {}
      packages.forEach(item => {
        if (item && item.appId && item.name) {
          appMap[item.appId] = item.name
        }
      })
      this.appOptions = Object.keys(appMap).map(appId => ({
        appId: appId,
        name: appMap[appId]
      }))
    },
    async openCreateTaskDialog () {
      try {
        const packages = await this.fetchPackages()
        this.refreshAppOptionsFromPackages(packages)
      } catch (e) {
        this.appOptions = []
      }
      this.resetCreateTaskForm()
      this.createDialogVisible = true
      if (!this.appOptions.length) {
        this.$message.warning(this.$t('home.selectAppPlaceholder'))
      }
    },
    async submitCreateTask () {
      if (!this.createTaskForm.taskName.trim()) {
        this.$message.warning(this.$t('home.taskNameRequired'))
        return
      }
      if (!this.createTaskForm.appId) {
        this.$message.warning(this.$t('home.appRequired'))
        return
      }
      if (!this.createTaskForm.taskType) {
        this.$message.warning(this.$t('home.taskTypeRequired'))
        return
      }
      const selected = this.appOptions.find(item => item.appId === this.createTaskForm.appId)
      const userId = sessionStorage.getItem('userId') || ''
      const payload = {
        taskName: this.createTaskForm.taskName.trim(),
        appId: this.createTaskForm.appId,
        appName: selected ? selected.name : '',
        taskType: this.createTaskForm.taskType,
        createdTime: this.formatCurrentDate()
      }
      try {
        await POST(inventoryBase + '/tenants/' + userId + '/tasks', payload)
        this.createDialogVisible = false
        this.$message.success(this.$t('home.createTaskSuccess'))
        this.loadTaskList()
      } catch (e) {
        this.$message.error(this.$t('home.createTaskFail'))
      }
    },
    async deleteTask (row) {
      try {
        await this.$confirm(
          this.$t('home.deleteConfirm'),
          this.$t('home.deleteTitle'),
          { type: 'warning', confirmButtonText: this.$t('home.confirm'), cancelButtonText: this.$t('home.cancel') }
        )
      } catch (e) {
        return
      }

      const userId = sessionStorage.getItem('userId') || ''
      const appInstanceId = this.getInstanceId(row._instance)
      try {
        if (appInstanceId) {
          await DELETE(appoBase + '/tenants/' + userId + '/app_instances/' + appInstanceId)
        }
        await DELETE(inventoryBase + '/tenants/' + userId + '/tasks/' + row.id, {
          appInstanceId: appInstanceId
        })
        this.$message.success(this.$t('home.deleteSuccess'))
        await this.loadTaskList()
      } catch (e) {
        this.$message.error(this.$t('home.deleteFail'))
      }
    },
    async loadTaskList () {
      this.tableLoading = true
      const userId = sessionStorage.getItem('userId') || ''
      try {
        const packages = await this.fetchPackages()
        this.refreshAppOptionsFromPackages(packages)
        const packageMap = {}
        packages.forEach(item => {
          if (item && item.appId) {
            packageMap[item.appId] = item
          }
        })
        let instances = []
        try {
          const instRes = await GET(appoBase + '/tenants/' + userId + '/app_instance_infos')
          const raw = instRes.data
          // APPO 接口返回格式为 { response: [...] }
          instances = Array.isArray(raw) ? raw : (Array.isArray(raw && raw.response) ? raw.response : [])
        } catch (e) {
          instances = []
        }
        let records = []
        try {
          const taskRes = await GET(inventoryBase + '/tenants/' + userId + '/tasks')
          records = Array.isArray(taskRes.data) ? taskRes.data : []
        } catch (e) {
          records = []
        }
        const taskRows = records.map(record => {
          const pkg = packageMap[record.appId]
          const matched = instances.find(inst => inst.appId === record.appId)
          return {
            id: record.taskId || record.id,
            taskName: record.taskName,
            appId: record.appId,
            appName: record.appId ? ((pkg && pkg.name) || record.appName || '') : '',
            createTime: record.createdTime ? String(record.createdTime).split('T')[0] : '',
            type: record.taskType,
            _instance: matched || null,
            _normal: !!(matched && matched.operationalStatus === 'Instantiated'),
            _signalStatus: 'NONE'
          }
        })
        await this.applySignalingProgress(userId, taskRows)
        this.allTaskTableData = taskRows
        this.taskTableData = []
      } catch (e) {
        this.allTaskTableData = []
        this.taskTableData = []
      } finally {
        this.tableLoading = false
      }
    },
    getCurrentTaskPageData (data) {
      this.taskTableData = data
    }
  },
  watch: {
    '$i18n.locale' () {
      this.language = localStorage.getItem('language')
    }
  },
  mounted () {
    sessionStorage.removeItem('applicationId')
    this.$store.commit('changeFlow', '0')
    this.$store.commit('changeApp', '5G')
    this.loadTaskList()
    // 当用户从 iframe 切回首页时，重新拉取数据
    this._onVisibility = () => {
      if (document.visibilityState === 'visible') this.loadTaskList()
    }
    this._onFocus = () => { this.loadTaskList() }
    document.addEventListener('visibilitychange', this._onVisibility)
    window.addEventListener('focus', this._onFocus)
  },
  beforeDestroy () {
    document.removeEventListener('visibilitychange', this._onVisibility)
    window.removeEventListener('focus', this._onFocus)
  }
}
</script>

<style lang='less'>
.developer-home {
  width: 100%;
  height: 100%;
  padding: 120px 0 0 3%;
  box-sizing: border-box;

  .home-layout {
    display: flex;
    align-items: flex-start;
    width: 100%;
    height: 100%;
    gap: 20px;
  }

  /* 左侧任务列表 */
  .home-left {
    flex: 0 0 80%;
    max-width: 80%;
    margin-top: 0px;
    margin-left: 6%;
    min-height: 650px; /* 设置最小高度 */
    height: auto; /* 确保内容区域可以扩展 */
    flex-grow: 1; /* 让左侧区域填充剩余空间 */

    .task-list-panel {
      background: rgba(255, 255, 255, 0.07);
      border: 1px solid rgba(255, 255, 255, 0.18);
      border-radius: 12px;
      padding: 20px 24px 30px;
      overflow-x: auto;
      min-height: 650px;
      display: flex;
      flex-direction: column;

      .task-list-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
      }

      .task-list-title {
        font-size: 18px;
        font-weight: bold;
        color: #fff;
        text-align: left;
        &::before {
          content: '';
          display: inline-block;
          width: 14px;
          height: 14px;
          background: #55d8bf;
          border-radius: 3px;
          position: relative;
          top: 2px;
          margin-right: 10px;
        }
      }

      .new-task-btn {
        background: #3f57e8;
        border: 1px solid #6f83ff;
        color: #fff;
        border-radius: 4px;
        padding: 7px 14px;
        &:hover, &:focus {
          background: #5b70f0;
          border-color: #96a5ff;
          color: #fff;
        }
      }

      /* 覆盖 el-table 为深色主题 */
      .task-table {
        width: 100%;
        background-color: transparent;
        color: #fff;
        &::before { background-color: rgba(255, 255, 255, 0.12); }
        tr { background-color: transparent !important; }
        .el-table__header-wrapper {
          th {
            background-color: rgba(255, 255, 255, 0.1) !important;
            color: #fff;
            font-weight: bold;
            border-bottom: 1px solid rgba(255, 255, 255, 0.15);
          }
        }
        .el-table__body-wrapper {
          background-color: transparent;
          td {
            background-color: transparent !important;
            color: #fff;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          }
          tr:hover > td {
            background-color: rgba(255, 255, 255, 0.07) !important;
          }
        }
        .el-table__empty-block { background-color: transparent; }
        .el-table__empty-text { color: rgba(255, 255, 255, 0.45); }
        .el-loading-mask { background-color: rgba(30, 10, 80, 0.6); }
      }

      .task-pagination {
        margin-top: auto;
        padding-top: 12px;
        display: flex;
        justify-content: flex-end;

        .custom_pagination {
          padding: 0;
          height: auto;

          .rt {
            float: none;
          }
        }
      }

      /* 状态标签 */
      .task-tag {
        display: inline-block;
        padding: 2px 10px;
        border-radius: 10px;
        font-size: 12px;
        font-weight: bold;
      }
      .task-tag-normal {
        background: rgba(39, 174, 96, 0.2);
        color: #5dea96;
        border: 1px solid #5dea96;
      }
      .task-tag-processing {
        background: rgba(230, 126, 34, 0.2);
        color: #f39c43;
        border: 1px solid #f39c43;
      }

      /* 操作按钮 */
      .task-delete-btn {
        min-width: 64px;
        background: rgba(255, 100, 100, 0.18);
        border: 1px solid rgba(255, 130, 130, 0.55);
        color: #ffaaaa;
        border-radius: 4px;
        padding: 7px 14px;
        &:hover, &:focus {
          background: rgba(255, 100, 100, 0.32);
          border-color: #ff8080;
          color: #ffcece;
        }
        &.task-delete-disabled {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: rgba(255, 255, 255, 0.25);
          cursor: not-allowed;
          pointer-events: none;
        }
      }

      /* 任务进度步骤 */
      .progress-steps {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        .step {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 2px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: bold;
          border: 1px solid;
          min-width: 52px;
          text-align: center;
        }
        .step-done {
          background: rgba(39, 174, 96, 0.2);
          color: #5dea96;
          border-color: #5dea96;
        }
        .step-fail {
          background: rgba(192, 57, 43, 0.2);
          color: #ff8080;
          border-color: #ff8080;
        }
        .step-processing {
          background: rgba(243, 156, 67, 0.2);
          color: #f39c43;
          border-color: #f39c43;
        }
        .step-todo {
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.2);
        }
        .step-arrow {
          color: rgba(255, 255, 255, 0.3);
          font-size: 10px;
          line-height: 1;
        }
      }
    }
  }

  .task-create-dialog {
    .el-dialog {
      background: #fdfdfd;
      border: 1px solid #e8e8ef;
      border-radius: 4px; /* 四边更方的角 */
    }
    .custom-dialog-title {
      font-size: 16px;
      font-weight: bold;
      color: #6a4cdb;
      display: flex;
      align-items: center;
      .title-square {
        display: inline-block;
        width: 12px;
        height: 12px;
        background-color: #5dea96;
        margin-right: 8px;
        border-radius: 2px;
      }
    }
    .task-form-item {
      margin-bottom: 24px;
    }
    .custom-label {
      font-size: 14px;
      font-weight: 500;
      color: #6a4cdb;
    }
    .el-form-item__label {
      padding-right: 12px;
    }
    .el-input__inner,
    .el-select .el-input__inner {
      background: #fff;
      border-color: #d4d7de;
      color: #303133;
      border-radius: 4px;
    }
    .el-input__inner::placeholder {
      color: #b7bde6;
    }
    .el-dialog__footer .el-button {
      border-radius: 4px;
    }
    .cancel-btn {
      background: #fff;
      color: #6a4cdb;
      border-color: #6a4cdb;
    }
    .confirm-btn {
      background: #6a4cdb;
      border-color: #6a4cdb;
    }
  }

  /* 右侧三个卡片 */
  .home-right {
    flex: 0 0 24%;
    max-width: 24%;
    margin-left: 1%;
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 600px;
    gap: 20px;

    .main-content-right-item {
      flex: 1;
      width: 100%;
      height: auto;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding-left: 30px;
      overflow: hidden;
      background: rgb(46, 20, 124, 0.7);
      opacity: 0.5;
      border-radius: 17px;
      transition: transform 0.3s ease-in;
      cursor: pointer;
      color: #fff;
      text-align: center;

      img {
        position: relative;
        top: 0;
        left: 0;
        width: auto;
        height: 60%;
        margin-right: 20px;
      }

      .main-content-right-item-name {
        position: relative;
        top: 0;
        font-size: 26px;
        font-weight: bold;
      }

      &:hover {
        transform: translate3d(20px, 0, 0);
        border: 3px solid #42F6AC;
        opacity: 1;
      }
    }
  }
}
</style>
