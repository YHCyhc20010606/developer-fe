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
  <div
    class="capa_home common-div-bg"
    ref="capa_home"
  >
    <div
      id="capa_tit_div"
    >
      <div class="system-title">
        {{ $t('platformCapability.platformCapabilities') }}
      </div>
    </div>

    <!-- Ability list -->
    <div class="capa_list_div clear">
      <div class="filter_div">
        <p
          class="filter_default"
          :class="{'filter_default_en':language==='en'}"
          @mouseenter="filterDropDown"
          @mouseleave="filterDropUp"
        >
          {{ hotFilter==='hot'?$t('platformCapability.mostPopular'):$t('platformCapability.latestUpdate') }}
          <img
            src="../../../assets/images/capability/capa_filter_icon.png"
            alt=""
            class="filter_icon"
            :class="{'filter_down':dropDown}"
          >
        </p>
        <el-collapse-transition>
          <div
            v-show="showFilter"
            class="down_div"
            :class="{'down_div_en':language==='en'}"
            @mouseenter="filterDropDown"
            @mouseleave="filterDropUp"
          >
            <div
              class="transition-box"
              @click="filterSefvice('hot')"
            >
              {{ $t('platformCapability.mostPopular') }}
            </div>
            <div
              class="transition-box"
              @click="filterSefvice('new')"
            >
              {{ $t('platformCapability.latestUpdate') }}
            </div>
          </div>
        </el-collapse-transition>
      </div>

      <!-- Left menu -->
      <div
        id="list_left"
        class="list_left lt"
        v-loading="groupLoading"
        ref="meptree"
        :class="{'list_bottom':listBottom && capabilityServiceList.length>=7}"
      >
        <CapabilityGroupList
          :capability-group-stats="capabilityGroupStats"
          :language="language"
          :is-refrsh-page="isRefrshPage"
          :capability-all-service="capabilityAllService"
          @getCapaServiceList="getCapaServiceList"
          ref="groupList"
          v-if="capabilityGroupStats.length>0"
        />
      </div>
      <!-- List on the right -->
      <div
        class="list_right clear rt"
        v-loading="serviceLoading"
        ref="rightService"
      >
        <CapabilityServiceList
          :capability-service-list="capabilityServiceList"
          :language="language"
          :show-num="showNum"
          ref="serviceList"
          :user-id="userId"
          v-if="capabilityServiceList.length>0"
        />
        <p
          class="button_more"
          v-if="showNum<capabilityServiceList.length"
        >
          <el-button
            class="linearGradient"
            @click="showMore()"
          >
            {{ $t('platformCapability.showMore') }}
          </el-button>
        </p>
      </div>
    </div>
    <!-- Telecom standards support panorama -->
    <div
      class="panorama"
      id="panorama"
      ref="panorama"
    >
      <div class="system-title">
        {{ $t('platformCapability.telecomStandards') }}
      </div>
      <p class="title">
        <span class="dots" />ETSI
      </p>
      <AbilityBrainMap
        :parent-tab-index="etsiIndex"
        container-id="etsi-container"
      />
      <p class="title">
        <span class="dots" />3GPP
      </p>
      <AbilityBrainMap
        :parent-tab-index="threeGppIndex"
        container-id="threegpp-container"
      />
    </div>
  </div>
</template>

<script>
import { Capability } from '../../../api/developerApi.js'
import AbilityBrainMap from './AbilityBrainMap.vue'
import CapabilityGroupList from './CapabilityGroupList.vue'
import CapabilityServiceList from './CapabilityServiceList.vue'

