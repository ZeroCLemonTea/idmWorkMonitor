<template>
  <!--
    根目录规范(必须不能为空)：
    idm-ctrl：控件类型 drag_container：容器，drag_container_inlieblock：行内容器，idm_module：非容器的组件
    id：使用moduleObject.id，如果id不使用这个将会被idm-ctrl-id属性替换
    idm-ctrl-id：组件的id，这个必须不能为空
  -->
  <div
    idm-ctrl="idm_module"
    :id="moduleObject.id"
    :idm-ctrl-id="moduleObject.id"
    class="i-blockStatistics-outer"
    ref="module_ref"
  >
    <div class="i-blockStatistics-content">
      <template v-for="item,index in data">
        <div
          :key="index"
          :style="{width: 100/propData.columnNum + '%'}"
          class="i-blockStatistics-content-cell"
        >
          <div class="block" :style="{background: item.customSet && item.customSet.bgColor ? item.customSet.bgColor : propData.blockBg}" @click.stop="onBlockClick(item, index)">
            <div 
              v-if="propData.picType != 'none'" 
              class="img"
              :style="{
                background : item.customSet && item.customSet.imgBgColor ? item.customSet.imgBgColor : propData.blockImgBg,
                color: item.customSet && item.customSet.iconColor ? item.customSet.iconColor : propData.blockIconColor,
                'border-color': item.customSet && item.customSet.bdColor,
                top: propData.picTop,
                bottom: propData.picBottom,
                left: propData.picLeft,
                right: propData.picRight
              }"
            >
              <img
                v-if="propData.picType == 'image'"
                width="100%"
                height="100%"
                :src="IDM.url.getWebPath(item.customSet && item.customSet.image ? item.customSet.image : propData.defaultImgUrl)"
              />
              <svg
                v-if="propData.picType == 'icon'"
                class="idm_filed_svg_icon"
                aria-hidden="true"
              >
                <use :xlink:href="`#${item.customSet && item.customSet.icon && item.customSet.icon[0] ? item.customSet.icon[0] : propData.defaultIcon && propData.defaultIcon[0]}`" />
              </svg>
            </div>
            <div 
              class="name"
              :style="{
                top: propData.nameTop,
                bottom: propData.nameBottom,
                left: propData.nameLeft,
                right: propData.nameRight
              }"
            >
              {{item.customSet && item.customSet.name ? item.customSet.name : propData.nameFiled && getExpressData('item', propData.nameFiled, item)}}
            </div>
            <div
              class="count"
              :style="{
                top: propData.numTop,
                bottom: propData.numBottom,
                left: propData.numLeft,
                right: propData.numRight
              }"
            >
              {{propData.countFiled && getExpressData('item', propData.countFiled, item)}}
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
const devResult = () => ([
  {
    name: '知识创建数',
    count: 10,
    type: '1'
  },{
    name: '知识创建数',
    count: 10
  },{
    name: '知识创建数',
    count: 10
  }
]);
export default {
  name: 'IBlockStatistics',
  data() {
    return {
      moduleObject: {},
      propData: this.$root.propData.compositeAttr || {
        nameFiled: 'name',
        countFiled: 'count',
        customFiled: 'type',
        columnNum: 3,
        picType: 'icon',
        customSet: [
          {
            match: '1',
            picType: 'image',
            image: '1',
            bgColor: 'linear-gradient(180deg, #FCDB00 0%, #F7B500 100%)'
          },{
            match: '2',
            image: '',
            bgColor: ''
          },{
            match: '3',
            image: '',
            bgColor: ''
          }
        ],
      },
      data: {},
      addParam: {}
    };
  },
  props: {},
  watch: {
    'propData.dataSource': {
      handler(newValue, oldValue) {
        if (this.moduleObject.env !== 'production' && ((newValue && newValue[0]?.id) != (oldValue && oldValue[0]?.id))) {
          this.initData();
        }
      },
      deep: true,
      immediate: false
    }
  },
  created() {
    this.moduleObject = this.$root.moduleObject;
    this.convertAttrToStyleObject();
    this.initData();
  },
  methods: {
    onBlockClick(item, index){
      if (this.moduleObject.env !== 'production') {
        return;
      }
      this.customFunctionHandle(this.propData.handleBlockClick, {
        item: item,
        index: index,
        data: this.data
      })
    },
    /**
     * 提供父级组件调用的刷新prop数据组件
     */
    propDataWatchHandle(propData) {
      this.propData = propData.compositeAttr || {};
      this.convertAttrToStyleObject();
    },
    /**
     * 组件通信：接收消息的方法
     */
    receiveBroadcastMessage(messageObject) {
      switch (messageObject.type) {
        case 'linkageReload':
          if (this.propData.dataType === 'dataSource') {
            this.addParam = messageObject.message || {};
            this.initData();
          }
          break;
        case 'linkageDemand':
          if (this.propData.dataType === 'dataSource') {
            const param = this.customFunctionHandle(this.propData.customLinkageDemandFunction, { messageObject, originParam: this.addParam }) || messageObject.message;
            this.addParam = param || {};
            delete this.addParam._break;
            !param._break && this.initData();
          }
          break;
      }
    },
    /**
     * 交互功能：设置组件的上下文内容值
     * @param {
     *  type:"定义的类型，已知类型：pageCommonInterface（页面统一接口返回值）、"
     *  key:"数据key标识，页面每个接口设置的数据集名称，方便识别获取自己需要的数据"
     *  data:"数据集，内容为：字符串 or 数组 or 对象"
     * }
     */
    setContextValue(object) {
      if (object.type == 'pageCommonInterface' && object.key == this.propData.dataName && this.propData.dataType === 'pageCommonInterface') {
        let data = this.propData.contextDataFiled ? this.getExpressData(this.propData.dataName, this.propData.contextDataFiled, object.data) : object.data;
        if (data !== undefined) {
          data = this.customFormat(this.propData.contextCustomFunction, data);
          this.data = data;
        }
      }
    },
    /**
     * 通用的获取表达式匹配后的结果
     */
    getExpressData(dataName, dataFiled, resultData) {
      //给defaultValue设置dataFiled的值
      let _defaultVal = undefined;
      if (dataFiled) {
        let filedExp = dataFiled;
        filedExp = dataName + (filedExp.startsWiths('[') ? '' : '.') + filedExp;
        let dataObject = { IDM: window.IDM };
        dataObject[dataName] = resultData;
        _defaultVal = window.IDM.express.replace.call(this, '@[' + filedExp + ']', dataObject, true);
      }
      return _defaultVal;
    },
    customFormat(customFunction, data) {
      if (customFunction && customFunction[0] && customFunction[0].name) {
        data =
          window[customFunction[0].name] &&
          window[customFunction[0].name].call(this, {
            commonParam: this.commonParam(),
            customParam: customFunction[0].param,
            data
          });
      }
      return data;
    },
    customFunctionHandle(customFunction, param = {}) {
      if (customFunction && customFunction[0] && customFunction[0].name) {
        return window[customFunction[0].name] &&
          window[customFunction[0].name].call(this, {
            commonParam: this.commonParam(),
            customParam: customFunction[0].param,
            ...param
          });
      }
    },
    commonParam() {
      return {
        moduleObject: this.moduleObject,
        pageId:
          window.IDM.broadcast && window.IDM.broadcast.pageModule
            ? window.IDM.broadcast.pageModule.id
            : '',
        urlObject: IDM.url.queryObject()
      };
    },
    getAllParams() {
      const params = {
        ...this.addParam,
      }
      return this.customFormat(this.propData.paramsCustomFunction, params) || params;
    },
    /**
     * 请求数据
     */
    initData() {
      if (this.propData.dataType !== 'dataSource' || !this.propData.dataSource || !this.propData.dataSource[0]?.id) {
        if (this.moduleObject.env !== 'production') {
          this.data = devResult()?.map(item => ({
            ...item,
            customSet: this.propData.customFiled && this.getCustomSet(item)
          }))
          console.log(this.data)
        }
        return;
      }
      IDM.datasource.request(this.propData.dataSource[0]?.id, {
        moduleObject: this.moduleObject,
        param: this.getAllParams()
      }, (data) => {
        this.data = data?.map(item => ({
          ...item,
          customSet: this.propData.customFiled && this.getCustomSet(item)
        }))
      })
    },
    getCustomSet(item){
      const val = this.getExpressData('item', this.propData.customFiled, item)
      return this.propData.customSet?.find(item => item.match == val);
    },
    /**
     * 把属性转换成样式对象
     */
    convertAttrToStyleObject() {
      const styleObject = {};
      const blockStyleObject = {};
      const blockNameStyleObject = {};
      const blockNumStyleObject = {};
      const blockImgStyleObject = {};

      if (this.propData.bgSize && this.propData.bgSize == 'custom') {
        styleObject['background-size'] =
          (this.propData.bgSizeWidth
            ? this.propData.bgSizeWidth.inputVal + this.propData.bgSizeWidth.selectVal
            : 'auto') +
          ' ' +
          (this.propData.bgSizeHeight
            ? this.propData.bgSizeHeight.inputVal + this.propData.bgSizeHeight.selectVal
            : 'auto');
      } else if (this.propData.bgSize) {
        styleObject['background-size'] = this.propData.bgSize;
      }
      if (this.propData.positionX && this.propData.positionX.inputVal) {
        styleObject['background-position-x'] =
          this.propData.positionX.inputVal + this.propData.positionX.selectVal;
      }
      if (this.propData.positionY && this.propData.positionY.inputVal) {
        styleObject['background-position-y'] =
          this.propData.positionY.inputVal + this.propData.positionY.selectVal;
      }
      for (const key in this.propData) {
        if (this.propData.hasOwnProperty.call(this.propData, key)) {
          const element = this.propData[key];
          if (!element && element !== false && element != 0) {
            continue;
          }
          switch (key) {
            case 'width':
            case 'height':
              styleObject[key] = element;
              break;
            case 'boxShadow':
              styleObject['box-shadow'] = element;
              break;
            case 'blockBoxShadow':
              blockStyleObject['box-shadow'] = element;
              break;
            case 'blockImgShadow':
              blockImgStyleObject['box-shadow'] = element;
              break;
            case 'blockTextShadow':
              blockNameStyleObject['text-shadow'] = element;
              blockNumStyleObject['text-shadow'] = element;
              break;
            case 'box':
              IDM.style.setBoxStyle(styleObject, element);
              break;
            case 'blockBox':
              IDM.style.setBoxStyle(blockStyleObject, element);
              break;
            case 'blockImgBox':
              IDM.style.setBoxStyle(blockImgStyleObject, element);
              break;
            case 'border':
              IDM.style.setBorderStyle(styleObject, element);
              break;
            case 'blockBorder':
              IDM.style.setBorderStyle(blockStyleObject, element);
              break;
            case 'blockImgBorder':
              IDM.style.setBorderStyle(blockImgStyleObject, element);
              break;
            case 'blockImgSize':
              blockImgStyleObject['width'] = element;
              blockImgStyleObject['height'] = element;
              blockImgStyleObject['font-size'] = element;
              break;
            case 'blockNameFont':
              IDM.style.setFontStyle(blockNameStyleObject, element);
              break;
            case 'blockNumFont':
              IDM.style.setFontStyle(blockNumStyleObject, element);
              break;
            case 'bgColor':
              styleObject['background-color'] = element && element.hex8 ? IDM.hex8ToRgbaString(element.hex8) : '';
              break;
            case 'bgImgUrl':
              styleObject['background-image'] = `url(${window.IDM.url.getWebPath(element)})`;
              break;
            case 'bgRepeat':
              //平铺模式
              styleObject['background-repeat'] = element;
              break;
            case 'bgAttachment':
              //背景模式
              styleObject['background-attachment'] = element;
              break;
          }
        }
      }
      window.IDM.setStyleToPageHead(this.moduleObject.id, styleObject);
      window.IDM.setStyleToPageHead(
        this.moduleObject.id + ` .i-blockStatistics-content .i-blockStatistics-content-cell .block`,
        blockStyleObject
      );
      window.IDM.setStyleToPageHead(
         this.moduleObject.id + ` .i-blockStatistics-content .i-blockStatistics-content-cell .block .name`,
        blockNameStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.id + ` .i-blockStatistics-content .i-blockStatistics-content-cell .block .count`,
        blockNumStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.id + ` .i-blockStatistics-content .i-blockStatistics-content-cell .block .img`,
        blockImgStyleObject
      );
    }
  }
};
</script>

