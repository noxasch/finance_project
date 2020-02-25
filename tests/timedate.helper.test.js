const { toLocaleFixed, toUnixTimeStamp, compareDate, convertDate } = require('../src/js/timedate.helper');

test('toLocaleFixed', () => {
  let result = toLocaleFixed(1000);
  expect(result).toEqual('1,000.00');
  result = toLocaleFixed(1000000);
  expect(result).toEqual('1,000,000.00');
});

test('toUnixTimeStamp', () => {
  let result = toUnixTimeStamp('2020-02-10');
  expect(result).toEqual(1581292800);
});

test('convertDate', () => {
  let result = convertDate('2020-02-10');
  expect(result).toEqual('Feb 10, 2020'); // node output differently due to different ICU
});

test('compareDate', () => {
  let result = compareDate('2020-02-10', '2020-02-09');
  expect(result).toEqual(-1);
  result = compareDate('2020-02-11', '2020-02-11');
  expect(result).toEqual(0);
  result = compareDate('2020-02-09', '2020-02-12');
  expect(result).toEqual(1);
});
