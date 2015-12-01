'use strict';

var Promise = require('promise');
var fs = require('fs');
var moment = require('moment');
var _ = require('underscore');
var xlsx = require('xlsx-node');
var cheerio = require('cheerio'); //引用cheerio模块,使在服务器端像在客户端上操作DOM,不用正则表达式

var Uuid = require('../../utils/Uuid');

var readFile = Promise.denodeify(fs.readFile);
var writeFile = Promise.denodeify(fs.writeFile);

/**
 * @module WeeklyDao
 * */
function WeeklyDao() {
}

var weeklyDao = new WeeklyDao();

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
  readFile('./server/data/weekly-records.json', 'utf-8')
    .then(function (data) {
      var records = JSON.parse(data || '{"records":[]}').records;
      var subRecords = [];
      if (records.length > 0) {
        subRecords = records.slice(skip, (skip + 1) * limit);
      }
      dataPage.setTotalItems(records.length);
      dataPage.setItems(subRecords);
      return callback(null, dataPage);
    })
    .then(null, function (err) {
      return callback(err);
    });
};

/**
 * 加载模板
 * @param callback
 * @returns {*}
 */
WeeklyDao.prototype.loadTmpl = function (callback) {
  var tmpl = {};
  readFile('./server/template/weeklyContent', 'utf-8')
    .then(function (data) {
      tmpl.weeklyContent = data;
      return readFile('./server/template/weeklyFooter', 'utf-8');
    })
    .then(function (data) {
      tmpl.weeklyFooter = data;
      return callback(null, tmpl);
    })
    .then(null, function (err) {
      return callback(err);
    });
};
/**
 * 保存数据，包括添加和修改
 * @method
 * @param data {weeklyModel} WeeklyModel 实例
 * @param callback {function}回调函数
 */

WeeklyDao.prototype.save = function (entity, callback) {
  var id = entity.id;

  readFile('./server/data/weekly-records.json', 'utf-8')
    .then(function (data) {
      var items = JSON.parse(data || '{"records":[]}');
      var records = items.records;

      if (id == null) {//添加
        var uuid = Uuid.raw();
        id = entity.id = uuid;
        var m = moment();
        records.unshift({
          id: entity.id,
          weeklyTitle: entity.weeklyTitle,
          startDate: entity.startDate,
          endDate: entity.endDate,
          week: m.year() + '年第' + m.week() + '周',
          createdDate: m.format('YYYY年MM月DD日')
        });
      } else {
        var item;
        for (var i = 0, len = records.length; i < len; i++) {
          if (records[i].id === id) {
            item = records[i];
            break;
          }
        }
        _.extend(item, entity);
      }

      return writeFile('./server/data/weekly-records.json', JSON.stringify(items), 'utf-8');
    })
    .then(function () {
      return writeFile('./server/data/weekly/' + id, JSON.stringify(entity, null, ' '), 'utf-8');
    })
    .then(function () {
      return callback(null);
    })
    .then(null, function (err) {
      return callback(err);
    });
};

/**
 * 根据id查询数据
 * @method
 * @param id {String} 主键
 * @param callback {function} 回调函数
 */
WeeklyDao.prototype.findById = function (id, callback) {
  readFile('./server/data/weekly/' + id, 'utf-8')
    .then(function (data) {
      var model = JSON.parse(data);
      return callback(null, model);
    })
    .then(null, function (err) {
      return callback(err);
    });
};

/**
 * 删除记录
 * @method
 * @param ids { Array }
 * @param callback {function} 回调函数
 */
WeeklyDao.prototype.delete = function (ids, callback) {
  var _ids = _.extend(ids);
  readFile('./server/data/weekly-records.json', 'utf-8')
    .then(function (data) {
      //异步循环删除文件
      _ids.forEach(function (item) {
        /*eslint-disable no-sync*/
        fs.unlinkSync('./server/data/weekly/' + item);
      });
      var items = JSON.parse(data || '{"records":[]}');
      var records = items.records;
      for (var i = records.length - 1; i >= 0; i--) {
        if (ids.length === 0) {
          break;
        }
        var id = records[i].id;
        var index = ids.indexOf(id);
        if (ids.indexOf(id) !== -1) {
          records.splice(i, 1);
          ids.splice(index, 1);
        }
      }
      return writeFile('./server/data/weekly-records.json', JSON.stringify(items), 'utf-8');
    })
    .then(function () {
      return callback(null);
    })
    .then(null, function (err) {
      return callback(err);
    });
};

