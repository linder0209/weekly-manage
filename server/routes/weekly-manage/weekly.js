'use strict';

var express = require('express');
var Router = express.Router;
var router = new Router();

var underscore = require('underscore');

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
    if (!underscore.isArray(ids)) {
      ids = [ids];
    }
    weeklyDao.delete(ids, function (err) {
      res.send({success: err === null});
    });
  }
};

router.get('/paging', weekly.paging);//周报分页列表
//router.get('/weekly', manage.weekly);//跳转到添加页面
router.post('/', weekly.save);//修改和保存
router.get('/:id', weekly.getWeekly);//获取一条周报
router.delete('/', weekly.deleteWeekly);//删除

/**
 * 首页路由
 * @module main
 * */
module.exports = router;
