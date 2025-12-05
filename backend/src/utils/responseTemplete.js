function success(res, message, data) {
  return res.status(200).json({
    message: message || 'Success',
    data: data || null,
  });
}

function createSuccess(res, message, data) {
  return res.status(201).json({
    message: message || 'Create success',
    data: data || null,
  });
}

function deleteSuccess(res, message, data) {
  return res.status(204).json({
    message: message || 'Delete success',
    data: data || null,
  });
}

function badRequest(res, message, data) {
  return res.status(400).json({
    message: message || 'Bad request',
    data: data || null,
  });
}

function notFound(res, message, data) {
  return res.status(404).json({
    message: message || 'Not found',
    data: data || null,
  });
}

function internalError(res, message, data) {
  return res.status(500).json({
    message: message || 'Internal error',
    data: data || null,
  });
}

export {
  success,
  createSuccess,
  deleteSuccess,
  badRequest,
  notFound,
  internalError,
};
