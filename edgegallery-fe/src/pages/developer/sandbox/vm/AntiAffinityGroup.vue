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
  <div class="common-div-bg antiAffinityGroup">
    <div class="title_line">
      <h3>
        {{ $t('sandbox.antiAffinityInfo') }}
      </h3>
      <img
        class="rt curp"
        src="../../../../assets/images/sandbox/vm_add_icon.png"
        alt=""
        @click="creatGroup()"
      >
    </div>
    <div
      v-if="antiAffinityGroups.length===0"
      class="nodata"
    >
      <p>{{ $t('common.noData') }}</p>
    </div>
    <div
      class="content"
      v-else
    >
      <div
        v-for="(item,index) in antiAffinityGroups"
        :key="index"
        class="content_card"
      >
        <el-form
          label-width="auto"
          :disabled="activeIndex!==index"
          :rules="rules"
          :model="item"
        >
          <el-form-item
            :label="$t('common.name')"
            prop="name"
          >
            <el-input
              size="small"
              v-model="item.name"
              class="common-input"
              maxlength="225"
            />
          </el-form-item>
          <el-form-item
            :label="$t('sandbox.vm')"
            prop="vmIdList"
          >
            <el-select
              size="small"
              v-model="item.vmIdList"
              multiple
            >
              <el-option
                v-for="(vmitem,vmindex) in vmOptions"
                :key="vmindex"
                :label="vmitem.name"
                :value="vmitem.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('common.describe')"
            prop="description"
          >
            <el-input
              size="small"
              v-model="item.description"
              class="common-input"
            />
          </el-form-item>
        </el-form>
        <div class="operate">
          <el-button
            class="common-btn"
            @click="deleteGroup(item)"
          >
            {{ $t('common.delete') }}
          </el-button>
          <el-button
            class="common-btn"
            @click="modify(index)"
            v-if="activeIndex!==index"
          >
            {{ $t('common.edit') }}
          </el-button>
          <el-button
            class="common-btn"
            v-if="activeIndex===index"
            @click="cancel"
          >
            {{ $t('common.cancel') }}
          </el-button>
          <el-button
            class="common-btn"
            v-if="activeIndex===index"
            @click="confirm(item)"
          >
            {{ $t('common.confirm') }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { sandbox } from '../../../../api/developerApi.js'
export default {
  data () {
    const NameEmpty = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('sandboxPromptInfomation.nameEmpty')))
      } else {
        callback()
      }
    }
    const DescEmpty = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('sandboxPromptInfomation.descEmpty')))
      } else {
        callback()
      }
    }
    const VmIdListEmpty = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error(this.$t('sandboxPromptInfomation.vmEmpty')))
      } else {
        callback()
      }
    }
    return {
      antiAffinityGroups: [],
      vmNameMap: new Map(),
      applicationId: sessionStorage.getItem('applicationId'),
      vmOptions: [],
      activeIndex: -1,
      isCreate: false,
      rules: {
        name: [
          { required: true, validator: NameEmpty, trigger: 'blur' }
        ],
        vmIdList: [
          { required: true, validator: VmIdListEmpty, trigger: 'change' }
        ],
        description: [
          { required: true, validator: DescEmpty, trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.vmfillOptions()
  },
  methods: {
    async getAllGroups () {
      let params = { vmId: '' }
      sandbox.antiAffinityGroup.getAntiAffinityGroup(this.applicationId, params).then(res => {
        this.antiAffinityGroups = res.data
        this.antiAffinityGroups.forEach(item => {
          let vmNameList = []
          item.vmIdList.forEach(vmId => {
            vmNameList.push(this.vmNameMap.get(vmId))
          })
          item.vmName = vmNameList.toString()
        })
      })
    },
    vmfillOptions () {
      sandbox.getVmlist(this.applicationId).then(res => {
        let cacheArray = []
        let vmList = res.data
        vmList.forEach(item => {
          let obj = {
            id: '',
            name: ''
          }
          obj.id = item.id
          obj.name = item.name
          cacheArray.push(obj)
          this.vmNameMap.set(obj.id, obj.name)
        })
        this.vmOptions = cacheArray
        this.getAllGroups()
      })
    },
    cancel () {
      this.activeIndex = -1
      this.getAllGroups()
    },
    modify (index) {
      this.activeIndex = index
      this.isCreate = false
    },
    confirm (item) {
      let params = item
      delete params.vmName
      if (!item.name) {
        this.$message.warning(this.$t('sandboxPromptInfomation.nameEmpty'))
      } else if (!item.description) {
        this.$message.warning(this.$t('sandboxPromptInfomation.descEmpty'))
      } else if (item.vmIdList.length === 0) {
        this.$message.warning(this.$t('sandboxPromptInfomation.vmEmpty'))
      } else {
        if (this.isCreate) {
          delete params.id
          sandbox.antiAffinityGroup.addAntiAffinityGroup(this.applicationId, params).then(res => {
            this.getAllGroups()
          }).catch(() => {
            this.$message.warning(this.$t('sandboxPromptInfomation.creatFail'))
            this.getAllGroups()
          })
        } else {
          sandbox.antiAffinityGroup.updateAntiAffinityGroup(this.applicationId, item.id, params).catch(() => {
            this.$message.warning(this.$t('sandboxPromptInfomation.updateFail'))
            this.getAllGroups()
          })
        }
        this.activeIndex = -1
      }
    },
    deleteGroup (item) {
      sandbox.antiAffinityGroup.deleteAntiAffinityGroup(this.applicationId, item.id).then(res => {
        this.getAllGroups()
      })
    },
    creatGroup () {
      this.isCreate = true
      let obj = {
        'id': '',
        'name': '',
        'description': '',
        'vmIdList': []
      }
      this.antiAffinityGroups.push(obj)
      this.activeIndex = this.antiAffinityGroups.length - 1
    }
  }
}
</script>
<style lang="less">
.antiAffinityGroup{
  .title_line{
    display: flex;
    justify-content: space-between;
    h3{
      font-size: 22px;
    }
    h3::before{
      display: inline-block;
      content: '';
      width: 9px;
      height: 9px;
      background: #43F6AD;
      border-radius: 50%;
      position: relative;
      top: -5px;
      left: -10px;
    }
    img{
      width: 28px;
      height: 28px;
    }
  }
  .content{
    display: flex;
    flex-wrap: wrap;
    .content_card{
      padding: 10px 15px;
      margin: 0 calc(5%/2);
      margin-top: 20px;
      flex: 0 0 45%;
      background: #240C70;
    }
  }
  .nodata{
    margin: 0 20px;
    p{
      text-align: center;
    }
    font-size: 20px;
  }
}
</style>
