import { del } from "@/utils";

const delSubmitFormAPI = (ids: number[] | number) => {
  const idArray = Array.isArray(ids) ? ids : [ids];
  return del("/submit-form/", {
    params: { ids: idArray.join(",") },
  });
};
export default delSubmitFormAPI;
