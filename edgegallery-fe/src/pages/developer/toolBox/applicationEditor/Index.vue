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
  <div class="profileManagement padding-inner">
    <div class="system-title">
      {{ $t('toolBox.appEditorTitle') }}
      <el-button
        class="common-add-btn rt"
        @click="selectApp()"
      >
        {{ $t('toolBox.selectApp') }}
      </el-button>
    </div>
    <div class="list common-div-bg clear">
      <div class="title">
        <span>
          <el-input
            size="medium"
            v-model="enterQuery"
            :placeholder="$t('common.name')"
            class="search_input"
            @keyup.enter.native="searchListData"
            @clear="searchListData"
            @change="searchListData"
            suffix-icon="el-icon-search"
          >
            <em
              slot="suffix"
              class="search_icon"
              @click="searchListData"
            />
          </el-input>
        </span>
      </div>
      <el-table
        v-loading="loading"
        row-key="hostId"
        :data="allListData"
        class="common-table"
      >
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
          prop="architecture"
          :label="$t('toolBox.architecture')"
          min-width="10%"
        />
        <el-table-column
          prop="synchronizeDate"
          :label="$t('toolBox.synchronizeDate')"
          min-width="10%"
        />
        <el-table-column
          :label="$t('common.operation')"
          min-width="20%"
        >
          <template slot-scope="scope">
            <el-button
              :loading="loading"
              class="operation-btn-text"
              @click="modifyFile(scope.row)"
            >
              {{ $t('common.edit') }}
            </el-button>
            <el-button
              :loading="loading"
              class="operation-btn-text"
              @click="publishModifiedApp(scope.row)"
            >
              {{ $t('toolBox.publish') }}
            </el-button>
            <el-button
              :loading="loading"
              class="operation-btn-text"
              @click="handleDelete(scope.row)"
            >
              {{ $t('common.delete') }}
            </el-button>
          </template>
        </el-table-column>
        <template slot="empty">
          <div class="empty_img">
            <p>{{ $t('platformCapability.noDataNotice') }}</p>
          </div>
        </template>
      </el-table>
      <div class="pagebar">
        <pagination
          :table-data="allListData"
          :list-total="listTotal"
          @getCurrentPageData="getCurrentPageData"
          ref="pagination"
        />
      </div>
    </div>
    <SelectAppliation
      v-if="isSelectVisible"
      :is-select-visible="isSelectVisible"
      @closedlg="closedlg"
      @getListData="getListData"
    />
    <ModifyPackageDlg
      v-if="isModifyVisible"
      :is-modify-visible="isModifyVisible"
      :package-id="packageId"
      @closedlg="closedlg"
    />
  </div>
</template>

<script>
import pagination from '../../../../components/Pagination.vue'
import { applicationEditorApi } from '../../../../api/developerApi.js'
import { common, formatDate } from '../../../../tools/common.js'
import SelectAppliation from './SelectApplicationDlg'
import ModifyPackageDlg from './ModifyPackageDlg.vue'
import { Industry, TypeAllForDisplay } from '../../../../tools/commondata.js'
import commonUtil from '../../../../tools/devCommonUtil.js'

export default {
  name: 'ApplicationEditor',
  components: {
    pagination, SelectAppliation, ModifyPackageDlg
  },
  data () {
    return {
      limitSize: 10,
      offsetPage: 0,
      listTotal: 0,
      allListData: [],
      enterQuery: '',
      loading: false,
      userName: sessionStorage.getItem('userName'),
      userId: sessionStorage.getItem('userId'),
      language: localStorage.getItem('language'),
      screenHeight: document.body.clientHeight,
      isModifyVisible: false,
      packageId: '',
      isSelectVisible: false
    }
  },
  mounted () {
    this.setDivHeight()
    this.getListData()
  },
  watch: {
    '$i18n.locale': function () {
      this.language = localStorage.getItem('language')
      this.getListData()
    },
    $route (to, from) {
      this.getListData()
    },
    offsetPage (val, oldVal) {
      this.offsetPage = val
      this.getListData()
    },
    limitSize (val, oldVal) {
      this.limitSize = val
      this.getListData()
    }
  },
  methods: {
    closedlg () {
      this.isSelectVisible = false
      this.isModifyVisible = false
    },
    setDivHeight () {
      common.setDivHeightFun(this.screenHeight, 'list', 261)
    },
    getCurrentPageData (val, pageSize, start) {
      this.limitSize = pageSize
      this.offsetPage = start
    },
    searchListData () {
      sessionStorage.setItem('currentPage', 1)
      this.getListData()
    },
    formatDate (timestamp) {
      return formatDate(timestamp)
    },
    getListData () {
      applicationEditorApi.getReleasedPackage({ name: this.enterQuery, limit: this.limitSize, offset: this.offsetPage }).then(res => {
        this.allListData = res.data.results || []
        this.listTotal = res.data.total
        if (this.allListData) {
          this.allListData.forEach(item => {
            item.synchronizeDate = formatDate(item.synchronizeDate)
            this.changeIndustry(item)
            this.changeType(item)
          })
        }
      }).catch(() => {
        this.loading = false
      })
    },
    changeIndustry (item) {
      Industry.forEach(itemFe => {
        if (item.industry === itemFe.value) {
          item.industry = this.language === 'cn' ? itemFe.label[0] : itemFe.label[1]
        }
      })
    },
    changeType (item) {
      TypeAllForDisplay.forEach(itemFe => {
        if (item.type === itemFe.value) {
          item.type = this.language === 'cn' ? itemFe.label[0] : itemFe.label[1]
        }
      })
    },
    selectApp () {
      this.isSelectVisible = true
    },
    modifyFile (row) {
      this.packageId = row.appStorePackageId
      this.isModifyVisible = true
    },
    publishModifiedApp (row) {
      let _parameter = {
        free: true,
        price: 0
      }
      applicationEditorApi.publishModifyApp(row.appStorePackageId, _parameter).then(res => {
        this.$eg_messagebox(this.$t('toolBox.publishSuc'), 'success')
      }).catch((error) => {
        if (error.response.data.message === 'can not found app package(.csar)') {
          this.$eg_messagebox(this.$t('toolBox.appIsExist'), 'warning', '', this.$t('common.confirm'))
        } else {
          let defaultMsg = this.$t('toolBox.publishFail')
          commonUtil.showTipMsg(this.language, error, defaultMsg)
        }
      })
    },
    handleDelete (row) {
      this.$confirm(this.$t('devSystem.deleteConfirm'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        this.loading = true
        applicationEditorApi.deleteModifyApp(row.appStorePackageId).then(() => {
          this.loading = false
          this.getListData()
        })
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    sessionStorage.removeItem('currentPage')
    next()
  }
}
</script>

<style lang="less">
.profileManagement {
  .list {
    border-radius: 16px;
    padding: 30px 60px;
    box-shadow: 0 0 68px 5px rgba(94,24,200,0.06);
    .title{
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }
  }
}
</style>
