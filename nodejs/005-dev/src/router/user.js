const { loginCheck } = require('../controller/user');
const { SuccessModel, ErrorModel } = require('../model/resModel');

const handleUserRouter = (req, res) => {
  const { method, url, path } = req;
  if (method === 'POST' && path === '/api/user/login') {
    const results = loginCheck(req.body);
    if (results) {
      return new SuccessModel();
    }
    return new ErrorModel('登录失败');
  }
};

module.exports = handleUserRouter;
