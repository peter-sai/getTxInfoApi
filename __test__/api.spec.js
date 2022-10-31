const cheerio = require('cheerio');
const express = require('express');
const request = require('supertest');
const { getText } = require('../utils');
const { verification } = require('../api/router/api');

describe('测试getText函数', () => {
  test('测试节点内容', () => {
    const $ = cheerio.load('<div id="test">1</div>');
    expect(getText($, $('#test'))).toBe('1');
  });
  test('测试子节点ID为lnkAgeDateTime的内容', () => {
    const $ = cheerio.load('<div id="test"><span id="lnkAgeDateTime"></span></div>');
    expect(getText($, $('#test'))).toBe('Age');
  });
  test('测试子节点class为switch-txn-fee-gas-price的内容', () => {
    const $ = cheerio.load('<div id="test"><span class="switch-txn-fee-gas-price">1</span></div>');
    expect(getText($, $('#test'))).toBe('Txn Fee');
  });
});

describe('中间件verification测试', () => {
  let requestAPI = null;
  beforeAll(function () {
    const app = express();
    app.get('/abc', verification, (req, res) => {
      res.send('ok');
    });
    app.use((err, req, res) => {
      console.log('err');
      res.status(500).json({
        message: err.message,
      });
    });
    requestAPI = request(app.listen());
  });
  test('错误事例500', (done) => {
    requestAPI
      .get('/abc')
      .expect(500)
      .end(function (err) {
        if (err) {
          throw err;
        }
        done();
      });
  });
  test('正确事例200', (done) => {
    requestAPI
      .get('/abc?a=234')
      .expect(200)
      .expect('ok')
      .end(function (err) {
        if (err) {
          throw err;
        }
        done();
      });
  });
});
