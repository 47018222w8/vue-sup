<template>
  <div class="c-register-phone">
    <x-header :left-options="{preventGoBack:true, showBack: false}" :right-options="{showMore:false}" title="注册">
      <div slot="left" @click="$router.push({name: 'login'})">
        <i slot="icon" class="fa fa-times fa-lg"></i>
      </div>
    </x-header>
    <div class="c-body" v-if="formData">
      <div v-show="showIndex===0" class="c-account">
        <p class="c-first">注册共分为3步,过程中需要上传企业营业执照,建议您事先准备好</p>
        <group>
          <x-input :max="11" ref="phone" type="tel" placeholder="请输入手机号" v-model="formData.uname">
            <div slot="label">
              <i class="fa fa-mobile fa-lg" style="padding-right:10px;"></i>&nbsp;
            </div>
          </x-input>
        </group>
        <br>
        <x-button :disabled="formData.uname.length===11?false:true" :show-loading="findPhoneLoading" @click.native="subPhone" type="primary">{{findPhoneLoading?'加载中...':'开始注册'}}</x-button>
      </div>
      <div v-show="showIndex===1" class="c-code">
        <br>
        <h3 style="text-align:center;">输入短信验证码</h3>
        <p class="s-p-desc">已经向
          <span style="font-size:16px;">{{formData.uname}}</span> 发送短信验证码</p>
        <p class="s-p-desc">请查看短信并输入验证码</p>
        <flexbox>
          <flexbox-item>
            <x-input text-align="center" type="tel" ref="a" :max="1" :show-clear="false" v-model="a"></x-input>
            <hr style="margin:0 auto;" width="70%">
          </flexbox-item>
          <flexbox-item>
            <x-input text-align="center" ref="b" type="tel" :max="1" :show-clear="false" v-model="b"></x-input>
            <hr style="margin:0 auto;" width="70%">
          </flexbox-item>
          <flexbox-item>
            <x-input text-align="center" ref="c" :max="1" type="tel" :show-clear="false" v-model="c"></x-input>
            <hr style="margin:0 auto;" width="70%">
          </flexbox-item>
          <flexbox-item>
            <x-input text-align="center" ref="d" :max="1" type="tel" :show-clear="false" v-model="d"></x-input>
            <hr style="margin:0 auto;" width="70%">
          </flexbox-item>
        </flexbox>
        <br><br>
        <p class="c-code-p" @click="changeShowCode">收不到短信验证码?</p>
        <actionsheet v-model="showCode" :menus="menus" @on-click-menu="clickCode"></actionsheet>
      </div>
      <div v-show="showIndex===2" class="c-pwd">
        <br>
        <h3 style="text-align:center;">设置登录密码和昵称</h3>
        <br>
        <group style="background-color:#fff;" label-width="4.5em" label-margin-right="2em" label-align="right">
          <x-input ref="pwd" title="登录密码" placeholder="长度6-12位" :max="12" :type="pwdShow?'text':'password'" v-model="formData.password">
            <i @click="showPwd" slot="right" :class="pwdShow?'fa fa-eye-slash fa-lg':'fa fa-eye fa-lg'"></i>
          </x-input>
          <x-input title="昵称" :max="6" placeholder="最多6个字" v-model="formData.shortName"></x-input>
        </group>
        <div style="padding:10px;0">
          <x-button :text="loading?'加载中...':'下一步'" :disabled="formData.password.length?false:true" @click.native="subPwd" :show-loading="loading" type="primary"></x-button>
        </div>
      </div>
      <div v-show="showIndex===3" class="c-operate-type">
        <br>
        <h2 style="text-align:center;">请选择经营类别</h2>
        <br>
        <checklist label-position="left" :options="operateTypeList" v-model="operateTypeListValue" :max="1"></checklist>
        <br>
        <x-button :text="loading?'加载中...':'确认'" :disabled="loading" @click.native="chooseOperate" :show-loading="loading" type="primary"></x-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { XHeader, XButton, Group, XInput, Flexbox, FlexboxItem, Actionsheet, Checklist, XAddress, Msg } from 'vux'
  import { REGISTER_DATA } from '@/store/mutation-type'
  import { RE_PHONE, CUSTOMER_SERVICE_TEL } from '@/components/constant'
  export default {
    data() {
      return {
        findPhoneLoading: false,
        showIndex: 0,
        a: '',
        b: '',
        c: '',
        d: '',
        // 收不到短信验证码弹出框
        showCode: false,
        menus: [{
          label: '60秒后获取验证码短信',
          type: 'disabled',
          value: 'a'
        },
        {
          label: '拨打客服电话',
          type: 'primary ',
          value: 'b'
        }],
        // 显示密码
        pwdShow: false,
        // 所有大按钮加载判断
        loading: false,
        operateTypeListValue: ['1'],
        operateTypeList: [
          { key: '1', value: '车型件', inlineDesc: '例如:您经营一汽大众全车件,则您需要选择此项' },
          { key: '2', value: '专项件', inlineDesc: '例如:您经营全部汽车品牌保险杠,则您需要选择此项' }
        ],
        formData: {
          storeName: '',
          contacter: '',
          shortName: '',
          uname: '',
          password: '',
          code: '',
          openId: '',
          majorBusiness: 0,
          majorBusinessIds: [],
          provinceId: null,
          provinceName: null,
          cityId: null,
          cityName: null,
          regionId: null,
          regionName: null,
          attr: null,
          // 营业执照存储路径
          licenseImg: '',
          channelSource: '1'
        },
        // 获取短信倒计时
        seconds: 60,
        tiemer: null
      }
    },
    created() {
      this.formData.openId = localStorage.getItem('openId')
    },
    mounted() {
      this.$refs.phone.focus()
    },
    computed: {
      findPhoneBtnDisabled() {
        if (this.findPhoneLoading || this.formData.uname.length !== 11) {
          return true
        } else {
          return false
        }
      }
    },
    methods: {
      async subPhone() {
        this.findPhoneLoading = true
        if (RE_PHONE.test(this.formData.uname)) {
          await this.$http.get('/noIntercept/supplier/check/' + this.formData.uname, this.formData).then((response) => {
            if (response.data) {
              this.sendMsg()
              this.showIndex = 1
              setTimeout(() => {
                this.$refs.a.focus()
              }, 50)
            } else {
              this.$vux.toast.text('该手机号已注册过,请直接登录', 'middle')
            }
          })
        } else {
          this.$vux.toast.text('请输入正确的手机号', 'bottom')
        }
        this.findPhoneLoading = false
      },
      countDown() {
        this.timer = setTimeout((e) => {
          this.seconds--
          if (this.seconds === 0) {
            clearTimeout(this.timer)
            this.menus[0].label = '获取验证码短信'
            this.menus[0].type = 'primary'
            this.seconds = 60
          } else {
            this.menus[0].type = 'disabled'
            this.menus[0].label = this.seconds + '后获取验证码短信'
            this.countDown()
          }
        }, 1000)
      },
      clickCode(key, value) {
        if (key === 'a') {
          this.sendMsg()
        }
        if (key === 'b') {
          window.location.href = 'tel:' + CUSTOMER_SERVICE_TEL
        }
      },
      // 发送短信验证码
      async sendMsg() {
        let params = {
          uname: this.formData.uname,
          text: '注册验证码'
        }
        await this.$http.get('/noIntercept/shortMsgs/4', { params }).then((response) => {
          this.countDown()
        })
      },
      changeShowCode() {
        this.showCode ? this.showCode = false : this.showCode = true
      },
      showPwd() {
        this.pwdShow ? this.pwdShow = false : this.pwdShow = true
      },
      // 提交密码
      subPwd() {
        if (!this.formData.password.trim() || this.formData.password.length < 5) {
          this.$vux.toast.text('请输入大于六位的密码', 'bottom')
        } else if (!this.formData.shortName || this.formData.shortName.length > 6) {
          this.$vux.toast.text('请输入小于六位的昵称', 'bottom')
        } else {
          this.showIndex = 3
        }
      },
      chooseOperate() {
        if (this.operateTypeListValue.length) {
          this.formData.majorBusiness = +this.operateTypeListValue[0]
          this.$store.commit(REGISTER_DATA, this.formData)
          this.formData.majorBusiness === 1 && this.$router.push({ name: 'carBrandList', params: { type: 1 } })
          this.formData.majorBusiness === 2 && this.$router.push({ name: 'carPartSorts', params: { type: 1 } })
        } else {
          this.$vux.toast.text('请选择经营范围', 'bottom')
        }
      },
      subForm() {
        this.showIndex = 5
      }
    },
    watch: {
      a() {
        this.a && this.$refs.b.focus()
      },
      b() {
        this.b && this.$refs.c.focus()
      },
      c() {
        this.c && this.$refs.d.focus()
      },
      d() {
        if (this.a && this.b && this.c && this.d) {
          let params = {
            uname: this.formData.uname,
            code: this.a + this.b + this.c + this.d
          }
          this.$http.get('/noIntercept/shortMsgs/actions/validate', { params }).then((response) => {
            this.formData.code = params.code
            this.showIndex = 2
            setTimeout(() => {
              this.$refs.pwd.focus()
            }, 50)
          }).catch((error) => {
            let result = error.response
            result.status === 400 && this.$vux.toast.show({
              text: result.data.message,
              type: 'warn',
              position: 'middle',
              time: '1500'
            })
            this.loading = false
          })
        }
      }
    },
    components: {
      scroll,
      XHeader,
      XButton,
      Group,
      XInput,
      Flexbox,
      FlexboxItem,
      Actionsheet,
      Checklist,
      XAddress,
      Msg
    }
  }
</script>

<style lang="less">
@import "../../styles/sup.less";
.c-register-phone {
  overflow: hidden;
  .c-body {
    overflow: auto;
    height: calc(~"100vh - @{vux-header-height}");
    background-color: @s-background-color;
    .c-account {
      padding: 0 10px 0 10px;
      .c-first {
        padding: 15px 0 15px 0;
      }
      p {
        text-align: center;
      }
    }
    .c-code {
      p {
        text-align: center;
      }
      .weui-cell {
        padding-top: 0;
        padding-bottom: 0;
        .weui-input {
          font-size: 30px;
        }
      }
      .c-code-p {
        color: #0091ea;
      }
      .c-first {
        padding: 15px 0 10px 0;
        color: @s-desc-font-color;
        font-size: 16px;
      }
    }
  }
}
</style>