<style lang="scss">
.i-blockStatistics-outer {
  width: auto;
  box-sizing: border-box;
  padding: 0 10px;
  position: relative;
  height: 20vh;
  overflow: hidden;

  .i-blockStatistics-content {
    height: 100%;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
    align-content: stretch;

    .i-blockStatistics-content-cell {
      // flex-grow: 1;
      // flex-shrink: 1;
      box-sizing: border-box;
      display: flex;
      // justify-content: center;
      .block {
        flex-grow: 1;
        position: relative;
        box-sizing: border-box;
        margin: 10px;
        padding: 15px;
        background: #F3F6FD;
        border-radius: 8px;
        border: 1px solid rgba(199,219,253,1);
        overflow: hidden;
        .img {
          box-sizing: content-box;
          width: 38px;
          height: 38px;
          line-height: 1;
          font-size: 38px;
          position: absolute;
          margin: auto;
          right: 0;
          left: 0;
          top: 15px;
          border-radius: 50%;
          box-shadow: 0 2px 4px 0 rgba(175,175,175,0.50);
          padding: 20px;
          background-color: #FFFFFF;
          .idm_filed_svg_icon {
            font-size: 1em;
            width: 1em;
            height: 1em;
            line-height: 1;
            fill: currentColor;
            vertical-align: -0.15em;
            outline: none;
          }
        }
        .name {
          width: fit-content;
          position: absolute;
          margin: auto;
          right: 0;
          left: 0;
          bottom: 20px;
          font-size: 18px;
          color: #FFFFFF;
          font-weight: 500;
          text-shadow: 0 0 4px rgba(103,103,103,0.50);
        }
        .count {
          width: fit-content;
          position: absolute;
          margin: auto;
          right: 0;
          left: 0;
          bottom: 50px;
          font-size: 40px;
          color: #FFFFFF;
          font-weight: 600;
          text-shadow: 0 0 4px rgba(103,103,103,0.50);
        }
      }
    }
  }
}
</style>
