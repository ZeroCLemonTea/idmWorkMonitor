<template>
    <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id" class="idm-software-status-list">
        <div class="idm-software-status-box" v-for="(item, index) in softwareList" :key="index">
            <div class="idm-software-left">
                <img :src="getCurrentItemInfo(item).image" alt="图片加载失败" class="idm-software-image" />
                <div class="idm-software-name">
                    {{ getCurrentItemInfo(item).text }}
                </div>
            </div>
            <div class="idm-software-right">
                <div
                    class="idm-software-right-box"
                    v-for="(items, indexs) in propData && propData.statusList"
                    :key="indexs"
                    :style="{ borderColor: items.color && items.color.hex8 }"
                >
                    <svg
                        v-if="items.icon && items.icon.length > 0"
                        :style="handleGetIconStyle(items)"
                        class="idm-software-status-icon"
                        aria-hidden="true"
                    >
                        <use :xlink:href="`#${items.icon[0]}`"></use>
                    </svg>
                    <svg-icon
                        v-else
                        :icon-class="items.defaultIcon"
                        :style="handleGetIconStyle(items)"
                        className="idm-software-status-icon"
                    ></svg-icon>
                    <div class="idm-software-right-box-right">
                        <div class="idm-software-number">
                            {{ handleStatusNumber(items, item) }}
                        </div>
                        <div class="idm-software-status">
                            {{ items.text }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mockSoftwareStaticsList } from '../mockData'

export default {
    name: 'ISoftwareList',
    data() {
        return {
            moduleObject: {},
            propData: this.$root.propData.compositeAttr || {
                fontContent: 'Hello Word'
            },
            messageParams: {},
            softwareList: []
        }
    },
    created() {
        this.moduleObject = this.$root.moduleObject
        this.convertAttrToStyleObject()
    },
    methods: {
        handleGetIconStyle(items) {
            return {
                fill: items?.color?.hex8,
                color: items?.color?.hex8,
                width: items.iconSize,
                height: items.iconSize,
                fontSize: items.iconSize
            }
        },
        handleStatusNumber(items, item) {
            return IDM.express.replace(`@[${items.numberField}]`, item, true)
        },
        getCurrentItemInfo(item) {
            let image = '',
                text
            const currentItem = this.propData?.softwareList?.find(
                (el) =>
                    IDM.express.replace(`@[${this.propData.statusField}]`, el, true) ==
                    IDM.express.replace(`@[${this.propData.statusField}]`, item, true)
            )
            if (!currentItem) {
                return { image: '', text: '' }
            }
            if (currentItem.image === 'defaultImage') {
                switch (currentItem.type) {
                    case 'database':
                        image = IDM.url.getModuleAssetsWebPath(require('../assets/shujuku.png'), this.moduleObject)
                        break
                    case 'cache':
                        image = IDM.url.getModuleAssetsWebPath(require('../assets/huancun.png'), this.moduleObject)
                        break
                    case 'webMiddleware':
                        image = IDM.url.getModuleAssetsWebPath(
                            require('../assets/zhongjianjian.png'),
                            this.moduleObject
                        )
                        break
                    case 'elasticsearch':
                        image = IDM.url.getModuleAssetsWebPath(
                            require('../assets/Elasticsearch.png'),
                            this.moduleObject
                        )
                        break
                    case 'messageMiddleware':
                        image = IDM.url.getModuleAssetsWebPath(require('../assets/xiaoxi.png'), this.moduleObject)
                        break
                    default:
                        image = IDM.url.getModuleAssetsWebPath(require('../assets/xiaoxi.png'), this.moduleObject)
                        break
                }
            }
            return {
                text: currentItem.softwareName,
                image: IDM.url.getWebPath(image)
            }
        },
        handleGetImageSrc(item) {},
        propDataWatchHandle(propData) {
            this.propData = propData.compositeAttr || {}
            this.convertAttrToStyleObject()
        },
        convertAttrToStyleObject() {
            var itemStyleObject = {},
                leftBoxObj = {},
                appNameObj = {},
                imageObj = {},
                iconObj = {},
                numberObj = {},
                statusObj = {},
                statusBoxObj = {}

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
                        case 'softwareFont':
                            IDM.style.setFontStyle(appNameObj, element)
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
                        case 'numberFont':
                            IDM.style.setFontStyle(numberObj, element)
                            break
                        case 'numberBox':
                            IDM.style.setBoxStyle(numberObj, element)
                            break
                        case 'statusFont':
                            IDM.style.setFontStyle(statusObj, element)
                            break
                        // case 'statusWidth':
                        //     statusBoxObj['width'] = element
                        //     break
                        case 'statusHeight':
                            statusBoxObj['height'] = element
                            break
                        case 'statusBorder':
                            IDM.style.setBorderStyle(statusBoxObj, element)
                            break
                        case 'statusBox':
                            IDM.style.setBoxStyle(statusBoxObj, element)
                            break
                        case 'iconBox':
                            IDM.style.setBoxStyle(iconObj, element)
                            break
                    }
                }
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .idm-software-status-box', itemStyleObject)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .idm-software-left', leftBoxObj)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .idm-software-name', appNameObj)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .idm-software-image', imageObj)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .idm-software-status-icon', iconObj)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .idm-software-number', numberObj)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .idm-software-status', statusObj)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .idm-software-right-box', statusBoxObj)
            this.initData()
        },
        reload() {
            //请求数据源
            this.initData()
        },
        initData() {
            if (this.moduleObject.env != 'production') {
                this.softwareList = mockSoftwareStaticsList
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
                            this.softwareList = res
                        },
                        (err) => {
                            this.softwareList = []
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
                    this.softwareList = object.message
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
.idm-software-status-box {
    display: flex;
    align-items: center;
    .idm-software-left,
    .idm-software-right {
        height: 100%;
    }
    .idm-software-left {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .idm-software-right {
        flex: 1;
        display: flex;
        align-items: center;
    }
    .idm-software-name {
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .idm-software-right {
        display: flex;
        align-items: center;
        flex: 1;
    }
    .idm-software-right-box {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;
    }
}
</style>
