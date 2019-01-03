import Toaster from '../utils/Toaster';

export const displayError = (error) => {
  if (error.response) {
    const { data } = error.response;
    Toaster.options.timeOut = 0;
    return Toaster.error(data.message, data.status);
  }
  Toaster.error('Oops! something went wrong, please try again!', 'Failed');
};

export const reloadRoute = (history) => {
  history.push('/reload');
  history.goBack();
};