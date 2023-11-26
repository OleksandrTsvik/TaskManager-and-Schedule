const errorHandlerMiddleware = (error, req, res, next) => {
  console.log(
    '[errorHandlerMiddleware]',
    `status: ${error.status};`,
    'message:',
    error.message,
  );

  let description;

  switch (error.status) {
    case 404:
      description = 'Page Not Found';
      break;
    case 500:
      description = 'Internal Server Error';
      break;
    default:
      description = 'Something went wrong';
  }

  res.render('error.hbs', {
    title: `Error ${error.status}`,
    status: error.status,
    description: error.message || description,
  });
};

module.exports = errorHandlerMiddleware;
