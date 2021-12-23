import { date } from 'quasar'
import { mapState } from 'vuex'
const config = require('app/app.config.js')
const { formatDate } = date
const nowYear = formatDate(Date.now(), 'YYYY')
const nowMonth = formatDate(Date.now(), 'MM')
const nowDay = formatDate(Date.now(), 'DD')
export default {
  data () {
    return {
      rowKey: 'OrganizeID',
      extranet: config.extranet,
      selectYear: '近一年',
      searchDate: {
        from: `${nowYear - 1}-${nowMonth}-${nowDay}`,
        to: `${nowYear}-${nowMonth}-${nowDay}`
      }
    }
  },
  computed: {
    ...mapState('project', ['projectRank']),
    title () {
      return this.$t('project.projectRank')
    },
    tableData () {
      let allData = _.cloneDeep(this.projectRank)
      let table = []
      if (this.$custom.isRegionAndBranchOfProjectRank) {
        let regionData = _.orderBy(_.filter(allData, r => r.Level === 2), 'Count', 'desc'),
          branchData = _.orderBy(_.filter(allData, r => r.Level === 3), 'Count', 'desc')
        let regionTip = _.filter(regionData, r => r.OrganizeID === +regionData[0].PsonMainRegion)
        let branchTip = _.filter(branchData, r => r.OrganizeID === +regionData[0].PsonMainBranch)
        table.push({ key: 'region', title: '大区', mainOrg: (regionTip && regionTip.length > 0) ? regionTip[0] : null, data: regionData })
        table.push({ key: 'branch', title: '分公司', mainOrg: (branchTip && branchTip.length > 0) ? branchTip[0] : null, data: branchData })
      } else {
        let orgTip = _.filter(allData, r => r.OrganizeID === +allData[0].PsonMainOrg)
        let orderByData = _.orderBy(allData, 'Count', 'desc')
        table.push({ key: 'org', title: '机构', mainOrg: (orgTip && orgTip.length > 0) ? orgTip[0] : null, data: orderByData })
      }
      return table
    },
    titleTips () {
      let tips = []
      let data = _.cloneDeep(this.tableData)
      if (data && data.length) {
        _.forEach(data, r => {
          tips.push({
            key: r.key, data: r.mainOrg
          })
        })
      }
      return tips
    },
    psonMainOrg () {
      let psonMainId = '', projs = _.cloneDeep(this.condition.params.projectCount)
      let aa = _.filter(projs, r => r.OrganizeID === +psonMainId)
      if (aa && aa.length) {
        return aa[0]
      } else {
        return ''
      }
    },
    yearOptions () {
      // 获取当前年月日      
      let year = [{ label: `${nowYear}年`, value: `${nowYear}` }]
      for (let index = 0; index < 5; index++) {
        const element = index + 1
        year.push({ label: `${nowYear - element}年`, value: `${nowYear - element}` })
      }
      // 是否添加最近一年
      year.unshift({ label: '近一年', value: 'latest' })
      return year
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    topThreeBg (rowIndex) {
      let bg = ''
      if (rowIndex === 1) {
        bg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAA/CAMAAACclMsnAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAMAUExURUdwTNGKFMyMFP/ttP/ts/rjpf/rs//NPP//yf/tutCTG9acJ/+6RvznrfjfnPfOdfTjqf3qtNKKFPzlq8uHDsqHDsuHDdCTH86NGP/srMuGDcqGDf/uuMyLFtCRGNKWJ9OZIdCSGf/qpsqGDvjgndqfJ9WeJtmhJtukN96qRNafKNeeJ9adJeG0TdqlL/XZkffcl/rjpffosdypP/frtvLdne3Vk/PgovznrtutUtOZINSZIciBCNKaMtKSGsmDCsiBB9WZIsyNFcaCCMZ/Bs2ME9mmRciDC9ScNcd+B82KFMyMEtCUKdGWHv7ors6OFdGTGt6zXNKbM8Z+BdGUG8uLG//uuc2NFP/qos2MFPjeluOzPtSbI+G1SuO7adiiK+O3UdupMtqmLuW+VdmiLOrEatihKtqnNNmlLuK1Rei+X/ngotmjLdqpMOe9WtunMfbTjffYkOjBYuvIcO/NeefFePHQgOzNh/ntufTlqubCb/DbnvLanuO6Y+bCdOG7Z92zWd2sLOC0R9+zQ92rKdypIt6wOt6wON6xPP/mrtyqJN2uM92sLt6vNt+yQP/lrNyqJt2tMP/iot6xPt+yQv/jpf/kqv/vyf/tw//fmf/kqNuoMP/swf/gnMeBCd6vNcyJEP/hn//nserIdv/ns9upNuO7V//gm//eltKWHd2uMdKYH9WdJd+0ReK3T//hof/ipO3Nfv/otPfhqf/rvf/mr/jjru7ShtyrKPvouf/uxvLQgOvLeerHcebAYc6PFv/dk+G2TPHTieW8XN2tLvHVkf/quvXdofLYltupMv/pue7Qg+S+Xt+vPvDNe+/MePTWi+vPf8+QF+fDadahL+jFbvPZmdSbJdmlLNytP/HUjtijLOO5Uu/Pgf/pt+rEa/nksvzqvtyrNMiDCt2tMufCZtejMuO5W9ehJ96vSPTbntejQPbepOG3Vd6tOfjdndqrTe3KfOnMgu3TkMR8A8V9BPTam/rltOW8Yvnls+jDbvPYmNiiKvrir+bAXd2yW4E2//wAAADzdFJOUwAdJv2R+/sFAZH+/AORkQrAkRP5hrdTqXeR/Oz7/uD8+o6RWvst0zQOB/xmmP78+/uRwD3A/jrA+zJuoPLfREywPPx+5fBkRpXATH7IX/399fv8jsT3xa88vScly1bRy/30kCf4up77Xln9KWzDiNodXPTC7p2ObIDZ+8BM+9ikcv///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////v///////////////////////////kasHlEAAANpSURBVEjH7ddnVFJhGMDxhqJpzjQzrUxtOEpt72F777333nuHgCggiIghXhEjSEVwgBiImttSc28ttdTSNEd73wvn1Md732996H/er7/zPOflci706fM/9Lba21tb6+joDIAzMzMy8vDwMDY23o7GdPrjcLa2OBxu2iBdXV1HR3d3N7ei9LNobPPqx3ARERHBwcEPQ0PDw8MDAoouoin9QeFa8RARMTExsbGx7MJDaOzEO2RGqEYExLK5XG5QEPf4aTR2rigYWUsruEEMBsM34Z10Fxq7XB/AZrORGUEMX9+E+3Dx6QU70NiFZ5oZWvEgPv453It9+mg3cj6JwfgrsrOfZsvle0+hDTtQ9yIpKekZXGFh4VO5HJJDHEi4H40dCyzo7Gx6EoJUAEEcDkel+lF1FPVj0/vTmQyVSnUPLqt2FPZn02R8N0xUHAj6enAgdjax9hsENTY2KpXj9gB8E05+VyiVyk8NDYrxrgDs8JEvDQqFQibLfe0CwEaPk8lkb9/m5Aiix2BXTs6fc3La2j5WfGs1dMLOxkQLKnJzc7OyaqpHA+zoUpmXVVNTk56YaDgTgLk6wyIvrz5OIJ4BwHYK6+PiutVqQWvkfOxqoN0btUCQnJxc/iZyLHY2StyRXF5eWtrc3DIcYMdVkRnNzSkpKfkZdlYAbKQ4JT8/QyQSSUuGALCNhiJRXZ1UmlZdMge70l9bJk1LS/Py8mpJNcfO+qUKYSLxkkgqQW7EIbVagkSQGGwBuZE1BAkBiT5sBQDbZqBBgQQhfzkAW1QZSKAjlfH7Yld9+bV0Ogs+LLENwLDBfCGLRWf5sHw8LQGYBR8WSN5DLQCYpaePt483XMjLwQDMJhIxZDI5mtcP4EZeRpM1+RnM0sfO5vKqyH6a+MsAdlzAo/qF+YWFUam8DQBs3lCEwKfqgwMAW1hCpb6KesWMAroR8/fiKGYUEz7iTQCvqCW810wmk5ZJo41YCbDjkGG0zEwanobHr18KwKxG4LXR2hcDsNlliCESiU1d07Grse1CIvHRI/hUr9MDeGl3NRER5O/fsRtgx7u/8P6aKNcvAbA7tyj+FKTMnisA7HY+hUKikEgkQu8UgJ8xPSKStp+TTbCzKb3FanVxcXFe4uRrADvevDF1qqmp6YQJkyZd/Tf+YvwGFmm65iEev8cAAAAASUVORK5CYII='
      } else if (rowIndex === 2) {
        bg = 'data:image/png;base64,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'
      } else {
        bg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAA/CAMAAACclMsnAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAMAUExURUdwTKVzUOPCsd+/rNi1nryNaP/u3b+SbeXGtsyiheK8q+PAr72MZ8mefevFsK17VuTCsK97V8qbeuXDs9mzmf/dxt/AreHBruC9qtaxmr2PauG/rL+QbLKBXODBr7qEXOHBrqp3VMaae+nHuOTEs966puDBrtq1nsWaedq2oN24ouPDstm0nMGLYuHBr+XBsLyOasqSaOLCsL+QbdKskuTEs9WtktGniKd0UMyhg8ecfOLDsc2lh+nDtODBrciJYLKBXqt5Vc+njOHBrsCUccuihMecfeHBr9aymqt2UruMZteym9eynNGpjsOVctawmMqggruLZa98WMKUb+TEtMCTbr2Paqd0UdGqkNuvkap6Vdu3orOEXat5Vdi2nsSXdNKskr2Padeym7F/XKZzUrGAXcSXd7aFYLiJYryPat22oqp4U7uMZaV0Ub+QbdSxl8+ojeLCs6Z0UKdyT/G0i/K0icFxQPG0iu2yj8RtO/a2hO6zjtichfO1h+qwk/O1iN2jj9yhjO+zjMlsONqficFuPaZzUOStm9OTermKZMdsOfS1htWWfvW2hcyJbs6McdaZgeHArsVtOs5qNOXFteyxkumwldaxmt+mk9BpMtJqMvi3gcBwP8R2Q8JzQeO9rOCthsJuPNqdiMtrNtKReNeag713SditluWumtCPdtSVfMZwP9ZyO/e3g79vP8N1Quivl+aumNCOdMxrNdRuNtl3Ptt7Q+KJUePDsvm4gOCpluKrmclwPfC0i9WXgOSPV7yOaMZ5ROeTWua4o9qvmN6BSb9vPrp0R+mwk+S1nOS6qOydZe6hafKob+GGTsxqNeO1o8OXduGylN1+Rs2lifi1femWXui0l+SMVPStc8B5SeG4o9KKWuGyoNOrktF/TdWhieOviMl3R7t6TbJ1TfO2gtilj+qZYcuGatyyneykbfawd9eHU+CETNiphNusjNuSXuyvft2tmdegiLZ2S9Wedtqiebd7UsR9UM+Tatmmf82Pddu4o/ayefeyetOSZEeM0fsAAADwdFJOUwAz/dpuTAH+wfv/Ow4HChUy/f5fFATazP0dVFPA/pf9x/4kGdL+f/6H5Pr0+vzY/UL+u3JTpvz8Kt+3aekisP6th653kHRW8S767f2QR0zu+f7Z2OzKz5f2/UukzepC84FkvcNqmerlaKT909e5tjvQhvLh/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////ugGSNkAAAR7SURBVEjH7dd3WBN3GAdwem1zFiJhE/be8oggo2rdo26tu3vv3UIiIGEqCAZOAkJCaC1DNpSiBBCIgLSgsgpSZcks1lWt3cvf7+4SwiU5kufpn/3+eZfP877vbyRPdHT+j8Z5cs1ye7OHiZiZmZkvdzWYG1mZYxjb7RSZlpaW6y4YZq5HaxhOvhj7Gn96eprP5ycnJ1cWFhbmxidNsRFX2lIbIOLjprKyMDc3vqgoqaEhJe86tkYtMrXF3v5ToUp8UVJSQ0pKXnj4F7EDiJUape8rmUqWVSFJOCSxUVGRkWyvJ1QqE3vkGqhCEqIISSIzMjLqEHuGCuXkjPwkbywvT14Fktraurq6Lomxig6BklcBJIoktTg5AoPMU2b+kin5+FFDuiCfEWmHouBIQUFBu0CfqowF90BjxCz3EMG8mQgWAlHwJUiXgHpanHYvjCVnyegSOCu+XipohqaioqJZQDkrDGMviUR3qBbOMiDxn9ULY7duBUx6erNEaQtM9T5ylkiQ9qEuxJbyBmkGJP0bwLxU7YCOk7H/BgzzpbwzwNoAigBpN1d7vPRcLaiLhfXjKCKNbUtzB6gPbNkRaXgi2Eu1uLT2A4BwQfpd9DRXDM82LpE2F33Nmd5f/YCEgbR5aK4sPDyhiQbxfEZjZeDhlgZJdH19mJsV3Seff2QmWzYv4EJS/ymH07PAhI69fGImm3vCgOFwOMHB0Se20Pa1vYcbJhsHVAkGBITTsp22mMWpHnwUvDHc8A4dSuQdCPiAttjiYa6sr2AeDzeJicEHAhbTr92Lw9FEFRk5lnhsdHj/1jkOxeoAvAxPbkBC7+x3nGOnlt2RE1yEhpaWlk4GfmhKq0x6RxNlBghoRCJR6d1e+tm29t7+XJ7RSRFMjaimJnA1LVv3mEJ6AydrQPr6/r7xx+Na/D7uuN3X98+NK1cuXfplmRZXdN2Ou4D8cPHihZ+1qKaz3giSC99fvmy0RAvmbgRIU1NT43dG7lqwJUaQVFd33OxerwV7/ffqjo5b5789M9jtqLky6R4E5Mzp0yUrXmCo+9B8pSfbukcAKamqEq6wVkmY29bu2qX01A+FJDMzMxVdq1zFx30PiqKLUB/qiz3emdCkdp5FLSnvLK0h+ffHxkZ07+w29d9HxwD5qjMn5jeU+svgJ10ECFjkWzelbynO7bhXOtaZkxMTE3P0qLfSaI7SQUDOwxUbkVpbPiqL36adYpwcP35QLH1JabR3vclFLqkaS5BnZ4JdMU4OnjwZZ7eJqcTeTBiBRCgES5Z6FqSYCEniWsvGEyxVbNcbdlVCIbFicHyyMZxktWaFhOTbrVS1Zz42V1MBAePnKJLWsixgQrLzbZ5lqtzr12yKc2ZXaSVEdnZ5+bjNK6qVDvMpwxCSxM1UAaRcLP7VcOV8dd+NLOCIWcrKSCIGOXfuqqHhKob6o856x2GiDCd4YzgBaMLhuadprwhzn4PDxP2vYfKJjN/feHjjKtZcdyto3yeHZ+Xj915laXQrWUEPyRPEYvyn/y0eAJVLsHJTU5kOAAAAAElFTkSuQmCC'
      } return bg
    },
    titleTip (item) {
      if (item && item.data) {
        return item.data.OrgShortName + ': ' + item.data.doingCount + this.$t('dashboard.doing') + ' ' + item.data.delayCount + this.$t('dashboard.delay') + ' ' + item.data.suspendedCount + this.$t('dashboard.suspended') + ' ' + item.data.doneCount + this.$t('dashboard.Done')
      }
    },
    colNameclick (event, labelName) {
      let children = event.currentTarget.parentElement.children
      _.forEach(children, ele => {
        ele.innerText === labelName + ' arrow_upward' ? ele.style = 'font-weight:700;color:#1976D2;font-size:1em;' : ele.style = 'color: #858585;font-size:1em;'
      })
      if (labelName === '延期' || labelName === '挂起') {
        event.currentTarget.className = 'text-left sortable sorted'
        let tables = this.$refs.qTable
        if (tables && tables.length) {
          _.forEach(tables, r => {
            r.computedPagination.descending = false
          })
        }
      } else {
        event.currentTarget.className = 'text-left sortable sorted sort-desc'
      }
      let refs = this.$refs.thread
      _.forEach(refs, ref => {
        if (ref.$el.innerText !== '大区' && ref.$el.innerText !== '分公司' && ref.$el.innerText !== '机构') {
          if (ref.$el.innerText === labelName + ' arrow_upward') {
            ref.$el.click()
          }
        }
      })
    },
    customSort (rows, sortBy, descending) {
      const data = [...rows]
      sortBy === 'delayCount' || sortBy === 'suspendedCount' ? descending = false : descending = true
      if (sortBy) {
        data.sort((a, b) => {
          const x = descending ? b : a
          const y = descending ? a : b
          // numeric sort
          return parseFloat(x[sortBy]) - parseFloat(y[sortBy])
        })
      }
      return data
    },
    init () {
      let query = {}
      if (this.searchDate && this.searchDate.from && this.searchDate.to) {
        query = {
          queryStart: this.searchDate.from,
          queryEnd: date.formatDate(date.addToDate(this.searchDate.to, { days: 1 }), 'YYYY-MM-DD')
        }
      }
      this.$store.dispatch('project/loadProjectRankData', { query: query })
    },
    yearSelect (year) {
      let date = {}
      let StartDate = ''
      let EndDate = ''
      if (year) {
        if (year === 'latest') {
          StartDate = `${nowYear - 1}-${nowMonth}-${nowDay}`
          EndDate = `${nowYear}-${nowMonth}-${nowDay}`
        } else {
          StartDate = `${year}-01-01`
          EndDate = `${year}-12-31`
        }
      }
      date = {
        from: StartDate,
        to: EndDate
      }
      this.selectYear = year === 'latest' ? '近一年' : `${year}年`
      this.searchDate = date
    }
  },
  watch: {
    searchDate: {
      deep: true,
      handler (newVal, oldVal) {
        this.init()
      }
    }
  }
}
