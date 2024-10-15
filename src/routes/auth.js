import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  loginController,
  logoutController,
  passwordResetController,
  passwordResetRequestController,
  registerController,
} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  userSignInValidationSchema,
  userSignUpValidationSchema,
} from '../validation/user-schemas.js';
import { refreshController } from '../controllers/auth.js';
import {
  passwordResetRequestValidationSchema,
  passwordResetValidationSchema,
} from '../validation/password-schemas.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(userSignUpValidationSchema),
  ctrlWrapper(registerController),
);

authRouter.post(
  '/login',
  validateBody(userSignInValidationSchema),
  ctrlWrapper(loginController),
);

authRouter.post('/refresh', ctrlWrapper(refreshController));

authRouter.post('/logout', ctrlWrapper(logoutController));

authRouter.post(
  '/send-reset-email',
  validateBody(passwordResetRequestValidationSchema),
  ctrlWrapper(passwordResetRequestController),
);

authRouter.post(
  '/reset-pwd',
  validateBody(passwordResetValidationSchema),
  ctrlWrapper(passwordResetController),
);

export default authRouter;
