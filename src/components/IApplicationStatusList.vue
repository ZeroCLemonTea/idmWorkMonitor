<template>
    <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id" class="idm-application-status-list">
        <div class="idm-application-status-box" v-for="(item, index) in applicationStatusList" :key="index">
            <div class="idm-application-left">
                <div class="idm-application-name">{{ handleGetCurrentApplication(item).text }}</div>
                <div class="idm-application-number">
                    {{ IDM.express.replace(`@[${propData.applicationNumberField}]`, item, true) }}
                </div>
            </div>
            <div class="idm-application-right">
                <template v-for="(items, indexs) in item.children">
                    <a-tooltip v-if="textFilter(items, item)" :key="indexs">
                        <template slot="title">
                            <div v-html="textFilter(items, item)"></div>
                        </template>
                        <div class="idm-application-right-image" :style="handleGetStyle(items)"></div>
                    </a-tooltip>
                    <div v-else class="idm-application-right-image" :style="handleGetStyle(items)" :key="indexs"></div>
                </template>
            </div>
        </div>
    </div>
</template>
<script>
import { mockApplicationStatusList } from '../mockData'
export default {
    name: 'IApplicationStatusList',
    data() {
        return {
            moduleObject: {},
            propData: this.$root.propData.compositeAttr || {
                fontContent: 'Hello Word'
            },
            applicationStatusList: [],
            messageParams: {}
        }
    },
    created() {
        this.moduleObject = this.$root.moduleObject
        this.convertAttrToStyleObject()
    },
    methods: {
        textFilter(items, item) {
            const type = IDM.express.replace(`@[${this.propData.applicationTypeField}]`, item, true)
            let text = ''
            switch (type) {
                // 硬件
                case 'server':
                    text = this.propData.hardTipTemplate
                    break
                // 软件
                default:
                    text = this.propData.softTipTemplate
                    break
            }
            if (!text) return ''
            console.log(text, items)
            text = text.replace(/\r/gi, '').replace(/\n/gi, '<br/>')
            text = text.replace(/@\[.*\]/gi, (str) => {
                if (str.length < 4) return str
                return IDM.express.replace(str, items, true)
            })
            return text
        },
        handleGetCurrentApplication(item) {
            let obj = {}
            const currentItem = this.propData?.applicationList?.find(
                (el) => el.type === IDM.express.replace(`@[${this.propData.applicationTypeField}]`, item, true)
            )
            if (currentItem) {
                obj.text = currentItem.softwareName
            }
            return obj
        },
        handleGetStyle(items) {
            let styleObj = {}
            const currentItem = this?.propData.statusList?.find(
                (el) => el.type == IDM.express.replace(`@[${this.propData.applicationTypeField}]`, items, true)
            )
            if (currentItem) {
                styleObj.backgroundImage = currentItem.backgroundColor
            }
            return styleObj
        },
        propDataWatchHandle(propData) {
            this.propData = propData.compositeAttr || {}
            this.convertAttrToStyleObject()
        },
        convertAttrToStyleObject() {
            var itemStyleObject = {},
                leftBoxObj = {},
                appNameObj = {},
                appNumberObj = {},
                imageObj = {}

            for (const key in this.propData) {
                if (this.propData.hasOwnProperty.call(this.propData, key)) {
                    const element = this.propData[key]
                    if (!element && element !== false && element != 0) {
                        continue
                    }
                    switch (key) {
                        case 'width':
                        case 'height':
                            itemStyleObject[key] = element
                            break
                        case 'box':
                            IDM.style.setBoxStyle(itemStyleObject, element)
                            break
                        case 'border':
                            IDM.style.setBorderStyle(itemStyleObject, element)
                            break
                        case 'bgColor':
                            if (element.hex8) {
                                itemStyleObject['background-color'] = element.hex8
                            }
                            break
                        case 'leftWidth':
                            leftBoxObj['width'] = element
                            break
                        case 'leftBorder':
                            IDM.style.setBorderStyle(leftBoxObj, element)
                            break
                        case 'applicationFont':
                            IDM.style.setFontStyle(appNameObj, element)
                            break
                        case 'numberFont':
                            IDM.style.setFontStyle(appNumberObj, element)
                            break
                        case 'imageWidth':
                            imageObj['width'] = element
                            break
                        case 'imageHeight':
                            imageObj['height'] = element
                            break
                        case 'imageBorder':
                            IDM.style.setBorderStyle(imageObj, element)
                            break
                        case 'imageBox':
                            IDM.style.setBoxStyle(imageObj, element)
                            break
                    }
                }
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .idm-application-status-box', itemStyleObject)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .idm-application-left', leftBoxObj)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .idm-application-name', appNameObj)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .idm-application-number', appNumberObj)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .idm-application-right-image', imageObj)
            this.initData()
        },
        reload() {
            //请求数据源
            this.initData()
        },
        initData() {
            if (this.moduleObject.env != 'production') {
                this.applicationStatusList = mockApplicationStatusList
                return
            }
            //所有地址的url参数转换
            var params = this.commonParam()
            switch (this.propData.dataType) {
                case 'pageCommonInterface':
                    //使用通用接口直接跳过，在setContextValue执行
                    break
                case 'dataSource':
                    IDM.datasource.request(
                        this.propData?.dataSource?.[0]?.id,
                        {
                            moduleObject: this.moduleObject,
                            param: {...params, ...this.messageParams}
                        },
                        (res) => {
                            this.applicationStatusList = res
                        },
                        (err) => {
                            this.applicationStatusList = []
                        }
                    )
                    break
            }
        },
        getExpressData(dataName, dataFiled, resultData) {
            //给defaultValue设置dataFiled的值
            var _defaultVal = undefined
            if (dataFiled) {
                var filedExp = dataFiled
                filedExp = dataName + (filedExp.startsWiths('[') ? '' : '.') + filedExp
                var dataObject = { IDM: window.IDM }
                dataObject[dataName] = resultData
                _defaultVal = window.IDM.express.replace.call(this, '@[' + filedExp + ']', dataObject)
            }
            //对结果进行再次函数自定义
            if (this.propData.customFunction && this.propData.customFunction.length > 0) {
                var params = this.commonParam()
                var resValue = ''
                try {
                    resValue =
                        window[this.propData.customFunction[0].name] &&
                        window[this.propData.customFunction[0].name].call(this, {
                            ...params,
                            ...this.propData.customFunction[0].param,
                            moduleObject: this.moduleObject,
                            expressData: _defaultVal,
                            interfaceData: resultData
                        })
                } catch (error) {}
                _defaultVal = resValue
            }

            return _defaultVal
        },
        receiveBroadcastMessage(object) {
            console.log('组件收到消息', object)
            switch (object.type) {
                case 'linkageResult':
                    this.applicationStatusList = object.message
                    break
                case 'linkageReload':
                case 'linkageDemand':
                    this.messageParams = object.message
                    this.initData()
                    break
            }
        },
        setContextValue(object) {
            console.log('统一接口设置的值', object)
            if (object.type != 'pageCommonInterface') {
                return
            }
            //这里使用的是子表，所以要循环匹配所有子表的属性然后再去设置修改默认值
            if (object.key == this.propData.dataName) {
                this.softwareList = this.getExpressData(this.propData.dataName, this.propData.dataFiled, object.data)
            }
        },
        sendBroadcastMessage(object) {
            window.IDM.broadcast && window.IDM.broadcast.send(object)
        },
        /**
         * 通用的url参数对象
         * 所有地址的url参数转换
         */
        commonParam() {
            let urlObject = IDM.url.queryObject()
            var params = {
                pageId:
                    window.IDM.broadcast && window.IDM.broadcast.pageModule ? window.IDM.broadcast.pageModule.id : '',
                urlData: JSON.stringify(urlObject),
                ...urlObject
            }
            return params
        }
    }
}
</script>

<style lang="scss" scoped>
.idm-application-status-box {
    display: flex;
    align-items: center;
    .idm-application-left,
    .idm-application-right {
        height: 100%;
    }
    .idm-application-left {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .idm-application-right {
        flex: 1;
        display: flex;
        align-items: center;
        overflow: auto;
    }
}
</style>
