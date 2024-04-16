export const getFormData = async (request: Request) => {
  const clonedRequest = request.clone(); // fixes locking up the readable stream for the request object
  const formData = await clonedRequest.formData();
  return formData;
};
