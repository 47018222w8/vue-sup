<template>
  <div class="c-register">
    <x-header :left-options="{preventGoBack:true, showBack: false}" :right-options="{showMore:false}" title="注册">
      <div slot="left" @click="$router.push({name: 'login'})">
        <i slot="icon" class="fa fa-times fa-lg"></i>
      </div>
    </x-header>
    <div v-show="showIndex===0" class="c-account">
      <p class="c-first">注册共分为3步,过程中需要上传企业营业执照,建议您事先准备好</p>
      <group>
        <x-input :max="11" ref="phone" placeholder="请输入手机号" v-model="uname">
          <div slot="label">
            <i class="fa fa-mobile fa-lg" style="padding-right:10px;"></i>&nbsp;
          </div>
        </x-input>
      </group>
      <br>
      <x-button :disabled="uname.length===11?false:true" :show-loading="findPhoneLoading" @click.native="subPhone" type="primary">{{findPhoneLoading?'加载中...':'开始注册'}}</x-button>
    </div>
    <div v-show="showIndex===1" class="c-code">
      <br>
      <h3 style="text-align:center;">输入短信验证码</h3>
      <p class="s-p-desc">已结向
        <span style="font-size:16px;">{{uname}}</span> 发送短信验证码</p>
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
    </div>
    <div v-show="showIndex===2" class="c-pwd">
      <br>
      <h3 style="text-align:center;">设置登录密码和昵称</h3>
      <br>
      <group label-width="4.5em" label-margin-right="2em" label-align="right">
        <x-input ref="pwd" title="登录密码" placeholder="长度6-12位,不能全是数字" :max="12" :type="pwdShow?'text':'password'" v-model="password">
          <i @click="showPwd" slot="right" :class="pwdShow?'fa fa-eye-slash fa-lg':'fa fa-eye fa-lg'"></i>
        </x-input>
        <x-input title="昵称" :max="6" placeholder="让买家可以轻松记住您,最多6个字" v-model="nickName"></x-input>
      </group>
      <br>
      <x-button :text="loading?'加载中...':'下一步'" :disabled="password.length?false:true" @click.native="subPwd" :show-loading="loading" type="primary"></x-button>
    </div>
    <div v-show="showIndex===3" class="c-operate-type">
      <br>
      <h2 style="text-align:center;">请选择经营类别</h2>
      <br>
      <checklist label-position="left" :options="operateTypeList" v-model="operateTypeListValue" :max="1"></checklist>
      <br>
      <x-button :text="loading?'加载中...':'确认'" :disabled="loading" @click.native="chooseOperate" :show-loading="loading" type="primary"></x-button>
    </div>
    <div class="c-company" v-show="showIndex===4">
      <br>
      <h3 style="text-align:center;">设置登录密码和昵称</h3>
      <br>
      <group title="您填写的信息只用于注册，我们会严格保密，请放心填写" label-width="5em" label-margin-right="2em" label-align="right">
        <x-input title="企业名称" :max="50" placeholder="请输入同营业执照一致的名称" v-model="formData.storeName"></x-input>
        <x-input title="企业法人" :max="50" placeholder="请输入同营业执照一致的企业法人姓名" v-model="formData.contacter"></x-input>
        <x-address title="所属省市区" value-text-align="left" :list="addressData" placeholder="请选择企业所在的区域" :show.sync="showAddress"></x-address>
        <x-input title="详细地址" :max="50" placeholder="请填写详细地址" v-model="formData.address"></x-input>
      </group>
      <br>
      <div class="imgDiv">
        <label for="img0">
          <p class="s-p-desc" style="padding-top:10px;">请上传您的营业执照正面</p>
          <i slot="icon" v-show="!imgShow" class="fa fa-camera fa-4x s-p-desc" style="padding-bottom:20px;"></i>
          <img v-show="imgShow" :src="imgSrc" width="80px" alt="">
          <input id="img0" style="display:none;" type="file" ref="img" accept="image/*" @change="uploadImg">
        </label>
      </div>
      <br>
      <x-button :text="loading?'加载中...':'提交'" :disabled="loading" @click.native="subForm" :show-loading="loading" type="primary"></x-button>
    </div>
    <div class="c-msg" v-show="showIndex===5">
      <msg title="提交成功" icon="waiting">
        <div slot="description">
          <p class="s-p-desc">我们会在 1 个工作日内审核完成</p>
          <p class="s-p-desc">审核完成后会以短信通知您</p>
        </div>
      </msg>
    </div>
    <actionsheet v-model="showCode" :menus="menus2" show-cancel></actionsheet>
  </div>
