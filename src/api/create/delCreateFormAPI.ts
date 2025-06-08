import { del } from "@/utils";
const delCreateFormAPI = (id: number|string) => {
  return del("/create-form/" + id);
};
export default delCreateFormAPI;