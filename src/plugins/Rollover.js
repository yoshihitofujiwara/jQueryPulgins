/// INKjs Javascript Library
/// The MIT License (MIT)
/// Source https://github.com/yoshihitofujiwara/INKjs
/// Author Yoshihito Fujiwara
/// Copyright (c) 2012 Yoshihito Fujiwara

import Events from "../ink/class_events/Events";
import {preload} from "../ink/utils/utility";

/**
 * ロールオーバー
 * @class Rollover
 * @extends Events
 * @constructor
 */
export default class Rollover extends Events {
  /**
   * constructor
   */
  constructor(){
    super();

    /**
     * オプションのデフォルト値
     * @property options
     * @type {Object}
     */
    /**
     * グループクラス名
     * @property options.groupClass
     * @default group_rover
     * @type {String}
     */
    /**
     * アクティブクラス名
     * @property options.activeClass
     * @default active
     * @type {String}
     */
    /**
     * ノーロールオーバークラス名
     * @property options.noOverClass
     * @default no_rover
     * @type {String}
     */
    /**
     * ロールオーバー時に付与するファイル名
     * @property options.postfix
     * @default _on
     * @type {String}
     */
    /**
     * ロールオーバークラス名初期値
     * @property images
     * @type {String}
     */
    this.options = {
      groupClass : "group_rover",
      activeClass: "active",
      noOverClass: "no_rover",
      postfix    : "_on",
      images     : "img.rover, input.rover, .all_rover img"
    }
  }


  /**
   * ロールオーバーイベント追加
   * @method bind
   * @param {jQuery} $images 対象の画像要素
   * @param {Object} options オプション値
   * @return {Rollover}
   */
  bind($images, options){
    // $image指定がない場合、初期値を設定
    if(!$images || !($images instanceof jQuery)){
      options = $images;
      $images = $(this.options.images);
    }

    let params = $.extend(true, {}, this.options, options);

    $images.each((i) => {
      let data = this._createRolloverData($images.eq(i), params);

      // on画像の場合
      if(!data.isOffImg){
        data.image.src = data.offSrc;
      }

      // rollover
      data.$trigger
      .on("mouseenter." + this.id, () => {
        if(!data.$image.hasClass(params.noOverClass)){
          data.image.src = data.onSrc;
        }
      })
      .on("mouseleave." + this.id, () => {
        if(!data.$image.hasClass(params.noOverClass)){
          data.image.src = data.offSrc;
        }
      });
    });

    return this;
  }


  /**
   * ロールオーバーイベント削除
   * @method unbind
   * @param {jQuery} $images 対象の画像要素
   * @param {Object} options オプション値
   * @return {Rollover}
   */
  unbind($images, options){
    // $image指定がない場合、初期値を設定
    if(!$images || !($images instanceof jQuery)){
      options = $images;
      $images = $(this.options.images);
    }

    let props = $.extend(true, {}, this.options, options);

    $images.each((i) => {
      let $group = $images.eq(i).closest("." + props.groupClass),
      $trigger = $group[0] ? $group : $images.eq(i);
      $trigger.off("." + this.id);
    });

    return this;
  }


  /**
   * 画像のアクティブ化
   * @method active
   * @param {jQuery} $images 対象の画像要素
   * @param {Object} options オプション値
   * @return {Rollover}
   */
  active($images, options){
    // $image指定がない場合、初期値を設定
    if(!$images || !($images instanceof jQuery)){
      options = $images;
      $images = $(this.options.images);
    }

    let props = $.extend(true, {}, this.options, options);

    $images.addClass(props.activeClass).each((i) => {
      let data = this._createRolloverData($images.eq(i), props);

      // イベント削除
      data.$trigger
      .addClass(props.activeClass)
      .off("." + this.id);

      // off画像の場合
      if(data.isOffImg){
        data.image.src = data.onSrc;
      }
    });

    return this;
  }


  /**
   * 画像を待機状態にする
   * @method passive
   * @param {jQuery} $images 対象の画像要素
   * @param {Object} options オプション値
   * @return {Rollover}
   */
  passive($images, options){
    // $image指定がない場合、初期値を設定
    if(!$images || !($images instanceof jQuery)){
      options = $images;
      $images = $(this.options.images);
    }

    let props = $.extend(true, {}, this.options, options);

    $images.removeClass(props.activeClass).each((i) => {
      let data = this._createRolloverData($images.eq(i), props);

      // イベント削除
      data.$trigger
      .removeClass(props.activeClass)
      .off("." + this.id);

      // on画像の場合
      if(!data.isOffImg){
        data.image.src = data.offSrc;
      }
    });

    return this;
  }


  /**
   * ロールオーバーデータの生成
   * @method _createRolloverData
   * @private
   * @param {jQuery} $images 対象の画像要素
   * @param {Object} options オプション値
   * @return {Rollover}
   */
  _createRolloverData($image, options){
    let image = $image[0],
    src = image.src,
    ext = src.substring(src.lastIndexOf("."), src.length),
    $group = $image.closest("." + options.groupClass).addClass(options.activeClass),
    onSrc,
    offSrc;

    // 現在on画像の場合
    if(src.lastIndexOf(options.postfix + ext) > -1){
      onSrc = src;
      offSrc = src.replace(options.postfix + ext, ext);
      preload(offSrc);

    // 現在off画像の場合
    } else {
      offSrc = src;
      onSrc = src.replace(ext, options.postfix + ext);
      preload(onSrc);
    }

    // RolloverData
    return {
      $image  : $image,
      image   : image,
      $trigger: $group[0] ? $group : $image,
      onSrc   : onSrc,
      offSrc  : offSrc,
      isOffImg: src === offSrc
    };
  }
}


/**
 * rollover
 * @type {Rollover}
 */
export const rollover = new Rollover();
