'use strict';

var underscore = require('underscore');
var Uuid = require('../../utils/Uuid');
var WeeklyModel = require('../../models/weekly-manage/WeeklyModel');

/**
 * @module WeeklyDao
 * */
function WeeklyDao(Model) {
  this.model = Model;
}

var weeklyDao = new WeeklyDao(WeeklyModel);

module.exports = weeklyDao;


/**
 * 分页显示
 * @method
 * @param dataPage {DataPage} 分页数据
 * @param callback {function} 回调函数
 */
WeeklyDao.prototype.pagination = function (dataPage, callback) {
  var skip = dataPage.itemsPerPage * (dataPage.currentPage - 1);
  var limit = dataPage.itemsPerPage;
  var model = this.model;

  return callback(null, dataPage);
};

/**
 * 保存数据，包括添加和修改
 * @method
 * @param data {weeklyModel} WeeklyModel 实例
 * @param callback {function}回调函数
 */

WeeklyDao.prototype.save = function (data, callback) {
  var id = data.id;
};

/**
 * 根据id查询数据
 * @method
 * @param id {String} 主键
 * @param callback {function} 回调函数
 */
WeeklyDao.prototype.findById = function (id, callback) {

};

/**
 * 根据给定的条件查询记录
 * @param conditions {Object} 条件
 * @param callback {function} 回调函数
 */
WeeklyDao.prototype.find = function (conditions, callback) {

};

/**
 * 删除记录
 * @method
 * @param ids { Array }
 * @param callback {function} 回调函数
 */
WeeklyDao.prototype.delete = function (ids, callback) {
};
