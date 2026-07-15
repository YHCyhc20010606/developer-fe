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
  <div class="mepapi common-div-bg">
    <div class="service-content">
      <div
        class="doc-div"
        v-if="refGuideFileId"
      >
        <Document
          :guide-file-idprop="refGuideFileId"
          v-if="refGuideFileId"
        />
        <div
          v-else
          class="noServiceInfo"
        >
          {{ $t('platformCapability.noDataNotice') }}
        </div>
      </div>
      <div
        v-else
        class="noServiceInfo"
      >
        {{ $t('platformCapability.noDataNotice') }}
      </div>
    </div>
  </div>
</template>

<script>
import Document from './Document.vue'

export default {
  components: {
    Document
  },
  props: {
    guideFileId: {
      type: String,
      default: ''
    },
    guideFileIdEn: {
      type: String,
      default: ''
    }
  },
  computed: {
    refGuideFileId: function () {
      return this.$i18n.locale === 'en' ? this.$route.query.guideFileIdEn : this.$route.query.guideFileId
    }
  }
}
</script>
<style lang='less' scoped>
.mepapi{
  margin: 40px 10% 0 !important;
  padding: 0 !important;
  max-height: calc(95% - 40px) !important;
  *{
    box-sizing: border-box;
  }
  .mep-main{
    background-color: #fff;
    padding: 40px 40px 0;
    position: relative;
    .service-content {
      .doc-div{
        float: left;
        width: 100%;
      }
      .noServiceInfo {
        text-align: center;
      }
    }
  }
}
</style>
