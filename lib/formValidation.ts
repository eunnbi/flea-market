export const createErrorObject = (message: string) => ({
  isError: message === '' ? false : true,
  message,
});

export const noError = {
  isError: false,
  message: '',
};
