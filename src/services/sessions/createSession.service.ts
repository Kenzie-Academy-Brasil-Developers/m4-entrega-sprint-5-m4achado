import AppDataSource from "../../data-source";
import { IUserLogin } from "../../interfaces/users.interfaces";
import User from "../../entities/user.entity";
import AppError from "../../errors/AppError";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

const createSessionService = async ({ email, password }: IUserLogin): Promise<string> => {
	const userRepository = AppDataSource.getRepository(User);

	const user = await userRepository.findOne({
		where: [
			{
				email: email,
			},
		],
		withDeleted: true,
	});

	console.log("@@@@@@@@@@@@@@@@@@", user);

	if (!user) {
		throw new AppError("User or password invalid!", 403);
	}

	if (!user.isActive) {
		throw new AppError("User is not active!", 403);
	}

	const passwordMatch = await compare(password, user.password);

	if (!passwordMatch) {
		throw new AppError("User or password invalid!", 403);
	}

	const token = jwt.sign(
		{
			isAdm: user.isAdm,
		},
		process.env.SECRET_KEY as string,
		{
			subject: String(user.id),
			expiresIn: "24h",
		}
	);

	return token;
};

export default createSessionService;
