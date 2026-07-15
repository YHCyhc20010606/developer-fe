<!--
  -  Copyright 2020-2021 Huawei Technologies Co., Ltd.
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
  <div>
    <el-dialog
      :visible.sync="isUploadPdf"
      width="30%"
      class="default_dialog uploadPdfDialog"
      :close-on-click-modal="false"
      append-to-body
    >
      <div class="uploadReport">
        <img
          src="../../../assets/images/atp/upload_report.png"
          alt=""
        >
        <div class="uploadpdf">
          {{ $t('atpTestProcess.uploadReport') }}
        </div>
        <p>{{ $t('atpTestProcess.haveReport') }}</p>
        <span>{{ $t('atpTestProcess.pdfFormat') }}</span>
      </div>
      <div
        class="dialog-footer"
      >
        <el-button
          @click="$emit('closeDig')"
          class="common-btn"
        >
          {{ $t('common.back') }}
        </el-button>
        <el-upload
          :show-file-list="false"
          action=""
          :limit="1"
          :auto-upload="false"
          :file-list="pdfFile"
          accept=".pdf"
          :on-change="handleChangePdf"
        >
          <el-button
            class="common-btn"
          >
            {{ $t('testCase.upload') }}
          </el-button>
        </el-upload>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { atpApi } from '../../../api/atpApi.js'
export default {
  name: 'UploadReportDlg',
  props: {
    isUploadPdf: {
      type: Boolean,
      default: false
    },
    taskId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      pdfFile: []
    }
  },
  methods: {
    handleChangePdf (file, fileList) {
      this.$emit('closeDig')
      this.pdfFile.push(file.raw)
      let fd = new FormData()
      fd.append('file', this.pdfFile[0])
      if (this.pdfFile.length > 0) {
        this.$emit('closeDig')
        atpApi.uploadReportApi(this.taskId, fd).then(res => {
          this.$message({
            showClose: true,
            duration: 2000,
            message: this.$t('atpPromptMessage.uploadSuc'),
            type: 'success'
          })
        })
      }
    }
  }
  // watch: {
  //   isUploadPdf: function (val) {
  //     this.isUploadPdf = val
  //   }
  // }
}
</script>
<style lang="less">
  .uploadPdfDialog{
      .uploadReport{
        text-align: center;
        .uploadpdf{
          font-size: 18px;
          color: #fff;
        }
        p{
          font-size: 14px;
          color: #fff;
          padding: 5px 0;
        }
        span{
          font-size: 12px;
          color: #fff;
        }
      }
      .el-icon-close:before{
        color: #fff !important;
      }
      .dialog-footer{
        margin-top: 15px;
        display: flex;
        justify-content: space-evenly;
      }
  }
</style>
