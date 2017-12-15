<template>
  <div class="c-pwd-find">
    <x-header :left-options="{preventGoBack:true, showBack: false}" :right-options="{showMore:false}" title="找回登录密码">
      <div slot="left" @click="$router.push({name: 'login'})">
        <i slot="icon" class="fa fa-times fa-lg"></i>
      </div>
    </x-header>
    <div class="c-body">
      <div v-show="showIndex===0" class="c-account">
        <p class="c-first">请输入您要找回密码的账号</p>
        <p class="c-second s-p-desc">账号为您注册时的手机号码</p>
        <group gutter="0">
          <x-input :max="11" ref="phone" v-model="formData.uname">
            <div slot="label">
              <i class="fa fa-mobile fa-lg" style="padding-right:10px;"></i>&nbsp;
            </div>
          </x-input>
        </group>
        <br>
        <div class="c-btn">
          <div style="width:80%">
            <x-button :disabled="formData.uname.length===11?false:true" :show-loading="findPhoneLoading" @click.native="findPhone" type="primary">{{findPhoneLoading?'加载中...':'开始找回密码'}}</x-button>
          </div>
        </div>
      </div>
      <div v-show="showIndex===1" class="c-code">
        <p class="c-first">我们已发送
          <span style="font-weight:700;color:#000;">验证码</span>短信到您的手机</p>
        <h4 style="text-align:center;">{{formData.uname.substr(0, 3)+'****'+formData.uname.substr(7)}}</h4>
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
      </div>
      <div v-show="showIndex===2" class="c-pwd">
        <p class="c-first">请为您的账号
          <span>{{formData.uname.substr(0, 3)+'****'+formData.uname.substr(7)}}</span>设置一个新密码</p>
        <br>
        <group>
          <x-input ref="pwd" title="密码" :max="12" :type="pwdShow?'text':'password'" v-model="formData.password">
            <i @click="showPwd" slot="right" :class="pwdShow?'fa fa-eye-slash fa-lg':'fa fa-eye fa-lg'"></i>
          </x-input>
        </group>
        <br>
        <x-button :text="loading?'保存中...':'保存新密码'" :disabled="loading" @click.native="subPwd" :show-loading="loading" type="primary"></x-button>
        <br>
        <!-- <p style="color:#0091ea;">暂不设置,先进入找件儿</p> -->
      </div>
      <actionsheet v-model="showCode" :menus="menus2" show-cancel></actionsheet>
    </div>
  </div>
</template>

<script>
  import { XHeader, XButton, Group, XInput, Flexbox, FlexboxItem, Actionsheet } from 'vux'
  import { RE_PHONE, JWT_TOKEN_HEAD, JWT_HEADER } from '@/components/constant'
  import axios from 'axios'
  export default {
    data() {
      return {
        findPhoneLoading: false,
        showIndex: 0,
        code: '',
        a: '',
        b: '',
        c: '',
        d: '',
        // 收不到短信验证码弹出框
        showCode: false,
        menus2: {
          menu1: '重新获取验证码短信',
          menu2: '拨打客服电话'
        },
        // 显示密码
        pwdShow: false,
        // 提交修改密码等待框
        loading: false,
        formData: {
          uname: '',
          password: ''
        }
      }
    },
    created() {
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
      async findPhone() {
        this.findPhoneLoading = true
        if (RE_PHONE.test(this.formData.uname)) {
          await this.$http.get('/noIntercept/supplier/check/' + this.formData.uname, this.formData).then((response) => {
            if (!response.data) {
              this.sendMsg()
              this.showIndex = 1
              setTimeout(() => {
                this.$refs.a.focus()
              }, 250)
            } else {
              this.$vux.toast.text('该手机号没有注册过,请仔细核对', 'middle')
            }
          })
        } else {
          this.$vux.toast.text('请输入正确的手机号', 'bottom')
        }
        this.findPhoneLoading = false
      },
      // 发送短信验证码
      async sendMsg() {
        let params = {
          uname: this.formData.uname,
          text: '注册验证码'
        }
        await this.$http.get('/noIntercept/shortMsgs/4', { params }).then((response) => {
        })
      },
      changeShowCode() {
        this.showCode ? this.showCode = false : this.showCode = true
      },
      showPwd() {
        this.pwdShow ? this.pwdShow = false : this.pwdShow = true
      },
      subPwd() {
        if (!this.loading) {
          if (this.formData.password.trim() && this.formData.password.length > 5) {
            this.loading = true
            this.$http.put('/noIntercept/members/password', this.formData).then((response) => {
              localStorage.setItem(JWT_HEADER, JWT_TOKEN_HEAD + response.data.token)
              axios.defaults.headers.common[JWT_HEADER] = JWT_TOKEN_HEAD + response.data.token
              this.$vux.toast.show({
                text: '修改成功',
                position: 'middle',
                time: '1200'
              })
              setTimeout(() => {
                this.$router.push({
                  name: 'quoteList'
                })
              }, 1400)
            }).catch((error) => {
              let result = error.response
              result.status === 401 && this.$vux.toast.show({
                text: '修改成功',
                position: 'middle',
                time: '1200'
              })
              setTimeout(() => {
                this.$router.push({
                  name: 'login'
                })
              }, 1400)
            })
          } else {
            this.$vux.toast.text('请输入大于六位的密码', 'bottom')
          }
        }
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
      Actionsheet
    }
  }
</script>

<style lang="less">
@import "../../styles/sup.less";
.c-pwd-find {
  overflow: hidden;
  .c-body {
    overflow: auto;
    height: calc(~"100vh - @{vux-header-height}");
    background-color: @s-background-color;
    p {
      text-align: center;
    }
    .c-account {
      .c-first {
        font-size: @s-p-first-size;
        padding-top: 10px;
      }
      .c-second {
        font-size: @s-p-second-size;
      }
      .c-btn {
        .display-flex;
        .justify-content(center);
      }
    }
    .c-code {
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
    .c-pwd {
      button.weui-btn,
      input.weui-btn {
        width: 80%;
      }
      .c-first {
        font-size: 16px;
        padding-top: 10px;
        color: @s-desc-font-color;
        span {
          font-weight: 700;
          color: #000;
        }
      }
    }
  }
}
</style>