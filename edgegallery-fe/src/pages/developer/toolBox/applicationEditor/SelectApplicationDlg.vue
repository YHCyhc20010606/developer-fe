<!--
  -  Copyright 2022 Huawei Technologies Co., Ltd.
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
  <div class="select_app_main">
    <el-dialog
      :visible.sync="isSelectVisible"
      :close-on-click-modal="false"
      class="default_dialog"
    >
      <div
        class="common-dlg-title"
      >
        {{ $t('toolBox.appEditor.editAppTitle') }}
      </div>
      <div>
        <el-table
          row-key="hostId"
          :data="allAppData"
          v-loading="isAppPackagesData"
          class="common-table"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            prop="name"
            :label="$t('common.name')"
            min-width="10%"
          />
          <el-table-column
            prop="version"
            :label="$t('devSystem.capability.version')"
            min-width="10%"
          />
          <el-table-column
            prop="provider"
            :label="$t('toolBox.provider')"
            min-width="10%"
          />
          <el-table-column
            prop="industry"
            :label="$t('devSystem.industry')"
            min-width="10%"
          />
          <el-table-column
            prop="type"
            :label="$t('devSystem.type')"
            min-width="15%"
          />
          <el-table-column
            prop="affinity"
            :label="$t('toolBox.architecture')"
            min-width="10%"
          />
          <template slot="empty">
            <div class="empty_img">
              <p>{{ $t('platformCapability.noDataNotice') }}</p>
            </div>
          </template>
        </el-table>
        <div class="pagebar">
          <pagination
            :table-data="allAppData"
            :list-total="listTotal"
            @getCurrentPageData="getCurrentPageData"
            ref="pagination"
          />
        </div>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="closeDlg"
          class="bgBtn"
        >
          {{ $t('common.cancel') }}
        </el-button>
        <el-button
          type="primary"
          size="medium"
          @click="confirm()"
          class="bgBtn"
        >
          {{ $t('common.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import pagination from '../../../../components/Pagination.vue'
import { applicationEditorApi } from '../../../../api/developerApi.js'
import { appstoreApi } from '../../../../api/appstoreApi.js'
import commonUtil from '../../../../tools/devCommonUtil.js'
export default {
  name: 'SelectApplicationDlg',
  components: {
    pagination
  },
  props: {
    isSelectVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      limitSize: 10,
      offsetPage: 0,
      listTotal: 0,
      allAppData: [],
      syncParams: [],
      appIdArr: [],
      isAppPackagesData: true
    }
  },
  methods: {
    closeDlg () {
      this.$emit('closedlg')
      this.syncParams = []
    },
    getCurrentPageData (val, pageSize, start) {
      this.limitSize = pageSize
      this.offsetPage = start
    },
    handleSelectionChange (val) {
      this.syncParams = val
    },
    getAppData () {
      let _searchCondition = {
        types: [],
        affinity: [],
        industry: [],
        showType: ['public', 'inner-public'],
        workloadType: [],
        userId: '',
        queryCtrl: {
          appName: '',
          status: ['Published'],
          offset: this.offsetPage,
          limit: this.limitSize,
          sortItem: 'createTime',
          sortType: 'desc'
        }
      }
      applicationEditorApi.getAppData(_searchCondition).then((res) => {
        let _data = res.data.results
        _data.forEach(item => {
          this.appIdArr.push(item.appId)
        })
        this.getAppPackages(this.appIdArr)
      })
    },
    async getAppPackages (data) {
      let arr = []
      for (let val of data) {
        await appstoreApi.getAppDetailTable(val, null, 100, 0).then(res => {
          arr = arr.concat(res.data)
        })
      }
      this.allAppData = arr
      this.listTotal = arr.length
      this.isAppPackagesData = false
    },
    confirm () {
      let params = []
      this.syncParams.forEach(item => {
        let _obj = {
          appId: '',
          packageId: ''
        }
        _obj.appId = item.appId
        _obj.packageId = item.packageId
        params.push(_obj)
      })
      applicationEditorApi.syncApplication(params).then(res => {
        this.syncParams = []
        this.$emit('getListData')
        this.closeDlg()
      }).catch((error) => {
        let defaultMsg = this.$t('toolBox.appEditor.syncFailed')
        commonUtil.showTipMsg(this.language, error, defaultMsg)
        this.closeDlg()
      })
    }
  },
  mounted () {
    this.getAppData()
  },
  watch: {
    '$i18n.locale': function () {
      this.language = localStorage.getItem('language')
    },
    offsetPage (val, oldVal) {
      this.offsetPage = val
      this.getAppData()
    },
    limitSize (val, oldVal) {
      this.limitSize = val
      this.getAppData()
    }
  }
}
</script>
<style lang="less">
.select_app_main{
  .el-dialog{
    width: 60%;
    min-width: 840px;
  }
  .dialog-footer{
    margin-top: 50px;
    padding: 0 !important;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner{
    border: 1px solid #a19aac;
    background: #7c64f3;
  }
}
</style>
