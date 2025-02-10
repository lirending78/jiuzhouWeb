import Vue from 'vue'

export const store = Vue.observable({
  prices: {},
  priceChanges: {},
  isConnected: false
})

export const mutations = {
  setPrices(prices) {
    store.prices = prices
  },
  setPriceChanges(priceChanges) {
    store.priceChanges = priceChanges
  },
  setIsConnected(isConnected) {
    store.isConnected = isConnected
  },
  updatePrice(symbol, price) {
    Vue.set(store.prices, symbol, price)
  },
  updatePriceChange(symbol, change) {
    Vue.set(store.priceChanges, symbol, change)
  }
}