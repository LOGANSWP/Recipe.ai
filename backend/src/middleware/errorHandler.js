import { isCelebrateError } from "celebrate";

const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (isCelebrateError(err)) {
    const joiErrorMessages = [];
    for (const [segment, joiError] of err.details.entries()) {
      joiErrorMessages.push(`Invalid ${segment} parameter: ${joiError.message}`);
    }
    return res.status(400).json({ message: joiErrorMessages.join('; ') });
  }

  if (err.name === 'MongoError' || err.name === 'MongoServerError' || err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }

  return res.status(500).json({ message: err.message });
}

export default errorHandler;
