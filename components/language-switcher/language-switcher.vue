<template>
  <view>
    <!-- 语言切换按钮 -->
    <view class="language-btn" @click="showLanguagePicker">
      <image 
        class="flag-icon" 
        :src="'/static/flags/' + currentLangFlag + '.svg'" 
        mode="aspectFit"
      />
    </view>

    <!-- 语言选择弹窗 -->
    <view class="language-popup" v-if="showPicker">
      <view class="popup-header">
        <view class="back-btn" @click="showPicker = false">
          <text class="back-icon">←</text>
        </view>
        <text class="popup-title">{{ $t('selectLanguage') }}</text>
      </view>
      <scroll-view scroll-y class="popup-body">
        <view 
          class="language-item" 
          v-for="lang in languages" 
          :key="lang.code"
          @click="selectLanguage(lang.code)"
        >
          <view class="lang-info">
            <image 
              class="flag-icon" 
              :src="'/static/flags/' + lang.flag + '.svg'" 
              mode="aspectFit"
            />
            <text class="lang-name">{{ lang.name }}</text>
          </view>
          <text class="check-mark" v-if="currentLang === lang.code">✓</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import languages from '@/locale/index.js'

export default {
  name: 'LanguageSwitcher',
  data() {
    return {
      showPicker: false,
      languages: [
        { 
          code: 'zh-Hans', 
          name: '简体中文', 
          flag: 'CN'
        },
        { 
          code: 'en', 
          name: 'English', 
          flag: 'GB'
        },
        { 
          code: 'es', 
          name: 'Español', 
          flag: 'ES'
        },
        { 
          code: 'fr', 
          name: 'Français', 
          flag: 'FR'
        },
        { 
          code: 'de', 
          name: 'Deutsch', 
          flag: 'DE'
        },
        { 
          code: 'ja', 
          name: '日本語', 
          flag: 'JP'
        },
        { 
          code: 'ko', 
          name: '한국어', 
          flag: 'KR'
        },
        { 
          code: 'ru', 
          name: 'Русский', 
          flag: 'RU'
        },
        { 
          code: 'ar', 
          name: 'العربية', 
          flag: 'SA'
        }
      ]
    }
  },
  computed: {
    currentLang() {
      return this.$i18n.locale
    },
    currentLangFlag() {
      const lang = this.languages.find(l => l.code === this.currentLang)
      return lang ? lang.flag : 'CN'
    }
  },
  methods: {
    showLanguagePicker() {
      this.showPicker = true
    },
    selectLanguage(langCode) {
      try {
        // 从预加载的语言包中获取
        const messages = languages[langCode]
        if (messages) {
          this.$i18n.setLocaleMessage(langCode, messages)
          this.$i18n.locale = langCode
          uni.setStorageSync('language', langCode)
          this.showPicker = false
          
          // 刷新视图
          this.$forceUpdate()
          
          // 显示提示
          uni.showToast({
            title: this.$t('success'),
            icon: 'success',
            duration: 2000
          })
          
          // 通知父组件语言已更改
          this.$emit('language-changed', langCode)
        } else {
          throw new Error('Language pack not found')
        }
      } catch (error) {
        console.error('Failed to load language pack:', error)
        uni.showToast({
          title: this.$t('error'),
          icon: 'none'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.language-btn {
  width: 60rpx;
  height: 40rpx;
  overflow: hidden;
  background-color: transparent;
  padding: 0;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .flag-icon {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.language-popup {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: #121212;
  z-index: 999;
}

.popup-header {
  position: relative;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  .back-btn {
    position: absolute;
    left: 30rpx;
    height: 88rpx;
    display: flex;
    align-items: center;
  }
  
  .back-icon {
    font-size: 36rpx;
    color: #ffffff;
  }
  
  .popup-title {
    font-size: 32rpx;
    color: #ffffff;
    font-weight: 500;
  }

}

.popup-body {
  height: calc(100vh - 88rpx);
}

.language-item {
  padding: 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  .lang-info {
    display: flex;
    align-items: center;
    gap: 20rpx;
    
    .flag-icon {
      width: 60rpx !important;
      height: 40rpx !important;
      border-radius: 4rpx;
      object-fit: contain;
    }
  }
  
  .lang-name {
    font-size: 28rpx;
    color: #ffffff;
  }
  
  .check-mark {
    color: #1db954;
    font-size: 32rpx;
  }
}
</style> 