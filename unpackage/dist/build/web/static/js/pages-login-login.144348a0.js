(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-login-login"],{"08e4":function(a,t,i){"use strict";i.r(t);var n=i("400b"),e=i("0d5f");for(var o in e)["default"].indexOf(o)<0&&function(a){i.d(t,a,(function(){return e[a]}))}(o);i("920b");var s=i("828b"),r=Object(s["a"])(e["default"],n["b"],n["c"],!1,null,"052a5ba7",null,!1,n["a"],void 0);t["default"]=r.exports},"0d5f":function(a,t,i){"use strict";i.r(t);var n=i("bbd3"),e=i.n(n);for(var o in n)["default"].indexOf(o)<0&&function(a){i.d(t,a,(function(){return n[a]}))}(o);t["default"]=e.a},"2faa":function(a,t,i){var n=i("c86c");t=n(!1),t.push([a.i,".container[data-v-052a5ba7]{min-height:100vh;background-color:#121212;position:relative;box-sizing:border-box}.nav-bar[data-v-052a5ba7]{position:fixed;top:0;left:0;right:0;height:%?88?%;padding:0 %?32?% 0;display:flex;align-items:center;background-color:#121212;z-index:100}.icon-back[data-v-052a5ba7]{font-size:%?48?%;color:#fff;padding:%?16?%}.nav-title[data-v-052a5ba7]{flex:1;text-align:center;color:#fff;font-size:%?32?%;font-weight:500;margin-right:%?80?% /* 补偿返回按钮的宽度，保持标题居中 */}.content[data-v-052a5ba7]{padding:calc(%?88?% + 0px) %?40?% %?40?%;display:flex;flex-direction:column;align-items:center;box-sizing:border-box;width:100%}.logo-container[data-v-052a5ba7]{padding:%?80?% 0;display:flex;flex-direction:column;align-items:center;width:100%}.logo[data-v-052a5ba7]{width:%?128?%;height:%?128?%;margin-bottom:%?32?%}.app-name[data-v-052a5ba7]{font-size:%?48?%;color:#fff;font-weight:600}.form-container[data-v-052a5ba7]{width:100%;padding:0 %?32?%;box-sizing:border-box}.input-group[data-v-052a5ba7]{margin-bottom:%?48?%;width:100%}.input[data-v-052a5ba7]{width:100%;height:%?88?%;background:#1e1e1e;border:%?2?% solid #2a2a2a;border-radius:%?16?%;margin-bottom:%?24?%;padding:0 %?32?%;color:#fff;font-size:%?30?%;box-sizing:border-box}.input[data-v-052a5ba7]:last-child{margin-bottom:0}.input[data-v-052a5ba7]::-webkit-input-placeholder{color:#666}.input[data-v-052a5ba7]::placeholder{color:#666}.btn[data-v-052a5ba7]{width:100%;height:%?88?%;border-radius:%?16?%;font-size:%?32?%;font-weight:500;display:flex;align-items:center;justify-content:center;margin-bottom:%?48?%;box-sizing:border-box}.btn-primary[data-v-052a5ba7]{background:#2c6eff;color:#fff;border:none}.btn-wallet[data-v-052a5ba7]{background:#1e1e1e;border:%?2?% solid #2a2a2a;color:#fff}.divider[data-v-052a5ba7]{display:flex;align-items:center;margin:%?48?% 0;width:100%}.line[data-v-052a5ba7]{flex:1;height:%?2?%;background-color:#2a2a2a}.divider-text[data-v-052a5ba7]{padding:0 %?32?%;color:#666;font-size:%?28?%}.action-links[data-v-052a5ba7]{display:flex;justify-content:space-between;margin-top:%?48?%;padding:0 %?16?%;width:100%}.link[data-v-052a5ba7]{color:#666;font-size:%?28?%}.link.highlight[data-v-052a5ba7]{color:#2c6eff}\r\n\r\n/* 按钮点击效果 */.btn[data-v-052a5ba7]:active{opacity:.8}\r\n\r\n/* 输入框焦点效果 */.input[data-v-052a5ba7]:focus{border-color:#2c6eff;background:#1e1e1e}\r\n\r\n/* 适配 iPhone X 及以上机型 */@supports (bottom:constant(safe-area-inset-bottom)) or (bottom:env(safe-area-inset-bottom)){.container[data-v-052a5ba7]{padding-bottom:constant(safe-area-inset-bottom);padding-bottom:env(safe-area-inset-bottom)}}\r\n\r\n/* 适配小屏幕设备 */@media screen and (max-height:667px){.logo-container[data-v-052a5ba7]{padding:%?40?% 0}.logo[data-v-052a5ba7]{width:%?100?%;height:%?100?%}.app-name[data-v-052a5ba7]{font-size:%?40?%}}",""]),a.exports=t},"400b":function(a,t,i){"use strict";i.d(t,"b",(function(){return n})),i.d(t,"c",(function(){return e})),i.d(t,"a",(function(){}));var n=function(){var a=this,t=a.$createElement,i=a._self._c||t;return i("v-uni-view",{staticClass:"container"},[i("v-uni-view",{staticClass:"nav-bar"},[i("v-uni-text",{staticClass:"iconfont icon-back",on:{click:function(t){arguments[0]=t=a.$handleEvent(t),a.goBack.apply(void 0,arguments)}}}),i("v-uni-text",{staticClass:"nav-title"},[a._v(a._s(a.$t("login")))])],1),i("v-uni-view",{staticClass:"content"},[i("v-uni-view",{staticClass:"logo-container"},[i("v-uni-image",{staticClass:"logo",attrs:{src:"/static/logo.png",mode:"aspectFit"}}),i("v-uni-text",{staticClass:"app-name"},[a._v(a._s(a.$t("webname")))])],1),i("v-uni-view",{staticClass:"form-container"},[i("v-uni-view",{staticClass:"input-group"},[i("v-uni-input",{staticClass:"input",attrs:{type:"text",placeholder:a.$t("email")},model:{value:a.email,callback:function(t){a.email=t},expression:"email"}}),i("v-uni-input",{staticClass:"input",attrs:{type:"password",placeholder:a.$t("password")},model:{value:a.password,callback:function(t){a.password=t},expression:"password"}})],1),i("v-uni-button",{staticClass:"btn btn-primary",on:{click:function(t){arguments[0]=t=a.$handleEvent(t),a.handleEmailLogin.apply(void 0,arguments)}}},[a._v(a._s(a.$t("login")))]),i("v-uni-view",{staticClass:"divider"},[i("v-uni-view",{staticClass:"line"}),i("v-uni-text",{staticClass:"divider-text"},[a._v(a._s(a.$t("or")))]),i("v-uni-view",{staticClass:"line"})],1),i("v-uni-button",{staticClass:"btn btn-wallet",on:{click:function(t){arguments[0]=t=a.$handleEvent(t),a.handleWeb3Login.apply(void 0,arguments)}}},[a._v(a._s(a.$t("loginWithWallet")))]),i("v-uni-view",{staticClass:"action-links"},[i("v-uni-text",{staticClass:"link",on:{click:function(t){arguments[0]=t=a.$handleEvent(t),a.navigateToForgotPassword.apply(void 0,arguments)}}},[a._v(a._s(a.$t("forgotPassword")))]),i("v-uni-text",{staticClass:"link highlight",on:{click:function(t){arguments[0]=t=a.$handleEvent(t),a.navigateToRegister.apply(void 0,arguments)}}},[a._v(a._s(a.$t("register")))])],1)],1)],1)],1)},e=[]},4969:function(a,t,i){var n=i("2faa");n.__esModule&&(n=n.default),"string"===typeof n&&(n=[[a.i,n,""]]),n.locals&&(a.exports=n.locals);var e=i("967d").default;e("1837ee9e",n,!0,{sourceMap:!1,shadowMode:!1})},"920b":function(a,t,i){"use strict";var n=i("4969"),e=i.n(n);e.a},bbd3:function(a,t,i){"use strict";i("6a54"),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,i("5c47"),i("0506"),i("0c26");var n={data:function(){return{email:"",password:""}},methods:{goBack:function(){uni.navigateBack()},validateEmail:function(a){return/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(a)},validatePassword:function(a){return a.length>=6},validateForm:function(){return this.email.trim()?this.validateEmail(this.email)?this.password?!!this.validatePassword(this.password)||(uni.showToast({title:"密码不能少于6位",icon:"none"}),!1):(uni.showToast({title:"请输入密码",icon:"none"}),!1):(uni.showToast({title:"邮箱格式不正确",icon:"none"}),!1):(uni.showToast({title:"请输入邮箱",icon:"none"}),!1)},handleEmailLogin:function(){if(this.validateForm()){var a={user_mail:this.email.trim(),password:this.password};this.$service("/api/Login","post",a).then((function(a){console.log(a),a=a.data,0===a.code?(uni.showToast({title:"登录成功",icon:"success"}),uni.setStorageSync("token","bearer "+a.data.access_token),uni.switchTab({url:"/pages/mine/mine"})):1==a.code&&uni.showToast({title:a.message,icon:"none"})})).catch((function(a){console.error("请求失败:",a),uni.showToast({title:"请求失败，请稍后再试",icon:"none"})}))}},handleWeb3Login:function(){console.log("Web3 wallet login")},navigateToForgotPassword:function(){console.log("Navigate to forgot password"),uni.navigateTo({url:"/pages/forget/forget"})},navigateToRegister:function(){console.log("Navigate to register"),uni.navigateTo({url:"/pages/register/register"})}}};t.default=n}}]);