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
  <div class="instru-container">
    <div class="instru-container-inner">
      <div
        style="height:480px"
        :id="containerId"
      />
    </div>
  </div>
</template>

<script>
import { Capability } from '../../../api/developerApi.js'
require('kity')
require('kityminder-core')
export default {
  components: {
  },
  props: {
    parentTabIndex: {
      type: Number,
      default: -1
    },
    containerId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      km: null,
      data: null
    }
  },
  watch: {
    '$i18n.locale': function () {
      this.refreshMap()
    },
    'parentTabIndex': function () {
      this.refreshMap()
    }
  },
  methods: {
    refreshMap () {
      Capability.getStandardCapabilities().then(result => {
        let groupName = this.parentTabIndex === 1 ? '3GPP' : 'ETSI'
        let capabilities = result.data.filter(item => item.group.name === groupName)
        let subAbilitiesShown = []
        for (let i = 0; i < capabilities.length; i++) {
          let thirdGpp = (i < 5) ? '#e7dbf6' : ''
          let etsiNodeBackground = (i < 6) ? '#e7dbf6' : ''
          subAbilitiesShown.push({
            data: {
              id: capabilities[i].id,
              text: this.$i18n.locale === 'en' ? capabilities[i].nameEn : capabilities[i].name,
              expandState: 'expand',
              hyperlink: window.location.href + '/apiAmulator?serviceId=' + capabilities[i].id + '&apiFileId=' + capabilities[i].apiFileId + '&language=' + this.$i18n.locale,
              hyperlinkTitle: this.$i18n.t('platformCapability.swithToAPI'),
              background: this.parentTabIndex === 1 ? thirdGpp : etsiNodeBackground
            },
            children: []
          })
        }
        let rootName = ''
        if (this.parentTabIndex === 1) {
          rootName = '3GPP CAPIF'
        } else if (this.parentTabIndex === 0) {
          rootName = 'ETSI MEC'
        }
        this.km.importJson({
          root: {
            data: {
              id: '0',
              text: rootName,
              expandState: 'expand',
              hyperlink: '',
              hyperlinkTitle: '',
              background: '#997ebd'
            },
            children: subAbilitiesShown
          },
          template: 'default',
          theme: 'fresh-purple-compat',
          version: '1.0.0'
        })
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.km = new window.kityminder.Minder({
        renderTo: '#' + this.containerId
      })
      this.refreshMap()
    })
  }
}
</script>
<style lang='less' scoped>
.instru-container {
  margin: 50px 100px 0;
  box-shadow: 0 2px 4px 0 rgba(3, 27, 78, 0.06);
  box-sizing: border-box;
}
.instru-container-inner {
  margin: -1px -2px -1px -1px;
  font-size: 0;
}
</style>
