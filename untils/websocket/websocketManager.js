import pako from 'pako'
import { store, mutations } from '@/store/websocket/store.js'

class HuobiWebSocketManager {
  constructor() {
    this.url = 'wss://api.huobi.pro/ws'
    this.ws = null
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectInterval = 3000
    this.pendingSubscriptions = []
    this.subscribedSymbols = new Set()
  }

  connect() {
    if (this.ws) {
      console.log('WebSocket is already connected')
      return
    }

    this.ws = uni.connectSocket({
      url: this.url,
      success: () => {
        console.log('WebSocket connection initiated')
      },
      fail: (error) => {
        console.error('Failed to initiate WebSocket connection:', error)
        this.scheduleReconnect()
      }
    })

    this.ws.onOpen(() => {
      console.log('WebSocket connection opened')
      this.reconnectAttempts = 0
      mutations.setIsConnected(true)
      this.heartbeat()
      this.processPendingSubscriptions()
    })

    this.ws.onClose((event) => {
      console.log('WebSocket connection closed', event)
      this.ws = null
      mutations.setIsConnected(false)
      this.scheduleReconnect()
    })

    this.ws.onError((error) => {
      console.error('WebSocket error:', error)
    })

    this.ws.onMessage((res) => {
      if (res.data instanceof ArrayBuffer) {
        const data = pako.inflate(new Uint8Array(res.data), { to: 'string' })
        const json = JSON.parse(data)
        if (json.ping) {
          this.handlePing(json.ping)
        } else if (json.ch) {
          this.handlePriceUpdate(json)
        }
      }
    })
  }

  handlePing(ping) {
    this.send({
      pong: ping
    })
  }

  heartbeat() {
    setInterval(() => {
      if (this.ws && this.ws.readyState === 1) {
        this.send({
          ping: Date.now()
        })
      }
    }, 5000)
  }

  scheduleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`)
      setTimeout(() => this.connect(), this.reconnectInterval)
    } else {
      console.error('Max reconnect attempts reached. Please check your connection and restart the app.')
    }
  }

  send(data) {
    if (!this.ws) {
      console.error('WebSocket is not connected')
      return
    }

    this.ws.send({
      data: JSON.stringify(data),
      success: () => {
        // console.log('Message sent successfully')
      },
      fail: (error) => {
        console.error('Failed to send message:', error)
      }
    })
  }

  subscribe(symbol) {
    const channel = `market.${symbol}.ticker`
    if (this.subscribedSymbols.has(symbol)) {
      return
    }
    this.subscribedSymbols.add(symbol)
    if (this.ws && this.ws.readyState === 1) {
      this.send({
        sub: channel,
        id: Date.now()
      })
    } else {
      this.pendingSubscriptions.push(channel)
    }
  }

  processPendingSubscriptions() {
    this.pendingSubscriptions.forEach((channel) => {
      this.send({
        sub: channel,
        id: Date.now()
      })
    })
    this.pendingSubscriptions = []
  }

  handlePriceUpdate(data) {
    var symbol1 = data.ch.split('.')[1]
	const symbol = (symbol1.replace("usdt","")).toUpperCase()+"/USDT"
    const newPrice = data.tick.close
    const oldPrice = data.tick.open || newPrice
    mutations.updatePrice(symbol, newPrice.toFixed(2))
    const priceChange = ((newPrice - oldPrice) / oldPrice) * 100
    mutations.updatePriceChange(symbol, priceChange.toFixed(2))
  }

  unsubscribe(symbol) {
    const channel = `market.${symbol}.ticker`
    this.subscribedSymbols.delete(symbol)
    if (this.ws && this.ws.readyState === 1) {
      this.send({
        unsub: channel,
        id: Date.now()
      })
    }
  }

  close() {
    if (this.ws) {
      this.ws.close({
        success: () => {
          console.log('WebSocket closed successfully')
        },
        fail: (error) => {
          console.error('Failed to close WebSocket:', error)
        }
      })
    }
  }
}

const huobiWebsocketManager = new HuobiWebSocketManager()

export default huobiWebsocketManager