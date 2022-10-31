const router = require('express').Router();
const cheerio = require('cheerio');
const axios = require('../axios');
const { getText } = require('../../utils');

router.get('/txs', verification, async (req, res, next) => {
  try {
    const { a, p } = req.query;
    const r = await axios({
      url: `https://cn.etherscan.com/txs?a=${a}&p=${p || 1}`,
      method: 'get',
      Headers: {
        'User-Agent': req.get('User-Agent'),
      },
    });
    if (r.status === 200) {
      const $ = cheerio.load(r.data);
      const thead = $('#paywall_mask table thead tr th');
      const keylist = Array.from(thead).map((node) => getText($, node));

      const tbody = $('#paywall_mask table tbody tr');
      const tbodyList = Array.from(tbody);
      const valList = tbodyList.map((tr) => {
        const td = $(tr).find($('td')).not('.showDate').not('.showGasPrice');
        const tdList = Array.from(td);
        return tdList.map((node) => getText($, node));
      });

      const obj = {};
      for (const [key, val] of Object.entries(keylist)) {
        const resList = [];
        for (let i = 0; i < valList.length; i++) {
          const v = valList[i];
          resList.push(v[key]);
        }
        if (val) {
          obj[val] = resList;
        }
      }
      return res.send(JSON.stringify(obj));
    }
    next(new Error(r.message));
  } catch (error) {
    next(error);
  }
});

async function verification(req, res, next) {
  const { a } = req.query;
  if (!a) next(new Error('请输入tx hash'));
  else next();
}

module.exports = router;
module.exports.verification = verification;