/**
 * 保存模板
 * @param entity
 * @param callback
 */
WeeklyDao.prototype.saveTmpl = function (entity, callback) {
  var weeklyContent = entity.weeklyContent;
  var weeklyFooter = entity.weeklyFooter;

  writeFile('./server/template/weeklyContent', weeklyContent, 'utf-8')
    .then(function () {
      return writeFile('./server/template/weeklyFooter', weeklyFooter, 'utf-8');
    })
    .then(function () {
      return callback(null);
    })
    .then(null, function (err) {
      return callback(err);
    });
};

/**
 * 导出周报到Excel
 * @param id
 * @param callback
 */
WeeklyDao.prototype.importData = function (id, callback) {
  var weeklyTitle, excelPath;

  readFile('./server/data/weekly/' + id, 'utf-8')
    .then(function (data) {
      var item = JSON.parse(data);
      var $ = cheerio.load(item.weeklyContent);
      var excel = [];
      excel.push(['京东金融支付产品技术部', null, null, null, null]);
      excel.push(['产品技术部-产品管理部周报', null, null, item.startDate, item.endDate]);
      excel.push([null, '本周总结', null, '下周计划', null]);
      excel.push(['概述', item.summary.week, null, item.summary.nextWeek, null]);
      excel.push(['工作进展', null, null, null, null]);
      excel.push(['分类', '本周工作内容', null, '下周计划', null]);

      var merges = [
        {s: {c: 0, r: 0}, e: {c: 4, r: 0}},
        {s: {c: 0, r: 1}, e: {c: 2, r: 1}},
        {s: {c: 1, r: 2}, e: {c: 2, r: 2}},
        {s: {c: 3, r: 2}, e: {c: 4, r: 2}},
        {s: {c: 1, r: 3}, e: {c: 2, r: 3}},
        {s: {c: 3, r: 3}, e: {c: 4, r: 3}},
        {s: {c: 0, r: 4}, e: {c: 4, r: 4}},
        {s: {c: 1, r: 5}, e: {c: 2, r: 5}},
        {s: {c: 3, r: 5}, e: {c: 4, r: 5}}
      ];

      var row = 5;
      $('table').find('tbody tr').each(function (index, item) {
        row++;
        var $item = $(item);
        var $td = $item.find('td');
        excel.push([$td.eq(0).text(), $td.eq(1).text(), null, $td.eq(2).text(), null]);
        merges.push({s: {c: 1, r: row}, e: {c: 2, r: row}}, {s: {c: 3, r: row}, e: {c: 4, r: row}});
      });

      merges.push({s: {c: 0, r: row + 1}, e: {c: 0, r: row + $('table').find('tbody tr').length}});
      $ = cheerio.load(item.weeklyFooter);
      $('table').find('tbody tr').each(function (index, item) {
        row++;
        var $item = $(item);
        var $td = $item.find('td');
        var arr = $td.map(function (index, item) {
          return $(item).text();
        }).get();
        arr.push(null);
        if (index !== 0) {
          arr.unshift(null);
        }
        excel.push(arr);
        merges.push({s: {c: 3, r: row}, e: {c: 4, r: row}});
      });

      weeklyTitle = item.weeklyTitle;
      var buffer = xlsx.genExcel([{
        name: item.weeklyTitle,
        data: excel,
        merges: merges
      }]);
      /**
       * 缺少合并单元格，和设置列宽，待完善
       * https://github.com/SheetJS/js-xlsx  ws['!merges'] 合并单元格  ws['!cols'] 设置列宽
       * 可参考这里 http://sheetjs.com/demos/table.html
       */

      excelPath = './server/data/excel/' + Uuid.raw() + '.xlsx';
      return writeFile(excelPath, buffer, 'binary');
    })
    .then(function () {
      return callback(null, excelPath, weeklyTitle);
    })
    .then(null, function (err) {
      return callback(err);
    });
};
