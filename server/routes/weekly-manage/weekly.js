'use strict';

var express = require('express');
var Router = express.Router;
var router = new Router();

var _ = require('underscore');
var moment = require('moment');

var DataPage = require('../../utils/DataPage');
var weeklyDao = require('./../../dao/weekly-manage/WeeklyDao');

var weekly = {
  /**
   * 分页列表
   * @param req
   * @param res
   */
  paging: function (req, res) {
    var options = {
      itemsPerPage: req.query.itemsPerPage,
      currentPage: req.query.currentPage
    };
    var dataPage = new DataPage(options);

    weeklyDao.pagination(dataPage, function (err, data) {
      if (err) {
        res.send({success: false});
      } else {
        res.send({
          success: true,
          dataPage: data
        });
      }
    });
  },

  loadTmpl: function (req, res) {
    var creatWeekly = req.query.createWeekly;
    weeklyDao.loadTmpl(function (err, data) {
      var json = {
        success: err === null,
        weeklyContent: data.weeklyContent,
        weeklyFooter: data.weeklyFooter
      };

      if (creatWeekly === 'true') {
        var m = moment().startOf('isoWeek');
        _.extend(json, {
          startDate: m.format('YYYY年MM月DD日'),
          endDate: m.add(6, 'days').format('YYYY年MM月DD日')
        });
      }
      res.send(json);
    });
  },

  save: function (req, res) {
    var data = req.body;
    weeklyDao.save(data, function (err) {
      res.send({
        success: err === null
      });
    });
  },

  getWeekly: function (req, res) {
    var id = req.params.id;
    weeklyDao.findById(id, function (err, model) {
      if (err) {
        res.send({success: false});
      } else {
        res.send({
          success: true,
          item: model
        });
      }
    });
  },

  deleteWeekly: function (req, res) {
    var ids = req.query.ids;// ids is Array
    if (!_.isArray(ids)) {
      ids = [ids];
    }
    weeklyDao.delete(ids, function (err) {
      res.send({success: err === null});
    });
  },

  saveTmpl: function (req, res) {
    var data = req.body;
    weeklyDao.saveTmpl(data, function (err) {
      res.send({
        success: err === null
      });
    });
  },

  importData: function (req, res) {
    var id = req.params.id;
    weeklyDao.importData(id, function (err) {
      res.send({
        success: err === null
      });
    });
  }
};

router.get('/paging', weekly.paging);//周报分页列表
router.get('/tmpl', weekly.loadTmpl);//加载周报模板
router.post('/', weekly.save);//修改和保存
router.get('/:id', weekly.getWeekly);//获取一条周报
router.delete('/', weekly.deleteWeekly);//删除
router.post('/savetmpl', weekly.saveTmpl);//保存模板
router.get('/export/:id', weekly.importData);//导出Excel

/**
 * 首页路由
 * @module main
 * */
module.exports = router;
