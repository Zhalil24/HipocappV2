
import { BaseService } from "../../core/services/baseService";
import { UserProfileModel } from "../models/user/userDataModel";
import { BaseResponseModel } from "../models/base/baseResponseModel";

class UserService extends BaseService {
  async getProfile(id: number): Promise<BaseResponseModel<UserProfileModel>> {
    return this.get(`/api/User/GetProfile?id=${id}`);
  }
}

export default new UserService();
