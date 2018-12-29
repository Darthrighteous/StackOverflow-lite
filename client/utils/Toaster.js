import toastr from 'toastr';

toastr.options = {
  progressBar: true,
  closeButton: true,
  preventDuplicates: true,
  maxOpened: 1,
  autoDismiss: false,
  extendedTimeout: 0,
  hideDuration: 200,
  closeDuration: 100,
  showMethod: 'slideDown',
  hideMethod: 'slideUp',
  closeMethod: 'slideUp',
  showEasing: 'linear',
  hideEasing: 'swing',
  closeEasing: 'swing',
};

const Toaster = toastr;

export default Toaster;
