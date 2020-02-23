const { formValidated } = require('../src/js/form.validate.helper');

test('formvalidated should be false', () => {
  expect(formValidated({ amount: '' })).toBeFalsy();
  expect(formValidated({ amount: 'w' })).toBeFalsy();
  expect(formValidated({ amount: '' })).toBeFalsy();
  expect(formValidated({ amount: undefined })).toBeFalsy();
  expect(formValidated({ amount: '0.00' })).toBeFalsy();
});

test('formvalidated should be true', () => {
  expect(formValidated({ amount: '0.5' })).toBeTruthy();
  expect(formValidated({ amount: '0.90' })).toBeTruthy();
  expect(formValidated({ amount: '1' })).toBeTruthy();
  expect(formValidated({ amount: '10000.00' })).toBeTruthy();
});