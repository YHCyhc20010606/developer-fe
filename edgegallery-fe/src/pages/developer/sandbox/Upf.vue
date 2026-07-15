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
  <div class="details-center-deploy lt">
    <div class="details-center-deploy-img">
      <div
        class="lt deploy-img flex-center hoverHands"
        @click="addApplicationRules"
        :class="isUpfDisabledProp ? 'img-onlyRead':''"
      >
        <img
          class="deploy-img-center deploy-img-center-finish"
          src="../../../assets/images/sandbox/sandbox_upf.png"
          alt=""
        >
        <div class="deploy-edit flex-center">
          <el-tooltip
            class="edit-tooltip"
            effect="light"
            :content="$t('common.edit')"
            placement="bottom-start"
          >
            <img
              src="../../../assets/images/sandbox/edit_green.png"
              alt=""
            >
          </el-tooltip>
        </div>
      </div>
    </div>
    <div
      class="deploy-title"
      :class="isUpfDisabledProp ? 'img-onlyRead':''"
    >
      {{ $t('sandbox.upf') }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isUpfDisabledProp: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    addApplicationRules () {
      this.$emit('showAppRules')
    }
  }
}
</script>

<style lang="less" scoped>
.img-onlyRead{
  pointer-events: none;
  color: rgba(255,255,255,.4);
  img{
    opacity: 0.4 !important;
  }
}
</style>