</template>

<script>
import { XHeader, XButton, Group, XInput, Flexbox, FlexboxItem, Actionsheet, Checklist, XAddress, ChinaAddressV4Data, Msg } from 'vux'
import { RE_PHONE } from '@/components/constant'
export default {
  data() {
    return {
      // 手机号/账号
      uname: '',
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
      // 所有大按钮加载判断
      loading: false,
      password: '',
      nickName: '',
      operateTypeListValue: ['0'],
      operateTypeList: [
        { key: '0', value: '车型件', inlineDesc: '例如:您经营一汽大众全车件,则您需要选择此项' },
        { key: '1', value: '专项件', inlineDesc: '例如:您经营全部汽车品牌保险杠,则您需要选择此项' },
        { key: '2', value: '修复件', inlineDesc: '例如：您经营 大灯的外修， 则您需要选择此项' }
      ],
      formData: {
        storeName: '',
        contacter: '',
        attr: ''
      },
      addressData: ChinaAddressV4Data,
      showAddress: false,
      imgShow: false,
      imgSrc: ''
    }
  },
  created() {
  },
  mounted() {
    this.$refs.phone.focus()
  },
  computed: {
    findPhoneBtnDisabled() {
      if (this.findPhoneLoading || this.uname.length !== 11) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    subPhone() {
      this.findPhoneLoading = true
      if (RE_PHONE.test(this.uname)) {
        this.showIndex = 1
        setTimeout(() => {
          this.$refs.a.focus()
        }, 50)
      } else {
        this.$vux.toast.text('请输入正确的手机号', 'bottom')
      }
      this.findPhoneLoading = false
    },
    changeShowCode() {
      this.showCode ? this.showCode = false : this.showCode = true
    },
    showPwd() {
      this.pwdShow ? this.pwdShow = false : this.pwdShow = true
    },
    // 提交密码
    subPwd() {
      if (this.password.trim() && this.password.length > 5) {
        this.showIndex = 3
      } else {
        this.$vux.toast.text('请输入大于六位的密码', 'bottom')
      }
    },
    chooseOperate() {
      if (this.operateTypeListValue.length) {
        this.showIndex = 4
      } else {
        this.$vux.toast.text('请选择经营范围', 'bottom')
      }
    },
    uploadImg() {
      /* eslint-disable no-undef */
      lrz(this.$refs.img.files[0], { width: 1024 })
        .then((rst) => {
          this.imgSrc = rst.base64
          this.imgShow = true
          return rst
        })
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
        this.showIndex = 2
        setTimeout(() => {
          this.$refs.pwd.focus()
        }, 50)
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
    ChinaAddressV4Data,
    Msg
  }
}
</script>

<style lang="less">
@import "../../styles/sup.less";
.c-register {
  height: 100vh;
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
    background-color: #fff;
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
  .c-pwd {
    button.weui-btn,
    input.weui-btn {
      width: 80%;
    }
    background-color: #fff;
    .c-first {
      font-size: 16px;
      padding-top: 10px;
      color: @s-desc-font-color;
      span {
        font-weight: 700;
        color: #000;
      }
    }
    p {
      text-align: center;
    }
  }
  .c-company {
    .imgDiv {
      border: 1px solid @s-desc-font-color;
      text-align: center;
      width: 60%;
      margin: 0 auto;
    }
    background-color: #fff;
  }
}
</style>