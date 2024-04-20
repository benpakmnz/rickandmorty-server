import { User } from "../../models/user";
import { AuthenticatedRequest } from "../../middlewares/auth-check";

export const getIsAdmin = async (req: AuthenticatedRequest) => {
  const userId = req.userId;
  const user = await User.findById(userId);

  return user?.isAdmin ?? false;
};
