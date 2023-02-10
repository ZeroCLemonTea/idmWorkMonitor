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
    class="i-cardContainer-outer"
    ref="module_ref"
  >
    <div key="i-cardContainer-header" class="i-cardContainer-header">
      <div class="i-cardContainer-header-main" :style="{'justify-content': propData.titDragPosition}">
        <div class="i-cardContainer-header-tit">
          <div class="i-cardContainer-header-tit-icon" v-if="propData.showIcon">
            <svg
              v-if="propData.titleIcon && propData.titleIcon.length > 0"
              class="idm_filed_svg_icon"
              aria-hidden="true"
            >
              <use :xlink:href="`#${propData.titleIcon && propData.titleIcon[0]}`" />
            </svg>
            <svg-icon v-else class="idm_filed_svg_icon" icon-class="application-icon" />
          </div>
          <span>{{ propData.title }}</span>
        </div>
        <div v-show="propData.showTitleDrag" class="i-cardContainer-header-drag">
          <div
            class="drag_container"
            idm-ctrl-inner
            :idm-ctrl-id="moduleObject.id"
            idm-container-index="2"
          />
        </div>
      </div>
      <div class="i-cardContainer-header-more" v-if="propData.showMore" @click="onMoreClick">
        <svg
          v-if="propData.moreIcon && propData.moreIcon.length > 0"
          class="idm_filed_svg_icon"
          aria-hidden="true"
        >
          <use :xlink:href="`#${propData.moreIcon && propData.moreIcon[0]}`" />
        </svg>
        <svg-icon v-else icon-class="gengduo" className="idm_filed_svg_icon"/>
      </div>
    </div>
    <div key="i-cardContainer-content" class="i-cardContainer-content">
      <div
        class="drag_container"
        idm-ctrl-inner
        :idm-ctrl-id="moduleObject.id"
        idm-container-index="1"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ICardContainer',
  data() {
    return {
      moduleObject: {},
      propData: this.$root.propData.compositeAttr || {
        title: '卡片标题',
        titDragPosition: "space-between",
        showTitleDrag: true
      }
    };
  },
  props: {},
  created() {
    this.moduleObject = this.$root.moduleObject;
    this.convertAttrToStyleObject();
    this.convertThemeListAttrToStyleObject();
  },
  methods: {
    onMoreClick(){
      if (this.moduleObject.env !== 'production') {
        return;
      }
      if (this.propData.moreJumpType === 'custom') {
        this.customFunctionHandle(this.propData.customMoreBtnFunction);
      } else if (this.propData.moreJumpType === 'tab' && this.propData.moreUrl) {
        const item = {
          isTabReload: "-1",
          name: this.propData.title,
          action: IDM.url.getWebPath(this.propData.moreUrl)
        };
        window.$$iframeCtrl && window.$$iframeCtrl.addTab(item);
      } else if (this.propData.moreUrl) {
        const url = IDM.url.getWebPath(this.propData.moreUrl);
        window.open(url, this.propData.moreJumpType || '_block');
      }
    },
    /**
     * 提供父级组件调用的刷新prop数据组件
     */
    propDataWatchHandle(propData) {
      this.propData = propData.compositeAttr || {};
      this.initData();
      this.convertAttrToStyleObject();
      this.convertThemeListAttrToStyleObject();
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
        _defaultVal = window.IDM.express.replace.call(this, '@[' + filedExp + ']', dataObject, false);
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
    /**
     * 把属性转换成样式对象
     */
    convertAttrToStyleObject() {
      const styleObject = {};
      const headerStyleObject = {};
      const titleStyleObject = {};
      const innerCardStyleObject = {};
      const iconStyleObject = {};
      const moreStyleObject = {};
      const headerTitStyleObject = {};
      const headerDragStyleObject ={};

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
      if (this.propData.innerBgSize && this.propData.innerBgSize == 'custom') {
        innerCardStyleObject['background-size'] =
          (this.propData.innerBgSizeWidth
            ? this.propData.innerBgSizeWidth.inputVal + this.propData.innerBgSizeWidth.selectVal
            : 'auto') +
          ' ' +
          (this.propData.innerBgSizeHeight
            ? this.propData.innerBgSizeHeight.inputVal + this.propData.innerBgSizeHeight.selectVal
            : 'auto');
      } else if (this.propData.innerBgSize) {
        innerCardStyleObject['background-size'] = this.propData.innerBgSize;
      }

      if (this.propData.positionX && this.propData.positionX.inputVal) {
        styleObject['background-position-x'] =
          this.propData.positionX.inputVal + this.propData.positionX.selectVal;
      }
      if (this.propData.innerPositionX && this.propData.innerPositionX.inputVal) {
        innerCardStyleObject['background-position-x'] =
          this.propData.innerPositionX.inputVal + this.propData.innerPositionX.selectVal;
      }

      if (this.propData.positionY && this.propData.positionY.inputVal) {
        styleObject['background-position-y'] =
          this.propData.positionY.inputVal + this.propData.positionY.selectVal;
      }
      if (this.propData.innerPositionY && this.propData.innerPositionY.inputVal) {
        innerCardStyleObject['background-position-y'] =
          this.propData.innerPositionY.inputVal + this.propData.innerPositionY.selectVal;
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
            case 'bgColor':
              styleObject['background-color'] = element && element.hex8 ? IDM.hex8ToRgbaString(element.hex8) : '';
              break;
            case 'innerBgColor':
              innerCardStyleObject['background-color'] = element && element.hex8 ? IDM.hex8ToRgbaString(element.hex8) : '';
              break;
            case 'boxShadow':
              styleObject['box-shadow'] = element;
              break;
            case 'box':
              IDM.style.setBoxStyle(styleObject, element);
              break;
            case 'innerBox':
              IDM.style.setBoxStyle(innerCardStyleObject, element);
              break;
            case 'bgImgUrl':
              styleObject['background-image'] = `url(${window.IDM.url.getWebPath(element)})`;
              break;
            case 'innerBgImgUrl':
              innerCardStyleObject['background-image'] = `url(${window.IDM.url.getWebPath(
                element
              )})`;
              break;
            case 'bgRepeat':
              //平铺模式
              styleObject['background-repeat'] = element;
              break;
            case 'innerBgRepeat':
              //平铺模式
              innerCardStyleObject['background-repeat'] = element;
              break;
            case 'bgAttachment':
              //背景模式
              styleObject['background-attachment'] = element;
              break;
            case 'innerBgAttachment':
              //背景模式
              innerCardStyleObject['background-attachment'] = element;
              break;
            case 'border':
              IDM.style.setBorderStyle(styleObject, element);
              break;
            case 'innerBorder':
              IDM.style.setBorderStyle(innerCardStyleObject, element);
              break;
            case 'titleFont':
              IDM.style.setFontStyle(titleStyleObject, element);
              break;
            case 'titleIconColor':
              iconStyleObject['color'] = element && element.hex8 ? IDM.hex8ToRgbaString(element.hex8) : '';
              break;
            case 'titleIconSize':
              iconStyleObject['font-size'] = element + 'px';
              break;
            case 'moreIconColor':
              moreStyleObject['color'] = element && element.hex8 ? IDM.hex8ToRgbaString(element.hex8) : '';
              break;
            case 'moreIconSize':
              moreStyleObject['font-size'] = element + 'px';
              break;
            case 'headerBox':
              IDM.style.setBoxStyle(headerStyleObject, element);
              break;
            case 'headerBorder':
              IDM.style.setBorderStyle(headerStyleObject, element);
              break;
            case 'headerTitBox':
              IDM.style.setBoxStyle(headerTitStyleObject, element);
              break;
            case 'headerTitBorder':
              IDM.style.setBorderStyle(headerTitStyleObject, element);
              break;
            case 'headerDragBox':
              IDM.style.setBoxStyle(headerDragStyleObject, element);
              break;
          }
        }
      }
      window.IDM.setStyleToPageHead(this.moduleObject.id, styleObject);
      window.IDM.setStyleToPageHead(
        this.moduleObject.id + ' .i-cardContainer-content',
        innerCardStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.id + ' .i-cardContainer-header',
        headerStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.packageid + ' #' + this.moduleObject.id + ' .i-cardContainer-header-tit',
        headerTitStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.id + ' .i-cardContainer-header-drag',
        headerDragStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.packageid + ' #' + this.moduleObject.id + ' .i-cardContainer-header-tit span',
        titleStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.packageid +
          ' #' +
          this.moduleObject.id +
          ' .i-cardContainer-header-tit .i-cardContainer-header-tit-icon',
        iconStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.id +
          ' .i-cardContainer-header .i-cardContainer-header-more',
        moreStyleObject
      );
    },
    /**
     * 主题颜色
     */
    convertThemeListAttrToStyleObject() {
      const themeList = this.propData.themeList;
      if (!themeList) {
        return;
      }
      const themeNamePrefix =
        IDM.setting && IDM.setting.applications && IDM.setting.applications.themeNamePrefix
          ? IDM.setting.applications.themeNamePrefix
          : 'idm-theme-';
      for (var i = 0; i < themeList.length; i++) {
        const item = themeList[i];

        IDM.setStyleToPageHead(
          '.' +
            themeNamePrefix +
            item.key +
            ' .i-cardContainer-outer .i-cardContainer-header-tit .i-cardContainer-header-tit-icon',
          {color: item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : ''}
        );
        IDM.setStyleToPageHead(
          '.' +
            themeNamePrefix +
            item.key +
            ' .i-cardContainer-outer .i-cardContainer-header-tit',
          {'border-color': item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : ''}
        );
        IDM.setStyleToPageHead(
          '.' +
            themeNamePrefix +
            item.key +
            ' .i-cardContainer-outer .i-cardContainer-header-tit span',
          {color: item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : ''}
        );
      }
    }
  }
};
</script>

