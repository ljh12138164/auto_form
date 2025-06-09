import { get } from "@/utils";
const getFormAPI = async (id: string) => get(`/form/${id}`);
export default getFormAPI;