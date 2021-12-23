import { i18n } from '@/boot/i18n'
import MaterialCode from './model'
import request from '@/boot/axios'
import { showWarningMessage } from '@/utils/show-message'

const url = {
  queryMaterialCode: 'materialcodes/querymaterialcode'
}

export default {
  // 查询物料编码库
  queryMaterialCode ({ state, commit }, code) {
    // TODO 查询物料编码库接口
    return request.get(url.queryMaterialCode, { code: code })
      .then(res => {
        let result = null
        if (res.data.length) {
          result = MaterialCode.from(res.data[0])
        }
        return result
      }).catch((error) => {
        showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return null
      })
  }
}
