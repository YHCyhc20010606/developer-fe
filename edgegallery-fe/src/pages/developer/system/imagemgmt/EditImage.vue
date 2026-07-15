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
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="showDlg"
    class="edit_image_dialog default_dialog"
    :class="{'edit_image_dialog_en':language==='en'}"
    append-to-body
  >
    <div class="common-dlg-title">
      {{ dlgTitle }}
    </div>
    <el-form
      :label-width="language==='cn'?formLabelWidth:formLabelWidthEn"
      :model="imageDataForm"
      ref="imageDataForm"
      :rules="rules"
      class="common-form clear"
    >
      <el-form-item
        :label="$t('devSystem.imageMgmt.imgName')"
        prop="name"
        class="half"
        :class="{'marginbot-err':nameError}"
      >
        <el-input
          id="elinput_systemName"
          size="small"
          v-model="imageDataForm.name"
          :placeholder="$t('devSystem.imageMgmt.imgName')"
          clearable
        />
      </el-form-item>
      <el-form-item
        :label="$t('devSystem.imageMgmt.osName')"
        prop="osType"
        class="half"
        :class="{'marginbot-err':nameError}"
      >
        <el-select
          id="elselect_operateSystem"
          v-model="imageDataForm.osType"
          size="small"
        >
          <el-option
            v-for="item in operateSystemOptList"
            :label="item"
            :value="item"
            :key="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('devSystem.imageMgmt.osVersion')"
        prop="osVersion"
        class="half"
      >
        <el-input
          id="elinput_osversion"
          maxlength="20"
          size="small"
          v-model="imageDataForm.osVersion"
          :placeholder="$t('devSystem.imageMgmt.osVersion')"
          clearable
        />
      </el-form-item>
      <el-form-item
        :label="$t('devSystem.imageMgmt.sysDisk')+'(G)'"
        prop="systemDiskSize"
        class="elinput_sysdisk half"
      >
        <el-input
          id="elinput_sysdisk"
          size="small"
          v-model.number="imageDataForm.systemDiskSize"
          :placeholder="$t('devSystem.imageMgmt.sysDisk')"
          clearable
        />
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('devSystem.imageMgmt.sysdiskInfo')"
          placement="top"
        >
          <em class="common-info sysdisk-info" />
        </el-tooltip>
      </el-form-item>
      <el-form-item
        :label="$t('devSystem.imageMgmt.diskBus')"
        prop="diskBus"
        class="half"
      >
        <el-select
          v-model="imageDataForm.diskBus"
          size="small"
        >
          <el-option
            v-for="item in diskBusList"
            :label="item"
            :value="item"
            :key="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('devSystem.imageMgmt.startMethod')"
        prop="startMethod"
        class="half"
      >
        <el-select
          v-model="imageDataForm.startMethod"
          size="small"
        >
          <el-option
            v-for="item in startMethodList"
            :label="item"
            :value="item"
            :key="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-show="isAdmin"
        :label="$t('devSystem.imageMgmt.imgType')"
        prop="visibleType"
        class="lt"
      >
        <el-radio-group
          v-model="imageDataForm.visibleType"
          class="common-radio"
        >
          <el-radio
            v-for="(item,index) in imageTypeOptionList"
            :key="index"
            :label="item.value"
          >
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        :label="$t('devSystem.imageMgmt.osBit')"
        prop="osBitType"
        class="lt"
      >
        <el-radio-group
          v-model="imageDataForm.osBitType"
          class="common-radio"
        >
          <el-radio
            v-for="(item,index) in systemBitOptionList"
            :key="index"
            :label="item"
          >
            {{ item }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        id="btn_cancel"
        @click="cancel()"
        class="common-btn"
      >
        {{ $t('common.cancel') }}
      </el-button>
      <el-button
        id="btn_confirm"
        @click="confirm()"
        class="common-btn"
      >
        {{ $t('common.confirm') }}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { imageMgmtService } from '@/api/developerApi.js'
export default {
  name: 'EditImage',
  props: {
    value: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    imageData: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    const validateImgNameEmpty = (_rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('devSystem.imageMgmt.tip.nameEmpty')))
      } else {
        callback()
      }
    }
    const validateImgNameRule = (_rule, value, callback) => {
      let pattern = /^(?!_)(?!-)(?!\s)(?!.*?_$)(?!.*?-$)(?!.*?\s$)[a-zA-Z0-9_-]{4,128}$/
      if (value.match(pattern) === null) {
        this.nameError = true
        callback(new Error(this.$t('devSystem.imageMgmt.tip.nameRule')))
      } else {
        this.nameError = false
        callback()
      }
    }
    const validateVersionEmpty = (_rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('devSystem.imageMgmt.tip.versionEmpty')))
      } else {
        callback()
      }
    }
    const validateVersionRule = (_rule, value, callback) => {
      let pattern = /^[\w\\-][\w\\-\s.]{0,19}$/g
      if (value.match(pattern) === null) {
        callback(new Error(this.$t('devSystem.imageMgmt.tip.versionRule')))
      } else {
        callback()
      }
    }
    const validateSystemDiskEmpty = (_rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('devSystem.imageMgmt.tip.systemDiskEmpty')))
      } else {
        callback()
      }
    }
    const validateSystemDiskRule = (_rule, value, callback) => {
      let _strValue = Number(value)
      if (!Number.isInteger(_strValue)) {
        callback(new Error(this.$t('devSystem.imageMgmt.tip.systemDiskRule')))
      } else {
        if (_strValue <= 0 || _strValue > 500) {
          callback(new Error(this.$t('devSystem.imageMgmt.tip.systemDiskRule')))
        } else {
          callback()
        }
      }
    }
    return {
      formLabelWidth: '150px',
      formLabelWidthEn: '190px',
      language: localStorage.getItem('language'),
      isAdmin: false,
      dlgTitle: this.$t('devSystem.imageMgmt.tip.newImg'),
      imageTypeOptionList: [],
      operateSystemOptList: [
        'Ubuntu',
        'CentOS',
        'Windows',
        'Debian',
        'SUSE',
        'cirros',
        'Oracle',
        'EulerOS',
        'Red Hat',
        'NeoKylin',
        'WinServer'
      ],
      diskBusList: [
        'ide',
        'virtio',
        'scsi'
      ],
      startMethodList: [
        'uefi',
        'bios'
      ],
      systemBitOptionList: ['64', '32'],
      imageDataForm: {
        'name': '',
        'visibleType': '',
        'osType': 'Ubuntu',
        'osVersion': '',
        'osBitType': '64',
        'systemDiskSize': '',
        'diskBus': 'virtio',
        'operationId': '',
        'startMethod': 'uefi'
      },
      rules: {
        name: [
          { required: true, validator: validateImgNameEmpty, trigger: 'blur' },
          { validator: validateImgNameRule }
        ],
        osVersion: [
          { required: true, validator: validateVersionEmpty, trigger: 'blur' },
          { validator: validateVersionRule }
        ],
        systemDiskSize: [
          { required: true, validator: validateSystemDiskEmpty, trigger: 'blur' },
          { validator: validateSystemDiskRule }
        ]
      },
      isModify: false,
      systemIdToModi: -1,
      showDlg: this.value,
      nameError: false
    }
  },
  watch: {
    value (val) {
      this.showDlg = val
      this.nameError = false
      if (val) {
        this.init()
      }
    },
    '$i18n.locale': function () {
      this.initOptionList()
      this.language = localStorage.getItem('language')
      this.dlgTitle = this.isModify ? this.$t('devSystem.imageMgmt.tip.editImg')
        : this.$t('devSystem.imageMgmt.tip.newImg')
    }
  },
  mounted () {
    this.initUser()
    this.initOptionList()
    this.imageDataForm.visibleType = this.isAdmin ? 'public' : 'private'
  },
  methods: {
    initUser () {
      let _authorities = sessionStorage.getItem('userAuthorities')
      if (_authorities && _authorities.length > 0) {
        this.isAdmin = _authorities.includes('ROLE_DEVELOPER_ADMIN')
      }
    },
    resetForm () {
      if (this.$refs['imageDataForm']) {
        this.$refs['imageDataForm'].resetFields()
      }
    },
    initOptionList () {
      this.imageTypeOptionList = [
        { value: 'public', label: this.$t('devSystem.imageMgmt.typeValue.public') },
        { value: 'private', label: this.$t('devSystem.imageMgmt.typeValue.private') }
      ]
    },
    init () {
      this.resetForm()
      if (this.imageData && this.imageData.name) {
        this.imageDataForm.name = this.imageData.name
        this.imageDataForm.visibleType = this.imageData.visibleType
        this.imageDataForm.osType = this.imageData.osType
        this.imageDataForm.osVersion = this.imageData.osVersion
        this.imageDataForm.osBitType = this.imageData.osBitType
        this.imageDataForm.diskBus = this.imageData.diskBus
        this.imageDataForm.systemDiskSize = this.imageData.systemDiskSize
        this.imageDataForm.startMethod = this.imageData.startMethod
        this.isModify = true
        this.systemIdToModi = this.imageData.id
        this.dlgTitle = this.$t('devSystem.imageMgmt.tip.editImg')
      } else {
        this.imageDataForm.name = ''
        this.imageDataForm.visibleType = this.isAdmin ? 'public' : 'private'
        this.imageDataForm.osType = 'Ubuntu'
        this.imageDataForm.osVersion = ''
        this.imageDataForm.diskBus = 'virtio'
        this.imageDataForm.osBitType = '64'
        this.imageDataForm.systemDiskSize = ''
        this.imageDataForm.startMethod = 'uefi'

        this.isModify = false
        this.systemIdToModi = -1
        this.dlgTitle = this.$t('devSystem.imageMgmt.tip.newImg')
      }
    },
    cancel () {
      this.$emit('input', false)
    },
    confirm () {
      this.$refs['imageDataForm'].validate((valid) => {
        if (!valid) {
          return
        }
        if (!this.isModify) {
          imageMgmtService.newImage(this.imageDataForm).then(() => {
            this.$message.success(this.$t('devSystem.imageMgmt.tip.newImg') + this.$t('devSystem.success'))
            this.$emit('processEditImageSuccess', 'vm')
          }).catch((error) => {
            this.processEditError(error)
          })
        } else {
          imageMgmtService.modifyImage(this.imageDataForm, this.systemIdToModi).then(() => {
            this.$message.success(this.$t('promptInformation.editDataSuccess'))
            this.$emit('processEditImageSuccess', 'vm')
          }).catch((error) => {
            this.processEditError(error)
          })
        }
      })
    },
    processEditError (error) {
      if (error && error.response && error.response.data && error.response.data.message) {
        if (error.response.data.message === 'image Name can not duplicate.') {
          this.$message.error(this.$t('devSystem.imageMgmt.tip.systemNameExist'))
          return
        }
      }
      let _resKey = this.isModify ? 'devSystem.imageMgmt.tip.modifyImgFailed' : 'devSystem.imageMgmt.tip.newImgFailed'
      this.$message.error(this.$t(_resKey))
    }
  }
}
</script>
<style lang='less'>
.edit_image_dialog .el-dialog{
  width: 50%;
  min-width: 570px;
  border-radius: 12px;
}
.edit_image_dialog_en .el-dialog{
  width: 55%;
  min-width: 1060px;
}
.el-form-item{
  margin:20 !important;
  position: relative;
  .name_tip{
    position: absolute;
    right: -20px;
    bottom: 7px;
    z-index: 99;
  }
}
.marginbot-err{
  margin-bottom: 35px;
}
.elinput_sysdisk{
  .sysdisk-info{
    position: absolute;
    right: -30px;
    bottom: 4px;
  }
}
.el-tooltip__popper.is-light {
  border: 1px solid #ddd;
}
</style>
