import { ActionFunction, ActionFunctionArgs } from '@remix-run/node';

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  // property data -> server -> checks if property exists -> returns data to client
  console.log(request.body);
  // if doesn't exist -> scrape zillow -> transform data -> return to client
};
