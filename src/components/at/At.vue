<script>
import {
  closest,
  getOffset,
  getPrecedingRange,
  getRange,
  applyRange,
  scrollIntoView,
  getAtAndIndex
} from './util'

import { format } from 'quasar' // 格式化工具
const { capitalize } = format // 字符串首字母大写
import AtTemplate from './AtTemplate.vue'
import { mapState } from 'vuex'

export default {
  name: 'At',
  mixins: [AtTemplate],
  props: {
    nameKey: {
      type: String,
      required: false,
      default: 'name',
      description: "Person object's key used to display the value"
    },
    // 限定人员范围时使用
    objectID: {
      type: [Number, String],
      required: false
    },
    category: {
      type: String,
      required: false
    }
  },

  data () {
    return {
      at: '',
      ats: ['@'],
      suffix: ';',
      loop: true,
      allowSpaces: true,
      tabSelect: false,
      avoidEmail: false,
      showUnique: true,
      hoverSelect: true,
      scrollRef: '',
      bindsValue: this.value != null,
      customsEmbedded: false,
      hasComposition: false,
      atwho: null,
      curItem: null,
      // @ 的人员数组
      mentionedPersons: []
    }
  },
  computed: {
    ...mapState('person', ['selectPersons']),
    atItems () {
      return this.at ? [this.at] : this.ats
    },
    currentItem () {
      if (this.atwho) {
        return this.atwho.list[this.atwho.cur]
      }
      return ''
    },
    style () {
      if (this.atwho) {
        const { x, y } = this.atwho
        const { wrap } = this.$refs
        if (wrap) {
          const offset = getOffset(wrap)
          const scrollLeft = this.scrollRef ? document.querySelector(this.scrollRef).scrollLeft : 0
          const scrollTop = this.scrollRef ? document.querySelector(this.scrollRef).scrollTop : 0
          const left = x + scrollLeft + window.pageXOffset - offset.left + 'px'
          const top = y + scrollTop + window.pageYOffset - offset.top + 'px'
          return { left, top }
        }
      }
      return null
    },
    model () {
      return this.$store.getters[`${this.category}/${this.category}`](+this.objectID)
    },
    persons () {
      return Object.values(this.selectPersons)
    },
    members () {
      if (this.objectID && this.category) {
        if (this.model && this.model.members && this.model.members.length > 0) {
          let temp = []
          this.model.members.map(member => {
            let person = this.persons.find(person => person.id === +member)
            person && temp.push(person)
          })
          return temp
        } else {
          return []
        }
      } else {
        return this.persons
      }
    }
  },
  watch: {
    'atwho.cur' (index) {
      if (index != null) {
        // cur index exists
        this.$nextTick(() => {
          this.scrollToCur()
        })
      }
    },
    members (val) {
      if (val.length) {
        this.handleInput(true)
      }
    },
    value (value, oldValue) {
      if (this.bindsValue) {
        this.handleValueUpdate(value)
      }
    },
    mentionedPersons () {
      this.$emit('at', _.uniq(this.mentionedPersons))
    }
  },

  created () {
    if (this.objectID && this.category) {
      this.$store.dispatch(`${this.category}/load${capitalize(this.category)}`, this.objectID)
    }
  },

  mounted () {
    if (this.$scopedSlots.embeddedItem) {
      this.customsEmbedded = true
    }
    if (this.bindsValue) {
      this.handleValueUpdate(this.value)
    }
  },

  methods: {
    filterMatch (name, chunk, at) {
      // match at lower-case
      return name.toLowerCase().indexOf(chunk.toLowerCase()) > -1
    },
    deleteMatch (name, chunk, suffix) {
      return chunk === name + suffix
    },
    itemName (v) {
      const { nameKey } = this
      return nameKey ? v[nameKey] : v
    },
    isCur (index) {
      return index === this.atwho.cur
    },
    handleValueUpdate (value) {
      const el = this.$el.querySelector('[contenteditable]')
      if (value !== el.innerHTML) { // avoid range reset
        el.innerHTML = value
        this.dispatchInput()
      }
    },
    dispatchInput () {
      let el = this.$el.querySelector('[contenteditable]')
      let ev = new Event('input', { bubbles: true })
      el.dispatchEvent(ev)
    },
    handleItemHover (e) {
      if (this.hoverSelect) {
        this.selectByMouse(e)
      }
    },
    handleItemClick (e) {
      this.selectByMouse(e)
      this.insertItem()
    },
    handleDelete (e) {
      const range = getPrecedingRange()
      if (range) {
        const { atItems, suffix, deleteMatch, itemName } = this
        const text = range.toString()
        const { at, index } = getAtAndIndex(text, atItems)

        if (index > -1) {
          const chunk = text.slice(index + at.length)
          const has = this.members.some(v => {
            const name = itemName(v)
            return deleteMatch(name, chunk, suffix)
          })
          if (has) {
            // e.preventDefault()
            // e.stopPropagation()
            const r = getRange()
            if (r) {
              r.setStart(r.endContainer, index)
              r.deleteContents()
              this.mentionedPersons.pop()
              applyRange(r)
              this.handleInput()
            }
          }
        }
      }
    },
    handleKeyDown (e) {
      const { atwho } = this
      if (atwho) {
        if (e.keyCode === 38 || e.keyCode === 40) {
          // ↑/↓
          if (!(e.metaKey || e.ctrlKey)) {
            e.preventDefault()
            e.stopPropagation()
            this.selectByKeyboard(e)
          }
          return
        }
        // enter or tab
        if (e.keyCode === 13 || (this.tabSelect && e.keyCode === 9)) { // enter or tab
          this.insertItem()
          e.preventDefault()
          e.stopPropagation()
          return
        }
        // esc
        if (e.keyCode === 27) {
          this.closePanel()
          return
        }
      }

      // 为了兼容ie ie9~11 editable无input事件 只能靠keydown触发 textarea正常
      // 另 ie9 textarea的delete不触发input
      const isValid =
        e.keyCode >= 48 && e.keyCode <= 90 ? e.keyCode === 8 : e.keyCode === 8
      if (isValid) {
        setTimeout(() => {
          this.handleInput()
        }, 50)
      }
      if (e.keyCode === 8) {
        this.handleDelete(e)
      }
    },

    // compositionStart -> input -> compositionEnd
    handleCompositionStart () {
      this.hasComposition = true
    },
    handleCompositionEnd () {
      this.hasComposition = false
      this.handleInput()
    },
    handleInput () {
      if (this.hasComposition) return
      const el = this.$el.querySelector('[contenteditable]')
      this.$emit('input', el.innerHTML)

      const range = getPrecedingRange()
      if (range) {
        const { atItems, avoidEmail, allowSpaces, showUnique } = this

        let show = true
        const text = range.toString()

        const { at, index } = getAtAndIndex(text, atItems)

        // 1.没有'@'字符不弹出面板
        if (index < 0) show = false

        const prev = text[index - 1]
        const chunk = text.slice(index + at.length, text.length)

        // 2.是否避免与邮箱冲突
        if (avoidEmail) {
          // 上一个字符不能为字母数字 避免与邮箱冲突
          // 微信则是避免 所有字母数字及半角符号
          if (/^[a-z0-9]$/i.test(prev)) show = false
        }

        if (!allowSpaces && /\s/.test(chunk)) {
          show = false
        }

        // chunk以空白字符开头不匹配 避免`@ `也匹配
        if (/^\s/.test(chunk)) show = false

        if (!show) {
          this.closePanel()
        } else {
          const { filterMatch, itemName } = this
          const matched = this.members.filter(v => {
            var name = itemName(v)
            var pinyin = v.pinyin.split(',')[0] || ''
            var short = v.pinyin.split(',')[1] || ''
            var a = filterMatch(name, chunk, at)
            var b = filterMatch(pinyin, chunk, at)
            var c = filterMatch(short, chunk, at)
            return a || b || c
          })

          show = false
          if (matched.length) {
            show = true
            if (!showUnique) {
              let item = matched[0]
              if (chunk === itemName(item)) {
                show = false
              }
            }
          }

          if (show) {
            this.openPanel(matched, range, index, at, matched.length)
          } else {
            this.closePanel()
          }
        }
      }
    },

    closePanel () {
      if (this.atwho) {
        this.atwho = null
      }
    },
    openPanel (list, range, offset, at, count) {
      const fn = (list, range, offset, at, count) => {
        const r = range.cloneRange()
        r.setStart(r.endContainer, offset + at.length) // 从@后第一位开始
        // todo: 根据窗口空间 判断向上或是向下展开
        var rectList = r.getClientRects()
        if (rectList.length) {
          var rect = r.getClientRects()[0]
          var yPosition = rect.top - 4
          var bottom = ((window.innerHeight || document.documentElement.clientHeight) - rect.bottom) >= 390
          if (bottom) {
            yPosition = rect.top + rect.height + Math.min(40 * count, 300) + 4
          }
          this.atwho = {
            range,
            offset,
            list,
            x: rect.left,
            y: yPosition,
            cur: 0 // todo: 尽可能记录
          }
        }
      }
      if (this.atwho) {
        fn(list, range, offset, at, count)
      } else { // 焦点超出了显示区域 需要提供延时以移动指针 再计算位置
        setTimeout(fn(list, range, offset, at, count), 10)
      }
    },

    scrollToCur () {
      const curEl = this.$refs.cur[0]
      const scrollParent = curEl.parentElement.parentElement // .atwho-view
      scrollIntoView(curEl, scrollParent)
    },
    selectByMouse (e) {
      const el = closest(e.target, d => {
        return d.getAttribute('data-index')
      })
      const cur = +el.getAttribute('data-index')
      this.atwho = {
        ...this.atwho,
        cur
      }
    },
    selectByKeyboard (e) {
      const offset = e.keyCode === 38 ? -1 : 1
      const { cur, list } = this.atwho
      const nextCur = this.loop
        ? (cur + offset + list.length) % list.length
        : Math.max(0, Math.min(cur + offset, list.length - 1))
      this.atwho = {
        ...this.atwho,
        cur: nextCur
      }
    },

    // todo: 抽离成库并测试
    insertText (text, r) {
      r.deleteContents()
      const node = r.endContainer
      if (node.nodeType === Node.TEXT_NODE) {
        const cut = r.endOffset
        node.data = node.data.slice(0, cut) + text + node.data.slice(cut)
        r.setEnd(node, cut + text.length)
      } else {
        // 解决 文本编辑器里面 中第一个字符为‘@’时不弹出面板，有待观察
        text = '@' + text
        const t = document.createTextNode(text)
        r.insertNode(t)
        r.setEndAfter(t)
      }
      this.mentionedPersons.push(this.curItem)
      r.collapse(false) // 参数在IE下必传
      applyRange(r)
      this.dispatchInput()
    },
    insertHtml (html, r) {
      r.deleteContents()
      const node = r.endContainer
      var newElement = document.createElement('span')

      // Seems `contentediable=false` should includes spaces,
      // otherwise, caret can't be placed well across them
      newElement.appendChild(document.createTextNode(' '))
      newElement.appendChild(this.htmlToElement(html))
      newElement.appendChild(document.createTextNode(' '))
      newElement.setAttribute('data-at-embedded', '')
      newElement.setAttribute('contenteditable', false)

      if (node.nodeType === Node.TEXT_NODE) {
        const cut = r.endOffset
        var secondPart = node.splitText(cut)
        node.parentNode.insertBefore(newElement, secondPart)
        r.setEndBefore(secondPart)
      } else {
        const t = document.createTextNode(suffix)
        r.insertNode(newElement)
        r.setEndAfter(newElement)
        r.insertNode(t)
        r.setEndAfter(t)
      }
      r.collapse(false) // 参数在IE下必传
      applyRange(r)
    },
    insertItem () {
      const { range, list, cur } = this.atwho
      const { suffix, atItems, itemName, customsEmbedded } = this
      const r = range.cloneRange()
      const text = range.toString()
      const { at, index } = getAtAndIndex(text, atItems)

      // Leading `@` is automatically dropped as `customsEmbedded=true`
      // You can fully custom the output inside the embedded slot
      const start = customsEmbedded ? index : index + at.length
      r.setStart(r.endContainer, start)

      // hack: 连续两次 可以确保click后 focus回来 range真正生效
      applyRange(r)
      applyRange(r)
      this.curItem = list[cur]

      if (customsEmbedded) {
        // `suffix` is ignored as `customsEmbedded=true` has to be
        // wrapped around by spaces
        const html = this.$refs.embeddedItem.firstChild.innerHTML
        this.insertHtml(html, r)
      } else {
        const t = itemName(this.curItem) + suffix
        this.insertText(t, r)
      }

      this.$emit('insert', this.curItem)
      this.handleInput()
    },
    htmlToElement (html) {
      var template = document.createElement('template')
      html = html.trim() // Never return a text node of whitespace as the result
      template.innerHTML = html
      return template.content.firstChild
    }
  }
}
</script>