export default {
  components: {
    AbilityBrainMap,
    CapabilityGroupList,
    CapabilityServiceList
  },
  data () {
    return {
      userId: sessionStorage.getItem('userId'),
      language: localStorage.getItem('language'),
      etsiIndex: 0,
      threeGppIndex: 1,
      showFilter: false,
      dropDown: false,
      selectIndex: 0,
      selectDetailIndex: 0,
      capabilityIconList: [
        {
          icon: require('../../../assets/images/capability/capability_icon1_default.png'),
          iconSelect: require('../../../assets/images/capability/capability_icon1_select.png')
        },
        {
          icon: require('../../../assets/images/capability/capability_icon2_default.png'),
          iconSelect: require('../../../assets/images/capability/capability_icon2_select.png')
        },
        {
          icon: require('../../../assets/images/capability/capability_icon3_default.png'),
          iconSelect: require('../../../assets/images/capability/capability_icon3_select.png')
        },
        {
          icon: require('../../../assets/images/capability/capability_icon4_default.png'),
          iconSelect: require('../../../assets/images/capability/capability_icon4_select.png')
        },
        {
          icon: require('../../../assets/images/capability/capability_icon5_default.png'),
          iconSelect: require('../../../assets/images/capability/capability_icon5_select.png')
        },
        {
          icon: require('../../../assets/images/capability/capability_icon6_default.png'),
          iconSelect: require('../../../assets/images/capability/capability_icon6_select.png')
        },
        {
          icon: require('../../../assets/images/capability/capability_icon7_default.png'),
          iconSelect: require('../../../assets/images/capability/capability_icon7_select.png')
        },
        {
          icon: require('../../../assets/images/capability/capability_icon8_default.png'),
          iconSelect: require('../../../assets/images/capability/capability_icon8_select.png')
        }
      ],
      capabilityAllService: [],
      capabilityGroupStats: [],
      capabilityServiceList: [],
      dialogVisible: false,
      groupLoading: true,
      serviceLoading: true,
      isFirstEnter: true,
      listBottom: false,
      hotFilter: '',
      showNum: 12,
      fromHomeId: 'all',
      isRefrshPage: true
    }
  },
  watch: {
    '$i18n.locale': function () {
      this.language = localStorage.getItem('language')
    },
    capabilityServiceList (newVal, oldVal) {
      if (newVal.length !== oldVal.length) {
        let _list = document.getElementsByClassName('capa_home')[0]
        _list.scrollTop = 0
        this.listBottom = false
      }
    }
  },
  methods: {
    filterDropDown () {
      this.showFilter = true
      this.dropDown = true
    },
    filterDropUp () {
      this.showFilter = false
      this.dropDown = false
    },
    filterSefvice (filter) {
      let length = this.capabilityServiceList.length
      if (length > 0) {
        if (filter === 'hot' && this.hotFilter !== 'hot') {
          this.capabilityServiceList.sort(function (a, b) {
            return a.selectCount < b.selectCount ? 1 : -1
          })
        } else if (filter === 'new' && this.hotFilter !== 'new') {
          this.capabilityServiceList.sort(function (a, b) {
            return a.uploadTime < b.uploadTime ? 1 : -1
          })
        }
        this.hotFilter = filter
      }
      this.showFilter = false
      this.dropDown = false
    },
    getCapaServiceList (data) {
      this.capabilityServiceList = data
    },
    showMore () {
      this.showNum += 12
    },
    initCapabilityGroupStats () {
      let totalCapabilityCount = 0
      Capability.getCapabilityGroupStats().then(result => {
        result.data.forEach(capabilityGroupStat => {
          let obj = {
            id: capabilityGroupStat.id,
            name: capabilityGroupStat.name,
            nameEn: capabilityGroupStat.nameEn,
            icon: this.getIcon(capabilityGroupStat.nameEn),
            iconSelect: this.getIconSelect(capabilityGroupStat.nameEn),
            counts: capabilityGroupStat.capabilityCount
          }
          totalCapabilityCount += obj.counts
          this.capabilityGroupStats.push(obj)
        })
      }).then(() => {
        let objfirst = {
          id: 'all',
          name: '所有',
          nameEn: 'All',
          icon: this.capabilityIconList[0].icon,
          iconSelect: this.capabilityIconList[0].iconSelect,
          counts: totalCapabilityCount
        }
        this.capabilityGroupStats.unshift(objfirst)
        this.groupLoading = false
        this.serviceLoading = false
        this.isFirstEnterPage()
        this.filterSefvice('hot')
      }).catch(() => {
        setTimeout(() => {
          this.groupLoading = false
          this.serviceLoading = false
        }, 2000)
      })
    },
    getIcon (nameEn) {
      if (nameEn === 'Platform services') {
        return this.capabilityIconList[1].icon
      } else if (nameEn === 'Telecom network') {
        return this.capabilityIconList[2].icon
      } else if (nameEn === 'Ascend AI') {
        return this.capabilityIconList[3].icon
      } else if (nameEn === 'AI capabilities') {
        return this.capabilityIconList[4].icon
      } else if (nameEn === 'Video processing') {
        return this.capabilityIconList[5].icon
      } else if (nameEn === 'DataBase') {
        return this.capabilityIconList[6].icon
      } else if (nameEn === 'Public framework') {
        return this.capabilityIconList[7].icon
      }
      return this.capabilityIconList[0].icon
    },
    getIconSelect (nameEn) {
      if (nameEn === 'Platform services') {
        return this.capabilityIconList[1].iconSelect
      }
      if (nameEn === 'Telecom network') {
        return this.capabilityIconList[2].iconSelect
      }
      if (nameEn === 'Ascend AI') {
        return this.capabilityIconList[3].iconSelect
      }
      if (nameEn === 'AI capabilities') {
        return this.capabilityIconList[4].iconSelect
      }
      if (nameEn === 'Video processing') {
        return this.capabilityIconList[5].iconSelect
      }
      if (nameEn === 'DataBase') {
        return this.capabilityIconList[6].iconSelect
      }
      if (nameEn === 'Public framework') {
        return this.capabilityIconList[7].iconSelect
      }
      return this.capabilityIconList[0].iconSelect
    },
    isFirstEnterPage () {
      if (!this.isFirstEnter) {
        this.$nextTick(() => {
          this.$refs.groupList.selectGroupList(this.capabilityGroupStats[this.selectIndex], this.selectIndex)
        })
        if (sessionStorage.getItem('capaSelectDetailIndex')) {
          this.$nextTick(() => {
            this.$refs.serviceList.viewServiceDetail(this.capabilityGroupStats[this.selectDetailIndex])
          })
        } else {
          this.dialogVisible = false
        }
      }
      if (this.fromHomeId) {
        this.$nextTick(() => {
          let capabilityGroupAndIndex = this.getCapabilityGroupAndIndexById(this.fromHomeId)
          this.$refs.groupList.selectGroupList(capabilityGroupAndIndex.capabilityGroup, capabilityGroupAndIndex.index)
        })
      } else {
        this.$nextTick(() => {
          this.$refs.groupList.selectGroupList(this.capabilityGroupStats[0], 0)
        })
      }
    },
    getCapabilityGroupAndIndexById (capabilityGroupId) {
      let index = 0
      for (let capabilityGroup of this.capabilityGroupStats) {
        if (capabilityGroup.id === capabilityGroupId) {
          return { 'capabilityGroup': capabilityGroup, 'index': index }
        }
        index = index + 1
      }
      return { 'capabilityGroup': this.capabilityGroupStats[0], 'index': index }
    },
    handleClose () {
      this.dialogVisible = false
    },
    isElementNotInViewport (el) {
      if (el) {
        let rect = el.getBoundingClientRect()
        return (
          rect.top >= (window.innerHeight || document.documentElement.clientHeight) || rect.bottom <= 0
        )
      }
    },
    getTreeTop () {
      let rightTop = this.$refs.rightService.getBoundingClientRect().top
      let _oDiv = document.getElementsByClassName('list_left')[0]
      if (_oDiv && rightTop < 120 && this.capabilityServiceList.length >= 7) {
        _oDiv.style.position = 'fixed'
        _oDiv.style.bottom = rightTop + 'px'
      } else {
        _oDiv.style.position = 'relative'
        _oDiv.style.bottom = 0 + 'px'
      }
      this.listBottom = !this.isElementNotInViewport(this.$refs.panorama)
    }
  },
  mounted () {
    this.fromHomeId = this.$route.params.id
    this.listBottom = false
  },
  beforeMount () {
    this.initCapabilityGroupStats()
    window.addEventListener('scroll', this.getTreeTop, true)
    window.onresize = () => {
      return (() => {
        this.getTreeTop()
      })()
    }
  },
  beforeRouteEnter (to, from, next) {
    // vm is an instance of vue, instead of this
    next(vm => {
      let fromHome = sessionStorage.getItem('fromHome')
      if (fromHome === 'home') {
        vm.isRefrshPage = false
      } else {
        vm.isRefrshPage = true
      }
      let isFromDoc = from.path.indexOf('platform/mep/serviceDoc')
      let isFromApi = from.path.indexOf('platform/mep/apiAmulator')
      if (isFromDoc !== -1 || isFromApi !== -1) {
        vm.selectIndex = Number(sessionStorage.getItem('capaSelectListIndex')) || 0
        vm.selectDetailIndex = Number(sessionStorage.getItem('capaSelectDetailIndex')) || 0
        vm.isFirstEnter = false
      }
    })
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.getTreeTop, true)
  }
}
</script>
<style lang='less'>
.capa_home{
  width: 90%;
  max-height: 90% !important;
  margin: 40px 5% 0;
  #capa_tit_div{
    position: relative;
    .system-title{
      margin-top: 10px !important;
    }
  }
  .capa_list_div{
    position: relative;
    min-height: 470px;
    .filter_div{
      position: absolute;
      top: -90px;
      right: 0;
      z-index: 1998;
      .filter_default{
        border: 1px solid #fff;
        border-radius: 12px;
        padding: 10px 20px;
        font-size: 16px;
        color: #fff;
        letter-spacing: 2px;
        cursor: pointer;
        box-shadow: 0 6px 24px -9px rgba(40, 12, 128, 0.24);
        position: relative;
        z-index: 2;
        .filter_icon{
          position: relative;
          top: -2px;
          margin-left: 10px;
          transition: all 0.5s;
        }
        .filter_icon.filter_down{
          transform:rotate(180deg);
        }
      }
      .filter_default_en{
        letter-spacing: 0;
      }
      .down_div{
        border-radius: 12px;
        background: #fdfcff;
        box-shadow: 0 0 24px 0 rgba(40, 12, 128, 0.24);
        position: relative;
        z-index: 1;
        margin-top: 5px;
        .transition-box{
          height: 33px;
          line-height: 33px;
          text-align: center;
          font-size: 16px;
          color: #773fc1;
          letter-spacing: 2px;
          border-bottom: 1px solid #f0f0f0;
          cursor: pointer;
        }
        .transition-box:last-child{
          border-bottom: none;
        }
        .transition-box:hover{
          background: #ab87db;
          color: #fff;
          border-radius: 12px;
        }
      }
      .down_div_en{
        letter-spacing: 0;
      }
    }
    .list_left.list_bottom{
      position: absolute !important;
      top: auto !important;
      bottom: 200px !important;
    }
    .list_left{
      width: 300px;
      position: relative;
    }
    .list_right{
      width: calc(100% - 300px);
      padding-left: 30px;
      .button_more{
        float: left;
        width: 100%;
        text-align: center;
        margin: 30px 0 80px;
        .el-button{
          border-radius: 10px;
          font-size: 20px;
          color: #fff;
          padding: 8px 30px;
          height: 46px;
          line-height: 26px;
          position: relative;
        }
      }
    }
  }
  .panorama{
    padding-bottom: 50px;
    .title{
      font-size: 36px;
      color: #ccc1f8;
      margin-top: 50px;
      padding-left: 100px;
      .dots{
        float: left;
        width: 12px;
        height: 12px;
        background: #7a6e8a;
        border-radius: 50%;
        margin: 16px 10px 0 0;
      }
    }
    .km-view{
      background: rgba(80,57,174,.5) !important;
    }
  }
}
</style>
