import { Request, Response } from "express";
import createPropertiesService from "../services/properties/createProperties.service";
import listPropertiesService from "../services/properties/listProperties.service";

export const createPropertiesController = async (req: Request, res: Response) => {
	const {
		value,
		size,
		address: { district, zipCode, number, city, state },
		categoryId,
	} = req.body;
	const newProperty = await createPropertiesService({
		value,
		size,
		address: { district, zipCode, number, city, state },
		categoryId,
	});
	return res.status(201).json(newProperty);
};

export const listPropertiesController = async (req: Request, res: Response) => {
	const properties = await listPropertiesService();
	return res.status(200).json(properties);
};