<style lang="scss">
.i-cardContainer-outer {
  width: auto;
  height: auto;
  overflow: hidden;
  box-sizing: border-box;
  padding: 5px 20px;
  margin: 5px;
  position: relative;
  background: #FFFFFF;
  border: 1px solid rgba(230,230,230,1);
  box-shadow: 0px 2px 12px 0px rgba(0,0,0,0.07);
  // display: flex;
  // flex-direction: column;
  // align-items: stretch;

  .i-cardContainer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #DDDDDD;
    

    .i-cardContainer-header-main {
      // width: 86%;
      flex-grow: 1;
      display: flex;
      align-items: center;

      .i-cardContainer-header-tit {
       
        max-width: 60%;
        display: flex;
        // align-items: center;
        border-bottom: 2px solid #0067D0;
        margin-bottom: -1px;

        .i-cardContainer-header-tit-icon {
          margin-right: 5px;
          display: inline-block;
          flex: 1;
        }

        span {
          font-size: 18px;
          color: #0067D0;
          font-weight: 600;
          line-height: 48px;
          width: 90%;
          flex: 8;
        }

        .idm_filed_svg_icon {
          font-size: 1em;
          width: 1em;
          height: 1em;
          fill: currentColor;
          vertical-align: -0.15em;
          outline: none;
        }
      }
    }

    .i-cardContainer-header-more {
      margin: 0 10px;
      cursor: pointer;
      &:hover {
        opacity: 0.7;
      }
      .idm_filed_svg_icon {
        font-size: 1em;
        width: 1em;
        height: 1em;
        fill: currentColor;
        /* vertical-align: -0.15em; */
        outline: none;
      }
    }
  }
}
</style>
