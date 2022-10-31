function getText($, node) {
  if ($(node).find($('#lnkAgeDateTime')).length > 0) {
    return 'Age';
  }
  if ($(node).find($('.switch-txn-fee-gas-price')).length > 0) {
    return 'Txn Fee';
  }
  return $(node).text().trim();
}

module.exports.getText = getText;
